import MenúDigital from "@/pages/assets/images/Menúdigital.png";
import Image from "next/image";
import { MdOutlineQrCode2, MdOutlinePhoneIphone, MdOutlineUpdate, MdOutlineColorLens } from "react-icons/md";
import { HiOutlineGlobe, HiOutlinePhotograph } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";

export default function PaginaWeb() {
    const features = [
        { icon: <MdOutlineQrCode2 size={24} />, title: "Link para compartir", description: "Comparte tu menú con todo el mundo" },
        { icon: <MdOutlinePhoneIphone size={24} />, title: "Sin descargas", description: "Funciona directo en el navegador" },
        { icon: <MdOutlineUpdate size={24} />, title: "Actualización instantánea", description: "Cambios reflejados al momento" },
        { icon: <HiOutlinePhotograph size={24} />, title: "Fotos de productos", description: "Muestra imágenes de tus platillos" },
        { icon: <MdOutlineColorLens size={24} />, title: "Tu identidad", description: "Personaliza con tu logo y colores" },
        { icon: <HiOutlineGlobe size={24} />, title: "Siempre disponible", description: "Accesible 24/7 desde cualquier lugar" },
    ];

    return (
        <main className="bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 min-h-screen flex items-center justify-center py-16">
            <section className="flex flex-col md:flex-row items-center justify-center w-full px-4 md:gap-16 md:px-16 max-w-7xl mx-auto" id='menudigital'>
                {/* Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-start mb-10 md:mb-0">
                    <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                        📱 Menú Digital
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 drop-shadow-lg mb-4 leading-tight">
                        Tu menú digital <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">automáticamente</span>
                    </h2>
                    <p className="text-green-700 text-lg md:text-xl mb-6 font-medium max-w-lg">
                        Solo agrega tus productos y categorías. WapiFood genera automáticamente un menú digital profesional que tus clientes pueden ver desde cualquier celular.
                    </p>
                    
                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-green-100">
                                <div className="text-emerald-600 mt-1">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm">{feature.title}</h4>
                                    <p className="text-gray-600 text-xs">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="flex items-center gap-2 text-green-700 text-sm">
                            <FaCheck className="text-emerald-500" size={14} />
                            <span>Incluido en todos los planes</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-700 text-sm">
                            <FaCheck className="text-emerald-500" size={14} />
                            <span>Sin límite de productos</span>
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-300/30 rounded-full blur-2xl"></div>
                    
                    <Image 
                        src={MenúDigital} 
                        className="hidden md:block shadow-2xl rounded-2xl border-4 border-green-200 md:max-w-[450px] lg:max-w-[550px] transition-all duration-300 hover:scale-105 relative z-10"
                        alt="Menú Digital WapiFood - Vista en celular"
                        priority
                    />
                    <Image 
                        src={MenúDigital}
                        className="block md:hidden h-[350px] w-[90vw] max-w-[375px] shadow-2xl rounded-2xl border-4 border-emerald-200 transition-all duration-300 hover:scale-105"
                        alt="Menú Digital WapiFood - Vista móvil"
                        priority
                    />
                    
                    {/* Floating badge */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-green-100 z-20">
                        <span className="text-green-700 font-semibold text-sm">🎨 Elige alguno de nuestros diseños para tu menú digital</span>
                    </div>
                </div>
            </section>
        </main>
    )
}
