"use client";

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

const PasswordReset = () => {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    Eid : '',
    password: '',
    confirmPassword: '',
  });

  const handlesubmit = async (e) => {
    e.preventDefault();
    const { Eid,password, confirmPassword } = passwords;
    if (!Eid|| !password || !confirmPassword) {
      console.log('Data is required');
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.put('http://localhost:5005/api/reset-password', passwords);
      console.log(response.data);
      alert('Password has been reset');
      router.push('/');
    } catch (err) {
      console.log('An error occurred', err);
    }
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Reset Password</h1>

        <form onSubmit={handlesubmit} className="space-y-4">

        <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Eid</label>
            <input
              name="Eid"
              type="Eid"
              placeholder="Enter your new password"
              value={passwords.Eid}
              onChange={handlechange}
              className="w-full p-3 rounded-lg border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your new password"
              value={passwords.password}
              onChange={handlechange}
              className="w-full p-3 rounded-lg border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={passwords.confirmPassword}
              onChange={handlechange}
              className="w-full p-3 rounded-lg border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
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
