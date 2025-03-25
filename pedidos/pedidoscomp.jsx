import IdPedidos from "@/dashboardComponents/idpedidos";
import Pedidos from "@/dashboardComponents/pedidos";
import { FiFilter } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
export default function Pedidoscomp() {
    return (
        <section className="p-4">
            <div className="lg:flex lg:justify-between lg:items-center lg:mb-4">

                {/* Barra de búsqueda */}
                <div className="flex py-1 px-3 rounded-xl border-gray-500 border-2 mb-4 lg:w-5/12">
                    <HiOutlineMagnifyingGlass className="text-xl" />
                    <input type="text" placeholder="Buscar por ID o cliente..." className="ml-2 w-full outline-none" />
                </div>

                {/* Dropdowns */}
                <div className="flex gap-4 mb-4">
                    <div className="relative">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <FiFilter className="text-2xl" />
                            <select
                                id="disponibilidad"
                                className="w-full outline-none bg-transparent"
                            >
                                <option value="" disabled selected>
                                    Estado:
                                </option>
                                <option value="todas">Todas</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="En proceso">En proceso</option>
                                <option value="Completado">Completado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>
                    {/* Dropdown Categorías */}
                    <div className="relative">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <FaRegCalendarAlt className="text-2xl" />
                            <select
                                id="categorias"
                                className="w-full outline-none bg-transparent"
                            >
                                <option value="" disabled selected>
                                    Fecha:
                                </option>
                                <option value="todas">Todas las fechas</option>
                                <option value="Hoy">Hoy</option>
                                <option value="Ayer">Ayer</option>
                                <option value="Esta semana">Esta semana</option>

                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <Pedidos />
            <IdPedidos />
        </section>
    )
}