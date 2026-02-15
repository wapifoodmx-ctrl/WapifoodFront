import { useState, useEffect } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

export default function ComponenteComentario({ 
    comentario, 
    setComentario, 
    titulo = "💬 Comentario general de la orden",
    placeholder = "Ej: Para llevar, sin servilletas, entregar rápido...",
    maxLength = 200,
    storageKey = null // Para persistir el estado colapsado
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Cargar estado del localStorage si se proporciona storageKey
    useEffect(() => {
        if (storageKey) {
            const savedState = localStorage.getItem(`${storageKey}_expanded`);
            if (savedState !== null) {
                setIsExpanded(savedState === 'true');
            }
        }
    }, [storageKey]);

    // Guardar estado en localStorage cuando cambie
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(`${storageKey}_expanded`, isExpanded.toString());
        }
    }, [isExpanded, storageKey]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
            {/* Header - Siempre visible */}
            <button
                onClick={toggleExpanded}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                        {titulo}
                    </span>
                    {/* Indicador de que hay contenido */}
                    {comentario && !isExpanded && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            ✓ Agregado
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Preview del comentario cuando está colapsado */}
                    {comentario && !isExpanded && (
                        <span className="text-xs text-gray-500 max-w-[120px] sm:max-w-[200px] truncate hidden sm:inline">
                            "{comentario}"
                        </span>
                    )}
                    <div className={`p-1 rounded-full transition-colors ${isExpanded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {isExpanded ? (
                            <IoChevronUp className="w-4 h-4" />
                        ) : (
                            <IoChevronDown className="w-4 h-4" />
                        )}
                    </div>
                </div>
            </button>

            {/* Contenido colapsable */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder={placeholder}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none text-sm transition-colors"
                        rows={2}
                        maxLength={maxLength}
                    />
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                            {comentario.length}/{maxLength} caracteres
                        </span>
                        {comentario && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setComentario('');
                                }}
                                className="text-xs text-red-500 hover:text-red-700 transition-colors"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}