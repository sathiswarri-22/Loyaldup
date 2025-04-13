"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useRouter } from 'next/navigation';
import PDFPage from './pdf';

const App = () => {
  const [rows, setRows] = useState([{
    sno: '',
    hsnCode: '',
    unitDescription: '',
    uom: '',
    quantity: '',
    unitPrice: '',
    gst: '', // Initially set to empty
    total: 0,
  }]);
  const [goodsReturn, setGoodsReturn] = useState('Yes');
  const [interestRate, setInterestRate] = useState('24%');
  const [jurisdiction, setJurisdiction] = useState('Chennai');
  const [certification, setCertification] = useState('True');
  const [loading, setLoading] = useState(false); 
  const [freight, setFreight] = useState(''); // Initially set to empty
  const [gst, setGst] = useState(''); // Initially set to empty
  const [pdfPage, setPdfPage] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('admintokens'));
  const router = useRouter(); 

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleTermsChange = (e, field) => {
    switch (field) {
      case 'goodsReturn':
        setGoodsReturn(e.target.value);
        break;
      case 'interestRate':
        setInterestRate(e.target.value);
        break;
      case 'jurisdiction':
        setJurisdiction(e.target.value);
        break;
      case 'certification':
        setCertification(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleRowChange = (index, e, field) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = e.target.value;

    // Recalculate the total for the row whenever any input changes
    if (field === 'quantity' || field === 'unitPrice' || field === 'gst') {
      const quantity = parseFloat(updatedRows[index].quantity) || 0;
      const unitPrice = parseFloat(updatedRows[index].unitPrice) || 0;
      const gst = parseFloat(updatedRows[index].gst) || 0;
      const total = (quantity * unitPrice); // GST is calculated separately
      updatedRows[index].total = total.toFixed(2);
    }

    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { sno: '', hsnCode: '', unitDescription: '', uom: '', quantity: '', unitPrice: '', gst: '', total: 0 }]);
  };

  const calculateSubtotal = () => {
    return rows.reduce((acc, row) => acc + parseFloat(row.total || 0), 0);
  };

  const calculateTotalGST = () => {
    // Sum up the GST from each row
    return rows.reduce((acc, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const unitPrice = parseFloat(row.unitPrice) || 0;
      const gst = parseFloat(row.gst) || 0;
      const gstAmount = (quantity * unitPrice * gst) / 100;
      return acc + gstAmount;
    }, 0).toFixed(2);
  };

  const calculateTotalPayable = () => {
    const subtotal = calculateSubtotal();
    const totalGST = calculateTotalGST();
    return (subtotal + parseFloat(freight || 0) + parseFloat(totalGST || 0)).toFixed(2); // Round to 2 decimal places
  };

  const calculateRoundOff = () => {
    const totalPayable = calculateTotalPayable();
    return (Math.round(totalPayable) - totalPayable).toFixed(2); // Round to nearest integer and find round off
  };

  const isFormFilled = goodsReturn && interestRate && jurisdiction && certification && rows.every(row => row.hsnCode && row.unitDescription && row.uom && row.quantity && row.unitPrice);

  const createInvoice = async () => {
    const goodsReturnBool = goodsReturn === 'Yes';
    const interestRateNum = parseFloat(interestRate.replace('%', ''));

    const orderData = {
      goodsReturn: goodsReturnBool,
      interestRate: interestRateNum,
      jurisdiction,
      certification,
      rows: rows.map(row => ({
        ...row,
        itemName: row.unitDescription,
      })),
      freight,
      gst: calculateTotalGST(), // Add the total GST calculated from all rows
      subtotal: calculateSubtotal(),
      roundOff: calculateRoundOff(),
      totalPayable: calculateTotalPayable(),
    };

    try {
      const response = await axios.post('http://localhost:5005/api-purchaseorder/create-purchaseorder', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        alert("Purchase order created successfully!");
        setPdfPage(true); // Go to the PDF page
      }
    } catch (error) {
      console.error("Error creating purchase order", error);
      alert("Failed to create purchase order. Please try again.");
    }
  };

  const generatePDF = () => {
    setPdfPage(true);
  };

  return (
    <>
      {!pdfPage ? (
        <div className="form-container">
          <h2 className="text-xl">Perfoma Invoice</h2>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="overflow-x-auto shadow-lg rounded-lg">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="text-left bg-gray-100">
                    <th className="px-4 py-2 font-semibold text-sm text-gray-600">S. No</th>
                    <th className="px-4 py-2 font-semibold text-sm text-gray-600">HSN Code</th>
                    <th className="px-4 py-2 font-semibold text-sm text-gray-600">Unit Description</th>
                    <th className="px-4 py-2 font-semibold text-sm text-gray-600">UOM</th>
                    <th className="px-4 py-2 font-semibold text-sm text-gray-600">Quantity</th>
                    <th className="px-4 py-2 font-semibold text-sm text-gray-600">Unit Price</th>
                    <th className="px-4 py-2 font-semibold text-sm text-gray-600">GST (%)</th>
                    <th className="px-4 py-2 font-semibold text-sm text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          placeholder="S. No"
                          value={row.sno}
                          onChange={(e) => handleRowChange(index, e, 'sno')}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          placeholder="HSN Code"
                          value={row.hsnCode}
                          onChange={(e) => handleRowChange(index, e, 'hsnCode')}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          placeholder="Unit Description"
                          value={row.unitDescription}
                          onChange={(e) => handleRowChange(index, e, 'unitDescription')}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          placeholder="UOM"
                          value={row.uom}
                          onChange={(e) => handleRowChange(index, e, 'uom')}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={row.quantity}
                          onChange={(e) => handleRowChange(index, e, 'quantity')}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          placeholder="Unit Price"
                          value={row.unitPrice}
                          onChange={(e) => handleRowChange(index, e, 'unitPrice')}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          placeholder="GST (%)"
                          value={row.gst}
                          onChange={(e) => handleRowChange(index, e, 'gst')}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        {row.total ? `₹${row.total}` : '₹0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addRow}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Add Row
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div>
              <label className="block text-sm">Goods Return:</label>
              <select
                value={goodsReturn}
                onChange={(e) => handleTermsChange(e, 'goodsReturn')}
                className="w-full p-2 border rounded"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mt-4">Interest Rate (%):</label>
              <input
                type="text"
                value={interestRate}
                onChange={(e) => handleTermsChange(e, 'interestRate')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm mt-4">Jurisdiction:</label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => handleTermsChange(e, 'jurisdiction')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm mt-4">Certification:</label>
              <input
                type="text"
                value={certification}
                onChange={(e) => handleTermsChange(e, 'certification')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm mt-4">Freight:</label>
              <input
                type="number"
                value={freight}
                onChange={(e) => setFreight(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Total Payable</h3>
            <div>
              <p>Subtotal: ₹{calculateSubtotal().toFixed(2)}</p>
              <p>Freight: ₹{freight}</p>
              <p>GST: ₹{calculateTotalGST()}</p>
              <p>Round Off: ₹{calculateRoundOff()}</p>
              <p>Total Payable: ₹{calculateTotalPayable()}</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={createInvoice}
              disabled={!isFormFilled}
              className="px-6 py-2 bg-green-500 text-white rounded-md"
            >
              Create Purchase Order
            </button>

            <button
              onClick={generatePDF}
              disabled={!isFormFilled}
              className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md"
            >
              Generate PDF
            </button>
          </div>
        </div>
      ) : (
        <PDFPage rows={rows} freight={freight} gst={gst} />
      )}
    </>
  );
};

export default App;