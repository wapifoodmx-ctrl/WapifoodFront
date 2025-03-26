import { MdOutlineAttachMoney } from "react-icons/md";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FiFilter } from "react-icons/fi";
import { BsTag } from "react-icons/bs";

export default function MenuComponentes() {
    const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
    const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);

    const closeModals = () => {
        setIsProductoModalOpen(false);
        setIsCategoriaModalOpen(false);
    };

    return (
        <section className="lg:flex my-4 lg:gap-4 lg:justify-between lg:items-center">
            {/* Barra de búsqueda */}
            <div className="flex py-1 px-3 rounded-xl border-gray-500 border-2 mb-4 lg:mb-0 lg:w-6/12 justify-center items-center">
                <HiOutlineMagnifyingGlass className="text-xl" />
                <input type="text" placeholder="Buscar..." className="ml-2 w-full outline-none" />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                {/* Dropdowns */}
                <div className="flex gap-4">
                    {/* Dropdown Categorías */}
                    <div className="relative">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <BsTag className="text-2xl" />
                            <select id="categorias" className="w-full outline-none bg-transparent">
                                <option value="" disabled selected>
                                    Categorías
                                </option>
                                <option value="todas">Todas</option>
                                <option value="entradas">Entradas</option>
                                <option value="platos-principales">Platos principales</option>
                                <option value="postres">Postres</option>
                                <option value="bebidas">Bebidas</option>
                                <option value="combos">Combos</option>
                            </select>
                        </div>
                    </div>

                    {/* Dropdown Disponibilidad */}
                    <div className="relative">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <FiFilter className="text-2xl" />
                            <select id="disponibilidad" className="w-full outline-none bg-transparent">
                                <option value="" disabled selected>
                                    Disponibilidad
                                </option>
                                <option value="todas">Todas</option>
                                <option value="disponibles">Disponibles</option>
                                <option value="no-disponibles">No Disponibles</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                    <button
                        className="p-2 text-sm bg-green-500 text-white rounded-2xl cursor-pointer w-full flex justify-center items-center"
                        onClick={() => setIsProductoModalOpen(true)}
                    >
                        <span className="flex justify-center items-center gap-4">
                            <FaPlus size={20} /> Productos
                        </span>
                    </button>
                    <button
                        className="p-2 border rounded-2xl cursor-pointer ml-2 w-full flex justify-center items-center"
                        onClick={() => setIsCategoriaModalOpen(true)}
                    >
                        <span className="flex justify-center items-center gap-2">
                            <BsTag size={20} /> Categorías
                        </span>
                    </button>
                </div>
            </div>

            {/* Modal de Productos */}
            {isProductoModalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={closeModals}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-3/5 h-7/12"
                        onClick={(e) => e.stopPropagation()} // Evita cerrar la modal al hacer clic dentro
                    >
                        <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
                        <p className="font-bold text-gray-600 pb-2">Nombre del producto</p>
                        <div className="flex py-2 w-full rounded-xl border-gray-500 border-2">
                            <input type="text" className="ml-2 w-full outline-none cursor-text" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-600 py-2">Descripción</p>
                            <textarea
                                className="gap-4 w-full h-40 rounded-xl border-gray-500 border-2 outline-none"
                                placeholder="Escribe una descripción..."
                            ></textarea>
                        </div>
                        <div className="flex gap-4 mt-4 w-1/3">
                            <div>
                                <p className="font-bold text-gray-600 pb-2 h-">Precio</p>
                                <div className="flex py-1 px-3 rounded-xl border-gray-500 border-2 mb-4 w-45">
                                    <MdOutlineAttachMoney className="text-2xl" />
                                    <input type="text" className="ml-2 w-full outline-none" />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-gray-600 pb-2">Categoría</p>
                                <select
                                    className=" px-3 py-2 border-2 border-gray-500 rounded-md outline-none cursor-pointer"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Seleccionar Categoría
                                    </option>
                                    <option value="entradas">Entradas</option>
                                    <option value="platos-principales">Platos principales</option>
                                    <option value="postres">Postres</option>
                                    <option value="bebidas">Bebidas</option>
                                    <option value="combos">Combos</option>
                                </select>

                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-gray-600 pb-2 ">Imagen del Producto</p>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
                                    onClick={() => document.getElementById("fileInput").click()} // Activa el input file al hacer clic
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-image h-4 w-4 mr-2"
                                    >
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                        <circle cx="9" cy="9" r="2"></circle>
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                    </svg>
                                    Seleccionar imagen
                                </button>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden" // Oculta el input real
                                />
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                id="productoDisponible"
                                className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-400"
                            />
                            <label htmlFor="productoDisponible" className="ml-2 text-gray-700">
                                Producto disponible
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <button className="gap-4 mt-4">
                                <span className="mt-4 px-4 py-2 border-2 rounded cursor-pointer">Agregar Producto</span>
                            </button>

                            <button
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                                onClick={closeModals}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de Categorías */}
            {isCategoriaModalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={closeModals}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-1/3"
                        onClick={(e) => e.stopPropagation()} // Evita cerrar la modal al hacer clic dentro
                    >
                        <h2 className="text-xl font-bold mb-4">Nueva Categoría</h2>
                        <p className="text-gray-700">Aquí puedes agregar una nueva categoría.</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={closeModals}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}