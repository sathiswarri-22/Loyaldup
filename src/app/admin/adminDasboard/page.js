"use client";
import { useRouter } from 'next/navigation'; 
import { useState } from 'react';

const SaleteamDasboard = () => {
  const router = useRouter();

  
  const ViewallEmployeesProfile = () => {
    try {
      router.push('/admin/viewallprofile');    
    } catch (err) {
      console.log('cannot go to the link', err);
    }
  };

  const addusers = () => {
    try {
      router.push('/admin/register');
    } catch (err) {
      console.log('cannot go to the link', err);
    }
  };

  const resetemail = () => {
    try {
      router.push('/admin/resetemail');
    } catch (err) {
      console.log('cannot go to the link', err);
    }
  };

  const resetpassword = () => {
    try {
      router.push('/admin/passwordreset');
    } catch (err) {
      console.log('cannot go to the link', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600">MD Dashboard</h1>

        <div className="space-y-4">
          <button
            onClick={ViewallEmployeesProfile}
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            View All Employees Profile
          </button>
          
          <button
            onClick={addusers}
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add Employees
          </button>
          
          <button
            onClick={resetemail}
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Reset Email
          </button>

          <button
            onClick={resetpassword}
            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleteamDasboard;
