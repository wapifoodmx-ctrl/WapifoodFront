import { FaPlus } from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FiFilter } from "react-icons/fi";
import { BsTag } from "react-icons/bs";
import { getProducts } from "@/useCases/getProducts";
export default function MenuComponentes() {
    return (
        <section className="p-4 pt-4">
            {/* Barra de búsqueda */}
            <div className="flex py-1 px-3 rounded-xl border-gray-500 border-2 mb-4 w-full lg:w4/12 ">
                <HiOutlineMagnifyingGlass className="text-xl" />
                <input type="text" placeholder="Buscar..." className="ml-2 w-full outline-none" />
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">


                {/* Dropdowns */}
                <div className="flex gap-4  ">
                    {/* Dropdown Categorías */}
                    <div className="relative">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <BsTag className="text-2xl" />
                            <select
                                id="categorias"
                                className="w-full outline-none bg-transparent"
                            >
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
                            <select
                                id="disponibilidad"
                                className="w-full outline-none bg-transparent"
                            >
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
                    <button className="px-3 py-2 bg-green-500 text-white rounded-2xl cursor-pointer flex justify-center items-center">
                        <FaPlus className="text-3xl pr-2" />Nuevo Producto
                    </button>
                    <button className="px-3 py-2 border rounded-2xl cursor-pointer  flex ml-2 justify-center items-center">
                        <BsTag className="text-3xl pr-2" />Gestionar Categorías
                    </button>
                </div>
            </div>
        </section>
    );
}