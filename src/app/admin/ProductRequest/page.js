"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from 'next/navigation';

const ProductRequests = () => {
  const [productRequests, setProductRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProductRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/productrequests");
        setProductRequests(response.data.productRequests);
      } catch (err) {
        setError("Error fetching product requests");
        console.error("Error fetching product requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductRequests();
  }, []);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="mt-4 text-lg font-medium text-gray-800">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/admin/adminDasboard')}
            className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  Back
</button>
          <h1 className="ml-4 text-3xl font-bold text-gray-900">Product Requests</h1>
        </div>

        {productRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-12">
            <p className="text-xl text-gray-500">No product requests found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{request.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.Status)}`}>
                      {request.Status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-600 flex items-center">
                      <span className="font-medium text-gray-700 w-32">Email:</span> 
                      <span>{request.email}</span>
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="font-medium text-gray-700 w-32">Company:</span> 
                      <span>{request.companyName}</span>
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="font-medium text-gray-700 w-32">Contact Person:</span> 
                      <span>{request.contactpersonname}</span>
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="font-medium text-gray-700 w-32">Employee ID:</span> 
                      <span>{request.Employeeid}</span>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{request.Description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Products Requested</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      {request.productDetails.map((product, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-200">
                          <span className="font-medium">{product.productname}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{product.quantity} units</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRequests;