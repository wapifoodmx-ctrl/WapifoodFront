import { useState } from "react";
import Default from "@/public/Default.png";

export default function ProductoCard({ producto, onAgregarAlCarrito, onOpenModal }) {
    const [cantidad, setCantidad] = useState(1);

    const incrementar = () => setCantidad(cantidad + 1);
    const decrementar = () => {
        if (cantidad > 1) setCantidad(cantidad - 1);
    };

    const handleAgregar = () => {
        onAgregarAlCarrito({ ...producto, cantidad });
        setCantidad(1);
    };

    // Obtener la URL de la imagen correctamente
    const imageUrl = producto.image_url?.[0] || producto.image || Default.src;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-green-100 hover:border-green-300 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={producto.name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ${parseFloat(producto.price).toFixed(2)}
                </div>
                {producto.isAvailable === false && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-xl">
                            No Disponible
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {producto.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                    {producto.description || "Delicioso platillo preparado con ingredientes frescos"}
                </p>

                <div className="flex items-center justify-between mb-4 bg-green-50 rounded-lg p-2">
                    <button
                        onClick={decrementar}
                        className="bg-white text-green-600 hover:bg-green-100 font-bold w-10 h-10 rounded-lg transition-all duration-200 shadow-md"
                        disabled={producto.isAvailable === false}
                    >
                        -
                    </button>
                    <span className="font-semibold text-xl text-green-800 mx-3 min-w-[2rem] text-center">
                        {cantidad}
                    </span>
                    <button
                        onClick={incrementar}
                        className="bg-white text-green-600 hover:bg-green-100 font-bold w-10 h-10 rounded-lg transition-all duration-200 shadow-md"
                        disabled={producto.isAvailable === false}
                    >
                        +
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleAgregar}
                        disabled={producto.isAvailable === false}
                        className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg ${
                            producto.isAvailable === false
                                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        }`}
                    >
                        Agregar
                    </button>
                    <button
                        onClick={() => onOpenModal(producto)}
                        className="px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        Ver más
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ModalProducto({ isOpen, onClose, producto, onAgregarAlCarrito }) {
    const [cantidad, setCantidad] = useState(1);

    if (!isOpen || !producto) return null;

    const incrementar = () => setCantidad(cantidad + 1);
    const decrementar = () => {
        if (cantidad > 1) setCantidad(cantidad - 1);
    };

    const handleAgregar = () => {
        onAgregarAlCarrito({ ...producto, cantidad });
        setCantidad(1);
        onClose();
    };

    // Obtener la URL de la imagen correctamente
    const imageUrl = producto.image_url?.[0] || producto.image || Default.src;

    return (
        <div 
            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[10000] p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border-2 border-green-100 max-h-[85vh] overflow-y-auto">
                <div className="relative">
                    <img
                        src={imageUrl}
                        alt={producto.name}
                        className="w-full h-40 sm:h-48 object-cover rounded-t-2xl"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-200 shadow-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <div className="absolute bottom-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-base sm:text-lg font-bold shadow-xl">
                        ${parseFloat(producto.price).toFixed(2)}
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                        {producto.name}
                    </h2>

                    <div className="mb-4">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-1.5">Descripción</h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                            {producto.description || "Delicioso platillo preparado con ingredientes frescos y de la mejor calidad. ¡Pruébalo y disfruta de una experiencia gastronómica única!"}
                        </p>
                    </div>

                    {producto.category_name && (
                        <div className="mb-4">
                            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                {producto.category_name}
                            </span>
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 sm:p-4 mb-4 border border-green-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4">
                            <span className="text-base sm:text-lg font-semibold text-gray-700">Cantidad:</span>
                            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-md">
                                <button
                                    onClick={decrementar}
                                    className="bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-200 border border-green-200"
                                >
                                    -
                                </button>
                                <span className="font-bold text-xl sm:text-2xl text-gray-800 min-w-[3rem] text-center px-2">
                                    {cantidad}
                                </span>
                                <button
                                    onClick={incrementar}
                                    className="bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-200 border border-green-200"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-green-300">
                            <span className="text-base sm:text-lg font-bold text-green-700">Total:</span>
                            <span className="text-2xl sm:text-3xl font-bold text-green-600">
                                ${(parseFloat(producto.price) * cantidad).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleAgregar}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 sm:py-4 rounded-xl font-medium text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        🛒 Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
}