"use client";
import React, { useState } from 'react';
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
    console.log('this is enquiryno',EnquiryNo);
    const Eid = localStorage.getItem('idstore'); 
    console.log(Eid);
    if (!Eid) {
      setError("Eid is not available.");
      return;
    }

    try {
      console.log(EnquiryNo,Eid);
      const response = await axios.get(`http://localhost:5005/api/getcustomerconverstion?EnquiryNo=${EnquiryNo}&Eid=${Eid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log('i get the data',response.data);
      setCustomerData(response.data.getcustomerdata); 
      console.log("i got all the data",response.data.getcustomerdata) 
    } catch (err) {
      console.error('Cannot fetch the data', err);
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
    console.log('Before submitting data:', customer);

    try {
      const response = await axios.post('http://localhost:5005/api/customerconversion', customer, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log('After posting:', response.data);

      setSuccess("Customer conversion successful!");

      const EnquiryNo = response.data.customer?.EnquiryNo;
      console.log('EnquiryNo:', EnquiryNo);

      if (EnquiryNo) {
        getCustomer(EnquiryNo);  
      } else {
        setError("No EnquiryNo found in the response.");
      }
    } catch (err) {
      setError("Failed to convert customer. Please try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Customer Conversion Form</h1>
      {customer.Convertedstatus}
      <form onSubmit={handleSubmit}>
        <label>LEADNUMBER:</label>
        <input
          type="text"
          name="EnquiryNo"
          value={customer.EnquiryNo}
          onChange={handleChange}
          required
        />
        <label>PAN Number:</label>
        <input
          type="text"
          name="CustomerDetails.PANnumber"
          value={customer.CustomerDetails.PANnumber}
          onChange={handleChange}
          required
        />
        <label>Opportunity Number:</label>
        <input
          type="text"
          name="CustomerDetails.opportunitynumber"
          value={customer.CustomerDetails.opportunitynumber}
          onChange={handleChange}
        />
        <label>GSTN Number:</label>
        <input
          type="text"
          name="CustomerDetails.GSTNnumber"
          value={customer.CustomerDetails.GSTNnumber}
          onChange={handleChange}
        />
        <label>Billing Address:</label>
        <input
          type="text"
          name="BillingAddressDetails.BillingAddress"
          value={customer.BillingAddressDetails.BillingAddress}
          onChange={handleChange}
        />
        <label>Billing Country:</label>
        <input
          type="text"
          name="BillingAddressDetails.BillingCountry"
          value={customer.BillingAddressDetails.BillingCountry}
          onChange={handleChange}
        />
        <label>Billing City:</label>
        <input
          type="text"
          name="BillingAddressDetails.BillingCity"
          value={customer.BillingAddressDetails.BillingCity}
          onChange={handleChange}
        />
        <label>Billing Postal Code:</label>
        <input
          type="text"
          name="BillingAddressDetails.BillingPostalCode"
          value={customer.BillingAddressDetails.BillingPostalCode}
          onChange={handleChange}
        />
        <label>Billing State:</label>
        <input
          type="text"
          name="BillingAddressDetails.BillingState"
          value={customer.BillingAddressDetails.BillingState}
          onChange={handleChange}
        />
        <label>Description:</label>
        <input
          type="text"
          name="DescriptionDetails"
          value={customer.DescriptionDetails}
          onChange={handleChange}
        />
        <label>Lead Converted?</label>
        <select
          name="Convertedstatus"
          value={customer.Convertedstatus}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="yes">YES</option>
          <option value="no">NO</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      {error && <div>{error}</div>}
      {success && <div>{success}</div>}

      <div>
  {customerData ? (
    <table>
      <thead>
        <tr>
          <th>EnquiryNo</th>
          <th>PANnumber</th>
          <th>MobileNumber</th>
          <th>OpportunityNumber</th>
          <th>GSTNnumber</th>
          <th>PrimaryMail</th>
          <th>Address</th>
          <th></th>
          <th>BillingAddress</th>
          <th>BillingCountry</th>
          <th>BillingCity</th>
          <th>BillingPostalCode</th>
          <th>BillingState</th>
          <th>DescriptionDetails</th>
          <th>Convertedstatus</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{customerData?.EnquiryNo}</td>
          <td>{customerData?.CustomerDetails?.PANnumber}</td>
          <td>{customerData?.CustomerDetails?.MobileNumber}</td>
          <td>{customerData?.CustomerDetails?.opportunitynumber}</td>
          <td>{customerData?.CustomerDetails?.GSTNnumber}</td>
          <td>{customerData?.CustomerDetails?.PrimaryMail}</td>
          <td>{customerData?.BillingAddressDetails?.BillingAddress}</td>
          <td>{customerData?.BillingAddressDetails?.BillingCountry}</td>
          <td>{customerData?.BillingAddressDetails?.BillingCity}</td>
          <td>{customerData?.BillingAddressDetails?.BillingPostalCode}</td>
          <td>{customerData?.BillingAddressDetails?.BillingState}</td>
          <td>{customerData?.DescriptionDetails}</td>
          <td>{customerData?.Convertedstatus}</td>
        </tr>
      </tbody>
    </table>
  ) : (
    <p>No customer data available.</p>
  )}
</div>

    </div>
  );
};

export default CustomerConversion;