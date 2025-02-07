"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Viewallprofile = () => {
  const token = localStorage.getItem('admintokens');
  if (!token) {
    alert("No token found. Please login as an admin.");
    return;
  }

  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true); 

    axios.get('http://localhost:5005/api/adminviewallprofile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(response => {
      console.log(response.data);

      if (response.data && response.data.getallprofile) {
        setProfileData(response.data.getallprofile); 
      } else {
        setError('Unexpected response data');
      }
    })
    .catch(error => {
      console.error('Error fetching profile data:', error);
      setError('Error fetching profile data');
    })
    .finally(() => setLoading(false)); 
  }, [token]);

  if (loading) return (
    <div className="text-center text-green-600 text-2xl">
      <div className="animate-spin border-t-4 border-green-600 rounded-full w-16 h-16 mx-auto my-8"></div>
      Loading...
    </div>
  );

  if (error) return <div className="text-center text-red-600 text-xl mt-4">{error}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-100 to-blue-200 py-8">
      <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-center text-teal-700 mb-6">All User Profiles</h1>

        {profileData.length > 0 ? (
          profileData.map((profile, index) => {
            const fileUrl = profile.Fileupload ? `http://localhost:5005/api/commonprofile/uploads/${profile.Fileupload}` : '';

            return (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-xl mb-6 hover:shadow-2xl transition-all transform hover:scale-105">
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <img 
                      src={profile.profileimg || '/default-profile.jpg'} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full border-4 border-teal-500 transition-transform transform hover:scale-110"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                      <label className="font-medium text-gray-700">E-Id</label>
                      <input value={profile.Eid} readOnly className="w-full p-3 pl-4 rounded-lg bg-gray-100 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="font-medium text-gray-700">Name</label>
                      <input value={profile.name} readOnly className="w-full p-3 pl-4 rounded-lg bg-gray-100 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="font-medium text-gray-700">E-mail</label>
                      <input value={profile.email} readOnly className="w-full p-3 pl-4 rounded-lg bg-gray-100 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <a href={fileUrl} target="_blank" rel="noreferrer" className="text-teal-600 hover:text-teal-800 underline text-lg font-medium">
                        Open First PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-600">No profiles available.</div>
        )}
      </div>
    </div>
  );
};

export default Viewallprofile;
