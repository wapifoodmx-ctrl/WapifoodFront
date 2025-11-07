import React, { useState } from 'react';
import { FaShoppingCart, FaPercent, FaDollarSign } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";

export default function CartModal({ 
    isOpen, 
    carrito, 
    historialPedidos, 
    totalFinal,
    mensajeError,
    isCreatingOrder,
    ordenActiva,
    onClose, 
    onUpdateQuantity, 
    onRemoveItem, 
    onRealizarPedido,
    onTerminarOrden,
    onUpdateCart // Nueva prop para actualizar el carrito con descuentos
}) {
    // Estados para descuentos
    const [modalDescuentoOpen, setModalDescuentoOpen] = useState(false);
    const [productoDescuento, setProductoDescuento] = useState(null);
    const [tipoDescuento, setTipoDescuento] = useState('porcentaje');
    const [valorDescuento, setValorDescuento] = useState('');
    const [descuentoOrden, setDescuentoOrden] = useState({ tipo: 'porcentaje', valor: '', aplicado: false });
    const [modalDescuentoOrdenOpen, setModalDescuentoOrdenOpen] = useState(false);
    const [errorDescuento, setErrorDescuento] = useState('');

    if (!isOpen) return null;

    // Función para calcular precio con descuento de un producto
    const calcularPrecioConDescuento = (producto) => {
        if (!producto.descuento || producto.descuento.valor === '' || producto.descuento.valor === '0') {
            return parseFloat(producto.precio || producto.price);
        }

        const precio = parseFloat(producto.precio || producto.price);
        const valorDesc = parseFloat(producto.descuento.valor);

        if (producto.descuento.tipo === 'porcentaje') {
            return precio - (precio * valorDesc / 100);
        } else {
            return Math.max(0, precio - valorDesc);
        }
    };

    // Función para calcular total del carrito con descuentos
    const calcularTotal = () => {
        const subtotal = carrito.reduce((acc, item) => {
            const precioConDescuento = calcularPrecioConDescuento(item);
            const cantidad = parseInt(item.cantidad || 1);
            return acc + (precioConDescuento * cantidad);
        }, 0);

        if (!descuentoOrden.aplicado || descuentoOrden.valor === '' || descuentoOrden.valor === '0') {
            return subtotal.toFixed(2);
        }

        const valorDesc = parseFloat(descuentoOrden.valor);
        if (descuentoOrden.tipo === 'porcentaje') {
            return (subtotal - (subtotal * valorDesc / 100)).toFixed(2);
        } else {
            return Math.max(0, subtotal - valorDesc).toFixed(2);
        }
    };

    // Función para abrir modal de descuento por producto
    const abrirModalDescuento = (producto) => {
        setProductoDescuento(producto);
        setTipoDescuento(producto.descuento?.tipo || 'porcentaje');
        setValorDescuento(producto.descuento?.valor || '');
        setModalDescuentoOpen(true);
        setErrorDescuento('');
    };

    // Función para aplicar descuento a un producto
    const aplicarDescuentoProducto = () => {
        if (!productoDescuento || valorDescuento === '') return;

        const valor = parseFloat(valorDescuento);
        if (isNaN(valor) || valor < 0) {
            setErrorDescuento("El valor del descuento debe ser un número positivo");
            return;
        }

        if (tipoDescuento === 'porcentaje' && valor > 99) {
            setErrorDescuento("El descuento porcentual no puede ser mayor al 99%");
            return;
        }

        const precioProducto = parseFloat(productoDescuento.precio || productoDescuento.price);
        if (tipoDescuento === 'pesos' && valor >= precioProducto) {
            setErrorDescuento(`El descuento en pesos no puede ser mayor o igual al precio del producto ($${precioProducto.toFixed(2)})`);
            return;
        }

        // Actualizar carrito con descuento
        const carritoActualizado = carrito.map(item =>
            item.id === productoDescuento.id
                ? {
                    ...item,
                    descuento: {
                        tipo: tipoDescuento,
                        valor: valorDescuento
                    }
                }
                : item
        );

        onUpdateCart(carritoActualizado);
        setModalDescuentoOpen(false);
        setProductoDescuento(null);
        setValorDescuento('');
        setErrorDescuento('');
    };

    // Función para quitar descuento de un producto
    const quitarDescuentoProducto = (productId) => {
        const carritoActualizado = carrito.map(item =>
            item.id === productId
                ? { ...item, descuento: null }
                : item
        );
        onUpdateCart(carritoActualizado);
    };

    // Función para aplicar descuento a toda la orden
    const aplicarDescuentoOrden = () => {
        if (descuentoOrden.valor === '') return;

        const valor = parseFloat(descuentoOrden.valor);
        if (isNaN(valor) || valor < 0) {
            setErrorDescuento("El valor del descuento debe ser un número positivo");
            return;
        }

        if (descuentoOrden.tipo === 'porcentaje' && valor > 99) {
            setErrorDescuento("El descuento porcentual no puede ser mayor al 99%");
            return;
        }

        const totalCarrito = carrito.reduce((total, item) => {
            const precioConDescuento = calcularPrecioConDescuento(item);
            return total + (precioConDescuento * item.cantidad);
        }, 0);

        if (descuentoOrden.tipo === 'pesos' && valor >= totalCarrito) {
            setErrorDescuento(`El descuento en pesos no puede ser mayor o igual al total de la orden ($${totalCarrito.toFixed(2)})`);
            return;
        }

        setDescuentoOrden(prev => ({ ...prev, aplicado: true }));
        setModalDescuentoOrdenOpen(false);
        setErrorDescuento('');
    };

    // Función para obtener descuentos para la API
    const getDescuentosParaAPI = () => {
        return {
            descuentosProductos: carrito.map(item => {
                if (!item.descuento || item.descuento.valor === '' || item.descuento.valor === '0') {
                    return '0';
                }
                return item.descuento.tipo === 'porcentaje' 
                    ? `${item.descuento.valor}%` 
                    : item.descuento.valor;
            }).join(','),
            descuentoOrden: descuentoOrden.aplicado && descuentoOrden.valor !== '' && descuentoOrden.valor !== '0'
                ? (descuentoOrden.tipo === 'porcentaje' 
                    ? `${descuentoOrden.valor}%` 
                    : descuentoOrden.valor)
                : '0'
        };
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-end items-center z-[9998]" onClick={onClose}>
            <div className="bg-white w-3/4 h-full sm:w-96 sm:h-screen flex flex-col shadow-2xl border border-gray-200 rounded-l-2xl sm:rounded-none sm:border-l overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 text-white rounded-tl-2xl sm:rounded-none">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                            <FaShoppingCart className="text-base sm:text-xl" />
                            Tu Pedido
                        </h2>
                        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colores p-1 rounded-full hover:bg-white/20">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Contenido del carrito */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                    {carrito.length > 0 ? (
                        <div className="mb-4 sm:mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Productos en carrito
                            </h3>
                            <div className="max-h-36 sm:max-h-48 overflow-y-auto space-y-2 sm:space-y-3">
                                {carrito.map((item) => {
                                    const precioOriginal = parseFloat(item.precio || item.price);
                                    const precioConDescuento = calcularPrecioConDescuento(item);
                                    const tieneDescuento = item.descuento && item.descuento.valor !== '' && item.descuento.valor !== '0';

                                    return (
                                        <div key={item.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-2 sm:p-4 border border-green-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-green-800 text-xs sm:text-base truncate">
                                                        {item.nombre || item.name}
                                                    </p>
                                                    {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                        <p className="text-xs text-green-700">
                                                            Sin: {item.ingredientesExcluidos.join(", ")}
                                                        </p>
                                                    )}
                                                    {item.comentario && (
                                                        <p className="text-xs text-green-700">
                                                            Nota: {item.comentario}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {tieneDescuento ? (
                                                            <>
                                                                <span className="text-xs text-gray-500 line-through">
                                                                    ${precioOriginal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </span>
                                                                <span className="text-xs sm:text-sm text-green-600 font-bold">
                                                                    ${precioConDescuento.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                                                                </span>
                                                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                                                    -{item.descuento.tipo === 'porcentaje' ? `${item.descuento.valor}%` : `$${item.descuento.valor}`}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs sm:text-sm text-green-600">
                                                                ${precioOriginal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button className="text-red-500 hover:text-red-700 transition-colores ml-2 flex-shrink-0 p-1" onClick={() => onRemoveItem(item.id)}>
                                                    <IoTrashOutline className="text-base sm:text-lg" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                                <button className="bg-green-200 hover:bg-green-300 text-green-800 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold transition-colores text-sm" onClick={() => onUpdateQuantity(item.id, -1)}>
                                                    -
                                                </button>
                                                <span className="text-base sm:text-lg font-bold text-green-800 min-w-[1.5rem] sm:min-w-[2rem] text-center">{item.cantidad}</span>
                                                <button className="bg-green-200 hover:bg-green-300 text-green-800 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold transition-colores text-sm" onClick={() => onUpdateQuantity(item.id, 1)}>
                                                    +
                                                </button>
                                            </div>
                                            {/* Botones de descuento */}
                                            <div className="flex gap-2">
                                                <button onClick={() => abrirModalDescuento(item)} className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded-lg text-xs font-medium transition-colores">
                                                    {tieneDescuento ? 'Editar Dto.' : 'Aplicar Dto.'}
                                                </button>
                                                {tieneDescuento && (
                                                    <button onClick={() => quitarDescuentoProducto(item.id)} className="bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded-lg text-xs font-medium transition-colores">
                                                        Quitar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 sm:py-8">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <FaShoppingCart className="text-gray-400 text-lg sm:text-xl" />
                            </div>
                            <p className="text-gray-500 text-sm sm:text-base">Tu carrito está vacío</p>
                        </div>
                    )}

                    {/* Total con descuentos */}
                    {carrito.length > 0 && (
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-green-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm sm:text-lg font-bold text-green-800">Total del carrito:</span>
                                <span className="text-base sm:text-xl font-bold text-green-600">
                                    ${calcularTotal()}
                                </span>
                            </div>
                            {/* Botón de descuento general */}
                            <div className="pt-2 border-t border-green-200">
                                <button onClick={() => setModalDescuentoOrdenOpen(true)} className="w-full bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colores">
                                    {descuentoOrden.aplicado ? 'Editar Descuento General' : 'Aplicar Descuento General'}
                                </button>
                                {descuentoOrden.aplicado && (
                                    <div className="mt-2 flex justify-between items-center text-xs sm:text-sm">
                                        <span className="text-green-700">
                                            Dto. aplicado: {descuentoOrden.tipo === 'porcentaje' ? `${descuentoOrden.valor}%` : `$${descuentoOrden.valor}`}
                                        </span>
                                        <button onClick={() => setDescuentoOrden({ tipo: 'porcentaje', valor: '', aplicado: false })} className="text-red-600 hover:text-red-800">
                                            Quitar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Historial de pedidos (sin cambios) */}
                    {historialPedidos.length > 0 && (
                        <div className="mt-6 sm:mt-8">
                            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                Historial de Pedidos
                            </h3>
                            <div className="max-h-36 sm:max-h-48 overflow-y-auto space-y-2 sm:space-y-3">
                                {historialPedidos.map((item, index) => {
                                    const nombreCorto = (item.nombre || item.name).length > 16 
                                        ? `${(item.nombre || item.name).substring(0, 16)}...` 
                                        : (item.nombre || item.name);
                                    
                                    return (
                                        <div key={index} className={`rounded-xl p-2 sm:p-4 border shadow-sm ${
                                            item.estado === 'Preparado' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
                                            item.estado === 'Cancelado' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' :
                                            'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                                        }`}>
                                            <div className="flex justify-between items-start mb-1 sm:mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-bold text-xs sm:text-base ${
                                                        item.estado === 'Preparado' ? 'text-green-800' :
                                                        item.estado === 'Cancelado' ? 'text-red-800' :
                                                        'text-yellow-800'
                                                    }`} title={`${item.cantidad} x ${item.nombre || item.name}`}>
                                                        {item.cantidad} x {nombreCorto}
                                                    </p>
                                                    {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                        <p className={`text-xs ${
                                                            item.estado === 'Preparado' ? 'text-green-700' :
                                                            item.estado === 'Cancelado' ? 'text-red-700' :
                                                            'text-yellow-700'
                                                        }`}>
                                                            Sin: {item.ingredientesExcluidos.join(", ")}
                                                        </p>
                                                    )}
                                                    {item.comentario && (
                                                        <p className={`text-xs ${
                                                            item.estado === 'Preparado' ? 'text-green-700' :
                                                            item.estado === 'Cancelado' ? 'text-red-700' :
                                                            'text-yellow-700'
                                                        }`}>
                                                            Nota: {item.comentario}
                                                        </p>
                                                    )}
                                                    <p className={`text-xs ${
                                                        item.estado === 'Preparado' ? 'text-green-600' :
                                                        item.estado === 'Cancelado' ? 'text-red-600 line-through' :
                                                        'text-yellow-600'
                                                    }`}>
                                                        ${parseFloat(item.precio || item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                                                    </p>
                                                </div>
                                                <div className="ml-2 flex-shrink-0">
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                                                        item.estado === 'Preparado' ? 'bg-green-500 text-white' :
                                                        item.estado === 'Cancelado' ? 'bg-red-500 text-white' :
                                                        'bg-yellow-500 text-white'
                                                    }`}>
                                                        {item.estado === 'Preparado' ? '✅ Listo' :
                                                         item.estado === 'Cancelado' ? '❌ Cancelado' :
                                                         '⏱️ Pendiente'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {totalFinal > 0 && (
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 sm:p-4 mt-3 sm:mt-4 border border-yellow-200">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-yellow-800 text-sm sm:text-base">Total Final:</span>
                                <span className="text-sm sm:text-lg font-bold text-yellow-600">
                                    ${totalFinal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="p-3 sm:p-6 bg-white border-t border-gray-200 rounded-bl-2xl sm:rounded-none">
                    {mensajeError && (
                        <div className={`p-2 sm:p-4 rounded-xl mb-3 sm:mb-4 text-xs sm:text-sm font-medium ${
                            mensajeError.includes('exitosamente') 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                            {mensajeError}
                        </div>
                    )}

                    <button
                        className={`w-full py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 text-xs sm:text-base ${
                            isCreatingOrder 
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105'
                        }`}
                        onClick={() => onRealizarPedido(getDescuentosParaAPI())}
                        disabled={isCreatingOrder}
                    >
                        {isCreatingOrder ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Enviando...
                            </span>
                        ) : ordenActiva ? 'Agregar a la orden' : 'Realizar Pedido'}
                    </button>

                    {(historialPedidos.length > 0 || ordenActiva) && (
                        <button className="w-full py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 mt-2 sm:mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg transform hover:scale-105 text-xs sm:text-base" onClick={onTerminarOrden}>
                            💳 Terminar Orden
                        </button>
                    )}
                </div>
            </div>

            {/* Modal de descuento por producto */}
            {modalDescuentoOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[10001]" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setModalDescuentoOpen(false);
                        setProductoDescuento(null);
                        setValorDescuento('');
                        setErrorDescuento('');
                    }
                }}>
                    <div className="bg-white rounded-2xl p-6 sm:p-8 w-11/12 md:w-96 shadow-2xl border border-green-100" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaPercent className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Aplicar Descuento</h2>
                            <p className="text-gray-600">{productoDescuento?.nombre || productoDescuento?.name}</p>
                            <p className="text-sm text-gray-500">
                                Precio: ${parseFloat(productoDescuento?.precio || productoDescuento?.price || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>

                        {errorDescuento && (
                            <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-4 text-sm">
                                {errorDescuento}
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Tipo de descuento:</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    type="button"
                                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                                        tipoDescuento === 'porcentaje' 
                                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg' 
                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                                    }`} 
                                    onClick={(e) => { 
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setTipoDescuento('porcentaje'); 
                                        setValorDescuento(''); 
                                        setErrorDescuento(''); 
                                    }}
                                >
                                    <FaPercent className="text-xl sm:text-2xl mb-2"/>
                                    <span className="font-medium text-sm sm:text-base">Porcentaje</span>
                                    <span className="text-xs text-gray-500 mt-1">Máx: 99%</span>
                                </button>
                                <button 
                                    type="button"
                                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                                        tipoDescuento === 'pesos' 
                                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg' 
                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                                    }`} 
                                    onClick={(e) => { 
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setTipoDescuento('pesos'); 
                                        setValorDescuento(''); 
                                        setErrorDescuento(''); 
                                    }}
                                >
                                    <FaDollarSign className="text-xl sm:text-2xl mb-2"/>
                                    <span className="font-medium text-sm sm:text-base">Pesos</span>
                                    <span className="text-xs text-gray-500 mt-1">
                                        Máx: ${(parseFloat(productoDescuento?.precio || productoDescuento?.price || 0) - 0.01).toFixed(2)}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Valor del descuento {tipoDescuento === 'porcentaje' ? '(%)' : '($)'}:
                            </label>
                            <input
                                type="number"
                                step={tipoDescuento === 'pesos' ? "0.01" : "1"}
                                min="0"
                                max={tipoDescuento === 'porcentaje' ? "99" : (parseFloat(productoDescuento?.precio || productoDescuento?.price || 0) - 0.01).toString()}
                                value={valorDescuento}
                                onChange={(e) => { setValorDescuento(e.target.value); setErrorDescuento(''); }}
                                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200"
                                placeholder={tipoDescuento === 'porcentaje' ? "Ej: 10 (máx 99)" : `Ej: 5.00`}
                            />
                        </div>

                        <div className="space-y-3">
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    aplicarDescuentoProducto();
                                }} 
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Aplicar Descuento
                            </button>
                            <button 
                                type="button"
                                onClick={(e) => { 
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setModalDescuentoOpen(false); 
                                    setProductoDescuento(null); 
                                    setValorDescuento(''); 
                                    setErrorDescuento(''); 
                                }} 
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colores"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de descuento para toda la orden */}
            {modalDescuentoOrdenOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[10001]" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setModalDescuentoOrdenOpen(false);
                        setErrorDescuento('');
                    }
                }}>
                    <div className="bg-white rounded-2xl p-6 sm:p-8 w-11/12 md:w-96 shadow-2xl border border-green-100" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaPercent className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Descuento General</h2>
                            <p className="text-gray-600">Aplicar a toda la orden</p>
                            <p className="text-sm text-gray-500">
                                Total actual: ${carrito.reduce((total, item) => {
                                    const precioConDescuento = calcularPrecioConDescuento(item);
                                    return total + (precioConDescuento * item.cantidad);
                                }, 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>

                        {errorDescuento && (
                            <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-4 text-sm">
                                {errorDescuento}
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Tipo de descuento:</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    type="button"
                                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                                        descuentoOrden.tipo === 'porcentaje' 
                                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg' 
                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                                    }`} 
                                    onClick={(e) => { 
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDescuentoOrden(prev => ({ ...prev, tipo: 'porcentaje', valor: '' })); 
                                        setErrorDescuento(''); 
                                    }}
                                >
                                    <FaPercent className="text-xl sm:text-2xl mb-2"/>
                                    <span className="font-medium text-sm sm:text-base">Porcentaje</span>
                                    <span className="text-xs text-gray-500 mt-1">Máx: 99%</span>
                                </button>
                                <button 
                                    type="button"
                                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                                        descuentoOrden.tipo === 'pesos' 
                                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg' 
                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                                    }`} 
                                    onClick={(e) => { 
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDescuentoOrden(prev => ({ ...prev, tipo: 'pesos', valor: '' })); 
                                        setErrorDescuento(''); 
                                    }}
                                >
                                    <FaDollarSign className="text-xl sm:text-2xl mb-2"/>
                                    <span className="font-medium text-sm sm:text-base">Pesos</span>
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Valor del descuento {descuentoOrden.tipo === 'porcentaje' ? '(%)' : '($)'}:
                            </label>
                            <input
                                type="number"
                                step={descuentoOrden.tipo === 'pesos' ? "0.01" : "1"}
                                min="0"
                                value={descuentoOrden.valor}
                                onChange={(e) => { setDescuentoOrden(prev => ({ ...prev, valor: e.target.value })); setErrorDescuento(''); }}
                                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200"
                                placeholder={descuentoOrden.tipo === 'porcentaje' ? "Ej: 10 (máx 99)" : "Ej: 5.00"}
                            />
                        </div>

                        <div className="space-y-3">
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    aplicarDescuentoOrden();
                                }} 
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Aplicar Descuento
                            </button>
                            <button 
                                type="button"
                                onClick={(e) => { 
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setModalDescuentoOrdenOpen(false); 
                                    setErrorDescuento(''); 
                                }} 
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colores"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}