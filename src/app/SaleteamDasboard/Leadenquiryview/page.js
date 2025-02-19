"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

const ViewleadEnquiryPage = () => {
  const [enquiryData, setEnquiryData] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("admintokens");
  const role = localStorage.getItem("role");
  const router = useRouter(); 
  
  useEffect(() => {
    if (!token || !role) {
      router.push("/login"); 
    }
  }, [token, role, router]);

  const fetchLeadEnquiryList = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/todayviewleadenquiry', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      if (response.data && response.data.length > 0) {
        setEnquiryData(response.data);
      }
    } catch (err) {
      console.error('Error fetching lead enquiry data:', err);
      setError("Failed to fetch lead enquiries data.");
    }
  };

  useEffect(() => {
    if (role === "Lead filler") {
      fetchLeadEnquiryList();
    } else {
      setError("You do not have permission to view the data.");
    }
  }, [role, token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-5xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Lead Enquiry Details</h1>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="py-2 px-4">COMPANY NAME</th>
                <th className="py-2 px-4">CONTACT PERSON</th>
                <th className="py-2 px-4">DEPARTMENT</th>
                <th className="py-2 px-4">LEAD MEDIUM</th>
                <th className="py-2 px-4">LEAD PRIORITY</th>
                <th className="py-2 px-4">ENQUIRY TYPE</th>
                <th className="py-2 px-4">LEAD CONDITION</th>
                <th className="py-2 px-4">CONTACT NUMBER</th>
                <th className="py-2 px-4">ALTERNATE PHONE NUMBER</th>
                <th className="py-2 px-4">PRIMARY MAIL</th>
                <th className="py-2 px-4">SECONDARY MAIL</th>
                <th className="py-2 px-4">ADDRESS</th>
                <th className="py-2 px-4">COUNTRY</th>
                <th className="py-2 px-4">CITY</th>
                <th className="py-2 px-4">POSTAL CODE</th>
                <th className="py-2 px-4">STATE</th>
                <th className="py-2 px-4">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {enquiryData.length > 0 ? (
                enquiryData.map((data) => (
                  <tr key={data._id} className="border-b">
                    <td className="py-2 px-4">{data?.LeadDetails?.companyName || "N/A"}</td>
                    <td className="py-2 px-4">{data?.LeadDetails?.clientName || "N/A"}</td>
                    <td className="py-2 px-4">{data?.LeadDetails?.Department || "N/A"}</td>
                    <td className="py-2 px-4">{data?.LeadDetails?.LeadMedium || "N/A"}</td>
                    <td className="py-2 px-4">{data?.LeadDetails?.LeadPriority || "N/A"}</td>
                    <td className="py-2 px-4">{data?.LeadDetails?.EnquiryType || "N/A"}</td>
                    <td className="py-2 px-4">{data?.LeadDetails?.Leadcondition || "N/A"}</td>
                    <td className="py-2 px-4">{data?.ContactDetails?.MobileNumber || "N/A"}</td>
                    <td className="py-2 px-4">{data?.ContactDetails?.AlternateMobileNumber || "N/A"}</td>
                    <td className="py-2 px-4">{data?.ContactDetails?.PrimaryMail || "N/A"}</td>
                    <td className="py-2 px-4">{data?.ContactDetails?.SecondaryMail || "N/A"}</td>
                    <td className="py-2 px-4">{data?.AddressDetails?.Address || "N/A"}</td>
                    <td className="py-2 px-4">{data?.AddressDetails?.Country || "N/A"}</td>
                    <td className="py-2 px-4">{data?.AddressDetails?.City || "N/A"}</td>
                    <td className="py-2 px-4">{data?.AddressDetails?.PostalCode || "N/A"}</td>
                    <td className="py-2 px-4">{data?.AddressDetails?.State || "N/A"}</td>
                    <td className="py-2 px-4">{data?.DescriptionDetails || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="17" className="py-2 px-4 text-center">No enquiries available for today.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewleadEnquiryPage;
