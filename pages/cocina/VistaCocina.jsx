import { useState, useEffect, useRef } from "react";
import { FaTrashAlt, FaTimes, FaPlus } from "react-icons/fa"; // Importa los íconos necesarios
import { GoDotFill } from "react-icons/go";
import { MdTableBar } from "react-icons/md";
import { BsClock, BsThreeDotsVertical } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";

export default function VistaCocina() {
    const [visibleDropdown, setVisibleDropdown] = useState(null); // Estado para controlar el dropdown visible
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad de la modal
    const [activeModal, setActiveModal] = useState(null); // Estado para identificar la modal activa
    const [selectedTable, setSelectedTable] = useState(null); // Mesa seleccionada para cancelar o completar
    const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado para eliminar
    const [view, setView] = useState("all"); // Estado para controlar la vista actual
    const dropdownRef = useRef(null); // Referencia al contenedor del dropdown
    const buttonRef = useRef(null); // Referencia al botón que abre la modal
    const [tables, setTables] = useState([
        {
            tableNumber: 1,
            products: [
                { id: 1, name: "Hamburguesa Doble", quantity: 3, note: "" },
                { id: 2, name: "Hamburguesa Doble", quantity: 1, note: "Sin cebolla" },
                { id: 3, name: "Nachos con Queso", quantity: 1, note: "" },
            ],
        },
        {
            tableNumber: 2,
            products: [
                { id: 4, name: "Pizza Margarita", quantity: 2, note: "Extra queso" },
                { id: 5, name: "Ensalada César", quantity: 1, note: "" },
            ],
        },
        {
            tableNumber: 3,
            products: [
                { id: 6, name: "Tacos al Pastor", quantity: 4, note: "Sin piña" },
                { id: 7, name: "Agua de Jamaica", quantity: 2, note: "" },
            ],
        },
        {
            tableNumber: 4,
            products: [
                { id: 8, name: "Sushi Roll", quantity: 3, note: "Sin aguacate" },
                { id: 9, name: "Té Verde", quantity: 1, note: "" },
            ],
        },
        {
            tableNumber: 5,
            products: [
                { id: 10, name: "Hot Dog", quantity: 2, note: "Sin mostaza" },
                { id: 11, name: "Refresco de Cola", quantity: 3, note: "" },
            ],
        },
        {
            tableNumber: 6,
            products: [
                { id: 12, name: "Pasta Alfredo", quantity: 1, note: "Sin champiñones" },
                { id: 13, name: "Limonada", quantity: 2, note: "" },
            ],
        },
        {
            tableNumber: 7,
            products: [
                { id: 14, name: "Chilaquiles Verdes", quantity: 1, note: "Con pollo" },
                { id: 15, name: "Café Americano", quantity: 1, note: "" },
            ],
        },
        {
            tableNumber: 8,
            products: [
                { id: 16, name: "Hamburguesa Sencilla", quantity: 2, note: "Sin tomate" },
                { id: 17, name: "Papas a la Francesa", quantity: 1, note: "" },
                { id: 18, name: "Enchiladas Rojas", quantity: 3, note: "Con queso" },
                { id: 19, name: "Agua de Tamarindo", quantity: 2, note: "" },
                { id: 20, name: "Pizza Pepperoni", quantity: 1, note: "Extra pepperoni" },
                { id: 21, name: "Helado de Vainilla", quantity: 2, note: "" },
                { id: 22, name: "Café Latte", quantity: 1, note: "Con leche deslactosada" },
            ],
        },
    ]);
    const [completedTables, setCompletedTables] = useState([]); // Estado para las tarjetas completadas
    const [cancelledTables, setCancelledTables] = useState([]); // Estado para las tarjetas canceladas

    const toggleDropdown = (id) => {
        setVisibleDropdown(visibleDropdown === id ? null : id); // Alterna el dropdown visible
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                (!buttonRef.current || !buttonRef.current.contains(event.target))
            ) {
                setVisibleDropdown(null); // Cierra el dropdown si se hace clic fuera
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDeleteProduct = (productId) => {
        setTables((prevTables) =>
            prevTables
                .map((table) => ({
                    ...table,
                    products: table.products.filter((product) => product.id !== productId), // Elimina el producto
                }))
                .filter((table) => table.products.length > 0) // Elimina la tarjeta si no tiene productos
        );
        setIsModalOpen(false); // Cierra la modal
    };

    const handleCancelOrder = () => {
        setTables((prevTables) =>
            prevTables.filter((table) => {
                if (table.tableNumber === selectedTable.tableNumber) {
                    setCancelledTables((prevCancelled) => [...prevCancelled, table]); // Mueve la tarjeta a canceladas
                    return false; // Elimina la tarjeta de las activas
                }
                return true;
            })
        );
        setActiveModal(null); // Cierra la modal
    };

    const handleCompleteOrder = () => {
        setTables((prevTables) =>
            prevTables.filter((table) => {
                if (table.tableNumber === selectedTable.tableNumber) {
                    setCompletedTables((prevCompleted) => [...prevCompleted, table]); // Mueve la tarjeta a completadas
                    return false; // Elimina la tarjeta de las activas
                }
                return true;
            })
        );
        setActiveModal(null); // Cierra la modal
    };

    return (
        <div className="w-full mt-16">
            {/* Modal */}
            {activeModal === "realizado" && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setActiveModal(null)} // Cierra la modal al hacer clic fuera
                >
                    <div
                        className="bg-white rounded-lg p-6 modal"
                        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro de la modal cierre la modal
                    >
                        <p className="text-lg font-bold mb-4">El producto está listo para entregar</p>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                            onClick={handleCompleteOrder} // Mueve la tarjeta a completadas
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}

            {activeModal === "cancelar" && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={() => setActiveModal(null)} // Cierra la modal al hacer clic fuera
                >
                    <div
                        className="bg-white rounded-lg p-6 modal"
                        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro de la modal cierre la modal
                    >
                        <p className="text-lg font-bold mb-4">¿Estás seguro de cancelar la orden?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded-md"
                                onClick={() => setActiveModal(null)} // Cierra la modal
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={handleCancelOrder} // Elimina la tarjeta
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
                    onClick={() => setIsModalOpen(false)} // Cierra la modal al hacer clic fuera
                >
                    <div
                        className="bg-white rounded-lg p-6 modal"
                        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro de la modal cierre la modal
                    >
                        <p className="text-lg font-bold mb-4">
                            ¿Seguro que desea eliminar el producto "{selectedProduct.name}"?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded-md"
                                onClick={() => setIsModalOpen(false)} // Cierra la modal
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={() => handleDeleteProduct(selectedProduct.id)} // Elimina el producto
                            >
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Barra de botones con líneas divisorias */}
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

            {/* Contenido dinámico basado en la vista */}
            <div className="py-5 px-5">
                {view === "all" && (
                    <div>
                        <p className="text-lg font-bold mb-4">Comandas Recibidas:</p>
                        {/* Contenedor principal con flex */}
                        <div className="flex flex-wrap gap-4 py-5 px-5 justify-center">
                            {tables.map((table) => (
                                <div
                                    key={table.tableNumber} // Usa tableNumber como clave única
                                    className="w-full md:w-[40%] xl:w-1/4 p-2"
                                >
                                    <div className="border-l-green-600 border-l-5 bg-white shadow-md rounded-lg flex flex-col">
                                        <div className="py-2 flex-grow">
                                            <div className="flex pl-4">
                                                <MdTableBar className="self-center text-2xl" />
                                                <p className="font-bold text-xl pl-2">{table.tableNumber}</p>
                                                <GoDotFill className="self-center text-green-600" />
                                            </div>
                                            <div className="flex justify-between px-4 pb-2">
                                                <div className="flex">
                                                    <LuCalendarDays className="text-gray-500 text-sm self-center" />
                                                    <p className="text-sm text-gray-500 pl-1">10/05/2025</p>
                                                </div>
                                                <div className="flex">
                                                    <BsClock className="text-gray-500 text-sm self-center" />
                                                    <p className="text-sm text-gray-500 pl-1">14:10</p>
                                                </div>
                                            </div>

                                            {/* Productos */}
                                            <div className="flex flex-col bg-gray-100 rounded-lg flex-grow overflow-y-auto">
                                                <p className="pl-4 pt-2 text-gray-500 font-bold">Productos</p>
                                                {table.products.map((product) => (
                                                    <div
                                                        key={product.id} // Usa product.id como clave única
                                                        className="bg-white rounded-lg mx-4 flex flex-col h-auto py-2 mb-4"
                                                    >
                                                        <div className="flex justify-between px-2">
                                                            <p className="h-auto text-xl font-bold">{product.name}</p>
                                                            <div className="flex w-1/5 justify-between dropdown-container">
                                                                <div className="border-1 rounded-md border-gray-500">
                                                                    <p className="text-md self-center text-gray-500 px-1 font-bold">X{product.quantity}</p>
                                                                </div>
                                                                <div className="flex md:ml-auto relative" ref={dropdownRef}>
                                                                    <button
                                                                        className="border-1 cursor-pointer text-sm rounded-md px-1"
                                                                        onClick={() => toggleDropdown(product.id)} // Alterna el dropdown
                                                                    >
                                                                        <BsThreeDotsVertical className="text-gray-500" />
                                                                    </button>
                                                                    {visibleDropdown === product.id && (
                                                                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg flex px-2">
                                                                            <FaTrashAlt className="self-center" />
                                                                            <button
                                                                                ref={buttonRef} // Referencia al botón
                                                                                className="w-full text-left px-2 py-2 text-sm cursor-pointer"
                                                                                onClick={() => {
                                                                                    setSelectedProduct(product); // Selecciona el producto completo
                                                                                    setIsModalOpen(true); // Abre la modal
                                                                                }}
                                                                            >
                                                                                Eliminar producto
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {product.note && (
                                                            <p className="text-xs pl-2 py-1 font-bold flex items-center">
                                                                
                                                                 {product.note.toLowerCase().includes("sin") ? 
                                                                    <FaTimes className="text-red-500 mr-1" />
                                                                : <FaPlus className="text-green-600 mr-1" /> } 


                                                                {product.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <div className="px-4 py-2 justify-between w-full flex">
                                                <button
                                                    className="bg-green-600 text-white text-xl font-bold cursor-pointer rounded-md py-1 w-5/12"
                                                    onClick={() => {
                                                        setSelectedTable(table); // Selecciona la tarjeta
                                                        setActiveModal("realizado"); // Abre la modal de "Realizado"
                                                    }}
                                                >
                                                    Realizado
                                                </button>
                                                <button
                                                    className="bg-red-600 text-white text-xl font-bold cursor-pointer rounded-md py-1 w-5/12"
                                                    onClick={() => {
                                                        setSelectedTable(table); // Selecciona la tarjeta
                                                        setActiveModal("cancelar"); // Abre la modal de "Cancelar"
                                                    }}
                                                >
                                                    Cancelar
                                                </button>
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
                        <div className="flex flex-wrap gap-4 py-5 px-5 justify-center">
                            {completedTables.map((table) => (
                                <div
                                    key={table.tableNumber} // Usa tableNumber como clave única
                                    className="w-full md:w-[40%] xl:w-1/4 p-2"
                                >
                                    <div className="border-l-green-600 border-l-5 bg-white shadow-md rounded-lg flex flex-col">
                                        <div className="py-2 flex-grow">
                                            <div className="flex pl-4">
                                                <MdTableBar className="self-center text-2xl" />
                                                <p className="font-bold text-xl pl-2">{table.tableNumber}</p>
                                                <GoDotFill className="self-center text-green-600" />
                                            </div>
                                            <div className="flex justify-between px-4 pb-2">
                                                <div className="flex">
                                                    <LuCalendarDays className="text-gray-500 text-sm self-center" />
                                                    <p className="text-sm text-gray-500 pl-1">10/05/2025</p>
                                                </div>
                                                <div className="flex">
                                                    <BsClock className="text-gray-500 text-sm self-center" />
                                                    <p className="text-sm text-gray-500 pl-1">14:10</p>
                                                </div>
                                            </div>

                                            {/* Productos */}
                                            <div className="flex flex-col bg-gray-100 rounded-lg flex-grow overflow-y-auto">
                                                <p className="pl-4 pt-2 text-gray-500 font-bold">Productos</p>
                                                {table.products.map((product) => (
                                                    <div
                                                        key={product.id} // Usa product.id como clave única
                                                        className="bg-white rounded-lg mx-4 flex flex-col h-auto py-2 mb-4"
                                                    >
                                                        <div className="flex justify-between px-2">
                                                            <p className="h-auto">{product.name}</p>
                                                            <div className="flex w-1/5 justify-between">
                                                                <div className="border-1 rounded-md border-gray-500">
                                                                    <p className="text-xs self-center text-gray-500 px-1">X{product.quantity}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {product.note && (
                                                            <p className="text-xs pl-2 py-1 font-bold flex items-center">
                                                                {/* Renderiza el ícono según el contenido de la nota */}
                                                                {product.note.toLowerCase().includes("sin") && (
                                                                    <FaTimes className="text-red-500 mr-1" />
                                                                )}
                                                                {product.note.toLowerCase().includes("extra") && (
                                                                    <FaPlus className="text-green-500 mr-1" />
                                                                )}
                                                                {product.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {view === "cancelled" && (
                    <div>
                        <p className="text-lg font-bold mb-4">Comandas Canceladas:</p>
                        <div className="flex flex-wrap gap-4 py-5 px-5 justify-center">
                            {cancelledTables.map((table) => (
                                <div
                                    key={table.tableNumber} // Usa tableNumber como clave única
                                    className="w-full md:w-[40%] xl:w-1/4 p-2"
                                >
                                    <div className="border-l-red-600 border-l-5 bg-white shadow-md rounded-lg flex flex-col">
                                        <div className="py-2 flex-grow">
                                            <div className="flex pl-4">
                                                <MdTableBar className="self-center text-2xl" />
                                                <p className="font-bold text-xl pl-2">{table.tableNumber}</p>
                                                <GoDotFill className="self-center text-red-600" />
                                            </div>
                                            <div className="flex justify-between px-4 pb-2">
                                                <div className="flex">
                                                    <LuCalendarDays className="text-gray-500 text-sm self-center" />
                                                    <p className="text-sm text-gray-500 pl-1">10/05/2025</p>
                                                </div>
                                                <div className="flex">
                                                    <BsClock className="text-gray-500 text-sm self-center" />
                                                    <p className="text-sm text-gray-500 pl-1">14:10</p>
                                                </div>
                                            </div>

                                            {/* Productos */}
                                            <div className="flex flex-col bg-gray-100 rounded-lg flex-grow overflow-y-auto">
                                                <p className="pl-4 pt-2 text-gray-500 font-bold">Productos</p>
                                                {table.products.map((product) => (
                                                    <div
                                                        key={product.id} // Usa product.id como clave única
                                                        className="bg-white rounded-lg mx-4 flex flex-col h-auto py-2 mb-4"
                                                    >
                                                        <div className="flex justify-between px-2">
                                                            <p className="h-auto">{product.name}</p>
                                                            <div className="flex w-1/5 justify-between">
                                                                <div className="border-1 rounded-md border-gray-500">
                                                                    <p className="text-xs self-center text-gray-500 px-1">X{product.quantity}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {product.note && (
                                                            <p className="text-xs pl-2 py-1 font-bold flex items-center">
                                                                {/* Renderiza el ícono según el contenido de la nota */}
                                                                {product.note.toLowerCase().includes("sin") && (
                                                                    <FaTimes className="text-red-500 mr-1" />
                                                                )}
                                                                {product.note.toLowerCase().includes("extra") && (
                                                                    <FaPlus className="text-green-500 mr-1" />
                                                                )}
                                                                {product.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

