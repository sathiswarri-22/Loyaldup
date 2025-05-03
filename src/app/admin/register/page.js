"use client";
import axios from "axios";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const CommonRegi = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        JOD: '',
        contactnumber: '',
        address: '',
        Currentsalary: '',
        Remarks: '',
        EOD: '',
        Fileupload: null,
        profileimg: null
    });

    const [companyResources, setCompanyResources] = useState([]);
    const fileInputRef = useRef(null);
    const profileImgInputRef = useRef(null);

    const handleAddResource = () => {
        setCompanyResources([...companyResources, { Thingsname: '', productnumber: '', givenStatus: '' }]);
    };

    const handleResourceChange = (index, field, value) => {
        const newResources = [...companyResources];
        newResources[index][field] = value;
        setCompanyResources(newResources);
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: files[0],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, role, JOD, contactnumber } = user;

        if (!name || !email || !password || !role || !JOD || !contactnumber) {
            alert("All required fields must be filled.");
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
            formData.append("password", password);
            formData.append("role", role);
            formData.append("JOD", JOD);
            formData.append("contactnumber", contactnumber);
            formData.append("address", user.address);
            formData.append("Currentsalary", user.Currentsalary);
            formData.append("Remarks", user.Remarks);
            formData.append("EOD", user.EOD);

            companyResources.forEach((resource, index) => {
                formData.append(`CompanyResources[${index}][Thingsname]`, resource.Thingsname);
                formData.append(`CompanyResources[${index}][productnumber]`, resource.productnumber);
                formData.append(`CompanyResources[${index}][givenStatus]`, resource.givenStatus);
            });

            if (user.Fileupload) formData.append("Fileupload", user.Fileupload);
            if (user.profileimg) formData.append("profileimg", user.profileimg);

            const response = await axios.post('http://localhost:5005/api/registration', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            alert('Registration successful');
            console.log('Successfully registered', response.data);

            setUser({
                name: '',
                email: '',
                password: '',
                role: '',
                JOD: '',
                contactnumber: '',
                address: '',
                Currentsalary: '',
                Remarks: '',
                EOD: '',
                Fileupload: null,
                profileimg: null
            });
            setCompanyResources([]);

            if (fileInputRef.current) fileInputRef.current.value = '';
            if (profileImgInputRef.current) profileImgInputRef.current.value = '';

        } catch (err) {
            console.error('Error:', err.response ? err.response.data : err.message);
            alert(`Error: ${err.response?.data?.message || 'An error occurred.'}`);
        }
    };

    const handleBackClick = () => {
        router.push('/admin/adminDasboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
        <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="relative text-center mb-8">
        <button
  onClick={handleBackClick}
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

<div className="flex flex-col items-center">
  <h2 className="text-left text-2xl sm:text-3xl lg:text-4xl text-gray-700 mt-20 sm:mt-6 lg:mt-8 mb-5">
    Registration Page
  </h2>
</div>




</div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label>Name:</label>
                <input
                  name="name"
                  placeholder="Enter your name"
                  value={user.name}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg"
                />
              </div>
            </div>
      
            <div className="flex flex-col">
              <label>Email:</label>
              <input
                name="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={handleChange}
                required
                className="px-4 py-3 border rounded-lg"
              />
            </div>
      
            <div className="flex flex-col">
              <label>Password:</label>
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                value={user.password}
                onChange={handleChange}
                required
                className="px-4 py-3 border rounded-lg"
              />
            </div>
      
            <div className="flex flex-col">
              <label>Role:</label>
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                required
                className="px-4 py-3 border rounded-lg"
              >
                <option value="">-- Choose Role --</option>
                <option value="sales head">Sales Head</option>
                <option value="Engineer">Engineer</option>
                <option value="Service Engineer">Service Engineer</option>
                <option value="Sales Employee">Sales Employee</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Lead filler">Lead Filler</option>
                <option value="Stock Filler">Stock Filler</option>
              </select>
            </div>
      
            <div className="flex flex-col">
              <label>Joining Date:</label>
              <input
                type="date"
                name="JOD"
                value={user.JOD}
                onChange={handleChange}
                required
                className="px-4 py-3 border rounded-lg"
              />
            </div>
      
            <div className="flex flex-col">
              <label>Contact Number:</label>
              <input
                name="contactnumber"
                placeholder="Enter contact number"
                value={user.contactnumber}
                onChange={handleChange}
                required
                className="px-4 py-3 border rounded-lg"
              />
            </div>
      
            <div className="flex flex-col">
              <label>Current Salary:</label>
              <input
                name="Currentsalary"
                placeholder="Enter current salary"
                value={user.Currentsalary}
                onChange={handleChange}
                required
                className="px-4 py-3 border rounded-lg"
              />
            </div>
      
            <div className="flex flex-col">
              <label>Address:</label>
              <input
                name="address"
                placeholder="Enter your address"
                value={user.address}
                onChange={handleChange}
                className="px-4 py-3 border rounded-lg"
              />
            </div>
      
            <div className="flex flex-col">
  <label>Company Resources:</label>
  {companyResources.map((resource, index) => (
    <div
      key={index}
      className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-2"
    >
      <input
        placeholder="Thing Name"
        value={resource.Thingsname}
        onChange={(e) => handleResourceChange(index, 'Thingsname', e.target.value)}
        className="px-4 py-3 border rounded-lg w-full sm:w-1/3"
      />
      <input
        placeholder="Product Number"
        value={resource.productnumber}
        onChange={(e) => handleResourceChange(index, 'productnumber', e.target.value)}
        className="px-4 py-3 border rounded-lg w-full sm:w-1/3"
      />
      <select
        value={resource.givenStatus}
        onChange={(e) => handleResourceChange(index, 'givenStatus', e.target.value)}
        className="px-4 py-3 border rounded-lg w-full sm:w-1/3"
      >
        <option value="">Status</option>
        <option value="provided">Given</option>
        <option value="handover">Handover</option>
        <option value="bending">Bending</option>
        <option value="nothandover">Not Handover</option>
      </select>
      <button
        type="button"
        onClick={() => setCompanyResources(companyResources.filter((_, i) => i !== index))}
        className="px-4 py-2 bg-red-500 text-white rounded mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto"
      >
        Remove
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={handleAddResource}
    className="mt-2 px-4 py-2 bg-green-500 text-white rounded w-full sm:w-auto"
  >
    Add Resource
  </button>
</div>

      
            <div className="flex flex-col">
              <label>Profile Image:</label>
              <input
                type="file"
                name="profileimg"
                accept="image/*"
                ref={profileImgInputRef}
                onChange={handleFileChange}
                className="px-4 py-3 border rounded-lg"
              />
            </div>
      
            <div className="flex flex-col">
              <label>File Upload:</label>
              <input
                type="file"
                name="Fileupload"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="px-4 py-3 border rounded-lg"
              />
            </div>
      
            <div className="flex flex-col">
              <label>Ending Date:</label>
              <input
                type="date"
                name="EOD"
                value={user.EOD}
                onChange={handleChange}
                required
                className="px-4 py-3 border rounded-lg"
              />
            </div>
      
            <div className="flex flex-col">
              <label>Remarks:</label>
              <input
                type="textarea"
                name="Remarks"
                value={user.Remarks}
                onChange={handleChange}
                required
                className="px-4 py-3 border rounded-lg"
              />
            </div>
      
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
            >
              Register
            </button>
          </form>
        </div>
      </div>
      
    );
};

export default CommonRegi;
