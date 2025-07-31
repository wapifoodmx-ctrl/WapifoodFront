import IdPedidos from './idpedidos';
import Navbar from './navbar';
import MainContentDasboard from './mainContentDasboard';
import Pedidos from './pedidos';
import Ventas from './ventas';

export default function Dashboard2() {
    return (
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
                    {/* Header del dashboard mejorado */}
                    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                                        <p className="text-gray-600 mt-1">Gestiona tu negocio de manera inteligente</p>
                                    </div>
                                </div>
                                
                                {/* Indicadores rápidos */}
                                <div className="flex items-center gap-4">
                                   
                                    <div className="text-sm text-gray-500">
                                        {new Date().toLocaleDateString('es-ES', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contenido principal con contenedor mejorado */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="animate-fade-in-up delay-200">
                            <MainContentDasboard />
                        </div>
                    </div>
                </div>
                
                {/* Footer del dashboard */}
                <footer className="relative  bg-white/60 backdrop-blur-sm border-t border-gray-100 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>WapiFood Dashboard</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-150"></div>
                                    <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse delay-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
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
    );
}