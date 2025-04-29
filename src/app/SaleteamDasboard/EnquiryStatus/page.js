"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const EnquiryStatus = () => {
  const [enquiryData, setEnquiryData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Retrieve EnquiryNo from the query parameters
  const searchParams = useSearchParams();
  const EnquiryNo = searchParams.get('EnquiryNo');

  useEffect(() => {
    // Check if EnquiryNo exists before making the API request
    if (!EnquiryNo) {
      setError('EnquiryNo is missing');
      return;
    }

    const fetchEnquiries = async () => {
      setError(null);
      try {
        const token = localStorage.getItem('admintokens');
        if (!token) {
          setError('Authorization token is missing');
          return;
        }

        console.log('Fetching enquiry status for EnquiryNo:', EnquiryNo);
        const response = await axios.get(`http://localhost:5005/api/Enquirystatus/${EnquiryNo}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response received:', response.data);

        // Set enquiry data if response is valid
        if (response.data && response.data.Enquiry2 && response.data.Enquiry2.length > 0) {
          setEnquiryData(response.data);
        } else {
          setError('No data available for this enquiry.');
        }
      } catch (err) {
        setError('Error fetching enquiry status');
        console.error('Error:', err);
      }
    };

    fetchEnquiries();
  }, [EnquiryNo]);

  useEffect(() => {
    if (enquiryData)
      console.log('Component re-rendered with enquiryData:', enquiryData);
  }, [enquiryData]);

  // Handle back button click to navigate to Dashboard
  const handleBackClick = () => {
    router.push('/SaleteamDasboard/Dasboard');
  };

  // Show error or loading state if no data is available
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!enquiryData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Header */}
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Enquiry Status for {enquiryData.EnquiryNo}
        </h1>

        {/* Enquiry Stage 2 Data */}
        {enquiryData.Enquiry2 && enquiryData.Enquiry2.length > 0 ? (
          <div className="bg-green-50 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-green-600">Enquiry Stage</h2>
            <div className="mt-4">
              <p><span className="font-bold text-gray-700">Status:</span> {enquiryData.Enquiry2[0].Status}</p>
              <p><span className="font-bold text-gray-700">Client Name:</span> {enquiryData.Enquiry2[0].clientName}</p>

              {/* Additional Info and Remarks */}
              {enquiryData.Enquiry2[0].DescriptionDetails && (
                <p><span className="font-bold text-gray-700">Additional Info:</span> {enquiryData.Enquiry2[0].DescriptionDetails}</p>
              )}

              {enquiryData.Enquiry2[0].Convertedstatus && (
                <p><span className="font-bold text-gray-700">Converted Status:</span> {enquiryData.Enquiry2[0].Convertedstatus}</p>
              )}

              <p><span className="font-bold text-gray-700">EID:</span> {enquiryData.Enquiry2[0].Eid}</p>
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