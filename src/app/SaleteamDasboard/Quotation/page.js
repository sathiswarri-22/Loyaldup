"use client"
import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";

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
  const [daysForPayment, setDaysForPayment] = useState(30); // Days for payment
  const [daysForValidity, setDaysForValidity] = useState(30); // Days for quote validity
  const [isFormFilled, setIsFormFilled] = useState(false);

  // Handle input change for the table
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
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    try {
      // Fetch the base Offer Format PDF
      const offerFormatResponse = await fetch("/Offer Format.pdf");
      const offerFormatArrayBuffer = await offerFormatResponse.arrayBuffer();
      const offerFormatPdf = await PDFDocument.load(offerFormatArrayBuffer);

      // Copy pages from the Offer Format PDF
      const copiedPages = await pdfDoc.copyPages(offerFormatPdf, offerFormatPdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));

      // Embed Helvetica font (you can also use any other fonts by embedding them)
      const font = await pdfDoc.embedFont("Helvetica");

      // Draw the product details table onto the new PDF
      const page = pdfDoc.getPages()[1]; // Work with the second page, where we want the table
      const { width, height } = page.getSize();
      const margin = 30;
      const rowHeight = 20; // Make rows bigger for better readability
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
      const colWidths = [40, 80, 100, 80, 80, 100, 100]; // Increase column widths

      let currentY = height - 500; // Start drawing the table near the bottom of the second page

      // Draw table headers
      tableColumn.forEach((header, index) => {
        page.drawText(header, {
          x: margin + colWidths.slice(0, index).reduce((sum, width) => sum + width, 0),
          y: currentY,
          size: 12, // Increase the font size for headers
          font,
        });
      });

      currentY -= rowHeight; // Move down after drawing the headers

      // Draw table rows
      tableRows.forEach((row) => {
        row.forEach((cell, index) => {
          page.drawText(cell, {
            x: margin + colWidths.slice(0, index).reduce((sum, width) => sum + width, 0),
            y: currentY,
            size: 11, // Increase the font size for the content
            font,
          });
        });
        currentY -= rowHeight;
      });

      // Draw total
      const totalPrice = calculateTotalPrice();
      page.drawText(`Total: Rs. ${totalPrice}`, {
        x: margin + colWidths.slice(0, 6).reduce((sum, width) => sum + width, -40),
        y: currentY - 30,
        size: 12,
        font,
      });

      // Add Terms and Conditions section below the table
      currentY -= 40; // Adjust position for Terms and Conditions
      const termsText = `Terms and Conditions:\n1. All payments are due within ${daysForPayment} days.\n2. Prices are exclusive of taxes.\n3. Delivery charges will be added as applicable.\n4. This quote is valid for ${daysForValidity} days from the date of issue.`;
      page.drawText(termsText, {
        x: margin,
        y: currentY,
        size: 10,
        font,
      });

      // Save the final PDF
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
          <h3 className="text-xl font-semibold text-gray-700">Add Product Details</h3>
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
              {/* First term with dropdown for days */}
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

              {/* Second term */}
              <div>Prices are exclusive of taxes.</div>

              {/* Third term */}
              <div>Delivery charges will be added as applicable.</div>

              {/* Fourth term with dropdown for days */}
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
            onClick={handleConvertToPDF}
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
