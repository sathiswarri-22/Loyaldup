"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Viewallprofile = () => {
  const token = localStorage.getItem('admintokens');
  if (!token) {
    alert("No token found. Please login as an admin.");
    return null;
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

  if (loading) return <div className="text-center text-green-600">Loading...</div>;

  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        {profileData.length > 0 ? (
          profileData.map((profile, index) => {
            const fileUrl = `http://localhost:5005/api/uploads/${profile.Fileupload}`;
            const profileImg = profile.profileimg ? `http://localhost:5005/api/uploads/${profile.profileimg}` : '';

            return (
              <div key={index} className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <table className="w-full mb-4">
                    <tbody>
                      <tr>
                        <td className="p-2"><label className="font-medium text-gray-600">E-Id</label></td>
                        <td className="p-2"><input className="w-full p-2 border-2 border-green-200 rounded-lg" value={profile.Eid} readOnly /></td>
                      </tr>
                      <tr>
                        <td className="p-2"><label className="font-medium text-gray-600">Name</label></td>
                        <td className="p-2"><input className="w-full p-2 border-2 border-green-200 rounded-lg" value={profile.name} readOnly /></td>
                      </tr>
                      <tr>
                        <td className="p-2"><label className="font-medium text-gray-600">E-mail</label></td>
                        <td className="p-2"><input className="w-full p-2 border-2 border-green-200 rounded-lg" value={profile.email} readOnly /></td>
                      </tr>
                      
                      <tr>
                        <td className="p-2">
                          <a href={fileUrl} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-700">
                            Open First PDF
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {profileImg && (
                    <div className="flex justify-center">
                      <img src={profileImg} alt="Profile" className="w-40 h-40 object-cover rounded-full border-2 border-green-200 shadow-lg" />
                    </div>
                  )}
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
