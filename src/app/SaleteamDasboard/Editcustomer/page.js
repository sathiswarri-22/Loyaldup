"use client";

import { useEffect, useState } from "react";
import { useSearchParams,useRouter } from "next/navigation";
import axios from "axios";

export default function EnquiryPage() {
  const searchParams = useSearchParams();
  const EnquiryNo = searchParams.get("EnquiryNo");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    if (!EnquiryNo) return;

    const token = localStorage.getItem("admintokens");
    axios
      .get(`http://localhost:5005/api/cc/Enquiryget/${EnquiryNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFormData(res.data.customerData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching:", err);
        setLoading(false);
      });
  }, [EnquiryNo]);

  const handleTopLevelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomerConvertChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      customerconvert: [
        {
          ...prev.customerconvert[0],
          [name]: value,
        },
      ],
    }));
  };

  const handleCustomerDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      customerconvert: [
        {
          ...prev.customerconvert[0],
          CustomerDetails: {
            ...prev.customerconvert[0]?.CustomerDetails,
            [name]: value,
          },
        },
      ],
    }));
  };

  const handleBillingAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      customerconvert: [
        {
          ...prev.customerconvert[0],
          BillingAddressDetails: {
            ...prev.customerconvert[0]?.BillingAddressDetails,
            [name]: value,
          },
        },
      ],
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      AddressDetails: {
        ...prev.AddressDetails,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = formData.customerconvert[0];
    const Eid = data.Eid;
    const CustomerId = formData.CustomerId;

    try {
      const token = localStorage.getItem("admintokens");
      await axios.put(
        `http://localhost:5005/api/cc/getcustomerconverstion/${Eid}/${data.EnquiryNo}/${CustomerId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Successfully updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!formData) return <div>No data found</div>;

  const customer = formData.customerconvert?.[0] || {};
  const customerDetails = customer.CustomerDetails || {};
  const billing = customer.BillingAddressDetails || {};
  const address = formData.AddressDetails || {};

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto mt-10">
       <button
        onClick={() => router.push('/SaleteamDasboard/CustomerConverted')}
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
      <h1 className="text-2xl font-bold mb-4 text-green-600">
        Edit Enquiry: {customer.EnquiryNo}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Top-level fields */}
        <div>
          <label>Customer ID:</label>
          <input type="text" value={formData.CustomerId} disabled className="border p-2 w-full" />
        </div>
        <div>
          <label>PAN Number:</label>
          <input type="text" name="PANnumber" value={formData.PANnumber || ""} onChange={handleTopLevelChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>GSTN Number:</label>
          <input type="text" name="GSTNnumber" value={formData.GSTNnumber || ""} onChange={handleTopLevelChange} className="border p-2 w-full" />
        </div>
        <div>
          <label>Company Name:</label>
          <input type="text" name="companyName" value={formData.companyName || ""} onChange={handleTopLevelChange} className="border p-2 w-full" />
        </div>

        {/* AddressDetails */}
        <h3 className="text-lg font-semibold">Address Details</h3>
        <input type="text" name="Address" placeholder="Address" value={address.Address || ""} onChange={handleAddressChange} className="border p-2 w-full" />
        <input type="text" name="City" placeholder="City" value={address.City || ""} onChange={handleAddressChange} className="border p-2 w-full" />
        <input type="text" name="Country" placeholder="Country" value={address.Country || ""} onChange={handleAddressChange} className="border p-2 w-full" />
        <input type="text" name="PostalCode" placeholder="Postal Code" value={address.PostalCode || ""} onChange={handleAddressChange} className="border p-2 w-full" />
        <input type="text" name="State" placeholder="State" value={address.State || ""} onChange={handleAddressChange} className="border p-2 w-full" />

        {/* Customer Convert */}
        <h3 className="text-lg font-semibold mt-4">Customer Convert Info</h3>
        <input type="text" name="clientName" placeholder="Client Name" value={customer.clientName || ""} onChange={handleCustomerConvertChange} className="border p-2 w-full" />
        <input type="text" name="DescriptionDetails" placeholder="Description" value={customer.DescriptionDetails || ""} onChange={handleCustomerConvertChange} className="border p-2 w-full" />
        <input type="text" name="Convertedstatus" placeholder="Converted Status" value={customer.Convertedstatus || ""} onChange={handleCustomerConvertChange} className="border p-2 w-full" />
        <input type="text" name="Status" placeholder="Status" value={customer.Status || ""} onChange={handleCustomerConvertChange} className="border p-2 w-full" />

        {/* Customer Details */}
        <h3 className="text-lg font-semibold mt-4">Customer Contact Details</h3>
        <input type="text" name="MobileNumber" placeholder="Mobile Number" value={customerDetails.MobileNumber || ""} onChange={handleCustomerDetailsChange} className="border p-2 w-full" />
        <input type="text" name="PrimaryMail" placeholder="Email" value={customerDetails.PrimaryMail || ""} onChange={handleCustomerDetailsChange} className="border p-2 w-full" />
        <input type="text" name="opportunitynumber" placeholder="Opportunity No" value={customerDetails.opportunitynumber || ""} onChange={handleCustomerDetailsChange} className="border p-2 w-full" />

        {/* Billing Details */}
        <h3 className="text-lg font-semibold mt-4">Billing Address Details</h3>
        <input type="text" name="BillingAddress" placeholder="Billing Address" value={billing.BillingAddress || ""} onChange={handleBillingAddressChange} className="border p-2 w-full" />
        <input type="text" name="BillingCity" placeholder="Billing City" value={billing.BillingCity || ""} onChange={handleBillingAddressChange} className="border p-2 w-full" />
        <input type="text" name="BillingCountry" placeholder="Billing Country" value={billing.BillingCountry || ""} onChange={handleBillingAddressChange} className="border p-2 w-full" />
        <input type="text" name="BillingPostalCode" placeholder="Billing Postal Code" value={billing.BillingPostalCode || ""} onChange={handleBillingAddressChange} className="border p-2 w-full" />
        <input type="text" name="BillingState" placeholder="Billing State" value={billing.BillingState || ""} onChange={handleBillingAddressChange} className="border p-2 w-full" />

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Update
        </button>
      </form>
    </div>
  );
}
