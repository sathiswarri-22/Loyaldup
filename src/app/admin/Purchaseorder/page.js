'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { ChevronLeft, Eye, EyeOff, CheckCircle, AlertTriangle, DollarSign, Package, Calendar, Tag, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Purchaseorder = () => {
  const [getdata, setGetdata] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const purchasesPerPage = 4;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('admintokens') : null;
  const router = useRouter();

  // Fetch data from API
  const fetchData = async () => {
    if (!token) {
      setErrorMessage('Error: Missing authorization token.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.get('http://localhost:5005/api-purchaseorder/getPO', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data && response.data.length > 0) {
        setGetdata(response.data);
        setTotalPages(Math.ceil(response.data.length / purchasesPerPage));
        setSuccessMessage(`Successfully loaded ${response.data.length} purchase orders.`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('No purchase orders found.');
        setGetdata([]);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        `Error fetching data: ${
          error.response
            ? JSON.stringify(error.response.data, null, 2)
            : error.message
        }`
      );
      setGetdata([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Get current page purchases
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * purchasesPerPage;
    const endIndex = startIndex + purchasesPerPage;
    return getdata.slice(startIndex, endIndex);
  };

  // Change page handler
  const changePage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    setCurrentPage(pageNumber);
    setExpandedItems({}); // Reset expanded items when changing page
  };

  const handleViewMore = (index) => {
    setExpandedItems(prev => {
      // Create a new object with all values set to false (collapse all)
      const newExpandedItems = {};
      
      // Toggle the clicked item
      newExpandedItems[index] = !prev[index];
      
      return newExpandedItems;
    });
  };

  // Returns the appropriate icon for the field
  const getFieldIcon = (field) => {
    switch(field) {
      case 'warrantyTerms': return <Calendar size={14} className="text-indigo-500" />;
      case 'deliveryTerms': return <Package size={14} className="text-indigo-500" />;
      case 'paymentTerms': return <DollarSign size={14} className="text-indigo-500" />;
      case 'gst': return <Tag size={14} className="text-indigo-500" />;
      default: return null;
    }
  };

  // Generate pagination numbers
  const getPaginationRange = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range = [];
    
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.unshift(1);
    }
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  };

  const currentPageData = getCurrentPageData();

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/admin/adminDasboard')}
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
          
          <h1 className="text-3xl font-bold text-indigo-700">Purchase Order Management</h1>
          
          {/* Page info indicator */}
          <div className="bg-white shadow-sm rounded-lg px-4 py-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>
        
        {/* Status Messages */}
        {loading && (
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
              <p className="text-indigo-600 font-medium">Loading purchase orders...</p>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow">
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-3" size={20} />
              <p className="text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md shadow animate-fadeIn">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={20} />
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Purchase Order Grid */}
        {currentPageData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPageData.map((item, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 
                  ${expandedItems[index] ? 'lg:col-span-3 md:col-span-2 shadow-xl z-10 scale-100' : 'hover:shadow-xl hover:-translate-y-1'}`}
              >
                {/* Card Header */}
                <div className={`p-4 text-white flex justify-between items-center ${
                  expandedItems[index] 
                    ? 'bg-gradient-to-r from-indigo-700 to-blue-700' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600'
                }`}>
                  <h3 className="text-lg font-semibold flex items-center">
                    Purchase Order {item.EnquiryNo || (((currentPage - 1) * purchasesPerPage) + index + 1)}
                  </h3>
                </div>
                
                {/* Card Body */}
                <div className="p-5">
                  <div className="space-y-4">
                    {/* Basic Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">ID</label>
                        <input
                          type="text"
                          value={item.Eid || ""}
                          className="w-full px-3 py-2 bg-gray-50 border rounded-md text-sm transition-colors border-gray-200"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Payable Amount</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          </span>
                          <input
                            type="text"
                            value={item.payableAmount || ""}
                            className="w-full pl-8 pr-3 py-2 bg-gray-50 border rounded-md text-sm transition-colors border-gray-200"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedItems[index] && (
                    <div className="mt-6 space-y-6 animate-fadeIn">
                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-3 text-sm text-indigo-600 font-medium">
                            Purchase Order Details
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["paymentTerms", "warrantyTerms", "deliveryTerms", "gst", "gstAmount", "totalAmount"].map((field) => (
                          <div key={field} className="relative group">
                            <label className="block text-xs font-medium text-gray-500 mb-1 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                              {getFieldIcon(field)}
                              {field}
                            </label>
                            <input
                              type="text"
                              value={item[field] || ""}
                              className="w-full px-3 py-2 bg-gray-50 border rounded-md text-sm transition-colors border-gray-200 group-hover:border-indigo-200"
                              disabled
                            />
                          </div>
                        ))}
                      </div>

                      {/* Products Section */}
                      {item.rows && item.rows.length > 0 && (
                        <div className="mt-8">
                          {/* Products heading with count badge */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-semibold text-indigo-700 flex items-center">
                              <Package size={18} className="mr-2" />
                              Products
                              <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {item.rows.length}
                              </span>
                            </h4>
                          </div>
                          
                          <div className="space-y-6">
                            {item.rows.map((product, productIndex) => (
                              <div 
                                key={productIndex} 
                                className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow"
                              >
                                {/* Product fields */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {["hsnCode", "unitDescription", "uom", "quantity", "unitPrice", "amount"].map((field) => (
                                    <div key={field} className="relative group">
                                      <label className="block text-xs font-medium text-gray-500 mb-1 group-hover:text-indigo-600 transition-colors">
                                        {field}
                                      </label>
                                      <input
                                        type="text"
                                        value={product[field] || ""}
                                        className="w-full px-3 py-2 bg-white border rounded-md text-sm transition-colors border-gray-200 group-hover:border-indigo-200"
                                        disabled
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => handleViewMore(index)}
                    className={`flex items-center transition-colors text-sm font-medium px-3 py-1.5 rounded-md ${
                      expandedItems[index] 
                        ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {expandedItems[index] ? (
                      <>
                        <EyeOff size={16} className="mr-1" /> Hide Details
                      </>
                    ) : (
                      <>
                        <Eye size={16} className="mr-1" /> View Details
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <AlertTriangle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No Purchase Order Data</h3>
              <p className="text-gray-500 max-w-md">There are currently no purchase orders available. Please try again later or create a new purchase order.</p>
              <button
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px bg-white" aria-label="Pagination">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <ChevronLeft size={16} />
                <span className="sr-only">Previous</span>
              </button>
              
              {getPaginationRange().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof page === 'number' ? changePage(page) : null}
                  disabled={page === "..."}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-indigo-600 text-white border-indigo-600'
                      : page === "..."
                      ? 'bg-white text-gray-500 border-gray-300 cursor-default'
                      : 'bg-white text-indigo-600 border-gray-300 hover:bg-indigo-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <ChevronRight size={16} />
                <span className="sr-only">Next</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchaseorder;