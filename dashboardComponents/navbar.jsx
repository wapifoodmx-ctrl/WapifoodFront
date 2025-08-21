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
// import { GiGasStove } from "react-icons/gi"; // Ya no necesitamos este ícono
import { checkPayment } from '../useCases/checkPayment';

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [subscriptionLoading, setSubscriptionLoading] = useState(true);
    const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
    const [switchEnabled, setSwitchEnabled] = useState(false); // Estado para el switch
    // Nuevos estados para el modal de expiración
    const [showExpirationModal, setShowExpirationModal] = useState(false);
    const [daysUntilExpiration, setDaysUntilExpiration] = useState(0);
    const menuRef = useRef(null);

    // Función para calcular días entre dos fechas
    const calculateDaysDifference = (date1, date2) => {
        const oneDay = 24 * 60 * 60 * 1000; // horas*minutos*segundos*milisegundos
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        return Math.round((secondDate - firstDate) / oneDay);
    };

    // Función para verificar si debe mostrar el modal de expiración
    const checkExpirationWarning = (subscriptionData) => {
        if (!subscriptionData?.payment?.subscription_end_date) return;

        const currentTime = new Date();
        const subscriptionEndDate = new Date(subscriptionData.payment.subscription_end_date);
        const daysRemaining = calculateDaysDifference(currentTime, subscriptionEndDate);

        // Solo mostrar si faltan 5 días o menos y la suscripción aún está activa
        if (daysRemaining <= 5 && daysRemaining > 0) {
            const lastShownKey = 'lastExpirationWarningShown';
            const lastShown = localStorage.getItem(lastShownKey);
            const today = new Date().toDateString();

            // Solo mostrar una vez por día
            if (lastShown !== today) {
                setDaysUntilExpiration(daysRemaining);
                setShowExpirationModal(true);
                localStorage.setItem(lastShownKey, today);
            }
        }
    };

    // Función para cerrar el modal de expiración
    const handleAcceptExpirationWarning = () => {
        setShowExpirationModal(false);
    };

    const handleLogout = () => {
        // Limpiar elementos específicos del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('numeroMesa');
        localStorage.removeItem('carrito1');
        localStorage.removeItem('historialPedidos1');
        localStorage.removeItem('ordenActiva1');
        localStorage.removeItem('productosCanceladosSnapshot1');
        localStorage.removeItem('cocinaSwitch');
        localStorage.removeItem('tickets');
        localStorage.removeItem('lastMesasResponse');
        localStorage.removeItem('carrito');
        localStorage.removeItem('historialPedidos');
        localStorage.removeItem('pedidosPendientes');
        localStorage.removeItem('lastExpirationWarningShown'); // Limpiar también esto
        
        // Limpiar elementos específicos del sessionStorage
        sessionStorage.removeItem('token');
        
        // Redirigir al login
        router.push("/login");
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
            
            // Verificar si debe mostrar advertencia de expiración
            checkExpirationWarning(response);
            
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

        // Configurar verificación cada 24 horas
        const checkInterval = setInterval(() => {
            checkSubscriptionStatus();
        }, 24 * 60 * 60 * 1000); // 24 horas en milisegundos

        return () => clearInterval(checkInterval);
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

    // Verificar si estamos en la página del punto de venta
    const isPointOfSalePage = router.pathname === '/puntodeventa';

    return (
        <>
            <nav className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 w-full fixed top-0 left-0 flex justify-between h-16 z-50 shadow-xl overflow-x-hidden border-b border-green-200">
                <div className="flex w-full justify-between px-4">
                    <div className="flex items-center cursor-pointer">
                        <h2 className="text-3xl font-bold ml-2 bg-gradient-to-r from-yellow-300 via-green-100 to-white bg-clip-text text-transparent hover:text-green-200 transition-colors duration-200">WapiFood</h2>
                    </div>

                    {/* Container para el botón de power y el menú hamburguesa */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Botón de power para cocina - SOLO mostrar en punto de venta - MÁS GRANDE */}
                        {isPointOfSalePage && (
                            <button
                                onClick={handleSwitchToggle}
                                className={`
                                    relative flex items-center justify-center gap-2 
                                    px-3 py-2 md:px-6 md:py-3
                                    rounded-full transition-all duration-300 ease-in-out
                                    hover:scale-105 active:scale-95 shadow-xl
                                    min-w-[60px] md:min-w-[100px]
                                    border-2 border-white
                                    ${switchEnabled 
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                                    }
                                `}
                                title={switchEnabled ? 'Cocina Encendida - Click para apagar' : 'Cocina Apagada - Click para encender'}
                            >
                                <FaKitchenSet 
                                    className={`
                                        w-5 h-5 md:w-7 md:h-7 
                                        transition-all duration-300
                                        ${switchEnabled 
                                            ? 'text-yellow-300 drop-shadow-lg' 
                                            : 'text-gray-200'
                                        }
                                    `} 
                                />
                                <span className="hidden md:block text-base font-semibold">
                                    {switchEnabled ? 'ON' : 'OFF'}
                                </span>
                                <div 
                                    className={`
                                        absolute -top-1 -right-1 w-3 h-3 md:hidden
                                        rounded-full transition-all duration-300
                                        border-2 border-white
                                        ${switchEnabled 
                                            ? 'bg-yellow-400 shadow-lg' 
                                            : 'bg-red-500'
                                        }
                                    `}
                                />
                                {switchEnabled && (
                                    <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-pulse" />
                                )}
                            </button>
                        )}

                        {/* Menú hamburguesa */}
                        <button
                            className="z-50 cursor-pointer bg-white/20 rounded-full p-2 shadow-lg border border-green-200 hover:bg-white/40 transition-all duration-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                            }}
                            aria-label="Toggle menu"
                        >
                            <div className={`w-6 h-0.5 bg-white mb-1.5 rounded transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                            <div className={`w-6 h-0.5 bg-white mb-1.5 rounded transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                            <div className={`w-6 h-0.5 bg-white rounded transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                        </button>
                    </div>

                    <div
                        ref={menuRef}
                        className={`
                        fixed top-16 right-0 h-full w-72 bg-gradient-to-br from-green-50 via-white to-emerald-50 z-40
                        transition-transform duration-300 ease-in-out
                        ${isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
                        overflow-y-auto overflow-x-hidden border-l-4 border-green-200 rounded-l-3xl
                    `}
                    >
                        <div className="min-h-full">
                            <ul className="flex flex-col mt-4 p-4 text-xl pb-8">
                                <p className="text-green-700 font-bold mb-2">Menú principal</p>
                                {Object.keys(menu).map((item, index) => (
                                    <li key={index} className="cursor-pointer my-4">
                                        {item === "Dashboard" ? (
                                            <button
                                                className={getMenuItemClasses(item) + "from-green-100 to-emerald-100 rounded-xl px-4 py-2 hover:scale-105 transition-all duration-200"}
                                                onClick={dasboard}
                                            >
                                                <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                            </button>
                                        ) : item === "Register" ? (
                                            <button
                                                className={getMenuItemClasses(item) + "from-green-100 to-emerald-100 rounded-xl px-4 py-2 hover:scale-105 transition-all duration-200"}
                                                onClick={productos}
                                            >
                                                <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                            </button>
                                        ) : item === "Tickets" ? (
                                            <button
                                                className={getMenuItemClasses(item) + "from-green-100 to-emerald-100 rounded-xl px-4 py-2 hover:scale-105 transition-all duration-200"}
                                                onClick={() => handleRestrictedClick(tickets)}
                                            >
                                                <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                            </button>
                                        ) : item === "Cocina" ? (
                                            <button
                                                className={getMenuItemClasses(item) + "from-green-100 to-emerald-100 rounded-xl px-4 py-2 hover:scale-105 transition-all duration-200"}
                                                onClick={handleCocinaClick}
                                            >
                                                <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                            </button>
                                        ) : item === "PuntoDeVenta" ? (
                                            <button
                                                className={getMenuItemClasses(item) + "from-green-100 to-emerald-100 rounded-xl px-4 py-2 hover:scale-105 transition-all duration-200"}
                                                onClick={() => handleRestrictedClick(puntoDeVenta)}
                                            >
                                                <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                            </button>
                                        ) : item === "Ventas" ? (
                                            <button
                                                className={getMenuItemClasses(item) + "from-green-100 to-emerald-100 rounded-xl px-4 py-2 hover:scale-105 transition-all duration-200"}
                                                onClick={payments}
                                            >
                                                <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                            </button>
                                        ) : (
                                            <a
                                                className={getMenuItemClasses(item) + "from-green-100 to-emerald-100 rounded-xl px-4 py-2 hover:scale-105 transition-all duration-200"}
                                                href={menu[item].href}
                                            >
                                                <span className="self-center">{menu[item].icon}</span> {menu[item].title}
                                            </a>
                                        )}
                                    </li>
                                ))}

                                <p className="text-green-700 font-bold mt-6">Configuración</p>
                                {Object.keys(config).map((item, index) => (
                                    <li key={index} className="cursor-pointer my-4">
                                        {item === "Profile" ? (
                                            <button
                                                className="flex w-auto gap-2 cursor-pointer from-green-100 to-emerald-100 rounded-xl px-4 py-2 hover:text-green-600 hover:scale-105 transition-all duration-200"
                                                onClick={MiPerfil}
                                            >
                                                <span className="self-center">{config[item].icon}</span> {config[item].title}
                                            </button>
                                        ) : item === "Logout" ? (
                                            <button
                                                className="flex w-auto gap-2 cursor-pointer from-green-100 to-emerald-100 rounded-xl px-4 py-2  hover:text-green-600 hover:scale-105 transition-all duration-200"
                                                onClick={config[item].function}
                                            >
                                                <span className="self-center">{config[item].icon}</span> {config[item].title}
                                            </button>
                                        ) : (
                                            <a
                                                className="flex w-auto gap-2 cursor-pointer bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl px-4 py-2 shadow hover:text-green-600 hover:scale-105 transition-all duration-200"
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
                </div>

                {/* Popup de suscripción requerida */}
                {showSubscriptionPopup && (
                    <div className="fixed top-20 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl z-50 animate-fade-in border-2 border-white">
                        <div className="flex items-center">
                            <span className="text-sm font-semibold">
                                Algunas funciones requieren suscripción activa
                            </span>
                            <button
                                onClick={() => setShowSubscriptionPopup(false)}
                                className="ml-3 text-white hover:text-yellow-300 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Modal de Advertencia de Expiración */}
            {showExpirationModal && (
                <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl border-4 border-orange-400">
                        <div className="text-center">
                            {/* Icono de advertencia */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                                <svg 
                                    className="h-8 w-8 text-orange-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            
                            {/* Título */}
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                ¡Recordatorio de Suscripción!
                            </h3>
                            
                            {/* Mensaje */}
                            <p className="text-gray-600 mb-6 text-lg">
                                ¡Recuerda que tu suscripción vence en <span className="font-bold text-orange-600">{daysUntilExpiration}</span> días!
                            </p>
                            
                            {/* Botón de aceptar */}
                            <button
                                onClick={handleAcceptExpirationWarning}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}