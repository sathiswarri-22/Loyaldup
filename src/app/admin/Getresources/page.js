"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Getresources = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const token = localStorage.getItem("admintokens");

  useEffect(() => {
    const fetchCompanyResources = async () => {
      if (!token) {
        console.error("No token found. Please log in.");
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5005/api/getCompanyresource",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
      }
    };

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    try {
      await axios.delete(
        `http://localhost:5005/api/deleteCompanyresource/${Eid}/${Thingsname}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

      alert("Resource deleted successfully.");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete resource. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Employee Details</h1>

        {error && (
          <p className="text-red-500 bg-red-100 border border-red-400 p-2 rounded mb-4">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Eid</th>
                <th className="px-4 py-2 border">Joining Date</th>
                <th className="px-4 py-2 border">End Date (EOD)</th>
                <th className="px-4 py-2 border">Things Name</th>
                <th className="px-4 py-2 border">Product Number</th>
                <th className="px-4 py-2 border">Given Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <React.Fragment key={employee.Eid}>
                    {employee.CompanyResources &&
                    employee.CompanyResources.length > 0 ? (
                      employee.CompanyResources.map((resource, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition duration-200"
                        >
                          <td className="px-4 py-2 border">{employee.name || "N/A"}</td>
                          <td className="px-4 py-2 border">{employee.Eid || "N/A"}</td>
                          <td className="px-4 py-2 border">{formatDate(employee.JOD)}</td>
                          <td className="px-4 py-2 border">{formatDate(employee.EOD)}</td>
                          <td className="px-4 py-2 border">{resource.Thingsname || "N/A"}</td>
                          <td className="px-4 py-2 border">{resource.productnumber || "N/A"}</td>
                          <td className="px-4 py-2 border">{resource.givenStatus || "N/A"}</td>
                          <td className="px-4 py-2 border">
                            <button
                              onClick={() => handleEdit(employee.Eid, resource)}
                              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(employee.Eid, resource.Thingsname)}
                              className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-2 border">{employee.name || "N/A"}</td>
                        <td className="px-4 py-2 border">{employee.Eid || "N/A"}</td>
                        <td colSpan="6" className="text-center text-gray-500 py-2">
                          No company resources found.
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No employee data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editData && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-md w-96">
              <h2 className="text-xl font-bold mb-4">Edit Resource</h2>
              <form
                onSubmit={(e) => handleSubmit(e, editData.Eid)}
                className="space-y-4"
              >
                <label>
                  End Date (EOD):
                  <input
                    type="date"
                    value={editData.EOD || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, EOD: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </label>
                <label>
                  Given Status:
                  <select
                    value={editData.givenStatus || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, givenStatus: e.target.value })
                    }
                    className="px-4 py-3 border rounded-lg"
                  >
                    <option value="">Status</option>
                    <option value="provided">Given</option>
                    <option value="handover">Handover</option>
                    <option value="bending">Bending</option>
                    <option value="nothandover">Not Handover</option>
                  </select>
                </label>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditData(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Getresources;
