"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

const Yes = () => {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState([])
  const [array,setArray] = useState([]);
  const token = localStorage.getItem('admintokens');

  
  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/cc/todayviewyescustomer', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log("API Response:", response.data); 
      console.log("customerconvert",response.data[0].customerconvert);
      setEnquiries(response.data); 
      setArray(response.data.customerconvert)
    } catch (error) {
      console.error('Error fetching enquiries:', error.response || error.message);
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const handleBackClick = () => {
    router.push('/admin/adminDasboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Today's Converted Enquiries</h1>
         <button 
                            onClick={handleBackClick}
                            className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                            <ChevronLeft size={24} />
                        </button>
        
        {/* Check if enquiries is an array */}
        {Array.isArray(enquiries) && enquiries.length > 0 ? (
          <ul className="space-y-4">
            {enquiries.map ((enquiry, index) => (
              <li key={index} className="border-b-2 border-green-200 py-4">
                <p><strong>Client Name:</strong> {enquiry?.customerconvert[0]?.clientName || 'N/A'}</p>
                <p><strong>Address:</strong> {enquiry?.AddressDetails?.Address || 'N/A'}</p>
                <p><strong>Country:</strong> {enquiry?.AddressDetails?.Country || 'N/A'}</p>
                <p><strong>City:</strong> {enquiry?.AddressDetails?.City || 'N/A'}</p>
                <p><strong>Postal Code:</strong> {enquiry?.AddressDetails?.PostalCode || 'N/A'}</p>
                <p><strong>State:</strong> {enquiry?.AddressDetails?.State || 'N/A'}</p>

                <p><strong>Converted Status:</strong> {enquiry?.customerconvert[0]?.Convertedstatus || 'N/A'}</p>
                <p><strong>Created At:</strong> {new Date(enquiry?.createdAt).toLocaleString() || 'N/A'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-green-600">No enquiries found.</p>
        )}
      </div>
    </div>
  )
}

export default Yes;
