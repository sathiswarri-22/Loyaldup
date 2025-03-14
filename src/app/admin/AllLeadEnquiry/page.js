"use client"
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const AllLeadEnquiry = () => {
  const router = useRouter()
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [enquiries, setEnquiries] = useState([]);
  const [error, setError] = useState(null);

  const fetchEnquiries = async (e) => {
    e.preventDefault();
    setEnquiries([]);
    setError(null);

    const token = localStorage.getItem('admintokens');
    try {
      console.log("Requesting data with fromDate:", fromDate, "toDate:", toDate);

      // Make the request with fromDate and toDate as query parameters
      const response = await axios.get('https://loyality.chennaisunday.com/api/alldayleadenquiry', {
        params: {
          fromDate,
          toDate
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("Response from backend:", response.data); // Log the backend response

      if (response.data && response.data.length === 0) {
        setError("No Data Available");
      } else {
        setEnquiries(response.data); // Store the enquiry data in the state
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Internal server error.");
    }
  };

  const handleBackClick = () => {
    router.push('/admin/adminDasboard')
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lead Enquiry</h1>
       <button 
                          onClick={handleBackClick}
                          className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                          <ChevronLeft size={24} />
                      </button>
      <form onSubmit={fetchEnquiries} className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="fromDate" className="block text-gray-700 font-medium">From Date:</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="toDate" className="block text-gray-700 font-medium">To Date:</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Fetch Enquiries
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {enquiries.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enquiries</h2>
          <ul className="space-y-4">
            {enquiries.map((enquiry, index) => (
              <li key={index} className="p-4 border border-gray-200 rounded-md shadow-sm">
                <p><strong className="font-semibold text-gray-700">Client Name:</strong> {enquiry?.LeadDetails?.clientName || 'N/A'}</p>
                <p><strong className="font-semibold text-gray-700">Converted Status:</strong> {enquiry?.LeadDetails?.Convertedstatus || 'N/A'}</p>
                <p><strong className="font-semibold text-gray-700">Company Name:</strong> {enquiry?.LeadDetails?.companyName || 'N/A'}</p>
                <p><strong className="font-semibold text-gray-700">Lead Medium:</strong> {enquiry?.LeadDetails?.LeadMedium || 'N/A'}</p>
                <p><strong className="font-semibold text-gray-700">Lead Priority:</strong> {enquiry?.LeadDetails?.LeadPriority || 'N/A'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllLeadEnquiry;
