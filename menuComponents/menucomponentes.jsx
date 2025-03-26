import { FaPlus } from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FiFilter } from "react-icons/fi";
import { BsTag } from "react-icons/bs";
export default function MenuComponentes() {
    return (
        <section className=" lg:flex my-4 lg:gap-4 lg:justify-between lg:items-center">
            {/* Barra de búsqueda */}
            <div className="flex py-1 px-3 rounded-xl border-gray-500 border-2 mb-4 lg:mb-0 lg:w-6/12 justify-center items-center" >
                <HiOutlineMagnifyingGlass className="text-xl" />
                <input type="text" placeholder="Buscar..." className="ml-2 w-full outline-none" />
            </div>

            <div className=" flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                {/* Dropdowns */}
                <div className="flex gap-4">
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
                    <button className="p-2 text-sm bg-green-500 text-white rounded-2xl cursor-pointer w-full flex justify-center items-center">
                        <span className="flex justify-center items-center gap-4"> <FaPlus size={20} /> Productos</span>
                    </button>
                    <button className=" p-2 border rounded-2xl cursor-pointer  ml-2  w-full ">
                        <span className="flex justify-center items-center gap-2 "> <BsTag size={20} /> Categorías</span>
                    </button>
                </div>
            </div>

        </section>



    );
}