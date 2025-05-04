import IdPedidos from "@/dashboardComponents/idpedidos";
import Pedidos from "@/dashboardComponents/pedidos";
import { FiFilter } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
export default function Pedidoscomp() {
    return (
        <section className="p-4">
            <Pedidos />
            <IdPedidos />
        </section>
    )
}