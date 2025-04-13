"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable"; // Explicitly import autoTable

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
      doc.text("We acknowledge the receipt of your captioned order and are pleased to confirm having registered the same.", 14, 40);

      doc.setFontSize(12);
      doc.text(`Customer: ${customerName || 'N/A'}`, 14, 50);
      doc.text(`Quote Number: ${quoteNumber || 'N/A'}`, 14, 60);
      doc.text(`Order Date: ${salesOrderDate || 'N/A'}`, 14, 70);
      doc.text(`Status: ${status || 'N/A'}`, 14, 80);

      // Check if there are items to display in the table
      if (formData.items && formData.items.length > 0) {
        const headers = [
          ["Item Name", "Quantity", "List Price", "Discount", "Tax", "Total Price"]
        ];

        const items = formData.items.map((item) => [
          item.itemName || 'N/A',
          item.quantity || 0,
          item.listPrice || 0,
          item.discount || 0,
          item.tax || 0,
          item.totalPrice || 0,
        ]);

        // Using autoTable explicitly now
        autoTable(doc, {
          startY: 90,
          head: headers,
          body: items,
        });
      } else {
        doc.text("No items available for the order.", 14, 90);
      }

      // Add summary if available
      const { grandTotal } = formData.summary;
      if (grandTotal) {
        doc.setFontSize(12);
        doc.text(`Grand Total: ${grandTotal || 'N/A'}`, 14, doc.lastAutoTable.finalY + 10);
      }

      // Bank Details (Ensure the fields are available and set correctly)
      doc.setFontSize(12);
      doc.text("Bank Details", 14, doc.lastAutoTable.finalY + 20);
      doc.text("Bank Name: XYZ Bank", 14, doc.lastAutoTable.finalY + 30);
      doc.text("Account Number: 123456789", 14, doc.lastAutoTable.finalY + 40);

      // Save the generated PDF
      doc.save("sales_order.pdf");

    } catch (error) {
      console.error("Error in PDF generation:", error);
      alert("Failed to generate PDF.");
    }
  };

  const handleBackClick = () => {
    router.push('/SaleteamDasboard/Dasboard');
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg">
      <button onClick={handleBackClick}>
        <ChevronLeft size={24} />
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
                  name={`salesOrderDetails.${field}`}
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
                    name={`item[${index}].${field}`}
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
                name={`summary.${field}`}
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
