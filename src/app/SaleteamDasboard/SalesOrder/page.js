'use client'

import React, { useState } from "react";
import axios from "axios";

const Salesorder = () => {
  const [formData, setFormData] = useState({
    customername: '',
    subject: '',
    status: 'PO Recieved',
    POnumber: '',
    paymentTerms: '',
    Quotenumber: '',
    salesOrderDate: '',
    AssignedTo: '',
    leadStatus: 'Customer',
    POdate: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`http://localhost:5005/api-salesorder/create-salesorder`, formData);
      setMessage(`Sales Order created successfully. Order ID: ${response.data.orderId}`);
    } catch (error) {
      setMessage('Error creating sales order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">Create Sales Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="customername"
          placeholder="Customer Name"
          value={formData.customername}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="POnumber"
          placeholder="PO Number"
          value={formData.POnumber}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="paymentTerms"
          placeholder="Payment Terms"
          value={formData.paymentTerms}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="Quotenumber"
          placeholder="Quote Number"
          value={formData.Quotenumber}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          name="salesOrderDate"
          value={formData.salesOrderDate}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="AssignedTo"
          placeholder="Assigned To"
          value={formData.AssignedTo}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          name="POdate"
          value={formData.POdate}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Creating...' : 'Create Sales Order'}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-lg font-semibold">{message}</p>}
    </div>
  );
};

export default Salesorder;
