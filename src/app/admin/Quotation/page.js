"use client";

import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronLeft, Eye, EyeOff, Edit2, Save, CheckCircle, AlertTriangle, DollarSign, Package, Calendar, Tag, Percent, ChevronRight } from 'lucide-react';

const Quotation = () => {
  const [getdata, setGetdata] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const quotationsPerPage = 4;
  
  const search = useSearchParams();
  const EnquiryNo = search.get('EnquiryNo');
  const pageParam = search.get('page');
  const token = typeof window !== 'undefined' ? localStorage.getItem('admintokens') : null;
  const router = useRouter();

  // Set page from URL parameter if available
  useEffect(() => {
    if (pageParam) {
      const pageNumber = parseInt(pageParam);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        setCurrentPage(pageNumber);
      }
    }
  }, [pageParam]);

  const fetchData = async () => {
    if (!token) {
      setErrorMessage('Error: Missing authorization token.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const [response1, response2] = await Promise.allSettled([
        axios.get('http://localhost:5005/api/quationgeteditmany', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5005/api/quationgetmany', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      let editManyData = [];
      let manyData = [];

      if (response1.status === 'fulfilled') {
        editManyData = response1.value?.data?.formeditedquotation || [];
      }

      if (response2.status === 'fulfilled') {
        manyData = response2.value?.data?.formattedQuotations || [];
      }

      let combinedData = [];

      if (editManyData.length > 0 && manyData.length > 0) {
        const validData1 = editManyData.filter(
          (item) => item.Status !== 'Editaccess' && item.Status !== 'quotsaccess'
        );
        combinedData = [...validData1, ...manyData];
      } else if (editManyData.length > 0) {
        const validData1 = editManyData.filter(
          (item) => item.Status !== 'Editaccess' && item.Status !== 'quotsaccess'
        );
        combinedData = validData1;
      } else if (manyData.length > 0) {
        combinedData = manyData;
      } else {
        setErrorMessage('No quotations available from both APIs.');
        setGetdata([]);
        return;
      }

      if (combinedData.length > 0) {
        setGetdata(combinedData);
        setTotalPages(Math.ceil(combinedData.length / quotationsPerPage));
        setSuccessMessage(`Successfully loaded ${combinedData.length} quotations.`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('No valid quotations available.');
        setGetdata([]);
      }
    } catch (error) {
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
  }, [token, EnquiryNo]);

  // Get current page quotations
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * quotationsPerPage;
    const endIndex = startIndex + quotationsPerPage;
    return getdata.slice(startIndex, endIndex);
  };

  // Change page handler
  const changePage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    setCurrentPage(pageNumber);
    setExpandedItems({}); // Reset expanded items when changing page
    setEditIndex(null); // Reset edit mode when changing page
    
    // Update URL with page parameter
    const params = new URLSearchParams(search);
    params.set('page', pageNumber);
    router.push(`?${params.toString()}`);
  };

  const handleInputChange = (index, field, value, productIndex = null) => {
    const updatedData = [...getdata];
    const actualIndex = (currentPage - 1) * quotationsPerPage + index;
    
    if (productIndex !== null) {
      updatedData[actualIndex].products[productIndex] = {
        ...updatedData[actualIndex].products[productIndex],
        [field]: value,
      };
    } else {
      updatedData[actualIndex] = { ...updatedData[actualIndex], [field]: value };
    }
    setGetdata(updatedData);
  };

  const handleProductChange = (index, productIndex, field, value) => {
    const updatedData = [...getdata];
    const actualIndex = (currentPage - 1) * quotationsPerPage + index;
    
    updatedData[actualIndex].products[productIndex] = {
      ...updatedData[actualIndex].products[productIndex],
      [field]: value,
    };
    setGetdata(updatedData);
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

  const handleEdit = (index) => {
    setEditIndex(index);
    setErrorMessage('');
  };

  const handleSave = async (index) => {
    const actualIndex = (currentPage - 1) * quotationsPerPage + index;
    const item = { ...getdata[actualIndex] };
  
    // Check the structure of item and EnquiryNo
    console.log('Item:', item);
    const { EnquiryNo, ...updateFields } = item;
  
    if (!EnquiryNo || !item.PayableAmount || !item.Status) {
      setErrorMessage('Error: Please fill in all the required fields.');
      return;
    }
  
    item.Status = 'Editaccess';
    setLoading(true);
    setErrorMessage('');
  
    try {
      console.log('Sending PUT request with data:', { EnquiryNo, ...updateFields });
      const response = await axios.put(
        'http://localhost:5005/api/mdeditQuotation',
        { EnquiryNo, ...updateFields },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log('Response data:', response.data);
  
      if (response.status === 200) {
        const updatedGetData = [...getdata];
        updatedGetData[actualIndex] = response.data;
        setGetdata(updatedGetData);
        setEditIndex(null);
        setSuccessMessage('Quotation updated successfully!');
      } else {
        setErrorMessage('Failed to update the quotation.');
      }
    } catch (error) {
      console.error('Error during update:', error);  // Log the error details
      setErrorMessage('Failed to update the quotation.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleVerify = async (index) => {
    const actualIndex = (currentPage - 1) * quotationsPerPage + index;
    const item = { ...getdata[actualIndex] };
    const { EnquiryNo, Status } = item;

    if (!EnquiryNo) {
      setErrorMessage('Error: EnquiryNo is missing.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      let apiEndpoint = '';
      if (Status === 'quotsreq') {
        apiEndpoint = `http://localhost:5005/api/Quatationreq/${EnquiryNo}`;
    } else if (Status === 'Editreq') {
        apiEndpoint = `http://localhost:5005/api/editAccessQuotation/${EnquiryNo}`;
    } else if (Status === 'quotsaccess') {
        // Prevent updating `quotsaccess` status
        setErrorMessage('Cannot modify quotations with status "quotsaccess".');
        return;
    } else {
        setErrorMessage('Invalid status for verification.');
        return;
    }
    

      const response = await axios.put(apiEndpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const updatedGetData = [...getdata];
        updatedGetData.splice(actualIndex, 1);
        setGetdata(updatedGetData);
        setTotalPages(Math.ceil((updatedGetData.length) / quotationsPerPage));
        
        // If current page is now empty and it's not the first page, go to previous page
        if (getCurrentPageData().length === 0 && currentPage > 1) {
          changePage(currentPage - 1);
        }
        
        setSuccessMessage('Quotation verified successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Failed to verify the quotation.');
      }
    } catch (error) {
      setErrorMessage('Failed to verify the quotation.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'quotsreq':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Editreq':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  // Returns the appropriate icon for the field
  const getFieldIcon = (field) => {
    switch(field) {
      case 'Warranty': return <Calendar size={14} className="text-indigo-500" />;
      case 'Delivery': return <Package size={14} className="text-indigo-500" />;
      case 'Discount': return <Percent size={14} className="text-indigo-500" />;
      case 'Paymentdue': return <DollarSign size={14} className="text-indigo-500" />;
      case 'validity': return <Calendar size={14} className="text-indigo-500" />;
      case 'Gst': return <Tag size={14} className="text-indigo-500" />;
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
          
          <h1 className="text-3xl font-bold text-indigo-700">Quotation Management</h1>
          
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
              <p className="text-indigo-600 font-medium">Loading quotations...</p>
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

       

        {/* Quotation Grid */}
        {currentPageData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPageData.map((item, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 
                  ${expandedItems[index] ? 'lg:col-span-3 md:col-span-2 shadow-xl z-10 scale-100' : 'hover:shadow-xl hover:-translate-y-1'}
                  ${editIndex === index ? 'ring-2 ring-indigo-500' : ''}`}
              >
                {/* Card Header with Status Badge */}
                <div className={`p-4 text-white flex justify-between items-center ${
                  expandedItems[index] 
                    ? 'bg-gradient-to-r from-indigo-700 to-blue-700' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600'
                }`}>
                  <h3 className="text-lg font-semibold flex items-center">
                    Quotation {item.EnquiryNo || (((currentPage - 1) * quotationsPerPage) + index + 1)}
                  </h3>
                  {item.Status && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item.Status)}`}>
                      {item.Status}
                    </span>
                  )}
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
                          onChange={(e) => handleInputChange(index, "Eid", e.target.value)}
                          className={`w-full px-3 py-2 bg-gray-50 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors ${
                            editIndex === index ? 'border-indigo-300' : 'border-gray-200'
                          }`}
                          disabled={editIndex !== index}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Payable Amount</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          </span>
                          <input
                            type="text"
                            value={item.PayableAmount || ""}
                            onChange={(e) => handleInputChange(index, "PayableAmount", e.target.value)}
                            className={`w-full pl-8 pr-3 py-2 bg-gray-50 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors ${
                              editIndex === index ? 'border-indigo-300' : 'border-gray-200'
                            }`}
                            disabled={editIndex !== index}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content - Only shown when this specific quotation is expanded */}
                  {expandedItems[index] && (
                    <div className="mt-6 space-y-6 animate-fadeIn">
                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-3 text-sm text-indigo-600 font-medium">
                            Quotation Details
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["Warranty", "Delivery", "Discount", "Paymentdue", "validity", "Gst"].map((field) => (
                          <div key={field} className="relative group">
                            <label className="block text-xs font-medium text-gray-500 mb-1 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                              {getFieldIcon(field)}
                              {field}
                            </label>
                            <input
                              type="text"
                              value={item[field] || ""}
                              onChange={(e) => handleInputChange(index, field, e.target.value)}
                              className={`w-full px-3 py-2 bg-gray-50 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors ${
                                editIndex === index ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
                              } group-hover:border-indigo-200`}
                              disabled={editIndex !== index}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Products Section with improved styling */}
                      {item.products && item.products.length > 0 && (
                        <div className="mt-8">
                          {/* Products heading with count badge */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-semibold text-indigo-700 flex items-center">
                              <Package size={18} className="mr-2" />
                              Products
                              <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {item.products.length}
                              </span>
                            </h4>
                          </div>
                          
                          <div className="space-y-6">
                            {item.products.map((product, productIndex) => (
                              <div 
                                key={productIndex} 
                                className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow"
                              >
                                {/* Product fields in a neat grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {["HSNCode", "UnitDescription", "UOM", "Quantity", "UnitPrice", "Total"].map((field) => (
                                    <div key={field} className="relative group">
                                      <label className="block text-xs font-medium text-gray-500 mb-1 group-hover:text-indigo-600 transition-colors">
                                        {field}
                                      </label>
                                      <input
                                        type="text"
                                        value={product[field] || ""}
                                        onChange={(e) => handleProductChange(index, productIndex, field, e.target.value)}
                                        className={`w-full px-3 py-2 bg-white border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors ${
                                          editIndex === index ? 'border-indigo-300' : 'border-gray-200'
                                        } group-hover:border-indigo-200`}
                                        disabled={editIndex !== index}
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
                  
                  <div className="flex gap-2">
                    {editIndex === index ? (
                      <button
                        type="button"
                        onClick={() => handleSave(index)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center text-sm"
                      >
                        <Save size={14} className="mr-1" /> Save
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEdit(index)}
                        className={`px-3 py-1.5 rounded-md transition-colors flex items-center text-sm ${
                          editIndex === null 
                            ? 'bg-amber-500 text-white hover:bg-amber-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={editIndex !== null && editIndex !== index}
                      >
                        <Edit2 size={14} className="mr-1" /> Edit
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleVerify(index)}
                      className={`px-3 py-1.5 rounded-md transition-colors flex items-center text-sm ${
                        editIndex === null 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={editIndex !== null}
                    >
                      <CheckCircle size={14} className="mr-1" /> Verify
                    </button>
                  </div>
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
              <h3 className="text-lg font-medium text-gray-700">No Quotation Data</h3>
              <p className="text-gray-500 max-w-md">There are currently no quotations available. Please try again later or create a new quotation.</p>
              <button
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Pagination controls - Bottom */}
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

export default Quotation;