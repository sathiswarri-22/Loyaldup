"use client";

import { useState } from "react";
import axios from 'axios';

const SaleheadEnquiry = () => {
    const [enquiry, setEnquiry] = useState({
        LeadDetails: {
            clientName: '',
            Leadcondition: '',
            companyName: '',
            Department: '',
            LeadMedium: '',
            LeadPriority: '',
            EnquiryType: '',
        },
        ContactDetails: {
            MobileNumber: '',
            AlternateMobileNumber: '',
            PrimaryMail: '',
            SecondaryMail: '',
        },
        AddressDetails: {
            Address: '',
            Country: '',
            City: '',
            PostalCode: '',
            State: '',
        },
        DescriptionDetails: '',
        Eid: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handlesubmit = async (e) => {
        e.preventDefault();
        if (!enquiry.LeadDetails.companyName || !enquiry.LeadDetails.clientName || !enquiry.LeadDetails.EnquiryType || !enquiry.LeadDetails.Leadcondition) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }
        const token = localStorage.getItem('admintokens');
        if (!token) {
            alert("No token found. Please login as an admin.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:5005/api/leadentry', enquiry, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log(response.data);
            alert('Lead entry successfully submitted');
            setEnquiry({
                LeadDetails: {
                    clientName: '',
                    Leadcondition: '',
                    companyName: '',
                    Department: '',
                    LeadMedium: '',
                    LeadPriority: '',
                    EnquiryType: '',
                },
                ContactDetails: {
                    MobileNumber: '',
                    AlternateMobileNumber: '',
                    PrimaryMail: '',
                    SecondaryMail: '',
                },
                AddressDetails: {
                    Address: '',
                    Country: '',
                    City: '',
                    PostalCode: '',
                    State: '',
                },
                DescriptionDetails: '',
                Eid: '',
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

        if (name === 'Eid' || name === 'DescriptionDetails') {
            setEnquiry((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            const [section, field] = name.split('.');

            setEnquiry((prevState) => ({
                ...prevState,
                [section]: {
                    ...prevState[section],
                    [field]: value,
                },
            }));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
            <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h1 className="text-4xl font-bold text-center text-green-600">Sale Head Enquiry</h1>
                {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
                <form onSubmit={handlesubmit} className="space-y-6">
                    {/* Lead Details */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Lead Details</h2>
                        <label className="block text-sm font-medium text-gray-600">Company Name</label>
                        <input
                            name="LeadDetails.companyName"
                            placeholder="Type company name"
                            onChange={handlechange}
                            value={enquiry.LeadDetails.companyName}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Contact Person</label>
                        <input
                            name="LeadDetails.clientName"
                            placeholder="Type contact person"
                            onChange={handlechange}
                            value={enquiry.LeadDetails.clientName}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Department</label>
                        <input
                            name="LeadDetails.Department"
                            placeholder="Type department"
                            onChange={handlechange}
                            value={enquiry.LeadDetails.Department}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Lead Medium</label>
                        <input
                            name="LeadDetails.LeadMedium"
                            placeholder="Type lead medium"
                            onChange={handlechange}
                            value={enquiry.LeadDetails.LeadMedium}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Lead Priority</label>
                        <input
                            name="LeadDetails.LeadPriority"
                            placeholder="Type lead priority"
                            onChange={handlechange}
                            value={enquiry.LeadDetails.LeadPriority}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Enquiry Type</label>
                        <select
                            name="LeadDetails.EnquiryType"
                            onChange={handlechange}
                            value={enquiry.LeadDetails.EnquiryType}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            required
                        >
                            <option value="">--Choose a type of enquiry--</option>
                            <option value="Product">Product</option>
                            <option value="Project">Project</option>
                            <option value="Service">Service</option>
                        </select>
                        <label className="block text-sm font-medium text-gray-600">Lead Condition</label>
                        <select
                            name="LeadDetails.Leadcondition"
                            onChange={handlechange}
                            value={enquiry.LeadDetails.Leadcondition}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            required
                        >
                            <option value="">--Choose a lead condition--</option>
                            <option value="new">New</option>
                            <option value="existing">Existing</option>
                        </select>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Contact Details</h2>
                        <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
                        <input
                            name="ContactDetails.MobileNumber"
                            placeholder="Enter mobile number"
                            onChange={handlechange}
                            value={enquiry.ContactDetails.MobileNumber}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Alternate Mobile Number</label>
                        <input
                            name="ContactDetails.AlternateMobileNumber"
                            placeholder="Enter alternate mobile number"
                            onChange={handlechange}
                            value={enquiry.ContactDetails.AlternateMobileNumber}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Primary Mail</label>
                        <input
                            name="ContactDetails.PrimaryMail"
                            placeholder="Enter primary email"
                            onChange={handlechange}
                            value={enquiry.ContactDetails.PrimaryMail}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Secondary Mail</label>
                        <input
                            name="ContactDetails.SecondaryMail"
                            placeholder="Enter secondary email"
                            onChange={handlechange}
                            value={enquiry.ContactDetails.SecondaryMail}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    {/* Address Details */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Address Details</h2>
                        <label className="block text-sm font-medium text-gray-600">Address</label>
                        <input
                            name="AddressDetails.Address"
                            placeholder="Enter address"
                            onChange={handlechange}
                            value={enquiry.AddressDetails.Address}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Country</label>
                        <input
                            name="AddressDetails.Country"
                            placeholder="Enter country"
                            onChange={handlechange}
                            value={enquiry.AddressDetails.Country}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">City</label>
                        <input
                            name="AddressDetails.City"
                            placeholder="Enter city"
                            onChange={handlechange}
                            value={enquiry.AddressDetails.City}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Postal Code</label>
                        <input
                            name="AddressDetails.PostalCode"
                            placeholder="Enter postal code"
                            onChange={handlechange}
                            value={enquiry.AddressDetails.PostalCode}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">State</label>
                        <input
                            name="AddressDetails.State"
                            placeholder="Enter state"
                            onChange={handlechange}
                            value={enquiry.AddressDetails.State}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    {/* Description & Employee ID */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-600">Remarks</label>
                        <input
                            name="DescriptionDetails"
                            placeholder="Enter remarks"
                            onChange={handlechange}
                            value={enquiry.DescriptionDetails}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <label className="block text-sm font-medium text-gray-600">Assign Employee ID</label>
                        <input
                            name="Eid"
                            placeholder="Enter employee ID"
                            onChange={handlechange}
                            value={enquiry.Eid}
                            className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-300"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SaleheadEnquiry;
