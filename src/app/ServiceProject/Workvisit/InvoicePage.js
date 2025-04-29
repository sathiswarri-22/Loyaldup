"use client";
import { useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";

const InvoicePage = ({ workvisit, setWorkvisit, setIsSubmitted }) => {
  const contentRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    // Fixing the CSS issue
    const style = document.createElement('style');
    style.innerHTML = '* { box-sizing: border-box; }';
    document.head.appendChild(style);
  }, []);

  const handleDownload = () => {
    buttonRef.current.style.display = 'none';

    const element = contentRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'WorkVisit.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save().finally(() => {
      buttonRef.current.style.display = 'block';
      setWorkvisit({
        name: "",
        companyName: "",
        clientName: "",
        Eid: "",
        Date: "",
        Location: "",
        MachineName: "",
        ProductDescription: "",
        Problems: [{ description: "" }],
        Assessment: "",
      })
      setIsSubmitted(false);
    });
  };

  return (
    <div ref={contentRef} className="mx-3 min-h-screen">
      <div
        className="bg-white m-3 mx-auto"
        style={{ width: '760px', borderCollapse: 'collapse' }}
      >
        {/* Header */}
        <div className="border-black pb-1 mb-2">
          <img src="/p4.jpeg" className="w-full h-auto object-contain" alt="Header" />
        </div>

        {/* Invoice Title */}
        <h2 className="text-center text-red-600 mt-[-10px] text-xl font-bold pb-5 border-2 mt-2 border-black">SERVICE REPORT</h2>

        {/* Consignee and Invoice Info */}
        <div className="flex mb-4 mt-2">
          <div className="w-full">
            <table className="w-full border-collapse border border-gray-400">
              <tbody>
                <tr>
                  <td className="border border-black pb-3 pl-3 w-1/2">
                    <b>Report No:{workvisit.ReportNo}</b> 
                  </td>
                  <td className="border border-black pb-3 pl-3">
  <b>Date:</b> {new Date().toLocaleDateString('en-GB')}
</td>

                </tr>
                <tr>
                  <td className="border border-black pb-3 pl-3">
                    <b>Engineer Name:</b> {workvisit.name}
                  </td>
                  <td className="border border-black pb-3 pl-3">
                    <b>Location:</b> {workvisit.Location || 'Alathur'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black pb-3 pl-3">
                    <b>Company Name:</b> {workvisit.companyName || 'Apex Laboratories Pvt Ltd'}
                  </td>
                  <td className="border border-black pb-3 pl-3"></td>
                </tr>
                <tr>
                  <td className="border border-black pb-3 pl-3">
                    <b>Contact Person:</b> {workvisit.clientName || 'N/A'}
                  </td>
                  <td className="border border-black pb-3 pl-3">
                    <b>Machine Name:</b> {workvisit.MachineName || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Table */}
        <div className='w-full text-lg border-2 border-black pb-3 pl-3'>
          <b>Product Description:</b>
          <p className='pl-4'>{workvisit.ProductDescription || 'Eddy Current Drive'}</p>
        </div>
        <div className='w-full text-lg border-2 border-black mt-2 pb-3 pl-3'>
          <b>Problem:</b> {workvisit.Problems?.[0]?.description || 'Not working'}
        </div>

        {/* Footer */}
        <div className="mt-8 font-bold text-xl pl-3">
          <p>For LOYALTY AUTOMATION PVT. LTD.</p>
          <img className='ml-12 mt-3' src='/sign1.jpeg' alt="Signature" />
        </div>
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

export default InvoicePage;
