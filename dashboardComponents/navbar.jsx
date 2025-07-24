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
import { checkPayment } from '../useCases/checkPayment';

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [subscriptionLoading, setSubscriptionLoading] = useState(true);
    const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
    const [switchEnabled, setSwitchEnabled] = useState(false); // Estado para el switch
    const menuRef = useRef(null);

    const handleLogout = () => {
        router.push("/login");
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    };

    const dasboard = () => router.push('/dashboard');
    const productos = () => router.push('/menu');
    const tickets = () => router.push('/tickets');
    const MiPerfil = () => router.push('/user');
    const payments = () => router.push('/payments');
    const puntoDeVenta = () => router.push('/puntodeventa');
    const cocina = () => router.push('/cocina');

    const checkSubscriptionStatus = async () => {
        try {
            setSubscriptionLoading(true);
            const response = await checkPayment();
            setHasActiveSubscription(response.has_active_subscription || false);
        } catch (error) {
            console.error('Error al verificar suscripción:', error);
            setHasActiveSubscription(false);
        } finally {
            setSubscriptionLoading(false);
        }
    };

    // Función para manejar clicks en elementos que requieren suscripción
    const handleRestrictedClick = (originalFunction) => {
        if (hasActiveSubscription) {
            originalFunction();
        } else {
            setShowSubscriptionPopup(true);
            // Auto-cerrar el popup después de 3 segundos
            setTimeout(() => {
                setShowSubscriptionPopup(false);
            }, 3000);
        }
    };

    // Función para manejar el cambio del switch
    const handleSwitchToggle = () => {
        const newState = !switchEnabled;
        setSwitchEnabled(newState);
        // Guardar en localStorage
        localStorage.setItem('cocinaSwitch', JSON.stringify(newState));
    };

    const menu = {
        Dashboard: {
            title: "Dashboard",
            href: '/dashboard',
            icon: <MdSpaceDashboard className="h-full w-[24px]" />,
            alwaysShow: true,
        },
        Register: {
            title: "Productos",
            href: "#",
            icon: <LuPizza className="h-full w-[24px]" />,
            alwaysShow: true,
        },
        Tickets: {
            title: "Tickets",
            href: "#",
            icon: <FiShoppingBag className="h-full w-[24px]" />,
            requiresSubscription: true,
        },
        Cocina: {
            title: "Cocina",
            href: "#",
            icon: <FaKitchenSet className="h-full w-[24px]" />,
            requiresSubscription: true,
        },
        PuntoDeVenta: {
            title: "Punto de venta",
            href: "#",
            icon: <FcSalesPerformance className="h-full w-[24px]" />,
            requiresSubscription: true,
        },
        Ventas: {
            title: "Opciones de pago",
            href: "#",
            icon: <LuIdCard className="h-full w-[24px]" />,
            alwaysShow: true,
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
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            checkSubscriptionStatus();
        }

        // Recuperar el estado del switch desde localStorage
        const savedSwitchState = localStorage.getItem('cocinaSwitch');
        if (savedSwitchState !== null) {
            setSwitchEnabled(JSON.parse(savedSwitchState));
        }
    }, [router]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
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

    // Función para obtener las clases CSS según el estado de suscripción
    const getMenuItemClasses = (item) => {
        if (menu[item].requiresSubscription && !hasActiveSubscription) {
            return "flex w-auto gap-2 cursor-pointer text-gray-400 opacity-50";
        }
        return "flex w-auto gap-2 cursor-pointer hover:text-green-600";
    };

    // Función para manejar el click en cocina
    const handleCocinaClick = () => {
        // Usar la función normal de restricción por suscripción
        handleRestrictedClick(cocina);
    };

    return (
        <nav className="bg-[#f3f4f6] w-full fixed top-0 left-0 flex justify-between h-16 z-50 shadow-md overflow-x-hidden">
            <div className="flex w-full justify-between px-4">
                <div className="flex items-center cursor-pointer">
                    <GoChecklist size={36} className="text-green-600" />
                    <h2 className="text-3xl hover:text-green-600 font-bold ml-2">WapiFood</h2>
                </div>

                {/* Container para el switch y el menú hamburguesa */}
                <div className="flex items-center gap-4">
                    {/* Switch personalizado con texto */}
                    <div 
                        className={`
                            relative w-40 h-8 rounded-full cursor-pointer transition-colors duration-300 flex items-center justify-center
                            ${switchEnabled ? 'bg-green-600' : 'bg-gray-400'}
                        `}
                        onClick={handleSwitchToggle}
                    >
                        {/* Texto dentro del switch */}
                        <span className="text-white text-sm font-medium z-10">
                            {switchEnabled ? 'Cocina On' : 'Cocina Off'}
                        </span>
                        
                        {/* Círculo deslizante */}
                        <div 
                            className={`
                                absolute w-7 h-7 bg-white rounded-full shadow-md 
                                transition-transform duration-300 ease-in-out
                                ${switchEnabled ? 'translate-x-14' : '-translate-x-14'}
                            `}
                        />
                    </div>

                    {/* Menú hamburguesa */}
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
                </div>

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
                            <li key={index} className="cursor-pointer my-4">
                                {item === "Dashboard" ? (
                                    <button
                                        className={getMenuItemClasses(item)}
                                        onClick={dasboard}
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </button>
                                ) : item === "Register" ? (
                                    <button
                                        className={getMenuItemClasses(item)}
                                        onClick={productos}
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </button>
                                ) : item === "Tickets" ? (
                                    <button
                                        className={getMenuItemClasses(item)}
                                        onClick={() => handleRestrictedClick(tickets)}
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </button>
                                ) : item === "Cocina" ? (
                                    <button
                                        className={getMenuItemClasses(item)}
                                        onClick={handleCocinaClick}
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </button>
                                ) : item === "PuntoDeVenta" ? (
                                    <button
                                        className={getMenuItemClasses(item)}
                                        onClick={() => handleRestrictedClick(puntoDeVenta)}
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </button>
                                ) : item === "Ventas" ? (
                                    <button
                                        className={getMenuItemClasses(item)}
                                        onClick={payments}
                                    >
                                        <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                    </button>
                                ) : (
                                    <a
                                        className={getMenuItemClasses(item)}
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

            {/* Popup de suscripción requerida */}
            {showSubscriptionPopup && (
                <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
                    <div className="flex items-center">
                        <span className="text-sm font-medium">
                            Algunas funciones requieren suscripción activa
                        </span>
                        <button
                            onClick={() => setShowSubscriptionPopup(false)}
                            className="ml-3 text-white hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}