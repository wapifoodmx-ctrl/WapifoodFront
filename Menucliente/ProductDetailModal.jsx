import React from 'react';
import Image from "next/image";

export default function ProductDetailModal({ isOpen, producto, onClose, onAddToCart }) {
    if (!isOpen || !producto) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-2xl w-11/12 md:w-96 shadow-2xl border border-green-100 max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{producto.nombre || producto.name}</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colores"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <Image
                            src={producto.imagen}
                            alt={`Imagen de ${producto.nombre || producto.name}`}
                            className="w-full h-48 object-cover rounded-xl border border-green-100 shadow-sm"
                            width={400}
                            height={300}
                        />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                        <p className="text-gray-600 leading-relaxed">{producto.descripcion}</p>
                    </div>

                    {producto.ingredientes && producto.ingredientes.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalizar</h3>
                            <div className="space-y-2">
                                {producto.ingredientes.map((ingrediente, index) => (
                                    <label key={index} className="flex items-center py-2 px-4 bg-green-50 rounded-lg border border-green-100">
                                        <input type="checkbox" className="w-4 h-4 text-green-600 rounded border-green-300 focus:ring-green-500" />
                                        <span className="ml-3 text-gray-700">Sin {ingrediente}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-6 border border-green-200">
                        <div className="text-center">
                            <p className="text-lg text-green-700 mb-1">Precio:</p>
                            <p className="text-2xl font-bold text-green-600">
                                ${((producto.cantidad || 1) * (producto.precio || 0)).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center mb-6">
                        <button
                            className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 rounded-lg flex items-center justify-center font-bold text-xl transition-colores border border-green-200"
                            onClick={() => onAddToCart(producto, -1)}
                        >
                            -
                        </button>
                        <span className="mx-6 text-2xl font-bold text-gray-800">{producto.cantidad || 1}</span>
                        <button
                            className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 rounded-lg flex items-center justify-center font-bold text-xl transition-colores border border-green-200"
                            onClick={() => onAddToCart(producto, 1)}
                        >
                            +
                        </button>
                    </div>

                    <button
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                        onClick={() => {
                            onAddToCart(producto);
                        }}
                    >
                        🛒 Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    );
}