import React from 'react';
import { FaCreditCard } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";

export default function PaymentModal({ 
    isOpen, 
    totalPedidos, 
    metodoPago, 
    mensajeError,
    isProcessingPayment,
    onClose, 
    onSelectMetodoPago, 
    onConfirmarPago,
    onRequestConfirmationCode
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[9999]"
            onClick={(e) => {
                if (isProcessingPayment) return;
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-2xl p-8 w-11/12 md:w-96 shadow-2xl border border-green-100 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Confirmar Pago</h2>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Seleccionar método de pago:</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                metodoPago === 'efectivo' 
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg' 
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                            } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !isProcessingPayment && onSelectMetodoPago('efectivo')}
                            disabled={isProcessingPayment}
                        >
                            <BsCashCoin className="text-3xl mb-2"/>
                            <span className="font-medium">Efectivo</span>
                        </button>
                        <button 
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                metodoPago === 'tarjeta' 
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg' 
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                            } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !isProcessingPayment && onSelectMetodoPago('tarjeta')}
                            disabled={isProcessingPayment}
                        >
                            <FaCreditCard className="text-3xl mb-2"/>
                            <span className="font-medium">Tarjeta</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 mb-6 border border-green-200">
                    <div className="text-center">
                        <p className="text-lg text-green-700 mb-1">
                            Total a pagar:
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                            ${parseFloat(totalPedidos).toFixed(2)}
                        </p>
                        <p className="text-sm text-green-700 mt-2">
                            Método: <span className="font-semibold capitalize">{metodoPago}</span>
                        </p>
                    </div>
                </div>

                {mensajeError && (
                    <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${
                        mensajeError.includes('exitosamente') 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                        <div className="flex items-center gap-2">
                            {mensajeError.includes('exitosamente') ? (
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            )}
                            {mensajeError}
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                            isProcessingPayment 
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105'
                        }`}
                        onClick={onRequestConfirmationCode}
                        disabled={isProcessingPayment}
                    >
                        {isProcessingPayment ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Procesando...
                            </span>
                        ) : '💳 Confirmar Pago'}
                    </button>

                    {mensajeError && !mensajeError.includes('exitosamente') && (
                        <button
                            className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                            onClick={onClose}
                            disabled={isProcessingPayment}
                        >
                            Cerrar y reintentar más tarde
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}