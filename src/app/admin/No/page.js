"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TodayView = () => {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState([]);
  const token = localStorage.getItem('admintokens');

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('https://loyality.chennaisunday.com/api/cc/todayviewnocustomer', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEnquiries(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleBackClick = () => {
    router.push('/admin/adminDasboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Today's Not Converted Enquiries</h1>
         <button 
                            onClick={handleBackClick}
                            className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                            <ChevronLeft size={24} />
                        </button>

        {enquiries.length === 0 ? (
          <p className="text-center text-green-600">No enquiries found.</p>
        ) : (
          <ul className="space-y-4">
            {enquiries.map((enquiry, index) => (
              <li key={index} className="border-b-2 border-green-200 py-4">
                <p><strong>EnquiryNo:</strong> {enquiry.EnquiryNo || 'N/A'}</p>
                <p><strong>Created At:</strong> {new Date(enquiry.createdAt).toLocaleString() || 'N/A'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodayView;
