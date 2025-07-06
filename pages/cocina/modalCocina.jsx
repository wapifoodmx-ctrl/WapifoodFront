import { useRef } from "react";
import { FaTrashAlt, FaTimes, FaPlus } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { MdTableBar } from "react-icons/md";
import { BsClock, BsThreeDotsVertical } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";

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
    handleCancelProduct
}) {
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    if (!isTableDetailModalOpen && !activeModal && !isModalOpen) return null;

    return (
        <>
            {/* Modal de detalles de mesa */}
            {isTableDetailModalOpen && selectedTable && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsTableDetailModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 modal max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <MdTableBar className="text-2xl mr-2" />
                                <h2 className="text-2xl font-bold">Mesa {selectedTable.tableNumber}</h2>
                                {/* Solo mostrar el tipo de comanda, no el estado de backend */}
                                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                                    selectedTable.type === 'finished' 
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
                            <button
                                onClick={() => setIsTableDetailModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="flex justify-between mb-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <LuCalendarDays className="mr-1" />
                                <span>{new Date(selectedTable.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                                <BsClock className="mr-1" />
                                <span>{new Date(selectedTable.timestamp).toLocaleTimeString()}</span>
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
                                                className="bg-gray-50 rounded-lg p-3 flex justify-between items-center"
                                            >
                                                <div className="flex-1">
                                                    <p className={`font-semibold ${
                                                        product.status === 'Cancelado' ? 'line-through text-red-500' : ''
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
                                                    {/* Solo mostrar dropdown para comandas pendientes y productos no cancelados */}
                                                    {(selectedTable.type === 'pending' || selectedTable.type === undefined) && 
                                                     product.status !== 'Cancelado' && 
                                                     product.status !== 'Preparado' && (
                                                        <div className="relative" ref={dropdownRef}>
                                                            <button
                                                                className="p-1 hover:bg-gray-200 rounded"
                                                                onClick={() => toggleDropdown(product.id)}
                                                            >
                                                                <BsThreeDotsVertical className="text-gray-500" />
                                                            </button>
                                                            {visibleDropdown === product.id && (
                                                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                                                                    <button
                                                                        ref={buttonRef}
                                                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                                                                        onClick={() => {
                                                                            setSelectedProduct(product);
                                                                            setIsModalOpen(true);
                                                                            toggleDropdown(null); // Cerrar dropdown
                                                                        }}
                                                                    >
                                                                        <FaTrashAlt className="mr-2" />
                                                                        Cancelar producto
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
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
                                            className="bg-green-600 text-white text-lg font-bold cursor-pointer rounded-md py-3 px-6 flex-1"
                                            onClick={() => setActiveModal("realizado")}
                                        >
                                            Realizado
                                        </button>
                                        <button
                                            className="bg-red-600 text-white text-lg font-bold cursor-pointer rounded-md py-3 px-6 flex-1"
                                            onClick={() => setActiveModal("cancelar")}
                                        >
                                            Cancelar Orden
                                        </button>
                                    </div>
                                )}

                                {/* Mostrar mensaje informativo para comandas completadas */}
                                {selectedTable.type === 'completed' && (
                                    <div className="bg-green-100 rounded-lg p-4 text-center">
                                        <p className="text-green-600 font-semibold">
                                            Todos los productos de esta comanda están preparados
                                        </p>
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
                        className="bg-white rounded-lg p-6 modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4">
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
                                className="bg-gray-300 px-4 py-2 rounded-md"
                                onClick={() => setActiveModal(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md"
                                onClick={handleCompleteOrder}
                            >
                                {selectedTable?.tableNumber === 1 ? "Finalizar Orden" : "Marcar Preparado"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación "Cancelar" */}
            {activeModal === "cancelar" && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="bg-white rounded-lg p-6 modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4">¿Estás seguro de cancelar toda la orden?</p>
                        <p className="text-sm text-gray-600 mb-6">
                            Se cancelarán todos los productos de la Mesa {selectedTable?.tableNumber} y la orden completa.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded-md"
                                onClick={() => setActiveModal(null)}
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={handleCancelOrder}
                            >
                                Sí, cancelar orden
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de cancelación de producto */}
            {isModalOpen && selectedProduct && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4">
                            ¿Seguro que desea cancelar el producto "{selectedProduct.name}"?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded-md"
                                onClick={() => setIsModalOpen(false)}
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={() => handleCancelProduct(selectedProduct.id)}
                            >
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}