"use client"

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Lock, RefreshCw } from 'lucide-react';

const PasswordReset = () => {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    password: '',
    confirmpassword: '',
    Eid: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmpassword, Eid } = passwords;

    if (!password || !confirmpassword || !Eid) {
      console.log('Data is required');
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.put('http://localhost:5005/api/reset-password', passwords);
      console.log(response.data);
      alert('Password is reset');
      router.push('/');
    } catch (err) {
      console.log('Error occurred', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Eid</label>
            <div className="flex items-center border-2 border-green-200 rounded-lg">
              <Lock className="ml-3 text-green-500" size={20} />
              <input 
                type="text"
                name="Eid"
                placeholder="Enter your Eid"
                value={passwords.Eid}
                onChange={handleChange}
                className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">New Password</label>
            <div className="flex items-center border-2 border-green-200 rounded-lg">
              <Lock className="ml-3 text-green-500" size={20} />
              <input 
                type="password"
                name="password"
                placeholder="Enter new password"
                value={passwords.password}
                onChange={handleChange}
                className="w-full p-3 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-600">Confirm Password</label>
            <div className="flex items-center border-2 border-green-200 rounded-lg">
              <Lock className="ml-3 text-green-500" size={20} />
              <input 
                type="password"
                name="confirmpassword"
                placeholder="Confirm your password"
                value={passwords.confirmpassword}
                onChange={handleChange}
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

        <div className="text-center">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-full py-2 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition duration-300"
          >
            <RefreshCw className="mr-2" size={16} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
