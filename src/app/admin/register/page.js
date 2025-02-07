"use client";
import axios from "axios";
import React, { useState } from "react";

const CommonRegi = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        JOD: '',
        contactnumber: '',
        address: '',
        Currentsalary: '',
        CompanyResources: '',
        Remarks: '',
        EOD: '',
        Fileupload: '',
    });

    const handlesubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, role, JOD, contactnumber, address, Currentsalary, CompanyResources, Remarks, Fileupload } = user;

        if (!name || !email || !password || !role || !JOD) {
            alert("All fields are required");
            return;
        }

        const token = localStorage.getItem('admintokens');
        if (!token) {
            alert("No token found. Please login as an admin.");
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(user).forEach(key => {
                if (key === "Fileupload") {
                    formData.append(key, user[key]);
                } else {
                    formData.append(key, user[key]);
                }
            });

            const response = await axios.post('http://localhost:5005/api/registration', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log('Successfully registered', response.data);
            alert('Registration successful');
            
            setUser({
                name: '',
                email: '',
                password: '',
                role: '',
                JOD: '',
                contactnumber: '',
                address: '',
                Currentsalary: '',
                CompanyResources: '',
                Remarks: '',
                EOD: '',
                Fileupload: '',
            });

            localStorage.removeItem('admintokens');
            console.log('Token removed');

        } catch (err) {
            console.log('Error occurred', err);
            alert('An error occurred during registration. Please try again.');
        }
    };

    const handlechange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setUser({
            ...user,
            Fileupload: e.target.files[0],
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
            <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-semibold text-teal-700">Welcome Admin</h1>
                    <h2 className="text-2xl text-gray-700">Registration Page</h2>
                </div>

                <form onSubmit={handlesubmit} className="space-y-6">
                    {/* Personal Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Name:</label>
                            <input
                                name="name"
                                placeholder="Enter your name"
                                value={user.name}
                                onChange={handlechange}
                                required
                                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Email:</label>
                            <input
                                name="email"
                                placeholder="Enter your email"
                                value={user.email}
                                onChange={handlechange}
                                required
                                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Password:</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Enter at least 12 characters"
                                value={user.password}
                                onChange={handlechange}
                                required
                                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Role:</label>
                            <select
                                name="role"
                                value={user.role}
                                onChange={handlechange}
                                required
                                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="">-- Choose a role --</option>
                                <option value="sales head">SALEHEAD</option>
                                <option value="Engineer">ENGINEER</option>
                                <option value="Service Engineer">SERVICE ENGINEER</option>
                                <option value="Sales Employee">SALE EMPLOYEE</option>
                                <option value="Inventory Manager">INVENTORY MANAGER</option>
                                <option value="Lead filler">LEAD MANAGER</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">JOD:</label>
                            <input
                                type="date"
                                name="JOD"
                                value={user.JOD}
                                onChange={handlechange}
                                required
                                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Contact Number:</label>
                            <input
                                name="contactnumber"
                                placeholder="Enter your contact number"
                                value={user.contactnumber}
                                onChange={handlechange}
                                required
                                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    {/* Address & Salary */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-600">Address:</label>
                        <input
                            name="address"
                            placeholder="Enter your address"
                            value={user.address}
                            onChange={handlechange}
                            className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Current Salary:</label>
                            <input
                                name="Currentsalary"
                                placeholder="Enter current salary"
                                value={user.Currentsalary}
                                onChange={handlechange}
                                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Company Resources:</label>
                            <input
                                name="CompanyResources"
                                placeholder="Enter company resources"
                                value={user.CompanyResources}
                                onChange={handlechange}
                                className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium text-gray-600">Remarks:</label>
                        <input
                            name="Remarks"
                            placeholder="Enter remarks"
                            value={user.Remarks}
                            onChange={handlechange}
                            className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* File Upload */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-600">File Upload:</label>
                        <input
                            type="file"
                            name="Fileupload"
                            onChange={handleFileChange}
                            className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* EOD Date */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-600">EOD:</label>
                        <input
                            type="date"
                            name="EOD"
                            value={user.EOD}
                            onChange={handlechange}
                            className="px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Submit Button */}
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

export default CommonRegi;
