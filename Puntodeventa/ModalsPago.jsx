import { BsCashCoin } from "react-icons/bs";
import { FaCreditCard } from "react-icons/fa";
import { IoMdPhonePortrait } from "react-icons/io";

export function ModalConfirmarPago({
    isOpen,
    onClose,
    totalPedidos,
    metodoPago,
    setMetodoPago,
    mensajeError,
    isProcessingPayment,
    confirmarPago
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[100000]"
            onClick={(e) => {
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
                    <div className="grid grid-cols-3 gap-3">
                        <button 
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                metodoPago === 'efectivo' 
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg' 
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                            } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !isProcessingPayment && setMetodoPago('efectivo')}
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
                            onClick={() => !isProcessingPayment && setMetodoPago('tarjeta')}
                            disabled={isProcessingPayment}
                        >
                            <FaCreditCard className="text-3xl mb-2"/>
                            <span className="font-medium">Tarjeta</span>
                        </button>
                        <button 
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                metodoPago === 'pasarela' 
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg' 
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                            } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !isProcessingPayment && setMetodoPago('pasarela')}
                            disabled={isProcessingPayment}
                        >
                            <IoMdPhonePortrait className="text-3xl mb-2"/>
                            <span className="font-medium">Aplicación</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 mb-6 border border-green-200">
                    <div className="text-center">
                        <p className="text-lg text-green-800 mb-1">Total a pagar:</p>
                        <p className="text-3xl font-bold text-green-600">
                            ${parseFloat(totalPedidos).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-green-700 mt-2">
                            Método: <span className="font-semibold capitalize">{metodoPago === 'pasarela' ? 'Aplicación' : metodoPago}</span>
                        </p>
                    </div>
                </div>

                {mensajeError && (
                    <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${
                        mensajeError.includes('exitosamente') 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        <div className="flex items-center gap-2">
                            {mensajeError.includes('exitosamente') ? (
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        onClick={confirmarPago}
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

export function ModalDescuentoProducto({
    isOpen,
    onClose,
    productoDescuento,
    tipoDescuento,
    setTipoDescuento,
    valorDescuento,
    setValorDescuento,
    mensajeError,
    setMensajeError,
    aplicarDescuentoProducto
}) {
    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const value = e.target.value;
        
        if (tipoDescuento === 'porcentaje') {
            // Solo permitir hasta 2 dígitos para porcentaje
            if (value === '' || (/^\d{0,2}$/.test(value) && parseInt(value) <= 99)) {
                setValorDescuento(value);
                setMensajeError('');
            }
        } else {
            // Para pesos, validar según el precio del producto
            if (productoDescuento) {
                const precioProducto = parseFloat(productoDescuento.price);
                
                // Calcular el número máximo de dígitos basado en el precio menos 0.01
                // Por ejemplo: si el precio es 50, el máximo descuento es 49.99 (2 dígitos)
                // si el precio es 150, el máximo descuento es 149.99 (3 dígitos)
                const precioMaxDescuento = precioProducto - 0.01;
                const maxDigitos = Math.floor(precioMaxDescuento).toString().length;
                
                // Regex que permite: punto opcional al inicio, números (máximo maxDigitos), punto opcional, hasta 2 decimales
                const regex = new RegExp(`^(\\.\\d{0,2}|\\d{0,${maxDigitos}}(\\.\\d{0,2})?)$`);
                
                if (value === '' || regex.test(value)) {
                    // Validar que el valor no sea mayor o igual al precio
                    if (value === '' || value === '.') {
                        setValorDescuento(value);
                        setMensajeError('');
                    } else {
                        const valorNumerico = parseFloat(value);
                        if (!isNaN(valorNumerico) && valorNumerico < precioProducto) {
                            setValorDescuento(value);
                            setMensajeError('');
                        }
                    }
                }
            }
        }
    };

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[100000]"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-2xl p-8 w-11/12 md:w-96 shadow-2xl border border-green-100 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Aplicar Descuento</h2>
                    {productoDescuento && (
                        <p className="text-gray-600 mt-2">{productoDescuento.name}</p>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Tipo de descuento:</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                tipoDescuento === 'porcentaje'
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                            }`}
                            onClick={() => {
                                setTipoDescuento('porcentaje');
                                setValorDescuento('');
                            }}
                        >
                            <span className="text-2xl mb-2">%</span>
                            <span className="font-medium">Porcentaje</span>
                        </button>
                        <button
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                tipoDescuento === 'pesos'
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                            }`}
                            onClick={() => {
                                setTipoDescuento('pesos');
                                setValorDescuento('');
                            }}
                        >
                            <span className="text-2xl mb-2">$</span>
                            <span className="font-medium">Pesos</span>
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Valor del descuento:
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={valorDescuento}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                            placeholder={tipoDescuento === 'porcentaje' ? '0-99' : '0.00'}
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                            {tipoDescuento === 'porcentaje' ? '%' : '$'}
                        </span>
                    </div>
                    {productoDescuento && (
                        <p className="text-xs text-gray-500 mt-2">
                            Precio del producto: ${parseFloat(productoDescuento.price).toFixed(2)}
                        </p>
                    )}
                </div>

                {mensajeError && (
                    <div className="p-4 rounded-xl mb-6 text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {mensajeError}
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={aplicarDescuentoProducto}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        Aplicar Descuento
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ModalDescuentoOrden({
    isOpen,
    onClose,
    descuentoOrden,
    setDescuentoOrden,
    mensajeError,
    setMensajeError,
    aplicarDescuentoOrden,
    calcularTotalCarrito
}) {
    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const value = e.target.value;
        
        if (descuentoOrden.tipo === 'porcentaje') {
            // Solo permitir hasta 2 dígitos para porcentaje
            if (value === '' || (/^\d{0,2}$/.test(value) && parseInt(value) <= 99)) {
                setDescuentoOrden({ ...descuentoOrden, valor: value });
                setMensajeError('');
            }
        } else {
            // Para pesos, validar según el total del carrito
            const totalCarrito = calcularTotalCarrito();
            
            // Calcular el número máximo de dígitos basado en el total menos 0.01
            const totalMaxDescuento = totalCarrito - 0.01;
            const maxDigitos = Math.floor(totalMaxDescuento).toString().length;
            
            // Regex que permite: punto opcional al inicio, números (máximo maxDigitos), punto opcional, hasta 2 decimales
            const regex = new RegExp(`^(\\.\\d{0,2}|\\d{0,${maxDigitos}}(\\.\\d{0,2})?)$`);
            
            if (value === '' || regex.test(value)) {
                // Validar que el valor no sea mayor o igual al total
                if (value === '' || value === '.') {
                    setDescuentoOrden({ ...descuentoOrden, valor: value });
                    setMensajeError('');
                } else {
                    const valorNumerico = parseFloat(value);
                    if (!isNaN(valorNumerico) && valorNumerico < totalCarrito) {
                        setDescuentoOrden({ ...descuentoOrden, valor: value });
                        setMensajeError('');
                    }
                }
            }
        }
    };

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[100000]"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-2xl p-8 w-11/12 md:w-96 shadow-2xl border border-green-100 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Descuento de Orden</h2>
                    <p className="text-gray-600 mt-2">Aplica a todos los productos</p>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-6 border border-green-200">
                    <div className="text-center">
                        <p className="text-sm text-green-800 mb-1">Total actual:</p>
                        <p className="text-2xl font-bold text-green-600">
                            ${calcularTotalCarrito().toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Tipo de descuento:</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                descuentoOrden.tipo === 'porcentaje'
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                            }`}
                            onClick={() => {
                                setDescuentoOrden({ ...descuentoOrden, tipo: 'porcentaje', valor: '' });
                                setMensajeError('');
                            }}
                        >
                            <span className="text-2xl mb-2">%</span>
                            <span className="font-medium">Porcentaje</span>
                        </button>
                        <button
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                descuentoOrden.tipo === 'pesos'
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                            }`}
                            onClick={() => {
                                setDescuentoOrden({ ...descuentoOrden, tipo: 'pesos', valor: '' });
                                setMensajeError('');
                            }}
                        >
                            <span className="text-2xl mb-2">$</span>
                            <span className="font-medium">Pesos</span>
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Valor del descuento:
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={descuentoOrden.valor}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                            placeholder={descuentoOrden.tipo === 'porcentaje' ? '0-99' : '0.00'}
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                            {descuentoOrden.tipo === 'porcentaje' ? '%' : '$'}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Total del carrito: ${calcularTotalCarrito().toFixed(2)}
                    </p>
                </div>

                {mensajeError && (
                    <div className="p-4 rounded-xl mb-6 text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {mensajeError}
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={aplicarDescuentoOrden}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        Aplicar Descuento
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ModalSuscripcion({
    isOpen,
    countdown,
    onGoToPayments
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[100001]">
            <div className="bg-white rounded-2xl p-8 w-11/12 md:w-96 shadow-2xl border border-red-200 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Suscripción Vencida</h2>
                <p className="text-gray-600 mb-6">
                    Tu suscripción ha vencido. Por favor, renueva tu plan para continuar usando el sistema.
                </p>
                <div className="bg-red-100 rounded-xl p-4 mb-6">
                    <p className="text-red-800 font-semibold">
                        Redirigiendo en {countdown} segundos...
                    </p>
                </div>
                <button
                    onClick={onGoToPayments}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                    Ir a Pagos Ahora
                </button>
            </div>
        </div>
    );
}

export function ModalOrdenCancelada({
    isOpen,
    onLimpiar
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[100001]">
            <div className="bg-white rounded-2xl p-8 w-11/12 md:w-96 shadow-2xl border border-orange-200 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Orden Cancelada</h2>
                <p className="text-gray-600 mb-6">
                    La orden ha sido cancelada. Los datos han sido limpiados del sistema.
                </p>
                <button
                    onClick={onLimpiar}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                    Entendido
                </button>
            </div>
        </div>
    );
}
