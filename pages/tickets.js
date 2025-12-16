import Head from 'next/head';
import Navbar from "@/dashboardComponents/navbar";
import Ticketview from "./tickets/Ticketview";

export default function Tickets() {
    return (
        <>
        <Head>
                <title>Tickets - WapiFood</title>
                <meta name="description" content="Historial y gestión de tickets de venta" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            {/* Navbar fijo */}
            <Navbar />
            
            {/* Contenido principal con animaciones y mejor diseño */}
            <main className="w-full min-h-screen flex flex-col pt-16">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Círculos decorativos */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                    <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
                    
                    {/* Líneas decorativas */}
                    <div className="absolute top-1/3 left-0 w-1 h-24 bg-gradient-to-b from-green-300 to-emerald-400 rounded-r-full opacity-40"></div>
                    <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-emerald-300 to-teal-400 rounded-l-full opacity-40"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-20 h-1 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full opacity-30"></div>
                </div>
                
                {/* Contenido principal con animación de entrada */}
                <div className="relative z-10 flex-1 animate-fade-in-up">
                    {/* Header de tickets mejorado */}
                    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800">Tickets de Venta</h1>
                                        <p className="text-gray-600 mt-1">Consulta y gestiona todos tus tickets</p>
                                    </div>
                                </div>
                                
                                {/* Indicadores rápidos */}
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">📄</div>
                                        <div className="text-xs text-gray-500">Tickets</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-emerald-600">💰</div>
                                        <div className="text-xs text-gray-500">Ventas</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-teal-600">📊</div>
                                        <div className="text-xs text-gray-500">Reportes</div>
                                    </div>
                                    {/* <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-green-700">En tiempo real</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contenido de tickets */}
                    <div className="animate-fade-in-up delay-200">
                        <Ticketview />
                    </div>
                </div>
                
                
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