'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const Servicedetails = () => {
    const [service, setService] = useState({
        clientName: '',
        Customerinward: '',
        quantity: '',
        servicestartdate: '',
        Material: '',
        Model: '',
        SerialNo: '',
        powerconsumption: '',
        serviceStatus: '',
        BillingStatus: '',
        Employeeid: '',
        serviceenddate: '',
        Eid: '', 
        customerComplaint: '',  
        engineerProblem: '',  
    });

    const [EidToAssign, setEidToAssign] = useState('');
    const [saleEmployeeId, setSaleEmployeeId] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const token = localStorage.getItem('admintokens');
    const searchparams = useSearchParams();
    const clientName = searchparams.get('clientName');
    const storedEmployeeid = localStorage.getItem('idstore');

    // Fetch the sales employee list
    const fetchSalesEmployeeList = async () => {
        try {
            const response = await axios.get('http://localhost:5005/api/getsalesemployeeEid', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.data?.getallEid) {
                setSaleEmployeeId(response.data.getallEid);
            }
        } catch (err) {
            console.error('Error fetching Sales Employee data:', err);
            setErrorMessage('Failed to fetch Sales Employee IDs');
        }
    };

    useEffect(() => {
        if (clientName) {
            setService((prevState) => ({
                ...prevState,
            }));
        }
        if (storedEmployeeid) {
            setService((prevState) => ({
                ...prevState,
                Employeeid: storedEmployeeid,
            }));
        }
        fetchSalesEmployeeList();
    }, [clientName, storedEmployeeid]);

    
    useEffect(() => {
        if (EidToAssign) {
            setService((prevState) => ({
                ...prevState,
                Eid: EidToAssign, // Update the Eid when EidToAssign changes
            }));
        }
    }, [EidToAssign]); // Re-run this effect whenever EidToAssign changes

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure EidToAssign is selected
        if (!EidToAssign) {
            alert('Please select a valid Eid.');
            return;
        }

        // Check if the token exists
        if (!token) {
            alert('No token found. Please login as an admin.');
            return;
        }

        try {
            console.log('Before submitting data:', service); // Log the service state
            const response = await axios.post('http://localhost:5005/api/servicedetails', service, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Server response:', response);

            alert('Successfully submitted');
            // Reset the form state after successful submission
            setService({
                clientName: '',
                Customerinward: '',
                quantity: '',
                servicestartdate: '',
                Material: '',
                Model: '',
                SerialNo: '',
                powerconsumption: '',
                serviceStatus: '',
                BillingStatus: '',
                Employeeid: '',
                serviceenddate: '',
                Eid: '', 
                customerComplaint: '',  
                engineerProblem: '',  
            });
            setEidToAssign('');
        } catch (err) {
   
            console.error('Error submitting service entry:', err);
            if (err.response) {
                console.error('Response Error:', err.response.data);
                alert(`Something went wrong: ${err.response.data.message || 'Please try again later.'}`);
            } else if (err.request) {
                console.error('Request Error:', err.request);
                alert('Network error. Please check your connection.');
            } else {
                console.error('General Error:', err.message);
                alert('An unexpected error occurred.');
            }
        }
    };

 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setService({
            ...service,
            [name]: value,
        });
    };
    const handlenavigate = () =>{
        router.push('/ServiceProject/Dasboard');
    }
    return (
        <div className="max-w-4xl mx-auto p-4 bg-green-400">
         <h1 className='text-20 font-bold text-blue-800 pl-30'>Service Details Form</h1>   
        <button onClick={handlenavigate} className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6">
            <ChevronLeft size={24} />
        </button>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          
            <div>
                <label className="block text-sm font-semibold text-gray-700">Customer Inward</label>
                <input
                    type="text"
                    name="Customerinward"
                    placeholder="Customer Inward"
                    value={service.Customerinward}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

           
            <div>
                <label className="block text-sm font-semibold text-gray-700">Company Name</label>
                <input
                    type="text"
                    name="clientName"
                    placeholder="Company Name"
                    value={service.clientName}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-gray-100"
                />
            </div>

        
            <div>
                <label className="block text-sm font-semibold text-gray-700">Quantity</label>
                <input
                    type="text"
                    name="quantity"
                    placeholder="Quantity"
                    value={service.quantity}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

           
            <div>
                <label className="block text-sm font-semibold text-gray-700">Date</label>
                <input
                    type="date"
                    name="servicestartdate"
                    value={service.servicestartdate}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

      
            <div>
                <label className="block text-sm font-semibold text-gray-700">Employee ID</label>
                <input
                    type="text"
                    name="Employeeid"
                    placeholder="Employee ID"
                    value={service.Employeeid}
                    onChange={handleChange}
                    disabled
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-gray-100"
                />
            </div>

           
            <div>
                <label className="block text-sm font-semibold text-gray-700">Enquiry Followperson</label>
                <select
                    name="Eid"
                    value={EidToAssign}
                    onChange={(e) => setEidToAssign(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                    <option value="">Select ID</option>
                    {saleEmployeeId.length > 0 ? (
                        saleEmployeeId.map((employee, index) => (
                            <option key={index} value={employee.Eid}>
                                {employee.Eid} - {employee.name}
                            </option>
                        ))
                    ) : (
                        <option>No data found</option>
                    )}
                </select>
            </div>

        
            <div>
                <label className="block text-sm font-semibold text-gray-700">Material Name</label>
                <input
                    type="text"
                    name="Material"
                    placeholder="Material Name"
                    value={service.Material}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            
            <div>
                <label className="block text-sm font-semibold text-gray-700">Model</label>
                <input
                    type="text"
                    name="Model"
                    placeholder="Model Number"
                    value={service.Model}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

       
            <div>
                <label className="block text-sm font-semibold text-gray-700">Serial No</label>
                <input
                    type="text"
                    name="SerialNo"
                    placeholder="Serial Number"
                    value={service.SerialNo}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            
            <div>
    <label className="block text-sm font-semibold text-gray-700">HP/KW</label>
    <input
        type="text"
        name="powerconsumption"
        placeholder="HP/KW"
        value={service.powerconsumption}
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
    />
</div>


            
            <div>
                <label className="block text-sm font-semibold text-gray-700">Service Status</label>
                <input
                    type="text"
                    name="serviceStatus"
                    placeholder="Service Status"
                    value={service.serviceStatus}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            
            <div>
                <label className="block text-sm font-semibold text-gray-700">Service End Date</label>
                <input
                    type="date"
                    name="serviceenddate"
                    value={service.serviceenddate}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

        
            <div>
                <label className="block text-sm font-semibold text-gray-700">Billing Status</label>
                <input
                    type="text"
                    name="BillingStatus"
                    placeholder="Billing Status"
                    value={service.BillingStatus}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            <div>
    <label className="block text-sm font-semibold text-gray-700">Customer Complaint</label>
    <textarea
        name="customerComplaint"
        placeholder="Describe the customer complaint"
        value={service.customerComplaint}
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
    />
</div>

<div>
    <label className="block text-sm font-semibold text-gray-700">Engineer Problem</label>
    <textarea
        name="engineerProblem"
        placeholder="Describe the engineer's problem"
        value={service.engineerProblem}
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
    />
</div>


           
            <div className="mt-6">
                <button type="submit" className="w-full p-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none">
                    Submit
                </button>
            </div>
        </form>

    
        {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
    </div>
);
};

export default Servicedetails;
