"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Dashboard = () => {
    const role = localStorage.getItem('role');
    const [completedEnquiries, setCompletedEnquiries] = useState([]);
    const [enquiryData, setEnquiryData] = useState([]);
    const [token, setToken] = useState(null);
    const [Eid, setEid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [EidToAssign, setEidToAssign] = useState("");
    const [saleEnquiryData, setSaleEnquiryData] = useState([]);
    const [selectedEnquiries, setSelectedEnquiries] = useState([]);
    const [QuotationColor, setQuotationColor] = useState('');
    
    const [clickedEnquiryNo, setClickedEnquiryNo] = useState(null);

    const router = useRouter();
    


    useEffect(() => {
        const storedEnquiries = localStorage.getItem('EnquiryNo');
        
        if (storedEnquiries) {
            try {
                const parsedEnquiries = JSON.parse(storedEnquiries);
                setEnquiryData(parsedEnquiries);
            } catch (e) {
                console.error("Error parsing EnquiryNo from localStorage:", e);
                setEnquiryData([]); // Set to an empty array if the data is invalid
                localStorage.removeItem('EnquiryNo'); // Optionally clear invalid data from localStorage
            }
        } else {
            setEnquiryData([]); // If no data is found in localStorage, set to empty array
        }
    }, []);
    
    useEffect(() => {
        const storedToken = localStorage.getItem('admintokens');
        const storedEid = localStorage.getItem('idstore');
        const storedRole = localStorage.getItem('role'); // Ensure role is being saved to localStorage
        console.log('Token:', storedToken); // Log the token
        console.log('Eid:', storedEid);     // Log the Eid
        console.log('Role:', storedRole);   // Log the role
        setToken(storedToken);
        setEid(storedEid);
    }, []);

    useEffect(() => {
        const storedEnquiries = JSON.parse(localStorage.getItem('EnquiryNo')) || [];
        setEnquiryData(storedEnquiries);
    }, []);

    const saveToLocalStorage = (EnquiryNo) => {
        localStorage.setItem('EnquiryNo', JSON.stringify(EnquiryNo));
    };

   

    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                console.log("Fetching data for role:", role);
                setLoading(true);
                const response =
                    role === "sales head"
                        ? await axios.get('http://localhost:5005/api/headenquiry', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        })
                        : await axios.get(
                            `http://localhost:5005/api/getenquiryforsaletam/${Eid}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                console.log("API Response:", response);
                if (role === "sales head") {
                    console.log("Sales Head Enquiries Data: ", response.data);
                    setEnquiryData(response.data || []);
                } else {
                    console.log("Sales Team Enquiries Data: ", response.data.getdatas);
                    setSaleEnquiryData(response.data.getdatas || []);
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error("Error fetching data: ", err);
                if (err.response) {
                    console.error("Server Error: ", err.response.data);
                } else if (err.request) {
                    console.error("Network Error: ", err.request);
                } else {
                    console.error("Unknown Error: ", err.message);
                }
            }
        };
        fetchData();
    }, [Eid, token, role]);
    
    
  

    useEffect(() => {
        const storedCompletedEnquiries = JSON.parse(localStorage.getItem('completedEnquiries')) || [];
        setCompletedEnquiries(storedCompletedEnquiries);
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem('admintokens'));
        setEid(localStorage.getItem('idstore'));
    }, []);

    const handleselectEnquiry = (EnquiryNo) => {
        console.log('Before update:', selectedEnquiries);
        if (selectedEnquiries.includes(EnquiryNo)) {
            setSelectedEnquiries(selectedEnquiries.filter((enquiry) => enquiry !== EnquiryNo));
        } else {
            setSelectedEnquiries([...selectedEnquiries, EnquiryNo]);
        }
        console.log('After update:', selectedEnquiries);
    };
    
    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            if (!EidToAssign) return alert("Please enter an Eid to assign.");
            if (selectedEnquiries.length === 0) return alert("Please select at least one enquiry.");

            const response = await axios.put(
                `http://localhost:5005/api/assignedto`,
                {
                    Eid: EidToAssign,
                    EnquiryNo: selectedEnquiries,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert(response.data.message || "Successfully updated");

            setEidToAssign("");
            setSelectedEnquiries([]);
            setEnquiryData([]);
        } catch (err) {
            console.error("Error in updating:", err);
            alert("Failed to update assignments");
        }
    };

    const handleComplete = async (EnquiryNo) => {
        try {
            const response = await axios.put(
                `http://localhost:5005/api/Enquiries/${EnquiryNo}`,
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (response && response.status === 200) {
                console.log('API Response:', response);
            
                const updatedEnquiry = response.data; // The updated subdocument returned from backend
                const updatedEnquiries = enquiryData.filter((enquiry) => enquiry._id !== EnquiryNo);
            
                // Add the updated enquiry subdocument to the filtered list
                updatedEnquiries.push(updatedEnquiry);
            
                setEnquiryData(updatedEnquiries);
                localStorage.setItem('EnquiryNo', JSON.stringify(updatedEnquiries));
                alert('Enquiry marked as completed');
            }
            
        } catch (err) {
            console.error('Error during completion:', err);
            alert('Failed to complete enquiry');
        }
    };
    
    
    const handleClick = (buttonType, EnquiryNo) => {
        if (buttonType === 'quotation') {
            setClickedEnquiryNo(EnquiryNo); // Track the clicked enquiry
            router.push(`/SaleteamDasboard/Quotation?EnquiryNo=${EnquiryNo}`); // Navigate to the quotation page
        }
    };
    
    const quotation = (EnquiryNo) => {
        console.log('Navigating to quotation for:', EnquiryNo);
        router.push('/SaleteamDasboard/Quotation?EnquiryNo=' + EnquiryNo); // Pass the EnquiryNo to the route
    };

    const addEnquiry = (newEnquiry) => {
        const updatedEnquiries = [...enquiryData, newEnquiry];
        setEnquiryData(updatedEnquiries);
        saveToLocalStorage(updatedEnquiries); 
    };

    const handleCustomerConversion = (response, enquiryNo) => {
        if (response === 'yes') {
            
            router.push(`/SaleteamDasboard/customerconversion?EnquiryNo=${enquiryNo}`);
        } else {
            
            alert(`Customer Conversion for EnquiryNo ${enquiryNo} is marked as: No`);
        }
    };

    const handleNotConverted = (response, enquiryNo) => {
        if (response === 'no') {
            
            router.push(`/SaleteamDasboard/customernotconverted?EnquiryNo=${enquiryNo}`);
        } else {
            
            alert(`Customer Conversion for EnquiryNo ${enquiryNo} is marked as: No`);
        }
    };

   
    
    
    const ViewProfile = () => {
        router.push('/SaleteamDasboard/viewprofile');
    };

    const EnterEnquiries = () => {
        router.push('/SaleteamDasboard/Enquirypage');
    };

    const CustomerNotConverted = () => {
        router.push('/SaleteamDasboard/CustomerNotConverted');
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
        router.push('/SaleteamDasboard/CustomerConverted');
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
                            onClick={CustomerNotConverted}
                            className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            Customer Not Converted
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
                            <h1 className="text-4xl font-bold text-center text-green-600 mb-4">Enquiry Data</h1>
                            <form onSubmit={handlesubmit} className="space-y-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto text-left bg-white shadow-lg rounded-lg">
                                        <thead>
                                            <tr className="bg-green-100 text-green-600">
                                                {role === "sales head" && <th className="px-4 py-2">Select</th>}
                                                <th className="px-4 py-2">COMPANY NAME{enquiryData.length}</th>
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
                                                <th className="px-4 py-2">CUSTOMER CONVERTION</th>


                                            </tr>
                                        </thead>
                                        <tbody>
                                            {role === "sales head"
                                                ? enquiryData.length > 0
                                                    ? enquiryData.map((data) => (
                                                        <tr key={data._id} className="border-t border-green-200">
                                                            <td className="px-4 py-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedEnquiries.includes(data.EnquiryNo)}
                                                                    onChange={() => handleSelectEnquiry(data.EnquiryNo)}
                                                                    className="mx-auto"
                                                                />
                                                            </td>
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
                                                            <td className="px-4 py-2">
                                                               
                                                               
                                                                <button
    onClick={() => handleClick('quotation', data.EnquiryNo)}
    className={`px-4 py-2 rounded-md transition duration-300 ml-2 ${clickedEnquiryNo === data.EnquiryNo ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
>
    Quotation
</button>

                                                               
                                                            </td>
                                                        </tr>
                                                    )) : <tr><td colSpan="20">No enquiries available</td></tr>
                                                : saleEnquiryData.length > 0
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
                                                            <td className="px-4 py-2">
                                                               
                                                            <button
    onClick={() => handleClick('quotation', data.EnquiryNo)} 
    className={`px-4 py-2 rounded-md transition duration-300 ml-2 ${clickedEnquiryNo === data.EnquiryNo ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
>
    Quotation
</button>

 </td>

 <td>
 <div className="flex space-x-4 mt-2">
        <button
            onClick={() => handleCustomerConversion('yes', data.EnquiryNo)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
        >
            Yes
        </button>

        <button
            onClick={() => handleNotConverted('no', data.EnquiryNo)}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
        >
            No
        </button>
        
        

    </div>
 </td>

 
                                                        </tr>
                                                    )) : <tr><td colSpan="20">No sales enquiries available</td></tr>
                                            }
                                           
                                        </tbody>
                                      
                                        
                                    </table>
                                    {role === "sales head" && (
    <>
        {/* Employee ID Input */}
        <div>
            <label className="block text-lg text-gray-700">Enter Employee ID (Eid)</label>
            <input
                type="text"
                value={EidToAssign}
                onChange={(e) => setEidToAssign(e.target.value)}
                className="w-full p-2 mt-2 border rounded-md"
                placeholder="Employee ID"
            />
        </div>

        {/* Assign Button */}
        <div className="text-center">
            <button 
                type="submit" 
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-300"
            >
                Assign Enquiry to Employee
            </button>
        </div>
    </>
)}

                                
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

