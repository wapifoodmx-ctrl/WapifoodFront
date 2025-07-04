import { useState, useEffect, useRef } from "react";
import { FaTrashAlt, FaTimes, FaPlus } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { MdTableBar } from "react-icons/md";
import { BsClock, BsThreeDotsVertical } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { getTables } from "../../useCases/getTables.js";
import getOrderTickets from "../../useCases/getOrderTickets.js";

export default function VistaCocina() {
    const [visibleDropdown, setVisibleDropdown] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [view, setView] = useState("all");
    const [isTableDetailModalOpen, setIsTableDetailModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const [apiTables, setApiTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [completedTables, setCompletedTables] = useState([]);
    const [cancelledTables, setCancelledTables] = useState([]);

    const fetchTablesData = async () => {
        try {
            setLoading(true);

            const [ordersData, tablesData] = await Promise.all([
                getOrderTickets(),
                getTables()
            ]);

            console.log("Orders data:", ordersData);
            console.log("Tables data:", tablesData);
            
            const pendingOrders = ordersData.filter(order => order.order_status === "Pendiente");

            const tableGroups = pendingOrders.reduce((groups, order) => {
                const tableNumber = order.mesa_number;
                if (!groups[tableNumber]) {
                    const realStatus = tablesData.table_status[tableNumber.toString()] || "Libre";
                    groups[tableNumber] = {
                        tableNumber: tableNumber,
                        status: realStatus,
                        products: [],
                        timestamp: order.date_time,
                        isEmpty: false,
                        orders: []
                    };
                }

                order.products.forEach(product => {
                    groups[tableNumber].products.push({
                        id: product.id_orders_details,
                        name: product.product_name,
                        quantity: product.quantity,
                        note: "",
                        orderId: order.id_orders,
                        orderUuid: order.order_uuid,
                        status: product.order_detail_status
                    });
                });

                groups[tableNumber].orders.push(order);
                return groups;
            }, {});

            // Filtrar solo las mesas que NO tienen estatus "Libre"
            const tablesWithOrders = Object.values(tableGroups).filter(table => 
                table.status !== "Libre"
            );

            const unavailableTables = Object.entries(tablesData.table_status)
                .filter(([tableNumber, status]) => status === "NoDisponible")
                .map(([tableNumber, status]) => ({
                    tableNumber: parseInt(tableNumber),
                    status: status,
                    products: [],
                    timestamp: new Date().toISOString(),
                    isEmpty: true,
                }));

            const allTables = [...tablesWithOrders, ...unavailableTables];

            allTables.sort((a, b) => {
                if (a.status === b.status) {
                    return a.tableNumber - b.tableNumber;
                }
                return a.isEmpty - b.isEmpty;
            });

            setApiTables(allTables);
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
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleDropdown = (id) => {
        setVisibleDropdown(visibleDropdown === id ? null : id);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                (!buttonRef.current || !buttonRef.current.contains(event.target))
            ) {
                setVisibleDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDeleteProduct = (productId) => {
        setApiTables((prevTables) =>
            prevTables
                .map((table) => ({
                    ...table,
                    products: table.products.filter((product) => product.id !== productId),
                }))
                .filter((table) => table.products.length > 0 || table.isEmpty)
        );
        setIsModalOpen(false);
    };

    const handleCancelOrder = () => {
        setApiTables((prevTables) =>
            prevTables.filter((table) => {
                if (table.tableNumber === selectedTable.tableNumber) {
                    setCancelledTables((prevCancelled) => [...prevCancelled, table]);
                    return false;
                }
                return true;
            })
        );
        setActiveModal(null);
        setIsTableDetailModalOpen(false);
    };

    const handleCompleteOrder = () => {
        setApiTables((prevTables) =>
            prevTables.filter((table) => {
                if (table.tableNumber === selectedTable.tableNumber) {
                    setCompletedTables((prevCompleted) => [...prevCompleted, table]);
                    return false;
                }
                return true;
            })
        );
        setActiveModal(null);
        setIsTableDetailModalOpen(false);
    };

    const openTableDetail = (table) => {
        setSelectedTable(table);
        setIsTableDetailModalOpen(true);
    };

    const allActiveTables = apiTables;

    return (
        <div className="w-full mt-16">
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
                                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                                    selectedTable.status === "Ocupado" 
                                        ? "bg-blue-100 text-blue-800" 
                                        : "bg-orange-100 text-orange-800"
                                }`}>
                                    {selectedTable.status}
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
                                                    <p className="font-semibold">{product.name}</p>
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
                                                                    }}
                                                                >
                                                                    <FaTrashAlt className="mr-2" />
                                                                    Eliminar producto
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

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
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {activeModal === "realizado" && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="bg-white rounded-lg p-6 modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4">El producto está listo para entregar</p>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                            onClick={handleCompleteOrder}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}

            {activeModal === "cancelar" && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="bg-white rounded-lg p-6 modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4">¿Estás seguro de cancelar la orden?</p>
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
                                Sí
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
                        className="bg-white rounded-lg p-6 modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg font-bold mb-4">
                            ¿Seguro que desea eliminar el producto "{selectedProduct.name}"?
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
                                onClick={() => handleDeleteProduct(selectedProduct.id)}
                            >
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full flex shadow-md p-4 overflow-x-auto whitespace-nowrap border-b">
                <button
                    className={`px-4 py-2 cursor-pointer ${
                        view === "all" ? "border-b-2 border-green-600 font-bold" : ""
                    }`}
                    onClick={() => setView("all")}
                >
                    Comandas Recibidas
                </button>
                <button
                    className={`px-4 py-2 cursor-pointer ${
                        view === "completed" ? "border-b-2 border-green-600 font-bold" : ""
                    }`}
                    onClick={() => setView("completed")}
                >
                    Comandas Completadas
                </button>
                <button
                    className={`px-4 py-2 cursor-pointer ${
                        view === "cancelled" ? "border-b-2 border-green-600 font-bold" : ""
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
                                                <GoDotFill className="text-green-600 mx-1 text-sm" />
                                                <span className={`px-1.5 py-0.5 text-xs rounded ${
                                                    table.status === "Ocupado" 
                                                        ? "bg-blue-100 text-blue-800" 
                                                        : "bg-orange-100 text-orange-800"
                                                }`}>
                                                    {table.status}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                <div className="flex items-center">
                                                    <LuCalendarDays className="mr-1" />
                                                    <span>{new Date(table.timestamp).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <BsClock className="mr-1" />
                                                    <span>{new Date(table.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
                                        key={table.tableNumber}
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
                                                        Completado
                                                    </span>
                                                </div>
                                                
                                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                    <div className="flex items-center">
                                                        <LuCalendarDays className="mr-1" />
                                                        <span>{new Date(table.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <BsClock className="mr-1" />
                                                        <span>{new Date(table.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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

                {view === "cancelled" && (
                    <div>
                        <p className="text-lg font-bold mb-4">Comandas Canceladas:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {cancelledTables.length === 0 ? (
                                <p className="text-gray-500 text-center col-span-full">No hay comandas canceladas</p>
                            ) : (
                                cancelledTables.map((table) => (
                                    <div
                                        key={table.tableNumber}
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
                                                        <span>{new Date(table.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
            </div>
        </div>
    );
}

