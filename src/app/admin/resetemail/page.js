"use client";

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const EmailReset = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

const token = localStorage.getItem('admintokens')
  
  const handlesubmit = async (e) => {
    e.preventDefault(); 

    const { name, email } = formData;
    console.log(formData)

    if (!name || !email) {
      console.log('Data is required');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5005/api/reset-email', formData , {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
      console.log(response.data);
      alert('Email has been reset');
      router.push('/'); 
    } catch (err) {
      console.log('An error occurred:', err.message || err);
    }
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, 
      [name]: value, 
    });
  };

  const handleBackClick = () => {
    router.push('/admin/adminDasboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Reset Email</h1>
         <button 
                            onClick={handleBackClick}
                            className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                            <ChevronLeft size={24} />
                        </button>

        <form onSubmit={handlesubmit} className="space-y-4">
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name} 
              onChange={handlechange} 
              className="w-full p-3 rounded-lg border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your new email"
              value={formData.email} 
              onChange={handlechange} 
              className="w-full p-3 rounded-lg border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailReset;
