import React from 'react';
import Image from "next/image";
import { FaRegEye } from "react-icons/fa";

export default function ProductCard({ producto, onAddToCart, onViewDetails }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={producto.imagen}
                    alt={`Imagen de ${producto.nombre}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={300}
                    height={200}
                />
                {producto.status === "activo" ? (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow">
                        Disponible
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow">
                            No Disponible
                        </div>
                    </div>
                )}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <span className="text-lg font-bold text-green-600">
                        ${producto.precio.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
            <div className="p-5">
                <div className="mb-3 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{producto.nombre}</h3>
                    <span className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                        {producto.categoria}
                    </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[3rem]">
                    {producto.descripcion.length > 80
                        ? `${producto.descripcion.slice(0, 80)}...`
                        : producto.descripcion}
                </p>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <button
                            className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 rounded-lg flex items-center justify-center font-bold transition-colors border border-green-200"
                            onClick={() => onAddToCart(producto, -1)}
                        >
                            -
                        </button>
                        <span className="text-lg font-bold text-gray-800 min-w-[2rem] text-center">
                            {producto.cantidad || 1}
                        </span>
                        <button
                            className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 rounded-lg flex items-center justify-center font-bold transition-colors border border-green-200"
                            onClick={() => onAddToCart(producto, 1)}
                        >
                            +
                        </button>
                    </div>
                    <button
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                            producto.status === "activo"
                                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md transform hover:scale-105"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => onAddToCart(producto)}
                        disabled={producto.status !== "activo"}
                    >
                        Agregar
                    </button>
                </div>
                <div className="mt-4">
                    <button
                        className="flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm cursor-pointer w-full font-semibold shadow gap-2"
                        onClick={() => onViewDetails(producto)}
                        disabled={producto.status !== "activo"}
                    >
                        <FaRegEye className="h-[20px] w-[20px]" />Ver detalles
                    </button>
                </div>
            </div>
        </div>
    );
}