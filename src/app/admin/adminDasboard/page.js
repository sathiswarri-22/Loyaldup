"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import ViewAllProfiles from "../viewallprofile/page";
import ProductList from "../../SaleteamDasboard/Inventory/page";
import ViewLeadEnquiryPage from "../../SaleteamDasboard/Leadenquiryview/page";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profiles");
  const [activeContent, setActiveContent] = useState(null);
  const router = useRouter();
  const token = localStorage.getItem("admintokens");
  const role = localStorage.getItem("role");
  

  useEffect(() => {
    if (!token || !role) {
      router.push("/login");
    }
  }, [token, role, router]);

  const handleAddUsers = () => {
router.push('/admin/register')
  };

  const handleResetEmail = () => {
router.push('/admin/resetemail')
  };

  const handleResetPassword = () => {
    router.push('/admin/passwordreset')
  };

  const handleYesCustomer = () => {
    router.push('/admin/Yes')
  };

  const handleNoCustomer = () => {
    router.push('/admin/No')
  };

  const handleLeadEnquiry = () => {
    router.push('/admin/AllLeadEnquiry')
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="w-full max-w-7xl p-8 space-y-6 bg-white rounded-lg shadow-lg mx-auto my-8">
        <h1 className="text-3xl font-semibold text-center text-teal-700 mb-6">Admin Dashboard</h1>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <button
            onClick={handleAddUsers}
            className="py-3 text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add Employees
          </button>
          <button
            onClick={handleResetEmail}
            className="py-3 text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Reset Email
          </button>
          <button
            onClick={handleResetPassword}
            className="py-3 text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Reset Password
          </button>

          <button
            onClick={handleYesCustomer}
            className="py-3 text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Today Converted Customer
          </button>
          <button
            onClick={handleNoCustomer}
            className="py-3 text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Today Not Converted Customer
          </button>
          <button
            onClick={handleLeadEnquiry}
            className="py-3 text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            All Lead Enquiry
          </button>
        </div>

        {/* Tabs for Content */}
        <div className="flex justify-center space-x-6">
          <button
            className={`py-2 px-6 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out ${
              activeTab === "profiles" ? "border-b-4 border-teal-600 text-teal-600" : "text-gray-600 hover:text-teal-600"
            }`}
            onClick={() => setActiveTab("profiles")}
          >
            View Profiles
          </button>
          <button
            className={`py-2 px-6 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out ${
              activeTab === "products" ? "border-b-4 border-teal-600 text-teal-600" : "text-gray-600 hover:text-teal-600"
            }`}
            onClick={() => setActiveTab("products")}
          >
            Inventory
          </button>
          <button
            className={`py-2 px-6 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out ${
              activeTab === "enquiries" ? "border-b-4 border-teal-600 text-teal-600" : "text-gray-600 hover:text-teal-600"
            }`}
            onClick={() => setActiveTab("enquiries")}
          >
            Lead Enquiries
          </button>
        </div>

        {/* Content Display */}
        <div className="mt-6">
          {activeTab === "profiles" && <ViewAllProfiles />}
          {activeTab === "products" && <ProductList />}
          {activeTab === "enquiries" && <ViewLeadEnquiryPage />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
