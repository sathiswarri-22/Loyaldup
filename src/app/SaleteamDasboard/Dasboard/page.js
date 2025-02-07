"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Dashboard = () => {
    const role = localStorage.getItem('role');
    const [completedEnquiries, setCompletedEnquiries] = useState([]);
    const [enquiryData, setEnquiryData] = useState([]);
    const [error, setError] = useState(null);
    const [EidValue, setEidValue] = useState('');
    const [token, setToken] = useState(null);
    const [Eid, setEid] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const storedCompletedEnquiries = JSON.parse(localStorage.getItem('completedEnquiries')) || [];
        setCompletedEnquiries(storedCompletedEnquiries);
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem('admintokens'));
        setEid(localStorage.getItem('idstore'));
    }, []);

    useEffect(() => {
        const fetchEnquiryData = async () => {
            if (Eid && token) {
                try {
                    const response = await axios.get(`http://localhost:5005/api/getenquiry/${Eid}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.data && response.data.getdata) {
                        setEnquiryData(response.data.getdata);
                    } else {
                        setError("Enquiry data not found");
                    }
                } catch (err) {
                    setError("Failed to fetch data");
                }
            }
        };

        fetchEnquiryData();
    }, [Eid, token]);

    const ViewProfile = () => {
        router.push('/SaleteamDasboard/viewprofile');
    };

    const EnterEnquiries = () => {
        router.push('/SaleteamDasboard/Enquirypage');
    };

    const ViewEnquiries = () => {
        router.push('/SaleteamDasboard/viewenquiry');
    };

    const Quotation = () => {
        router.push('/SaleteamDasboard/Quotation');
    };

    const Salesorder = () => {
        router.push('/SaleteamDasboard/SalesOrder');
    };

    const perfoma = () => {
        router.push('/SaleteamDasboard/perfoma');
    };

    const customerconverted = () => {
        router.push('/SaleteamDasboard/customerconverted');
    };

    const Inventory = () => {
        router.push('/SaleteamDasboard/Inventory');
    };

    const handleComplete = (enquiryId) => {
        setEnquiryData((prevEnquiries) => prevEnquiries.filter((item) => item._id !== enquiryId));
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-full mx-auto">
                <div className="flex flex-col space-y-8 bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-3xl font-semibold text-center text-green-600">Dashboard</h2>

                    <nav className="flex justify-between space-x-4">
                        <button 
                            onClick={ViewProfile}
                            className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            View Profile
                        </button>
                        {role === "Lead filler" && (
                            <button
                                onClick={EnterEnquiries}
                                className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                Enter Enquiries
                            </button>
                        )}
                        <button
                            onClick={customerconverted}
                            className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            Customer Converted
                        </button>
                        <button
                            onClick={ViewEnquiries}
                            className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            View Enquiries
                        </button>
                        <button
                            onClick={Inventory}
                            className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            Inventory
                        </button>
                    </nav>

                    <div className="mt-8 overflow-x-auto">
                        <h3 className="text-2xl font-medium text-green-600">Enquiries</h3>
                        {error && <p className="text-red-600">{error}</p>}

                        <table className="table-auto border-collapse">
                            <thead>
                                <tr className="text-left bg-green-100">
                                    <th className="px-4 py-2 border">Company Name</th>
                                    <th className="px-4 py-2 border">Contact Person</th>
                                    <th className="px-4 py-2 border">Lead Medium</th>
                                    <th className="px-4 py-2 border">Lead Priority</th>
                                    <th className="px-4 py-2 border">Enquiry Type</th>
                                    <th className="px-4 py-2 border">Lead Condition</th>
                                    <th className="px-4 py-2 border">Contact Number</th>
                                    <th className="px-4 py-2 border">Alternate Phone Number</th>
                                    <th className="px-4 py-2 border">Primary Mail</th>
                                    <th className="px-4 py-2 border">Secondary Mail</th>
                                    <th className="px-4 py-2 border">Address</th>
                                    <th className="px-4 py-2 border">Country</th>
                                    <th className="px-4 py-2 border">City</th>
                                    <th className="px-4 py-2 border">Postal Code</th>
                                    <th className="px-4 py-2 border">State</th>
                                    <th className="px-4 py-2 border">Remarks</th>
                                    <th className="px-4 py-2 border">Assign Employee ID</th>
                                    <th className="px-4 py-2 border">Lot</th> 
                                    <th className="px-4 py-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiryData.map((data) => (
                                    <tr key={data._id} className="hover:bg-green-50">
                                        <td className="px-4 py-2 border">{data?.LeadDetails?.companyName || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.LeadDetails?.clientName || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.LeadDetails?.LeadMedium || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.LeadDetails?.LeadPriority || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.LeadDetails?.EnquiryType || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.LeadDetails?.Leadcondition || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.ContactDetails?.MobileNumber || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.ContactDetails?.AlternateMobileNumber || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.ContactDetails?.PrimaryMail || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.ContactDetails?.SecondaryMail || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.AddressDetails?.Address || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.AddressDetails?.Country || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.AddressDetails?.City || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.AddressDetails?.PostalCode || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.AddressDetails?.State || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.DescriptionDetails || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{data?.AssignEmployeeId || 'N/A'}</td> 
                                        <td className="px-4 py-2 border">{data?.Lot || 'N/A'}</td> 
                                        <td className="px-4 py-2 border">
                                            {role === 'sales head' && (
                                                <form onSubmit={(e) => handleSubmit(e, data._id)}>
                                                    <label htmlFor="Eid" className="block mb-1 text-sm">Enter Employee ID:</label>
                                                    <input
                                                        type="text"
                                                        id="Eid"
                                                        value={EidValue}
                                                        onChange={(e) => setEidValue(e.target.value)}
                                                        placeholder="Enter Employee ID"
                                                        className="w-full p-2 border rounded-lg mb-2"
                                                        required
                                                    />
                                                    <button 
                                                        type="submit"
                                                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        Assign
                                                    </button>
                                                </form>
                                            )}

                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <button
                                                    onClick={() => handleComplete(data._id)}
                                                    className="py-1 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                >
                                                    Complete
                                                </button>
                                                
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={Quotation}
                                                        className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        Quotation
                                                    </button>
                                                    <button
                                                        onClick={Salesorder}
                                                        className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        Sales Order
                                                    </button>
                                                    <button
                                                        onClick={perfoma}
                                                        className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        Perfoma
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
