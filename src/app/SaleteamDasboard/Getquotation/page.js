"use client"
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

const Getquotation = () => {
  const searchparams = useSearchParams();
  const mode = searchparams.get("mode") || "view"; // Default to "view" if mode is not provided
  const EnquiryNo = searchparams.get("EnquiryNo");
  const Eid = localStorage.getItem("idstore");
  const token = localStorage.getItem("admintokens");

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter(); // Initialize the router for navigation
  const formRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Set initial states for formData in case of failures
        let dataFromAPI1 = null;
        let dataFromAPI2 = null;

        // Fetch data from the first API (quotationGetOne)
        try {
          const response1 = await axios.get(
            `http://localhost:5005/api/quotationGetOne/${EnquiryNo}/${Eid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response1.data && response1.data.data) {
            console.log("Data from quotationGetOne API:", response1.data.data);
            dataFromAPI1 = response1.data.data; // Save the successful response from the first API
          } else {
            console.log("No data from quotationGetOne.");
          }
        } catch (error) {
          console.log("Error fetching data from quotationGetOne API:", error.message);
        }

        // Fetch data from the second API (quotationEditOne) only if the first one failed or didn't return data
        try {
          const response2 = await axios.get(
            `http://localhost:5005/api/quotationEditOne/${EnquiryNo}/${Eid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response2.data && response2.data.data) {
            console.log("Data from quotationEditOne API:", response2.data.data);
            dataFromAPI2 = response2.data.data; // Save the successful response from the second API
          } else {
            console.log("No data from quotationEditOne.");
          }
        } catch (error) {
          console.log("Error fetching data from quotationEditOne API:", error.message);
        }

        // Combine or choose the data from both APIs
        if (dataFromAPI1) {
          setFormData(dataFromAPI1);
        } else if (dataFromAPI2) {
          setFormData(dataFromAPI2);
        } else {
          setError("No data available from both APIs.");
        }
      } catch (error) {
        console.error("Error in fetching data:", error.message);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [EnquiryNo, Eid, token]);
  const handleChange = (e, index, field) => {
    const updatedProducts = [...formData.products]; // Clone the products array
    updatedProducts[index] = { // Update the specific product at index
      ...updatedProducts[index],
      [field]: e.target.value, // Update the field based on user input
    };
    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts, // Update the products array in state
    }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev); // Toggle edit mode for the entire form
    setErrorMessage(""); // Clear any previous error messages
  };

  const handleSave = async () => {
    const { EnquiryNo, ...updateFields } = formData; // Prepare fields for update

    if (!EnquiryNo || !formData.PayableAmount || !formData.Status) {
      setErrorMessage("Error: Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear any previous error message

    try {
      console.log("Data to save:", { EnquiryNo, ...updateFields });

      // Send data to the backend API for saving
      const response = await axios.put(
        "http://localhost:5005/api/editQuotation", // Correct API route for saving
        { EnquiryNo, ...updateFields }, // Pass EnquiryNo along with the update fields
        {
          headers: { Authorization: `Bearer ${token}` }, // Attach token to the request
        }
      );

      console.log("Update Response:", response.data); // Log the response to check if the update was successful

      if (response.status === 200) {
        router.push("/SaleteamDasboard/Dasboard");
      } else {
        setErrorMessage("Failed to update the quotation.");
      }
    } catch (error) {
      console.error("Error updating the quotation:", error.response ? error.response.data : error.message);
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
        {/* Table to display products */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">HSN Code</th>
                <th className="px-4 py-2 border">Unit Description</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Unit Price</th>
                <th className="px-4 py-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.products && formData.products.map((product, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="text"
                        value={product.HSNCode}
                        onChange={(e) => handleChange(e, index, "HSNCode")}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      product.HSNCode
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="text"
                        value={product.UnitDescription}
                        onChange={(e) => handleChange(e, index, "UnitDescription")}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      product.UnitDescription
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="text"
                        value={product.Description}
                        onChange={(e) => handleChange(e, index, "Description")}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      product.Description
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        value={product.Quantity}
                        onChange={(e) => handleChange(e, index, "Quantity")}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      product.Quantity
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        value={product.UnitPrice}
                        onChange={(e) => handleChange(e, index, "UnitPrice")}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      product.UnitPrice
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        value={product.Total}
                        onChange={(e) => handleChange(e, index, "Total")}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      product.Total
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Other input fields */}
        {["Paymentdue", "validity", "Warranty", "Delivery", "Discount", "PayableAmount", "Gst"].map((field) => (
          <div key={field}>
            <label className="text-gray-700">{field}</label>
            <input
              name={field}
              value={formData[field] || ""}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        ))}

        {/* Edit and Save buttons */}
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

        {/* Error message */}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Getquotation;
