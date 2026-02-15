import { FaShoppingCart, FaPercent } from "react-icons/fa";
import { IoTrashOutline, IoClose } from "react-icons/io5";
import { MdDelete, MdShoppingCart } from "react-icons/md";
import ComponenteComentario from "@/components/componenteComentario";

export default function CarritoModal({
    isOpen,
    onClose,
    carrito,
    setCarrito,
    pedidosPendientes,
    setPedidosPendientes,
    mensajeError,
    isCreatingOrder,
    terminarOrden,
    finalizarTodasOrdenes,
    calcularPrecioConDescuento,
    calcularTotalCarrito,
    abrirModalDescuento,
    quitarDescuentoProducto,
    descuentoOrden,
    setDescuentoOrden,
    setModalDescuentoOrdenOpen,
    setMensajeError,
    comentarioGeneral,
    setComentarioGeneral
}) {
    if (!isOpen) return null;

    // Función auxiliar para calcular subtotal de un item
    const calcularSubtotalItem = (item) => {
        const precioConDescuento = calcularPrecioConDescuento(item);
        return (precioConDescuento * item.cantidad).toFixed(2);
    };

    // Función para limpiar todos los pedidos pendientes
    const limpiarPedidosPendientes = () => {
        if (window.confirm("¿Estás seguro de eliminar todos los pedidos pendientes?")) {
            setPedidosPendientes([]);
            localStorage.removeItem("pedidosPendientes");
            setMensajeError("Pedidos pendientes eliminados.");
            setTimeout(() => setMensajeError(""), 2000);
        }
    };

    return (
        <div
            className="fixed top-16 left-0 right-0 bottom-0 backdrop-blur-sm bg-black/50 flex justify-end items-center z-[99999]"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white w-full sm:w-[28rem] lg:w-[32rem] h-full shadow-2xl flex flex-col relative z-[99999]">
                {/* ========== HEADER ========== */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-6 py-5 text-white shadow-md flex-shrink-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2.5 rounded-xl">
                                <FaShoppingCart className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Carrito</h2>
                                <p className="text-white/90 text-sm">Punto de Venta</p>
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
                    
                    {/* ========== CARRITO ACTUAL ========== */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                Productos ({carrito.length})
                            </h3>
                        </div>

                        {carrito.length > 0 ? (
                            <div className="space-y-3">
                                {carrito.map((item) => {
                                    const precioOriginal = parseFloat(item.price);
                                    const precioConDescuento = calcularPrecioConDescuento(item);
                                    const tieneDescuento = item.descuento && item.descuento.valor !== '' && item.descuento.valor !== '0';
                                    const subtotal = calcularSubtotalItem(item);

                                    return (
                                        <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-400 hover:shadow-md transition-all">
                                            {/* Nombre y botón eliminar */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1 pr-2">
                                                    <h4 className="font-bold text-gray-800 text-base leading-tight">{item.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
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
                                                    {/* Mostrar comentario del producto */}
                                                    {item.comentario && (
                                                        <p className="text-xs text-gray-600 italic mt-1 bg-yellow-50 px-2 py-1 rounded">
                                                            💬 {item.comentario}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                    onClick={() => {
                                                        setCarrito((prevCarrito) =>
                                                            prevCarrito.filter((producto) => producto.id !== item.id)
                                                        );
                                                    }}
                                                >
                                                    <IoTrashOutline className="text-xl" />
                                                </button>
                                            </div>

                                            {/* Controles de cantidad */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        className="bg-white hover:bg-green-100 text-green-700 w-9 h-9 rounded-lg flex items-center justify-center font-bold transition-all shadow-sm border border-gray-200"
                                                        onClick={() => {
                                                            setCarrito((prevCarrito) =>
                                                                prevCarrito.map((producto) =>
                                                                    producto.id === item.id
                                                                        ? { ...producto, cantidad: Math.max(producto.cantidad - 1, 1) }
                                                                        : producto
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-xl font-bold text-gray-800 min-w-[3rem] text-center">{item.cantidad}</span>
                                                    <button
                                                        className="bg-white hover:bg-green-100 text-green-700 w-9 h-9 rounded-lg flex items-center justify-center font-bold transition-all shadow-sm border border-gray-200"
                                                        onClick={() => {
                                                            setCarrito((prevCarrito) =>
                                                                prevCarrito.map((producto) =>
                                                                    producto.id === item.id
                                                                        ? { ...producto, cantidad: producto.cantidad + 1 }
                                                                        : producto
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <span className="text-lg font-bold text-gray-800">
                                                        ${subtotal}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Botones de descuento */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => abrirModalDescuento(item)}
                                                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all border border-emerald-200"
                                                >
                                                    {tieneDescuento ? '✏️ Editar Descuento' : '🏷️ Agregar Descuento'}
                                                </button>
                                                {tieneDescuento && (
                                                    <button
                                                        onClick={() => quitarDescuentoProducto(item.id)}
                                                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold transition-all border border-red-200"
                                                    >
                                                        Quitar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : pedidosPendientes.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MdShoppingCart className="text-gray-300 text-4xl" />
                                </div>
                                <p className="text-gray-400 font-medium">Tu carrito está vacío</p>
                                <p className="text-gray-300 text-sm mt-1">Agrega productos para comenzar</p>
                            </div>
                        ) : null}
                    </div>

                    {/* ========== COMENTARIO GENERAL - COLAPSABLE ========== */}
                    {(carrito.length > 0 || pedidosPendientes.length > 0) && (
                        <ComponenteComentario
                            comentario={comentarioGeneral}
                            setComentario={setComentarioGeneral}
                            titulo="💬 Comentario general de la orden"
                            placeholder="Ej: Para llevar, sin servilletas, entregar rápido..."
                            storageKey="comentario_puntoventa"
                        />
                    )}

                    {/* ========== TOTAL DEL CARRITO ========== */}
                    {carrito.length > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-bold text-gray-700">Subtotal</span>
                                <span className="text-2xl font-bold text-green-600">
                                    ${calcularTotalCarrito().toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            
                            <button
                                onClick={() => setModalDescuentoOrdenOpen(true)}
                                className="w-full bg-white hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm font-semibold transition-all border-2 border-green-200 flex items-center justify-center gap-2"
                            >
                                <FaPercent className="text-sm" />
                                {descuentoOrden.aplicado ? 'Editar Descuento General' : 'Agregar Descuento General'}
                            </button>
                            
                            {descuentoOrden.aplicado && (
                                <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 font-medium">
                                            Descuento: {descuentoOrden.tipo === 'porcentaje' ? `${descuentoOrden.valor}%` : `$${descuentoOrden.valor}`}
                                        </span>
                                        <button
                                            onClick={() => {
                                                setDescuentoOrden({ tipo: 'porcentaje', valor: '', aplicado: false });
                                                setMensajeError('');
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========== PEDIDOS PENDIENTES ========== */}
                    {pedidosPendientes.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    Pedidos Pendientes ({pedidosPendientes.length})
                                </h3>
                                <button
                                    onClick={limpiarPedidosPendientes}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                    title="Eliminar todos los pedidos pendientes"
                                >
                                    <MdDelete className="text-xl" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {pedidosPendientes.map((item, index) => {
                                    const precioOriginal = parseFloat(item.price);
                                    const precioConDescuento = calcularPrecioConDescuento(item);
                                    const tieneDescuento = item.descuento && item.descuento.valor !== '' && item.descuento.valor !== '0';
                                    const subtotalOriginal = precioOriginal * item.cantidad;
                                    const subtotalConDescuento = precioConDescuento * item.cantidad;

                                    return (
                                        <div key={index} className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-800 text-base">
                                                        {item.cantidad} x {item.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                        {tieneDescuento ? (
                                                            <>
                                                                <span className="text-sm text-gray-400 line-through">
                                                                    ${precioOriginal.toFixed(2)} c/u
                                                                </span>
                                                                <span className="text-sm text-yellow-700 font-bold">
                                                                    ${precioConDescuento.toFixed(2)} c/u
                                                                </span>
                                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                                                                    -{item.descuento.tipo === 'porcentaje' ? `${item.descuento.valor}%` : `$${item.descuento.valor}`}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-sm text-yellow-700 font-semibold">
                                                                ${precioOriginal.toFixed(2)} c/u
                                                            </span>
                                                        )}
                                                    </div>
                                                    {tieneDescuento && (
                                                        <div className="mt-2 flex justify-between text-sm">
                                                            <span className="text-gray-500 line-through">
                                                                ${subtotalOriginal.toFixed(2)}
                                                            </span>
                                                            <span className="text-yellow-700 font-bold">
                                                                ${subtotalConDescuento.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* Mostrar comentario del producto pendiente */}
                                                    {item.comentario && (
                                                        <p className="text-xs text-gray-600 italic mt-2 bg-yellow-100 px-2 py-1 rounded">
                                                            💬 {item.comentario}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <span className="text-xs bg-yellow-500 text-white px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                                                        ⏳ Pendiente
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Total pendiente mejorado */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 mt-4 border-2 border-yellow-300 shadow-sm">
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 font-medium">Subtotal productos:</span>
                                        <span className="text-gray-800 font-semibold">
                                            ${pedidosPendientes.reduce((total, item) => {
                                                const precioConDescuento = calcularPrecioConDescuento(item);
                                                return total + (precioConDescuento * item.cantidad);
                                            }, 0).toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    {descuentoOrden.aplicado && descuentoOrden.valor !== '' && descuentoOrden.valor !== '0' && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 font-medium">
                                                Descuento general ({descuentoOrden.tipo === 'porcentaje' ? `${descuentoOrden.valor}%` : `$${descuentoOrden.valor}`}):
                                            </span>
                                            <span className="text-red-600 font-semibold">
                                                -${(() => {
                                                    const subtotalConDescuentos = pedidosPendientes.reduce((total, item) => {
                                                        const precioConDescuento = calcularPrecioConDescuento(item);
                                                        return total + (precioConDescuento * item.cantidad);
                                                    }, 0);
                                                    const valorDesc = parseFloat(descuentoOrden.valor);
                                                    if (descuentoOrden.tipo === 'porcentaje') {
                                                        return (subtotalConDescuentos * valorDesc / 100).toFixed(2);
                                                    } else {
                                                        return valorDesc.toFixed(2);
                                                    }
                                                })()}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-center pt-3 border-t-2 border-yellow-400">
                                        <span className="font-bold text-gray-800 text-lg">Total a Pagar:</span>
                                        <span className="text-2xl font-bold text-yellow-700">
                                            ${(() => {
                                                const subtotalConDescuentos = pedidosPendientes.reduce((total, item) => {
                                                    const precioConDescuento = calcularPrecioConDescuento(item);
                                                    return total + (precioConDescuento * item.cantidad);
                                                }, 0);

                                                let totalFinal = subtotalConDescuentos;
                                                if (descuentoOrden.aplicado && descuentoOrden.valor !== '' && descuentoOrden.valor !== '0') {
                                                    const valorDesc = parseFloat(descuentoOrden.valor);
                                                    if (descuentoOrden.tipo === 'porcentaje') {
                                                        totalFinal = subtotalConDescuentos - (subtotalConDescuentos * valorDesc / 100);
                                                    } else {
                                                        totalFinal = Math.max(0, subtotalConDescuentos - valorDesc);
                                                    }
                                                }
                                                
                                                return totalFinal.toFixed(2);
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ========== FOOTER ========== */}
                <div className="px-6 py-4 bg-white border-t-2 border-gray-200 flex-shrink-0 space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    {/* Total siempre visible */}
                    {carrito.length > 0 && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800 text-base">Total Carrito:</span>
                                <span className="text-2xl font-bold text-emerald-600">
                                    ${calcularTotalCarrito().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Mensajes de estado */}
                    {mensajeError && (
                        <div className={`p-3 rounded-lg text-sm font-semibold text-center ${
                            mensajeError.includes('exitosamente') 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            {mensajeError}
                        </div>
                    )}

                    {/* Botón enviar a cocina */}
                    {carrito.length > 0 && (
                        <button
                            className={`w-full py-3.5 rounded-lg font-bold text-base transition-all ${
                                isCreatingOrder 
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                    : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white shadow-md transform hover:scale-[1.01]'
                            }`}
                            onClick={terminarOrden}
                            disabled={isCreatingOrder}
                        >
                            {isCreatingOrder ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Enviando...
                                </span>
                            ) : '🍳 Enviar a Cocina'}
                        </button>
                    )}

                    {/* Botón finalizar orden */}
                    {pedidosPendientes.length > 0 && (
                        <button
                            className="w-full py-3.5 rounded-lg font-bold text-base transition-all bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md transform hover:scale-[1.01]"
                            onClick={() => {
                                finalizarTodasOrdenes();
                                onClose();
                            }}
                        >
                            💳 Finalizar y Cobrar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
