"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ChevronLeft, Plus, Save, ShoppingCart } from "lucide-react";

const PurchaseOrder = () => {
  const router = useRouter();
  const Eid = typeof window !== "undefined" ? localStorage.getItem("idstore") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("admintokens") : null;

  const [formData, setFormData] = useState({
    rows: [
      {
        hsnCode: "",
        unitDescription: "",
        uom: "",
        quantity: 0,
        unitPrice: 0,
        amount: 0,
      },
    ],
    gst: 0,
    gstAmount: 0,
    totalAmount: 0,
    payableAmount: 0,
    deliveryTerms: "",
    warrantyTerms: "",
    paymentTerms: "",
    financialYear: "",
    Address: "",
    SupplierName: "",
    RefQNo: "",
    QDate: "",
    GSTIN: "",
    Eid,
  });

  const [otherTerms, setOtherTerms] = useState({
    paymentTerms: "",
    warrantyTerms: "",
    deliveryTerms: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const calculateTotals = (products, gstValue) => {
    let totalAmount = 0;
    const gst = Number(gstValue);

    const updatedProducts = products.map((item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const amount = quantity * unitPrice;
      const gstAmount = (amount * gst) / 100;
      const rowTotal = amount + gstAmount;

      totalAmount += amount;

      return {
        ...item,
        gst,
        amount: amount.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        totalAmount: rowTotal.toFixed(2),
      };
    });

    const totalGstAmount = (totalAmount * gst) / 100;
    const payableAmount = totalAmount + totalGstAmount;

    setFormData((prev) => ({
      ...prev,
      rows: updatedProducts,
      gst,
      totalAmount: totalAmount.toFixed(2),
      gstAmount: totalGstAmount.toFixed(2),
      payableAmount: payableAmount.toFixed(2),
    }));
  };

  const handleProductChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRows = [...formData.rows];
    updatedRows[index][name] = value;

    setFormData((prev) => ({ ...prev, rows: updatedRows }));
    calculateTotals(updatedRows, formData.gst);
  };

  const handleGSTChange = (e) => {
    const gstValue = e.target.value;
    setFormData((prev) => ({ ...prev, gst: gstValue }));
    calculateTotals(formData.rows, gstValue);
  };

  const addProduct = () => {
    const newProduct = {
      hsnCode: "",
      unitDescription: "",
      uom: "",
      quantity: 0,
      unitPrice: 0,
      amount: 0,
    };
    setFormData((prev) => ({ ...prev, rows: [...prev.rows, newProduct] }));
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (value !== "Others") {
      setOtherTerms((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const financialYearPattern = /^(\d{2})-(\d{2})$/;
    if (!financialYearPattern.test(formData.financialYear)) {
      setErrorMessage("Please enter a valid financial year (e.g., 24-25).");
      setLoading(false);
      return;
    }

    if (!formData.paymentTerms || !formData.deliveryTerms || !formData.warrantyTerms) {
      setErrorMessage("All terms (Payment, Delivery, Warranty) must be filled out.");
      setLoading(false);
      return;
    }

    const finalFormData = { ...formData };

    ["paymentTerms", "warrantyTerms", "deliveryTerms"].forEach((term) => {
      if (formData[term] === "Others") {
        finalFormData[term] = otherTerms[term] || "Others";
      }
    });

    try {
      await axios.post("http://localhost:5005/api-purchaseorder/create-PO", finalFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Purchase Order submitted successfully!");
      router.push(`/SaleteamDasboard/Poppdf?Eid=${formData.Eid}`);

      // Reset form
      setFormData({
        rows: [
          {
            hsnCode: "",
            unitDescription: "",
            uom: "",
            quantity: 0,
            unitPrice: 0,
            amount: 0,
          },
        ],
        gst: 0,
        gstAmount: 0,
        totalAmount: 0,
        payableAmount: 0,
        deliveryTerms: "",
        warrantyTerms: "",
        paymentTerms: "",
        financialYear: "",
        Address: "",
        SupplierName: "",
        RefQNo: "",
        QDate: "",
        GSTIN: "",
        Eid,
      });

      setOtherTerms({
        paymentTerms: "",
        warrantyTerms: "",
        deliveryTerms: "",
      });

    } catch (err) {
      console.error("Error submitting:", err);
      setErrorMessage("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push('/SaleteamDasboard/Inventory')}
          className="p-2 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <ShoppingCart className="mr-2" size={24} />
          Create Purchase Order
        </h1>
        <div className="w-8" />
      </div>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 border border-red-300">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {["HSN Code", "UnitDescription","Description", "UOM", "Qty", "Unit Price", "Amount"].map((title) => (
                  <th key={title} className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.rows.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {["hsnCode", "unitDescription","Description", "uom", "quantity", "unitPrice", "amount"].map((field) => (
                    <td key={field} className="p-3 text-sm">
                      <input
                        type={["quantity", "unitPrice"].includes(field) ? "number" : "text"}
                        name={field}
                        value={product[field]}
                        onChange={(e) => handleProductChange(e, index)}
                        readOnly={field === "amount"}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={field}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addProduct}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["paymentTerms", "warrantyTerms", "deliveryTerms"].map((term) => (
            <div key={term} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {term.replace("Terms", " Terms")}
              </label>
              <select
                value={formData[term]}
                onChange={(e) => handleSelectChange(e, term)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select option</option>
                <option value="100% against proforma Invoice">100% against proforma Invoice</option>
                <option value="100% against delivery">100% against delivery</option>
                <option value="30 days PDC">30 days PDC</option>
                <option value="50% advance & 50% against delivery">50% advance & 50% against delivery</option>
                <option value="Others">Others</option>
              </select>

              {formData[term] === "Others" && (
                <input
                  type="text"
                  placeholder="Please specify"
                  value={otherTerms[term]}
                  onChange={(e) =>
                    setOtherTerms((prev) => ({ ...prev, [term]: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Financial Year</label>
              <input
                type="text"
                name="financialYear"
                value={formData.financialYear}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., 24-25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GST (%)</label>
              <input
                type="number"
                value={formData.gst}
                onChange={handleGSTChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter GST percentage"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-medium text-gray-700 border-b pb-2">Order Summary</h3>
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span>₹ {formData.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Amount</span>
              <span>₹ {formData.gstAmount}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total Payable</span>
              <span>₹ {formData.payableAmount}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label>Address Details</label>
            <textarea
              name="Address"
              value={formData.Address}
              onChange={handleInputChange}
              className="w-full p-3 border border-black rounded-md"
            />
          </div>
          <div>
            <label>Customer Name</label>
            <input
              type="text"
              name="SupplierName"
              value={formData.SupplierName}
              onChange={handleInputChange}
              className="w-full p-3 border border-black rounded-md"
            />
          </div>
          <div>
            <label>GSTIN/UIN</label>
            <input
              type="text"
              name="GSTIN"
              value={formData.GSTIN}
              onChange={handleInputChange}
              className="w-full p-3 border border-black rounded-md"
            />
          </div>
          <div>
            <label>RefQNo</label>
            <input
              type="text"
              name="RefQNo"
              value={formData.RefQNo}
              onChange={handleInputChange}
              className="w-full p-3 border border-black rounded-md"
            />
          </div>
          <div>
            <label>QDate</label>
            <input
              type="date"
              name="QDate"
              value={formData.QDate}
              onChange={handleInputChange}
              className="w-full p-3 border border-black rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Save size={20} className="mr-2" />
              Submit Purchase Order
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default PurchaseOrder;
