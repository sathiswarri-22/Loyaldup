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
    const [selectEnquiry, setSelectEnquiry] = useState([]);
   
    const [saleEmployeeId, setSaleEmployeeId] = useState([]);
    const [otherEmployee, setOtherEmployee] = useState([]);
    const [error, setError] = useState(null);
  
    const [clickedEnquiryNo, setClickedEnquiryNo] = useState(null);

    const router = useRouter();
 
    
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

    

    // Fetch Sales Employee List
  const fetchSalesEmployeeList = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/getsalesemployeeEid", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data?.getallEid) {
        setSaleEmployeeId(response.data.getallEid);
      }
    } catch (err) {
      console.error("Error fetching Sales Employee data:", err);
      setError("Failed to fetch Sales Employee IDs");
    }
  };

  // Fetch Other Employees List
  const fetchOtherEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/getotheremployeeEid", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data?.getallothersEid) {
        setOtherEmployee(response.data.getallothersEid);
      }
    } catch (err) {
      console.error("Error fetching Other Employee data:", err);
      setError("Failed to fetch Other Employee IDs");
    }
  };

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

    useEffect(() => {
        if (!token) return;
        
        fetchData();
       
        fetchSalesEmployeeList();
        fetchOtherEmployees();
            
        
    }, [Eid, token, role]);
    
    
  

    
   // Handle Enquiry Selection for Sales Head
