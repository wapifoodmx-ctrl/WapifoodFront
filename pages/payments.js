import Head from "next/head";
import Navbar from "@/dashboardComponents/navbar";
import PlanDeVentas from "@/planesdeventa/planesdeventa";

export default function Payments() {
    return (
        <>
        <Head>
                <title>Payments
                     - WapiFood</title>
                <meta name="description" content="Vista de cocina para gestionar órdenes en tiempo real" />
            </Head>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 overflow-x-hidden">
            {/* Navbar fijo */}
            <Navbar />
            
            {/* Contenido principal con animaciones y mejor diseño */}
            <main className="w-full min-h-screen flex flex-col pt-20 md:pt-16">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Círculos decorativos */}
                    <div className="absolute top-20 left-4 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                    <div className="absolute top-40 right-4 sm:right-20 w-32 h-32 sm:w-40 sm:h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-32 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                    <div className="absolute bottom-20 right-4 sm:right-10 w-28 h-28 sm:w-36 sm:h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
                    
                    {/* Líneas decorativas */}
                    <div className="absolute top-1/3 left-0 w-1 h-20 sm:h-24 bg-gradient-to-b from-green-300 to-emerald-400 rounded-r-full opacity-40"></div>
                    <div className="absolute top-1/2 right-0 w-1 h-24 sm:h-32 bg-gradient-to-b from-emerald-300 to-teal-400 rounded-l-full opacity-40"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-16 sm:w-20 h-1 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full opacity-30"></div>
                </div>
                
                {/* Contenido principal con animación de entrada */}
                <div className="relative z-10 flex-1 animate-fade-in-up">
                    {/* Header de pagos y suscripciones */}
                    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Planes y Pagos</h1>
                                        <p className="text-sm sm:text-base text-gray-600 mt-1">Elige el plan perfecto para tu negocio</p>
                                    </div>
                                </div>
                                
                                {/* Indicadores de beneficios */}
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-green-600">💰</div>
                                        <div className="text-xs text-gray-500">Precios</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-blue-600">📈</div>
                                        <div className="text-xs text-gray-500">Crecimiento</div>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-orange-600">🚀</div>
                                        <div className="text-xs text-gray-500">Escalable</div>
                                    </div>
                                 
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contenido de los planes */}
                    <div className="animate-fade-in-up delay-200">
                        <PlanDeVentas />
                    </div>
                </div>
                
                {/* Footer informativo */}
               
            </main>

            {/* Estilos CSS personalizados */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }

                .delay-200 {
                    animation-delay: 200ms;
                }

                .delay-300 {
                    animation-delay: 300ms;
                }

                .delay-500 {
                    animation-delay: 500ms;
                }

                .delay-1000 {
                    animation-delay: 1000ms;
                }

                .delay-1500 {
                    animation-delay: 1500ms;
                }

                .delay-150 {
                    animation-delay: 150ms;
                }
            `}</style>
        </div>
        </>
    );
}