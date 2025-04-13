"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

const Home = () => {
  const Eid = localStorage.getItem('idstore');
  const searchparams = useSearchParams();
  const EnquiryNo = searchparams.get('EnquiryNo');
  const token = localStorage.getItem('admintokens');
  const router = useRouter();

  const [formData, setFormData] = useState({
    products: [{ HSNCode: '', UnitDescription: '', Description: '', UOM: '', Quantity: '', UnitPrice: '', Total: '' }],
    Eid: Eid,
    EnquiryNo: EnquiryNo,
    Paymentdue: '',
    validity: '',
    Warranty: '',
    Delivery: '',
    Discount: '',
    Gst: 0,
    PayableAmount: 0,
  });

  const [customFields, setCustomFields] = useState({
    Paymentdue: false,
    Discount: false,
    Warranty: false,
    Delivery: false,
    validity: false,
  });

  const [popup, setPopup] = useState(false);

  useEffect(() => {
    if (EnquiryNo && Eid) {
      getdataresponse();
      getdataeditresponse();
    }
  }, [EnquiryNo, Eid]);

  const getdataresponse = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/api/quotationGetOne/${EnquiryNo}/${Eid}`, {
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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
    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
      PayableAmount: overallTotal.toFixed(2),
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

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setCustomFields((prev) => ({ ...prev, [field]: value === 'Others' }));
  };

  const handleCustomChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5005/api/Quatation', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Quotation submitted successfully!');
      setFormData({
        products: [{ HSNCode: '', UnitDescription: '', Description: '', UOM: '', Quantity: '', UnitPrice: '', Total: '' }],
        Eid: Eid,
        EnquiryNo: EnquiryNo,
        Paymentdue: '',
        validity: '',
        Warranty: '',
        Delivery: '',
        Discount: '',
        Gst: 0,
        PayableAmount: 0,
      });
    } catch (err) {
      console.error('Error submitting the quotation:', err);
      alert('Failed to submit quotation.');
    }
  };

  const handlePDFGenerate = () => {
    router.push(`/SaleteamDasboard/PDF?EnquiryNo=${EnquiryNo}&Eid=${Eid}`);
  };

  const handleEdit = () => {
    router.push(`/SaleteamDasboard/Getquotation?EnquiryNo=${EnquiryNo}&mode=edit`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Quotation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr>
              {['HSNCode', 'UnitDescription', 'Description', 'UOM', 'Quantity', 'UnitPrice', 'Total'].map((header) => (
                <th key={header} className="border border-gray-300 px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formData.products.map((product, index) => (
              <tr key={index}>
                {['HSNCode', 'UnitDescription', 'Description', 'UOM', 'Quantity', 'UnitPrice'].map((field) => (
                  <td key={field} className="border border-gray-300 px-4 py-2">
                    <input
                      name={field}
                      value={product[field]}
                      onChange={(e) => handleProductChange(e, index)}
                      type={['Quantity', 'UnitPrice'].includes(field) ? 'number' : 'text'}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-2">
                  <span>{product.Total}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={addProduct} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Product
        </button>

        <div>
          <label>Payment Due:</label>
          <select name="Paymentdue" value={formData.Paymentdue} onChange={(e) => handleSelectChange(e, 'Paymentdue')}>
            <option value="">Select</option>
            <option value="100% against proforma Invoice">100% against Proforma Invoice</option>
            <option value="100% against delivery">100% against Delivery</option>
            <option value="30 days PDC">30 Days PDC</option>
            <option value="50% advance & 50% against delivery">50% Advance & 50% Against Delivery</option>
            <option value="Others">Others</option>
          </select>
          {customFields.Paymentdue && (
            <input type="text" name="Paymentdue" value={formData.Paymentdue} onChange={(e) => handleCustomChange(e, 'Paymentdue')} />
          )}
        </div>
        <div>
          <label className="text-gray-700 font-medium mb-1">Validity</label>
          <select
            name="validity"
            value={formData.validity}
            onChange={(e) => handleSelectChange(e, 'validity')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select option</option>
            <option value="1 week from the date of quotation.">1 Week from the Date of Quotation</option>
            <option value="Others">Others</option>
          </select>
        </div>
        {customFields.validity && (
          <input
            type="text"
            name="validity"
            value={formData.validity}
            onChange={(e) => handleCustomChange(e, 'validity')}
            placeholder="Specify Validity"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}

        {/* Warranty */}
        <div>
          <label className="text-gray-700 font-medium mb-1">Warranty</label>
          <select
            name="Warranty"
            value={formData.Warranty}
            onChange={(e) => handleSelectChange(e, 'Warranty')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select option</option>
            <option value="1 Year from the date of supply">1 Year from the Date of Supply</option>
            <option value="6 months from the date of service">6 Months from the Date of Service</option>
            <option value="Others">Others</option>
          </select>
        </div>
        {customFields.Warranty && (
          <input
            type="text"
            name="Warranty"
            value={formData.Warranty}
            onChange={(e) => handleCustomChange(e, 'Warranty')}
            placeholder="Specify Warranty"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}

        {/* Delivery */}
        <div>
          <label className="text-gray-700 font-medium mb-1">Delivery</label>
          <select
            name="Delivery"
            value={formData.Delivery}
            onChange={(e) => handleSelectChange(e, 'Delivery')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select option</option>
            <option value="1 week from date of PO">1 Week from Date of PO</option>
            <option value="Week">Week</option>
            <option value="Day">Day</option>
            <option value="Others">Others</option>
          </select>
        </div>
        {customFields.Delivery && (
          <input
            type="text"
            name="Delivery"
            value={formData.Delivery}
            onChange={(e) => handleCustomChange(e, 'Delivery')}
            placeholder="Specify Delivery"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}

        {/* Discount */}
        <div>
          <label className="text-gray-700 font-medium mb-1">Discount</label>
          <select
            name="Discount"
            value={formData.Discount}
            onChange={(e) => handleSelectChange(e, 'Discount')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select option</option>
            <option value="Discounted Price">Discounted Price</option>
            <option value="Mentioned above">Mentioned Above</option>
            <option value="Others">Others</option>
          </select>
        </div>
        {customFields.Discount && (
          <input
            type="text"
            name="Discount"
            value={formData.Discount}
            onChange={(e) => handleCustomChange(e, 'Discount')}
            placeholder="Specify Discount"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
        <div>
  <label>GST</label>
  <input
    type="number"
    name="Gst"
    value={formData.Gst}
    onChange={(e) => setFormData((prev) => ({ ...prev, Gst: e.target.value }))}
    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>

         <div>
            <label className="text-gray-700 font-medium mb-1">Payable Amount</label>
            <input
              type="number"
              name="PayableAmount"
              value={formData.PayableAmount}
              readOnly
              className="px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Submit Quotation
        </button>
      </form>

      {popup && (
        <div className="bg-yellow-100 p-4 rounded-md shadow-md mt-4">
          <p className="text-gray-800 mb-2">Authorized Successfully Retrieved the Response.</p>
          <button onClick={handlePDFGenerate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2">
            Generate PDF
          </button>
          <button onClick={handleEdit} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
