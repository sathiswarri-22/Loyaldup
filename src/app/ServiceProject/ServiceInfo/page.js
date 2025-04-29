"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceEngineer = () => {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const fetchEngineerDetails = async () => {
    const Eid = localStorage.getItem('idstore');
    if (!Eid) {
      setError("No Eid found in local storage.");
      return;
    }
    
    setLoading(true);
    setError('');
    setEngineers([]);
    
    try {
      const response = await axios.get(`http://localhost:5005/api/workvisit/${Eid}`);
      setEngineers(response.data.serviceEngineers);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineerDetails();
  }, []);

  // Function to determine status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500';
      case 'in progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderEngineerCard = (engineer, idx) => (
    <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {/* Top accent color bar */}
        <div className={`h-2 ${getStatusColor(engineer.Status)}`}></div>
        
        {/* Card Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{engineer.name || 'Unnamed Engineer'}</h3>
              <p className="text-sm text-gray-500">{engineer.Eid}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(engineer.Status)}`}>
              {engineer.Status || 'Unknown'}
            </span>
          </div>
          
          {/* Company & Client */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-gray-500 mb-1">Company</p>
              <p className="text-sm font-semibold truncate">{engineer.companyName || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-gray-500 mb-1">Client</p>
              <p className="text-sm font-semibold truncate">{engineer.clientName || 'N/A'}</p>
            </div>
          </div>
          
          {/* Location & Machine */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm">{engineer.Location || 'Unknown location'}</p>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <p className="text-sm">{engineer.MachineName || 'Unknown machine'}</p>
            </div>
          </div>
          
          {/* Product Description */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Product Description</h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
              {engineer.ProductDescription || 'No description available'}
            </p>
          </div>
          
          {/* Problems */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Problems</h4>
            {engineer.Problems && engineer.Problems.length > 0 ? (
              <div className="space-y-2">
                {engineer.Problems.map((problem, index) => (
                  <div key={index} className="text-sm p-3 rounded-lg bg-red-50 border-l-2 border-red-400">
                    {problem.description}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No problems reported</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Engineer Details</h1>
            <p className="text-gray-600">Viewing all records for engineer ID: {localStorage.getItem('idstore')}</p>
          </div>
          
          <div className="flex space-x-2 bg-white rounded-lg shadow-sm p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative h-10 w-10">
              <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Error</h3>
                <p className="mt-2 text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : engineers.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {engineers.map((engineer, idx) => renderEngineerCard(engineer, idx))}
            </div>
          ) : (
            <div className="space-y-4">
              {engineers.map((engineer, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex items-center p-4 border-l-4 border-indigo-500">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{engineer.name || 'Unnamed Engineer'}</h3>
                      <p className="text-sm text-gray-500">{engineer.Eid}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(engineer.Status)}`}></span>
                      <span className="text-sm font-medium">{engineer.Status || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Company</p>
                        <p className="text-sm font-medium">{engineer.companyName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Client</p>
                        <p className="text-sm font-medium">{engineer.clientName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium">{engineer.Location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Machine</p>
                        <p className="text-sm font-medium">{engineer.MachineName || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">Product Description</p>
                    <p className="text-sm mb-4">{engineer.ProductDescription || 'No description available'}</p>
                    
                    <p className="text-xs text-gray-500 mb-1">Problems</p>
                    {engineer.Problems && engineer.Problems.length > 0 ? (
                      <div className="space-y-2">
                        {engineer.Problems.map((problem, index) => (
                          <div key={index} className="text-sm p-2 bg-red-50 rounded border-l-2 border-red-400">
                            {problem.description}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No problems reported</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M34 40h10v-4a6 6 0 00-10.712-3.714m-2.572-4.572A10 10 0 0040 36h.01M4 40h.01M16 12a4 4 0 11-8 0 4 4 0 018 0zm13 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h2 className="mt-2 text-lg font-medium text-gray-900">No engineer records found</h2>
              <p className="mt-1 text-sm text-gray-500">
                No service engineer records match your search. Try refreshing or checking your engineer ID.
              </p>
              <div className="mt-6">
                <button
                  onClick={fetchEngineerDetails}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Refresh data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceEngineer;         