const handleSelectEnquiry = (EnquiryNo) => {
    console.log("Updated head selection:", EnquiryNo); // Debugging log
    setSelectedEnquiries((prevSelectedEnquiries) => {
      if (prevSelectedEnquiries.includes(EnquiryNo)) {
        return prevSelectedEnquiries.filter((id) => id !== EnquiryNo);
        
      } else {
        console.log([...prevSelectedEnquiries, EnquiryNo][0])
        return [...prevSelectedEnquiries, EnquiryNo];
        
      }
    });
    
  };
  
  const handleSelectEnquies = (EnquiryNo) => {
    console.log("Updated employee selection:", EnquiryNo); // Debugging log
  setSelectEnquiry((prevSelectedEnquiry) => {
    if (prevSelectedEnquiry.includes(EnquiryNo))
        {
      return prevSelectedEnquiry.filter((id) => id !== EnquiryNo)
     }else{
        return  [...prevSelectedEnquiry, EnquiryNo];
     }
  });
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

    const assignService = async (e) => {
        e.preventDefault();
      
        // Make sure at least one enquiry is selected
        if (!EidToAssign) return alert("Please enter an Eid to assign.");
        if (selectEnquiry.length === 0) return alert("Please select at least one enquiry.");
      
        try {
          // API call to assign service to the selected enquiries
          const response = await axios.put(
            "http://localhost:5005/api/assignedtoservice",
            {
              Eid: EidToAssign,
              EnquiryNo: selectEnquiry, // Send selected enquiries for service assignment
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
      
          alert(response.data.message || "Successfully updated");
          setEidToAssign({});
          setSelectEnquiry([]);
          fetchData();
        } catch (err) {
          console.error("Error in updating:", err);
          alert("Failed to update assignments");
        }
      };

    const handleClick = (buttonType, EnquiryNo) => {
        if (buttonType === 'quotation') {
            setClickedEnquiryNo(EnquiryNo); // Track the clicked enquiry
            router.push(`/SaleteamDasboard/Quotation?EnquiryNo=${EnquiryNo}`); // Navigate to the quotation page
        }
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


    const handleEnquiryClick = (buttonType, EnquiryNo) => {
        if (buttonType === 'enquiry') {
            router.push(`/SaleteamDasboard/EnquiryStatus?EnquiryNo=${EnquiryNo}`);
        }
    };
    
   
    
    
    const ViewProfile = () => {
        router.push('/SaleteamDasboard/viewprofile');
    };

    const EnterEnquiries = () => {
        router.push('/SaleteamDasboard/Enquirypage');
    };

    const CustomerNotConverted = () => {
        router.push('/SaleteamDasboard/Cnc');
    };


    const customerconverted = () => {
        router.push('/SaleteamDasboard/CustomerConverted');
    };

    const Inventory = () => {
        router.push('/SaleteamDasboard/Inventory');
    };
    const viewleadenquiry = () =>{
        try{
             router.push('/SaleteamDasboard/Leadenquiryview');
        }catch(err){
            console.log('cannot goes to the link',err)
        }
    }

    if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error}</div>;
      }

      const currentDate = new Date(); // Current time in UTC
      const istDate = new Date(currentDate.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST (UTC +5:30)
      console.log(istDate.toLocaleString()); // Prints the date in IST
      

    
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
                            <>
                            <button
                                onClick={EnterEnquiries}
                                className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                Enter Enquiries
                            </button>
                            <button 
                            onClick={viewleadenquiry}
                            className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"

                            >
                                ViewleadEnquires
                            </button>
                            </>
                            
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
                            <form onSubmit={role === "sales head" || selectedEnquiries.length > 0? handlesubmit : selectEnquiry.length > 0 ? assignService : null} className="space-y-6">
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
                                                <th className="px-4 py-2">Date</th>
                                                <th className="px-4 py-2">ACTION</th>
                                                <th className="px-4 py-2">CUSTOMER CONVERTION</th>
                                                <th className="px-4 py-2">STATUS</th>



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
<td className="px-4 py-2">
    <button
        onClick={() => handleEnquiryClick('enquiry', data.EnquiryNo)} 
        className="px-4 py-2 rounded-md transition duration-300 ml-2 bg-blue-600 hover:bg-blue-700"
    >
        View Status
    </button>
</td>


                                                               
                                                            </td>
                                                            {selectedEnquiries[0] === data.EnquiryNo?<td>
                        <label>Assigning Eid</label>
                        <select
                          name="Eid"
                          value={EidToAssign}
                          onChange={(e) => setEidToAssign(e.target.value)}
                        >
                          <option>Select Employee Id</option>
                          {saleEmployeeId.length > 0 ? (
                            saleEmployeeId.map((employee, index) => (
                              <option key={index} value={employee.Eid}>
                                {employee.Eid}
                              </option>
                            ))
                          ) : (
                            <option>No data found</option>
                          )}
                        </select>
                        <button type="submit" disabled={!EidToAssign || selectedEnquiries.length === 0}>
                          Assign
                        </button>
                      </td>:null}
                                                        </tr>
                                                    )) : <tr><td colSpan="20">No enquiries available</td></tr>
                                                : saleEnquiryData.length > 0
                                                    ? saleEnquiryData.map((data) => (
                                                        <tr key={data._id} className="border-t border-green-200">
                                                            <td>
                        
                        <input
                          type="checkbox"
                          checked={selectEnquiry.includes(data.EnquiryNo)}
                          onChange={() => handleSelectEnquies(data.EnquiryNo)}
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
                                                            <td className="px-4 py-2">
                                                            {data?.createdAt ? new Date(data?.createdAt).toLocaleString() : "N/A"}
                                                            </td>    
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
        
    <button
        onClick={() => handleEnquiryClick('enquiry', data.EnquiryNo)} 
        className="px-4 py-2 rounded-md transition duration-300 ml-2 bg-blue-600 hover:bg-blue-700"
    >
        View Status
    </button>

    </div>
 </td>
 {selectEnquiry[0] === data.EnquiryNo ? <td>
                        {(role === "sales Employee" ||
                          data?.LeadDetails?.EnquiryType === "Project" ||
                          data?.LeadDetails?.EnquiryType === "Service") && (
                          <select
                            name="Eid"
                            value={EidToAssign}
                            onChange={(e) => setEidToAssign(e.target.value)}
                          >
                            <option>Select Employee Id</option>
                            {otherEmployee.length > 0 ? (
                              otherEmployee.map((employee, index) => (
                                <option key={index} value={employee.Eid}>
                                  {employee.Eid}
                                </option>
                              ))
                            ) : (
                              <option>No data found</option>
                            )}
                          </select>
                        )}
                        <button type="submit" disabled={!EidToAssign || selectEnquiry.length === 0}>
                          Assign
                        </button>
                      </td>:null}
 

 
                                                        </tr>
                                                    )) : <tr><td colSpan="20">No sales enquiries available</td></tr>
                                            }
                                           
                                        </tbody>
                                      
                                        
                                    </table>
                                    
                                    {role === "sales head" && (
    <>
        {/* Employee ID Input */}
        {/* <div>
            <label className="block text-lg text-gray-700">Enter Employee ID (Eid)</label>
            <input
                type="text"
                value={EidToAssign}
                onChange={(e) => setEidToAssign(e.target.value)}
                className="w-full p-2 mt-2 border rounded-md"
                placeholder="Employee ID"
            />
        </div> */}

        {/* Assign Button */}
        {/* <div className="text-center">
            <button 
                type="submit" 
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-300"
            >
                Assign Enquiry to Employee
            </button>
        </div> */}
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


