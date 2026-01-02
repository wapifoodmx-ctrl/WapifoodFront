import { useEffect } from "react";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

export default function ModalMessage({ message, onClose }) {
    // Detectar si es un mensaje de error o éxito
    const isError = message?.includes('❌') || message?.toLowerCase().includes('error');
    const isSuccess = message?.includes('✅') || message?.toLowerCase().includes('exitosamente') || message?.toLowerCase().includes('éxito');
    
    // Cerrar automáticamente solo si es mensaje de éxito
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [onClose, isSuccess]);

    // Dividir el mensaje en líneas si contiene \n
    const messageLines = message?.split('\\n').filter(line => line.trim()) || [message];

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[1000] backdrop-blur-sm bg-black/50 p-4"
            onClick={isError ? undefined : onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con gradiente según tipo de mensaje */}
                <div className={`p-5 rounded-t-2xl ${
                    isError 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            {isError ? (
                                <IoCloseCircle className="text-white text-3xl" />
                            ) : (
                                <IoCheckmarkCircle className="text-white text-3xl" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-lg">
                                {isError ? 'Error' : '¡Éxito!'}
                            </h3>
                            <p className="text-white/80 text-xs">
                                {isError ? 'Ha ocurrido un problema' : 'Operación completada'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                    {messageLines.length === 1 ? (
                        <p className="text-gray-700 text-base leading-relaxed">
                            {messageLines[0]}
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {messageLines.map((line, index) => (
                                <p key={index} className="text-gray-700 text-base leading-relaxed">
                                    {line}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer con botón */}
                <div className="px-6 pb-6 flex justify-end gap-3">
                    <button
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                            isError
                                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                        }`}
                        onClick={onClose}
                    >
                        {isError ? 'Entendido' : 'Cerrar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
