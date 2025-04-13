"use client";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Head from "next/head";

export default function Poppdf() {
  const contentRef = useRef(null);
  const searchParams = useSearchParams();
  const EnquiryNo = searchParams.get("EnquiryNo");
  const Eid = searchParams.get("Eid");

  const [getdata, setGetdata] = useState(null);
  const [getcustomerdata, setGetcustomerdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admintokens");
      if (!token || !EnquiryNo || !Eid) return;

      try {
        const [poRes, customerRes] = await Promise.all([
          axios.get(`http://localhost:5005/api-purchaseorder/POGetOne/${EnquiryNo}/${Eid}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5005/api/getoneenquiries/${EnquiryNo}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setGetdata(poRes.data.data);
        setGetcustomerdata(customerRes.data);
        console.log("i cannot get the customer data",customerRes.data)
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [EnquiryNo, Eid]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const generatePDF = () => {
    if (!window.html2pdf) return alert("PDF library not loaded yet.");

    window.html2pdf().from(contentRef.current).set({
      margin: [10, 10, 10, 10],
      filename: `PurchaseOrder_${EnquiryNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).save();
  };


  return (
    <div>
      <Head>
        <title>Commercial Offer PDF</title>
        <meta name="description" content="Commercial Offer PDF Generator" />
      </Head>

      <main className="p-4 max-w-7xl mx-auto">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading && <div className="text-blue-600 mb-4">Loading...</div>}

        <button
          onClick={generatePDF}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate PDF
        </button>

        <div ref={contentRef} className="bg-white p-6 border-2 border-gray-800">
          <div className="text-center mb-3">
            <h1 className="text-3xl font-bold">Commercial Offer</h1>
            <img
              src="/p4.jpeg"
              alt="Company Logo"
              className="w-full h-24 object-contain border"
            />
          </div>

          <div className="text-lg font-bold">GST 33AACCL4592K1ZA</div>

          {getcustomerdata && (
            <div className="mt-4 mb-3 flex justify-between border-b pb-2">
              <div className="text-lg font-bold w-1/2">
                <div>Consignee: {getcustomerdata?.LeadDetails.companyName}</div>
                <div>{getcustomerdata?.AddressDetails?.Address},</div>
                <div>
                  {getcustomerdata?.AddressDetails?.City} - {getcustomerdata?.AddressDetails?.PostalCode},
                </div>
                <div>{getcustomerdata?.AddressDetails?.State}</div>
              </div>
              <div className="text-center text-lg w-1/2">
                <div><strong>Our Ref. No:</strong> LAP/OFF/25-26/0857R1</div>
                <div><strong>Date:</strong> {getdata?.createdAt ? new Date(getdata.createdAt).toLocaleDateString() : "N/A"}</div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <strong>Kind Attn:</strong> {getcustomerdata?.LeadDetails?.clientName || "N/A"}<br />
            Refer to your enquiry. Please find below our best offer.
          </div>

          <table className="w-full text-sm mb-4 border" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr className="bg-gray-100">
                <th>S. No</th>
                <th>HSN Code</th>
                <th>Unit Description</th>
                <th>UOM</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {getdata?.rows?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.hsnCode}</td>
                  <td>{item?.unitDescription}</td>
                  <td>{item?.uom}</td>
                  <td>{item?.quantity}</td>
                  <td>{item?.unitPrice}</td>
                  <td>{item?.amount}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="6" align="right"><strong>Overall Total:</strong></td>
                <td>{getdata?.totalAmount || "N/A"}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex mb-4">
            <div className="w-2/3">
              <strong>Terms & Conditions:</strong>
              <div className="border p-2 text-sm">
                <div>Delivery: {getdata?.deliveryTerms || "N/A"}</div>
                <div>Payment: {getdata?.paymentTerms || "N/A"}</div>
                <div>Warranty: {getdata?.warrantyTerms || "N/A"}</div>
              </div>
            </div>
            <div className="w-1/3 text-center">
              <strong>GST Details:</strong>
              <div className="text-sm">GST @ {getdata?.gst || "N/A"}: Extra</div>
              <strong>Total Amount: {getdata?.payableAmount || "N/A"}</strong>
             
            </div>
          </div>

          <div className="text-center font-bold text-lg mb-2">
            We now look forward to the pleasure of receiving your valued order.
          </div>

          <div className="border-t pt-2 text-center">
            <strong className="text-lg">Authorized Dealers Of</strong>
            <div className="flex justify-between items-center mt-2">
              {["/delta.png", "/Schneider.png", "/phoenix.png", "/motovario.png"].map((src, idx) => (
                <div key={idx} className="w-1/4 p-1">
                  <img src={src} alt={`Logo ${idx + 1}`} className="mx-auto h-20 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
