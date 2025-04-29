"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  // Get the token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('admintokens');
    setToken(storedToken);
  }, []);

  // Fetch invoices when token is set
  useEffect(() => {
    if (!token) return;
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api-invoice/invoices', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setInvoices(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [token]);

  const handleViewMore = (piId) => {
    console.log(`Navigating to invoice with piId: ${piId}`);
    router.push(`/SaleteamDasboard/DetailsPI?piId=${piId}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Invoices</h1>
      {loading && <p className="text-blue-500">Loading invoices...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="overflow-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full table-auto bg-white">
            <thead className="bg-gray-100 text-sm text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{invoice.referenceNumber}</td>
                  <td className="px-6 py-4">{invoice.name}</td>
                  <td className="px-6 py-4">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">₹{invoice.totalPayable.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                      invoice.Status === 'POreq' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                    }`}>
                      {invoice.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
      <button 
        onClick={() => handleViewMore(invoice.piId)}  // ✅ use invoice.piId here
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition duration-300"
      >
        View More
      </button>
    </td>
  </tr>
))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}