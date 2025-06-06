"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const CustomerConversion = () => {
  const token = localStorage.getItem('admintokens');
  const Eid = localStorage.getItem('idstore');
  const searchParams = useSearchParams();
  
const EnquiryNo = searchParams.get('EnquiryNo')
console.log('Fetching EnquiryNo:', EnquiryNo);


  const [customer, setCustomer] = useState({
    EnquiryNo: EnquiryNo || '',
    PANnumber: '',
    GSTNnumber: '',
    CustomerDetails: {
      opportunitynumber: '',
    },
    BillingAddressDetails: {
      BillingAddress: 'No.27/1 VAIGAI COLONY 2ND IST, 12TH AVENUE,ASHOK NAGAR',
      BillingCountry: 'INDIA',
      BillingCity: 'CHENNAI',
      BillingPostalCode: '600083',
      BillingState: 'TAMILNADU'
    },
    DescriptionDetails: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fetchData, setFetchData] = useState(null);
  const [arrayData,setArrayData] = useState({});
  const [isEditing, setIsEditing] = useState(false);  
  const [update,setUpdate] = useState(null);
  const [ updateId,setUpdateId] =useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setCustomer(prevState => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value,
        }
      }));
    } else {
      setCustomer(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  const handleFilechange = (e) => {
    const { name, value } = e.target;
    console.log("Handling change for:", name, "with value:", value);
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFetchData(prevState => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value,
        }
      }));
    } else {
        setFetchData(prevState => {
            const updatedState = {
                ...prevState,
                [name]: value
            };
            console.log("Updated fetchData e:", updatedState);
            return updatedState;
        });
    }
};

