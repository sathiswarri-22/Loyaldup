"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductRequests = () => {
  const [productRequests, setProductRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Product Requests</h1>
      {productRequests.length === 0 ? (
        <p className="text-xl text-gray-500">No product requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{request.name}</h3>
                <p className="text-gray-600 mb-1"><strong>Email:</strong> {request.email}</p>
                <p className="text-gray-600 mb-1"><strong>Company:</strong> {request.companyName}</p>
                <p className="text-gray-600 mb-1"><strong>Contact Person:</strong> {request.contactpersonname}</p>
                <p className="text-gray-600 mb-1"><strong>Employee ID:</strong> {request.Employeeid}</p>
                <p className="text-gray-600 mb-1"><strong>Description:</strong> {request.Description}</p>
                
                <h4 className="text-lg font-semibold text-gray-800 mt-4">Product Details</h4>
                <ul className="space-y-2">
                  {request.productDetails.map((product, index) => (
                    <li key={index} className="text-gray-600">
                      <strong>Product Name:</strong> {product.productname} - <strong>Quantity:</strong> {product.quantity}
                    </li>
                  ))}
                </ul>
                
                <p className="text-gray-600 mt-4"><strong>Status:</strong> {request.Status}</p>
              </div>
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRequests;