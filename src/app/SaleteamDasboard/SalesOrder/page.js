"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Salesorder = () => {
  const [formData, setFormData] = useState({
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
  const [products , setProducts ] = useState([]);
  const [ selectedProducts , setSelectedProducts ] = useState(""); 

  useEffect(() => {
    const storedToken = localStorage.getItem("admintokens");
    setToken(storedToken);
 

  const fetchProducts = async() => {
    try {
      const response = await axios.get('http://localhost:5005/api-inventory/get-product')
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  fetchProducts();
},[]);

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
    updatedItems[index][field] = value;
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
      const { customerName, quoteNumber, salesOrderDate, status } = formData.salesOrderDetails;

      doc.setFontSize(14);
      doc.text("ORDER CONFIRMATION", 14, 20);
      doc.text("Loyalty Automation Pvt Ltd", 14, 30);
      doc.text("We acknowledged the reciept of your captioned order. And pleased to confirm having registered the same", 14, 40);

      doc.setFontSize(12);
      doc.text(`Customer: ${customerName}`, 14, 50);
      doc.text(`Quote Number: ${quoteNumber}`, 14, 60);
      doc.text(`Order Date: ${salesOrderDate}`, 14, 70);
      doc.text(`Status: ${status}`, 14, 80);

      const headers = [
        ["Item Name", "Quantity", "List Price", "Discount", "Tax", "Total Price"],
      ];

      const items = formData.items.map((item) => [
        item.itemName,
        item.quantity,
        item.listPrice,
        item.discount,
        item.tax,
        item.totalPrice,
      ]);

      doc.autoTable({
        startY: 90,
        head: headers,
        body: items,
      });

      doc.setFontSize(12);
      doc.text("Bank Details", 14, doc.lastAutoTable.finalY + 10);
      doc.text("Bank Name: XYZ Bank", 14, doc.lastAutoTable.finalY + 20);
      doc.text("Account Number: 123456789", 14, doc.lastAutoTable.finalY + 30);

      // Save the generated PDF
      doc.save("sales_order.pdf");
    } catch (error) {
      console.error("Error in PDF generation:", error);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg">
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
                  name={`salesOrderDetails.${field}`}
                  value={formData.salesOrderDetails[field] || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required={field !== "subject"}
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
            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <select
                  name={`items[${index}].itemName`}
                  value={item.itemName}
                  onChange={(e) => handleItemSelect(e, index)}
                  className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Item</option>
                  {products.map((product) => (
                    <option key={product._id} value={product.Model}>
                      {product.Model}
                    </option>
                  ))}
                </select>
              </div>
              {["quantity", "listPrice"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">{field}</label>
                  <input
                    type={field === "quantity" || field === "listPrice" ? "number" : "text"}
                    name={`items[${index}].${field}`}
                    value={item[field]}
                    onChange={(e) => handleNestedChange(e, index, field)}
                    className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none"
          >
            Add Another Item
          </button>
        </section>


        {/* Summary */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(formData.summary).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">{field}</label>
                <input
                  type="number"
                  name={`summary.${field}`}
                  value={formData.summary[field]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg focus:outline-none"
        >
          Create Sales Order
        </button>
      </form>

      <button
        onClick={generatePDF}
        className="mt-6 bg-green-600 text-white py-2 px-4 rounded-lg w-full focus:outline-none"
      >
        Generate PDF
      </button>
    </div>
  );
};

export default Salesorder;
