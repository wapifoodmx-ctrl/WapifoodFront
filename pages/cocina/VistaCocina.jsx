import { LuCupSoda } from "react-icons/lu";
import { BsClock } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";

export default function VistaCocina() {
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
            <div className="py-5 px-5">
                {/* Tarjeta de la comanda */}
                <div className="max-w-96 max-h-80 border-1 bg-white shadow-md rounded-lg">
                    {/* Encabezado de la tarjeta */}
                    <div>
                        <p className="font-bold text-xl pl-4">Mesa 1</p>
                        <div className="flex justify-between px-4">
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
                            <div className="bg-white rounded-lg mx-4 flex flex-col h-11">
                                <div className="flex ">
                                    <p className="px-2 pr-6">Hamburguesa Doble</p>
                                    <div className="border-1 rounded-md border-gray-500 ">
                                        <p className="text-xs self-center text-gray-500 py-0.5 px-1">X4</p>
                                    </div>
                                    <div className="flex ml-auto pr-5">
                                        <button className="border-1 cursor-pointer text-sm rounded-md py-0.5 px-1">
                                            Iniciar
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs pl-2">Una sin cebolla</p>
                            </div>
                            <div className="pt-4">
                                <div className="bg-white rounded-lg mx-4 flex flex-col h-11">
                                    <div className="flex">
                                        <p className="px-2 pr-6">Nachos con Guacamole</p>
                                        <div className="border-1 rounded-md border-gray-500 ">
                                            <p className="text-xs self-center text-gray-500 py-0.5 px-1">X1</p>
                                        </div>
                                        <div className="flex ml-auto pr-5">
                                            <button className="border-1 cursor-pointer text-sm rounded-md py-0.5 px-1">
                                                Iniciar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 px-5">
                                <div className="flex">
                                <LuCupSoda className="self-center"/>
                                <p className="pl-1">Bebidas</p>
                                </div>
                                <div className="flex py-3 ">
                                    <p>Coca cola Light</p>
                                    <p className="ml-auto pr-3">x4</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}