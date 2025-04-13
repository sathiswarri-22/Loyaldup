"use client"
import React, { useRef, useEffect , useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from "next/navigation";
import html2pdf from 'html2pdf.js';
import { toWords } from 'number-to-words';


const PDFPage = (props) => {
  const contentRef = useRef();
    const [consigneeData, setConsigneeData] = useState(null);
    const [error, setError] = useState(null);
  const { EnquiryNo } = props;
    const searchParams = useSearchParams();
    const Enquiry = searchParams.get('EnquiryNo');
    const router = useRouter();

    useEffect(() => {
      console.log("EnquiryNo passed:", EnquiryNo); 
      if (EnquiryNo || Enquiry) {
        fetchConsigneeData(EnquiryNo || Enquiry); 
      } else {
        console.error("EnquiryNo is undefined or null.");
        setError("EnquiryNo is missing. Please provide a valid EnquiryNo.");
      }
    }, [EnquiryNo, Enquiry]);
  
    const fetchConsigneeData = async (EnquiryNo) => {
      try {
        console.log("Attempting to fetch consignee data for EnquiryNo:", EnquiryNo);
        const token = localStorage.getItem("admintokens");
        console.log("Token fetched:", token);
  
        const response = await axios.get(`http://localhost:5005/api/cc/Enquiryget/${EnquiryNo}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("API Response:", response);
        
        if (response && response.data && response.data.customerData) {
          const customerData = response.data.customerData;
          console.log("Customer Data:", customerData);  
  
          const conversation = customerData.customerconvert.find(
            (item) => item.EnquiryNo === EnquiryNo
          );
  
          if (conversation) {
            console.log("Found conversation:", conversation);
            setConsigneeData(conversation.BillingAddressDetails); 
          } else {
            setError("Conversation not found for the provided EnquiryNo.");
          }
        } else {
          setError("No customer data found in the response.");
        }
      } catch (err) {
        console.error("Error fetching consignee data:", err);
        setError("Failed to load consignee data.");
      }
    };
  

  useEffect(() => {
    // Ensures consistent box-sizing for PDF
    const style = document.createElement('style');
    style.innerHTML = `* { box-sizing: border-box; }`;
    document.head.appendChild(style);
  }, []);

  const buttonRef = useRef();

const handleDownload = () => {
  // Hide the button
  buttonRef.current.style.display = 'none';

  const element = contentRef.current;
  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: 'Proforma_Invoice.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 3, useCORS: true },
    jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
  };

  html2pdf().set(opt).from(element).save().finally(() => {
    // Show the button again after download
    buttonRef.current.style.display = 'block';
  });
};

    const subtotal = Number(props.rows.reduce((acc, item) => Number(acc) + Number(item.total), 0));
    const freight = Number(props.freight);
    const gst = (subtotal + freight) * Number(props.gst) / 100;
    const totalPayable = Math.round(Number(subtotal) + freight + Number(gst)).toFixed(2);
    const roundoff = ((Number(subtotal) + freight + Number(gst))-Math.round(Number(totalPayable))).toFixed(2);

  const totalPayableInWords = toWords(Number(totalPayable)).toUpperCase();


  return (
    <div ref={contentRef} className="bg-gray-100 mx-3 min-h-screen">
      <div      
        className="bg-white border-black border-4 m-3 mx-auto border rounded shadow"
        style={{ width: '760px', borderCollapse: 'collapse' }}
      >
        {/* Header */}
        <div className="border-b-4 border-black pb-1 mb-2">
          <div className="flex justify-between items-center border-b-4 border-black px-6 ">
            <p className="text-lg font-bold">GST No: 33AACCL4592K1ZA</p>
            <div className="flex space-x-2">
              <img src="/phoenix.png" alt="Phoenix" className="w-28 h-16 object-contain" />
              <img src="/delta.png" alt="Delta" className="w-28 h-16 object-contain" />
              <img src="/Schneider.png" alt="Schneider" className="w-28 h-16 object-contain" />
            </div>
          </div>
          <img src="/p4.jpeg" className="w-full h-auto object-contain" alt="Header" />
        </div>

        {/* Invoice Title */}
        <h2 className="text-center text-red-600 mt-[-10px] text-xl font-bold pb-5 border-b-4 border-black">PROFORMA INVOICE</h2>

        {/* Consignee and Invoice Info */}
        <div className="flex border-b-4 border-black mb-4">
          <div className="w-1/2 pr-4">
            <h3 className="font-bold">Consignee:</h3>
            {consigneeData ? (
              <>
                <p>{consigneeData.BillingAddress}</p>
                <p>{consigneeData.BillingCity}</p>
                <p>{consigneeData.BillingCountry}</p>
                <p>{consigneeData.BillingPostalCode}</p>
                <p>{consigneeData.BillingState}</p>
              </>
            ) : (
              <p>Consignee data is not available</p>
            )}
          </div>
          <div className="w-1/2 pl-4 border-l-4 border-black">
            <table className="w-full">
              <tbody>
                <tr><td className="font-bold">Our Ref No.</td><td>: LAP/PJ/24-25/0087</td></tr>
                <tr><td className="font-bold">Date</td><td>: 18-09-2024</td></tr>
                <tr><td className="font-bold">Your Ref</td><td>: Verbal</td></tr>
                <tr><td className="font-bold">Buyer Order No</td><td>: Verbal</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Table */}
        <table className="w-full text-sm border border-black" style={{ borderCollapse: 'collapse' }}>
          <thead className="bg-gray-200">
            <tr className='bg-blue-700 text-white'>
              <th className="border border-black p-2">S.No</th>
              <th className="border border-black p-2">Product</th>
              <th className="border border-black p-2">Unit Description</th>
              <th className="border border-black p-2">UOM</th>
              <th className="border border-black p-2">Qty</th>
              <th className="border border-black p-2">Unit Price</th>
              <th className="border border-black p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            
            {props.rows.map((u)=>(<tr>
              <td className="border border-black p-2">{u.sno}</td>
              <td className="border border-black p-2">{u.hsnCode}</td>
              <td className="border border-black p-2">{u.unitDescription}</td>
              <td className="border border-black p-2">{u.uom}</td>
              <td className="border border-black p-2">{u.quantity}</td>
              <td className="border border-black p-2">{u.unitPrice}</td>
              <td className="border border-black p-2">{u.total}</td>
            </tr>))}
          </tbody>
        </table>

        {/* Calculation Section */}
        <div className="mt-4 flex justify-end border-t-4 border-b-4 border-black">
        <div className="mt-4 text-md w-[410px] mb-5">
          <h3 className="font-bold">Terms & Conditions:</h3>
          <ol className="pl-4 font-semibold text-[17px]/5">
            <li>1. Goods once sold will not be taken back.</li>
            <li>2. Interest @24% p.a. will be charged if the GST 18% 2708.46
            payment is not made in the stipulated time.</li>
            <li>3. Subject to chennai Jurisdiction only.</li>
            <li>4.  Certified that the particulars give above are true.</li>
          </ol>
        </div>
          <table className="text-sm w-1/2 ml-20 border-l-4 border-black" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td className="border border-black p-2">Sub Total</td><td className="border border-black p-2">{subtotal}</td></tr>
              <tr><td className="border border-black p-2">Freight</td><td className="border border-black p-2">{freight}</td></tr>
              <tr><td className="border border-black p-2">GST 18%</td><td className="border border-black p-2">{gst}</td></tr>
              <tr><td className="border border-black p-2 font-semibold">Round Off</td><td className="border border-black p-2">{roundoff}</td></tr>
              <tr><td className="border border-black p-2 font-bold text-blue-800 text-xl">Amount Payable</td><td className="border border-black p-2 font-bold text-blue-800 text-xl">{totalPayable}</td></tr>
            </tbody>
          </table>

        </div>

        {/* Amount in Words */}
        <p className="mt-[-6px] pb-3 text-[18px] border-black border-b-4">
          <strong className="text-[18px]">Amount (In Words):</strong> {totalPayableInWords} Only
        </p>
       
        <div className="mt-8 flex justify-end items-start text-right font-bold text-xl">
  <div className="text-right">
    <p>For LOYALTY AUTOMATION PVT. LTD.</p>
    <div className="mt-2 mr-9 flex justify-end items-center">
      <img 
        src="/LoyaltySeal.jpeg" 
        alt="Authorized Signatory" 
        className="w-20 h-auto object-contain" 
      />
    </div>
    <p className="mb-4 text-sm">Authorized Signatory</p>
    </div>
</div>

        {/* Payment Terms */}
      </div>

      {/* Download Button */}
      <div className="mt-6 text-center">
        <button
        ref={buttonRef}
          onClick={handleDownload}
          className="px-6 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PDFPage;