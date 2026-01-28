import Image from 'next/image'
import { useRouter } from 'next/router'
import Menu from '@/pages/assets/img/menu.png'
import Menuuwu from '@/pages/assets/img/Menuuwu.png'
import Menu2 from '@/pages/assets/images/Menu2.png'
import { HiOutlineSparkles, HiOutlineChartBar, HiOutlineClipboardList } from "react-icons/hi"
import { MdOutlineRestaurantMenu, MdOutlinePointOfSale, MdScreenShare, MdComputer } from "react-icons/md"
import { FaUserTie } from "react-icons/fa"

export default function Main() {
    const router = useRouter();

    const handleStartClick = () => {
        router.push('#registro');
    };

    const handleHowItWorksClick = () => {
        router.push('/login');
    };
    const handleClientMenuClick = () => {
        router.push('/clientmenu');
    }

    const handleMeseroMenuClick = () => {
        router.push('/meseroMenu');
    }

    const highlights = [
        { icon: <MdOutlineRestaurantMenu size={20} />, text: "Menú digital" },
        { icon: <MdOutlinePointOfSale size={20} />, text: "Punto de venta" },
        { icon: <HiOutlineChartBar size={20} />, text: "Analytics" },
    ];

    return (
        <main className="bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-green-300/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-300/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-300/20 rounded-full blur-2xl"></div>
            
            <section className="flex flex-col lg:flex-row items-center justify-center w-full px-4 lg:gap-10 lg:px-16 py-10 lg:py-0 min-h-[80vh] relative z-10 max-w-7xl mx-auto" id='main'>
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start pt-6">
                    {/* Badge */}
                    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-md mb-6 border border-green-200">
                        <HiOutlineSparkles className="text-emerald-500" size={18} />
                        <span className="text-green-700 font-semibold text-sm">La plataforma #1 para restaurantes</span>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-center lg:text-left font-extrabold text-green-800 drop-shadow-lg mb-4 max-w-2xl leading-tight">
                        Todo lo que tu restaurante necesita en <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">un solo lugar</span>
                    </h1>
                    <p className="text-center lg:text-left text-green-700 text-base sm:text-lg lg:text-xl mt-2 mb-6 font-medium max-w-xl">
                        WapiFood integra menú digital, punto de venta, cocina, gestión de meseros, inventarios, recetas y analytics. <strong>Todo sincronizado.</strong>
                    </p>
                    
                    {/* Highlights */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                        {highlights.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-green-100">
                                <span className="text-emerald-600">{item.icon}</span>
                                <span className="text-green-700 text-sm font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg my-4">
                        <button 
                            className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg shadow-green-500/30 p-4 text-lg sm:text-xl hover:scale-105 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 border-2 border-green-400"
                            onClick={handleStartClick}
                        >
                            🚀 Comenzar gratis
                        </button>
                        <button 
                            className="flex-1 rounded-xl bg-white/80 backdrop-blur-sm text-green-700 font-bold shadow-lg p-4 text-lg sm:text-xl hover:scale-105 hover:bg-white transition-all duration-200 border-2 border-green-200"
                            onClick={handleHowItWorksClick}
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mt-2">
                        <button 
                            className="flex-1 rounded-xl bg-gradient-to-r from-green-100 to-emerald-50 text-green-700 font-semibold shadow-md p-3 text-base sm:text-lg hover:scale-105 hover:bg-green-50 transition-all duration-200 border border-green-200 flex items-center justify-center gap-2"
                            onClick={handleClientMenuClick}
                        >
                            <MdOutlineRestaurantMenu size={22} />
                            Menú Cliente
                        </button>
                        <button 
                            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-md shadow-emerald-500/20 p-3 text-base sm:text-lg hover:scale-105 hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 border border-emerald-400 flex items-center justify-center gap-2"
                            onClick={handleMeseroMenuClick}
                        >
                            <FaUserTie size={18} />
                            Menú Mesero
                        </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mt-2">
                        <button 
                            className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-md shadow-green-500/20 p-3 text-base sm:text-lg hover:scale-105 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 border border-green-400 flex items-center justify-center gap-2"
                            onClick={() => router.push('/pantallasExternal')}
                        >
                            <MdScreenShare size={22} />
                            Pantallas
                        </button>
                        <button 
                            className="flex-1 rounded-xl bg-gradient-to-r from-white to-green-50 text-green-700 font-semibold shadow-md p-3 text-base sm:text-lg hover:scale-105 hover:bg-green-100 transition-all duration-200 border-2 border-green-300 flex items-center justify-center gap-2"
                            onClick={() => router.push('/kiosko')}
                        >
                            <MdComputer size={22} />
                            Kiosko
                        </button>
                    </div>
                    
                    
                    {/* Trust indicators */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-8 text-green-600 text-sm pb-4">
                        <div className="flex items-center gap-1">
                            <span className="text-emerald-500">✓</span>
                            <span>Sin comisiones</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-emerald-500">✓</span>
                            <span>Actualiza tu restaurante</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-emerald-500">✓</span>
                            <span>Fácil de usar</span>
                        </div>
                    </div>
                </div>
                
                {/* Image Container - Optimizado para todas las pantallas */}
                <div className="w-full lg:w-1/2 flex items-center justify-center mt-10 lg:mt-0">
                    {/* Desktop & Tablet */}
                    <div className="hidden md:block relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                        <Image 
                            src={Menu2} 
                            alt="WapiFood Dashboard - Gestión completa de restaurante"
                            className="w-full h-auto shadow-2xl rounded-2xl border-4 border-green-200 transition-all duration-300 hover:scale-105"
                            priority
                        />
                    </div>
                    
                    {/* Mobile */}
                    <div className="block md:hidden relative w-full max-w-sm">
                        <Image 
                            src={Menuuwu}
                            alt="WapiFood App Móvil"
                            className="w-full h-auto shadow-2xl rounded-2xl border-4 border-emerald-200 transition-all duration-300 hover:scale-105"
                            priority
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}
