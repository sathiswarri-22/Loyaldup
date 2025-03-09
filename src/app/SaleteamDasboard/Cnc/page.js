"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Customernotconverted = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const employeeId = localStorage.getItem("idstore");

    const token = localStorage.getItem("admintokens"); // Get the token from localStorage

    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5005/api/cc/not-converted/${employeeId}`, // Correct API endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token for authorization
            },
          }
        );
        setCustomers(res.data); // Set the response data to customers
        console.log(res.data);
      } catch (error) {
        setError("Something went wrong while fetching the data"); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    fetchCustomers(); // Call the fetchCustomers function
  }, []);

  const handleBackClick = () => {
    router.push("/SaleteamDasboard/Dasboard"); // Navigate back to the dashboard
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">
          Customers Not Converted
        </h1>
        <button
          onClick={handleBackClick}
          className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <ChevronLeft size={24} />
        </button>

        {loading && (
          <p className="text-center text-green-600">Loading...</p> // Show loading message
        )}

        {error && <p className="text-center text-red-600">{error}</p>} // Show error message if any

        {customers.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-green-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Enquiry No
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Customer ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index} className="border-b hover:bg-green-50">
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {customer.EnquiryNo}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {customer.Eid} {/* Show the Eid (Employee ID) here */}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {customer.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default Customernotconverted;
