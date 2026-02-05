import React, { useState, useEffect } from 'react';
import { MdTableRestaurant } from "react-icons/md";
import { HiMagnifyingGlass } from "react-icons/hi2";

export default function MeseroMesaSelectionModal({ 
    isOpen, 
    loadingMesas,
    mesas, 
    ordenesActivas,
    mensajeError, 
    onSelectMesa,
    meseroName 
}) {
    const [busquedaMesa, setBusquedaMesa] = useState('');
    const [mesasFiltradas, setMesasFiltradas] = useState([]);

    useEffect(() => {
        if (mesas && mesas.length > 0) {
            const filtered = mesas.filter(mesa => 
                mesa.numero.toString().includes(busquedaMesa)
            );
            setMesasFiltradas(filtered);
        }
    }, [busquedaMesa, mesas]);

    if (!isOpen) return null;

    // Función para obtener el estado de una mesa desde las órdenes activas
    const getEstadoMesa = (numeroMesa) => {
        if (!ordenesActivas || ordenesActivas.length === 0) {
            return { estado: 'Libre', ordenes: [] };
        }

        const ordenesMesa = ordenesActivas.filter(
            orden => orden.mesa_number === numeroMesa
        );

        if (ordenesMesa.length === 0) {
            return { estado: 'Libre', ordenes: [] };
        }

        // Verificar si hay alguna orden pendiente
        const tienePendiente = ordenesMesa.some(orden => orden.order_status === 'Pendiente');
        
        return {
            estado: tienePendiente ? 'Ocupado' : 'Libre',
            ordenes: ordenesMesa,
            ordenPendiente: ordenesMesa.find(orden => orden.order_status === 'Pendiente')
        };
    };

    // Función para obtener el total de una mesa
    const getTotalMesa = (numeroMesa) => {
        const { ordenes } = getEstadoMesa(numeroMesa);
        if (ordenes.length === 0) return 0;
        
        return ordenes
            .filter(orden => orden.order_status === 'Pendiente')
            .reduce((sum, orden) => sum + parseFloat(orden.total || 0), 0);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-[9999]"
            onClick={(e) => {
                // Cerrar modal si se hace click en el overlay (fuera del modal)
                if (e.target === e.currentTarget) {
                    onSelectMesa(null, null);
                }
            }}
        >
            <div 
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-5xl max-h-[80vh] flex flex-col relative z-[10000]"
                onClick={(e) => e.stopPropagation()}
            >
                {loadingMesas ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
                        <p className="ml-4 text-gray-600">Cargando mesas...</p>
                    </div>
                ) : (
                    <>
                        <div className="sticky top-0 bg-white pb-4 border-b mb-4 z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-green-600">Seleccionar Mesa</h2>
                                    <p className="text-gray-600">Mesero: <span className="font-semibold">{meseroName}</span></p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total de mesas</p>
                                        <p className="text-3xl font-bold text-green-600">{mesas.length}</p>
                                    </div>
                                    <button
                                        onClick={() => onSelectMesa(null, null)}
                                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                        title="Cerrar"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {/* Búsqueda */}
                            <div className="relative">
                                <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                <input
                                    type="text"
                                    placeholder="Buscar mesa por número..."
                                    value={busquedaMesa}
                                    onChange={(e) => setBusquedaMesa(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Leyenda de estados */}
                            <div className="flex gap-4 mt-3 justify-center flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Libre</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Ocupado</span>
                                </div>
                            </div>
                        </div>

                        {mensajeError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
                                {mensajeError}
                            </div>
                        )}

                        {/* Grid de mesas - con scroll */}
                        <div className="overflow-y-auto flex-1 px-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4 ">
                                {(busquedaMesa ? mesasFiltradas : mesas).map((mesa) => {
                                const { estado, ordenPendiente } = getEstadoMesa(mesa.numero);
                                const total = getTotalMesa(mesa.numero);
                                const isOcupada = estado === 'Ocupado';

                                return (
                                    <button
                                        key={mesa.numero}
                                        onClick={() => onSelectMesa(mesa.numero, ordenPendiente)}
                                        className={`
                                            relative p-4 rounded-lg border-2 transition-all duration-200
                                            ${isOcupada 
                                                ? 'border-orange-500 bg-orange-50 hover:bg-orange-100 hover:shadow-lg' 
                                                : 'border-green-500 bg-green-50 hover:bg-green-100 hover:shadow-lg'
                                            }
                                            hover:scale-105
                                        `}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <MdTableRestaurant 
                                                className={`text-4xl ${isOcupada ? 'text-orange-500' : 'text-green-500'}`}
                                            />
                                            <div className="text-center">
                                                <p className="font-bold text-lg">
                                                    {mesa.numero === 1 ? 'Punto de venta' : `Mesa ${mesa.numero}`}
                                                </p>
                                                <p className={`text-sm font-semibold ${isOcupada ? 'text-orange-600' : 'text-green-600'}`}>
                                                    {estado}
                                                </p>
                                                {isOcupada && total > 0 && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Total: ${total.toFixed(2)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Indicador de orden pendiente */}
                                        {isOcupada && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                            </div>

                            {mesasFiltradas.length === 0 && busquedaMesa && (
                                <div className="text-center py-8 text-gray-500">
                                    No se encontraron mesas con el número &quot;{busquedaMesa}&quot;
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
