"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const EmployeeDashboard = () => {
  const router = useRouter();

  const Eid = localStorage.getItem("idstore"); // Get the Eid from localStorage

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Define loading state
  const [error, setError] = useState("");

  // If no Eid is found in localStorage, display an error message
  if (!Eid) return <p>No Eid found in localStorage</p>;

  const fetchUserData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching data
      const token = localStorage.getItem("admintokens"); // Get token from localStorage

      if (!token) {
        setError("No token found. Please login.");
        setLoading(false); // Set loading to false after checking token
        return;
      }

      const response = await axios.get(`http://localhost:5005/api/getUserData/${Eid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUserData(response.data); // If data is received, update userData state
      } else {
        setError("User not found.");
      }

      setLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false); // Set loading to false after an error
    }
  };

  useEffect(() => {
    if (Eid) {
      fetchUserData(); // Call the fetchUserData function if Eid exists
    }
  }, [Eid]); // Only run this effect if Eid changes

  const handleBackClick = () => {
    router.push("/SaleteamDasboard/Dasboard"); // Navigate back to the dashboard
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Employee Dashboard</h1>

        <button
          onClick={handleBackClick}
          className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <ChevronLeft size={24} />
        </button>

        {loading && <p className="text-center text-green-600">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {userData ? (
          <div className="space-y-4">
            <div>
              <p className="text-xl font-semibold text-gray-700">Name: {userData.name}</p>
              <p className="text-xl font-semibold text-gray-700">Email: {userData.email}</p>
              <p className="text-xl font-semibold text-gray-700">Eid: {userData.Eid}</p>
              <p className="text-xl font-semibold text-gray-700">Description: {userData.Description}</p>
              <p className="text-xl font-semibold text-gray-700">Quantity: {userData.quantity}</p> {/* Display quantity */}
              <p className="text-xl font-semibold text-gray-700">Product Name: {userData.productname}</p> {/* Display productname */}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No user data to display</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;