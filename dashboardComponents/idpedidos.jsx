import { useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { AiOutlineClockCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";

export default function IdPedidos() {
    const [selectedPedido, setSelectedPedido] = useState(null); // Estado para el pedido seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

    const data = [
        {
            ID: "PED-1001",
            Fecha: "2025-03-15",
            Hora: "13:45",
            Total: "$245.50",
            Metodo: "Tarjeta de credito",
            Estado: "Completado"
        },
        {
            ID: "PED-1002",
            Fecha: "2025-03-15",
            Hora: "14:20",
            Total: "$125.00",
            Metodo: "Efectivo",
            Estado: "En Proceso"
        },
        {
            ID: "PED-1003",
            Fecha: "2025-03-15",
            Hora: "12:30",
            Total: "$320.75",
            Metodo: "PayPal",
            Estado: "Pendiente"
        },
        {
            ID: "PED-1004",
            Fecha: "2025-03-15",
            Hora: "10:45",
            Total: "$200.00",
            Metodo: "MercadoPago",
            Estado: "Cancelado"
        },
    ];

    const openModal = (pedido) => {
        setSelectedPedido(pedido); // Establece el pedido seleccionado
        setIsModalOpen(true); // Abre el modal
    };

    const closeModal = () => {
        setSelectedPedido(null); // Limpia el pedido seleccionado
        setIsModalOpen(false); // Cierra el modal
    };

    return (
        <section className="py-10 px-4 w-full flex flex-col flex-wrap">
            {/* Encabezados */}
            <div className="flex text-gray-400 font-bold bg-gray-200">
                <p className="w-1/5 text-center mt-4 px-2.5 py-0.5">ID Pedido</p>
                <p className="w-1/5 text-center mt-4 px-2.5 py-0.5">Fecha y Hora</p>
                <p className="w-1/5 text-center mt-4 px-2.5 py-0.5">Total</p>
                <p className="w-1/5 text-center mt-4 px-2.5 py-0.5">Estado</p>
                <p className="w-1/5 text-center mt-4 px-2.5 py-0.5">Detalles</p>
            </div>

            {/* Mapeo de datos */}
            {data.map((item, index) => (
                <div key={index} className="flex">
                    <p className="w-1/5 h-4 py-0 px-2.5 self-center flex items-center mx-auto my-auto">{item.ID}</p>
                    <p className="w-1/5 flex flex-col py-0.5 px-2.5 self-center mx-auto my-auto">
                        {item.Fecha} <span className="text-gray-500 text-sm">{item.Hora}</span>
                    </p>
                    <p className="w-1/5 flex flex-col py-0.5 px-2.5 self-center mx-auto my-auto">
                        {item.Total} <span className="text-gray-500 text-sm">{item.Metodo}</span>
                    </p>
                    <div className="w-1/5 self-center flex items-center justify-center">
                        <p
                            className={`flex gap-1 justify-center items-center py-0.5 px-2.5 w-6/7 text-xs rounded-xl ${
                                item.Estado === "Completado"
                                    ? "text-green-800 bg-green-300"
                                    : item.Estado === "En Proceso"
                                    ? "text-blue-800 bg-blue-300"
                                    : item.Estado === "Pendiente"
                                    ? "text-yellow-800 bg-yellow-300"
                                    : "text-red-800 bg-red-300"
                            }`}
                        >
                            <span>
                                {item.Estado === "Completado" && <BsCheck2Circle />}
                                {item.Estado === "En Proceso" && <AiOutlineClockCircle />}
                                {item.Estado === "Pendiente" && <RiErrorWarningLine />}
                                {item.Estado === "Cancelado" && <AiOutlineCloseCircle />}
                            </span>
                            {item.Estado}
                        </p>
                    </div>
                    <button
                        className="text-orange-500 w-1/5 cursor-pointer"
                        onClick={() => openModal(item)}
                    >
                        Ver Detalles
                    </button>
                </div>
            ))}

            {/* Modal */}
            {isModalOpen && selectedPedido && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal} // Cierra el modal al hacer clic fuera del contenido
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-1/3"
                        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal cierre la ventana
                    >
                        <h2 className="text-xl font-bold mb-4">Detalles del Pedido</h2>
                        <p><strong>ID:</strong> {selectedPedido.ID}</p>
                        <p><strong>Fecha:</strong> {selectedPedido.Fecha}</p>
                        <p><strong>Hora:</strong> {selectedPedido.Hora}</p>
                        <p><strong>Total:</strong> {selectedPedido.Total}</p>
                        <p><strong>Método:</strong> {selectedPedido.Metodo}</p>
                        <p><strong>Estado:</strong> {selectedPedido.Estado}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                            onClick={closeModal}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}