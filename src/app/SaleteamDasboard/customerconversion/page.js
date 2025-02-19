"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerConversion = () => {
  const token = localStorage.getItem('admintokens');
  const [customer, setCustomer] = useState({
    EnquiryNo: '',
    CustomerDetails: {
      PANnumber: '',
      opportunitynumber: '',
      GSTNnumber: '',
    },
    BillingAddressDetails: {
      BillingAddress: '',
      BillingCountry: '',
      BillingCity: '',
      BillingPostalCode: '',
      BillingState: ''
    },
    DescriptionDetails: '',
    Convertedstatus: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [customerData, setCustomerData] = useState(null);



  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'EnquiryNo' || name === 'DescriptionDetails' || name === 'Convertedstatus') {
      setCustomer((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      const [section, field] = name.split('.');
      setCustomer((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value,
        },
      }));
    }
  };

  const getCustomer = async (EnquiryNo) => {  
    console.log('Fetching data for EnquiryNo:', EnquiryNo);
    const Eid = localStorage.getItem('idstore'); 
    console.log('Eid:', Eid);
    if (!Eid) {
      setError("Eid is not available.");
      return;
    }

    try {
      console.log('Fetching data with EnquiryNo:', EnquiryNo);
      const response = await axios.get(`http://localhost:5005/api/getcustomerconverstion?Eid=${Eid}&EnquiryNo=${EnquiryNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log('Fetched customer data:', response.data);
      setCustomerData(response.data.getcustomerdata); 
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError("Failed to fetch customer data.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer.EnquiryNo || !customer.CustomerDetails.PANnumber) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    console.log('Submitting data:', customer);

    try {
      const response = await axios.post('http://localhost:5005/api/customerconversion', customer, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log('Post response:', response.data);

      setSuccess("Customer conversion successful!");

      const EnquiryNo = response.data.customer?.EnquiryNo;
      if (EnquiryNo) {
        getCustomer(EnquiryNo);  
      } else {
        setError("No EnquiryNo found in the response.");
      }
    } catch (err) {
      setError("Failed to convert customer. Please try again.");
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center">Customer Conversion Form</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* LEAD NUMBER */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">LEAD NUMBER:</label>
            <input
              type="text"
              name="EnquiryNo"
              value={customer.EnquiryNo}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
              required
            />
          </div>

          {/* PAN Number */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">PAN Number:</label>
            <input
              type="text"
              name="CustomerDetails.PANnumber"
              value={customer.CustomerDetails.PANnumber}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
              required
            />
          </div>

          {/* Opportunity Number */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Opportunity Number:</label>
            <input
              type="text"
              name="CustomerDetails.opportunitynumber"
              value={customer.CustomerDetails.opportunitynumber}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
            />
          </div>

          {/* GSTN Number */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">GSTN Number:</label>
            <input
              type="text"
              name="CustomerDetails.GSTNnumber"
              value={customer.CustomerDetails.GSTNnumber}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
            />
          </div>

          {/* Billing Address */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Billing Address:</label>
            <input
              type="text"
              name="BillingAddressDetails.BillingAddress"
              value={customer.BillingAddressDetails.BillingAddress}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
            />
          </div>

          {/* Billing Country */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Billing Country:</label>
            <input
              type="text"
              name="BillingAddressDetails.BillingCountry"
              value={customer.BillingAddressDetails.BillingCountry}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
            />
          </div>

          {/* Billing City */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Billing City:</label>
            <input
              type="text"
              name="BillingAddressDetails.BillingCity"
              value={customer.BillingAddressDetails.BillingCity}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
            />
          </div>

          {/* Billing Postal Code */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Billing Postal Code:</label>
            <input
              type="text"
              name="BillingAddressDetails.BillingPostalCode"
              value={customer.BillingAddressDetails.BillingPostalCode}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
            />
          </div>

          {/* Billing State */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Billing State:</label>
            <input
              type="text"
              name="BillingAddressDetails.BillingState"
              value={customer.BillingAddressDetails.BillingState}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Description:</label>
            <input
              type="text"
              name="DescriptionDetails"
              value={customer.DescriptionDetails}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
            />
          </div>

          {/* Lead Conversion Status */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Lead Converted?</label>
            <select
              name="Convertedstatus"
              value={customer.Convertedstatus}
              onChange={handleChange}
              className="w-full p-2 border-2 border-green-200 rounded-lg"
              required
            >
              <option value="">Select</option>
              <option value="yes">YES</option>
              <option value="no">NO</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Error and Success Messages */}
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        {/* Customer Data Table */}
        <div className="mt-6">
          {customerData ? (
            <table className="w-full table-auto border-collapse border-2 border-green-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 border border-green-200">EnquiryNo</th>
                  <th className="px-4 py-2 border border-green-200">PANnumber</th>
                  <th className="px-4 py-2 border border-green-200">MobileNumber</th>
                  <th className="px-4 py-2 border border-green-200">OpportunityNumber</th>
                  <th className="px-4 py-2 border border-green-200">GSTNnumber</th>
                  <th className="px-4 py-2 border border-green-200">PrimaryMail</th>
                  <th className="px-4 py-2 border border-green-200">Address</th>
                  <th className="px-4 py-2 border border-green-200">BillingAddress</th>
                  <th className="px-4 py-2 border border-green-200">BillingCountry</th>
                  <th className="px-4 py-2 border border-green-200">BillingCity</th>
                  <th className="px-4 py-2 border border-green-200">BillingPostalCode</th>
                  <th className="px-4 py-2 border border-green-200">BillingState</th>
                  <th className="px-4 py-2 border border-green-200">DescriptionDetails</th>
                  <th className="px-4 py-2 border border-green-200">Convertedstatus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-green-200">{customerData?.EnquiryNo}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.CustomerDetails?.PANnumber}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.CustomerDetails?.MobileNumber}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.CustomerDetails?.opportunitynumber}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.CustomerDetails?.GSTNnumber}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.CustomerDetails?.PrimaryMail}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.BillingAddressDetails?.BillingAddress}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.BillingAddressDetails?.BillingCountry}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.BillingAddressDetails?.BillingCity}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.BillingAddressDetails?.BillingPostalCode}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.BillingAddressDetails?.BillingState}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.DescriptionDetails}</td>
                  <td className="px-4 py-2 border border-green-200">{customerData?.Convertedstatus}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No customer data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerConversion;
