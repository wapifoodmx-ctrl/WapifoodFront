import { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { MdTableBar } from "react-icons/md";
import { BsClock } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { getTables } from "../../useCases/getTables.js";
import getOrderTickets from "../../useCases/getOrderTickets.js";
import { updateProductStatus } from "../../useCases/updateProductStatus.js";
import { cancelOrder } from "../../useCases/cancelOrder.js";
import { endPuntoDeVenta } from "../../useCases/endPuntoDeVenta.js";
import ModalCocina from "./modalCocina.jsx";

// ...existing code...

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

    const fetchTablesData = async () => {
        try {
            setLoading(true);

            const [ordersData, tablesData] = await Promise.all([
                getOrderTickets(),
                getTables()
            ]);

            // Verificar si hay error 403 en getTables
            if (tablesData.error && tablesData.status === 403) {
                setShowSubscriptionModal(true);
                setLoading(false);
                return;
            }

            console.log("Orders data:", ordersData);
            console.log("Tables data:", tablesData);

            // Agrupar órdenes por mesa y tipo de producto
            const tableGroups = {};

            ordersData.forEach(order => {
                const tableNumber = order.mesa_number;
                const realStatus = tablesData.table_status[tableNumber.toString()] || "Libre";

                // Separar productos por estado
                const pendingProducts = order.products.filter(product => product.order_detail_status === "Pendiente");
                const completedProducts = order.products.filter(product => product.order_detail_status === "Preparado");
                const finishedProducts = order.products.filter(product => product.order_detail_status === "Finalizado");
                const cancelledProducts = order.products.filter(product => product.order_detail_status === "Cancelado");

                // Crear entrada para productos pendientes
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

                    // Agregar método de pago y otros datos de la orden
                    tableGroups[pendingKey].metodoPago = order.metodo_pago || 'efectivo';
                    tableGroups[pendingKey].orders.push(order);
                }

                // Crear entrada para productos completados/preparados
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

                // Crear entrada para productos finalizados - CADA ORDEN POR SEPARADO
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

                    // Solo incluir los productos de ESTA orden específica
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

            // Filtrar órdenes completamente canceladas
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

            // Agregar mesas no disponibles
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

            const allTables = [...Object.values(tableGroups), ...unavailableTables];

            allTables.sort((a, b) => {
                if (a.status === b.status) {
                    return a.tableNumber - b.tableNumber;
                }
                return a.isEmpty - b.isEmpty;
            });

            // Separar por tipo
            const pendingTables = allTables.filter(table => table.type === 'pending' || table.isEmpty);
            const completedTables = allTables.filter(table => table.type === 'completed');
            const finishedTables = allTables.filter(table => table.type === 'finished');
            const cancelledTables = allTables.filter(table => table.type === 'cancelled');

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

            // Usar el orderUuid de la mesa seleccionada (más confiable)
            const orderUuid = selectedTable.orderUuid;

            // Actualizar el estado del producto a "Cancelado"
            await updateProductStatus(orderUuid, product.id, 'Cancelado');

            // Recargar los datos para reflejar los cambios
            await fetchTablesData();

            setIsModalOpen(false);
            setVisibleDropdown(null); // Cerrar el dropdown
            console.log('Producto cancelado exitosamente');
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

            // Filtrar solo productos que no estén cancelados
            const activeProducts = selectedTable.products.filter(p => p.status !== 'Cancelado');
            
            if (activeProducts.length === 0) {
                alert('No hay productos activos para completar');
                return;
            }

            const orderUuid = selectedTable.orderUuid;

            // CONDICIÓN ESPECIAL: Si es la mesa 1, usar endPuntoDeVenta
            if (selectedTable.tableNumber === 1) {
                console.log('Mesa 1 detectada - usando endPuntoDeVenta');
                
                const metodoPago = selectedTable.metodoPago || 'efectivo';
                
                console.log('Finalizando orden con endPuntoDeVenta:', {
                    orderUuid,
                    metodoPago,
                    tableNumber: selectedTable.tableNumber
                });

                // Usar endPuntoDeVenta para finalizar la orden completa
                await endPuntoDeVenta(orderUuid, metodoPago);

                // Mover la mesa de pendientes a finalizadas
                setApiTables((prevTables) =>
                    prevTables.filter((table) => {
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

                console.log('Orden finalizada exitosamente con endPuntoDeVenta');
            } else {
                // FLUJO NORMAL: Para todas las demás mesas, usar updateProductStatus
                console.log('Mesa normal - usando updateProductStatus');
                
                const productIds = activeProducts.map(product => product.id);

                // Actualizar el estado de todos los productos activos a "Preparado"
                await updateProductStatus(orderUuid, productIds, 'Preparado');

                // Mover la mesa de pendientes a completadas
                setApiTables((prevTables) =>
                    prevTables.filter((table) => {
                        if (table.orderUuid === orderUuid) {
                            setCompletedTables((prevCompleted) => [...prevCompleted, {
                                ...table,
                                type: 'completed',
                                products: table.products.map(p => ({ ...p, status: 'Preparado' }))
                            }]);
                            return false;
                        }
                        return true;
                    })
                );

                console.log('Orden completada exitosamente con updateProductStatus');
            }

            // Recargar los datos para reflejar los cambios
            await fetchTablesData();

            setActiveModal(null);
            setIsTableDetailModalOpen(false);
            
        } catch (error) {
            console.error('Error al completar la orden:', error);
            alert('Error al completar la orden: ' + error.message);
        }
    };

    const handleCancelOrder = async () => {
        try {
            if (!selectedTable || !selectedTable.orderUuid) {
                console.error('No se encontró la orden para cancelar');
                return;
            }

            const orderUuid = selectedTable.orderUuid;

            console.log('Cancelando orden completa:', orderUuid);

            // Cancelar toda la orden usando la función cancelOrder
            await cancelOrder(orderUuid);

            // Actualizar el estado local - mover la mesa de pendientes a canceladas
            setApiTables((prevTables) =>
                prevTables.filter((table) => {
                    if (table.orderUuid === orderUuid) {
                        // Agregar a la lista de canceladas
                        setCancelledTables((prevCancelled) => [...prevCancelled, {
                            ...table,
                            type: 'cancelled',
                            products: table.products.map(p => ({ ...p, status: 'Cancelado' }))
                        }]);
                        return false; // Remover de pendientes
                    }
                    return true;
                })
            );

            // Recargar los datos para reflejar los cambios del servidor
            await fetchTablesData();

            setActiveModal(null);
            setIsTableDetailModalOpen(false);
            console.log('Orden cancelada exitosamente');
        } catch (error) {
            console.error('Error al cancelar la orden:', error);
            alert('Error al cancelar la orden: ' + error.message);
        }
    };

    const openTableDetail = (table) => {
        setSelectedTable(table);
        setIsTableDetailModalOpen(true);
    };

    const allActiveTables = apiTables;

    const handleGoToPayments = () => {
        setShowSubscriptionModal(false);
        router.push('/payments');
    };

    return (
        <div className="w-full mt-16">
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
                handleCancelOrder={handleCancelOrder}
                isModalOpen={isModalOpen}
                selectedProduct={selectedProduct}
                handleCancelProduct={handleCancelProduct}
            />

            <div className="w-full flex shadow-md p-4 overflow-x-auto whitespace-nowrap border-b">
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
            </div>

            <div className="py-5 px-5">
                {view === "all" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-lg font-bold">Comandas Recibidas:</p>
                            {loading && <p className="text-sm text-gray-500">Cargando...</p>}
                            {error && <p className="text-sm text-red-500">Error: {error}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {allActiveTables.length === 0 && !loading && (
                                <p className="text-gray-500 text-center col-span-full">No hay órdenes pendientes en este momento</p>
                            )}
                            {allActiveTables.map((table) => (
                                <div
                                    key={`table-${table.tableNumber}`}
                                    className={`cursor-pointer transition-opacity hover:opacity-80 ${table.isEmpty ? 'opacity-30' : ''}`}
                                    onClick={() => openTableDetail(table)}
                                >
                                    <div className="border-l-green-600 border-l-5 bg-white shadow-md rounded-lg h-40 flex flex-col">
                                        <div className="p-3 flex-grow flex flex-col">
                                            <div className="flex items-center mb-2">
                                                <MdTableBar className="text-lg mr-2" />
                                                <p className="font-bold text-base">Mesa {table.tableNumber}</p>
                                                <GoDotFill className="text-blue-800 mx-1 text-sm" />
                                                {/* Solo mostrar Pendiente para comandas activas */}
                                                {!table.isEmpty && (
                                                    <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                                        Pendiente
                                                    </span>
                                                )}
                                                {table.isEmpty && (
                                                    <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">
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
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === "completed" && (
                    <div>
                        <p className="text-lg font-bold mb-4">Comandas Completadas:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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
    );
}

