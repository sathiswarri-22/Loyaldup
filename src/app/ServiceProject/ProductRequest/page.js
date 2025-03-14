"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const Productrequest = () => {
  const [product, setProduct] = useState({
    name: '',
    email: '',
    companyname: '',
    contactpersonname: '',
    quantity: '',
    productname: '',
    Description: '',
    Employeeid: '',
    Eid: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [Eids, setEids] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    if (storedName) {
      setProduct(prevState => ({ ...prevState, name: storedName }));
    }
    if (storedEmail) {
      setProduct(prevState => ({ ...prevState, email: storedEmail }));
    }

    // Fetch Employee IDs
    const fetchEids = async () => {
      try {
        const token = localStorage.getItem("admintokens");
        if (!token) {
          alert("No token found. Please login as an admin.");
          return;
        }
        const response = await axios.get('https://loyality.chennaisunday.com/api/getsalesemployeeEid', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (Array.isArray(response.data.Eid)) {
          setEids(response.data.Eid);
        } else {
          setEids([]);
        }
      } catch (err) {
        console.error('Error fetching EIDs:', err);
        setEids([]);
      }
    };

    fetchEids();
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!product.Eid || !product.name || !product.email || !product.Description || !product.Employeeid) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const token = localStorage.getItem('admintokens');
    if (!token) {
      alert("No token found. Please login as an admin.");
      return;
    }

    try {
      const response = await axios.post('https://loyality.chennaisunday.com/api/productrequest', product, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log(response.data);
      alert('Lead entry successfully submitted');

      setProduct({
        name: '',
        email: '',
        companyname: '',
        contactpersonname: '',
        quantity: '',
        productname: '',
        Description: '',
        Employeeid: '',
        Eid: ''
      });
    } catch (err) {
      console.log('Error submitting lead entry:', err);
      if (err.response) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('Something went wrong, please try again later.');
      }
    }
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-teal-700">Product Request</h1>
          <h2 className="text-2xl text-gray-700">Submit a Product Request</h2>
        </div>

        <form onSubmit={handlesubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Your Name:</label>
              <input
                name="name"
                value={product.name}
                onChange={handlechange}
                placeholder="Enter your name"
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Company Name:</label>
              <input
                name="companyname"
                value={product.companyname}
                onChange={handlechange}
                placeholder="Enter company name"
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Contact Person Name:</label>
              <input
                name="contactpersonname"
                value={product.contactpersonname}
                onChange={handlechange}
                placeholder="Enter contact person name"
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Product Quantity:</label>
              <input
                name="quantity"
                value={product.quantity}
                onChange={handlechange}
                placeholder="Enter product quantity"
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Product Name:</label>
              <input
                name="productname"
                value={product.productname}
                onChange={handlechange}
                placeholder="Enter product name"
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Your Email:</label>
              <input
                name="email"
                value={product.email}
                onChange={handlechange}
                placeholder="Enter your email"
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Employee ID:</label>
              <input
                name="Employeeid"
                value={product.Employeeid}
                onChange={handlechange}
                placeholder="Enter employee ID"
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Remarks:</label>
              <input
                name="Description"
                value={product.Description}
                onChange={handlechange}
                placeholder="Enter remarks"
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-600">Assign Employee ID:</label>
            <select
              name="Eid"
              value={product.Eid}
              onChange={handlechange}
              required
              className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Employee ID</option>
              {Eids.length > 0 ? (
                Eids.map((Eid, index) => (
                  <option key={index} value={Eid}>
                    {Eid}
                  </option>
                ))
              ) : (
                <option value="">No Employee IDs available</option>
              )}
            </select>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Productrequest;
