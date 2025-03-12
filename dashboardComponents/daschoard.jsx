import { useRouter } from 'next/router';

export default function Dashboard1() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div>
            <nav className="bg-gray-800 p-4 flex justify-between items-center">
                <h1 className="text-white text-2xl">Nombre del Restaurante</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </nav>
            <div className="p-4">
                <h1>Dashboard</h1>
            </div>
        </div>
    );
}