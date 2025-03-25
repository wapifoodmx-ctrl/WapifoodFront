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

    const dasboard = () => {
        router.push('/dashboard');
      };
    
      const productos = () => {
        router.push('/menu');
      };

    const menu = {
        Dashboard: {
            title: "Dashboard",
            href: '/dashboard',
            icon: <MdSpaceDashboard className=" h-full w-[24px]" />,
        },
        Register: {
            title: "Productos",
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
            title: "Log-Out",
            href: "#",
            icon: <ImExit className=" h-full w-[24px]" />,
            function: handleLogout,
        },
    };

    return (
        <nav className=" bg-[#f3f4f6] w-full  flex justify-between h-16">
            <div className="flex w-full justify-between px-4">
                {/* Logo */}
                <div className="flex items-center cursor-pointer" >
                    <GoChecklist size={36} className="text-green-600" />
                    <h2 className="text-3xl hover:text-green-600 font-bold ml-2">Dashboard</h2>
                </div>

                {/* Botón Hamburguesa - Siempre visible */}
                <button
                    className="z-20 cursor-pointer sticky"
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
                                    {item === "Dashboard" ? (
                                        <button
                                            className="flex w-auto gap-2"
                                            onClick={dasboard}
                                        >
                                            <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                        </button>
                                    ) : item === "Register" ? (
                                        <button
                                            className="flex w-auto gap-2"
                                            onClick={productos}
                                        >
                                            <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                        </button>
                                    ) : (
                                        <a className="flex w-auto gap-2" href={menu[item].href}>
                                            <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                        </a>
                                    )}
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