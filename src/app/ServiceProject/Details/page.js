"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const Getservicedetails = () => {
  const router = useRouter();
  const [serviceData, setServiceData] = useState([]);
  const [error, setError] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const token = localStorage.getItem("admintokens");
  const Employeeid = localStorage.getItem("idstore");

  // Load service data from localStorage if it exists
  useEffect(() => {
    const savedData = localStorage.getItem("serviceData");
    if (savedData) {
      setServiceData(JSON.parse(savedData));
    }
    // Fetch latest data from the server
    getservicedetails(Employeeid);
  }, [Employeeid]);

  const getservicedetails = async (Employeeid) => {
    try {
      const response = await axios.get(
        `http://localhost:5005/api/getservicedetails/${Employeeid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedData = response.data.data;
      setServiceData(fetchedData);
      // Save fetched data to localStorage for persistence
      localStorage.setItem("serviceData", JSON.stringify(fetchedData));
    } catch (err) {
      console.error("Error fetching service details:", err);
      setError(err.response?.data?.message || "Failed to fetch data from server.");
    }
  };

  const handleBackClick = () => {
    router.push('/ServiceProject/Dasboard');
  };

  const handleEditClick = (service) => {
    setEditingRowId(service._id);
    setUpdatedData(service);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({
      ...updatedData,
      [name]: value,
    });
  };

  const saveServiceDetails = async (id, updatedData) => {
    try {
      if (
        !updatedData.Customerinward ||
        !updatedData.clientName ||
        !updatedData.servicestartdate ||
        !updatedData.Employeeid
      ) {
        setError("Required fields are missing!");
        return;
      }

      // Updated URL using service _id
      const response = await axios.put(
        `http://localhost:5005/api/servicedetails/${updatedData._id}`,  // Use _id from updatedData
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update frontend serviceData with the updated data
        setServiceData((prevData) =>
          prevData.map((service) =>
            service._id === updatedData._id ? { ...service, ...updatedData } : service
          )
        );
        // Save updated data back to localStorage
        localStorage.setItem("serviceData", JSON.stringify(serviceData));
        setEditingRowId(null);  // Stop editing mode after save
      } else {
        setError("Failed to update service details.");
      }
    } catch (err) {
      console.error("Error saving service details:", err);
      setError("Failed to save service details.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">
          Service Details for Employee ID: {Employeeid}
        </h1>

        <button
          onClick={handleBackClick}
          className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <ChevronLeft size={24} />
        </button>

        {serviceData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-green-100">
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Customer Inward</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Client Name</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Quantity</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Service Start Date</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Employee ID</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Material</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Model</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Serial No</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Power Consumption</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Service Status</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Service End Date</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Billing Status</th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {serviceData.map((service) => (
                  <tr key={service._id} className="border-b hover:bg-green-50">
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="text"
                          name="Customerinward"
                          value={updatedData.Customerinward || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.Customerinward
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="text"
                          name="clientName"
                          value={updatedData.clientName || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.clientName
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="number"
                          name="quantity"
                          value={updatedData.quantity || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.quantity
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="date"
                          name="servicestartdate"
                          value={updatedData.servicestartdate || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.servicestartdate
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {service.Employeeid}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="text"
                          name="Material"
                          value={updatedData.Material || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.Material
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="text"
                          name="Model"
                          value={updatedData.Model || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.Model
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="text"
                          name="SerialNo"
                          value={updatedData.SerialNo || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.SerialNo
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="text"
                          name="powerconsumption"
                          value={updatedData.powerconsumption || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.powerconsumption
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="text"
                          name="serviceStatus"
                          value={updatedData.serviceStatus || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.serviceStatus
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="date"
                          name="serviceenddate"
                          value={updatedData.serviceenddate || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.serviceenddate
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <input
                          type="text"
                          name="BillingStatus"
                          value={updatedData.BillingStatus || ""}
                          onChange={handleInputChange}
                          className="mt-2 p-2 w-full border rounded-md"
                        />
                      ) : (
                        service.BillingStatus
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {editingRowId === service._id ? (
                        <button
                          onClick={() => saveServiceDetails(service._id, updatedData)}
                          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(service)}
                          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">No service details to display</p>
        )}
      </div>
    </div>
  );
};

export default Getservicedetails;