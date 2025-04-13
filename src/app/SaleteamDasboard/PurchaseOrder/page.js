"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const PurchaseOrder = () => {
  const searchParams = useSearchParams();
  const EnquiryNo = searchParams.get("EnquiryNo");
  const Eid = typeof window !== "undefined" ? localStorage.getItem("idstore") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("admintokens") : null;
  const router = useRouter();

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
    EnquiryNo,
    Eid,
  });

  const [popup, setPopup] = useState(false);
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
    const newRows = [...formData.rows, newProduct];
    setFormData((prev) => ({ ...prev, rows: newRows }));
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!formData.paymentTerms || !formData.deliveryTerms || !formData.warrantyTerms) {
      setErrorMessage("All terms (Payment, Delivery, Warranty) must be filled out.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5005/api-purchaseorder/create-PO", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Purchase Order submitted successfully!");

      // Navigate to the Poppdf page and pass EnquiryNo as a query parameter
      router.push(`/SaleteamDasboard/Poppdf?EnquiryNo=${formData.EnquiryNo}&Eid=${formData.Eid}`);


      // Reset form data after successful submission
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
        EnquiryNo,
        Eid,
      });
    } catch (err) {
      console.error("Error submitting:", err);
      setErrorMessage("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Purchase Order</h1>
      {errorMessage && (
        <div className="bg-red-100 p-4 mb-4 text-red-700 rounded-md">{errorMessage}</div>
      )}
      {loading && <div className="text-center mb-4">Loading...</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              {["HSN Code", "Description", "UOM", "Qty", "Unit Price", "Amount"].map((title) => (
                <th key={title} className="border p-2">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formData.rows.map((product, index) => (
              <tr key={index}>
                {["hsnCode", "unitDescription", "uom", "quantity", "unitPrice", "amount"].map((field) => (
                  <td key={field} className="border p-2">
                    <input
                      type={["quantity", "unitPrice"].includes(field) ? "number" : "text"}
                      name={field}
                      value={product[field]}
                      onChange={(e) => handleProductChange(e, index)}
                      className="w-full p-1 border rounded"
                      readOnly={field === "amount"}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" onClick={addProduct} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
          Add Product
        </button>

        {["paymentTerms", "warrantyTerms", "deliveryTerms"].map((term) => (
          <div key={term}>
            <label className="block font-medium capitalize">{term.replace("Terms", " Terms")}</label>
            <select
              value={formData[term]}
              onChange={(e) => handleSelectChange(e, term)}
              className="border p-2 rounded w-full"
            >
              <option value="">Select option</option>
              <option value="100% against proforma Invoice">100% against proforma Invoice</option>
              <option value="100% against delivery">100% against delivery</option>
              <option value="30 days PDC">30 days PDC</option>
              <option value="50% advance & 50% against delivery">50% advance & 50% against delivery</option>
              <option value="Others">Others</option>
            </select>
          </div>
        ))}

        <div>
          <label>GST (%)</label>
          <input
            type="number"
            value={formData.gst}
            onChange={handleGSTChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>GST Amount</label>
          <input
            type="number"
            value={formData.gstAmount}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label>Total Amount</label>
            <input
              type="number"
              value={formData.totalAmount}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label>Total Payable</label>
            <input
              type="number"
              value={formData.payableAmount}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Purchase Order"}
        </button>
      </form>
    </div>
  );
};

export default PurchaseOrder;
