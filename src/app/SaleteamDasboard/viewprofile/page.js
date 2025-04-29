"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, User, File, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfileView = () => {
    const [Eid, setEid] = useState('');
    const [role, setRole] = useState('');
    const [token, setToken] = useState('');
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        Fileupload: '',
        profileimg: ''
    });

    const router = useRouter();

    useEffect(() => {
        // Load data from localStorage after component mounts
        const storedId = localStorage.getItem('idstore');
        const storedRole = localStorage.getItem('rolestore');
        const storedToken = localStorage.getItem('admintokens');

        setEid(storedId);
        setRole(storedRole);
        setToken(storedToken);

        if (!storedToken) {
            alert("No token found. Please login as an admin.");
            return;
        }

        if (storedId) {
            axios.get(`http://localhost:5005/api/commonprofile/${storedId}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(response => {
                    if (response.data && response.data.data) {
                        const fileUrl = response.data.fileUrl;
                        setProfileData({
                            name: response.data.data.name,
                            email: response.data.data.email,
                            Fileupload: fileUrl,
                            profileimg: response.data.data.profileimg
                        });
                    } else {
                        console.error('Unexpected response data:', response);
                    }
                })
                .catch(error => {
                    console.error('Error fetching profile data:', error);
                });
        }
    }, []);

    const fileUploadUrl = profileData.Fileupload
        ? `http://localhost:5005/api/uploads/${profileData.profileimg}`
        : '';

    const handleBackClick = () => {
        if ((role === 'Service Engineer') || ('Engineer'))
            {
            router.push('/ServiceProject/Dasboard');
        } else {
            router.push('/SaleteamDasboard/Dasboard');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300 py-10">
            <div className="w-full max-w-lg p-10 space-y-8 bg-white rounded-3xl shadow-2xl relative">
                {/* Back Button */}
                <button
                    onClick={handleBackClick}
                    className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <ChevronLeft size={30} />
                </button>

                <h1 className="text-5xl font-bold text-center text-green-600 mb-6">Profile</h1>

                <div className="space-y-6">
                    <div className="relative">
                        <label className="block text-lg font-medium text-gray-700 mb-2">E-Id</label>
                        <div className="flex items-center border-2 border-green-300 rounded-xl p-3">
                            <User className="text-green-500" size={24} />
                            <input
                                value={Eid}
                                readOnly
                                className="w-full pl-4 py-2 bg-transparent text-gray-700 text-lg font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Name</label>
                        <div className="flex items-center border-2 border-green-300 rounded-xl p-3">
                            <User className="text-green-500" size={24} />
                            <input
                                value={profileData.name}
                                readOnly
                                className="w-full pl-4 py-2 bg-transparent text-gray-700 text-lg font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                        <div className="flex items-center border-2 border-green-300 rounded-xl p-3">
                            <Mail className="text-green-500" size={24} />
                            <input
                                value={profileData.email}
                                readOnly
                                className="w-full pl-4 py-2 bg-transparent text-gray-700 text-lg font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Profile Image</label>
                        <div className="flex items-center border-2 border-green-300 rounded-xl p-3">
                            {profileData.profileimg && (
                                <img
                                    src={fileUploadUrl}
                                    alt="Profile"
                                    className="w-24 h-24 object-cover rounded-full border-4 border-green-300"
                                />
                            )}
                        </div>
                    </div>

                    {fileUploadUrl && (
                        <div className="relative">
                            <label className="block text-lg font-medium text-gray-700 mb-2">File Upload</label>
                            <div className="flex items-center border-2 border-green-300 rounded-xl p-3">
                                <File className="text-green-500" size={24} />
                                <a
                                    href={fileUploadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-500 font-semibold pl-2 text-lg"
                                >
                                    View Uploaded File
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
