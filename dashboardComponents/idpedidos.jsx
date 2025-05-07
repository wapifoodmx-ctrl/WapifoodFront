import { useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { AiOutlineClockCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";

export default function IdPedidos() {
    const [selectedPedido, setSelectedPedido] = useState(null); // Estado para el pedido seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Estado para la modal de confirmación

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

    const dataProductos = [
        {
            nombre: "Pizza Margherita",
            precio: "$150.00",
            cantidad: 1,
            precioUnitario: "$150.00",
        },
        {
            nombre: "Refresco de cola",
            precio: "$50.00",
            cantidad: 2,
            precioUnitario: "$25.00",
        },
        {
            nombre: "Palitos de ajo",
            precio: "$45.50",
            cantidad: 1,
            precioUnitario: "$45.50",
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

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true); // Abre la modal de confirmación
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false); // Cierra la modal de confirmación
    };

    const handleCancelPedido = () => {
        console.log("Pedido cancelado:", selectedPedido.ID);
        closeConfirmModal();
        closeModal();
    };

    return (
        <>
            <h3 className="md:hidden text-justify font-bold w-full pt-4">
                <p className="text-center"> 
                 Para poder ver el detalle de los pedidos se necesta abrir desde una pantalla más grande o poner el dispositivo en modo "sitio de escritorio"
                </p>
            </h3>
            <section className="py-10 w-full  flex-col flex-wrap hidden md:flex">


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
                    <div key={index} className="flex ">
                        <p className="w-1/5 h-4 py-0 px-2.5 self-center flex items-center mx-auto my-auto">{item.ID}</p>
                        <p className="w-1/5 flex flex-col py-0.5 px-2.5 self-center mx-auto my-auto">
                            {item.Fecha} <span className="text-gray-500 text-sm">{item.Hora}</span>
                        </p>
                        <p className="w-1/5 flex flex-col py-0.5 px-2.5 self-center mx-auto my-auto">
                            {item.Total} <span className="text-gray-500 text-sm">{item.Metodo}</span>
                        </p>
                        <div className="w-1/5 self-center flex items-center justify-center">
                            <p
                                className={`flex gap-1 justify-center items-center py-0.5 px-2.5 w-6/7 text-xs rounded-xl ${item.Estado === "Completado"
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
                        className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 overflow-y-auto"
                        onClick={closeModal} // Cierra el modal al hacer clic fuera del contenido
                    >
                        <div
                            className="bg-white p-6 rounded-lg shadow-lg w-6/8 max-h-10/12 overflow-y-auto relative"
                            onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal cierre la ventana
                        >
                            {/* Botón "Cancelar Pedido" */}
                            {(selectedPedido.Estado === "Completado" ||
                                selectedPedido.Estado === "En Proceso" ||
                                selectedPedido.Estado === "Pendiente") && (
                                    <button
                                        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                                        onClick={openConfirmModal}
                                    >
                                        Cancelar Pedido
                                    </button>
                                )}

                            <h2 className="text-xl font-bold mb-4">Detalles del Pedido</h2>
                            <h3 className="font-bold border-b-1 mb-4">INFO</h3>
                            <p><strong>ID:</strong> {selectedPedido.ID}</p>
                            <p><strong>Fecha:</strong> {selectedPedido.Fecha}</p>
                            <p><strong>Hora:</strong> {selectedPedido.Hora}</p>
                            <p><strong>Total:</strong> {selectedPedido.Total}</p>
                            <p><strong>Método:</strong> {selectedPedido.Metodo}</p>
                            <p className="flex items-center gap-2">
                                <strong>Estado:</strong>
                                <span
                                    className={`flex items-center gap-1 py-0.5 px-2.5 text-xs rounded-xl ${selectedPedido.Estado === "Completado"
                                        ? "text-green-800 bg-green-300"
                                        : selectedPedido.Estado === "En Proceso"
                                            ? "text-blue-800 bg-blue-300"
                                            : selectedPedido.Estado === "Pendiente"
                                                ? "text-yellow-800 bg-yellow-300"
                                                : "text-red-800 bg-red-300"
                                        }`}
                                >
                                    {selectedPedido.Estado === "Completado" && <BsCheck2Circle />}
                                    {selectedPedido.Estado === "En Proceso" && <AiOutlineClockCircle />}
                                    {selectedPedido.Estado === "Pendiente" && <RiErrorWarningLine />}
                                    {selectedPedido.Estado === "Cancelado" && <AiOutlineCloseCircle />}
                                    {selectedPedido.Estado}
                                </span>
                            </p>
                            <div>
                                <h3 className="font-bold mt-4 border-b-1 mb-4">PRODUCTOS</h3>
                                {dataProductos.map((producto, index) => (
                                    <div key={index}>
                                        <p className="flex justify-between font-bold">{producto.nombre}<span>{producto.precio}</span></p>
                                        <p className="flex justify-between text-xs text-gray-600 mb-4">Cantidad: {producto.cantidad}<span>{producto.precioUnitario} c/u</span></p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 border-t pt-4">
                                <p className="flex justify-between font-bold text-lg">
                                    Total:
                                    <span>
                                        {dataProductos.reduce((total, producto) => {
                                            const precioNumerico = parseFloat(producto.precio.replace("$", ""));
                                            return total + precioNumerico;
                                        }, 0).toFixed(2)} MXN
                                    </span>
                                </p>
                            </div>

                            <button
                                className="mt-4 px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500 cursor-pointer"
                                onClick={closeModal}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal de confirmación */}
                {isConfirmModalOpen && (
                    <div
                        className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                        onClick={closeConfirmModal} // Cierra la modal al hacer clic fuera del contenido
                    >
                        <div
                            className="bg-white p-6 rounded-lg shadow-lg w-1/3"
                            onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal cierre la ventana
                        >
                            <h2 className="text-xl font-bold mb-4">¿Seguro que quieres cancelar el pedido?</h2>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                                    onClick={closeConfirmModal}
                                >
                                    No
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                                    onClick={handleCancelPedido}
                                >
                                    Sí
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}