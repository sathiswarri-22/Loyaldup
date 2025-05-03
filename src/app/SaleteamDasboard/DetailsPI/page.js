"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function InvoiceDetail() {
  const searchParams = useSearchParams();
  const piId = searchParams.get("piId");
  const router = useRouter();

  const [invoice, setInvoice] = useState(null);
  const [editableInvoice, setEditableInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!piId) return;

    const fetchInvoiceData = async () => {
      const token = localStorage.getItem("admintokens");

      if (!token) {
        setError("Authorization token is missing");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5005/api-invoice/byPiId/${piId}`, // Fetch by PI ID
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInvoice(response.data);
        setEditableInvoice(response.data);
        
        if (response.data.items && Array.isArray(response.data.items)) {
          setRows(response.data.items);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Fetch failed");
      }
    };

    fetchInvoiceData();
  }, [piId]);

  const handleChange = (field, value) => {
    setEditableInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("admintokens");

    try {
      await axios.put(
        `http://localhost:5005/api-invoice/${piId}`,
        editableInvoice,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInvoice(editableInvoice);
      setIsEditing(false);
      alert("Invoice updated successfully");

      // ✅ Navigate to the Edit PI page after saving the invoice
      router.push(`/SaleteamDasboard/EditPI?piId=${piId}&EnquiryNo=${editableInvoice.EnquiryNo}`);
    } catch (err) {
      alert("Failed to save changes: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("admintokens");
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    try {
      await axios.delete(`http://localhost:5005/api-invoice/${piId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Invoice deleted successfully");
      window.history.back();
    } catch (err) {
      alert("Failed to delete invoice: " + (err.response?.data?.message || err.message));
    }
  };

  const handleViewPDF = () => {
    // Redirect to the PDF page using PI ID and Enquiry No
    router.push(`/invoice/pdf?piId=${piId}&EnquiryNo=${invoice.EnquiryNo}`);
  };

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!invoice) return <div className="text-center mt-10">Loading invoice details...</div>;

  const fieldsToShow = [
    { label: "PI ID", field: "piId" },
    { label: "Reference Number", field: "referenceNumber" },
    { label: "Customer Name", field: "name" },
    { label: "Status", field: "Status" },
    { label: "Address", field: "address" },
    { label: "GST Field", field: "gstField" },
    { label: "Your Reference", field: "yourRef" },
    { label: "Jurisdiction", field: "jurisdiction" },
    { label: "Certification", field: "certification" },
    { label: "Goods Return", field: "goodsReturn" },
    { label: "Interest Rate", field: "interestRate" },
    { label: "EID", field: "Eid" },
    { label: "Enquiry No", field: "EnquiryNo" },
    { label: "Subtotal", field: "subtotal" },
    { label: "Freight", field: "freight" },
    { label: "GST", field: "gst" },
    { label: "Round Off", field: "roundOff" },
    { label: "Total Payable", field: "totalPayable" },
    { label: "Financial Year", field: "financialYear" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
          onClick={() => router.push('/SaleteamDasboard/Dasboard')}
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Invoice Details</h1>
          {isEditing ? (
            <div className="space-x-2">
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md">
                Save
              </button>
              <button
                onClick={() => {
                  setEditableInvoice(invoice);
                  setIsEditing(false);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Edit
              </button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Delete
              </button>
              <button onClick={handleViewPDF} className="bg-green-600 text-white px-4 py-2 rounded-md">
                View PDF
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fieldsToShow.map(({ label, field }) => (
            <div key={field}>
              <h2 className="text-sm text-gray-500">{label}</h2>
              {isEditing ? (
                <input
                  type="text"
                  value={
                    typeof editableInvoice[field] === "boolean"
                      ? editableInvoice[field].toString()
                      : editableInvoice[field] ?? ""
                  }
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                />
              ) : (
                <p className="text-lg font-medium">
                  {["issueDate", "createdAt", "updatedAt"].includes(field)
                    ? new Date(invoice[field]).toLocaleString()
                    : invoice[field]?.toString()}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    </div>
  );
}