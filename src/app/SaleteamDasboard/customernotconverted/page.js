"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const CustomerNotConverted = () => {
  const [leadNumber, setLeadNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [Eid, setEid] = useState("");  
  const [token, setToken] = useState("");  

  useEffect(() => {
    const notConverted = async () => {
      if (!Eid) {
        setError("Eid is not available.");
        return;
      }

      try {
        console.log('Making API call with Eid:', Eid, 'Token:', token);
        const response = await axios.post(
          `http://localhost:5005/api/customernotconverted`,
          { leadNumber, remarks },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );
        console.log(response.data.notConverted);
        setLeadNumber(response.data.notConverted);
      } catch (err) {
        console.error('Error fetching customer data:', err.response || err);
        setError("Failed to fetch customer data.");
      }
    };

    notConverted();  // Call the function inside useEffect
  }, [Eid, token]);  // Dependency array to ensure it runs when Eid or token change

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center">Lead Form</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="leadNumber" className="font-medium text-gray-700">Lead Number</label>
            <input
              type="text"
              id="leadNumber"
              value={leadNumber}
              onChange={(e) => setLeadNumber(e.target.value)}
              className="w-full p-2 border-2 border-red-200 rounded-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="remarks" className="font-medium text-gray-700">Remarks</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 border-2 border-red-200 rounded-lg"
              required
            />
          </div>

          <button type="submit" className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Submit
          </button>
        </form>

       
      </div>
    </div>
  );
};

export default CustomerNotConverted;
