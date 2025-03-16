import { useState } from "react";
import { GoChecklist } from "react-icons/go";
import { useRouter } from 'next/router';
import { MdSpaceDashboard } from "react-icons/md";
import { LuPizza } from "react-icons/lu";
import { FiShoppingBag } from "react-icons/fi";
import { FcSalesPerformance } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import { ImExit } from "react-icons/im";

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    
    const handleLogout = () => {
        router.push("/login");
        localStorage.removeItem('token');
    };

    const menu = {
        Dashboard: {
            title: "Dashboard",
            href: '#',
            icon: <MdSpaceDashboard className=" h-full w-[24px]" />,
        },
        Register: {
            title: "Registrar Productos",
            href: "#",
            icon: <LuPizza className=" h-full w-[24px]" />,
        },
        Pedidos: {
            title: "Pedidos",
            href: "#",
            icon: <FiShoppingBag className=" h-full w-[24px]" />,
        },
        Ventas: {
            title: "Ventas",
            href: "#",
            icon: <FcSalesPerformance className=" h-full w-[24px]" />,
        },
    };

    const config = {
        Profile: {
            title: "Mi perfil",
            href: '#',
            icon: <FaUser className=" h-full w-[24px]" />,
        },
        Logout: {
            title: "Cerrar Sesión",
            href: "#",
            icon: <ImExit className=" h-full w-[24px]" />,
            function: handleLogout,
        },
    };

    return (
        <nav className="row-start-1 row-end-2 bg-[#f3f4f6] w-full h-full flex justify-between">
            <div className="flex w-full justify-between px-4">
                {/* Logo */}
                <div className="flex items-center cursor-pointer" >
                    <GoChecklist size={36} className="text-green-600" />
                    <h1 className="text-3xl hover:text-green-600 font-bold ml-2">Dashboard</h1>
                </div>

                {/* Botón Hamburguesa - Siempre visible */}
                <button
                    className="z-20 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </button>

                {/* Menú */}
                <div className={`
                    fixed top-0 right-0 h-full w-auto min-w-0 bg-gray-100 
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}>
                    {/* Elementos del menú */}
                    <ul className="flex flex-col mt-16 p-4 text-xl">
                        <p className="text-gray-500 font-bold">Menú principal</p>
                        {
                            Object.keys(menu).map((item, index) => (
                                <li key={index} className="cursor-pointer hover:text-green-600 my-4">
                                    <a className="flex w-auto gap-2" href={menu[item].href}> <span className="self-center">{menu[item].icon}</span> {menu[item].title}</a>
                                </li>
                            ))
                        }

                        <p className="text-gray-500 font-bold">Configuración</p>
                        {
                            Object.keys(config).map((item, index) => (
                                <li key={index} className="cursor-pointer hover:text-green-600 my-4">
                                    <button className="flex w-auto gap-2" onClick={config[item].function} href={config[item].href}> <span className="self-center">{config[item].icon}</span> {config[item].title}</button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}