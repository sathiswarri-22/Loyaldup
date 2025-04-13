"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceEngineer = () => {
  const [engineer, setEngineer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEngineerDetails = async () => {
    const Eid = localStorage.getItem('idstore'); // Get Eid from local storage

    if (!Eid) {
      setError("No Eid found in local storage.");
      return;
    }

    setLoading(true);
    setError('');
    setEngineer(null);

    try {
      const response = await axios.get(`http://localhost:5005/api/workvisit/${Eid}`);
      setEngineer(response.data.serviceEngineer);
    } catch (err) {
      console.error(err);  // Log the full error to the console
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineerDetails();
  }, []);  // Empty dependency array to run once on mount

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-teal-700">Service Engineer Details</h1>
          <h2 className="text-2xl text-gray-700">Engineer Information</h2>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          engineer && (
            <div style={{ marginTop: '20px' }}>
              <h2 className="text-2xl font-semibold text-teal-700">Engineer Details</h2>
              <p><strong>Name:</strong> {engineer.name}</p>
              <p><strong>Company Name:</strong> {engineer.companyName}</p>
              <p><strong>Client Name:</strong> {engineer.clientName}</p>
              <p><strong>Eid:</strong> {engineer.Eid}</p>
              <p><strong>Location:</strong> {engineer.Location}</p>
              <p><strong>Machine Name:</strong> {engineer.MachineName}</p>
              <p><strong>Product Description:</strong> {engineer.ProductDescription}</p>
              <p><strong>Problems:</strong></p>
              {engineer.Problems.map((problem, index) => (
                <p key={index}>{problem.description}</p>
              ))}
              <p><strong>Assessment:</strong> {engineer.Assessment}</p>
              <p><strong>Status:</strong> {engineer.Status}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ServiceEngineer;