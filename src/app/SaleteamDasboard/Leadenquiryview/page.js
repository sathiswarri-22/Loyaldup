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
      console.log(response.data);
      if (response.data && response.data.length > 0) {
        setEnquiryData(response.data);
      }
      
    } catch (err) {
      console.error('Error fetching lead enquiry data:', err);
      setError("Failed to fetch lead enquiries data.");
    }
  };

  useEffect(() => {
    if (role === "Lead filler" || "md") {
      fetchLeadEnquiryList();
    } else {
      setError("You do not have permission to view the data.");
    }
  }, [role, token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Lead Enquiry</h1>

        {error && <p className="text-center text-red-600">{error}</p>} 

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-green-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Company Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Contact Person</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Department</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Lead Medium</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Lead Priority</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Enquiry Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Lead Condition</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Contact Number</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Alternate Phone</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Primary Mail</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Secondary Mail</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Address</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Country</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">City</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Postal Code</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">State</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {enquiryData.length > 0 ? (
                enquiryData.map((data) => (
                  <tr key={data._id} className="border-b hover:bg-green-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.LeadDetails?.companyName || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.LeadDetails?.clientName || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.LeadDetails?.Department || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.LeadDetails?.LeadMedium || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.LeadDetails?.LeadPriority || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.LeadDetails?.EnquiryType || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.LeadDetails?.Leadcondition || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.ContactDetails?.MobileNumber || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.ContactDetails?.AlternateMobileNumber || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.ContactDetails?.PrimaryMail || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.ContactDetails?.SecondaryMail || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.AddressDetails?.Address || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.AddressDetails?.Country || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.AddressDetails?.City || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.AddressDetails?.PostalCode || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.AddressDetails?.State || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.DescriptionDetails || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="17" className="text-center text-gray-600">No enquiries available for today.</td>
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
