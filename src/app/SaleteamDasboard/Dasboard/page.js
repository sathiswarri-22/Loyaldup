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
        const [quotationIcons, setQuotationIcons] = useState({});
        const [enquiry,setEnquiry] = useState('');
        const [conversionStatus, setConversionStatus] = useState({});
       
        const [EidToAssign, setEidToAssign] = useState("");
        const [saleEnquiryData, setSaleEnquiryData] = useState([]);
        const [selectedEnquiries, setSelectedEnquiries] = useState([]);
        const [selectEnquiry, setSelectEnquiry] = useState([]);
    
        const [saleEmployeeId, setSaleEmployeeId] = useState([]);
        const [otherEmployee, setOtherEmployee] = useState([]);
        const [error, setError] = useState(null);
        const [allenquiry,SetAllenquiry]=useState([]);
    
        const [clickedEnquiryNo, setClickedEnquiryNo] = useState(null);

        const router = useRouter();
    
        
       
        useEffect(() => {
            const storedToken = localStorage.getItem('admintokens');
            const storedEid = localStorage.getItem('idstore');
            const storedRole = localStorage.getItem('role');
        
            console.log('Token:', storedToken);
            console.log('Eid:', storedEid);
            console.log('Role:', storedRole);
        
            setToken(storedToken);
            setEid(storedEid);
        }, []); // ✅ This makes sure it only runs once
        

        const checkConversionStatus = async (enquiryList) => {
            try {
                if (!enquiryList || enquiryList.length === 0) return;
    
                const enquiryParam = enquiryList.join(',');
                const response = await axios.get(
                    `http://localhost:5005/api/cc/getMultipleEnquiryStatuses?enquiryNos=${enquiryParam}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
    
                const statusMap = response.data;
    
                setConversionStatus(prevState => {
                    const updatedStatus = { ...prevState };
                    enquiryList.forEach(enqNo => {
                        const shouldHide = statusMap[enqNo]?.shouldHideButtons ?? false;
                        updatedStatus[enqNo] = shouldHide;
                    });
                    console.log("Updated conversion statuses:", updatedStatus);
                    return updatedStatus;
                });
    
            } catch (err) {
                console.error("Error fetching conversion statuses:", err);
            }
        };

        // Check conversion status for each enquiry when data is fetched
        useEffect(() => {
            if (allenquiry?.length) {
                console.log("Checking conversion status for all enquiries:", allenquiry);
                checkConversionStatus(allenquiry);
            }
        }, [allenquiry]);
          // Runs every time allenquiry changes
        
        
        

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
    
            if (role === "sales head") {
                console.log("Sales Head Enquiries Data:", response.data);
                setEnquiryData(response.data || []);
            } else {
                const data = response.data.getdatas || [];
                console.log("Sales Team Enquiries Data:", data);
    
                setSaleEnquiryData(data);
                const allEnquiryNos = data.map(item => item.EnquiryNo);
                SetAllenquiry(allEnquiryNos);
    
                const firstEnquiryNo = allEnquiryNos[0];
                setEnquiry(firstEnquiryNo);
                console.log("First EnquiryNo:", firstEnquiryNo);
    
                // Fetch icon for each enquiry
                data.forEach(enq => fetchQuotationIcon(enq.EnquiryNo));
    
                // ✅ Check conversion status for all enquiries
                checkConversionStatus(allEnquiryNos);
            }
    
        } catch (err) {
            console.error("Error fetching data:", err);
            if (err.response) {
                console.error("Server Error:", err.response.data);
            } else if (err.request) {
                console.error("Network Error:", err.request);
            } else {
                console.error("Unknown Error:", err.message);
            }
        }
    };
    
    const fetchQuotationIcon = async (enquiry) => {
        const EnquiryNo = enquiry;
       
        if (quotationIcons[EnquiryNo]) {
            console.log(`Icon for EnquiryNo ${EnquiryNo} already fetched.`);
            return;
        }
    
        try {
            const res = await axios.get(`http://localhost:5005/api/getquots/${EnquiryNo}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("Fetched quotation object:", res.data);
            
            const status = res.data?.Status; // Make sure this is safe
            
            if (!status) {
                console.warn(`No Status found in response for EnquiryNo: ${EnquiryNo}`);
                return;
            }
            
            setQuotationIcons(prevState => ({
                ...prevState,
                [EnquiryNo]: status,
            }));
            
        } catch (err) {
            if (err.response?.status !== 404) {
                console.error(`Error fetching for ${EnquiryNo}:`, err);
            }
        }
    };
    useEffect(() => {
        if (enquiry) {
            fetchQuotationIcon(enquiry); // Now it will work correctly
        }
    }, [enquiry]);
        
    

        useEffect(() => {
            if (token && Eid) {
              fetchData();
              fetchSalesEmployeeList();
              fetchOtherEmployees();
            }
          }, [token, Eid]); // ✅ Only runs after both are available
          
    
            
    

        
    
    const handleSelectEnquiry = (EnquiryNo) => {
        console.log("Updated head selection:", EnquiryNo); 
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
        console.log("Updated employee selection:", EnquiryNo); 
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
                setClickedEnquiryNo(EnquiryNo); 
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
        const ProductRequest = () => {
            router.push('/SaleteamDasboard/Productrequest');
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
        const overallcustomerconvert = () =>{
            try{
                router.push('/SaleteamDasboard/Getcustomerdetails');
            }catch(err){
                console.log('cannot goes to the link',err)  
            }
        }  
        const POgetted = () =>{
            try{
                router.push('/SaleteamDasboard/GetPO');
            }catch(err){
                console.log('cannot goes to the link',err)  
            }
        }
        const perfomaInvoice = () => {
            router.push('/SaleteamDasboard/GetPI');
        };
        const GetQuotaionEid = () => {
            router.push('/SaleteamDasboard/GetEidQuotation');
        };
        
        if (error) {
            return <div>Error: {error}</div>;
        }

        const currentDate = new Date(); 
        const istDate = new Date(currentDate.getTime() + (5.5 * 60 * 60 * 1000)); 
        console.log(istDate.toLocaleString()); 
        

        
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
                                onClick={overallcustomerconvert}
                                className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                OverallCustomer
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
                            <button
                                onClick={ProductRequest}
                                className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                Product Request
                            </button>
                            <button
                                onClick={POgetted}
                                className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                Purchase order
                            </button>
                            <button
                                onClick={perfomaInvoice}
                                className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                Perfoma Invoice
                            </button>
                            <button
                                onClick={GetQuotaionEid}
                                className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                ViewQuotaion
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
                                                   <th className="px-4 py-2">Select</th>
                                                 
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
        <th className="px-4 py-2">Date</th>
        {role === "Sales Employee" && (
    <>
        <th className="px-4 py-2">CUSTOMER CONVERTION</th>  
        <th className="px-4 py-2">ACTION</th>
        <th className="px-4 py-2">STATUS</th>
       
    </>
)}


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
                                                                <td className="px-4 py-2">{data?.DescriptionDetails || "N/A"}</td>
                                                                <td className="px-4 py-2">
  {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"}
</td> 
                                                               
                                                                {selectedEnquiries[0] === data.EnquiryNo?<td>
                                                                    <div className="flex flex-col space-y-5 md:flex-row md:items-end md:space-y-0 md:space-x-5">
  <div className="flex-grow relative">
    <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">
      Assigning Employee
    </label>
    
    <div className="relative group">
      <select
        name="Eid" 
        value={EidToAssign}
        onChange={(e) => setEidToAssign(e.target.value)}
        className="block w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 pr-10 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200 ease-in-out shadow-sm hover:border-gray-300"
      >
        <option value="">Select Employee</option>
        {saleEmployeeId.length > 0 ? (
          saleEmployeeId.map((employee, index) => (
            <option key={index} value={employee.Eid}>
              {employee.Eid} - {employee.name}
            </option>
          ))
        ) : (
          <option disabled>No employees available</option>
        )}
      </select>
      
      {/* Custom dropdown icon with animation */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
        <svg className="h-5 w-5 transform group-hover:translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      
      {/* Bottom border animation on hover */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-[calc(100%-20px)] transition-all duration-300"></div>
    </div>
  </div>
  
  <button
    type="submit"
    disabled={!EidToAssign || selectedEnquiries.length === 0}
    className="relative overflow-hidden px-6 py-3.5 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-out disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0"
  >
    <span className="relative z-10 flex items-center justify-center">
      {selectedEnquiries.length > 0 ? (
        <>
          <span>Assign</span>
          <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs font-semibold">{selectedEnquiries.length}</span>
        </>
      ) : (
        'Assign'
      )}
    </span>
    {/* Hover effect overlay */}
    <span className="absolute top-0 left-0 w-full h-0 bg-blue-700 transition-all duration-300 ease-out group-hover:h-full"></span>
  </button>
</div>
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
                                                                <td className="px-4 py-2">{data?.DescriptionDetails || "N/A"}</td>
                                                                <td className="px-4 py-2">
  {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"}
</td>


                                                    
 
                                                    {
    !conversionStatus[data?.EnquiryNo]
    ? (
        <td>
            <div className="flex space-x-4 mt-2">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleCustomerConversion('yes', data.EnquiryNo);
                    }}
                    className="relative group ml-6"
                >
                    <img src="/yes.png" alt="Convert" width={24} />
                    <span className="absolute right-full top-1/2 -translate-y-1/2 ml-4 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Convert
                    </span>
                </button>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleNotConverted('no', data.EnquiryNo);
                    }}
                    className="relative group ml-8"
                >
                    <img src="/no.png" alt="Not Convert" width={24} />
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Not Convert
                    </span>
                </button>
            </div>
        </td>
    ) : (
        <td>
            <div
                className="w-4 h-4 ml-5 mt-2 text-red-500 "
               
            >already converted</div>
        </td>
    )
}






        
                                                                <td className="px-4 py-2">
                                                                
                                                                <button
    onClick={(e) => {
        e.preventDefault();
        handleClick('quotation', data.EnquiryNo);
    }}
    className="relative group"
>
    {quotationIcons[data.EnquiryNo] === 'Editaccess' || quotationIcons[data.EnquiryNo] === 'quotsaccess' ? (
        <img
            src={'/quots.png'}
            alt="Quotation Status"
            width={24}
            height={24}
        />
    ) : (
        <img
            src={'/unsend.png'}
            alt="Quotation Status"
            width={24}
            height={24}
        />
    )}
    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Generate Quotation
    </span>
</button>

    </td>
    <td>
    <button
            onClick={(e) =>{e.preventDefault();
                handleEnquiryClick('enquiry', data.EnquiryNo)}} 
        className="relative group"
        >
        <img src="/viewstatus.png" alt="View Status" width={24} height={24} className="filter invert sepia-0 saturate-100 hue-rotate-120 brightness-100 contrast-100" />
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        view status 
    </span>
        </button>
        </td>
      
    
    {selectEnquiry[0] === data.EnquiryNo ? (
  <td className="py-3 px-4">
    {(role === "sales Employee" ||
      data?.LeadDetails?.EnquiryType === "Project" ||
      data?.LeadDetails?.EnquiryType === "Service") && (
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <select
          name="Eid"
          value={EidToAssign}
          onChange={(e) => setEidToAssign(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
        >
          <option value="">Select Employee ID</option>
          {otherEmployee.length > 0 ? (
            otherEmployee.map((employee, index) => (
              <option key={index} value={employee.Eid}>
                {employee.Eid} - {employee.name}
              </option>
            ))
          ) : (
            <option value="">No data found</option>
          )}
        </select>
        <button
          type="submit"
          disabled={!EidToAssign || selectEnquiry.length === 0}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          Assign
        </button>
      </div>
    )}
  </td>
) : null}
    

    
                                                            </tr>
                                                        )) : <tr><td colSpan="20">No sales enquiries available</td></tr>
                                                }
                                            
                                            </tbody>
                                        
                                            
                                        </table>
                                        
                                        {role === "sales head" && (
        <>
            
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