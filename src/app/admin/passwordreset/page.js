"use client";

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const PasswordReset = () => {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    password: '',
    confirmpassword: '',
  });

  const token = localStorage.getItem('admintokens');


  const handlesubmit = async (e) => {
    e.preventDefault();
    const { password, confirmpassword } = passwords;
    if (!password || !confirmpassword) {
      console.log('data is required');
    }
    if (password !== confirmpassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      const response = await axios.put('http://localhost:5005/api/reset-headerpassword', passwords,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
     } ,});
      console.log(response.data);
      alert('Password is reset');
      router.push('/');
    } catch (err) {
      console.log('Error occurred', err);
    }
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleBackClick = () => {
    router.push('/admin/adminDasboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Reset Password</h1>
         <button 
                            onClick={handleBackClick}
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

        <form onSubmit={handlesubmit} className="space-y-4">
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
            <div className="flex items-center border-2 border-green-200 rounded-lg">
              <input
                type="password"
                name="password"
                placeholder="Enter your new password"
                value={passwords.password}
                onChange={handlechange}
                className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Confirm Password</label>
            <div className="flex items-center border-2 border-green-200 rounded-lg">
              <input
                type="password"
                name="confirmpassword"
                placeholder="Confirm your new password"
                value={passwords.confirmpassword}
                onChange={handlechange}
                className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
