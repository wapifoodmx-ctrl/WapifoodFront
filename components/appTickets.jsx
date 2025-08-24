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
                            alt="Ticket App 1"
                            priority
                        />
                        <Image 
                            src={ticketApp2} 
                            className="h-auto w-full max-w-[220px] xl:max-w-[250px] shadow-2xl rounded-2xl border-4 border-green-200 transition-all duration-300 hover:scale-105"
                            alt="Ticket App 2"
                            priority
                        />
                        <Image 
                            src={ticketApp3} 
                            className="h-auto w-full max-w-[220px] xl:max-w-[250px] shadow-2xl rounded-2xl border-4 border-green-200 transition-all duration-300 hover:scale-105"
                            alt="Ticket App 3"
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
                                    alt="Ticket App 1"
                                    priority
                                />
                            </div>
                            <div className="flex-shrink-0 snap-center">
                                <Image 
                                    src={ticketApp2}
                                    className="h-auto w-[240px] sm:w-[280px] md:w-[320px] shadow-xl rounded-xl border-3 border-emerald-200 transition-all duration-300"
                                    alt="Ticket App 2"
                                    priority
                                />
                            </div>
                            <div className="flex-shrink-0 snap-center">
                                <Image 
                                    src={ticketApp3}
                                    className="h-auto w-[240px] sm:w-[280px] md:w-[320px] shadow-xl rounded-xl border-3 border-emerald-200 transition-all duration-300"
                                    alt="Ticket App 3"
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
                        Obtén nuestra app de tickets para potenciar tu negocio
                    </h2>
                    <p className="text-center text-green-700 text-base sm:text-lg lg:text-xl mt-2 mb-4 font-medium max-w-lg px-4">
                        Contrata un paquete con impresora y obtén nuestra app de tickets para completar la experiencia con tus clientes.
                    </p>
                    <div className="flex flex-col gap-6 w-full max-w-md my-6">
                        {/* <a
                            href="https://play.google.com/store/apps/details?id=tuapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold shadow-lg p-3 w-full text-2xl hover:scale-105 hover:from-green-500 hover:to-emerald-500 transition-all duration-200 border-2 border-green-300 text-center"
                        >
                            Descargar en Play Store
                        </a> */}
                    </div>
                </div>
            </section>
        </main>
    )
}
