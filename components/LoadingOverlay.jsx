/**
 * Componente de Loading reutilizable
 * Muestra un overlay con spinner durante operaciones largas
 */
export default function LoadingOverlay({ message = "Procesando...", isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[1000] backdrop-blur-sm bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-green-100">
                {/* Header con gradiente */}
                <div className="flex flex-col items-center gap-4">
                    {/* Spinner doble con el estilo de la app */}
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
                    </div>

                    {/* Mensaje */}
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {message}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Por favor espera un momento...
                        </p>
                    </div>

                    {/* Barra de progreso animada */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
