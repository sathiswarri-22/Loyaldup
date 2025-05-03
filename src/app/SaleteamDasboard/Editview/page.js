"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditPOPage() {
  const searchParams = useSearchParams();
  const poNumber = searchParams.get("poNumber");
  const router = useRouter();
  const [poData, setPoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const Eid = typeof window !== "undefined" ? localStorage.getItem("idstore") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("admintokens") : null;

  useEffect(() => {
    const fetchPO = async () => {
      if (!poNumber || !token) return;

      try {
        const res = await axios.get(
          `http://localhost:5005/api-purchaseorder/POGetAllPOfull?poNumber=${encodeURIComponent(poNumber)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPoData(res.data);
      } catch (err) {
        console.error("❌ Error fetching PO:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPO();
  }, [poNumber, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...poData.rows];
    updatedRows[index][field] = value;

    const quantity = parseFloat(updatedRows[index].quantity) || 0;
    const unitPrice = parseFloat(updatedRows[index].unitPrice) || 0;

    updatedRows[index].amount = quantity * unitPrice;

    setPoData({ ...poData, rows: updatedRows });
  };

  const handleAddProduct = () => {
    setPoData((prev) => ({
      ...prev,
      rows: [
        ...prev.rows,
        {
          hsnCode: "",
          unitDescription: "",
          uom: "",
          quantity: 0,
          unitPrice: 0,
          amount: 0,
        },
      ],
    }));
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...poData,
        Eid,
      };

      const res = await axios.put(
        `http://localhost:5005/api-purchaseorder/updatePO?poNumber=${encodeURIComponent(poNumber)}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`✅ New PO created: ${res.data.newPoNumber}`);
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Error updating PO:", err);
      alert("Error updating PO");
    }
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  if (loading) return <p>Loading Purchase Order...</p>;
  if (!poData) return <p>No Purchase Order found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200 shadow-lg rounded-xl">
      <button
          onClick={() => router.push("/SaleteamDasboard/GetPO")}
          className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
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
    <h2 className="text-3xl font-semibold text-center text-indigo-800 mb-6">
      Purchase Order Details: {poNumber}
    </h2>
  
    <div className="flex justify-end mb-6">
      <button
        onClick={toggleEditMode}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
      >
        {isEditing ? "Cancel Edit" : "Edit PO"}
      </button>
    </div>
  
    {/* Editable Fields */}
    <div className="space-y-6">
      {/* General Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Supplier Name", name: "SupplierName", type: "text" },
          { label: "Financial Year", name: "financialYear", type: "text", readOnly: true },
          { label: "Address", name: "Address", type: "textarea" },
          { label: "Ref Quote No", name: "RefQNo", type: "text" },
          { label: "GSTIN", name: "GSTIN", type: "text" },
          { label: "Quote Date", name: "QDate", type: "date" },
        ].map(({ label, name, type, readOnly = false }) => (
          <div key={name} className="flex flex-col">
            <label className="text-lg font-medium text-gray-700 mb-2">{label}:</label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={poData[name] || ""}
                onChange={handleChange}
                readOnly={readOnly || !isEditing}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
            ) : (
              <input
                type={type}
                name={name}
                value={poData[name] || ""}
                onChange={handleChange}
                readOnly={readOnly || !isEditing}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
            )}
          </div>
        ))}
      </div>
  
      {/* Items Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-medium text-gray-800 mb-4">Items</h3>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="bg-indigo-600 text-white">
              <tr>
                {["HSN Code", "Unit Description","Description", "UOM", "Quantity", "Unit Price", "Amount"].map((header) => (
                  <th key={header} className="px-4 py-2">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {poData.rows?.map((row, index) => (
                <tr key={row._id || index} className="even:bg-gray-50 hover:bg-indigo-50">
                  {["hsnCode", "unitDescription","Description", "uom", "quantity", "unitPrice", "amount"].map((field) => (
                    <td key={field} className="px-4 py-2">
                      <input
                        type={field === "quantity" || field === "unitPrice" || field === "amount" ? "number" : "text"}
                        value={row[field] || ""}
                        onChange={(e) => handleRowChange(index, field, e.target.value)}
                        readOnly={!isEditing}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {isEditing && (
          <div className="mt-4">
            <button
              onClick={handleAddProduct}
              className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              ➕ Add Product
            </button>
          </div>
        )}
      </div>
  
      {/* Totals and Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[
          { label: "Payable Amount", name: "payableAmount" },
          { label: "GST Amount", name: "gstAmount" },
          { label: "Total Amount", name: "totalAmount" },
          { label: "GST (%)", name: "gst" },
          { label: "PO Number", name: "poNumber" },
          { label: "Delivery Terms", name: "deliveryTerms" },
          { label: "Warranty Terms", name: "warrantyTerms" },
          { label: "Payment Terms", name: "paymentTerms" },
          { label: "LP", name: "LP" },
          { label: "discount", name: "discount" },
        ].map(({ label, name }) => (
          <div key={name} className="flex flex-col">
            <label className="text-lg font-medium text-gray-700 mb-2">{label}:</label>
            <input
              type="text"
              name={name}
              value={poData[name] || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
        ))}
      </div>
  
      {/* Save Button */}
      {isEditing && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleUpdate}
            className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
          >
            💾 Save New PO
          </button>
        </div>
      )}
    </div>
  </div>
  

  );
}
