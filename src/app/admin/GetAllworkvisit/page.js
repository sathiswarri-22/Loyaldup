"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const WorkvistAll = () => {
  const [serviceEngineers, setServiceEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchServiceEngineers = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/workvisit");
        setServiceEngineers(response.data.serviceEngineers);
      } catch (err) {
        setError("Error fetching service engineers");
        console.error("Error fetching service engineers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceEngineers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-green-500 animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 shadow-sm">
          <p className="text-red-600 font-medium text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-8">
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
          <h1 className="ml-4 text-2xl sm:text-3xl font-bold text-gray-800">Service Engineers</h1>
        </div>

        {serviceEngineers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-xl text-gray-500">No service engineers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceEngineers.map((engineer) => (
              <div
                key={engineer._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="border-b border-gray-100 bg-green-50 px-6 py-4">
                  <h3 className="text-xl font-bold text-gray-800">{engineer.name}</h3>
                  <p className="text-green-600 text-sm">{engineer.companyName}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Machine</p>
                      <p className="text-gray-800">{engineer.MachineName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Product Description</p>
                      <p className="text-gray-800">{engineer.ProductDescription}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Complaints</p>
                      <p className="text-gray-800">{engineer.Problems[0]?.description || "No complaints"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Assessment</p>
                      <p className="text-gray-800">{engineer.Assessment || "No assessment provided"}</p>
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

export default WorkvistAll;