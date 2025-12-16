import ticketApp3 from "@/pages/assets/images/ticketApp3.jpeg";
import ticketApp2 from "@/pages/assets/images/ticketApp2.jpeg";
import ticketApp1 from "@/pages/assets/images/ticketApp1.jpeg";
import Ticket from "@/pages/assets/images/Ticket.png";
import Image from "next/image";

export default function AppTickets() {
    return (
        <main className="bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 min-h-screen flex items-center justify-center">
            <section className="flex flex-col lg:flex-row items-center justify-center w-full px-4 lg:gap-10 lg:px-16 py-10 lg:py-0 min-h-[80vh]" id='main'>
                <div className="flex flex-col items-center justify-center w-full lg:w-auto">
                    {/* Versión para pantallas grandes - 3 imágenes en fila */}
                    <div className="hidden lg:flex gap-6 items-center justify-center">
                        <Image 
                            src={ticketApp1} 
                            className="h-auto w-full max-w-[220px] xl:max-w-[250px] shadow-2xl rounded-2xl border-4 border-green-200 transition-all duration-300 hover:scale-105"
                            alt="Sistema de Tickets WapiFood"
                            priority
                        />
                        <Image 
                            src={ticketApp2} 
                            className="h-auto w-full max-w-[220px] xl:max-w-[250px] shadow-2xl rounded-2xl border-4 border-green-200 transition-all duration-300 hover:scale-105"
                            alt="Gestión de Pedidos WapiFood"
                            priority
                        />
                        <Image 
                            src={ticketApp3} 
                            className="h-auto w-full max-w-[220px] xl:max-w-[250px] shadow-2xl rounded-2xl border-4 border-green-200 transition-all duration-300 hover:scale-105"
                            alt="Dashboard WapiFood"
                            priority
                        />
                    </div>
                    
                    {/* Carrusel para pantallas medianas y pequeñas */}
                    <div className="flex lg:hidden w-full max-w-sm sm:max-w-md md:max-w-lg">
                        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2">
                            <div className="flex-shrink-0 snap-center">
                                <Image 
                                    src={ticketApp1}
                                    className="h-auto w-[240px] sm:w-[280px] md:w-[320px] shadow-xl rounded-xl border-3 border-emerald-200 transition-all duration-300"
                                    alt="Sistema de Tickets WapiFood"
                                    priority
                                />
                            </div>
                            <div className="flex-shrink-0 snap-center">
                                <Image 
                                    src={ticketApp2}
                                    className="h-auto w-[240px] sm:w-[280px] md:w-[320px] shadow-xl rounded-xl border-3 border-emerald-200 transition-all duration-300"
                                    alt="Gestión de Pedidos WapiFood"
                                    priority
                                />
                            </div>
                            <div className="flex-shrink-0 snap-center">
                                <Image 
                                    src={ticketApp3}
                                    className="h-auto w-[240px] sm:w-[280px] md:w-[320px] shadow-xl rounded-xl border-3 border-emerald-200 transition-all duration-300"
                                    alt="Dashboard WapiFood"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Indicadores de carrusel para pantallas pequeñas */}
                    <div className="flex lg:hidden gap-2 mt-4">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-200"></div>
                        <div className="w-2 h-2 rounded-full bg-green-200"></div>
                    </div>
                </div>
                
                <div className="w-full lg:w-2/3 flex flex-col justify-center items-center mt-8 lg:mt-0">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center font-extrabold text-green-800 drop-shadow-lg mb-4 max-w-xl leading-tight bg-gradient-to-r bg-clip-text">
                        Sistema completo de gestión para tu restaurante
                    </h2>
                    <p className="text-center text-green-700 text-base sm:text-lg lg:text-xl mt-2 mb-4 font-medium max-w-lg px-4">
                        Tickets digitales, gestión de cocina, menú para clientes, control de meseros y mucho más. Todo integrado en una sola plataforma web.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 w-full max-w-md my-6">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-green-200">
                            <span className="text-green-600">✓</span>
                            <span className="text-green-800 font-medium">Tickets digitales</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-green-200">
                            <span className="text-green-600">✓</span>
                            <span className="text-green-800 font-medium">Vista de cocina</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-green-200">
                            <span className="text-green-600">✓</span>
                            <span className="text-green-800 font-medium">Menú del cliente</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-green-200">
                            <span className="text-green-600">✓</span>
                            <span className="text-green-800 font-medium">Portal de meseros</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-green-200">
                            <span className="text-green-600">✓</span>
                            <span className="text-green-800 font-medium">Punto de venta</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-green-200">
                            <span className="text-green-600">✓</span>
                            <span className="text-green-800 font-medium">Dashboard analytics</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
