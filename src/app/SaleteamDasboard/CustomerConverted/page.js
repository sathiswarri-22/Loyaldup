"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";  
import { ChevronLeft } from "lucide-react";

const CompletedEnquiries = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setConversations([]);

    try {
      const token = localStorage.getItem("admintokens");
      const Eid = localStorage.getItem("idstore");
      if (!token) {
        setError("User not authenticated.");
        return;
      }
      
      const response = await axios.get(`http://localhost:5005/api/getenquiries/${Eid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.customerData?.allConversations || [];

      if (data.length > 0) {
        setConversations(data);
      } else {
        setError("No conversations found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data from server.");
    } finally {
      setLoading(false);
    }
  };

 const handleClick = () => {
  router.push('/SaleteamDasboard/SalesOrder')
 }

 const purchaseOrder = (EnquiryNo) => {
  // Navigate to PurchaseOrder page with enquiryNo
  router.push(`/SaleteamDasboard/PurchaseOrder?EnquiryNo=${EnquiryNo}`);
 }

 const perfomaInvoice = (EnquiryNo) => {
  router.push(`/SaleteamDasboard/Perfomainvoice?EnquiryNo=${EnquiryNo}`);
 

 }
 

 const handleBackClick = () => {
  router.push('/SaleteamDasboard/Dasboard');  
};

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

        {conversations.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-green-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Enquiry No</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Client</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Converted Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((conversation, index) => (
                <tr key={index} className="border-b hover:bg-green-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{conversation.EnquiryNo}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{conversation.clientName}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{conversation.Status}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{conversation.Convertedstatus}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 flex space-x-4 items-center">
                    {/* Purchase Order Button */}
                    <button
                      onClick={() => purchaseOrder(conversation.EnquiryNo)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition duration-300 transform hover:scale-105"
                    >
                      Purchase Order
                    </button>

                    {/* Perfoma Invoice Button */}
                    <button
                      onClick={() => perfomaInvoice(conversation.EnquiryNo)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none transition duration-300 transform hover:scale-105"
                    >
                      Perfoma Invoice
                    </button>

                    {/* Sales Order Button */}
                    <button
                      onClick={() => handleClick(conversation.EnquiryNo)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none transition duration-300 transform hover:scale-105"
                    >
                      Sales Order
                    </button>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No conversations to display</p>
        )}
      </div>
    </div>
  );
};

export default CompletedEnquiries;