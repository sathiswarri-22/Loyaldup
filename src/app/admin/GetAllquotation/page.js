"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

const Quotations = () => {
    const [quotations, setQuotations] = useState([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleProducts, setVisibleProducts] = useState({});
  
    useEffect(() => {
      const fetchQuotations = async () => {
        try {
          const token = localStorage.getItem("admintokens");
  
          const response = await axios.get("http://localhost:5005/api/GetAllquotation", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setQuotations(response.data.data);
        } catch (error) {
          setError(error.response?.data?.message || error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchQuotations();
    }, []);
  
    const toggleViewMore = (quotationId) => {
      setVisibleProducts((prevState) => ({
        ...prevState,
        [quotationId]: !prevState[quotationId],
      }));
    };
  
    const handleBackClick = () => {
      router.push("/admin/adminDasboard");
    };
  
    if (loading) return <div className="text-center text-xl text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-xl text-red-500">Error: {error}</div>;
  
    return (
      <div className="container mx-auto p-6">
        <button
          onClick={handleBackClick}
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
  
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Latest Quotations</h1>
  
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="table-auto w-full border-collapse text-sm text-gray-700">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="border px-4 py-2">Enquiry No</th>
                <th className="border px-4 py-2">Reference No</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Total Payable Amount</th>
                <th className="border px-4 py-2">Payment Due</th>
                <th className="border px-4 py-2">Validity</th>
                <th className="border px-4 py-2">Warranty</th>
                <th className="border px-4 py-2">Delivery</th>
                <th className="border px-4 py-2">Discount</th>
                <th className="border px-4 py-2">GST</th>
                <th className="border px-4 py-2">Products</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quotation, index) => (
                <Fragment key={quotation._id}>
                  {/* Main quotation row */}
                  <tr
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-indigo-100 transition-colors`}
                  >
                    <td className="border px-4 py-2">{quotation.EnquiryNo}</td>
                    <td className="border px-4 py-2">{quotation.ReferenceNumber}</td>
                    <td className="border px-4 py-2">{quotation.Status}</td>
                    <td className="border px-4 py-2">{quotation.PayableAmount}</td>
                    <td className="border px-4 py-2">{quotation.Paymentdue} days</td>
                    <td className="border px-4 py-2">{quotation.validity}</td>
                    <td className="border px-4 py-2">{quotation.Warranty}</td>
                    <td className="border px-4 py-2">{quotation.Delivery}</td>
                    <td className="border px-4 py-2">{quotation.Discount}</td>
                    <td className="border px-4 py-2">{quotation.Gst}%</td>
                    <td className="border px-4 py-2">
                      <ul className="space-y-1">
                        {/* Show only the first product */}
                        {quotation.products.slice(0, 1).map((product, i) => (
                          <ul key={product._id} className="text-sm">
                            <h6 className="text-violet-900"><b>Product1</b></h6>
                           <li> <strong>Description:</strong> {product.Description}</li>
                                <li><strong>HSN Code:</strong> {product.HSNCode}</li>
                                <li><strong>Unit Description:</strong> {product.UnitDescription}</li>
                                <li><strong>UOM:</strong> {product.UOM}</li>
                                <li><strong>Quantity:</strong> {product.Quantity}</li>
                                <li><strong>Unit Price:</strong> {product.UnitPrice}</li>
                                <li><strong>Total:</strong> {product.Total}</li>
                                </ul>
                        ))}
                        {/* Show "View More" if more products */}
                        {quotation.products.length > 1 && (
                          <button
                            className="text-indigo-600 mt-1"
                            onClick={() => toggleViewMore(quotation._id)}
                          >
                            {visibleProducts[quotation._id] ? "View Less" : "View More"}
                          </button>
                        )}
                      </ul>
                    </td>
                  </tr>
  
                  {/* Expanded products row (separate) */}
                  {visibleProducts[quotation._id] && (
                    <tr className="bg-white">
                      <td colSpan={11} className="border px-6 py-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {quotation.products.slice(1).map((product, idx) => (
                            <div
                              key={product._id}
                              className="p-4 border rounded-md shadow-sm bg-gray-50"
                            >
                              <h4 className="font-semibold text-indigo-700 mb-2">
                                Product {idx + 2}
                              </h4>
                              <ul className="text-sm text-gray-700 space-y-1">
                                <li><strong>Description:</strong> {product.Description}</li>
                                <li><strong>HSN Code:</strong> {product.HSNCode}</li>
                                <li><strong>Unit Description:</strong> {product.UnitDescription}</li>
                                <li><strong>UOM:</strong> {product.UOM}</li>
                                <li><strong>Quantity:</strong> {product.Quantity}</li>
                                <li><strong>Unit Price:</strong> {product.UnitPrice}</li>
                                <li><strong>Total:</strong> {product.Total}</li>
                              </ul>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

export default Quotations;
