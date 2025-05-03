"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const EnquiryStatus = () => {
  const [enquiryData, setEnquiryData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const EnquiryNo = searchParams.get("EnquiryNo");

  useEffect(() => {
    if (!EnquiryNo) {
      setError("EnquiryNo is missing");
      return;
    }

    const fetchEnquiries = async () => {
      setError(null);
      try {
        const token = localStorage.getItem("admintokens");
        if (!token) {
          setError("Authorization token is missing");
          return;
        }

        const response = await axios.get(
          `http://localhost:5005/api/cc/Enquirystatus/${EnquiryNo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.data) {
          setEnquiryData(response.data);
        } else {
          setError("No data available for this enquiry.");
        }
      } catch (err) {
        setError("Error fetching enquiry status");
        console.error("Error:", err);
      }
    };

    fetchEnquiries();
  }, [EnquiryNo]);

  const handleBackClick = () => {
    router.push("/SaleteamDasboard/Dasboard");
  };

  if (error)
    return (
      <div className="text-red-500 text-center mt-10 font-semibold">{error}</div>
    );
  if (!enquiryData)
    return <div className="text-center mt-10 font-medium">Loading...</div>;

  const data = enquiryData.data;

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Back Button */}
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

        {/* Header */}
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Enquiry Status for {enquiryData.EnquiryNo}
        </h1>

        {/* Enquiry Details */}
        {data ? (
          <div className="bg-green-50 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-green-600">
              Source: {enquiryData.source}
            </h2>
            <div className="mt-4 space-y-2">
              <p>
                <span className="font-bold text-gray-700">Status:</span>{" "}
                {data.Status || "N/A"}
              </p>
              <p>
                <span className="font-bold text-gray-700">Client Name:</span>{" "}
                {data.clientName || "N/A"}
              </p>

              {data.DescriptionDetails && (
                <p>
                  <span className="font-bold text-gray-700">
                    Additional Info:
                  </span>{" "}
                  {data.DescriptionDetails}
                </p>
              )}

              {data.Convertedstatus && (
                <p>
                  <span className="font-bold text-gray-700">
                    Converted Status:
                  </span>{" "}
                  {data.Convertedstatus}
                </p>
              )}

              <p>
                <span className="font-bold text-gray-700">EID:</span>{" "}
                {data.Eid || "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md text-center text-gray-700">
            <p>No data available for this enquiry.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryStatus;
