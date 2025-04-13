'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';

const Purchaseorder = () => {
  const [getdata, setGetdata] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('admintokens') : null;

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
      } else {
        setErrorMessage('No data found.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleViewMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Quotation Data</h1>
      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {errorMessage && <p className="text-center text-red-500 mb-4">{errorMessage}</p>}

      {getdata.length > 0 ? (
        <form className="space-y-6">
          {getdata.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 space-y-4">
              <h3 className="text-xl font-semibold">Quotation {index + 1}</h3>

              {["Eid", "EnquiryNo", "totalAmount", "gst", "gstAmount"].map((field) => (
                <div key={field} className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">{field}</label>
                  <input
                    type="text"
                    value={item[field] || ""} // Ensure correct access to the field
                    className="border p-2 rounded w-full"
                    disabled
                  />
                </div>
              ))}

              {expandedIndex === index && (
                <>
                  {["paymentTerms", "warrantyTerms", "deliveryTerms", "payableAmount"].map((field) => (
                    <div key={field} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">{field}</label>
                      <input
                        type="text"
                        value={item[field] || ""}
                        className="border p-2 rounded w-full"
                        disabled
                      />
                    </div>
                  ))}

                  {item.rows &&
                    item.rows.map((product, productIndex) => (
                      <div key={productIndex} className="border p-4 mb-4 rounded bg-gray-50">
                        <h4 className="text-lg font-semibold mb-2">Product {productIndex + 1}</h4>
                        {["hsnCode", "unitDescription", "uom", "quantity", "unitPrice", "amount"].map((field) => (
                          <div key={field} className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">{field}</label>
                            <input
                              type="text"
                              value={product[field] || ""} // Corrected the access pattern
                              className="border p-2 rounded w-full"
                              disabled
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                </>
              )}

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleViewMore(index)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {expandedIndex === index ? 'View Less' : 'View More'}
                </button>
              </div>

              <hr className="border-t-2 border-gray-300" />
            </div>
          ))}
        </form>
      ) : (
        <p className="text-center text-gray-500">No data available.</p>
      )}
    </div>
  );
};

export default Purchaseorder;
  