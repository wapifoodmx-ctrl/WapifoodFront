import { useState, useEffect, useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { MdTableBar } from "react-icons/md";
import { LuCupSoda } from "react-icons/lu";
import { BsClock } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function VistaCocina() {
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad de la modal
    const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado para eliminar
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
            tableNumber: 8, // Nueva mesa
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
    ]); // Lista de mesas con productos

    const handleDeleteProduct = (productId) => {
        setTables(
            tables.map((table) => ({
                ...table,
                products: table.products.filter((product) => product.id !== productId),
            }))
        ); // Elimina el producto
        setIsModalOpen(false); // Cierra la modal
    };

    return (
        <div className="w-full mt-16">
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 modal">
                        <p className="text-lg font-bold mb-4">¿Seguro que desea eliminar el producto?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded-md"
                                onClick={() => setIsModalOpen(false)} // Cierra la modal
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={() => handleDeleteProduct(selectedProduct)} // Elimina el producto
                            >
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Barra de botones con scroll horizontal */}
            <div className="w-full flex shadow-md p-4 overflow-x-auto whitespace-nowrap">
                <button className="px-2.5 cursor-pointer hover:text-green-600">
                    Todas las Comandas ({tables.length})
                </button>
                <button className="px-2.5 cursor-pointer hover:text-green-600">
                    Comandas Completadas (5)
                </button>
                <button className="px-2.5 cursor-pointer hover:text-green-600">
                    Comandas Canceladas (0)
                </button>
            </div>

            {/* Contenedor principal con flex */}
            <div className="flex flex-wrap gap-4 py-5 px-5  justify-center">
                {tables.map((table) => {
                    const [visibleDropdown, setVisibleDropdown] = useState(null); // Estado local para cada card
                    const dropdownRef = useRef(null); // Referencia al contenedor del dropdown

                    const toggleDropdown = (index) => {
                        setVisibleDropdown(visibleDropdown === index ? null : index); // Alterna el dropdown visible
                    };

                    const handleClickOutside = (event) => {
                        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                            setVisibleDropdown(null); // Cierra el dropdown si se hace clic fuera
                        }
                    };

                    useEffect(() => {
                        document.addEventListener("mousedown", handleClickOutside);
                        return () => {
                            document.removeEventListener("mousedown", handleClickOutside);
                        };
                    }, []);

                    return (
                        <div
                            key={table.tableNumber}
                            className="w-full md:w-[40%]  xl:w-1/4 p-2 " // Ajusta el ancho de las tarjetas según el tamaño de pantalla
                        >
                            <div
                                className="border-l-green-600 border-l-5 bg-white shadow-md rounded-lg flex flex-col "
                                
                            >
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
                                        {table.products.map((product, index) => (
                                            <div
                                                key={product.id}
                                                className="bg-white rounded-lg mx-4 flex flex-col h-auto py-2 mb-4"
                                            >
                                                <div className="flex justify-between px-2">
                                                    <p className="h-auto">{product.name}</p>
                                                    <div
                                                        className="flex w-1/5 justify-between dropdown-container"
                                                        ref={dropdownRef} // Asigna la referencia al contenedor
                                                    >
                                                        <div className="border-1 rounded-md border-gray-500">
                                                            <p className="text-xs self-center text-gray-500 px-1">X{product.quantity}</p>
                                                        </div>
                                                        <div className="flex md:ml-auto relative">
                                                            <button
                                                                className="border-1 cursor-pointer text-sm rounded-md px-1"
                                                                onClick={() => toggleDropdown(index + 1)} // Identifica el dropdown
                                                            >
                                                                <BsThreeDotsVertical className="text-gray-500" />
                                                            </button>
                                                            {visibleDropdown === index + 1 && (
                                                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg flex px-2">
                                                                    <FaTrashAlt className="self-center" />
                                                                    <button
                                                                        className="w-full text-left px-2 py-2 text-sm"
                                                                        onClick={() => {
                                                                            setSelectedProduct(product.id); // Selecciona el producto
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
                                                {product.note && <p className="text-xs pl-2 py-1">{product.note}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="px-4 py-2 justify-between w-full flex">
                                        <button className="bg-red-600 text-white text-xl font-bold cursor-pointer rounded-md py-1 w-1/3">Cancelar</button>
                                        <button className="bg-green-600 text-white text-xl font-bold cursor-pointer rounded-md py-1 w-1/3">
                                            Realizado
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}