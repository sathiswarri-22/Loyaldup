"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Dashboard = () => {
    const role = localStorage.getItem('role');
    const [saleEnquiryData, setSaleEnquiryData] = useState([]);
    const [token, setToken] = useState(null);
    const [Eid, setEid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState(null);
    const [email , setEmail ] = useState(null)
    
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
          const storedToken = localStorage.getItem('admintokens');
          const storedEid = localStorage.getItem('idstore');
          const storedName = localStorage.getItem('name');
          const storedEmail = localStorage.getItem('email');
    
          setToken(storedToken);
          setEid(storedEid);
          setName(storedName);
          setEmail(storedEmail);
    
          console.log(storedName);
        }
      }, []);
    

    useEffect(() => {
        if (!token || !Eid) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `https://loyality.chennaisunday.com/api/getenquiryforsaletam/${Eid}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setSaleEnquiryData(response.data.getdatas || []);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error("Error fetching data: ", err);
            }
        };
        fetchData();
    }, [Eid, token]);

    const workvisit = () => {
        try {
            router.push('/Serviceproject/Workvisit');    
        } catch (err) {
            console.log('Cannot go to the link', err);
        }
    };

    const productrequest = () => {
        try {
            router.push('/Serviceproject/ProductRequest');
        } catch (err) {
            console.log('Cannot go to the link', err);
        }
    };

    const ViewProfile = () => {
        router.push('/SaleteamDasboard/viewprofile');
    };

    const Inventory = () => {
        router.push('/SaleteamDasboard/Inventory');
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
                        <button
                            onClick={Inventory}
                            className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            Inventory
                        </button>
                    </nav>

                    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 p-8">
                        <div className="bg-white rounded-xl shadow-2xl p-6">
                            <h1 className="text-4xl font-bold text-center text-green-600 mb-4">Sales Enquiry Data</h1>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto text-left bg-white shadow-lg rounded-lg">
                                    <thead>
                                        <tr className="bg-green-100 text-green-600">
                                            <th className="px-4 py-2">COMPANY NAME</th>
                                            <th className="px-4 py-2">CONTACT PERSON</th>
                                            <th className="px-4 py-2">DEPARTMENT</th>
                                            <th className="px-4 py-2">LEAD MEDIUM</th>
                                            <th className="px-4 py-2">LEAD PRIORITY</th>
                                            <th className="px-4 py-2">ENQUIRY TYPE</th>
                                            <th className="px-4 py-2">LEAD CONDITION</th>
                                            <th className="px-4 py-2">CONTACT NUMBER</th>
                                            <th className="px-4 py-2">ALTERNATE PHONE NUMBER</th>
                                            <th className="px-4 py-2">PRIMARY MAIL</th>
                                            <th className="px-4 py-2">SECONDARY MAIL</th>
                                            <th className="px-4 py-2">ADDRESS</th>
                                            <th className="px-4 py-2">COUNTRY</th>
                                            <th className="px-4 py-2">CITY</th>
                                            <th className="px-4 py-2">POSTAL CODE</th>
                                            <th className="px-4 py-2">STATE</th>
                                            <th className="px-4 py-2">REMARKS</th>
                                            <th className="px-4 py-2">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {saleEnquiryData.length > 0
                                            ? saleEnquiryData.map((data) => (
                                                <tr key={data._id} className="border-t border-green-200">
                                                    <td className="px-4 py-2">{data?.LeadDetails?.companyName || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.LeadDetails?.clientName || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.LeadDetails?.Department || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.LeadDetails?.LeadMedium || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.LeadDetails?.LeadPriority || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.LeadDetails?.EnquiryType || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.LeadDetails?.Leadcondition || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.ContactDetails?.MobileNumber || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.ContactDetails?.AlternateMobileNumber || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.ContactDetails?.PrimaryMail || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.ContactDetails?.SecondaryMail || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.AddressDetails?.Address || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.AddressDetails?.Country || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.AddressDetails?.City || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.AddressDetails?.PostalCode || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.AddressDetails?.State || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.Remarks || "N/A"}</td>
                                                    <td className="px-4 py-2">{data?.Action}</td>
                                                    
                                                    {/* Buttons moved to a separate td */}
                                                    <td className="px-4 py-2">
                                                        {(role === "Service Engineer" || role === "Engineer") && (
                                                            <>
                                                                <button
                                                                    onClick={workvisit}
                                                                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
                                                                >
                                                                    Workvisits
                                                                </button>
                                                                <button
                                                                    onClick={productrequest}
                                                                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
                                                                >
                                                                    Product request
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                            : <tr><td colSpan="18">No sales enquiries available</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
