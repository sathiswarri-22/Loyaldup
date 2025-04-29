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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300 p-4 sm:p-6">
    <div className="w-full max-w-6xl p-4 sm:p-6 md:p-8 space-y-6 bg-white rounded-xl shadow-xl">
      {profileData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileData.map((profile, index) => {
            const fileUrl = `http://localhost:5005/api/uploads/${profile.Fileupload}`;
            const profileImg = profile.profileimg
              ? `http://localhost:5005/api/uploads/${profile.profileimg}`
              : "";
  
            return (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <div className="text-center mb-4">
                  {profileImg && (
                    <img
                      src={profileImg}
                      alt="Profile"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-4 border-teal-300 mx-auto mb-4 shadow-lg"
                    />
                  )}
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    {profile.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {profile.email}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <tbody>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-600">
                          E-Id
                        </td>
                        <td className="py-2 px-3 text-gray-700">
                          {profile.Eid}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-600">
                          Name
                        </td>
                        <td className="py-2 px-3 text-gray-700">
                          {profile.name}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-600">
                          E-mail
                        </td>
                        <td className="py-2 px-3 text-gray-700">
                          {profile.email}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-600">
                          First PDF
                        </td>
                        <td className="py-2 px-3">
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal-600 hover:text-teal-800"
                          >
                            Open PDF
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-600 text-base sm:text-lg py-10">
          No profiles available.
        </div>
      )}
    </div>
  </div>
  
  );
};

export default Viewallprofile;
