"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

const Getquotation = () => {
  const searchparams = useSearchParams();
  const mode = searchparams.get("mode") || "view";
  const EnquiryNo = searchparams.get("EnquiryNo");
  const Eid = localStorage.getItem("idstore");
  const token = localStorage.getItem("admintokens");

  const [formData, setFormData] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [revisionNumber, setRevisionNumber] = useState("");
  const router = useRouter();
  const formRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let dataFromAPI2 = null;  // First, assume no data from the Edit API
        let dataFromAPI1 = null;  // For fallback to the Get API if necessary
  
        // Try fetching data from the quotationEditOne API first
        try {
          const response2 = await axios.get(
            `http://localhost:5005/api/quotationEditOne/${EnquiryNo}/${Eid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response2.data?.data) {
            dataFromAPI2 = response2.data.data;  // If data exists, use this
          }
        } catch (error) {
          console.log("Error fetching from quotationEditOne:", error.message);
        }
  
        // If no data from the Edit API, fallback to fetching from the quotationGetOne API
        if (!dataFromAPI2) {
          try {
            const response1 = await axios.get(
              `http://localhost:5005/api/quotationGetOne/${EnquiryNo}/${Eid}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response1.data?.data) {
              dataFromAPI1 = response1.data.data;  // Use data from the Get API if available
            }
          } catch (error) {
            console.log("Error fetching from quotationGetOne:", error.message);
          }
        }
  
        // Combine data or fallback if none is found
        const loadedData = dataFromAPI2 || dataFromAPI1;
        if (loadedData) {
          setFormData({
            ...loadedData,
            products: loadedData.products || [],
          });
        } else {
          setError("No data available from both APIs.");
        }
      } catch (error) {
        console.error("Fetching error:", error.message);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [EnquiryNo, Eid, token]);
  

  

  const handleChange = (e, index, field) => {
    const updatedProducts = [...formData.products];
    const value = e.target.value;

    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };

    // Auto-calculate Total
    const quantity = parseFloat(
      field === "Quantity" ? value : updatedProducts[index].Quantity
    );
    const unitPrice = parseFloat(
      field === "UnitPrice" ? value : updatedProducts[index].UnitPrice
    );
    if (!isNaN(quantity) && !isNaN(unitPrice)) {
      updatedProducts[index].Total = (quantity * unitPrice).toFixed(2);
    }

    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));
  };

  const handleAddProduct = () => {
    const newProduct = {
      HSNCode: "",
      UnitDescription: "",
      Description: "",
      Quantity: "",
      UnitPrice: "",
      UOM: "",
      Total: "",
    };

    setFormData((prevData) => ({
      ...prevData,
      products: [...(prevData.products || []), newProduct],
    }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setErrorMessage("");
  };

  const handleSave = async () => {
    const { EnquiryNo, ...updateFields } = formData;

    if (!EnquiryNo || !formData.PayableAmount || !formData.Status) {
      setErrorMessage("Error: Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const dataToSave = {
        EnquiryNo,
        ...updateFields,
      };

      if (revisionNumber.trim()) {
        dataToSave.revisedVersion = revisionNumber.trim();
      }

      const response = await axios.put(
        "http://localhost:5005/api/editQuotation",
        dataToSave,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        router.push("/SaleteamDasboard/Dasboard");
      } else {
        setErrorMessage("Failed to update the quotation.");
      }
    } catch (error) {
      console.error("Update error:", error.message);
      setErrorMessage("Failed to update the quotation.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Quotation Details</h1>
      <form ref={formRef} className="space-y-4">
        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">HSN Code</th>
                <th className="px-4 py-2 border">Unit Description</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Unit Price</th>
                <th className="px-4 py-2 border">UOM</th>
                <th className="px-4 py-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.products.map((product, index) => (
                <tr key={index}>
                  {["HSNCode", "UnitDescription", "Description", "Quantity", "UnitPrice", "UOM", "Total"].map(
                    (field) => (
                      <td key={field} className="px-4 py-2 border">
                        {isEditing && field !== "Total" ? (
                          <input
                            type={["Quantity", "UnitPrice"].includes(field) ? "number" : "text"}
                            value={product[field] || ""}
                            onChange={(e) => handleChange(e, index, field)}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          product[field]
                        )}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Product */}
        {isEditing && (
          <button
            type="button"
            onClick={handleAddProduct}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Add Product
          </button>
        )}

        {/* Other fields */}
        {["Paymentdue", "validity", "Warranty", "Delivery", "Discount", "PayableAmount", "Gst", "Status"].map(
          (field) => (
            <div key={field}>
              <label className="text-gray-700">{field}</label>
              <input
                name={field}
                value={formData[field] || ""}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={!isEditing}
              />
            </div>
          )
        )}

        {/* Revision Number */}
        {isEditing && (
          <div>
            <label className="text-gray-700">Revision Number (e.g. R1, R2)</label>
            <input
              name="revisionNumber"
              value={revisionNumber}
              onChange={(e) => setRevisionNumber(e.target.value)}
              placeholder="Enter revision (e.g., R1)"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Current Reference: {formData.ReferenceNumber || "None"}
            </p>
          </div>
        )}

        {/* Buttons */}
        {mode !== "pdf" && (
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleEditToggle}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              {isEditing ? "Cancel Edit" : "Edit"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            )}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Getquotation;
