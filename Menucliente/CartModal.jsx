import React, { useState } from 'react';
import { FaShoppingCart, FaPercent, FaDollarSign } from "react-icons/fa";
import { IoTrashOutline, IoClose } from "react-icons/io5";
import { MdShoppingCart } from "react-icons/md";

export default function CartModal({ 
    isOpen, 
    carrito, 
    historialPedidos, 
    totalFinal,
    mensajeError,
    isCreatingOrder,
    ordenActiva,
    descuentoOrden,
    setDescuentoOrden,
    onClose, 
    onUpdateQuantity, 
    onRemoveItem, 
    onRealizarPedido,
    onTerminarOrden,
    onUpdateCart,
    getCodigoConfirmacion,
    visibilityStyle
}) {
    // Estados existentes...
    const [modalDescuentoOpen, setModalDescuentoOpen] = useState(false);
    const [productoDescuento, setProductoDescuento] = useState(null);
    const [tipoDescuento, setTipoDescuento] = useState('porcentaje');
    const [valorDescuento, setValorDescuento] = useState('');
    const [modalDescuentoOrdenOpen, setModalDescuentoOrdenOpen] = useState(false);
    const [errorDescuento, setErrorDescuento] = useState('');
    const [comentarioOrden, setComentarioOrden] = useState('');
    
    // Estados para el modal de confirmación de código
    const [modalConfirmacionDescuentoOpen, setModalConfirmacionDescuentoOpen] = useState(false);
    const [codigoConfirmacionDescuento, setCodigoConfirmacionDescuento] = useState('');
    const [codigoEsperadoDescuento, setCodigoEsperadoDescuento] = useState('');
    const [errorCodigoDescuento, setErrorCodigoDescuento] = useState('');
    const [isValidandoCodigoDescuento, setIsValidandoCodigoDescuento] = useState(false);
    const [tipoDescuentoEnProceso, setTipoDescuentoEnProceso] = useState(null);

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

    // Función para manejar cambios en el input de descuento de producto
    const handleInputChangeProducto = (e) => {
        const value = e.target.value;
        
        if (tipoDescuento === 'porcentaje') {
            // Solo permitir hasta 2 dígitos para porcentaje
            if (value === '' || (/^\d{0,2}$/.test(value) && parseInt(value) <= 99)) {
                setValorDescuento(value);
                setErrorDescuento('');
            }
        } else {
            // Para pesos, validar según el precio del producto
            if (productoDescuento) {
                const precioProducto = parseFloat(productoDescuento.precio || productoDescuento.price);
                
                // Calcular el número máximo de dígitos basado en el precio menos 0.01
                const precioMaxDescuento = precioProducto - 0.01;
                const maxDigitos = Math.floor(precioMaxDescuento).toString().length;
                
                // Regex que permite: punto opcional al inicio, números (máximo maxDigitos), punto opcional, hasta 2 decimales
                const regex = new RegExp(`^(\\.\\d{0,2}|\\d{0,${maxDigitos}}(\\.\\d{0,2})?)$`);
                
                if (value === '' || regex.test(value)) {
                    // Validar que el valor no sea mayor o igual al precio
                    if (value === '' || value === '.') {
                        setValorDescuento(value);
                        setErrorDescuento('');
                    } else {
                        const valorNumerico = parseFloat(value);
                        if (!isNaN(valorNumerico) && valorNumerico < precioProducto) {
                            setValorDescuento(value);
                            setErrorDescuento('');
                        }
                    }
                }
            }
        }
    };

    // Función para manejar cambios en el input de descuento de orden
    const handleInputChangeOrden = (e) => {
        const value = e.target.value;
        
        if (descuentoOrden.tipo === 'porcentaje') {
            // Solo permitir hasta 2 dígitos para porcentaje
            if (value === '' || (/^\d{0,2}$/.test(value) && parseInt(value) <= 99)) {
                setDescuentoOrden({ ...descuentoOrden, valor: value });
                setErrorDescuento('');
            }
        } else {
            // Para pesos, validar según el total del carrito
            const totalCarrito = carrito.reduce((total, item) => {
                const precioConDescuento = calcularPrecioConDescuento(item);
                return total + (precioConDescuento * item.cantidad);
            }, 0);
            
            // Calcular el número máximo de dígitos basado en el total menos 0.01
            const totalMaxDescuento = totalCarrito - 0.01;
            const maxDigitos = Math.floor(totalMaxDescuento).toString().length;
            
            // Regex que permite: punto opcional al inicio, números (máximo maxDigitos), punto opcional, hasta 2 decimales
            const regex = new RegExp(`^(\\.\\d{0,2}|\\d{0,${maxDigitos}}(\\.\\d{0,2})?)$`);
            
            if (value === '' || regex.test(value)) {
                // Validar que el valor no sea mayor o igual al total
                if (value === '' || value === '.') {
                    setDescuentoOrden({ ...descuentoOrden, valor: value });
                    setErrorDescuento('');
                } else {
                    const valorNumerico = parseFloat(value);
                    if (!isNaN(valorNumerico) && valorNumerico < totalCarrito) {
                        setDescuentoOrden({ ...descuentoOrden, valor: value });
                        setErrorDescuento('');
                    }
                }
            }
        }
    };

    // Función para aplicar descuento a un producto
    const aplicarDescuentoProducto = async () => {
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

        try {
            setIsValidandoCodigoDescuento(true);
            const codigoData = await getCodigoConfirmacion();
            
            if (codigoData && codigoData.codigo_confirmacion) {
                setCodigoEsperadoDescuento(codigoData.codigo_confirmacion.toString());
                setTipoDescuentoEnProceso('producto');
                setModalConfirmacionDescuentoOpen(true);
            } else {
                throw new Error("No se pudo obtener el código de confirmación");
            }
        } catch (error) {
            console.error('Error al obtener código:', error);
            setErrorDescuento("Error al obtener el código de confirmación. Intente nuevamente.");
        } finally {
            setIsValidandoCodigoDescuento(false);
        }
    };

    // Función actualizada para aplicar descuento a toda la orden
    const aplicarDescuentoOrden = async () => {
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

        try {
            setIsValidandoCodigoDescuento(true);
            const codigoData = await getCodigoConfirmacion();
            
            if (codigoData && codigoData.codigo_confirmacion) {
                setCodigoEsperadoDescuento(codigoData.codigo_confirmacion.toString());
                setTipoDescuentoEnProceso('orden');
                setModalConfirmacionDescuentoOpen(true);
            } else {
                throw new Error("No se pudo obtener el código de confirmación");
            }
        } catch (error) {
            console.error('Error al obtener código:', error);
            setErrorDescuento("Error al obtener el código de confirmación. Intente nuevamente.");
        } finally {
            setIsValidandoCodigoDescuento(false);
        }
    };

    // Función para validar el código y aplicar el descuento
    const validarCodigoYAplicarDescuento = () => {
        if (codigoConfirmacionDescuento !== codigoEsperadoDescuento) {
            setErrorCodigoDescuento('Código incorrecto. Intenta nuevamente.');
            return;
        }

        setErrorCodigoDescuento('');

        if (tipoDescuentoEnProceso === 'producto') {
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
        } else if (tipoDescuentoEnProceso === 'orden') {
            setDescuentoOrden(prev => ({ ...prev, aplicado: true }));
            setModalDescuentoOrdenOpen(false);
        }

        setModalConfirmacionDescuentoOpen(false);
        setCodigoConfirmacionDescuento('');
        setCodigoEsperadoDescuento('');
        setTipoDescuentoEnProceso(null);
        setErrorDescuento('');
    };

    // Función para cerrar el modal de confirmación
    const cerrarModalConfirmacionDescuento = () => {
        if (isValidandoCodigoDescuento) return;
        
        setModalConfirmacionDescuentoOpen(false);
        setCodigoConfirmacionDescuento('');
        setCodigoEsperadoDescuento('');
        setErrorCodigoDescuento('');
        setTipoDescuentoEnProceso(null);
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

    const quitarDescuentoProducto = (idProducto) => {
        const carritoActualizado = carrito.map(item =>
            item.id === idProducto
                ? {
                    ...item,
                    descuento: null
                }
                : item
        );
        onUpdateCart(carritoActualizado);
    };

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 backdrop-blur-sm bg-black/50 flex justify-end items-center z-[99999]" onClick={onClose} style={visibilityStyle}>
            <div className="bg-white w-full sm:w-[28rem] lg:w-[32rem] h-full flex flex-col shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                {/* ========== HEADER MEJORADO ========== */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-6 py-5 text-white shadow-md flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2.5 rounded-xl">
                                <FaShoppingCart className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Tu Pedido</h2>
                                <p className="text-white/90 text-sm">Menú del Cliente</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-white/90 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                        >
                            <IoClose className="text-3xl" />
                        </button>
                    </div>
                </div>

                {/* ========== CONTENIDO SCROLLABLE ========== */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 min-h-0 bg-gray-50">
                    {carrito.length > 0 ? (
                        <div className="mb-4 sm:mb-6">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                Productos en Carrito ({carrito.length})
                            </h3>
                            <div className="space-y-3">
                                {carrito.map((item) => {
                                    const precioOriginal = parseFloat(item.precio || item.price);
                                    const precioConDescuento = calcularPrecioConDescuento(item);
                                    const tieneDescuento = item.descuento && item.descuento.valor !== '' && item.descuento.valor !== '0';

                                    return (
                                        <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-400 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <h4 className="font-bold text-gray-800 text-base leading-tight">
                                                        {item.nombre || item.name}
                                                    </h4>
                                                    {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                        <p className="text-xs text-orange-600 mt-1 bg-orange-50 px-2 py-1 rounded">
                                                            Sin: {item.ingredientesExcluidos.join(", ")}
                                                        </p>
                                                    )}
                                                    {item.comentario && (
                                                        <p className="text-xs text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded">
                                                            Nota: {item.comentario}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 flex-wrap mt-1.5">
                                                        {tieneDescuento ? (
                                                            <>
                                                                <span className="text-sm text-gray-400 line-through">
                                                                    ${precioOriginal.toFixed(2)}
                                                                </span>
                                                                <span className="text-base text-emerald-600 font-bold">
                                                                    ${precioConDescuento.toFixed(2)}
                                                                </span>
                                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                                                                    -{item.descuento.tipo === 'porcentaje' ? `${item.descuento.valor}%` : `$${item.descuento.valor}`}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-base text-emerald-600 font-semibold">
                                                                ${precioOriginal.toFixed(2)} c/u
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all flex-shrink-0" onClick={() => onRemoveItem(item.id)}>
                                                    <IoTrashOutline className="text-xl" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                                    <button className="bg-white hover:bg-green-100 text-green-700 w-9 h-9 rounded-lg flex items-center justify-center font-bold transition-all shadow-sm border border-gray-200" onClick={() => onUpdateQuantity(item.id, -1)}>
                                                        -
                                                    </button>
                                                    <span className="text-xl font-bold text-gray-800 min-w-[3rem] text-center">{item.cantidad}</span>
                                                    <button className="bg-white hover:bg-green-100 text-green-700 w-9 h-9 rounded-lg flex items-center justify-center font-bold transition-all shadow-sm border border-gray-200" onClick={() => onUpdateQuantity(item.id, 1)}>
                                                        +
                                                    </button>
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <span className="text-lg font-bold text-gray-800">
                                                        ${(precioConDescuento * item.cantidad).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Botones de descuento */}
                                            <div className="flex gap-2">
                                                <button onClick={() => abrirModalDescuento(item)} className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all border border-green-200">
                                                    {tieneDescuento ? '✏️ Editar Descuento' : '🏷️ Agregar Descuento'}
                                                </button>
                                                {tieneDescuento && (
                                                    <button onClick={() => quitarDescuentoProducto(item.id)} className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all border border-red-200">
                                                        Quitar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        ) : historialPedidos.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MdShoppingCart className="text-gray-300 text-4xl" />
                                </div>
                                <p className="text-gray-400 font-medium text-lg">Tu carrito está vacío</p>
                                <p className="text-gray-300 text-sm mt-1">Agrega productos del menú para comenzar</p>
                            </div>
                        ) : null}

                    {/* Total con descuentos */}
                    {carrito.length > 0 && (
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border-green-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm sm:text-lg lg:text-xl font-bold text-green-800">Total del carrito:</span>
                                <span className="text-base sm:text-xl lg:text-2xl font-bold text-green-600">
                                    ${calcularTotal()}
                                </span>
                            </div>
                            {/* Botón de descuento general */}
                            <div className="pt-2 border-t border-green-200 space-y-3">
                                <button onClick={() => {
                                    setDescuentoOrden({ tipo: 'porcentaje', valor: '', aplicado: false });
                                    setErrorDescuento('');
                                    setModalDescuentoOrdenOpen(true);
                                }} className="w-full bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-medium transition-colors">
                                    {descuentoOrden.aplicado ? 'Editar Descuento General' : 'Aplicar Descuento General'}
                                </button>
                                {descuentoOrden.aplicado && (
                                    <div className="flex justify-between items-center text-xs sm:text-sm lg:text-base">
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

                    {/* Input de comentarios - Ahora fuera de la sección de descuento */}
                    {carrito.length > 0 && (
                        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border-2 border-gray-200">
                            <label className="block text-xs sm:text-sm lg:text-base font-semibold text-gray-800 mb-2">
                                💬 Comentarios para la orden
                            </label>
                            <textarea
                                value={comentarioOrden}
                                onChange={(e) => setComentarioOrden(e.target.value)}
                                placeholder="Ej: Sin cebolla en todos los platillos, mesa cerca de la ventana..."
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200 resize-none text-xs sm:text-sm text-gray-700 placeholder-gray-400"
                                rows="3"
                                maxLength="200"
                            />
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-500">
                                    {comentarioOrden.length}/200 caracteres
                                </span>
                                {comentarioOrden && (
                                    <button
                                        onClick={() => setComentarioOrden('')}
                                        className="text-xs text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========== HISTORIAL DE PEDIDOS ========== */}
                    {historialPedidos.length > 0 && (
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                Historial de Pedidos ({historialPedidos.length})
                            </h3>
                            <div className="space-y-3">
                                {historialPedidos.map((item, index) => {
                                    return (
                                        <div key={index} className={`rounded-xl p-4 border-2 shadow-sm transition-all ${
                                            item.estado === 'Preparado' ? 'bg-green-50 border-green-200' :
                                            item.estado === 'Cancelado' ? 'bg-red-50 border-red-200' :
                                            'bg-yellow-50 border-yellow-200'
                                        }`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <p className={`font-bold text-base leading-tight ${
                                                        item.estado === 'Preparado' ? 'text-green-800' :
                                                        item.estado === 'Cancelado' ? 'text-red-800' :
                                                        'text-yellow-800'
                                                    }`}>
                                                        {item.cantidad} x {item.nombre || item.name}
                                                    </p>
                                                    {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                        <p className={`text-xs mt-1 px-2 py-1 rounded ${
                                                            item.estado === 'Preparado' ? 'text-green-700 bg-green-100' :
                                                            item.estado === 'Cancelado' ? 'text-red-700 bg-red-100' :
                                                            'text-yellow-700 bg-yellow-100'
                                                        }`}>
                                                            Sin: {item.ingredientesExcluidos.join(", ")}
                                                        </p>
                                                    )}
                                                    {item.comentario && (
                                                        <p className={`text-xs mt-1 px-2 py-1 rounded ${
                                                            item.estado === 'Preparado' ? 'text-green-700 bg-green-100' :
                                                            item.estado === 'Cancelado' ? 'text-red-700 bg-red-100' :
                                                            'text-yellow-700 bg-yellow-100'
                                                        }`}>
                                                            Nota: {item.comentario}
                                                        </p>
                                                    )}
                                                    <p className={`text-sm font-semibold mt-1.5 ${
                                                        item.estado === 'Preparado' ? 'text-green-600' :
                                                        item.estado === 'Cancelado' ? 'text-red-600 line-through' :
                                                        'text-yellow-600'
                                                    }`}>
                                                        ${parseFloat(item.precio || item.price).toFixed(2)} c/u
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
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
                </div>

                {/* ========== FOOTER CON TOTAL Y BOTONES (STICKY) ========== */}
                <div className="px-6 py-4 bg-white border-t-2 border-gray-200 flex-shrink-0 space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    {/* Total siempre visible */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800 text-base">Total:</span>
                            <span className="text-2xl font-bold text-emerald-600">
                                ${totalFinal > 0 ? totalFinal.toFixed(2) : calcularTotal()}
                            </span>
                        </div>
                    </div>
                    {mensajeError && (
                        <div className={`p-2 sm:p-4 lg:p-5 rounded-xl mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base font-medium ${
                            mensajeError.includes('exitosamente') 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                            {mensajeError}
                        </div>
                    )}

                    <button
                        className={`w-full py-3.5 rounded-lg font-bold text-base transition-all ${
                            isCreatingOrder || carrito.length === 0
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white shadow-md transform hover:scale-[1.01]'
        }`}
                        onClick={() => onRealizarPedido(getDescuentosParaAPI())}
                        disabled={isCreatingOrder || carrito.length === 0}
                    >
                        {isCreatingOrder ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Enviando...
                            </span>
                        ) : ordenActiva ? '🍽️ Agregar a la Orden' : '🍴 Realizar Pedido'}
                    </button>

                    {(historialPedidos.length > 0 || ordenActiva) && (
                        <button 
                            className="w-full py-3.5 rounded-lg font-bold text-base transition-all bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md transform hover:scale-[1.01]" 
                            onClick={() => {
                                onTerminarOrden();
                                onClose();
                            }}
                        >
                            💳 Terminar Orden
                        </button>
                    )}
                </div>
            </div>

            {/* Modal de descuento por producto */}
            {modalDescuentoOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[100000]" onClick={(e) => {
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
                                type="text"
                                inputMode="decimal"
                                value={valorDescuento}
                                onChange={handleInputChangeProducto}
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
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[100000]" onClick={(e) => {
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
                                type="text"
                                inputMode="decimal"
                                value={descuentoOrden.valor}
                                onChange={handleInputChangeOrden}
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

            {/* Modal de confirmación de código para descuentos */}
            {modalConfirmacionDescuentoOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[100001]" onClick={(e) => {
                    if (e.target === e.currentTarget && !isValidandoCodigoDescuento) {
                        cerrarModalConfirmacionDescuento();
                    }
                }}>
                    <div className="bg-white rounded-2xl p-6 sm:p-8 w-11/12 md:w-96 shadow-2xl border border-green-100" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Código de Autorización</h2>
                            <p className="text-gray-600 mt-2">
                                Ingresa el código de 4 dígitos para autorizar el descuento
                            </p>
                        </div>

                        {errorCodigoDescuento && (
                            <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {errorCodigoDescuento}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                Código de Seguridad
                            </label>
                            <input
                                type="text"
                                value={codigoConfirmacionDescuento}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,4}$/.test(value)) {
                                        setCodigoConfirmacionDescuento(value);
                                        if (errorCodigoDescuento) setErrorCodigoDescuento('');
                                    }
                                }}
                                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 text-center text-2xl tracking-widest font-mono"
                                placeholder="0000"
                                maxLength="4"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-3">
                            <button 
                                type="button"
                                onClick={validarCodigoYAplicarDescuento}
                                disabled={codigoConfirmacionDescuento.length !== 4}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                Confirmar
                            </button>
                            <button 
                                type="button"
                                onClick={cerrarModalConfirmacionDescuento}
                                disabled={isValidandoCodigoDescuento}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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