"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import PDFPage from './pdf';

const App = () => {
  const [rows, setRows] = useState([{
    sno: '',
    hsnCode: '',
    unitDescription: '',
    uom: '',
    quantity: '',
    unitPrice: '',
    gst: '18',
    total: 0,
  }]);

  const [goodsReturn, setGoodsReturn] = useState('Yes');
  const [interestRate, setInterestRate] = useState('24%');
  const [jurisdiction, setJurisdiction] = useState('Chennai');
  const [certification, setCertification] = useState('True');
  const [freight, setFreight] = useState('');
  const [gstPercentage, setGstPercentage] = useState('18');
  const [calculatedGst, setCalculatedGst] = useState('0');
  const [financialYear, setFinancialYear] = useState('24-25');
  const [generatedRefNumber, setGeneratedRefNumber] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);
  const [pdfPage, setPdfPage] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const [yourRef, setYourRef] = useState('');
  const [issueDate, setIssueDate] = useState('');

  const token = typeof window !== "undefined" ? localStorage.getItem('admintokens') : null;
  const Eid = typeof window !== "undefined" ? localStorage.getItem('idstore') : null;
  const router = useRouter();
  const search = useSearchParams();
  const EnquiryNo = search.get('EnquiryNo');

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token]);

  useEffect(() => {
    // When gstPercentage changes, update all rows
    const updatedRows = rows.map(row => ({
      ...row,
      gst: gstPercentage,
    }));
    setRows(updatedRows);
  }, [gstPercentage]);

  useEffect(() => {
    const gstValue = calculateTotalGST();
    setCalculatedGst(gstValue);
  }, [rows, freight, gstPercentage]);

  const handleTermsChange = (e, field) => {
    switch (field) {
      case 'goodsReturn': setGoodsReturn(e.target.value); break;
      case 'interestRate': setInterestRate(e.target.value); break;
      case 'jurisdiction': setJurisdiction(e.target.value); break;
      case 'certification': setCertification(e.target.value); break;
      default: break;
    }
  };

  const handleRowChange = (index, e, field) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = e.target.value;

    if (['quantity', 'unitPrice'].includes(field)) {
      const quantity = parseFloat(updatedRows[index].quantity) || 0;
      const unitPrice = parseFloat(updatedRows[index].unitPrice) || 0;
      const total = quantity * unitPrice;
      updatedRows[index].total = total.toFixed(2);
    }

    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, {
      sno: '', hsnCode: '', unitDescription: '', uom: '', quantity: '',
      unitPrice: '', gst: gstPercentage, total: 0
    }]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
    }
  };

  const calculateSubtotal = () => {
    return rows.reduce((acc, row) => acc + parseFloat(row.total || 0), 0);
  };

  const calculateTotalGST = () => {
    const subtotal = calculateSubtotal();
    const freightValue = parseFloat(freight || 0);
    const gstAmount = ((subtotal + freightValue) * parseFloat(gstPercentage || 0)) / 100;
    return gstAmount.toFixed(2);
  };

  const calculateTotalPayable = () => {
    const subtotal = calculateSubtotal();
    const freightValue = parseFloat(freight || 0);
    const gstAmount = parseFloat(calculatedGst);
    return (subtotal + freightValue + gstAmount).toFixed(2);
  };

  const calculateRoundOff = () => {
    const totalPayable = parseFloat(calculateTotalPayable());
    return (Math.round(totalPayable) - totalPayable).toFixed(2);
  };

  const isFormFilled = financialYear && goodsReturn && interestRate && jurisdiction &&
    certification && rows.every(row =>
      row.hsnCode && row.unitDescription && row.uom && row.quantity && row.unitPrice
    ) && name && address && gstNumber && yourRef && issueDate;

  const createInvoice = async () => {
    const goodsReturnBool = goodsReturn === 'Yes';
    const interestRateNum = parseFloat(interestRate.replace('%', ''));

    const orderData = {
      goodsReturn: goodsReturnBool,
      interestRate: interestRateNum,
      jurisdiction,
      certification,
      Eid,
      EnquiryNo,
      name,
      address,
      gstField: gstNumber,
      yourRef,
      issueDate,
      rows: rows.map(row => ({
        itemName: row.unitDescription,
        quantity: row.quantity,
        unitPrice: row.unitPrice,
        gst: parseFloat(gstPercentage),
        total: row.total
      })),
      freight: parseFloat(freight || 0),
      gst: parseFloat(calculatedGst),
      subtotal: calculateSubtotal(),
      roundOff: parseFloat(calculateRoundOff()),
      totalPayable: parseFloat(calculateTotalPayable()),
      financialYear,
    };

    try {
      const response = await axios.post('http://localhost:5005/api-invoice/invoice', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setGeneratedRefNumber(response.data.referenceNumber);
      setInvoiceData(response.data.invoice);
      setPdfPage(true);
    } catch (error) {
      console.error("Invoice creation failed:", error.response?.data || error.message);
    }
  };

  return (
    <>
      {!pdfPage ? (
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <button
          onClick={() => router.push('/SaleteamDasboard/Inventory')}
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
          <div className="flex justify-between items-center mb-8 border-b pb-4">
          
            <h2 className="text-2xl font-bold mt-6 text-gray-800">Proforma Invoice</h2>
          </div>

          {/* Customer Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Customer Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border-gray-300 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border-gray-300 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">GST Number</label>
                <input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} className="w-full p-3 border-gray-300 border rounded-md" />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Invoice Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Financial Year</label>
                <input value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} className="w-full p-3 border-gray-300 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Goods Return</label>
                <select value={goodsReturn} onChange={(e) => handleTermsChange(e, 'goodsReturn')} className="w-full p-3 border-gray-300 border rounded-md">
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Interest Rate</label>
                <input value={interestRate} onChange={(e) => handleTermsChange(e, 'interestRate')} className="w-full p-3 border-gray-300 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Jurisdiction</label>
                <input value={jurisdiction} onChange={(e) => handleTermsChange(e, 'jurisdiction')} className="w-full p-3 border-gray-300 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Certification</label>
                <select value={certification} onChange={(e) => handleTermsChange(e, 'certification')} className="w-full p-3 border-gray-300 border rounded-md">
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Your Ref</label>
                <input value={yourRef} onChange={(e) => setYourRef(e.target.value)} className="w-full p-3 border-gray-300 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Issue Date</label>
                <input 
                  type="date" 
                  value={issueDate} 
                  onChange={(e) => setIssueDate(e.target.value)} 
                  className="w-full p-3 border-gray-300 border rounded-md" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Freight</label>
                <input type="number" value={freight} onChange={(e) => setFreight(e.target.value)} className="w-full p-3 border-gray-300 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">GST Percentage</label>
                <input 
                  type="number" 
                  value={gstPercentage} 
                  onChange={(e) => setGstPercentage(e.target.value)} 
                  className="w-full p-3 border-gray-300 border rounded-md" 
                />
              </div>
            </div>
          </div>

          {/* Product Table Card */}
          <div className="bg-white rounded-lg shadow p-1 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    {['S.No', 'HSN Code', 'Unit Description', 'UOM', 'Quantity', 'Unit Price', 'Total', ''].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-gray-600 font-semibold text-sm">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      {['sno', 'hsnCode', 'unitDescription', 'uom', 'quantity', 'unitPrice'].map((field) => (
                        <td key={field} className="px-4 py-3">
                          <input
                            type="text"
                            value={row[field]}
                            onChange={(e) => handleRowChange(index, e, field)}
                            className="w-full px-4 py-2 border-gray-300 border rounded-md"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3">{row.total}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-red-600"
                          onClick={() => removeRow(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add row button */}
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={addRow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add Row
            </button>
          </div>

          {/* Subtotal and Total Calculation */}
          <div className="flex justify-between mb-8">
            <div className="w-1/2 pr-2">
              <label className="block text-sm font-medium text-gray-600">Subtotal</label>
              <input
                type="text"
                value={calculateSubtotal().toFixed(2)}
                readOnly
                className="w-full p-3 border-gray-300 border rounded-md bg-gray-100"
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-sm font-medium text-gray-600">Total GST</label>
              <input
                type="text"
                value={calculatedGst}
                readOnly
                className="w-full p-3 border-gray-300 border rounded-md bg-gray-100"
              />
            </div>
          </div>

          {/* Total Payable Calculation */}
          <div className="flex justify-between mb-8">
            <div className="w-1/2 pr-2">
              <label className="block text-sm font-medium text-gray-600">Total Payable</label>
              <input
                type="text"
                value={calculateTotalPayable()}
                readOnly
                className="w-full p-3 border-gray-300 border rounded-md bg-gray-100"
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-sm font-medium text-gray-600">Round Off</label>
              <input
                type="text"
                value={calculateRoundOff()}
                readOnly
                className="w-full p-3 border-gray-300 border rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!isFormFilled}
              onClick={createInvoice}
              className={`px-6 py-3 ${isFormFilled ? 'bg-green-600' : 'bg-gray-400'} text-white rounded-lg`}
            >
              Create Invoice
            </button>
          </div>
        </div>
      ) : (
        <PDFPage
        invoice={invoiceData}
        rows={rows}
        freight={freight}
        gst={calculatedGst}
        invoiceData={invoiceData}
        name={name}
        address={address}
        gstNumber={gstNumber}
      />
      )}
    </>
  );
};

export default App;