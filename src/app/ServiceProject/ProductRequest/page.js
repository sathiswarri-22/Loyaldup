"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const Productrequest = () => {
  const [product, setProduct] = useState({
    name: '',
    email: '',
    companyName: '',
    contactpersonname: '',
    productDetails: [{ productname: '', quantity: '' }],
    Description: '',
    Employeeid: '',
    Eid: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [Eids, setEids] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = localStorage.getItem("admintokens");
  const companyNameFromParams = searchParams.get('companyName'); 
  const Eid = localStorage.getItem('idstore');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          alert("No token found. Please login as an admin.");
          return;
        }

        const response = await axios.get(`http://localhost:5005/api/getname&email?Eid=${Eid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { name, email } = response.data;

        setProduct(prevState => ({
          ...prevState,
          name,
          email,
          companyName: prevState.companyName || (companyNameFromParams || ''),
          Employeeid: Eid || prevState.Employeeid
        }));

        const eidsResponse = await axios.get('http://localhost:5005/api/getsalesemployeeEid', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setEids(eidsResponse.data.getallEid);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Only run on first mount

  const handleChange = (e, index, field) => {
    const { name, value } = e.target;

    if (name === "productname" || name === "quantity") {
      const updatedProductDetails = [...product.productDetails];
      updatedProductDetails[index][name] = value;
      setProduct(prevState => ({
        ...prevState,
        productDetails: updatedProductDetails,
      }));
    } else {
      setProduct(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addProductField = () => {
    setProduct(prevState => ({
      ...prevState,
      productDetails: [...prevState.productDetails, { productname: '', quantity: '' }],
    }));
  };

  const removeProductField = (index) => {
    const updatedProductDetails = [...product.productDetails];
    updatedProductDetails.splice(index, 1);
    setProduct(prevState => ({
      ...prevState,
      productDetails: updatedProductDetails,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !product.name ||
      !product.email ||
      !product.Description ||
      !product.Employeeid ||
      !product.Eid ||
      product.productDetails.some(p => !p.productname || !p.quantity)
    ) {
      setErrorMessage('Please fill in all required fields and product names.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5005/api/productrequest', product, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      alert('Product request submitted successfully!');

      setProduct({
        name: '',
        email: '',
        companyName: '',
        contactpersonname: '',
        productDetails: [{ productname: '', quantity: '' }],
        Description: '',
        Employeeid: '',
        Eid: ''
      });
    } catch (err) {
      console.error('Error submitting product request:', err);
      alert(err.response?.data?.message || 'Something went wrong, please try again later.');
    }
  };

  const handlenavigate = () => {
    router.push('/ServiceProject/Dasboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-teal-700">Product Request</h1>
          <h2 className="text-2xl text-gray-700">Submit a Product Request</h2>
        </div>

        <button
          onClick={handlenavigate}
          className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
        >
          <ChevronLeft size={24} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Your Name:</label>
              <input
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Company Name:</label>
              <input
                name="companyName"
                value={product.companyName}
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Enter contact person name"
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label>Product Details:</label>
            {product.productDetails.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  name="productname"
                  value={item.productname}
                  onChange={(e) => handleChange(e, index, 'productname')}
                  placeholder={`Product Name ${index + 1}`}
                  required
                  className="px-4 py-3 border"
                />
                <input
                  name="quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChange(e, index, 'quantity')}
                  placeholder={`Quantity ${index + 1}`}
                  required
                  className="px-4 py-3 border"
                />
                {product.productDetails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProductField(index)}
                    className="px-3 py-2 bg-red-500 text-white"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addProductField}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Another Product
            </button>
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-600">Your Email:</label>
            <input
              name="email"
              value={product.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-600">Employee ID:</label>
            <input
              name="Employeeid"
              value={product.Employeeid}
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="Enter remarks"
              required
              className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-600">Assign Employee ID:</label>
            <select
              name="Eid"
              value={product.Eid}
              onChange={handleChange}
              required
              className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Employee ID</option>
              {Eids.length > 0 ? (
                Eids.map((eid, index) => (
                  <option key={index} value={eid.Eid}>
                    {eid.Eid} - {eid.name}
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
