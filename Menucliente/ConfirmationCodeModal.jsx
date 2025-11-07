import React, { useState, useEffect } from 'react';
import { MdLock } from "react-icons/md";

export default function ConfirmationCodeModal({ 
    isOpen, 
    codigoEsperado,
    isValidating,
    mensajeError,
    onClose, 
    onConfirm 
}) {
    const [codigo, setCodigo] = useState(['', '', '', '']);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCodigo(['', '', '', '']);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (index, value) => {
        // Solo permitir números
        if (value && !/^\d$/.test(value)) return;

        const newCodigo = [...codigo];
        newCodigo[index] = value;
        setCodigo(newCodigo);
        setError('');

        // Auto-focus al siguiente input
        if (value && index < 3) {
            const nextInput = document.getElementById(`code-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !codigo[index] && index > 0) {
            const prevInput = document.getElementById(`code-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        if (/^\d{1,4}$/.test(pastedData)) {
            const newCodigo = pastedData.split('');
            while (newCodigo.length < 4) newCodigo.push('');
            setCodigo(newCodigo);
            setError('');
        }
    };

    const handleSubmit = () => {
        const codigoCompleto = codigo.join('');
        
        if (codigoCompleto.length !== 4) {
            setError('Por favor ingrese los 4 dígitos del código');
            return;
        }

        if (codigoCompleto !== codigoEsperado) {
            setError('Código incorrecto. Por favor verifique e intente nuevamente.');
            setCodigo(['', '', '', '']);
            document.getElementById('code-input-0')?.focus();
            return;
        }

        onConfirm(codigoCompleto);
    };

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-black/60 flex justify-center items-center z-[10000]"
            onClick={(e) => {
                if (isValidating) return;
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-2xl p-8 w-11/12 md:w-96 shadow-2xl border border-green-100">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdLock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Código de Confirmación</h2>
                    <p className="text-gray-600 text-sm">Ingrese el código de 4 dígitos para confirmar su pago</p>
                </div>

                <div className="mb-6">
                    <div className="flex justify-center gap-3 mb-4">
                        {codigo.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-input-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                disabled={isValidating}
                                className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all ${
                                    error 
                                        ? 'border-red-300 bg-red-50' 
                                        : digit 
                                        ? 'border-green-500 bg-green-50 text-green-700' 
                                        : 'border-gray-300 bg-white'
                                } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                    isValidating ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    {(error || mensajeError) && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 text-center flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {error || mensajeError}
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                    <p className="text-xs text-blue-700 text-center">
                        💡 El código de confirmación es proporcionado por el personal del restaurante
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                            isValidating || codigo.join('').length !== 4
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105'
                        }`}
                        onClick={handleSubmit}
                        disabled={isValidating || codigo.join('').length !== 4}
                    >
                        {isValidating ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Validando...
                            </span>
                        ) : '✓ Confirmar Código'}
                    </button>

                    <button
                        className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                        onClick={onClose}
                        disabled={isValidating}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
