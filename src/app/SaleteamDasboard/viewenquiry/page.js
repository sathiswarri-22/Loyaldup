"use client"
import { useState , useEffect } from "react";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ViewEnquiryPage = () => {
  const [enquiryData, setEnquiryData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [EidToAssign, setEidToAssign] = useState("");
  const [saleEnquiryData, setSaleEnquiryData] = useState([]);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const token = localStorage.getItem("admintokens");
  const Eid = localStorage.getItem("idstore");
  const role = localStorage.getItem("role");
  const router = useRouter();

  

  const handleSelectEnquiry = (EnquiryNo) => {
    setSelectedEnquiries((prevSelectedEnquiries) => {
      if (prevSelectedEnquiries.includes(EnquiryNo)) {
        return prevSelectedEnquiries.filter((id) => id !== EnquiryNo);
      } else {
        return [...prevSelectedEnquiries, EnquiryNo];
      }
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      if (!EidToAssign) return alert("Please enter an Eid to assign.");
      if (selectedEnquiries.length === 0) return alert("Please select at least one enquiry.");

      const response = await axios.put(
        `http://localhost:5005/api/assignedto`,
        {
          Eid: EidToAssign,
          EnquiryNo: selectedEnquiries,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.message || "Successfully updated");

      setEidToAssign("");
      setSelectedEnquiries([]);
      setEnquiryData([]);
    } catch (err) {
      console.error("Error in updating:", err);
      alert("Failed to update assignments");
    }
  };

  const handleComplete = (enquiryId) => {
    // Handle completion logic here
    alert(`Enquiry ${enquiryId} marked as complete.`);
  };

  const Quotation = () => {
    router.push('/SaleteamDasboard/Quotation');
  };

  const Salesorder = () => {
    router.push('/SaleteamDasboard/SalesOrder');
  };

  const perfoma = () => {
    router.push('/SaleteamDasboard/perfoma');
  };

  return (
    (role === "sales head" || role === "Sales Employee") && (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 p-8">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <h2 className="text-3xl font-semibold text-center text-green-600">Dashboard</h2>

          {/* Other navigation buttons... */}

          <h1 className="text-4xl font-bold text-center text-green-600 mb-4">Enquiry Data</h1>
          <form onSubmit={handlesubmit} className="space-y-6">
            {/* Table with header */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-left bg-white shadow-lg rounded-lg">
                <thead>
                  <tr className="bg-green-100 text-green-600">
                    {role === "sales head" && <th className="px-4 py-2">Select</th>}
                    <th className="px-4 py-2">COMPANY NAME</th>
                    <th className="px-4 py-2">CONTACT PERSON</th>
                    <th className="px-4 py-2">DEPARTMENT</th>
                    <th className="px-4 py-2">LEAD MEDIUM</th>
                    <th className="px-4 py-2">LEAD PRIORITY</th>
                    <th className="px-4 py-2">ENQUIRY TYPE</th>
                    <th className="px-4 py-2">LEAD CONDITION</th>
                    <th className="px-4 py-2">CONTACT NUMBER</th>
                    <th className="px-4 py-2">ALTERNATE PHONE NUMBER</th>
                    <th className="px-4 py-2">PRIMARY MAIL</th>
                    <th className="px-4 py-2">SECONDARY MAIL</th>
                    <th className="px-4 py-2">ADDRESS</th>
                    <th className="px-4 py-2">COUNTRY</th>
                    <th className="px-4 py-2">CITY</th>
                    <th className="px-4 py-2">POSTAL CODE</th>
                    <th className="px-4 py-2">STATE</th>
                    <th className="px-4 py-2">REMARKS</th>
                    <th className="px-4 py-2">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {role === "sales head"
                    ? enquiryData.length > 0
                      ? enquiryData.map((data) => (
                          <tr key={data._id} className="border-t border-green-200">
                            <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                checked={selectedEnquiries.includes(data.EnquiryNo)}
                                onChange={() => handleSelectEnquiry(data.EnquiryNo)}
                                className="mx-auto"
                              />
                            </td>
                            <td className="px-4 py-2">{data?.LeadDetails?.companyName || "N/A"}</td>
                            <td className="px-4 py-2">{data?.LeadDetails?.clientName || "N/A"}</td>
                            <td className="px-4 py-2">{data?.LeadDetails?.Department || "N/A"}</td>
                            <td className="px-4 py-2">{data?.LeadDetails?.LeadMedium || "N/A"}</td>
                            <td className="px-4 py-2">{data?.LeadDetails?.LeadPriority || "N/A"}</td>
                            <td className="px-4 py-2">{data?.LeadDetails?.EnquiryType || "N/A"}</td>
                            <td className="px-4 py-2">{data?.LeadDetails?.Leadcondition || "N/A"}</td>
                            <td className="px-4 py-2">{data?.ContactDetails?.MobileNumber || "N/A"}</td>
                            <td className="px-4 py-2">{data?.ContactDetails?.AlternateMobileNumber || "N/A"}</td>
                            <td className="px-4 py-2">{data?.ContactDetails?.PrimaryMail || "N/A"}</td>
                            <td className="px-4 py-2">{data?.ContactDetails?.SecondaryMail || "N/A"}</td>
                            <td className="px-4 py-2">{data?.AddressDetails?.Address || "N/A"}</td>
                            <td className="px-4 py-2">{data?.AddressDetails?.Country || "N/A"}</td>
                            <td className="px-4 py-2">{data?.AddressDetails?.City || "N/A"}</td>
                            <td className="px-4 py-2">{data?.AddressDetails?.PostalCode || "N/A"}</td>
                            <td className="px-4 py-2">{data?.AddressDetails?.State || "N/A"}</td>
                            <td className="px-4 py-2">{data?.DescriptionDetails || "N/A"}</td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleComplete(data._id)}
                                className="py-1 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                Complete
                              </button>
                              <div className="flex gap-2">
                                <button
                                  onClick={Quotation}
                                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                  Quotation
                                </button>
                                <button
                                  onClick={Salesorder}
                                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                  Sales Order
                                </button>
                                <button
                                  onClick={perfoma}
                                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                  Perfoma
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      : (
                        <tr>
                          <td colSpan="17" className="text-center py-4">No Enquiries Available</td>
                        </tr>
                      )
                    : saleEnquiryData.length > 0
                    ? saleEnquiryData.map((data) => (
                        <tr key={data._id} className="border-t border-green-200">
                          <td className="px-4 py-2">{data?.LeadDetails?.companyName || "N/A"}</td>
                          <td className="px-4 py-2">{data?.LeadDetails?.clientName || "N/A"}</td>
                          <td className="px-4 py-2">{data?.LeadDetails?.Department || "N/A"}</td>
                          <td className="px-4 py-2">{data?.LeadDetails?.LeadMedium || "N/A"}</td>
                          <td className="px-4 py-2">{data?.LeadDetails?.LeadPriority || "N/A"}</td>
                          <td className="px-4 py-2">{data?.LeadDetails?.EnquiryType || "N/A"}</td>
                          <td className="px-4 py-2">{data?.LeadDetails?.Leadcondition || "N/A"}</td>
                          <td className="px-4 py-2">{data?.ContactDetails?.MobileNumber || "N/A"}</td>
                          <td className="px-4 py-2">{data?.ContactDetails?.AlternateMobileNumber || "N/A"}</td>
                          <td className="px-4 py-2">{data?.ContactDetails?.PrimaryMail || "N/A"}</td>
                          <td className="px-4 py-2">{data?.ContactDetails?.SecondaryMail || "N/A"}</td>
                          <td className="px-4 py-2">{data?.AddressDetails?.Address || "N/A"}</td>
                          <td className="px-4 py-2">{data?.AddressDetails?.Country || "N/A"}</td>
                          <td className="px-4 py-2">{data?.AddressDetails?.City || "N/A"}</td>
                          <td className="px-4 py-2">{data?.AddressDetails?.PostalCode || "N/A"}</td>
                          <td className="px-4 py-2">{data?.AddressDetails?.State || "N/A"}</td>
                          <td className="px-4 py-2">{data?.DescriptionDetails || "N/A"}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleComplete(data._id)}
                              className="py-1 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              Complete
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={Quotation}
                                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Quotation
                              </button>
                              <button
                                onClick={Salesorder}
                                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Sales Order
                              </button>
                              <button
                                onClick={perfoma}
                                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Perfoma
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    : (
                      <tr>
                        <td colSpan="17" className="text-center py-4">No Enquiries Available</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>

            {role === "sales head" && (
              <>
                <div className="mt-4 flex flex-col space-y-4">
                  <label className="font-medium text-green-600">Assigning Eid</label>
                  <input
                    type="text"
                    name="Eid"
                    value={EidToAssign}
                    onChange={(e) => setEidToAssign(e.target.value)}
                    className="p-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Assign
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    )
  );
};
 export default ViewEnquiryPage