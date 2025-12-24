import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GoDotFill } from "react-icons/go";
import { MdTableBar } from "react-icons/md";
import { BsClock } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { getTables } from "../../useCases/getTables.js";
import getOrdersDia from "../../useCases/getOrdersDia.js";
import { updateProductStatus } from "../../useCases/updateProductStatus.js";
import { cancelOrder } from "../../useCases/cancelOrder.js";
import { endPuntoDeVenta } from "../../useCases/endPuntoDeVenta.js";
import { updateTableStatus } from "../../useCases/tablesStatus.js";
import { getTicket } from "../../useCases/getTicket.js";
import postProcessOrder from "../../useCases/postMermas.js";
import { toast } from "@/components/Toast";
import ModalCocina from "./modalCocina.jsx";

export default function VistaCocina() {
    const router = useRouter();
    const [visibleDropdown, setVisibleDropdown] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [view, setView] = useState("all");
    const [isTableDetailModalOpen, setIsTableDetailModalOpen] = useState(false);

    const [apiTables, setApiTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [completedTables, setCompletedTables] = useState([]);
    const [cancelledTables, setCancelledTables] = useState([]);
    const [finishedTables, setFinishedTables] = useState([]);

    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [countdown, setCountdown] = useState(10);

    // Nuevos estados para la funcionalidad de mesas
    const [unavailableTables, setUnavailableTables] = useState([]);
    const [showReleaseModal, setShowReleaseModal] = useState(false);
    const [selectedTableToRelease, setSelectedTableToRelease] = useState(null);
    const [tablesData, setTablesData] = useState(null);

    // Estado para confirmación de cancelar orden finalizada
    const [showConfirmCancelFinalized, setShowConfirmCancelFinalized] = useState(false);
    const [ordenFinalizadaParaCancelar, setOrdenFinalizadaParaCancelar] = useState(null);

    const fetchTablesData = async () => {
        try {
            setLoading(true);

            const [ordersResponse, tablesData] = await Promise.all([
                getOrdersDia(),
                getTables()
            ]);

            // Verificar errores en la respuesta de órdenes
            if (!ordersResponse.success) {
                throw new Error(ordersResponse.error);
            }

            // Verificar errores de suscripción en las tablas
            if (tablesData.error && tablesData.status === 403) {
                setShowSubscriptionModal(true);
                setCountdown(10); // Resetear el contador
                setLoading(false);
                return;
            }

            const ordersData = ordersResponse.data;

            // console.log("Orders data:", ordersData);
            // console.log("Tables data:", tablesData);

            // Guardar los datos de las tablas en el estado
            setTablesData(tablesData);

            const tableGroups = {};

            ordersData.forEach(order => {
                const tableNumber = order.mesa_number;
                const realStatus = tablesData.table_status[tableNumber.toString()] || "Libre";

                const pendingProducts = order.products.filter(product => product.order_detail_status === "Pendiente");
                const completedProducts = order.products.filter(product => product.order_detail_status === "Preparado");
                const finishedProducts = order.products.filter(product => product.order_detail_status === "Finalizado");
                const cancelledProducts = order.products.filter(product => product.order_detail_status === "Cancelado");

                if (pendingProducts.length > 0) {
                    const pendingKey = `${tableNumber}-${order.id_orders}-pending`;
                    if (!tableGroups[pendingKey]) {
                        tableGroups[pendingKey] = {
                            tableNumber: tableNumber,
                            status: realStatus,
                            products: [],
                            timestamp: order.date_time,
                            isEmpty: false,
                            orders: [],
                            type: 'pending',
                            orderId: order.id_orders,
                            orderUuid: order.order_uuid
                        };
                    }

                    pendingProducts.forEach(product => {
                        tableGroups[pendingKey].products.push({
                            id: product.id_orders_details,
                            name: product.product_name,
                            quantity: product.quantity,
                            note: "",
                            orderId: order.id_orders,
                            orderUuid: order.order_uuid,
                            status: product.order_detail_status
                        });
                    });

                    tableGroups[pendingKey].metodoPago = order.metodo_pago || 'efectivo';
                    tableGroups[pendingKey].orders.push(order);
                }

                if (completedProducts.length > 0) {
                    const completedKey = `${tableNumber}-${order.id_orders}-completed`;
                    if (!tableGroups[completedKey]) {
                        tableGroups[completedKey] = {
                            tableNumber: tableNumber,
                            status: realStatus,
                            products: [],
                            timestamp: order.date_time,
                            isEmpty: false,
                            orders: [],
                            type: 'completed',
                            orderId: order.id_orders,
                            orderUuid: order.order_uuid
                        };
                    }

                    completedProducts.forEach(product => {
                        tableGroups[completedKey].products.push({
                            id: product.id_orders_details,
                            name: product.product_name,
                            quantity: product.quantity,
                            note: "",
                            orderId: order.id_orders,
                            orderUuid: order.order_uuid,
                            status: product.order_detail_status
                        });
                    });

                    tableGroups[completedKey].orders.push(order);
                }

                if (finishedProducts.length > 0) {
                    const finishedKey = `${tableNumber}-${order.id_orders}-finished`;
                    if (!tableGroups[finishedKey]) {
                        tableGroups[finishedKey] = {
                            tableNumber: tableNumber,
                            status: realStatus,
                            products: [],
                            timestamp: order.date_time,
                            isEmpty: false,
                            orders: [],
                            type: 'finished',
                            orderId: order.id_orders,
                            orderUuid: order.order_uuid
                        };
                    }

                    order.products.forEach(product => {
                        tableGroups[finishedKey].products.push({
                            id: product.id_orders_details,
                            name: product.product_name,
                            quantity: product.quantity,
                            note: "",
                            orderId: order.id_orders,
                            orderUuid: order.order_uuid,
                            status: product.order_detail_status
                        });
                    });

                    tableGroups[finishedKey].orders.push(order);
                }
            });

            const cancelledOrders = ordersData.filter(order => order.order_status === "Cancelado");

            cancelledOrders.forEach(order => {
                const tableNumber = order.mesa_number;
                const realStatus = tablesData.table_status[tableNumber.toString()] || "Libre";
                const cancelledKey = `${tableNumber}-${order.id_orders}-cancelled`;

                if (!tableGroups[cancelledKey]) {
                    tableGroups[cancelledKey] = {
                        tableNumber: tableNumber,
                        status: realStatus,
                        products: [],
                        timestamp: order.date_time,
                        isEmpty: false,
                        orders: [],
                        type: 'cancelled',
                        orderId: order.id_orders,
                        orderUuid: order.order_uuid
                    };
                }

                order.products.forEach(product => {
                    tableGroups[cancelledKey].products.push({
                        id: product.id_orders_details,
                        name: product.product_name,
                        quantity: product.quantity,
                        note: "",
                        orderId: order.id_orders,
                        orderUuid: order.order_uuid,
                        status: product.order_detail_status
                    });
                });

                tableGroups[cancelledKey].orders.push(order);
            });

            const unavailableTables = Object.entries(tablesData.table_status)
                .filter(([tableNumber, status]) => status === "NoDisponible")
                .map(([tableNumber, status]) => ({
                    tableNumber: parseInt(tableNumber),
                    status: status,
                    products: [],
                    timestamp: new Date().toISOString(),
                    isEmpty: true,
                    type: 'unavailable'
                }));

            // Nuevo: Guardar mesas no disponibles en su propio estado
            setUnavailableTables(unavailableTables);

            const allTables = [...Object.values(tableGroups), ...unavailableTables];

            // Ordenar por timestamp descendente (más reciente primero) y luego por número de mesa
            allTables.sort((a, b) => {
                // Primero ordenar por si están vacías (mesas no disponibles van al final)
                if (a.isEmpty !== b.isEmpty) {
                    return a.isEmpty - b.isEmpty;
                }

                // Para mesas con órdenes, ordenar por timestamp descendente (más reciente primero)
                if (!a.isEmpty && !b.isEmpty) {
                    const dateA = new Date(a.timestamp);
                    const dateB = new Date(b.timestamp);
                    return dateB.getTime() - dateA.getTime(); // Descendente
                }

                // Para mesas vacías, ordenar por número de mesa
                return a.tableNumber - b.tableNumber;
            });

            const pendingTables = allTables.filter(table => table.type === 'pending' || table.isEmpty);
            const completedTables = allTables.filter(table => table.type === 'completed');
            const finishedTables = allTables.filter(table => table.type === 'finished');
            const cancelledTables = allTables.filter(table => table.type === 'cancelled');

            // Ordenar cada tipo por timestamp descendente también
            completedTables.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            finishedTables.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            cancelledTables.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            setApiTables(pendingTables);
            setCompletedTables(completedTables);
            setCancelledTables(cancelledTables);
            setFinishedTables(finishedTables);

        } catch (err) {
            setError(err.message);
            console.error("Error al cargar las órdenes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTablesData();
        const interval = setInterval(() => {
            fetchTablesData();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Agregar este nuevo useEffect para el contador
    useEffect(() => {
        let countdownInterval;

        if (showSubscriptionModal && countdown > 0) {
            countdownInterval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (showSubscriptionModal && countdown === 0) {
            // Cuando el contador llega a 0, redirigir automáticamente
            handleGoToPayments();
        }

        return () => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        };
    }, [showSubscriptionModal, countdown]);

    const toggleDropdown = (id) => {
        setVisibleDropdown(visibleDropdown === id ? null : id);
    };

    const handleCancelProduct = async (productId) => {
        try {
            const product = selectedTable.products.find(p => p.id === productId);
            if (!product) {
                console.error('Producto no encontrado');
                return;
            }

            const orderUuid = selectedTable.orderUuid;

            await updateProductStatus(orderUuid, product.id, 'Cancelado');

            // Actualiza la lista de productos localmente
            const updatedProducts = selectedTable.products.filter(p => p.id !== productId);
            const updatedTable = { ...selectedTable, products: updatedProducts };

            setSelectedTable(updatedTable);

            // Si ya no hay productos, cierra ambas modales
            if (updatedProducts.length === 0) {
                setIsModalOpen(false);
                setIsTableDetailModalOpen(false);
            } else {
                setIsModalOpen(false);
            }

            setVisibleDropdown(null);
            await fetchTablesData();
            // console.log('Producto cancelado exitosamente');
        } catch (error) {
            console.error('Error al cancelar el producto:', error);
            alert('Error al cancelar el producto: ' + error.message);
        }
    };

    const handleCompleteOrder = async () => {
        try {
            if (!selectedTable || !selectedTable.products || selectedTable.products.length === 0) {
                console.error('No hay productos para completar');
                return;
            }

            const activeProducts = selectedTable.products.filter(p => p.status !== 'Cancelado');

            if (activeProducts.length === 0) {
                alert('No hay productos activos para completar');
                return;
            }

            const orderUuid = selectedTable.orderUuid;

            if (selectedTable.tableNumber === 1) {
                // Mesa 1 (Punto de Venta) - Finalizar orden completa
                const metodoPago = selectedTable.metodoPago || 'efectivo';
                await endPuntoDeVenta(orderUuid, metodoPago);
                toast.success("Orden finalizada exitosamente");
            } else {
                // Mesa normal - Marcar productos como preparados
                const productIds = activeProducts.map(product => product.id);
                await updateProductStatus(orderUuid, productIds, 'Preparado');
                toast.success("Productos marcados como preparados");
            }

            // Refrescar datos desde el servidor para obtener el estado actualizado
            await fetchTablesData();

            setActiveModal(null);
            setIsTableDetailModalOpen(false);

        } catch (error) {
            console.error('Error al completar la orden:', error);
            alert('Error al completar la orden: ' + error.message);
        }
    };

    // Función para verificar si la orden está finalizada antes de cancelar
    const verificarYCancelarOrden = async () => {
        try {
            if (!selectedTable || !selectedTable.orderUuid) {
                console.error('No se encontró la orden para cancelar');
                return;
            }

            // Verificar estado actual de la orden
            const ticketData = await getTicket(selectedTable.orderUuid);

            if (ticketData && ticketData.order_status === "Finalizado") {
                // La orden ya está finalizada, mostrar confirmación extra
                setOrdenFinalizadaParaCancelar(selectedTable);
                setShowConfirmCancelFinalized(true);
                setActiveModal(null); // Cerrar modal de confirmación anterior
                return;
            }

            // Si no está finalizada, proceder con la cancelación normal
            await handleCancelOrder();
        } catch (error) {
            console.error('Error al verificar estado de la orden:', error);
            // Si hay error, proceder con la cancelación normal
            await handleCancelOrder();
        }
    };

    // Función para cancelar orden finalizada (después de confirmación extra)
    const confirmarCancelarOrdenFinalizada = async () => {
        setShowConfirmCancelFinalized(false);
        if (ordenFinalizadaParaCancelar) {
            setSelectedTable(ordenFinalizadaParaCancelar);
            await handleCancelOrder();
            setOrdenFinalizadaParaCancelar(null);
        }
    };

    const handleCancelOrder = async () => {
        try {
            if (!selectedTable || !selectedTable.orderUuid) {
                console.error('No se encontró la orden para cancelar');
                return;
            }

            const orderUuid = selectedTable.orderUuid;

            await cancelOrder(orderUuid);

            // Refrescar datos desde el servidor
            await fetchTablesData();

            setActiveModal(null);
            setIsTableDetailModalOpen(false);
            toast.success('Orden cancelada exitosamente');
        } catch (error) {
            console.error('Error al cancelar la orden:', error);
            toast.error('Error al cancelar la orden: ' + error.message);
        }
    };

    // Nueva función para finalizar comandas completadas
    const handleFinalizeCompletedOrder = async () => {
        try {
            if (!selectedTable || !selectedTable.orderUuid) {
                console.error('No se encontró la orden para finalizar');
                return;
            }

            const orderUuid = selectedTable.orderUuid;
            const tableNumber = selectedTable.tableNumber;

            // Finalizar la orden usando endPuntoDeVenta
            const metodoPago = selectedTable.metodoPago || 'efectivo';
            await endPuntoDeVenta(orderUuid, metodoPago);

            // Si es Mesa 1 (Punto de Venta), descontar del inventario
            if (tableNumber === 1) {
                try {
                    console.log('Procesando descuento de inventario para Mesa 1 desde Cocina...');
                    const ticketData = await getTicket(orderUuid);

                    const orderData = {
                        order_uuid: ticketData.order_uuid || orderUuid,
                        order_status: ticketData.order_status,
                        is_merma: false
                    };

                    await postProcessOrder(orderData);
                    console.log('Inventario descontado exitosamente para Mesa 1');
                } catch (error) {
                    console.error('Error al descontar inventario para Mesa 1:', error);
                    toast.warning('La orden se finalizó, pero hubo un error al descontar del inventario.');
                }
            }

            // Si no es mesa 1, liberar la mesa
            if (tableNumber !== 1 && tablesData) {
                await updateTableStatus(tableNumber, 'Libre');
            }

            // Mover de completedTables a finishedTables
            setCompletedTables((prevCompleted) =>
                prevCompleted.filter((table) => {
                    if (table.orderUuid === orderUuid) {
                        setFinishedTables((prevFinished) => [...prevFinished, {
                            ...table,
                            type: 'finished',
                            products: table.products.map(p => ({ ...p, status: 'Finalizado' }))
                        }]);
                        return false;
                    }
                    return true;
                })
            );

            await fetchTablesData();

            setActiveModal(null);
            setIsTableDetailModalOpen(false);

            // console.log('Comanda completada finalizada exitosamente');
        } catch (error) {
            console.error('Error al finalizar la comanda completada:', error);
            alert('Error al finalizar la comanda: ' + error.message);
        }
    };

    // Nuevas funciones para liberar mesas
    const handleReleaseTable = (tableNumber) => {
        setSelectedTableToRelease(tableNumber);
        setShowReleaseModal(true);
    };

    const confirmReleaseTable = async () => {
        try {
            // console.log(`Liberando mesa ${selectedTableToRelease}`);

            // Cambiar el estado de la mesa de "NoDisponible" a "Libre"
            await updateTableStatus(selectedTableToRelease, 'Libre');

            // console.log(`Mesa ${selectedTableToRelease} liberada exitosamente`);

            // Actualizar los datos para reflejar el cambio
            await fetchTablesData();

            setShowReleaseModal(false);
            setSelectedTableToRelease(null);
        } catch (error) {
            console.error('Error al liberar la mesa:', error);
            alert('Error al liberar la mesa: ' + error.message);
        }
    };

    const cancelReleaseTable = () => {
        setShowReleaseModal(false);
        setSelectedTableToRelease(null);
    };

    // Función para cerrar modal al hacer clic fuera
    const handleModalBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            cancelReleaseTable();
        }
    };

    const openTableDetail = async (table) => {
        // Verificar si la orden ya fue finalizada desde otro dispositivo
        if (table.orderUuid) {
            try {
                const ticketData = await getTicket(table.orderUuid);

                if (ticketData && ticketData.order_status === "Finalizado") {
                    // La orden ya fue finalizada desde otro dispositivo
                    toast.info("Orden finalizada desde otro dispositivo");

                    // Mover la orden a finalizadas
                    if (table.type === 'pending') {
                        setApiTables((prevTables) =>
                            prevTables.filter((t) => t.orderUuid !== table.orderUuid)
                        );
                    } else if (table.type === 'completed') {
                        setCompletedTables((prevTables) =>
                            prevTables.filter((t) => t.orderUuid !== table.orderUuid)
                        );
                    }

                    // Agregar a finalizadas
                    setFinishedTables((prevTables) => [...prevTables, {
                        ...table,
                        type: 'finished',
                        products: table.products.map(p => ({ ...p, status: 'Finalizado' }))
                    }]);

                    // Refrescar datos
                    await fetchTablesData();

                    return; // No abrir el modal
                }
            } catch (error) {
                console.error('Error al verificar estado de la orden:', error);
                // Si hay error, continuar abriendo el modal normalmente
            }
        }

        setSelectedTable(table);
        setIsTableDetailModalOpen(true);
    };

    const allActiveTables = apiTables;

    const handleGoToPayments = () => {
        setShowSubscriptionModal(false);
        router.push('/payments');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 relative">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-16 left-8 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-24 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
            </div>
            <div className="relative z-10 w-full mt-16">
                {/* Modal de suscripción con contador */}
                {showSubscriptionModal && (
                    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                            <h2 className="text-xl font-bold mb-4 text-red-600">Suscripción Requerida</h2>
                            <p className="text-gray-700 mb-4">
                                Tu suscripción ha expirado o no tienes permisos para acceder a esta funcionalidad.
                                Por favor, renueva tu suscripción para continuar.
                            </p>
                            <div className="text-center mb-6">
                                <p className="text-green-600 font-semibold text-lg">
                                    Redireccionando a pagos en {countdown} segundos...
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleGoToPayments}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Ir a Pagos Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal para liberar mesa */}
                {showReleaseModal && (
                    <div
                        className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50"
                        onClick={handleModalBackdropClick}
                    >
                        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Liberar Mesa</h2>
                            <p className="text-gray-700 mb-6">
                                ¿Seguro qué quieres liberar la mesa {selectedTableToRelease}?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={confirmReleaseTable}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                                >
                                    Sí
                                </button>
                                <button
                                    onClick={cancelReleaseTable}
                                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Componente de modales */}
                <ModalCocina
                    isTableDetailModalOpen={isTableDetailModalOpen}
                    setIsTableDetailModalOpen={setIsTableDetailModalOpen}
                    selectedTable={selectedTable}
                    visibleDropdown={visibleDropdown}
                    toggleDropdown={toggleDropdown}
                    setSelectedProduct={setSelectedProduct}
                    setIsModalOpen={setIsModalOpen}
                    setActiveModal={setActiveModal}
                    activeModal={activeModal}
                    handleCompleteOrder={handleCompleteOrder}
                    handleCancelOrder={verificarYCancelarOrden}
                    isModalOpen={isModalOpen}
                    selectedProduct={selectedProduct}
                    handleCancelProduct={handleCancelProduct}
                    handleFinalizeCompletedOrder={handleFinalizeCompletedOrder}
                />

                {/* Modal de confirmación para cancelar orden finalizada */}
                {showConfirmCancelFinalized && (
                    <div
                        className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[100] p-4"
                        onClick={() => setShowConfirmCancelFinalized(false)}
                    >
                        <div
                            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-orange-200"
                            style={{
                                background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IoMdInformationCircleOutline className="text-orange-500 text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Orden Finalizada</h3>
                                <p className="text-gray-600">
                                    La orden ha sido finalizada desde otro dispositivo. ¿Estás seguro que deseas cancelarla?
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowConfirmCancelFinalized(false);
                                        setOrdenFinalizadaParaCancelar(null);
                                    }}
                                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                                >
                                    No
                                </button>
                                <button
                                    onClick={confirmarCancelarOrdenFinalizada}
                                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
                                >
                                    Sí, cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-sm w-full flex shadow-md p-4 overflow-x-auto whitespace-nowrap border-b rounded-t-2xl">
                    <button
                        className={`px-4 py-2 cursor-pointer ${view === "all" ? "border-b-2 border-green-600 font-bold" : ""
                            }`}
                        onClick={() => setView("all")}
                    >
                        Comandas Recibidas
                    </button>
                    <button
                        className={`px-4 py-2 cursor-pointer ${view === "completed" ? "border-b-2 border-green-600 font-bold" : ""
                            }`}
                        onClick={() => setView("completed")}
                    >
                        Comandas Completadas
                    </button>
                    <button
                        className={`px-4 py-2 cursor-pointer ${view === "finished" ? "border-b-2 border-green-600 font-bold" : ""
                            }`}
                        onClick={() => setView("finished")}
                    >
                        Comandas Finalizadas
                    </button>
                    <button
                        className={`px-4 py-2 cursor-pointer ${view === "cancelled" ? "border-b-2 border-green-600 font-bold" : ""
                            }`}
                        onClick={() => setView("cancelled")}
                    >
                        Comandas Canceladas
                    </button>
                    <button
                        className={`px-4 py-2 cursor-pointer ${view === "tables" ? "border-b-2 border-green-600 font-bold" : ""
                            }`}
                        onClick={() => setView("tables")}
                    >
                        Mesas
                    </button>
                </div>

                <div className="py-5 px-5">
                    {view === "all" && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-lg font-bold">Comandas Recibidas:</p>
                                {loading && <p className="text-sm text-gray-500">Cargando...</p>}
                                {error && <p className="text-sm text-red-500">Error: {error}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {allActiveTables.length === 0 && !loading && (
                                    <p className="text-gray-500 text-center col-span-full">No hay órdenes pendientes en este momento</p>
                                )}
                                {allActiveTables.map((table) => (
                                    <div
                                        key={`table-${table.tableNumber}`}
                                        className={`cursor-pointer transition-transform hover:scale-105 ${table.isEmpty ? 'opacity-30' : ''}`}
                                        onClick={() => openTableDetail(table)}
                                    >
                                        <div className={`border-l-8 rounded-2xl shadow-xl bg-white h-44 flex flex-col transition-all duration-300
                                            ${table.type === 'pending' || table.isEmpty ? 'border-green-400' : ''}
                                            ${table.type === 'completed' ? 'border-emerald-400' : ''}
                                            ${table.type === 'finished' ? 'border-gray-400' : ''}
                                            ${table.type === 'cancelled' ? 'border-red-400' : ''}
                                        `}>
                                            <div className="p-4 flex-grow flex flex-col">
                                                <div className="flex items-center mb-2 gap-2">
                                                    <MdTableBar className="text-xl text-green-600" />
                                                    <p className="font-bold text-base">Mesa {table.tableNumber}</p>
                                                    <GoDotFill className={`text-sm ${table.type === 'pending' ? 'text-blue-800' : ''} ${table.type === 'completed' ? 'text-green-600' : ''} ${table.type === 'finished' ? 'text-gray-600' : ''} ${table.type === 'cancelled' ? 'text-red-600' : ''}`} />
                                                    {!table.isEmpty && (
                                                        <span className={`px-2 py-0.5 text-xs rounded font-semibold
                                                            ${table.type === 'pending' ? 'bg-blue-100 text-blue-800' : ''}
                                                            ${table.type === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                                            ${table.type === 'finished' ? 'bg-gray-100 text-gray-800' : ''}
                                                            ${table.type === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                                        `}>
                                                            {table.type === 'pending' ? 'Pendiente' : ''}
                                                            {table.type === 'completed' ? 'Preparado' : ''}
                                                            {table.type === 'finished' ? 'Finalizado' : ''}
                                                            {table.type === 'cancelled' ? 'Cancelado' : ''}
                                                        </span>
                                                    )}
                                                    {table.isEmpty && (
                                                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded font-semibold">
                                                            Sin ocupar
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                    <div className="flex items-center">
                                                        <LuCalendarDays className="mr-1" />
                                                        <span>{new Date(table.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <BsClock className="mr-1" />
                                                        <span>{new Date(table.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    {table.isEmpty ? (
                                                        <div className="text-center py-2">
                                                            <p className="text-gray-400 font-semibold text-sm">Mesa sin ocupar</p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-semibold mb-1">
                                                                Productos ({table.products.length})
                                                            </p>
                                                            {table.products.length > 0 && (
                                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded p-2 mb-1 shadow-sm">
                                                                    <div className="flex justify-between items-center">
                                                                        <p className={`font-semibold text-xs truncate pr-1 ${table.products[0].status === 'Cancelado' ? 'line-through text-red-500' : ''}`}>
                                                                            {table.products[0].name}
                                                                        </p>
                                                                        <span className="bg-white px-2 py-0.5 rounded text-xs font-semibold border border-green-100">
                                                                            X{table.products[0].quantity}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {table.products.length > 1 && (
                                                                <div className="flex items-center justify-center text-xs text-blue-600 font-semibold">
                                                                    <IoMdInformationCircleOutline className="mr-1" />
                                                                    <span className="text-center">Click para ver más</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Nueva vista de Mesas */}
                    {view === "tables" && (
                        <div>
                            <p className="text-lg font-bold mb-4">Mesas para Liberar:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {(() => {
                                    // Obtener todas las mesas no disponibles y ocupadas
                                    const allTableStatuses = Object.entries(tablesData?.table_status || {});
                                    const filteredTables = allTableStatuses
                                        .filter(([tableNumber, status]) => status === "NoDisponible" || status === "Ocupado")
                                        .map(([tableNumber, status]) => ({
                                            tableNumber: parseInt(tableNumber),
                                            status: status,
                                            products: [],
                                            timestamp: new Date().toISOString(),
                                            isEmpty: true,
                                            type: status === "NoDisponible" ? 'unavailable' : 'occupied'
                                        }));

                                    if (filteredTables.length === 0) {
                                        return (
                                            <p className="text-gray-500 text-center col-span-full">No hay mesas no disponibles u ocupadas</p>
                                        );
                                    }

                                    return filteredTables.map((table) => (
                                        <div
                                            key={`table-${table.tableNumber}-${table.type}`}
                                            className={`bg-white border-l-green-500 border-l-5 shadow-md rounded-lg p-4 flex flex-col justify-between ${table.type === 'occupied' ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            <div className="flex items-center mb-4">
                                                <MdTableBar className="text-xl text-green-500 mr-2" />
                                                <p className="font-bold text-lg">Mesa {table.tableNumber}</p>
                                            </div>
                                            <button
                                                onClick={() => table.type === 'unavailable' ? handleReleaseTable(table.tableNumber) : null}
                                                className={`w-full px-4 py-2 rounded transition-colors ${table.type === 'unavailable'
                                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                disabled={table.type === 'occupied'}
                                            >
                                                {table.type === 'unavailable' ? 'Liberar' : 'Ocupado'}
                                            </button>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    )}

                    {view === "completed" && (
                        <div>
                            <p className="text-lg font-bold mb-4">Comandas Completadas:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {completedTables.length === 0 ? (
                                    <p className="text-gray-500 text-center col-span-full">No hay comandas completadas</p>
                                ) : (
                                    completedTables.map((table) => (
                                        <div
                                            key={`${table.tableNumber}-${table.orderId}-completed`}
                                            className="cursor-pointer"
                                            onClick={() => openTableDetail(table)}
                                        >
                                            <div className="border-l-green-600 border-l-5 bg-white shadow-md rounded-lg h-40 flex flex-col">
                                                <div className="p-3 flex-grow flex flex-col">
                                                    <div className="flex items-center mb-2">
                                                        <MdTableBar className="text-lg mr-2" />
                                                        <p className="font-bold text-base">Mesa {table.tableNumber}</p>
                                                        <GoDotFill className="text-green-600 mx-1 text-sm" />
                                                        <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                                                            Preparado
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                        <div className="flex items-center">
                                                            <LuCalendarDays className="mr-1" />
                                                            <span>{new Date(table.timestamp).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <BsClock className="mr-1" />
                                                            <span>{new Date(table.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-grow">
                                                        <p className="text-xs text-gray-500 font-semibold mb-1">
                                                            Productos ({table.products.length})
                                                        </p>
                                                        {table.products.length > 0 && (
                                                            <div className="bg-gray-50 rounded p-2 mb-1">
                                                                <div className="flex justify-between items-center">
                                                                    <p className="font-semibold text-xs truncate pr-1">
                                                                        {table.products[0].name}
                                                                    </p>
                                                                    <span className="bg-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                                        X{table.products[0].quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {table.products.length > 1 && (
                                                            <div className="flex items-center justify-center text-xs text-blue-600 font-semibold">
                                                                <IoMdInformationCircleOutline className="mr-1" />
                                                                <span className="text-center">Click para ver más</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {view === "finished" && (
                        <div>
                            <p className="text-lg font-bold mb-4">Comandas Finalizadas:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {finishedTables.length === 0 ? (
                                    <p className="text-gray-500 text-center col-span-full">No hay comandas finalizadas</p>
                                ) : (
                                    finishedTables.map((table) => (
                                        <div
                                            key={`${table.tableNumber}-${table.orderId}-finished`}
                                            className="cursor-pointer"
                                            onClick={() => openTableDetail(table)}
                                        >
                                            <div className="border-l-gray-600 border-l-5 bg-white shadow-md rounded-lg h-40 flex flex-col">
                                                <div className="p-3 flex-grow flex flex-col">
                                                    <div className="flex items-center mb-2">
                                                        <MdTableBar className="text-lg mr-2" />
                                                        <p className="font-bold text-base">Mesa {table.tableNumber}</p>
                                                        <GoDotFill className="text-gray-600 mx-1 text-sm" />
                                                        <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">
                                                            Finalizado
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                        <div className="flex items-center">
                                                            <LuCalendarDays className="mr-1" />
                                                            <span>{new Date(table.timestamp).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <BsClock className="mr-1" />
                                                            <span>{new Date(table.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-grow">
                                                        <p className="text-xs text-gray-500 font-semibold mb-1">
                                                            Productos ({table.products.length})
                                                        </p>
                                                        {table.products.length > 0 && (
                                                            <div className="bg-gray-50 rounded p-2 mb-1">
                                                                <div className="flex justify-between items-center">
                                                                    <p className={`font-semibold text-xs truncate pr-1 ${table.products[0].status === 'Cancelado' ? 'line-through text-red-500' : ''
                                                                        }`}>
                                                                        {table.products[0].name}
                                                                    </p>
                                                                    <span className="bg-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                                        X{table.products[0].quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {table.products.length > 1 && (
                                                            <div className="flex items-center justify-center text-xs text-blue-600 font-semibold">
                                                                <IoMdInformationCircleOutline className="mr-1" />
                                                                <span className="text-center">Click para ver más</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {view === "cancelled" && (
                        <div>
                            <p className="text-lg font-bold mb-4">Comandas Canceladas:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {cancelledTables.length === 0 ? (
                                    <p className="text-gray-500 text-center col-span-full">No hay comandas canceladas</p>
                                ) : (
                                    cancelledTables.map((table) => (
                                        <div
                                            key={`${table.tableNumber}-${table.orderId}-cancelled`}
                                            className="cursor-pointer"
                                            onClick={() => openTableDetail(table)}
                                        >
                                            <div className="border-l-red-600 border-l-5 bg-white shadow-md rounded-lg h-40 flex flex-col">
                                                <div className="p-3 flex-grow flex flex-col">
                                                    <div className="flex items-center mb-2">
                                                        <MdTableBar className="text-lg mr-2" />
                                                        <p className="font-bold text-base">Mesa {table.tableNumber}</p>
                                                        <GoDotFill className="text-red-600 mx-1 text-sm" />
                                                        <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                                                            Cancelado
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                        <div className="flex items-center">
                                                            <LuCalendarDays className="mr-1" />
                                                            <span>{new Date(table.timestamp).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <BsClock className="mr-1" />
                                                            <span>{new Date(table.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-grow">
                                                        <p className="text-xs text-gray-500 font-semibold mb-1">
                                                            Productos ({table.products.length})
                                                        </p>
                                                        {table.products.length > 0 && (
                                                            <div className="bg-gray-50 rounded p-2 mb-1">
                                                                <div className="flex justify-between items-center">
                                                                    <p className="font-semibold text-xs truncate pr-1 line-through text-red-500">
                                                                        {table.products[0].name}
                                                                    </p>
                                                                    <span className="bg-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                                        X{table.products[0].quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {table.products.length > 1 && (
                                                            <div className="flex items-center justify-center text-xs text-blue-600 font-semibold">
                                                                <IoMdInformationCircleOutline className="mr-1" />
                                                                <span className="text-center">Click para ver más</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Estilos extra para animaciones */}
            <style jsx>{`
                .delay-500 { animation-delay: 500ms; }
                .delay-1000 { animation-delay: 1000ms; }
                .delay-1500 { animation-delay: 1500ms; }
            `}</style>
        </div>
    );
}

