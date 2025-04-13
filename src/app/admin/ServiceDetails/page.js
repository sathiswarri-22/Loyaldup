"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const ServiceEngineers = () => {
  const [serviceEngineers, setServiceEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceEngineers = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/workvisit");
        console.log(response.data.serviceEngineers)
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Service Engineers</h1>
      {serviceEngineers.length === 0 ? (
        <p className="text-xl text-gray-500">No service engineers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceEngineers.map((engineer) => (
            <div
              key={engineer._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{engineer.name}</h3>
                <p className="text-gray-600 mb-1"><strong>Company:</strong> {engineer.companyName}</p>
                <p className="text-gray-600 mb-1"><strong>Machine:</strong> {engineer.MachineName}</p>
                <p className="text-gray-600 mb-1"><strong>Product Description:</strong> {engineer.ProductDescription}</p>
                <p className="text-gray-600 mb-1"><strong>Complaints:</strong> {engineer.Problems[0]?.description || "No complaints"}</p>
                <p className="text-gray-600 mb-1"><strong>Assessment:</strong> {engineer.Assessment}</p>
              </div>
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceEngineers;