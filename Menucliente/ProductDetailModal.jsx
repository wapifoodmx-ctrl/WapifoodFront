import React, { useState } from 'react';
import Image from "next/image";
import Default from "@/public/Default.png";

export default function ProductDetailModal({ isOpen, producto, onClose, onAddToCart }) {
    const [comentario, setComentario] = useState('');
    const [ingredientesExcluidos, setIngredientesExcluidos] = useState([]);

    if (!isOpen || !producto) return null;

    const handleAddToCart = () => {
        // Combinar ingredientes excluidos con el comentario manual
        let comentarioFinal = '';
        
        if (ingredientesExcluidos.length > 0) {
            comentarioFinal = ingredientesExcluidos.map(ing => `Sin ${ing}`).join(', ');
        }
        
        if (comentario.trim() !== '') {
            if (comentarioFinal !== '') {
                comentarioFinal += ', ' + comentario.trim();
            } else {
                comentarioFinal = comentario.trim();
            }
        }
        
        onAddToCart(producto, undefined, comentarioFinal, ingredientesExcluidos);
        setComentario('');
        setIngredientesExcluidos([]);
    };

    const toggleIngrediente = (ingrediente) => {
        setIngredientesExcluidos(prev => 
            prev.includes(ingrediente)
                ? prev.filter(i => i !== ingrediente)
                : [...prev, ingrediente]
        );
    };

    // Normalizar ingredientes - pueden venir como array o string separado por comas
    const ingredientes = Array.isArray(producto.ingredientes) 
        ? producto.ingredientes 
        : typeof producto.ingredientes === 'string' 
            ? producto.ingredientes.split(',').map(i => i.trim()).filter(i => i)
            : [];

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[10000] p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                    setComentario('');
                    setIngredientesExcluidos([]);
                }
            }}
        >
            <div className="bg-white rounded-2xl w-11/12 md:w-96 shadow-2xl border border-green-100 max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{producto.nombre || producto.name}</h2>
                        <button
                            onClick={() => {
                                onClose();
                                setComentario('');
                                setIngredientesExcluidos([]);
                            }}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {producto.imagen && (
                        <img 
                            src={producto.imagen} 
                            alt={producto.nombre || producto.name} 
                            className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                    )}

                    <p className="text-gray-600 mb-4">{producto.descripcion || producto.description}</p>

                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-4 border border-green-200">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-700">Precio:</span>
                            <span className="text-2xl font-bold text-green-600">
                                ${parseFloat(producto.precio || producto.price).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Ingredientes con checkboxes - Estilo Punto de Venta */}
                    {ingredientes.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Personalizar ingredientes</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {ingredientes.map((ingrediente, index) => (
                                    <label 
                                        key={index}
                                        className="flex items-center py-2 px-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-all"
                                    >
                                        <input 
                                            type="checkbox"
                                            className="w-4 h-4 text-red-500 rounded border-gray-300 focus:ring-green-500 cursor-pointer accent-red-500"
                                            checked={ingredientesExcluidos.includes(ingrediente)}
                                            onChange={() => toggleIngrediente(ingrediente)}
                                        />
                                        <span className={`ml-3 text-sm font-medium ${
                                            ingredientesExcluidos.includes(ingrediente) 
                                                ? 'text-red-600 line-through' 
                                                : 'text-gray-700'
                                        }`}>
                                            Sin {ingrediente}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {ingredientesExcluidos.length > 0 && (
                                <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                                    <p className="text-xs text-red-600 font-medium">
                                        ❌ Se quitará: {ingredientesExcluidos.join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Campo de comentario - Estilo Punto de Venta */}
                    <div className="mb-4">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Comentario especial (opcional)</h3>
                        <textarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Ej: Sin cebolla, extra salsa, poco picante..."
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none text-sm"
                            rows={2}
                            maxLength={200}
                        />
                        <p className="text-xs text-gray-500 text-right mt-1">{comentario.length}/200</p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 sm:py-4 rounded-xl font-medium text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        🛒 Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
}