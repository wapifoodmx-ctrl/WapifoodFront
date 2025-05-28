import { useState, useEffect, useRef } from "react";
import { GoChecklist } from "react-icons/go";
import { useRouter } from 'next/router';
import { MdSpaceDashboard } from "react-icons/md";
import { LuPizza } from "react-icons/lu";
import { FiShoppingBag } from "react-icons/fi";
import { FcSalesPerformance } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { LuIdCard } from "react-icons/lu";
import { FaKitchenSet } from "react-icons/fa6";

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        router.push("/login");
        localStorage.removeItem('token');
    };

    const dasboard = () => router.push('/dashboard');
    const productos = () => router.push('/menu');
    const pedidos = () => router.push('/pedidos');
    const MiPerfil = () => router.push('/user');
    const payments = () => router.push('/payments');
    const puntoDeVenta = () => router.push('/puntodeventa');
    const cocina = () => router.push('/cocina');

    const menu = {
        Dashboard: {
            title: "Dashboard",
            href: '/dashboard',
            icon: <MdSpaceDashboard className="h-full w-[24px]" />,
        },
        Register: {
            title: "Productos",
            href: "#",
            icon: <LuPizza className="h-full w-[24px]" />,
        },
        Pedidos: {
            title: "Pedidos",
            href: "#",
            icon: <FiShoppingBag className="h-full w-[24px]" />,
        },
        Cocina: {
            title: "Cocina",
            href: "#",
            icon: <FaKitchenSet className="h-full w-[24px]" />,
        },
        PuntoDeVenta: {
            title: "Punto de venta",
            href: "#",
            icon: <FcSalesPerformance className="h-full w-[24px]" />,
        },
        Ventas: {
            title: "Opciones de pago",
            href: "#",
            icon: <LuIdCard className="h-full w-[24px]" />,
        }
    };

    const config = {
        Profile: {
            title: "Mi perfil",
            href: '#',
            icon: <FaUser className="h-full w-[24px]" />,
        },
        Logout: {
            title: "Log-Out",
            href: "#",
            icon: <ImExit className="h-full w-[24px]" />,
            function: handleLogout,
        },
    };
    
    useEffect(() => {
        // Verificar si el token existe en el localStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            router.push('/login'); // Redirigir al login si no hay token
        }
    }, [router]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                // Verificar que el click no sea en el botón hamburguesa
                const hamburgerButton = event.target.closest('button[aria-label="Toggle menu"]');
                if (!hamburgerButton) {
                    setIsOpen(false);
                }
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <nav className="bg-[#f3f4f6] w-full fixed top-0 left-0 flex justify-between h-16 z-50 shadow-md overflow-x-hidden">
            <div className="flex w-full justify-between px-4">
                {/* Logo */}
                <div className="flex items-center cursor-pointer">
                    <GoChecklist size={36} className="text-green-600" />
                    <h2 className="text-3xl hover:text-green-600 font-bold ml-2">WapiFood</h2>
                </div>

                {/* Botón Hamburguesa */}
                <button
                    className="z-50 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    aria-label="Toggle menu"
                >
                    <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </button>

                {/* Menú */}
                <div
                    ref={menuRef}
                    className={`
                    fixed top-16 right-0 h-full bg-gray-100 z-40
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    overflow-hidden
                `}
                >
                    <ul className="flex flex-col mt-4 p-4 text-xl">
                        <p className="text-gray-500 font-bold">Menú principal</p>
                        {Object.keys(menu).map((item, index) => (
                            <li key={index} className="cursor-pointer hover:text-green-600 my-4">
                                {item === "Dashboard" || item === "Register" || item === "Pedidos" ? (
                                    <button
                                        className="flex w-auto gap-2 cursor-pointer hover:text-green-600"
                                        onClick={
                                            item === "Dashboard" ? dasboard :
                                            item === "Register" ? productos :
                                            pedidos
                                        }
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </button>
                                ) : item === "Cocina" ? (
                                    <button
                                        className="flex w-auto gap-2 cursor-pointer hover:text-green-600"
                                        onClick={cocina}
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </button>
                                ) : item === "PuntoDeVenta" ? (
                                    <button
                                        className="flex w-auto gap-2 cursor-pointer hover:text-green-600"
                                        onClick={puntoDeVenta}
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </button>
                                ) : item === "Ventas" ? (
                                    <button
                                        className="flex w-auto gap-2 cursor-pointer hover:text-green-600"
                                        onClick={payments}
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </button>
                                ) : (
                                    <a
                                        className="flex w-auto gap-2 cursor-pointer hover:text-green-600"
                                        href={menu[item].href}
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </a>
                                )}
                            </li>
                        ))}

                        <p className="text-gray-500 font-bold">Configuración</p>
                        {Object.keys(config).map((item, index) => (
                            <li key={index} className="cursor-pointer hover:text-green-600 my-4">
                                {item === "Profile" ? (
                                    <button
                                        className="flex w-auto gap-2 cursor-pointer hover:text-green-600"
                                        onClick={MiPerfil}
                                    >
                                        <span className="self-center">{config[item].icon}</span> {config[item].title}
                                    </button>
                                ) : item === "Logout" ? (
                                    <button
                                        className="flex w-auto gap-2 cursor-pointer hover:text-green-600"
                                        onClick={config[item].function}
                                    >
                                        <span className="self-center">{config[item].icon}</span> {config[item].title}
                                    </button>
                                ) : (
                                    <a
                                        className="flex w-auto gap-2 cursor-pointer hover:text-green-600"
                                        href={config[item].href}
                                    >
                                        <span className="self-center">{config[item].icon}</span> {config[item].title}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}