import Head from 'next/head';
import UserPage from "@/user/userpage";

export default function User() {
    return (
        <>
        <Head>
                <title>Usuario - WapiFood</title>
                <meta name="description" content="Vista de cocina para gestionar órdenes en tiempo real" />
            </Head>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
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
            <main className="relative z-10 min-h-screen flex flex-col animate-fade-in-up">
                {/* Header de perfil de usuario */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm pt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">Perfil de Usuario</h1>
                                    <p className="text-gray-600 mt-1">Gestiona tu información personal y configuraciones</p>
                                </div>
                            </div>
                            
                            {/* Indicadores rápidos */}
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">👤</div>
                                    <div className="text-xs text-gray-500">Perfil</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-600">⚙️</div>
                                    <div className="text-xs text-gray-500">Configuración</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-500">📊</div>
                                    <div className="text-xs text-gray-500">Actividad</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido del perfil de usuario */}
                <div className="flex-1 animate-fade-in-up delay-200">
                    <UserPage />
                </div>

                {/* Footer informativo */}
                <footer className="relative z-10 bg-white/60 backdrop-blur-sm border-t border-gray-100 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Gestión de Usuario - WapiFood</span>
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
        </>
    );
}