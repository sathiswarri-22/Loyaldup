"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const Workvisit = () => {
  const [workvisit, setWorkvisit] = useState({
    name: '',
    email: '',
    Eid: '',
    Description: '',
    File: null,
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedEmail = localStorage.getItem("email");

    if (savedName && savedEmail) {
      setWorkvisit((prevState) => ({
        ...prevState,
        name: savedName,
        email: savedEmail,
      }));
    }
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const { name, Eid, email, File, Description } = workvisit;

    if (!Eid || !name || !email || !File || !Description) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const token = localStorage.getItem('admintokens');
    if (!token) {
      alert("No token found. Please login as an admin.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("Eid", Eid);
      formData.append("Description", Description);
      formData.append("File", File);

      const response = await axios.post('https://loyality.chennaisunday.com/api/service&project', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log(response.data);
      alert('Successfully submitted');
      
      setWorkvisit({
        name: '',
        email: '',
        Eid: '',
        Description: '',
        File: null,
      });
      document.getElementById("fileInput").value = "";
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
    setWorkvisit({
      ...workvisit,
      [name]: value,
    });
  };

  const handleFilechange = (e) => {
    setWorkvisit({
      ...workvisit,
      [e.target.name]: e.target.files[0],
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-teal-700">Work Visit Entry</h1>
          <h2 className="text-2xl text-gray-700">Please fill out the form</h2>
        </div>

        <form onSubmit={handlesubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Your Name:</label>
              <input
                name="name"
                placeholder="Enter your name"
                value={workvisit.name}
                onChange={handlechange}
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Your Email:</label>
              <input
                name="email"
                placeholder="Enter your email"
                value={workvisit.email}
                onChange={handlechange}
                required
                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-600">Employee ID:</label>
            <input
              name="Eid"
              placeholder="Enter employee ID"
              value={workvisit.Eid}
              onChange={handlechange}
              required
              className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-600">File Upload:</label>
            <input
              type="file"
              name="File"
              id="fileInput"
              onChange={handleFilechange}
              required
              className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-600">Remarks:</label>
            <input
              name="Description"
              placeholder="Enter remarks"
              value={workvisit.Description}
              onChange={handlechange}
              required
              className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition duration-300"
          >
            Submit
          </button>

          {errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default Workvisit;
