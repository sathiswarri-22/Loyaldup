"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ChevronLeft, Search, Filter, Download, Edit2, Save, X } from "lucide-react";

const Getservicedetails = () => {
  const router = useRouter();
  const [serviceData, setServiceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    Customerinward: true,
    quantity: true,
    servicestartdate: true,
    Employeeid: true,
    clientName: true,
    Material: true,
    Model: true,
    SerialNo: true,
    powerconsumption: true,
    serviceStatus: true,
    serviceenddate: true,
    BillingStatus: true,
    customerComplaint: false,
    engineerProblem: false
  });
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admintokens");
    const Employeeid = localStorage.getItem("idstore");

    const savedData = localStorage.getItem("serviceData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setServiceData(parsedData);
      setFilteredData(parsedData);
    }
    getservicedetails(Employeeid, token);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = serviceData.filter(service => 
        Object.values(service).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(serviceData);
    }
  }, [searchTerm, serviceData]);

  const getservicedetails = async (Employeeid, token) => {
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
      setFilteredData(fetchedData);
      localStorage.setItem("serviceData", JSON.stringify(fetchedData));
    } catch (err) {
      console.error("Error fetching service details:", err);
      setError(err.response?.data?.message || "Failed to fetch data from server.");
    }
  };

  const handleBackClick = () => {
    router.push("/ServiceProject/Dasboard");
  };

  const handleEditClick = (service) => {
    setEditingRowId(service._id);
    setUpdatedData({ ...service });
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setUpdatedData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({
      ...updatedData,
      [name]: value,
    });
  };

  const saveServiceDetails = async () => {
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

      const token = localStorage.getItem("admintokens");
      const response = await axios.put(
        `http://localhost:5005/api/servicedetails/${updatedData._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedList = serviceData.map((service) =>
          service._id === updatedData._id ? { ...service, ...updatedData } : service
        );
        setServiceData(updatedList);
        setFilteredData(updatedList);
        localStorage.setItem("serviceData", JSON.stringify(updatedList));
        setEditingRowId(null);
        setError(null);
      } else {
        setError("Failed to update service details.");
      }
    } catch (err) {
      console.error("Error saving service details:", err);
      setError("Failed to save service details.");
    }
  };

  const toggleColumnVisibility = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column]
    });
  };

  const exportToCSV = () => {
    const visibleData = filteredData.map(item => {
      const filtered = {};
      Object.keys(visibleColumns).forEach(key => {
        if (visibleColumns[key]) {
          filtered[key] = item[key];
        }
      });
      return filtered;
    });
    
    const headers = Object.keys(visibleColumns)
      .filter(key => visibleColumns[key])
      .join(',');
    
    const csvContent = [
      headers,
      ...visibleData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'service_details.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columnLabels = {
    Customerinward: "Customer Inward",
    quantity: "Quantity",
    servicestartdate: "Service Start Date",
    Employeeid: "Employee ID",
    clientName: "Company Name",
    Material: "Material",
    Model: "Model",
    SerialNo: "Serial No",
    powerconsumption: "HP/KW",
    serviceStatus: "Service Status",
    serviceenddate: "Service End Date",
    BillingStatus: "Billing Status",
    customerComplaint: "Customer Complaint",
    engineerProblem: "Engineer Problem"
  };

  const visibleColumnKeys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackClick}
                className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                Service Details <span className="text-blue-600 text-xl">{localStorage.getItem("idstore")}</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search in all fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter size={16} />
                  <span>Columns</span>
                </button>
                
                {showColumnSelector && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-3">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b">
                      <h3 className="font-medium">Show/Hide Columns</h3>
                      <button onClick={() => setShowColumnSelector(false)} className="text-gray-500 hover:text-gray-700">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {Object.keys(visibleColumns).map(column => (
                        <div key={column} className="flex items-center py-1.5">
                          <input
                            type="checkbox"
                            id={`col-${column}`}
                            checked={visibleColumns[column]}
                            onChange={() => toggleColumnVisibility(column)}
                            className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`col-${column}`} className="text-sm text-gray-700">
                            {columnLabels[column]}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="m-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            <p>{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          {filteredData.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  {visibleColumnKeys.map(key => (
                    <th key={key} className="px-4 py-3 text-left font-medium">
                      {columnLabels[key]}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                    {visibleColumnKeys.map(key => (
                      <td key={key} className="px-4 py-3 text-sm text-gray-800">
                        {editingRowId === service._id ? (
                          <input
                            type={
                              key.toLowerCase().includes("date")
                                ? "date"
                                : key === "quantity"
                                ? "number"
                                : "text"
                            }
                            name={key}
                            value={updatedData[key] || ""}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          />
                        ) : (
                          service[key]
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm">
                      {editingRowId === service._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={saveServiceDetails}
                            className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"
                            title="Save"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(service)}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-2">No service details found</p>
              <p className="text-sm text-gray-400">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Getservicedetails;        