import React from 'react';
import { MdTableRestaurant } from "react-icons/md";
import { useRouter } from 'next/router';

export default function MesaSelectionModal({ 
    isOpen, 
    loadingMesas, 
    subscriptionError, 
    redirectCountdown,
    mesas, 
    mensajeError, 
    onSelectMesa 
}) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[1001]">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                {loadingMesas ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
                        <p className="ml-4 text-gray-600">Cargando mesas...</p>
                    </div>
                ) : subscriptionError ? (
                    <>
                        <div className='text-green-500 text-4xl flex justify-center mb-4'>
                            <div className='bg-green-500 text-white p-3 rounded-lg shadow-lg'>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl text-center font-bold text-green-600 mb-2">
                            {(() => {
                                const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
                                if (mesasData.max_mesas === 1 && 
                                    mesasData.table_status && 
                                    Object.keys(mesasData.table_status).length === 1 &&
                                    mesasData.table_status["1"] === "Libre") {
                                    return "Función No Disponible";
                                } else {
                                    return "Suscripción Requerida";
                                }
                            })()}
                        </h2>
                        <p className='text-center text-gray-600 mb-6'>
                            {(() => {
                                const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
                                if (mesasData.max_mesas === 1 && 
                                    mesasData.table_status && 
                                    Object.keys(mesasData.table_status).length === 1 &&
                                    mesasData.table_status["1"] === "Libre") {
                                    return "Su paquete contratado no cuenta con esta función";
                                } else {
                                    return "Favor de actualizar o realizar su pago";
                                }
                            })()}
                        </p>
                        
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <div className="relative w-20 h-20">
                                <div className="w-20 h-20 rounded-full border-4 border-green-200"></div>
                                <div 
                                    className="absolute inset-0 w-20 h-20 rounded-full border-4 border-green-500 border-t-transparent transition-transform duration-1000"
                                    style={{
                                        transform: `rotate(${(10 - redirectCountdown) * 36}deg)`,
                                        transition: 'transform 1s linear'
                                    }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-green-600">{redirectCountdown}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 text-center">
                                Redirigiendo automáticamente en {redirectCountdown} segundos...
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colores font-semibold shadow-lg"
                                onClick={() => {
                                    const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
                                    if (mesasData.max_mesas === 1 && 
                                        mesasData.table_status && 
                                        Object.keys(mesasData.table_status).length === 1 &&
                                        mesasData.table_status["1"] === "Libre") {
                                        router.push('/user');
                                    } else {
                                        router.push('/payments');
                                    }
                                }}
                            >
                                {(() => {
                                    const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
                                    if (mesasData.max_mesas === 1 && 
                                        mesasData.table_status && 
                                        Object.keys(mesasData.table_status).length === 1 &&
                                        mesasData.table_status["1"] === "Libre") {
                                        return "👤 Ir a Perfil de Usuario";
                                    } else {
                                        return "💳 Ir a Pagos Ahora";
                                    }
                                })()}
                            </button>
                        </div>
                        
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-xs text-green-700 text-center">
                                {(() => {
                                    const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
                                    if (mesasData.max_mesas === 1 && 
                                        mesasData.table_status && 
                                        Object.keys(mesasData.table_status).length === 1 &&
                                        mesasData.table_status["1"] === "Libre") {
                                        return "Su paquete actual no incluye la gestión de múltiples mesas. Para acceder a esta funcionalidad, actualice su plan desde su perfil de usuario.";
                                    } else {
                                        return "Su suscripción ha expirado o no es válida. Para continuar usando el sistema, debe renovar o adquirir una suscripción activa.";
                                    }
                                })()}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='text-[#3fe283] text-4xl flex justify-center mb-4'>
                            <div className='bg-[#3fe283] text-white p-2 rounded-lg'>
                                <MdTableRestaurant size={32} />
                            </div>
                        </div>
                        <h2 className="text-2xl text-center font-bold text-black mb-2">Elija número de mesa</h2>
                        <p className='text-center text-gray-600 mb-4'>
                            Seleccione una mesa disponible ({mesas.length} mesas libres)
                        </p>
                        
                        {mensajeError && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">{mensajeError}</p>
                            </div>
                        )}
                        
                        {mesas.length === 0 ? (
                            <div className="text-center">
                                <p className="text-green-600 mb-4">No hay mesas disponibles en este momento</p>
                                <button
                                    className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colores"
                                    onClick={() => window.location.reload()}
                                >
                                    Cerrar
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className='flex flex-col gap-2'>
                                    <label className="text-sm font-medium text-gray-700">
                                        Seleccionar Mesa Disponible
                                    </label>
                                    <select 
                                        className="p-3 border border-gray-300 rounded-lg w-full text-lg"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                onSelectMesa(e.target.value);
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            -- Seleccione una mesa --
                                        </option>
                                        {mesas.map((mesa) => (
                                            <option key={`mesa-${mesa.id}`} value={mesa.number}>
                                                Mesa {mesa.number} - Disponible
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="text-center text-sm text-gray-500">
                                    Solo se muestran las mesas disponibles
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}