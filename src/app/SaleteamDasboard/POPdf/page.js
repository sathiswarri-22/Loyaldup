"use client";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams,useRouter } from "next/navigation";
import Head from "next/head";

export default function Poppdf() {
  const contentRef = useRef(null);
  const searchParams = useSearchParams();
  const poNumber = searchParams.get("poNumber");
  const [getdata, setGetdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfReady, setPdfReady] = useState(false);
  const router = useRouter();
  // Load html2pdf script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => setPdfReady(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Fetch PO data using PO number from query params
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admintokens");
      if (!token || !poNumber) return;

      try {
        const res = await axios.get(
          `http://localhost:5005/api-purchaseorder/PONumberbased?poNumber=${encodeURIComponent(poNumber)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setGetdata(res.data || null);
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [poNumber]);

  const generatePDF = () => {
    if (!pdfReady || !window.html2pdf) {
      alert("PDF library not ready yet. Please try again in a few seconds.");
      return;
    }

    if (!contentRef.current) {
      alert("PDF content is not ready.");
      return;
    }

    // Delay to ensure full DOM render before generating PDF
    setTimeout(() => {
      window.html2pdf()
        .from(contentRef.current)
        .set({
          margin: [10, 10, 10, 10],
          filename: `PurchaseOrder_${poNumber}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();
    }, 100);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <Head>
        <title>Purchase Order - {poNumber}</title>
        <meta name="description" content="Purchase Order PDF Generator" />
      </Head>

      <main className="p-4 max-w-7xl mx-auto">
      <button
          onClick={() => router.push('/SaleteamDasboard/GetPO')}
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
        <button
          onClick={generatePDF}
          className="mb-4 px-4 py-2 ml-7 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate PDF
        </button>

        <div ref={contentRef} className="bg-white border-2 border-gray-950">
          <div className="mb-3 p-0 m-0">
            <div className="text-lg font-bold mt-2 text-left text-red-600 mb-4 pl-5">
              GST 33AACCL4592K1ZA
            </div>
            <div className="w-full bg-black h-1 mb-4" style={{ marginLeft: 0, marginRight: 0 }}></div>
            <img
              src="/p4.jpeg"
              alt="Company Logo"
              className="w-full h-24 object-contain"
            />
          </div>
          <div className="w-full bg-black h-1 " style={{ marginLeft: 0, marginRight: 0 }}></div>
<h1 className="text-center text-3xl font-bold text-red-600">Purchase Order</h1>
<div className="w-full bg-black h-1 " style={{ marginLeft: 0, marginRight: 0 }}></div>


          

          <div className="flex justify-between items-stretch w-full h-[200px] ml-1">
            {/* Left Section */}
            <div className="w-1/3 flex flex-col justify-start mt-4">
              <div className="font-bold">Consignee:</div>
              <div className="font-bold">{getdata?.SupplierName}</div>
              <div className="">{getdata?.Address}.</div>
              <div className="pt-4 pb-8 font-bold">
                <strong>GSTIN/UIN:</strong> {getdata?.GSTIN || "N/A"}
              </div>
            </div>

            {/* Center Section (Separator) */}
            <div className="w-1 bg-black ml-16 self-stretch"></div>

            {/* Right Section */}
            <div className="w-1/3 flex flex-col justify-start mx-10 my-10 text-[14px] leading-6">
              <div>
                <strong>P.O. No :</strong> {getdata?.poNumber}
              </div>
              <div>
                <strong>Date:</strong> {new Date(getdata?.createdAt).toLocaleDateString()}
              </div>
              <div>
                <strong>Ref.Q.No :</strong> {getdata?.RefQNo}
              </div>
              <div>
                <strong>Ref.Q.Date :</strong> {getdata?.QDate ? new Date(getdata.QDate).toLocaleDateString("en-GB") : ""}
              </div>
            </div>
          </div>

          <table className="w-full text-sm border-collapse border border-2">
            <thead className="border-t-[3px] border-b-[4px] border-black">
              <tr className="bg-blue-700 text-white">
                <th className="border-x border-black px-2 py-1">S. No</th>
                <th className="border-x border-black px-2 py-1">HSN Code</th>
                <th className="border-x border-black px-2 py-1">Unit Description</th>
                <th className="border-x border-black px-2 py-1">UOM</th>
                <th className="border-x border-black px-2 py-1">Qty</th>
                <th className="border-x border-black px-2 py-1">Unit Price</th>
                <th className="border-x border-black px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody className="font-semibold">
              {getdata?.rows?.map((item, index) => (
                <tr key={index}>
                  <td className="border-x border-black py-1 text-center">{index + 1}</td>
                  <td className="border-x border-black py-1 text-center">{item?.hsnCode}</td>
                  <td className="border-x border-black py-1 text-center"><p><b>{item?.unitDescription}</b><br></br>{item.Description}</p></td>
                  <td className="border-x border-black py-1 text-center">{item?.uom}</td>
                  <td className="border-x border-black py-1 text-center">{item?.quantity}</td>
                  <td className="border-x border-black py-1 text-center">{item?.unitPrice}</td>
                  <td className="border-x border-black py-1 text-center">{item?.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pl-1 flex justify-between text-sm">
            <div className="w-2/3 mb-4">
              <strong className="text-base">Terms & Conditions:</strong>
              <div className="mt-2">
                <div className="font-bold">
                  <strong>Delivery:</strong> {getdata?.deliveryTerms || "N/A"}
                </div>
                <div className="font-bold">
                  <strong>Payment:</strong> {getdata?.paymentTerms || "N/A"}
                </div>
                <div className="font-bold">
                  <strong>Warranty:</strong> {getdata?.warrantyTerms || "N/A"}
                </div>
              </div>
            </div>

            <div className="w-1/3 text-base flex flex-col items-end justify-start mr-20">
  <div className="flex justify-between w-full">
    <span className="w-1/2 text-center font-semibold">Sub Total:</span>
    <span className="w-1/2 text-right pr-12">{getdata?.totalAmount || "N/A"}</span>
  </div>
  <div className="flex justify-between w-full">
    <span className="w-1/2 text-center font-semibold">GST @ {getdata?.gst || "N/A"}%:</span>
    <span className="w-1/2 text-right pr-12">{getdata?.gstAmount || "N/A"}</span>
  </div>
</div>
          </div>

          <div className="w-full bg-black h-1 " style={{ marginLeft: 0, marginRight: 0 }}></div>
<div className="text-right mr-20 text-lg font-bold mt-2"><strong className="pr-6">TOTAL :</strong> <span className="pr-10">{getdata?.payableAmount || "N/A"}</span> </div>  
<div className="w-full bg-black h-1 " style={{ marginLeft: 0, marginRight: 0 }}></div>

          <div className="flex justify-end mr-10 mt-3">
            <div className="flex flex-col items-end text-right">
              <strong className="text-base font-extrabold">FOR LOYALITY AUTOMATION PVT.LTD.</strong>
              <img src="/sign.jpeg" alt="signature" className="h-16 mt-2 w-36" />
              <h6 className="text-base font-semibold">Authorised Signatory</h6>
            </div>
          </div>

          <div className="w-full bg-black h-1" style={{ marginLeft: 0, marginRight: 0 }}></div>
          <div>
            <div className="flex justify-between items-center mt-2">
              {["/deltas.jpg", "/Schneider.png", "/phoenix.png", "/motovario.png"].map((src, idx, arr) => (
                <div
                  key={idx}
                  className={`w-1/4 p-1 ${idx === 0 ? 'text-left' : idx === arr.length - 1 ? 'text-right' : 'text-center'}`}
                >
                  <img
                    src={src}
                    alt={`Logo ${idx + 1}`}
                    className="mr-9 ml-4 h-10 w-35 object-contain inline-block"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
