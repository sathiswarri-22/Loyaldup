"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const EnquiryStatus = () => {
  const [enquiryData, setEnquiryData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const EnquiryNo = searchParams.get('EnquiryNo');  

  useEffect(() => {
    if (!EnquiryNo) return;

    const fetchEnquiries = async () => {
      setError(null);
      try {
        const token = localStorage.getItem('admintokens')
        console.log('Fetching enquiry status for EnquiryNo:', EnquiryNo);
        const response = await axios.get(`http://localhost:5005/api/Enquirystatus/${EnquiryNo}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Response received:', response.data);
        setEnquiryData(response.data);
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

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!enquiryData) return <div className="text-center mt-10">Loading...</div>;

  const handleBackClick = () => {
    router.push('/SaleteamDasboard/Dasboard')
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <button onClick={handleBackClick}
        className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
>
                  <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Enquiry Status for {enquiryData.EnquiryNo}
        </h1>

        {/* Enquiry Stage 1 */}
        {enquiryData.Enquiry1 && (
          <div className="bg-indigo-50 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-indigo-600">Stage 1</h2>
            <div className="mt-4">
              <p><span className="font-bold text-gray-700">Status:</span> {enquiryData.Enquiry1.Status}</p>
              <p><span className="font-bold text-gray-700">Client Name:</span> {enquiryData.Enquiry1.LeadDetails.clientName}</p>
              <p><span className="font-bold text-gray-700">Company Name:</span> {enquiryData.Enquiry1.LeadDetails.companyName}</p>
            </div>
          </div>
        )}

        {/* Enquiry Stage 2 */}
        {enquiryData.Enquiry2 && (
          <div className="bg-green-50 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-green-600">Stage 2</h2>
            <div className="mt-4">
              <p><span className="font-bold text-gray-700">Status:</span> {enquiryData.Enquiry2.status}</p>
              <p><span className="font-bold text-gray-700">Additional Info:</span> {enquiryData.Enquiry2.additionalInfo}</p>
              <p><span className="font-bold text-gray-700">Final Remarks:</span> {enquiryData.Enquiry2.finalRemarks}</p>
            </div>
          </div>
        )}

        {/* No Data Available */}
        {!enquiryData.Enquiry1 && !enquiryData.Enquiry2 && (
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md text-center text-gray-700">
            <p>No data available for this enquiry.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryStatus;
