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
  const [role, setRole] = useState("")
  const token = localStorage.getItem('admintokens');

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
  
  const handleCompany = () => {
    router.push('/admin/Getresources')
  }
  
  const handleAllcustomer = () => {
    router.push('/admin/Allcustomerget')
  }
  
  const handleServiceDetails = () => {
    router.push('/admin/ServiceDetails')
  };
  
  const handleProductRequest = () => {
    router.push('/admin/ProductRequest')
  };
  
  const handlequotationRequest = () => {
    router.push('/admin/Quotation?EnquiryNo')
  };
  
  const handlePORequest = () => {
    router.push('/admin/Purchaseorder')
  };
  const handlePI = () => {
    router.push('/admin/Invoice')
  };
  const handleWorkvisit = () => {
    router.push('/admin/GetAllworkvisit')
  }
  const handleGetquots = () => {
    router.push('/admin/GetAllquotation')
  }
  const handleGetSO = () => {
    router.push('/admin/GetSO')
  }
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="w-full max-w-7xl p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-white rounded-lg shadow-lg mx-auto my-4 md:my-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-teal-700 mb-4 md:mb-6">Admin Dashboard</h1>

        {/* Action Buttons - Improved Mobile Layout */}
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center mb-4 md:mb-8">
          <button
            onClick={handleAddUsers}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
            Add Employees
          </button>
          <button
            onClick={handleResetEmail}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
            Reset Email
          </button>
          <button
            onClick={handleResetPassword}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
            Reset Password
          </button>
          <button
            onClick={handleYesCustomer}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
            Today Converted
          </button>
          <button
            onClick={handleNoCustomer}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
            Today Not Converted
          </button>
          <button
            onClick={handleLeadEnquiry}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
            All Lead Enquiry
          </button>
          <button
            onClick={handleCompany}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
            All Companyresources
          </button>
          <button
            onClick={handleAllcustomer}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
            AllCustomer
          </button>
          <button
            onClick={handleServiceDetails}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
            Service Details
          </button>
          <button
            onClick={handleProductRequest}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
            Product Request
          </button>
          <button
            onClick={handlequotationRequest}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
           Quotation Request
          </button>
          <button
            onClick={handlePORequest}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
           PO Request
          </button>
          <button
            onClick={handlePI}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
           PI get
          </button>
          <button
            onClick={handleWorkvisit}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
           AllWorkvisit get
          </button>
          <button
            onClick={handleGetquots}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
           AllQuots get
          </button>
          <button
            onClick={handleGetSO}
            className="py-2 px-3 md:py-3 md:px-4 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-auto text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 text-xs sm:text-sm md:text-base font-medium text-center"
          >
           All Sales Order
          </button>
        </div>

        {/* Tabs for Content - Improved Mobile View */}
        <div className="flex justify-center overflow-x-auto pb-2 scrollbar-hide">
  <div className="flex space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8">
    <button
      className={`py-2 px-3 sm:px-4 md:px-6 lg:px-8 text-xs sm:text-sm md:text-base lg:text-lg font-medium transition-all duration-300 ease-in-out touch-manipulation ${
        activeTab === "profiles"
          ? "border-b-4 border-teal-600 text-teal-600"
          : "text-gray-600 hover:text-teal-600"
      }`}
      onClick={() => setActiveTab("profiles")}
    >
      View Profiles
    </button>

    <button
      className={`py-2 px-3 sm:px-4 md:px-6 lg:px-8 text-xs sm:text-sm md:text-base lg:text-lg font-medium transition-all duration-300 ease-in-out touch-manipulation ${
        activeTab === "products"
          ? "border-b-4 border-teal-600 text-teal-600"
          : "text-gray-600 hover:text-teal-600"
      }`}
      onClick={() => setActiveTab("products")}
    >
      Inventory
    </button>

    <button
      className={`py-2 px-3 sm:px-4 md:px-6 lg:px-8 text-xs sm:text-sm md:text-base lg:text-lg font-medium transition-all duration-300 ease-in-out touch-manipulation ${
        activeTab === "enquiries"
          ? "border-b-4 border-teal-600 text-teal-600"
          : "text-gray-600 hover:text-teal-600"
      }`}
      onClick={() => setActiveTab("enquiries")}
    >
      Lead Enquiries
    </button>
  </div>
</div>

{/* Responsive Content Display */}
<div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 overflow-x-auto px-2 sm:px-4 md:px-6">
  {activeTab === "profiles" && <ViewAllProfiles />}
  {activeTab === "products" && <ProductList />}
  {activeTab === "enquiries" && <ViewLeadEnquiryPage />}
</div>
   </div>
    </div>
  );
};

export default Dashboard;