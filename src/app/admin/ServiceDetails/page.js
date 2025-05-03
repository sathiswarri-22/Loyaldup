"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ServiceEngineers = () => {
  const [serviceDetails, setServiceDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const token = localStorage.getItem("admintokens"); // Adjust if using cookies or other auth
        if (!token) {
          setError("Authentication token not found.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5005/api/getservicedetails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setServiceDetails(response.data.getdata || []);
      } catch (err) {
        setError("Error fetching service details");
        console.error("Error fetching service details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
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
          <h1 className="ml-4 text-2xl sm:text-3xl font-bold text-gray-800">Service Details</h1>
        </div>

        {serviceDetails.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-xl text-gray-500">No service details found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceDetails.map((detail) => (
              <div
                key={detail._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="border-b border-gray-100 bg-green-50 px-6 py-4">
                  <h3 className="text-xl font-bold text-gray-800">Client: {detail.clientName}</h3>
                  <p className="text-green-600 text-sm">EID: {detail.Eid}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p><strong>Employee ID:</strong> {detail.Employeeid}</p>
                    <p><strong>Customer Inward:</strong> {detail.Customerinward}</p>
                    <p><strong>Quantity:</strong> {detail.quantity}</p>
                    <p><strong>Material:</strong> {detail.Material}</p>
                    <p><strong>Model:</strong> {detail.Model}</p>
                    <p><strong>Serial No:</strong> {detail.SerialNo}</p>
                    <p><strong>Power Consumption:</strong> {detail.powerconsumption}</p>
                    <p><strong>Service Start:</strong> {detail.servicestartdate}</p>
                    <p><strong>Service End:</strong> {detail.serviceenddate}</p>
                    <p><strong>Service Status:</strong> {detail.serviceStatus}</p>
                    <p><strong>Billing Status:</strong> {detail.BillingStatus}</p>
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

export default ServiceEngineers;
