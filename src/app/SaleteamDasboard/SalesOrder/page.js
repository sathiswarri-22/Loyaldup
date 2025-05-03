"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable"; // Explicitly import autoTable

const Salesorder = () => {
  const Eid = localStorage.getItem('idstore');
  const [formData, setFormData] = useState({
    Eid,
    salesOrderDetails: {
      customerName: "",
      quoteNumber: "",
      subject: "",
      salesOrderDate: "",
      status: "Pending",
      assignedTo: "",
      poNumber: "",
      poDate: "",
      paymentTerms: "",
    },
    termsAndConditions: {
      text: "",
    },
    items: [
      {
        itemName: "",
        quantity: 0,
        listPrice: 0,
        discount: 0,
        tax: 0,
        totalPrice: 0,
      },
    ],
    summary: {
      itemsTotal: 0,
      discountTotal: 0,
      shippingHandling: 0,
      preTaxTotal: 0,
      taxesForShipping: 0,
      transitInsurance: 0,
      installationCharges: 0,
      taxForInstallation: 0,
      adjustments: 0,
      grandTotal: 0,
    },
  });

  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("admintokens");
    setToken(storedToken);

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api-inventory/get-product');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split("."); // Split to handle nested fields

    if (section === "salesOrderDetails") {
      setFormData((prevData) => ({
        ...prevData,
        salesOrderDetails: {
          ...prevData.salesOrderDetails,
          [field]: value, // Update the specific field
        },
      }));
    } else if (section === "summary") {
      setFormData((prevData) => ({
        ...prevData,
        summary: {
          ...prevData.summary,
          [field]: value,
        },
      }));
    } else if (section === "termsAndConditions") {
      setFormData((prevData) => ({
        ...prevData,
        termsAndConditions: {
          ...prevData.termsAndConditions,
          [field]: value, // Update the text field
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleNestedChange = (e, index, field) => {
    const { value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][field] = parseFloat(value) || 0; // Ensure that the value is a number
    
    // Automatically calculate the total price whenever a field changes
    if (field === "quantity" || field === "listPrice" || field === "discount" || field === "tax") {
      const { quantity, listPrice, discount, tax } = updatedItems[index];
      
      // Calculate total price (you can add more factors if needed)
      const totalPrice = (quantity * listPrice) - discount + tax;
      updatedItems[index].totalPrice = totalPrice;
    }

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          itemName: "",
          quantity: 0,
          listPrice: 0,
          discount: 0,
          tax: 0,
          totalPrice: 0,
        },
      ],
    });
  };

  const handleItemSelect = (e, index) => {
    const itemName = e.target.value;

    const selectedProduct = products.find(product => product.Model === itemName);

    const updatedItems = [...formData.items];
    if (selectedProduct) {
      updatedItems[index] = {
        ...updatedItems[index],
        itemName: selectedProduct.Model,
        listPrice: selectedProduct.price, // You can also set other details like price or description here
      };
    }
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5005/api-salesorder/create-salesorder",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Sales Order Created Successfully!");
      setFormData({
        Eid:'',
        salesOrderDetails: {
          customerName: "",
          quoteNumber: "",
          subject: "",
          salesOrderDate: "",
          status: "Pending",
          assignedTo: "",
          poNumber: "",
          poDate: "",
          paymentTerms: "",
        },
        termsAndConditions: {
          text: "",
        },
        items: [
          {
            itemName: "",
            quantity: 0,
            listPrice: 0,
            discount: 0,
            tax: 0,
            totalPrice: 0,
          },
        ],
        summary: {
          itemsTotal: 0,
          discountTotal: 0,
          shippingHandling: 0,
          preTaxTotal: 0,
          taxesForShipping: 0,
          transitInsurance: 0,
          installationCharges: 0,
          taxForInstallation: 0,
          adjustments: 0,
          grandTotal: 0,
        },
      });
    } catch (error) {
      console.error("Error creating sales order:", error);
      alert("Failed to create sales order.");
    }
  };

  const generatePDF = () => {
    try {
      console.log("Generating PDF with data:", formData);
  
      const doc = new jsPDF();
      const {
        customerName,
        quoteNumber,
        subject,
        salesOrderDate,
        status,
        assignedTo,
        poNumber,
        poDate,
        paymentTerms
      } = formData.salesOrderDetails;
  
      // Color scheme
      const primaryColor = "#4f46e5";
      const secondaryColor = "#64748b";
      const lightGray = "#f1f5f9";
  
      // Page margins
      const marginX = 14;
      const contentWidth = 182; // 210 - 2*14
  
      // --- Header ---
      doc.setFillColor(primaryColor);
      doc.rect(0, 0, 210, 30, 'F');
  
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("SALES ORDER", marginX, 20);
  
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Loyalty Automation Pvt Ltd", 210 - marginX, 10, { align: "right" });
      doc.text("No.27/1 Vaigai Colony", 210 - marginX, 14, { align: "right" });
      doc.text("2nd Street, 12th Ave, Ashok Nagar", 210 - marginX, 18, { align: "right" });
      doc.text("Chennai - 600083", 210 - marginX, 22, { align: "right" });
      doc.text("loyaltyautomation@gmail.com", 210 - marginX, 26, { align: "right" });
  
      // --- Order Info Section ---
      let y = 40;
      doc.setFillColor(lightGray);
      doc.roundedRect(marginX, y, contentWidth, 40, 2, 2, 'F');
  
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("ORDER INFORMATION", marginX + 2, y + 8);
  
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
  
      y += 16;
      doc.text(`Customer: ${customerName || 'N/A'}`, marginX + 2, y);
      doc.text(`Quote #: ${quoteNumber || 'N/A'}`, marginX + 2, y + 6);
      doc.text(`Subject: ${subject || 'N/A'}`, marginX + 2, y + 12);
      doc.text(`Order Date: ${salesOrderDate || 'N/A'}`, marginX + 2, y + 18);
  
      doc.text(`Status: ${status || 'N/A'}`, 120, y);
      doc.text(`PO Number: ${poNumber || 'N/A'}`, 120, y + 6);
      doc.text(`PO Date: ${poDate || 'N/A'}`, 120, y + 12);
      doc.text(`Payment Terms: ${paymentTerms || 'N/A'}`, 120, y + 18);
  
      // --- Items Table ---
      if (formData.items && formData.items.length > 0) {
        const headers = [["Item", "Qty", "Unit Price", "Discount", "Tax", "Total"]];
        const items = formData.items.map(item => [
          item.itemName || 'N/A',
          item.quantity || 0,
          `Rs. ${item.listPrice.toFixed(2)}`,
          `Rs. ${item.discount.toFixed(2)}`,
          `Rs. ${item.tax.toFixed(2)}`,
          `Rs. ${item.totalPrice.toFixed(2)}`
        ]);
  
        autoTable(doc, {
          startY: y + 42,
          head: headers,
          body: items,
          theme: 'grid',
          headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontSize: 9,
            fontStyle: 'bold'
          },
          bodyStyles: {
            fontSize: 9,
            textColor: 30
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          },
          styles: {
            cellPadding: 3
          },
          columnStyles: {
            0: { cellWidth: 60 },
            5: { halign: 'right' }
          }
        });
  
        // --- Summary ---
        const {
          itemsTotal,
          discountTotal,
          shippingHandling,
          preTaxTotal,
          taxesForShipping,
          grandTotal
        } = formData.summary;
  
        const yPos = doc.lastAutoTable.finalY + 10;
  
        doc.setFillColor(lightGray);
        doc.roundedRect(120, yPos, 76, 42, 2, 2, 'F');
  
        const labels = [
          "Subtotal:",
          "Discount:",
          "Shipping & Handling:",
          "Pre-tax Total:",
          "Tax:"
        ];
  
        const values = [
          itemsTotal,
          discountTotal,
          shippingHandling,
          preTaxTotal,
          taxesForShipping
        ];
  
        doc.setFontSize(9);
        doc.setTextColor(secondaryColor);
  
        labels.forEach((label, idx) => {
          doc.text(label, 124, yPos + 8 + idx * 8);
          doc.text(`Rs. ${parseFloat(values[idx]).toFixed(2)}`, 192, yPos + 8 + idx * 8, { align: "right" });
        });
  
        // Grand Total
        doc.setDrawColor(primaryColor);
        doc.line(124, yPos + 41, 196, yPos + 41);
  
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor);
        doc.text("GRAND TOTAL:", 124, yPos + 49);
        doc.text(`Rs. ${parseFloat(grandTotal).toFixed(2)}`, 192, yPos + 49, { align: "right" });
  
        // --- Terms ---
        const termsY = yPos + 65;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("Terms & Conditions", marginX, termsY);
  
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(secondaryColor);
        const termsText = formData.termsAndConditions.text || 
          "Standard terms apply. Items are subject to availability. Payment due as per agreement.";
        const splitTerms = doc.splitTextToSize(termsText, 180);
        doc.text(splitTerms, marginX, termsY + 6);
      } else {
        doc.text("No items available for the order.", marginX, 90);
      }
  
      // --- Footer ---
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(primaryColor);
        doc.line(marginX, 280, 210 - marginX, 280);
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor);
        doc.text("Thank you for your business", marginX, 287);
        doc.text(`Page ${i} of ${pageCount}`, 210 - marginX, 287, { align: "right" });
      }
  
      doc.save("sales_order.pdf");
  
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF.");
    }
  };
  

  const handleBackClick = () => {
    router.push('/SaleteamDasboard/CustomerConverted');
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg">
      <button onClick={handleBackClick} className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  Back
</button>
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">Create Sales Order</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sales Order Details */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Sales Order Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "customerName",
              "quoteNumber",
              "subject",
              "salesOrderDate",
              "status",
              "assignedTo",
              "poNumber",
              "poDate",
              "paymentTerms",
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">{field}</label>
                <input
                  type={field === "salesOrderDate" || field === "poDate" ? "date" : "text"}
                  name={`salesOrderDetails.Rs.{field}`}
                  value={formData.salesOrderDetails[field] || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md shadow-sm"
                  required
                />
              </div>
            ))}
          </div>
        </section>

        {/* Terms and Conditions */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Terms and Conditions</h3>
          <textarea
            name="termsAndConditions.text"
            value={formData.termsAndConditions.text}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            rows="5"
            placeholder="Enter Terms and Conditions"
          />
        </section>


        {/* Items */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <select
                  className="mt-1 block w-full p-2 border rounded-md"
                  value={item.itemName}
                  onChange={(e) => handleItemSelect(e, index)}
                >
                  <option value="">Select Item</option>
                  {products.map((product, i) => (
                    <option key={i} value={product.Model}>
                      {product.Model}
                    </option>
                  ))}
                </select>
              </div>
              {["quantity", "listPrice", "totalPrice"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">{field}</label>
                  <input
                    type="number"
                    name={`item[Rs.{index}].Rs.{field}`}
                    value={item[field]}
                    onChange={(e) => handleNestedChange(e, index, field)}
                    className="mt-1 block w-full p-2 border rounded-md"
                    required
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            Add Item
          </button>
        </section>

        {/* Summary */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Summary</h3>
          {["itemsTotal", "discountTotal", "shippingHandling", "preTaxTotal", "taxesForShipping", "transitInsurance", "installationCharges", "taxForInstallation", "adjustments", "grandTotal"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">{field}</label>
              <input
                type="number"
                name={`summary.Rs.{field}`}
                value={formData.summary[field]}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
              />
            </div>
          ))}
        </section>

        
        {/* Submit Button */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="py-2 px-4 bg-indigo-600 text-white rounded-md"
          >
            Create Sales Order
          </button>
          <button
            type="button"
            onClick={generatePDF}
            className="py-2 px-4 bg-green-600 text-white rounded-md"
          >
            Generate PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default Salesorder;