"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const Getcustomerdetails = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState(null); // Track which row is expanded
  const [expandedData, setExpandedData] = useState(null); // Store the expanded data for display
  const [showTable, setShowTable] = useState(true); // State to control showing/hiding the table
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query for companyName

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setConversations([]); // Reset the conversations before fetching new data

    try {
      const token = localStorage.getItem("admintokens");
      if (!token) {
        setError("User not authenticated.");
        return; // Exit early if user is not authenticated
      }

      const response = await axios.get(`http://localhost:5005/api/cc/getconverteddata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.customerData || [];
      if (data.length > 0) {
        setConversations(data);
      } else {
        setError("No conversations found.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch data from server.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRowView = (index, conversation) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      setExpandedData(null); // Reset the expanded data when collapsing
      setShowTable(true); // Show the table again when collapsing
    } else {
      setExpandedRow(index);
      setExpandedData(conversation); // Set the expanded data to be displayed in a separate box
      setShowTable(false); // Hide the table when expanding the row
    }
  };

  const handleBackClick = () => {
    router.push('/SaleteamDasboard/Dasboard');
  };

  const filteredConversations = conversations.filter(conversation => 
    conversation.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.PANnumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.GSTNnumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Completed Enquiries</h1>
        <button
          onClick={handleBackClick}
          className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <ChevronLeft size={24} />
        </button>

        {loading && <p className="text-center text-green-600">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Show the search input only when the table is shown (not expanded) */}
        {showTable && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Company Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {showTable && filteredConversations.length > 0 ? (
          <div className="overflow-auto max-h-96">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-green-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">PANnumber</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">GSTNnumber</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Company Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredConversations.map((conversation, index) => (
                  <tr key={index} className="border-b hover:bg-green-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{conversation.PANnumber || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{conversation.GSTNnumber || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{conversation.companyName || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <button
                        onClick={() => toggleRowView(index, conversation)}
                        className="text-green-500 hover:text-green-700 focus:outline-none"
                      >
                        {expandedRow === index ? "View Less" : "View More"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          showTable && (
            <p className="text-center text-gray-600">No conversations to display</p>
          )
        )}

        {/* Conditionally render expanded data */}
        {expandedData && !showTable && expandedRow !== null && (
          <div className="mt-6 p-4 border border-green-200 rounded-lg bg-green-50">
            <h2 className="text-xl font-semibold text-green-600">Expanded Data</h2>
            <div className="space-y-4 mt-4">
              <div><strong>PANnumber:</strong> {expandedData.PANnumber || 'N/A'}</div>
              <div><strong>GSTNnumber:</strong> {expandedData.GSTNnumber || 'N/A'}</div>
              <div><strong>companyName:</strong> {expandedData.companyName || 'N/A'}</div>
              <div><strong>Customer Address:</strong> {expandedData.AddressDetails?.Address || 'N/A'}</div>
              <div><strong>Customer Country:</strong> {expandedData.AddressDetails?.Country || 'N/A'}</div>
              <div><strong>Customer City:</strong> {expandedData.AddressDetails?.City || 'N/A'}</div>
              <div><strong>Customer Postal Code:</strong> {expandedData.AddressDetails?.PostalCode || 'N/A'}</div>
              <div><strong>Customer State:</strong> {expandedData.AddressDetails?.State || 'N/A'}</div>
            </div>

            {/* If there are conversion details, show them */}
            {expandedData.customerconvert && expandedData.customerconvert.length > 0 && (
              <div className="overflow-x-auto mt-4">
                <h4 className="font-semibold">Customer Conversion Details:</h4>
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Client Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Mobile</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Primary Email</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Followup person</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expandedData.customerconvert.map((customer, idx) => (
                      <tr key={idx} className="border-b hover:bg-green-50">
                        <td className="px-4 py-2 text-sm text-gray-700">{customer?.clientName || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{customer?.CustomerDetails?.MobileNumber || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{customer?.CustomerDetails?.PrimaryMail || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{customer?.Eid || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{customer?.createdAt 
    ? new Date(customer.createdAt).toLocaleDateString('en-GB') 
    : 'N/A'
  }</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-center">
              <button
                onClick={() => toggleRowView(expandedRow, expandedData)}
                className="text-green-500 hover:text-green-700 focus:outline-none"
              >
                View Less
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Getcustomerdetails;
