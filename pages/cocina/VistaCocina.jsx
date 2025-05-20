import { useState, useEffect } from "react"; // Importa useEffect
import { FaTrashAlt } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { MdTableBar } from "react-icons/md";
import { LuCupSoda } from "react-icons/lu";
import { BsClock } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function VistaCocina() {
    const [visibleDropdown, setVisibleDropdown] = useState(null); // Estado para controlar qué dropdown está abierto

    const toggleDropdown = (index) => {
        setVisibleDropdown(visibleDropdown === index ? null : index); // Alterna el dropdown visible
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest(".dropdown-container")) {
            setVisibleDropdown(null); // Cierra todos los dropdowns si se hace clic fuera
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full mt-16">
            {/* Barra de botones con scroll horizontal */}
            <div className="w-full flex shadow-md p-4 overflow-x-auto whitespace-nowrap">
                <button className="px-2.5 cursor-pointer hover:text-green-600">
                    Todas las Comandas (10)
                </button>
                <button className="px-2.5 cursor-pointer hover:text-green-600">
                    Comandas en Proceso (5)
                </button>
                <button className="px-2.5 cursor-pointer hover:text-green-600">
                    Comandas Completadas (5)
                </button>
                <button className="px-2.5 cursor-pointer hover:text-green-600">
                    Comandas Canceladas (0)
                </button>
            </div>

            {/* Contenedor principal */}
            <div className="py-5 px-5 ">
                {/* Tarjeta de la comanda */}
                <div className="max-w-96 border-l-green-600 border-l-5 bg-white shadow-md rounded-lg ">
                    {/* Encabezado de la tarjeta */}
                    <div className="py-2">
                        <div className="flex pl-4 ">
                            <MdTableBar className="self-center text-2xl" />
                            <p className="font-bold text-xl pl-2">1</p>
                            <GoDotFill className="self-center text-green-600" />
                        </div>
                        <div className="flex justify-between px-4 pb-2">
                            {/* Fecha */}
                            <div className="flex">
                                <LuCalendarDays className="text-gray-500 text-sm self-center" />
                                <p className="text-sm text-gray-500 pl-1">10/05/2025</p>
                            </div>
                            {/* Hora */}
                            <div className="flex">
                                <BsClock className="text-gray-500 text-sm self-center" />
                                <p className="text-sm text-gray-500 pl-1">14:10</p>
                            </div>
                        </div>

                        {/* Productos */}
                        <div className="flex flex-col bg-gray-100 rounded-lg ">
                            <p className="pl-4 pt-2 text-gray-500 font-bold">Productos</p>
                            {/* Producto */}
                            <div className="bg-white rounded-lg mx-4 flex flex-col h-16 py-2">
                                <div className="flex justify-between px-2">
                                    <p className=" h-auto">Hamburguesa Doble</p>
                                    <div className="flex w-1/5 justify-between dropdown-container">
                                        <div className="border-1 rounded-md border-gray-500">
                                            <p className="text-xs self-center text-gray-500 px-1">X3</p>
                                        </div>
                                        <div className="flex md:ml-auto relative">
                                            <button
                                                className="border-1 cursor-pointer text-sm rounded-md px-1"
                                                onClick={() => toggleDropdown(1)} // Identifica el dropdown
                                            >
                                                <BsThreeDotsVertical className="text-gray-500" />
                                            </button>
                                            {visibleDropdown === 1 && ( // Renderiza el dropdown si está visible
                                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg flex px-2">
                                                    <FaTrashAlt className="self-center" />
                                                    <button
                                                        className="w-full text-left px-2 py-2 text-sm"
                                                        onClick={() => alert("Producto eliminado")}
                                                    >
                                                        Eliminar producto
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <div className="bg-white rounded-lg mx-4 flex flex-col h-16 py-2">
                                    <div className="flex justify-between px-2">
                                        <p className=" h-auto">Hamburguesa Doble</p>
                                        <div className="flex w-1/5 justify-between dropdown-container">
                                            <div className="border-1 rounded-md border-gray-500">
                                                <p className="text-xs self-center text-gray-500 px-1">X1</p>
                                            </div>
                                            <div className="flex md:ml-auto relative">
                                                <button
                                                    className="border-1 cursor-pointer text-sm rounded-md px-1"
                                                    onClick={() => toggleDropdown(2)} // Identifica el dropdown
                                                >
                                                    <BsThreeDotsVertical className="text-gray-500" />
                                                </button>
                                                {visibleDropdown === 2 && ( // Renderiza el dropdown si está visible
                                                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg flex px-2">
                                                        <FaTrashAlt className="self-center" />
                                                        <button
                                                            className="w-full text-left px-2 py-2 text-sm"
                                                            onClick={() => alert("Producto eliminado")}
                                                        >
                                                            Eliminar producto
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs pl-2 py-1">Sin cebolla</p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <div className="bg-white rounded-lg mx-4 flex flex-col h-16 py-2">
                                    <div className="flex justify-between px-2">
                                        <p className=" h-auto">Nachos con Queso</p>
                                        <div className="flex w-1/5 justify-between dropdown-container">
                                            <div className="border-1 rounded-md border-gray-500">
                                                <p className="text-xs self-center text-gray-500 px-1">X1</p>
                                            </div>
                                            <div className="flex md:ml-auto relative">
                                                <button
                                                    className="border-1 cursor-pointer text-sm rounded-md px-1"
                                                    onClick={() => toggleDropdown(3)} // Identifica el dropdown
                                                >
                                                    <BsThreeDotsVertical className="text-gray-500" />
                                                </button>
                                                {visibleDropdown === 3 && ( // Renderiza el dropdown si está visible
                                                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg flex px-2">
                                                        <FaTrashAlt className="self-center" />
                                                        <button
                                                            className="w-full text-left px-2 py-2 text-sm"
                                                            onClick={() => alert("Producto eliminado")}
                                                        >
                                                            Eliminar producto
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="pt-4 px-5">
                                <div className="flex">
                                    <LuCupSoda className="self-center" />
                                    <p className="pl-1">Bebidas</p>
                                </div>
                                <div className="flex py-3 ">
                                    <p>Coca cola Light</p>
                                    <p className="ml-auto pr-3">x2</p>
                                    <div className="flex relative dropdown-container">
                                        <button
                                            className="border-1 cursor-pointer text-sm rounded-md px-1"
                                            onClick={() => toggleDropdown(4)} // Identifica el dropdown
                                        >
                                            <BsThreeDotsVertical className="text-gray-500" />
                                        </button>
                                        {visibleDropdown === 4 && ( // Renderiza el dropdown si está visible
                                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg flex px-2">
                                                <FaTrashAlt className="self-center" />
                                                <button
                                                    className="w-full text-left px-2 py-2 text-sm"
                                                    onClick={() => alert("Producto eliminado")}
                                                >
                                                    Eliminar producto
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex py-3 ">
                                    <p>Sprite</p>
                                    <p className="ml-auto pr-3">x2</p>
                                    <div className="flex relative dropdown-container">
                                        <button
                                            className="border-1 cursor-pointer text-sm rounded-md px-1"
                                            onClick={() => toggleDropdown(5)} // Identifica el dropdown
                                        >
                                            <BsThreeDotsVertical className="text-gray-500" />
                                        </button>
                                        {visibleDropdown === 5 && ( // Renderiza el dropdown si está visible
                                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg flex px-2">
                                                <FaTrashAlt className="self-center" />
                                                <button
                                                    className="w-full text-left px-2 py-2 text-sm"
                                                    onClick={() => alert("Producto eliminado")}
                                                >
                                                    Eliminar producto
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <div className="px-4 py-2">
                                <button className="w-full bg-green-600 text-white text-xl font-bold cursor-pointer rounded-md py-1">
                                    Realizado
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}