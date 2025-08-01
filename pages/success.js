import Navbar from "@/dashboardComponents/navbar";
import { HiCheckCircle } from "react-icons/hi2";

export default function Success() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 relative">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
            </div>
            <section className="min-h-screen flex flex-col w-full mt-16 relative z-10">
                <Navbar />
                <div className="flex flex-col items-center justify-center flex-grow text-center p-8">
                    {/* Icono de éxito */}
                    <div className="relative mb-8">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-xl">
                            <HiCheckCircle className="text-6xl text-green-500 animate-pulse" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl mx-auto border border-gray-100">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                ¡Pago satisfactorio!
                            </span>
                        </h1>
                        <div className="space-y-4 mb-8">
                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                                Muchas gracias por tu preferencia y apoyo. Tu transacción ha sido completada con éxito.
                            </p>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos.
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="w-full py-4 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 mb-2">
                            ¿Necesitas ayuda?
                        </p>
                        <p className="text-green-600 font-medium">
                            Contáctanos y te ayudaremos con cualquier duda
                        </p>
                    </div>
                </div>
            </section>
            {/* Estilos CSS personalizados */}
            <style jsx>{`
                .delay-500 {
                    animation-delay: 500ms;
                }
                .delay-1000 {
                    animation-delay: 1000ms;
                }
                .delay-1500 {
                    animation-delay: 1500ms;
                }
            `}</style>
        </div>
    );
}