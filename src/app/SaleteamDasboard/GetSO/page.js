"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        const eid = localStorage.getItem('idstore');
        const token = localStorage.getItem('admintokens');

        if (!eid || !token) {
          setError('Missing Eid or authentication token.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5005/api-salesorder/salesorders/${eid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOrders(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.error || 'Failed to fetch sales orders');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesOrders();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/SaleteamDasboard/Dasboard")}
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

        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b-2 border-indigo-300 pb-2">
          Sales Orders
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No sales orders found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((order, index) => (
              <div
                key={index}
                className="border border-gray-200 p-5 rounded-lg bg-gradient-to-br from-white to-blue-50 shadow-sm hover:shadow-md transition-all"
              >
                <p className="mb-2"><span className="font-semibold text-gray-700">Sales Order ID:</span> {order.salesOrderId}</p>
                <p className="mb-2"><span className="font-semibold text-gray-700">Customer:</span> {order.salesOrderDetails.customerName}</p>
                <p className="mb-2"><span className="font-semibold text-gray-700">Status:</span> {order.salesOrderDetails.status}</p>
                <p><span className="font-semibold text-gray-700">Grand Total:</span> ₹{order.summary.grandTotal.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
