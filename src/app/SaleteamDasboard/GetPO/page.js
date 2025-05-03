"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'; 

export default function SuppliersTable() {
  const [suppliersWithPOs, setSuppliersWithPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("admintokens");
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all suppliers
        const res = await axios.get("http://localhost:5005/api-purchaseorder/POGetAllSuppier", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const suppliers = res.data;

        // Fetch PO data for each supplier
        const suppliersWithPOsPromises = suppliers.map(async (supplier) => {
          try {
            const resPO = await axios.get(
              `http://localhost:5005/api-purchaseorder/POGetAllSuppPO/${supplier.SuppNO}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            return {
              ...supplier,
              purchaseOrders: resPO.data,
            };
          } catch (err) {
            console.error(`❌ Error fetching POs for ${supplier.SupplierName}:`, err);
            return {
              ...supplier,
              purchaseOrders: [],
            };
          }
        });

        const results = await Promise.all(suppliersWithPOsPromises);
        setSuppliersWithPOs(results);
      } catch (error) {
        console.error("❌ Error fetching supplier data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleGeneratePDF = (poNumber) => {
    if (!poNumber) return;
    router.push(`/SaleteamDasboard/POPdf?poNumber=${poNumber}`);
  };
  

  if (loading) return <p>Loading suppliers and purchase orders...</p>;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
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
      <h2 className="text-3xl font-extrabold text-purple-700 mb-6 border-b-2 border-purple-300 pb-2">
        Supplier & Purchase Orders
      </h2>
  
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full table-auto border border-purple-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-purple-100 text-purple-900">
              <th className="px-5 py-3 text-left font-semibold border border-purple-300">Supplier Name</th>
              <th className="px-5 py-3 text-left font-semibold border border-purple-300">GSTIN</th>
              <th className="px-5 py-3 text-left font-semibold border border-purple-300">PO Number</th>
              <th className="px-5 py-3 text-left font-semibold border border-purple-300">PO Created Date</th>
              <th className="px-5 py-3 text-left font-semibold border border-purple-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {suppliersWithPOs.map((supplier) =>
              supplier.purchaseOrders.length > 0 ? (
                supplier.purchaseOrders.map((po, index) => (
                  <tr key={`${supplier._id}-${index}`} className="hover:bg-purple-50 transition-all">
                    {index === 0 && (
                      <>
                        <td
                          className="px-5 py-4 border border-purple-200 align-top font-medium"
                          rowSpan={supplier.purchaseOrders.length}
                        >
                          {supplier.SupplierName}
                        </td>
                        <td
                          className="px-5 py-4 border border-purple-200 align-top"
                          rowSpan={supplier.purchaseOrders.length}
                        >
                          {supplier.GSTIN}
                        </td>
                      </>
                    )}
                    <td className="px-5 py-4 border border-purple-200">{po.poNumber}</td>
                    <td className="px-5 py-4 border border-purple-200">
                      {new Date(po.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 border border-purple-200 space-x-2 flex items-center">
                      <button
                        title="View"
                        onClick={() =>
                          router.push(`/SaleteamDasboard/Editview?poNumber=${po.poNumber}`)
                        }
                        className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition"
                      >
                        <img src="/viewmore.png" alt="View" className="w-5 h-5" />
                      </button>
  
                      <button
                        title="Delete"
                        onClick={async () => {
                          if (
                            confirm(`Are you sure you want to delete PO: ${po.poNumber}?`)
                          ) {
                            try {
                              await axios.delete(
                                `http://localhost:5005/api-purchaseorder/deletePO?poNumber=${po.poNumber}`,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              alert("PO deleted successfully.");
                              window.location.reload();
                            } catch (error) {
                              console.error("❌ Error deleting PO:", error);
                              alert("Failed to delete PO.");
                            }
                          }
                        }}
                        className="bg-red-100 hover:bg-red-200 p-2 rounded-full transition"
                      >
                        <img src="/delete.png" alt="Delete" className="w-5 h-5" />
                      </button>
  
                      <button
                        title="Download PDF"
                        onClick={() => handleGeneratePDF(po.poNumber)}
                        className="bg-green-100 hover:bg-green-200 p-2 rounded-full transition"
                      >
                        <img src="/Pdfview.png" alt="PDF" className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key={supplier._id} className="bg-gray-50">
                  <td className="px-5 py-4 border border-purple-200">{supplier.SupplierName}</td>
                  <td className="px-5 py-4 border border-purple-200">{supplier.GSTIN}</td>
                  <td className="px-5 py-4 text-center text-gray-500 border border-purple-200" colSpan={3}>
                    No Purchase Orders
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  


  );
}
