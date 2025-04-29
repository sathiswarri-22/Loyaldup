"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, Edit2, Trash2, Search, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

const Getresources = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("admintokens");
  const router = useRouter();

  const fetchCompanyResources = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5005/api/getCompanyresource",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        setError("Invalid data format received from server.");
      }
    } catch (error) {
      console.error("Error details:", error);
      setError(
        error.response?.data?.message || "Error: Server issue, try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyResources();
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid Date" : date.toLocaleDateString("en-GB");
  };

  const handleEdit = (Eid, resource) => {
    setEditData({ Eid, ...resource });
  };

  const handleSubmit = async (e, Eid) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5005/api/updateCompanyresource/${Eid}`,
        {
          EOD: editData.EOD,
          givenStatus: editData.givenStatus,
          Thingsname: editData.Thingsname,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.Eid === Eid
            ? {
                ...emp,
                CompanyResources: emp.CompanyResources.map((res) =>
                  res.productnumber === editData.productnumber
                    ? { ...res, EOD: editData.EOD, givenStatus: editData.givenStatus }
                    : res
                ),
              }
            : emp
        )
      );

      setEditData(null);
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update. Please try again.");
    }
  };

  const handleDelete = async (Eid, Thingsname) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    
    try {
      await axios.delete(
        `http://localhost:5005/api/deleteCompanyresource/${Eid}/${Thingsname}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.Eid === Eid
            ? {
                ...emp,
                CompanyResources: emp.CompanyResources.filter(
                  (res) => res.Thingsname !== Thingsname
                ),
              }
            : emp
        )
      );
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete resource. Please try again.");
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.name?.toLowerCase().includes(searchLower) ||
      employee.Eid?.toLowerCase().includes(searchLower) ||
      employee.CompanyResources?.some(
        (resource) =>
          resource.Thingsname?.toLowerCase().includes(searchLower) ||
          resource.productnumber?.toLowerCase().includes(searchLower) ||
          resource.givenStatus?.toLowerCase().includes(searchLower)
      )
    );
  });

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "provided":
      case "given":
        return "bg-green-100 text-green-800 border-green-300";
      case "handover":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "bending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "nothandover":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/admin/adminDasboard')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Company Resources Management</h1>
            </div>
            <button
              onClick={fetchCompanyResources}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search and filters */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID, resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource Details</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <React.Fragment key={employee.Eid}>
                        {employee.CompanyResources && employee.CompanyResources.length > 0 ? (
                          employee.CompanyResources.map((resource, index) => (
                            <tr key={`${employee.Eid}-${index}`} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <div className="text-sm font-medium text-gray-900">{employee.name || "N/A"}</div>
                                  <div className="text-sm text-gray-500">ID: {employee.Eid || "N/A"}</div>
                                  <div className="text-xs text-gray-400">
                                    Joined: {formatDate(employee.JOD)}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <div className="text-sm font-medium text-gray-900">{resource.Thingsname || "N/A"}</div>
                                  <div className="text-sm text-gray-500">#{resource.productnumber || "N/A"}</div>
                                  <div className="text-xs text-gray-400">
                                    End Date: {formatDate(employee.EOD)}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeColor(resource.givenStatus)}`}>
                                  {resource.givenStatus || "N/A"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(employee.Eid, resource)}
                                    className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(employee.Eid, resource.Thingsname)}
                                    className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{employee.name || "N/A"}</div>
                              <div className="text-sm text-gray-500">ID: {employee.Eid || "N/A"}</div>
                            </td>
                            <td colSpan="3" className="px-6 py-4 text-sm text-center text-gray-500">
                              No company resources found.
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm ? "No matching resources found." : "No employee data found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Edit Resource</h2>
            </div>
            <form onSubmit={(e) => handleSubmit(e, editData.Eid)} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
                  <div className="text-gray-800 font-medium">{editData.Thingsname}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (EOD)</label>
                  <input
                    type="date"
                    value={editData.EOD || ""}
                    onChange={(e) => setEditData({ ...editData, EOD: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editData.givenStatus || ""}
                    onChange={(e) => setEditData({ ...editData, givenStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="provided">Given</option>
                    <option value="handover">Handover</option>
                    <option value="bending">Bending</option>
                    <option value="nothandover">Not Handover</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditData(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Getresources;