"use client";
import { useRouter } from 'next/navigation'; 

const SaleteamDasboard = () => {
    const router = useRouter();

    const Viewalluserprofile = () => {
        try {
            router.push('/admin/viewallprofile');    
        } catch (err) {
            console.log('Cannot go to the link', err);
        }
    };

    const addusers = () => {
        try {
            router.push('/admin/register');
        } catch (err) {
            console.log('Cannot go to the link', err);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h1 className="text-4xl font-bold text-center text-green-600">Admin Dashboard</h1>

                <div className="space-y-4">
                    <div className="relative">
                        <button 
                            onClick={Viewalluserprofile}
                            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            View All User Profiles
                        </button>
                    </div>

                    <div className="relative">
                        <button 
                            onClick={addusers}
                            className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Add Users
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaleteamDasboard;
