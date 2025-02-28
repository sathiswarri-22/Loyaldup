import axios from "axios";
import { useRouter } from "next/navigation";

const Logout = () => {
    const router = useRouter();


    const handleLogOut = async () => {
        try {
            localStorage.clear();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <button onClick={handleLogOut}>
            Logout
        </button>
    )
}

export default Logout;