const handlecustomerchange = (e)=>{
    const { name, value } = e.target;
    console.log("Handling change for:", name, "with value:", value);
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setArrayData(prevState => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value,
        }
      }));
    }else{
        setArrayData(prevState => {
        const updatedcState = {
            ...prevState,
            [name]: value
        }
    console.log("Updated cstate e:", updatedcState);
    return updatedcState;
})
}
}


  const fetchDataFromAPI = async (EnquiryNo) => {
    try {
      const response = await axios.get(`http://localhost:5005/api/cc/Enquiryget/${EnquiryNo}`, {
        headers: { 'Authorization': `Bearer ${token}`}
      });
      console.log("Fetched data:", response.data);
      setFetchData(response.data.customerData);
      setArrayData(response.data.customerData.customerconvert[0]);
      console.log('i get the customerconvert data',response.data.customerData.customerconvert[0]);
    } catch (err) {
      console.error("Error details: ", err.response || err.message);
      setError(`Error fetching data: ${err.response ? err.response.data : err.message}`);
    }
  };
  
  const updatedata = async (e) => {
    e.preventDefault();
  
    const updatedCustomer = {
      DescriptionDetails: arrayData.DescriptionDetails,
      clientName: arrayData.clientName,
      companyName: fetchData.companyName,
      Address: fetchData.Address,
      Country: fetchData.Country,
      MobileNumber:arrayData.CustomerDetails.MobileNumber,
      opportunitynumber:arrayData.CustomerDetails.opportunitynumber,
      PrimaryMail:arrayData.CustomerDetails.PrimaryMail,
      BillingAddress:arrayData.BillingAddressDetails.BillingAddress,
      BillingCountry:arrayData.BillingAddressDetails.BillingCountry,
      BillingCity:arrayData.BillingAddressDetails.BillingCity,
      BillingPostalCode:arrayData.BillingAddressDetails.BillingPostalCode,
      BillingState:arrayData.BillingAddressDetails.BillingState
    };
  
    try {
      const response = await axios.put(
        `http://localhost:5005/api/cc/getcustomerconverstion/${Eid}/${update}/${updateId}`,
        updatedCustomer,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
  
      console.log(response.data);
      alert("Customer data updated successfully!");
      router.push('/SaleteamDasboard/Dasboard');
    } catch (err) {
      console.error("Error updating data:", err);
      alert("Failed to update customer data. Please try again.");
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer.EnquiryNo || !customer.PANnumber || !customer.GSTNnumber ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!customer.CustomerDetails.opportunitynumber) {
      setError("Please provide all customer contact details.");
      return;
    }

    if (!customer.BillingAddressDetails.BillingAddress || !customer.BillingAddressDetails.BillingCountry || !customer.BillingAddressDetails.BillingCity || !customer.BillingAddressDetails.BillingPostalCode || !customer.BillingAddressDetails.BillingState) {
      setError("Please fill in the full billing address.");
      return;
    }

    setLoading(true);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:5005/api/customerconversion', { Eid, ...customer }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      setSuccess("Customer conversion successful!");
      console.log('Data after submission:', response.data);
      alert("Successfully updated");

      const EnquiryNo = customer.EnquiryNo;
      if(EnquiryNo){ 
        fetchDataFromAPI(EnquiryNo); 
      } else {
        setError("No enquiry data found.");
      }
    } catch (err) {
      setError("Failed to convert customer. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleclick = (EnquiryNo,CustomerId) =>{
    try{
      const enquiryno=EnquiryNo

      console.log("i get the table enquiryno",enquiryno);
      const customerid=CustomerId
      console.log("i get the customerid from the table",customerid);
      setUpdate(enquiryno);
      setUpdateId(customerid);
    }catch(err){
        console.log("i cannot get the enquiryno and customerid",err.message);
    }
  }

const handleBackClick = () => {
  router.push('/SaleteamDasboard/Dasboard')
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
    <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
      <button onClick={handleBackClick}
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
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Customer Conversion Form</h1>
      {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
    {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
      {!fetchData? (<form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700">LEAD NUMBER:</label>
          <input
            type="text"
            name="EnquiryNo"
            value={customer.EnquiryNo}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"readOnly
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700">PAN Number:</label>
          <input
            type="text"
            name="PANnumber"
            value={customer.PANnumber}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700">Opportunity Number:</label>
          <input
            type="text"
            name="CustomerDetails.opportunitynumber"
            value={customer.CustomerDetails.opportunitynumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700">GSTN Number:</label>
          <input
            type="text"
            name="GSTNnumber"
            value={customer.GSTNnumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700">Billing Address:</label>
          <input
            type="text"
            name="BillingAddressDetails.BillingAddress"
            value={customer.BillingAddressDetails.BillingAddress}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700">Billing Country:</label>
          <input
            type="text"
            name="BillingAddressDetails.BillingCountry"
            value={customer.BillingAddressDetails.BillingCountry}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700">Billing City:</label>
          <input
            type="text"
            name="BillingAddressDetails.BillingCity"
            value={customer.BillingAddressDetails.BillingCity}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700">Billing Postal Code:</label>
          <input
            type="text"
            name="BillingAddressDetails.BillingPostalCode"
            value={customer.BillingAddressDetails.BillingPostalCode}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700">Billing State:</label>
          <input
            type="text"
            name="BillingAddressDetails.BillingState"
            value={customer.BillingAddressDetails.BillingState}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700">Description:</label>
          <input
            type="text"
            name="DescriptionDetails"
            value={customer.DescriptionDetails}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        
       
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>): (
      <div>
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Customer Details</h2>
        <form onSubmit={updatedata} className="space-y-6">
          
           
              
                <label className="block text-lg font-medium text-gray-700">EnquiryNo</label>
                <input
                    type="text"
                    name="EnquiryNo"
                    value={arrayData.EnquiryNo}
                    onChange={handleFilechange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">CustomerId</label>
                <input
                    type="text"
                    name="CustomerId"
                    value={fetchData.CustomerId}
                    onChange={handleFilechange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Company Name</label>
                <input
                    type="text"
                    name="companyName"
                    value={fetchData.companyName}
                    onChange={handleFilechange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Customer Address</label>
                <input
                    type="text"
                    name="AddressDetails.Address"
                    value={fetchData.AddressDetails.Address}
                    onChange={handleFilechange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Customer Country</label>
                <input
                    type="text"
                    name="AddressDetails.Country"
                    value={fetchData.AddressDetails.Country}
                    onChange={handleFilechange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Client Name</label>
                <input
                    type="text"
                    name="clientName"
                    value={arrayData.clientName}
                    onChange={handlecustomerchange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Description Details</label>
                <input
                    type="text"
                    name="DescriptionDetails"
                    value={arrayData.DescriptionDetails}
                    onChange={handlecustomerchange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Mobile Number</label>
                <input
                    type="text"
                    name="CustomerDetails.MobileNumber"
                    value={arrayData.CustomerDetails.MobileNumber}
                    onChange={handlecustomerchange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Opportunity Number</label>
                <input
                    type="text"
                    name="CustomerDetails.opportunitynumber"
                    value={arrayData.CustomerDetails.opportunitynumber}
                    onChange={handlecustomerchange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Primary Mail</label>
                <input
                    type="text"
                    name="CustomerDetails.PrimaryMail"
                    value={arrayData.CustomerDetails.PrimaryMail}
                    onChange={handlecustomerchange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Billing Address</label>
                <input
                    type="text"
                    name="BillingAddressDetails.BillingAddress"
                    value={arrayData.BillingAddressDetails.BillingAddress}
                    onChange={handlecustomerchange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Billing Country</label>
                <input
                    type="text"
                    name="BillingAddressDetails.BillingCountry"
                    value={arrayData.BillingAddressDetails.BillingCountry}
                    onChange={handlecustomerchange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Billing City</label>
                <input
                    type="text"
                    name="BillingAddressDetails.BillingCity"
                    value={arrayData.BillingAddressDetails.BillingCity}
                    onChange={handlecustomerchange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Billing State</label>
                <input
                    type="text"
                    name="BillingAddressDetails.BillingState"
                    value={arrayData.BillingAddressDetails.BillingState}
                    onChange={handlecustomerchange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                <label className="block text-lg font-medium text-gray-700">Billing Postal Code</label>
                <input
                    type="text"
                    name="BillingAddressDetails.BillingPostalCode"
                    value={arrayData.BillingAddressDetails.BillingPostalCode}
                    onChange={handlecustomerchange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
              
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              onClick={() => handleclick(arrayData.EnquiryNo, fetchData.CustomerId)}
              className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!isEditing}
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="py-3 px-6 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </button>
          </div>
        </form>
      </div>
      )}
    </div>
  
    
    

   
  </div>

  );
};

export default CustomerConversion;