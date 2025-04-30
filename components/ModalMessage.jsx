import { useEffect } from "react";

export default function ModalMessage({ message, onClose }) {
    // Cerrar la modal automáticamente después de 5 segundos (opcional)
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[1000] backdrop-brightness-30" // Aumentar el z-index
            onClick={onClose} // Cerrar la modal al hacer clic fuera
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md"
                onClick={(e) => e.stopPropagation()} // Evitar cerrar la modal al hacer clic dentro
            >
                <p className="text-gray-800 text-lg">{message}</p>
                <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
