"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const CustomerNotConverted = () => {
  const [leadNumber, setLeadNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [Eid, setEid] = useState(""); // Added state for Eid

  const searchParams = useSearchParams();
  const EnquiryNo = searchParams.get('EnquiryNo');
  const router = useRouter();

  console.log("EnquiryNo:", EnquiryNo); // Debugging to ensure EnquiryNo is retrieved

  useEffect(() => {
    const savedToken = localStorage.getItem("admintokens");
    if (savedToken) {
      setToken(savedToken);
    } else {
      console.error("Token not found in localStorage.");
    }

    if (EnquiryNo) {
      setLeadNumber(EnquiryNo);
    }

    // Assuming you need to fetch the 'Eid' from somewhere (for example, the user is logged in):
    const savedEid = localStorage.getItem("idstore");
    if (savedEid) {
      setEid(savedEid);
    } else {
      console.error("Eid not found in localStorage.");
    }
  }, [EnquiryNo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    if (!leadNumber || !remarks || !Eid) {
      setError("Lead number, remarks, and Eid are required.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5005/api/customernotconverted`,
        { EnquiryNo: leadNumber, remarks, Eid }, // Sending Eid as part of the request body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("API Response:", response.data);
      setSubmitted(true);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error submitting lead:', err);
      console.error("Error details:", err.response); // Log full error response

      if (err.response && err.response.status === 403) {
        setError("Access denied. Invalid or expired token.");
      } else {
        setError("Failed to submit lead. Please try again.");
      }
    }
  };

  const handleBackClick = () => {
    router.push('/SaleteamDasboard/Dasboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        
        <button
          onClick={handleBackClick}
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
        
        <h1 className="text-2xl font-bold text-center">Lead Form</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitted && <p className="text-green-500 text-center">Lead submitted successfully!</p>}

          <div className="space-y-2">
            <label htmlFor="leadNumber" className="font-medium text-gray-700">Lead Number</label>
            <input
              type="text"
              id="leadNumber"
              value={leadNumber}
              className="w-full p-2 border-2 border-red-200 rounded-lg"
              readOnly
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

          <button
            type="submit"
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerNotConverted;
