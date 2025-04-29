"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, User, Mail, Building, Users, FileText, Badge, Activity, Package } from "lucide-react";
import { useRouter } from "next/navigation";

const EmployeeDashboard = () => {
  const router = useRouter();
  const Eid = localStorage.getItem("idstore");

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admintokens");

      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5005/api/getUserData/${Eid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setUserData(response.data);
      } else {
        setError("No user data found.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Eid) {
      fetchUserData();
    }
  }, [Eid]);

  const handleBackClick = () => {
    router.push("/SaleteamDasboard/Dasboard");
  };

  if (!Eid) return <p>No Eid found in localStorage</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackClick}
            className="p-2 bg-white text-indigo-600 rounded-full shadow-md hover:bg-indigo-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h1 className="text-3xl font-bold text-indigo-700">Employee Dashboard</h1>
          
          <div className="w-10"></div> {/* Empty div for flex spacing */}
        </div>

        {loading && (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}

        {userData.length > 0 && userData.map((user, index) => (
          <div key={index} className="mb-10 bg-white rounded-xl shadow-xl overflow-hidden">
            {/* User Header */}
            <div className="bg-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-indigo-100">{user.Eid} • {user.companyName}</p>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <Mail className="text-indigo-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-gray-800">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <Building className="text-indigo-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Company</p>
                  <p className="text-gray-800">{user.companyName}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <Users className="text-indigo-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Contact Person</p>
                  <p className="text-gray-800">{user.contactpersonname}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <FileText className="text-indigo-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Description</p>
                  <p className="text-gray-800">{user.Description}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <Badge className="text-indigo-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Employee ID</p>
                  <p className="text-gray-800">{user.Employeeid}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <Activity className="text-indigo-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Status</p>
                  <p className={`font-medium ${user.Status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    {user.Status}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Package className="mr-2 text-indigo-500" size={20} />
                Product Details
              </h3>
              
              {Array.isArray(user.productDetails) && user.productDetails.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {user.productDetails.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <p className="font-medium text-indigo-700">{item.productname}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-500">Quantity</span>
                        <span className="font-medium text-gray-800">{item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No product details available</p>
              )}
            </div>
          </div>
        ))}
        
        {userData.length === 0 && !loading && !error && (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-600">No user data to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;