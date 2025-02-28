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

  const searchParams = useSearchParams();
  const EnquiryNo = searchParams.get('EnquiryNo');
  const router = useRouter();
  console.log(EnquiryNo);

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
  }, [EnquiryNo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    if (!leadNumber || !remarks) {
      setError("Lead number and remarks are required.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5005/api/customernotconverted`,
        { EnquiryNo: leadNumber, remarks },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log(response.data);
      setSubmitted(true);
      setError(null);
    } catch (err) {
      console.error('Error submitting lead:', err);
      if (err.response && err.response.status === 403) {
        setError("Access denied. Invalid or expired token.");
      } else {
        setError("Failed to submit lead.");
      }
    }
  };

  const handleBackClick = () => {
    router.push('/SaleteamDasboard/Dasboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <button onClick={handleBackClick}
        className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
>
                  <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-center">Lead Form</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>} {/* Display errors */}
          {submitted && <p className="text-green-500 text-center">Lead submitted successfully!</p>} {/* Success message */}

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

          <button type="submit" className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerNotConverted;
