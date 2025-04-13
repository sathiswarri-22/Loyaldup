'use client';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const Quotation = () => {
  const [getdata, setGetdata] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const search = useSearchParams();
  const EnquiryNo = search.get('EnquiryNo');
  const token = typeof window !== 'undefined' ? localStorage.getItem('admintokens') : null;

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
        console.log('Edit Quotation Response:', response1.value.data);
        editManyData = response1.value?.data?.formeditedquotation || [];
      } else {
        console.error('Edit Quotation Fetch Error:', response1.reason);
      }

      if (response2.status === 'fulfilled') {
        console.log('Many Quotation Response:', response2.value.data);
        manyData = response2.value?.data?.formattedQuotations || [];
      } else {
        console.error('Many Quotation Fetch Error:', response2.reason);
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
      } else {
        setErrorMessage('No valid quotations available.');
        setGetdata([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
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

  const handleInputChange = (index, field, value, productIndex = null) => {
    const updatedData = [...getdata];
    if (productIndex !== null) {
      updatedData[index].products[productIndex] = {
        ...updatedData[index].products[productIndex],
        [field]: value,
      };
    } else {
      updatedData[index] = { ...updatedData[index], [field]: value };
    }
    setGetdata(updatedData);
  };

  const handleProductChange = (index, productIndex, field, value) => {
    const updatedData = [...getdata];
    updatedData[index].products[productIndex] = {
      ...updatedData[index].products[productIndex],
      [field]: value,
    };
    setGetdata(updatedData);
  };

  const handleViewMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setErrorMessage('');
  };

  const handleSave = async (index) => {
    const item = { ...getdata[index] };
    const { EnquiryNo, ...updateFields } = item;

    if (!EnquiryNo || !item.PayableAmount || !item.Status) {
      setErrorMessage('Error: Please fill in all the required fields.');
      return;
    }

    item.Status = 'Editaccess';
    setLoading(true);
    setErrorMessage('');

    try {
      console.log('Saving data:', { EnquiryNo, ...updateFields });

      const response = await axios.put(
        'http://localhost:5005/api/mdeditQuotation',
        { EnquiryNo, ...updateFields },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const updatedGetData = [...getdata];
        updatedGetData[index] = response.data;
        setGetdata(updatedGetData);
        setEditIndex(null);
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to update the quotation.');
      }
    } catch (error) {
      console.error('Error saving quotation:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to update the quotation.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (index) => {
    const item = { ...getdata[index] };
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
      } else {
        setErrorMessage('Error: Invalid status for verification.');
        setLoading(false);
        return;
      }

      const response = await axios.put(apiEndpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const updatedGetData = [...getdata];
        updatedGetData.splice(index, 1);
        setGetdata(updatedGetData);
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to verify the quotation.');
      }
    } catch (error) {
      console.error('Error verifying quotation:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to verify the quotation.');
    } finally {
      setLoading(false);
    }
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

              {["Eid", "EnquiryNo", "PayableAmount"].map((field) => (
                <div key={field} className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">{field}</label>
                  <input
                    type="text"
                    value={item[field] || ""}
                    onChange={(e) => handleInputChange(index, field, e.target.value)}
                    className="border p-2 rounded w-full"
                    disabled={editIndex !== index}
                  />
                </div>
              ))}

              {expandedIndex === index && (
                <>
                  {["Warranty", "Delivery", "Discount", "Paymentdue", "validity", "Gst"].map((field) => (
                    <div key={field} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">{field}</label>
                      <input
                        type="text"
                        value={item[field] || ""}
                        onChange={(e) => handleInputChange(index, field, e.target.value)}
                        className="border p-2 rounded w-full"
                        disabled={editIndex !== index}
                      />
                    </div>
                  ))}

                  {item.products &&
                    item.products.map((product, productIndex) => (
                      <div key={productIndex} className="border p-4 mb-4 rounded bg-gray-50">
                        <h4 className="text-lg font-semibold mb-2">Product {productIndex + 1}</h4>
                        {["HSNCode", "UnitDescription", "Description", "UOM", "Quantity", "UnitPrice", "Total"].map((field) => (
                          <div key={field} className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">{field}</label>
                            <input
                              type="text"
                              value={product[field] || ""}
                              onChange={(e) =>
                                handleProductChange(index, productIndex, field, e.target.value)
                              }
                              className="border p-2 rounded w-full"
                              disabled={editIndex !== index}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                </>
              )}

              <div className="flex space-x-2">
                {editIndex === index ? (
                  <button
                    type="button"
                    onClick={() => handleSave(index)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleViewMore(index)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {expandedIndex === index ? 'View Less' : 'View More'}
                </button>
                <button
                  type="button"
                  onClick={() => handleVerify(index)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Verify
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

export default Quotation;
