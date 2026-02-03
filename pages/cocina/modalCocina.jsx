import { useRef, useState } from "react";
import { FaTrashAlt, FaTimes, FaPlus, FaCheck, FaUndo } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { MdTableBar } from "react-icons/md";
import { BsClock, BsThreeDotsVertical } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
import postProcessOrder from "../../useCases/postMermas.js";
import { getTicket } from "../../useCases/getTicket.js";

export default function ModalCocina({
    isTableDetailModalOpen,
    setIsTableDetailModalOpen,
    selectedTable,
    visibleDropdown,
    toggleDropdown,
    setSelectedProduct,
    setIsModalOpen,
    setActiveModal,
    activeModal,
    handleCompleteOrder,
    handleCancelOrder,
    isModalOpen,
    selectedProduct,
    handleCancelProduct,
    handleMarkProductPrepared,
    handleUndoProductToPending,
    handleFinalizeCompletedOrder
}) {
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [showPlaceholderModal, setShowPlaceholderModal] = useState(false);
    const [showUndoModal, setShowUndoModal] = useState(false);
    const [selectedProductForUndo, setSelectedProductForUndo] = useState(null);

    if (!isTableDetailModalOpen && !activeModal && !isModalOpen && !showPlaceholderModal) return null;

    return (
        <>
            {/* Modal de detalles de mesa */}
            {isTableDetailModalOpen && selectedTable && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsTableDetailModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 modal max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-green-100 relative"
                        style={{
                            background: "linear-gradient(135deg, #e6f9f0 0%, #f7fff7 100%)",
                            boxShadow: "0 8px 32px 0 rgba(34,197,94,0.15), 0 1.5px 8px 0 rgba(16,185,129,0.10)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => setIsTableDetailModalOpen(false)}
                                className="text-gray-500 hover:text-green-600 text-2xl bg-white rounded-full shadow-md p-2 transition-all"
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex items-center mb-6 gap-3">
                            <MdTableBar className="text-3xl text-green-600" />
                            <h2 className="text-2xl font-bold text-gray-800">Mesa {selectedTable.tableNumber}</h2>
                            {selectedTable.ticketNumber && (
                                <span className={`px-2 py-1 text-sm rounded font-semibold border
                                    ${selectedTable.type === 'pending' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                    ${selectedTable.type === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                    ${selectedTable.type === 'finished' ? 'bg-gray-50 text-gray-800 border-gray-300' : ''}
                                    ${selectedTable.type === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                `}>
                                    #{selectedTable.ticketNumber}
                                </span>
                            )}
                            <span className={`ml-2 px-2 py-1 text-xs rounded font-semibold
                                ${selectedTable.type === 'finished'
                                    ? "bg-gray-100 text-gray-800"
                                    : selectedTable.type === 'cancelled'
                                        ? "bg-red-100 text-red-800"
                                        : selectedTable.type === 'completed'
                                            ? "bg-green-100 text-green-800"
                                            : "bg-blue-100 text-blue-800"
                                }`}>
                                {selectedTable.type === 'finished' ? 'Finalizado' :
                                    selectedTable.type === 'cancelled' ? 'Cancelado' :
                                        selectedTable.type === 'completed' ? 'Preparado' : 'Pendiente'}
                            </span>
                        </div>
                        <div className="flex justify-between mb-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <LuCalendarDays className="mr-1" />
                                <span>{new Date(selectedTable.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                                <BsClock className="mr-1" />
                                <span>{new Date(selectedTable.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        {selectedTable.isEmpty ? (
                            <div className="text-center py-8">
                                <p className="text-xl text-gray-400">Mesa sin ocupar</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold mb-3">Productos ({selectedTable.products.length})</h3>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {selectedTable.products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                                            >
                                                <div className="flex-1">
                                                    <p className={`font-semibold ${product.status === 'Cancelado' ? 'line-through text-red-500' : ''
                                                        }`}>
                                                        {product.name}
                                                        {product.status === 'Cancelado' && (
                                                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                                                                Cancelado
                                                            </span>
                                                        )}
                                                        {product.status === 'Finalizado' && (
                                                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">
                                                                Finalizado
                                                            </span>
                                                        )}
                                                        {product.status === 'Preparado' && (
                                                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                                                                Preparado
                                                            </span>
                                                        )}
                                                    </p>
                                                    {product.note && (
                                                        <p className="text-xs text-gray-600 flex items-center mt-1">
                                                            {product.note.toLowerCase().includes("sin") ?
                                                                <FaTimes className="text-red-500 mr-1" />
                                                                : <FaPlus className="text-green-600 mr-1" />}
                                                            {product.note}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="bg-white px-2 py-1 rounded border text-sm font-semibold">
                                                        X{product.quantity}
                                                    </span>
                                                    {/* Botones para comandas pendientes - Ocultar para Mesa 1 */}
                                                    {(selectedTable.type === 'pending' || selectedTable.type === undefined) &&
                                                        product.status !== 'Cancelado' &&
                                                        product.status !== 'Preparado' &&
                                                        selectedTable.tableNumber !== 1 && (
                                                            <>
                                                                <button
                                                                    className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full shadow hover:scale-110 transition-all"
                                                                    onClick={() => handleMarkProductPrepared(product.id)}
                                                                    title="Marcar como preparado"
                                                                >
                                                                    <FaCheck className="text-green-600 text-xl" />
                                                                </button>
                                                                <button
                                                                    className="p-2 bg-gradient-to-r from-red-100 to-orange-100 rounded-full shadow hover:scale-110 transition-all"
                                                                    onClick={() => {
                                                                        setSelectedProduct(product);
                                                                        setIsModalOpen(true);
                                                                    }}
                                                                    title="Cancelar producto"
                                                                >
                                                                    <FaTrashAlt className="text-red-500 text-xl" />
                                                                </button>
                                                            </>
                                                        )}
                                                    {/* Botón de undo para comandas completadas */}
                                                    {selectedTable.type === 'completed' &&
                                                        product.status === 'Preparado' && (
                                                            <button
                                                                className="p-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full shadow hover:scale-110 transition-all"
                                                                onClick={() => {
                                                                    setSelectedProductForUndo(product);
                                                                    setShowUndoModal(true);
                                                                }}
                                                                title="Regresar a cocina"
                                                            >
                                                                <FaUndo className="text-orange-600 text-xl" />
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Solo mostrar botones si hay productos que se pueden actualizar */}
                                {selectedTable.type === 'pending' && selectedTable.products.some(product =>
                                    product.status === 'Pendiente' || product.status === undefined
                                ) && (
                                        <div className="flex justify-between space-x-4">
                                            <button
                                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold cursor-pointer rounded-md py-3 px-6 flex-1 shadow-lg hover:scale-105 transition-all"
                                                onClick={() => setActiveModal("realizado")}
                                            >
                                                Realizado
                                            </button>
                                            <button
                                                className="bg-gradient-to-r from-red-500 to-orange-600 text-white text-lg font-bold cursor-pointer rounded-md py-3 px-6 flex-1 shadow-lg hover:scale-105 transition-all"
                                                onClick={() => setActiveModal("cancelar")}
                                            >
                                                Cancelar Orden
                                            </button>
                                        </div>
                                    )}

                                {/* Mostrar botones para comandas completadas */}
                                {selectedTable.type === 'completed' && (
                                    <div className="space-y-4">
                                        <div className="bg-green-100 rounded-lg p-4 text-center">
                                            <p className="text-green-600 font-semibold">
                                                Todos los productos de esta comanda están preparados
                                            </p>
                                        </div>
                                        <div className="flex justify-between space-x-4">
                                            <button
                                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold cursor-pointer rounded-md py-3 px-6 flex-1 shadow-lg hover:scale-105 transition-all"
                                                onClick={() => setActiveModal("finalizarCompletada")}
                                            >
                                                Finalizar Orden
                                            </button>
                                            <button
                                                className="bg-gradient-to-r from-red-500 to-orange-600 text-white text-lg font-bold cursor-pointer rounded-md py-3 px-6 flex-1 shadow-lg hover:scale-105 transition-all"
                                                onClick={() => setActiveModal("cancelarCompletada")}
                                            >
                                                Cancelar Orden
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Mostrar mensaje informativo para comandas finalizadas y canceladas */}
                                {selectedTable.type === 'finished' && (
                                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                                        <p className="text-gray-600 font-semibold">
                                            Esta comanda ya ha sido finalizada
                                        </p>
                                    </div>
                                )}

                                {selectedTable.type === 'cancelled' && (
                                    <div className="bg-red-100 rounded-lg p-4 text-center">
                                        <p className="text-red-600 font-semibold">
                                            Esta comanda ha sido cancelada
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de confirmación "Realizado" */}
            {activeModal === "realizado" && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 modal shadow-2xl border border-green-100 max-w-md w-full relative"
                        style={{
                            background: "linear-gradient(135deg, #e6f9f0 0%, #f7fff7 100%)",
                            boxShadow: "0 8px 32px 0 rgba(34,197,94,0.15), 0 1.5px 8px 0 rgba(16,185,129,0.10)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4 text-gray-800">
                            {selectedTable?.tableNumber === 1
                                ? "¿Finalizar y entregar la orden completa?"
                                : "¿Marcar productos como preparados?"
                            }
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                            {selectedTable?.tableNumber === 1
                                ? "La orden se finalizará completamente y pasará a comandas finalizadas."
                                : "Los productos pasarán a comandas completadas (preparados)."
                            }
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md font-semibold transition-all"
                                onClick={() => setActiveModal(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-md font-bold shadow-lg hover:scale-105 transition-all"
                                onClick={handleCompleteOrder}
                            >
                                {selectedTable?.tableNumber === 1 ? "Finalizar Orden" : "Marcar Preparado"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para finalizar comanda completada */}
            {activeModal === "finalizarCompletada" && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 modal shadow-2xl border border-green-100 max-w-md w-full relative"
                        style={{
                            background: "linear-gradient(135deg, #e6f9f0 0%, #f7fff7 100%)",
                            boxShadow: "0 8px 32px 0 rgba(34,197,94,0.15), 0 1.5px 8px 0 rgba(16,185,129,0.10)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4 text-gray-800">
                            ¿Finalizar orden completada?
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            La orden de la Mesa {selectedTable?.tableNumber} será marcada como finalizada y pagada.
                        </p>

                        {/* Aviso importante */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-xs text-blue-700 font-semibold mb-1">
                                ⚠️ Importante
                            </p>
                            <p className="text-xs text-blue-600">
                                Al finalizar desde cocina, también se finalizará en el menú del cliente, se va a liberar la mesa y se generará el ticket.
                            </p>
                        </div>

                        {/* Selector de método de pago */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Método de Pago
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setMetodoPago('efectivo')}
                                    className={`p-3 rounded-lg border-2 transition-all ${metodoPago === 'efectivo'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">💵</div>
                                        <div className="text-sm font-semibold">Efectivo</div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setMetodoPago('tarjeta')}
                                    className={`p-3 rounded-lg border-2 transition-all ${metodoPago === 'tarjeta'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">💳</div>
                                        <div className="text-sm font-semibold">Tarjeta</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md font-semibold transition-all"
                                onClick={() => {
                                    setActiveModal(null);
                                    setMetodoPago('efectivo');
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-md font-bold shadow-lg hover:scale-105 transition-all"
                                onClick={() => {
                                    // Agregar método de pago al selectedTable antes de finalizar
                                    if (selectedTable) {
                                        selectedTable.metodoPago = metodoPago;
                                    }
                                    handleFinalizeCompletedOrder();
                                    setMetodoPago('efectivo');
                                }}
                            >
                                Finalizar Orden
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para cancelar comanda completada */}
            {activeModal === "cancelarCompletada" && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 modal shadow-2xl border border-red-100 max-w-md w-full relative"
                        style={{
                            background: "linear-gradient(135deg, #fff5f5 0%, #fff7f7 100%)",
                            boxShadow: "0 8px 32px 0 rgba(239,68,68,0.10), 0 1.5px 8px 0 rgba(251,191,36,0.10)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4 text-red-700">¿Estás seguro de cancelar la orden completada?</p>
                        <p className="text-sm text-gray-600 mb-6">
                            Se cancelará toda la orden de la Mesa {selectedTable?.tableNumber} y la mesa quedará libre.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md font-semibold transition-all"
                                onClick={() => setActiveModal(null)}
                            >
                                No
                            </button>
                            <button
                                className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-md font-bold shadow-lg hover:scale-105 transition-all"
                                onClick={async () => {
                                    try {
                                        setActiveModal(null);

                                        // Obtener datos del ticket
                                        const ticketData = await getTicket(selectedTable.orderUuid);

                                        // Llamar a postProcessOrder con is_merma: false
                                        await postProcessOrder({
                                            order_uuid: ticketData.order_uuid,
                                            order_status: "Cancelado",
                                            is_merma: false
                                        });

                                        // Cancelar la orden
                                        handleCancelOrder();
                                    } catch (error) {
                                        console.error('Error al procesar la orden:', error);
                                        // Continuar con la cancelación aunque falle el proceso de mermas
                                        handleCancelOrder();
                                    }
                                }}
                            >
                                Sí, cancelar orden
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === "cancelar" && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 modal shadow-2xl border border-red-100 max-w-md w-full relative"
                        style={{
                            background: "linear-gradient(135deg, #fff5f5 0%, #fff7f7 100%)",
                            boxShadow: "0 8px 32px 0 rgba(239,68,68,0.10), 0 1.5px 8px 0 rgba(251,191,36,0.10)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4 text-red-700">¿Estás seguro de cancelar toda la orden?</p>
                        <p className="text-sm text-gray-600 mb-6">
                            Se cancelarán todos los productos de la Mesa {selectedTable?.tableNumber} y la orden completa.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md font-semibold transition-all"
                                onClick={() => setActiveModal(null)}
                            >
                                No
                            </button>
                            <button
                                className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-md font-bold shadow-lg hover:scale-105 transition-all"
                                onClick={async () => {
                                    try {
                                        setActiveModal(null);

                                        // Obtener datos del ticket
                                        const ticketData = await getTicket(selectedTable.orderUuid);

                                        // Llamar a postProcessOrder con is_merma: false
                                        await postProcessOrder({
                                            order_uuid: ticketData.order_uuid,
                                            order_status: "Cancelado",
                                            is_merma: false
                                        });

                                        // Cancelar la orden
                                        handleCancelOrder();
                                    } catch (error) {
                                        console.error('Error al procesar la orden:', error);
                                        // Continuar con la cancelación aunque falle el proceso de mermas
                                        handleCancelOrder();
                                    }
                                }}
                            >
                                Sí, cancelar orden
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal placeholder para funcionalidad futura */}
            {showPlaceholderModal && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setShowPlaceholderModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 modal shadow-2xl border border-blue-100 max-w-md w-full relative"
                        style={{
                            background: "linear-gradient(135deg, #eff6ff 0%, #f7fff7 100%)",
                            boxShadow: "0 8px 32px 0 rgba(59,130,246,0.15), 0 1.5px 8px 0 rgba(96,165,250,0.10)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4 text-blue-700">Modal de Ejemplo</p>
                        <p className="text-sm text-gray-600 mb-6">
                            Este es un modal simple que puedes modificar y personalizar más adelante.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md font-bold shadow-lg hover:scale-105 transition-all"
                                onClick={() => {
                                    setShowPlaceholderModal(false);
                                    handleCancelOrder();
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && selectedProduct && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-10 modal shadow-2xl border-2 border-red-200 max-w-lg w-full relative flex flex-col items-center"
                        style={{
                            background: "linear-gradient(135deg, #fff5f5 0%, #fff7f7 100%)",
                            boxShadow: "0 8px 32px 0 rgba(239,68,68,0.10), 0 1.5px 8px 0 rgba(251,191,36,0.10)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl bg-white rounded-full shadow-md p-2 transition-all"
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                        <FaTrashAlt className="text-5xl text-red-400 mb-4" />
                        <p className="text-2xl font-bold mb-4 text-red-700 text-center">
                            ¿Seguro que deseas cancelar el producto?
                        </p>
                        <p className="text-lg text-gray-700 mb-6 text-center">
                            <span className="font-semibold text-red-600">"{selectedProduct.name}"</span>
                        </p>
                        <div className="flex justify-center space-x-6 mt-2 w-full">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-md font-semibold transition-all text-lg"
                                onClick={() => setIsModalOpen(false)}
                            >
                                No
                            </button>
                            <button
                                className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-3 rounded-md font-bold shadow-lg hover:scale-105 transition-all text-lg"
                                onClick={() => handleCancelProduct(selectedProduct.id)}
                            >
                                Sí, cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para regresar producto a cocina */}
            {showUndoModal && selectedProductForUndo && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setShowUndoModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-10 modal shadow-2xl border-2 border-orange-200 max-w-lg w-full relative flex flex-col items-center"
                        style={{
                            background: "linear-gradient(135deg, #fff7ed 0%, #fffbf7 100%)",
                            boxShadow: "0 8px 32px 0 rgba(251,146,60,0.15), 0 1.5px 8px 0 rgba(251,191,36,0.10)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowUndoModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-orange-600 text-2xl bg-white rounded-full shadow-md p-2 transition-all"
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                        <FaUndo className="text-5xl text-orange-500 mb-4" />
                        <p className="text-2xl font-bold mb-4 text-orange-700 text-center">
                            ¿Deseas mandar este producto nuevamente a cocina para su preparación?
                        </p>
                        <p className="text-lg text-gray-700 mb-6 text-center">
                            <span className="font-semibold text-orange-600">"{selectedProductForUndo.name}"</span>
                        </p>
                        <div className="flex justify-center space-x-6 mt-2 w-full">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-md font-semibold transition-all text-lg"
                                onClick={() => {
                                    setShowUndoModal(false);
                                    setSelectedProductForUndo(null);
                                }}
                            >
                                No
                            </button>
                            <button
                                className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-md font-bold shadow-lg hover:scale-105 transition-all text-lg"
                                onClick={() => {
                                    handleUndoProductToPending(selectedProductForUndo.id);
                                    setShowUndoModal(false);
                                    setSelectedProductForUndo(null);
                                }}
                            >
                                Sí, regresar a cocina
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
