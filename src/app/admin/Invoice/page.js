"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('admintokens');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api-invoice/invoices', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoices(response.data);
      } catch (err) {
        setError('Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <p className="text-center text-lg text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
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

      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Invoice List</h2>

      {/* Invoice Cards */}
      {invoices.map((invoice) => (
        <div key={invoice._id} className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-indigo-700">{invoice.referenceNumber}</h3>
            <p className="text-gray-700">PI ID: <span className="font-medium">{invoice.piId}</span></p>
            <p className="text-gray-700">Customer Name: <span className="font-medium">{invoice.name}</span></p>
            <p className="text-gray-700">Address: {invoice.address}</p>
            <p className="text-gray-700">GST: {invoice.gstField}</p>
            <p className="text-gray-700">Your Ref: {invoice.yourRef}</p>
            <p className="text-gray-700">Jurisdiction: {invoice.jurisdiction}</p>
            <p className="text-gray-700">Certification: {invoice.certification ? 'Yes' : 'No'}</p>
            <p className="text-gray-700">Goods Return: {invoice.goodsReturn ? 'Yes' : 'No'}</p>
            <p className="text-gray-700">Interest Rate: {invoice.interestRate}%</p>
            <p className="text-gray-700">Status: <span className="font-semibold">{invoice.Status}</span></p>
            <p className="text-gray-700">Financial Year: {invoice.financialYear}</p>
            <p className="text-gray-700">Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
          </div>

          {/* Line Items */}
          <div className="mt-6">
            <h4 className="text-lg font-bold mb-2 text-gray-800">Items</h4>
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2 border">Item Name</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Unit Price</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.rows.map((item) => (
                  <tr key={item._id} className="text-sm text-gray-700">
                    <td className="p-2 border">{item.itemName}</td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">₹{item.unitPrice}</td>
                    <td className="p-2 border">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 text-right space-y-1 text-gray-800">
            <p>Subtotal: ₹{invoice.subtotal}</p>
            <p>Freight: ₹{invoice.freight}</p>
            <p>GST: ₹{invoice.gst}</p>
            <p>Round Off: ₹{invoice.roundOff}</p>
            <p className="text-lg font-bold text-indigo-700">Total Payable: ₹{invoice.totalPayable}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;