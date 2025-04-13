"use client";
import { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const contentRef = useRef(null);
  const search = useSearchParams();
  const EnquiryNo = search.get('EnquiryNo');
  const Eid = search.get('Eid');
  const [getdata, setGetdata] = useState(null);
  const [getcustomerdata, setGetcustomerdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('admintokens');  // Replace with actual token fetching method

  useEffect(() => {
    // Load html2pdf.js only once
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        console.log('html2pdf loaded');
      };
      document.body.appendChild(script);

      // Cleanup script on unmount
      return () => document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    if (EnquiryNo && Eid) {
      getdataresponse();
      getdataeditresponse();
      getcustomerdetails();
    }
  }, [EnquiryNo, Eid]);

  // Fetch customer data
  const getcustomerdetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5005/api/getoneenquiries/${EnquiryNo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setGetcustomerdata(response.data);
      }
      console.log("i get the customer details", response.data)
    } catch (err) {
      console.error('Error getting customer details:', err);
      setError('Failed to load customer details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch quotation data
  const getdataresponse = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5005/api/quotationGetOne/${EnquiryNo}/${Eid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.data?.Status === 'quotsaccess') {
        setGetdata(response.data.data);
      }
    } catch (err) {
      console.error('Error getting the quotation:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch editable quotation data
  const getdataeditresponse = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5005/api/quotationEditOne/${EnquiryNo}/${Eid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.data?.Status === 'Editaccess') {
        setGetdata(response.data.data);
      }
    } catch (err) {
      console.error('Error getting the editable quotation:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const element = contentRef.current;
    const opt = {
      margin: [10, 10, 10, 10], // Adjust margins (top, right, bottom, left)
      filename: 'commercial_offer.pdf',
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 3, logging: true }, // Increased scale for better resolution
      jsPDF: {
        unit: 'mm', // Millimeters as the unit
        format: 'a4', // A4 size
        orientation: 'portrait', // Portrait orientation
      }
    };

    // Check if html2pdf is available and generate PDF
    if (window.html2pdf) {
      window.html2pdf().from(element).set(opt).save();
    } else {
      alert('PDF library not loaded yet. Please try again.');
      console.log('html2pdf is not available');
    }
  };

  return (
    <div>
      <Head>
        <title>Commercial Offer PDF Generator</title>
        <meta name="description" content="Generate commercial offer PDF" />
        <style>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            table, th, td {
              border: 1px solid black !important;
              border-collapse: collapse !important;
            }
          }
        `}</style>
      </Head>

      <main className="container mx-auto p-4">
        {/* Error handling */}
        {error && (
          <div className="mb-4 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="mb-4 text-blue-500">
            <p>Loading...</p>
          </div>
        )}

        {/* PDF Button */}
        <button 
          onClick={generatePDF} 
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          Generate PDF
        </button>

        {/* Content for PDF */}
        <div ref={contentRef} className="pdf-content bg-white p-6 max-w-full mx-auto border-2 border-gray-800" style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>
          <div className="text-center mb-3">
            <h1 className="text-3xl font-bold mb-2">Commercial Offer</h1>
            <img 
              src="/p4.jpeg" 
              alt="Company Logo" 
              className="w-full h-24 object-contain" 
              style={{ border: '1px solid black' }}
            />
          </div>
          <div className="mt-2 font-bold text-lg">GST 33AACCL4592K1ZA</div>

          {getcustomerdata && (
            <div className="mb-3 flex justify-between items-center border-b border-gray-300 pb-2">
              <div className="w-1/3 text-lg font-bold">
                <div><strong>Consignee: {getcustomerdata.LeadDetails.companyName}</strong></div>
                <div>{getcustomerdata.AddressDetails.Address},</div>
                <div>{getcustomerdata.AddressDetails.City}-{getcustomerdata.AddressDetails.PostalCode},</div>
                <div>{getcustomerdata.AddressDetails.State}.</div>
              </div>
              <div className="w-1/3 text-center text-lg">
                <div><strong>Our Ref. No:</strong> LAP/OFF/25-26/0857R1</div>
                <div><strong>Date:</strong> {getdata?.createdAt ? new Date(getdata.createdAt).toLocaleDateString() : "N/A"}</div>
              </div>
            </div>
          )}

          <div className="mb-2 text-lg font-bold">
            <div><strong>Kind Attn:</strong> {getcustomerdata?.LeadDetails.clientName || "N/A"}</div>
            <div>Refer to your above enquiry, please find below our best offer for your requirements for your kind perusal.</div>
          </div>

          {/* Table for the quotation items */}
          <table className="w-full mb-3 text-sm" style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
            <thead>
              <tr className="bg-gray-100">
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>S. No</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>HSN Code</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Unit Description</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>UOM</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Qty</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Unit Price</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {getdata?.products?.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item?.HSNCode}</td>
                  <td style={{ border: '1px solid black', padding: '8px', lineHeight: '1.5' }}>{item?.UnitDescription}</td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item?.UOM}</td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item?.Quantity}</td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>{item?.UnitPrice}</td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>{item?.Total}</td>
                </tr>
              ))}
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }} colSpan="6" align="right">
                  <strong>Total:</strong>
                </td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>
                  <strong>{getdata?.PayableAmount || "N/A"}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Terms and Conditions */}
          <div className="mb-3 flex">
            <div className="w-2/3 pr-2">
              <div className="font-bold mb-1 text-lg">Terms & Conditions:</div>
              <div style={{ border: '1px solid black', padding: '8px', fontSize: '14px' }}>
                <div>Discount: {getdata?.Discount || "N/A"}</div>
                <div>Delivery: {getdata?.Delivery || "N/A"}</div>
                <div>Payment: {getdata?.Paymentdue || "N/A"}</div>
                <div>Validity: {getdata?.validity || "N/A"}</div>
                <div>Warranty: {getdata?.Warranty || "N/A"}</div>
              </div>
            </div>

            <div className="w-1/3">
              <div className="font-bold mb-1 text-center text-lg">GST Details:</div>
              <div style={{ textAlign: 'center', fontSize: '14px' }}>
                <hr className="border-t border-gray-300 mb-1" />
                <div>GST @ {getdata?.Gst || "N/A"}: Extra</div>
              </div>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="mb-2 text-lg font-bold text-center">
            <div>We now look forward to the pleasure of receiving your valued order</div>
          </div>

          {/* Partner Logos */}
          <div className="mt-2 border-t border-gray-300 pt-2">
            <div className="font-bold mb-1 text-center text-lg">Authorized Dealers Of</div>
            <div className="flex justify-between items-center">
              <div className="w-1/4 p-1 text-center">
                <img 
                  src="/delta.png" 
                  alt="Partner Logo 1" 
                  className="mx-auto h-24" 
                  style={{ maxWidth: '100%' }} 
                />
              </div>
              <div className="w-1/4 p-1 text-center">
                <img 
                  src="/Schneider.png" 
                  alt="Partner Logo 2" 
                  className="mx-auto h-24" 
                  style={{ maxWidth: '100%' }} 
                />
              </div>
              <div className="w-1/4 p-1 text-center">
                <img 
                  src="/phoenix.png" 
                  alt="Partner Logo 3" 
                  className="mx-auto h-24" 
                  style={{ maxWidth: '100%' }} 
                />
              </div>
              <div className="w-1/4 p-1 text-center">
                <img 
                  src="/motovario.png" 
                  alt="Partner Logo 4" 
                  className="mx-auto h-24" 
                  style={{ maxWidth: '100%' }} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
