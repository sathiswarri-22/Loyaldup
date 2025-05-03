"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ChevronLeft, Plus, FileText, Edit, X, Calculator, Archive } from "lucide-react";

const Home = () => {
  const Eid = localStorage.getItem('idstore');
  const token = localStorage.getItem('admintokens');

  const searchparams = useSearchParams();
  const EnquiryNo = searchparams.get('EnquiryNo');
  const isRevise = searchparams.get('revise') === 'true';
  const referenceToRevise = searchparams.get('ref');

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    products: [{ HSNCode: '', UnitDescription: '', Description: '', UOM: '', Quantity: '', UnitPrice: '', Total: '' }],
    Eid: Eid,
    LP:'',
    UpdatedEid: Eid,
    discount:'',
    EnquiryNo: EnquiryNo,
    Paymentdue: '',
    validity: '',
    Warranty: '',
    Delivery: '',
    Discount: '',
    Gst: 0,
    PayableAmount: 0,
    financialYear: '',
    isRevision: isRevise || false,
    referenceToRevise: referenceToRevise || '',
    Status: 'quotsreq'
  });

  const [customFields, setCustomFields] = useState({
    Paymentdue: false,
    Discount: false,
    Warranty: false,
    Delivery: false,
    validity: false,
  });

  const [popup, setPopup] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  useEffect(() => {
    if (EnquiryNo && Eid) {
      getdataresponse();
      getdataeditresponse();
    }
  }, [EnquiryNo, Eid]);
  
  const getdataresponse = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/api/quotationGetOne/${EnquiryNo}/${Eid}`, {
        headers: { Authorization: `Bearer ${token}`},
      });
      if (response.data.data?.Status === 'quotsaccess') {
        setPopup(true);
      }
    } catch (err) {
      console.error('Error getting the quotation:', err);
    }
  };

  const getdataeditresponse = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/api/quotationEditOne/${EnquiryNo}/${Eid}`, {
        headers: { Authorization: `Bearer ${token}`},
      });
      if (response.data.data?.Status === 'Editaccess') {
        setPopup(true);
      }
    } catch (err) {
      console.error('Error getting the quotation:', err);
    }
  };

  const calculateTotals = (products) => {
    let overallTotal = 0;
    const updatedProducts = products.map((product) => {
      const quantity = Number(product.Quantity) || 0;
      const unitPrice = Number(product.UnitPrice) || 0;
      const total = quantity * unitPrice;
      overallTotal += total;
      return { ...product, Total: total.toFixed(2) };
    });
    
    // Calculate the final amount including GST if provided
    let finalAmount = overallTotal;
    if (formData.Gst && formData.Gst > 0) {
      const gstAmount = overallTotal * (Number(formData.Gst) / 100);
      finalAmount += gstAmount;
    }
    
    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
      PayableAmount: finalAmount.toFixed(2),
    }));
  };

  const handleProductChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };
    setFormData((prev) => ({ ...prev, products: updatedProducts }));
    calculateTotals(updatedProducts);
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { HSNCode: '', UnitDescription: '', Description: '', UOM: '', Quantity: '', UnitPrice: '', Total: '' }],
    }));
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = formData.products.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, products: updatedProducts }));
      calculateTotals(updatedProducts);
    }
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setCustomFields((prev) => ({ ...prev, [field]: value === 'Others' }));
  };

  const handleCustomChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleGstChange = (e) => {
    const gstValue = e.target.value;
    setFormData((prev) => ({ ...prev, Gst: gstValue }));
    // Recalculate totals to include the new GST value
    calculateTotals(formData.products);
  };

  const validateForm = () => {
    if (!formData.financialYear) {
      setError("Financial year is required");
      return false;
    }
    
    if (formData.products.length === 0) {
      setError("At least one product is required");
      return false;
    }
    
    // Check if any product has missing required fields
    const invalidProducts = formData.products.filter(p => 
      !p.HSNCode || !p.UnitDescription || !p.Description || !p.UOM || !p.UnitPrice
    );
    
    if (invalidProducts.length > 0) {
      setError("All product fields (HSN Code, Unit Description, Description, UOM, Unit Price) are required");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5005/api/Quatation', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setLoading(false);
      setReferenceNumber(response.data.referenceNumber);
      alert('Quotation submitted successfully!');

      // Reset form after successful submission
      setFormData({
        products: [{ HSNCode: '', UnitDescription: '', Description: '', UOM: '', Quantity: '', UnitPrice: '', Total: '' }],
        Eid: Eid,
        UpdatedEid: Eid,
        EnquiryNo: EnquiryNo,
        Paymentdue: '',
        validity: '',
        Warranty: '',
        Delivery: '',
        Discount: '',
        Gst: 0,
        PayableAmount: 0,
        financialYear: '',
        isRevision: false,
        referenceToRevise: '',
        LP:'',
        discount:'',
        Status: 'quotsreq'
      });
      setCustomFields({
        Paymentdue: false,
        Discount: false,
        Warranty: false,
        Delivery: false,
        validity: false,
      });

    } catch (err) {
      setLoading(false);
      console.error('Error submitting the quotation:', err);
      setError(err.response?.data?.message || "Failed to submit quotation. Please try again.");
    }
  };

  const handlePDFGenerate = () => {
    router.push(`/SaleteamDasboard/PDF?EnquiryNo=${EnquiryNo}&Eid=${Eid}`);
  };

  const handleEdit = () => {
    router.push(`/SaleteamDasboard/Getquotation?EnquiryNo=${EnquiryNo}&mode=edit`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-xl my-8">
      <div className="flex items-center justify-between mb-10 border-b pb-4">
        <button
          onClick={() => router.push('/SaleteamDasboard/Dasboard')}
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
        <h1 className="text-3xl font-bold text-gray-800">Create Quotation</h1>
        <div className="w-10" />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X size={20} className="text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {formData.isRevision && (
        <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-800 rounded-md">
          <div className="flex">
            <Archive className="flex-shrink-0 h-5 w-5 text-amber-500" />
            <div className="ml-3">
              <p className="text-sm font-medium">Revision Mode: Revising quotation <span className="font-mono bg-amber-100 px-2 py-1 rounded">{formData.referenceToRevise}</span></p>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="financialYear"
            value={formData.financialYear}
            onChange={(e) => setFormData((prev) => ({ ...prev, financialYear: e.target.value }))}
            placeholder="e.g. 25-26"
            className="w-full md:w-1/3 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            required
          />
        </div>

        {/* Product Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={18} />
              <span>Add Product</span>
            </button>
          </div>
          
          {formData.products.map((product, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Product #{index + 1}</h3>
                {formData.products.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeProduct(index)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={16} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">HSN Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="HSNCode"
                    value={product.HSNCode}
                    onChange={(e) => handleProductChange(e, index)}
                    placeholder="HSN Code"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Unit Description <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="UnitDescription"
                    value={product.UnitDescription}
                    onChange={(e) => handleProductChange(e, index)}
                    placeholder="Unit Description"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="Description"
                    value={product.Description}
                    onChange={(e) => handleProductChange(e, index)}
                    placeholder="Description"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">UOM <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="UOM"
                    value={product.UOM}
                    onChange={(e) => handleProductChange(e, index)}
                    placeholder="UOM"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="Quantity"
                    value={product.Quantity}
                    onChange={(e) => handleProductChange(e, index)}
                    placeholder="Quantity"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Unit Price <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      name="UnitPrice"
                      value={product.UnitPrice}
                      onChange={(e) => handleProductChange(e, index)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Total</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="text"
                      name="Total"
                      value={product.Total}
                      readOnly
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 font-medium text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Details */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Additional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Due</label>
              <select
                name="Paymentdue"
                value={formData.Paymentdue}
                onChange={(e) => handleSelectChange(e, 'Paymentdue')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                style={{backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"gray\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center"}}
              >
                <option value="">Select Payment Due</option>
                <option value="30">30 Days</option>
                <option value="60">60 Days</option>
                <option value="Others">Others</option>
              </select>
              {customFields.Paymentdue && (
                <input
                  type="text"
                  value={formData.Paymentdue}
                  onChange={(e) => handleCustomChange(e, 'Paymentdue')}
                  placeholder="Specify Custom Payment Due"
                  className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Validity</label>
              <select
                name="validity"
                value={formData.validity}
                onChange={(e) => handleSelectChange(e, 'validity')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                style={{backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"gray\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center"}}
              >
                <option value="">Select Validity Period</option>
                <option value="1 week from the date of quotation.">1 Week from the Date of Quotation</option>
                <option value="Others">Others</option>
              </select>
              {customFields.validity && (
                <input
                  type="text"
                  name="validity"
                  value={formData.validity}
                  onChange={(e) => handleCustomChange(e, 'validity')}
                  placeholder="Specify validity period"
                  className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
              <select
                name="Warranty"
                value={formData.Warranty}
                onChange={(e) => handleSelectChange(e, 'Warranty')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                style={{backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"gray\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center"}}
              >
                <option value="">Select Warranty Period</option>
                <option value="1 Year from the date of supply">1 Year from the Date of Supply</option>
                <option value="6 months from the date of service">6 Months from the Date of Service</option>
                <option value="Others">Others</option>
              </select>
              {customFields.Warranty && (
                <input
                  type="text"
                  name="Warranty"
                  value={formData.Warranty}
                  onChange={(e) => handleCustomChange(e, 'Warranty')}
                  placeholder="Specify warranty terms"
                  className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery</label>
              <select
                name="Delivery"
                value={formData.Delivery}
                onChange={(e) => handleSelectChange(e, 'Delivery')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                style={{backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"gray\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center"}}
              >
                <option value="">Select Delivery Timeline</option>
                <option value="1 week from date of PO">1 Week from Date of PO</option>
                <option value="Week">Week</option>
                <option value="Day">Day</option>
                <option value="Others">Others</option>
              </select>
              {customFields.Delivery && (
                <input
                  type="text"
                  name="Delivery"
                  value={formData.Delivery}
                  onChange={(e) => handleCustomChange(e, 'Delivery')}
                  placeholder="Specify delivery timeline"
                  className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
              <select
                name="Discount"
                value={formData.Discount}
                onChange={(e) => handleSelectChange(e, 'Discount')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                style={{backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"gray\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center"}}
              >
                <option value="">Select Discount Type</option>
                <option value="Discounted Price">Discounted Price</option>
                <option value="Mentioned above">Mentioned Above</option>
                <option value="Others">Others</option>
              </select>
              {customFields.Discount && (
                <input
                  type="text"
                  name="Discount"
                  value={formData.Discount}
                  onChange={(e) => handleCustomChange(e, 'Discount')}
                  placeholder="Specify discount details"
                  className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GST (%)</label>
              <div className="relative">
                <input
                  type="number"
                  name="Gst"
                  value={formData.Gst}
                  onChange={handleGstChange}
                  placeholder="Enter GST percentage"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payable Amount */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-end items-end gap-4">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Calculator size={20} className="text-blue-600" />
                <span className="text-gray-700 font-medium">GST Amount:</span>
                <span className="text-blue-700 font-semibold">
                  ₹{(Number(formData.PayableAmount) - (Number(formData.PayableAmount) / (1 + Number(formData.Gst) / 100))).toFixed(2)}
                </span>
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">LP</label>
  <input
    type="text"
    name="LP"
    value={formData.LP}
    onChange={(e) => setFormData((prev) => ({ ...prev, LP: e.target.value }))}
    placeholder="Enter LP value"
    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
  <input
    type="text"
    name="discount"
    value={formData.discount}
    onChange={(e) => setFormData((prev) => ({ ...prev, discount: e.target.value }))}
    placeholder="Enter discount"
    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500 mb-1">Total Payable Amount</span>
                <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md">
                  <span className="text-xl font-bold">₹{Number(formData.PayableAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 text-lg font-medium shadow-md transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
          >
            {loading ? 'Submitting...' : 'Submit Quotation'}
          </button>
        </div>
        
        {/* Reference Number */}
        {referenceNumber && (
          <div className="mt-6 p-5 bg-green-50 border border-green-100 text-green-800 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Success! Your quotation has been submitted.</h3>
                <p className="mt-1 text-lg font-semibold">Reference Number: <span className="font-mono bg-green-100 px-2 py-1 rounded">{referenceNumber}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Popup for existing quotation */}
        {popup && (
          <div className="mt-8 bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg></div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-800">Quotation Already Exists</h3>
                <p className="text-gray-600">This enquiry already has a quotation. What would you like to do?</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={handlePDFGenerate}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <FileText size={18} />
                <span>Generate PDF</span>
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
              >
                <Edit size={18} />
                <span>Edit Quotation</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Home;