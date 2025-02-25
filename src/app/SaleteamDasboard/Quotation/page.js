"use client"
import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import axios from "axios";
import { useSearchParams } from 'next/navigation';

const QuotationWithMerge = () => {
  const [rows, setRows] = useState([
    {
      sno: "",
      hsnCode: "",
      unitDescription: "",
      uom: "",
      quantity: "",
      unitPrice: "",
      total: "",
    },
  ]);

  const searchParams = useSearchParams();
  const enqid = searchParams.get('EnquiryNo'); // Fetch Enquiry ID directly from query params

  const [daysForPayment, setDaysForPayment] = useState(30);
  const [daysForValidity, setDaysForValidity] = useState(30);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGeneratepdf = async () => {
    setLoading(true);
  
    // Make sure enqid is available before proceeding
    if (!enqid) {
      console.error("Enquiry ID is missing");
      setLoading(false);
      return;
    }
  
    // Fetch enquiries from localStorage
    const enquiries = JSON.parse(localStorage.getItem('enquiries')) || [];
  
    // Update the status of the specific enquiry without removing it
    const updatedEnquiries = enquiries.map((enquiry) => {
      if (enquiry.EnquiryNo === enqid) {
        return {
          ...enquiry,
          status: 'Enquiry-3stage'  // Update status
        };
      }
      return enquiry;
    });
  
    // Save the updated enquiries back to localStorage
    localStorage.setItem('enquiries', JSON.stringify(updatedEnquiries));
  
    console.log('Sending data to the API:', {
      EnquiryNo: enqid,
      status: 'Enquiry-3stage',
    });
  
    const Token = localStorage.getItem('admintokens')
  
    try {
      const response = await axios.put('http://localhost:5005/api/quotation', {
        EnquiryNo: enqid,
        status: 'Enquiry-3stage',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        },
      });
      
      // Handle the response
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message || 'Something went wrong');
        });
      }
  
      const data = await response.json();
      console.log('Success:', data); // Handle success response
  
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error); // This will log the error message from the server
    }
    
    setLoading(false);
  
  
  };
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;

    if (name === "quantity" || name === "unitPrice") {
      const quantity = parseFloat(updatedRows[index].quantity) || 0;
      const unitPrice = parseFloat(updatedRows[index].unitPrice) || 0;
      updatedRows[index].total = (quantity * unitPrice).toFixed(2);
    }

    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        sno: "",
        hsnCode: "",
        unitDescription: "",
        uom: "",
        quantity: "",
        unitPrice: "",
        total: "",
      },
    ]);
  };

  const calculateTotalPrice = () => {
    return rows.reduce((acc, row) => acc + (parseFloat(row.total) || 0), 0).toFixed(2);
  };

  useEffect(() => {
    const isFilled = rows.every((row) => Object.values(row).every((value) => value !== ""));
    setIsFormFilled(isFilled);
  }, [rows]);

  const handleTermsChange = (e, type) => {
    if (type === "payment") {
      setDaysForPayment(e.target.value);
    } else if (type === "validity") {
      setDaysForValidity(e.target.value);
    }
  };

  const handleConvertToPDF = async () => {
    const pdfDoc = await PDFDocument.create();

    try {
      const offerFormatResponse = await fetch("/Offer Format.pdf");
      const offerFormatArrayBuffer = await offerFormatResponse.arrayBuffer();
      const offerFormatPdf = await PDFDocument.load(offerFormatArrayBuffer);

      const copiedPages = await pdfDoc.copyPages(offerFormatPdf, offerFormatPdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));

      const font = await pdfDoc.embedFont("Helvetica");
      const page = pdfDoc.getPages()[1]; 
      const { width, height } = page.getSize();
      const margin = 30;
      const rowHeight = 20;
  
      let currentY = height - 450;
  
      page.drawText('Loyalty Automation Pvt Ltd', {
        x: margin,
        y: currentY,
        size: 18,
        font,
        color: rgb(0, 0, 0), 
      });

      currentY -= 20;
  
      page.drawText('Technocommercial Offer', {
        x: margin,
        y: currentY,
        size: 14,
        font,
        color: rgb(0, 0, 0),
      });

      currentY -= 20;

      page.drawText('Our Ref No: ', {
        x: margin,
        y: currentY,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      currentY -= 20;
  
      page.drawText('Your Reference: ', {
        x: margin,
        y: currentY,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
  
      currentY -= 20;
  
      page.drawText('Consignee Date: ', {
        x: margin,
        y: currentY,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      currentY -= 40; 

      const tableColumn = ["S. No", "HSN Code", "Unit Description", "UOM", "Quantity", "Unit Price", "Total"];
      const tableRows = rows.map((row) => [
        row.sno,
        row.hsnCode,
        row.unitDescription,
        row.uom,
        row.quantity,
        row.unitPrice,
        row.total,
      ]);
      const colWidths = [40, 80, 100, 80, 80, 100, 100];

      currentY = height - 600;

      tableColumn.forEach((header, index) => {
        page.drawText(header, {
          x: margin + colWidths.slice(0, index).reduce((sum, width) => sum + width, 0),
          y: currentY,
          size: 12,
          font,
        });
      });

      currentY -= rowHeight;

      tableRows.forEach((row) => {
        row.forEach((cell, index) => {
          page.drawText(cell, {
            x: margin + colWidths.slice(0, index).reduce((sum, width) => sum + width, 0),
            y: currentY,
            size: 11,
            font,
          });
        });
        currentY -= rowHeight;
      });

      const totalPrice = calculateTotalPrice();
      page.drawText(`Total: Rs. ${totalPrice}`, {
        x: margin + colWidths.slice(0, 6).reduce((sum, width) => sum + width, -40),
        y: currentY - 30,
        size: 12,
        font,
      });

      currentY -= 40; 
      const termsText = `Terms and Conditions:\n1. All payments are due within ${daysForPayment} days.\n2. Prices are exclusive of taxes.\n3. Delivery charges will be added as applicable.\n4. This quote is valid for ${daysForValidity} days from the date of issue.`;
      page.drawText(termsText, {
        x: margin,
        y: currentY,
        size: 10,
        font,
      });

      const mergedPdfBytes = await pdfDoc.save();
      const mergedPdfUrl = URL.createObjectURL(new Blob([mergedPdfBytes]));
      const link = document.createElement("a");
      link.href = mergedPdfUrl;
      link.download = "Quotation_with_Offer_Format.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">Quotation Form</h2>

        {/* Table Form */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-700">Add Product Details {enqid}</h3>
          {["sno", "hsnCode", "unitDescription", "uom", "quantity", "unitPrice"].map((field, index) => (
            <div key={index} className="flex items-center space-x-4">
              <label className="block w-1/4">{`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}</label>
              <input
                type={field === "quantity" || field === "unitPrice" ? "number" : "text"}
                name={field}
                value={rows[rows.length - 1][field]}
                onChange={(e) => handleInputChange(e, rows.length - 1)}
                className="w-3/4 p-3 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
          <button
            onClick={handleAddRow}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            Add Product
          </button>

          {/* Terms and Conditions */}
          <div className="mt-6">
            <label className="block text-gray-700 text-lg mb-2">Terms and Conditions</label>
            <div className="space-y-4">
              <div>
                <label>All payments are due within</label>
                <select
                  value={daysForPayment}
                  onChange={(e) => handleTermsChange(e, "payment")}
                  className="ml-2 p-2 border rounded"
                >
                  {[30, 60, 90, 120].map((dayOption) => (
                    <option key={dayOption} value={dayOption}>
                      {dayOption} days
                    </option>
                  ))}
                </select>
              </div>
              <div>Prices are exclusive of taxes.</div>
              <div>Delivery charges will be added as applicable.</div>
              <div>
                <label>This quote is valid for</label>
                <select
                  value={daysForValidity}
                  onChange={(e) => handleTermsChange(e, "validity")}
                  className="ml-2 p-2 border rounded"
                >
                  {[30, 60, 90, 120].map((dayOption) => (
                    <option key={dayOption} value={dayOption}>
                      {dayOption} days
                    </option>
                  ))}
                </select>
                <label> from the date of issue.</label>
              </div>
            </div>
          </div>

          {/* Table Display */}
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3">S. No</th>
                  <th className="px-6 py-3">HSN Code</th>
                  <th className="px-6 py-3">Unit Description</th>
                  <th className="px-6 py-3">UOM</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Unit Price</th>
                  <th className="px-6 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-6 py-3">{row.sno}</td>
                    <td className="px-6 py-3">{row.hsnCode}</td>
                    <td className="px-6 py-3">{row.unitDescription}</td>
                    <td className="px-6 py-3">{row.uom}</td>
                    <td className="px-6 py-3">{row.quantity}</td>
                    <td className="px-6 py-3">{row.unitPrice}</td>
                    <td className="px-6 py-3">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Price */}
          <div className="mt-4 text-right font-semibold text-xl">
            Total: Rs. {calculateTotalPrice()}
          </div>

          {/* Generate PDF Button */}
          <button
            onClick={() => {
              handleConvertToPDF();
              handleGeneratepdf();
            }}
            disabled={!isFormFilled}
            className={`px-6 py-2 mt-6 ${!isFormFilled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"} text-white rounded-lg hover:bg-green-700 transition duration-300`}
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationWithMerge;
