import { LuCalendarDays } from "react-icons/lu";
import { BsClock } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { FiPrinter } from "react-icons/fi";
import getOrderTickets from "../../useCases/getOrderTickets"; // Importar la nueva función

export default function Ticketview() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketsData, setTicketsData] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const apiData = await getOrderTickets();
                
                // Agrupar órdenes por order_uuid y combinar productos
                const groupedOrders = apiData.reduce((acc, order) => {
                    const uuid = order.order_uuid;
                    
                    if (!acc[uuid]) {
                        // Primera vez que vemos este UUID, crear la entrada
                        acc[uuid] = {
                            id: order.order_uuid,
                            mesa: `Mesa ${order.mesa_number}`,
                            fecha: new Date(order.date_time).toLocaleDateString(),
                            hora: new Date(order.date_time).toLocaleTimeString(),
                            restaurante: order.restaurant_name,
                            estado: order.state,
                            statusOrden: order.order_status,
                            metodoPago: order.metodo_pago,
                            productos: [],
                            total: 0
                        };
                    }
                    
                    // Agregar productos de esta orden
                    const mappedProducts = order.products.map(product => ({
                        nombre: product.product_name,
                        cantidad: product.quantity,
                        precio: parseFloat(product.unit_price),
                        subtotal: parseFloat(product.subtotal),
                        status: product.order_detail_status.toLowerCase() === "pendiente" ? null : product.order_detail_status.toLowerCase()
                    }));
                    
                    acc[uuid].productos.push(...mappedProducts);
                    // Sumar solo una vez por orden, no por total acumulado
                    acc[uuid].total += parseFloat(order.total);
                    
                    return acc;
                }, {});
                
                // Convertir el objeto agrupado a array
                const mappedTickets = Object.values(groupedOrders);
                
                setTicketsData(mappedTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };

        fetchTickets();
    }, []);

    // Datos del restaurante
    const restauranteData = {
        nombre: "Restaurante El Buen Sabor",
        direccion: "Av. Principal #123, Ciudad, Estado"
    };

    const handleCardClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handlePrintTicket = () => {
        setIsEmailModalOpen(true);
    };

    const handleSendEmail = () => {
        console.log(`Enviando ticket a: ${email}`);
        setIsEmailModalOpen(false);
        setEmail("");
        setIsModalOpen(false);
    };

    // Función para calcular el total de un ticket (excluyendo productos cancelados)
    const calculateTotal = (productos) => {
        return productos.reduce((sum, producto) => {
            if (producto.status === "cancelado") {
                return sum; // No sumar productos cancelados
            }
            return sum + (producto.cantidad * producto.precio); // Multiplicar cantidad por precio
        }, 0);
    };

    // Función para mostrar productos en la card (máximo 2, resto como "+x productos")
    const renderProductsForCard = (productos) => {
        if (productos.length <= 2) {
            return productos.map((producto, index) => (
                <li key={index} className="flex justify-between py-1">
                    <span className={producto.status === "cancelado" ? "text-red-500 line-through" : ""}>
                        {producto.nombre}
                    </span>
                    <span className="text-gray-600">x{producto.cantidad}</span>
                </li>
            ));
        } else {
            const firstTwo = productos.slice(0, 2);
            const remaining = productos.length - 2;
            return [
                ...firstTwo.map((producto, index) => (
                    <li key={index} className="flex justify-between py-1">
                        <span className={producto.status === "cancelado" ? "text-red-500 line-through" : ""}>
                            {producto.nombre}
                        </span>
                        <span className="text-gray-600">x{producto.cantidad}</span>
                    </li>
                )),
                <li key="more" className="flex justify-between py-1">
                    <span className="text-gray-500 italic">+{remaining} productos</span>
                    <span></span>
                </li>
            ];
        }
    };

    return (
        <div className="pt-20 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ticketsData.map((ticket) => (
                    
                    <div 
                        key={ticket.id}
                        className="w-full border-l-green-600 border-l-5 bg-white shadow-md rounded-lg flex flex-col"
                        onClick={() => handleCardClick(ticket)}
                    >
                        <div className="py-2 flex-grow">
                            <div className="flex pl-4">
                                <p className="font-bold text-xl pl-2">Ticket UUID: {ticket.id}</p>
                            </div>
                            <div className="flex justify-between px-4 pb-2">
                                <div className="flex">
                                    <LuCalendarDays className="text-gray-500 text-sm self-center" />
                                    <p className="text-sm text-gray-500 pl-1">{ticket.fecha}</p>
                                </div>
                                <div className="flex">
                                    <BsClock className="text-gray-500 text-sm self-center" />
                                    <p className="text-sm text-gray-500 pl-1">{ticket.hora}</p>
                                </div>
                            </div>

                            {/* Productos */}
                            <div className="flex flex-col bg-gray-100 rounded-lg flex-grow overflow-y-auto">
                                <p className="pl-4 pt-2 text-gray-500 font-bold">Productos</p>
                                {ticket.productos.map((producto, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg mx-4 flex flex-col h-auto py-2 mb-4 justify-between"
                                    >
                                        <div className="flex justify-between px-2 items-center flex-wrap">
                                            <p className="h-auto text-xl font-bold max-w-[60%] truncate">{producto.nombre}</p>
                                            <div className="flex w-auto gap-2">
                                                <div className="border rounded-md border-gray-500 px-2 py-1">
                                                    <p className="text-md self-center text-gray-500 font-bold">
                                                        x{producto.cantidad}
                                                    </p>
                                                </div>
                                                <div className="border rounded-md border-gray-500 px-2 py-1">
                                                    <p className="text-md self-center text-gray-500 font-bold">
                                                        ${producto.precio.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {producto.status === "cancelado" && (
                                            <p className="text-xs pl-2 py-1 font-bold text-red-500 line-through">
                                                Cancelado
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="px-4 py-2 justify-between w-full flex">
                                <p className="font-bold text-lg">Total:</p>
                                <p className="font-bold text-lg">${calculateTotal(ticket.productos).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal principal del ticket */}
            {isModalOpen && selectedTicket && (
                <div
                    className={`fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[998]`}
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de cerrar (X) */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <IoClose />
                        </button>

                        {/* Información del restaurante */}
                        <div className="text-center mb-4 border-b pb-4">
                            <h1 className="font-bold text-lg">{restauranteData.nombre}</h1>
                            <p className="text-gray-600 text-sm">{restauranteData.direccion}</p>
                        </div>

                        {/* Información del ticket */}
                        <div className="mb-4">
                            <h2 className="font-bold text-xl">Ticket UUID: {selectedTicket.id}</h2>
                            <p className="text-gray-600">{selectedTicket.mesa}</p>
                            <div className="flex justify-between mt-2 text-sm">
                                <div className="flex">
                                    <LuCalendarDays className="self-center" />
                                    <p className="pl-1">{selectedTicket.fecha}</p>
                                </div>
                                <div className="flex">
                                    <BsClock className="self-center" />
                                    <p className="pl-1">{selectedTicket.hora}</p>
                                </div>
                            </div>
                        </div>

                        {/* Productos con precios */}
                        <div className="mb-4">
                            <h3 className="font-bold text-lg mb-3">Productos</h3>
                            <div className="space-y-2">
                                {selectedTicket.productos.map((producto, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <span className={`font-medium ${producto.status === "cancelado" ? "text-red-500 line-through" : ""}`}>
                                                {producto.nombre}
                                            </span>
                                            <div className="text-sm text-gray-600">
                                                x{producto.cantidad} - ${producto.precio.toFixed(2)} c/u
                                            </div>
                                        </div>
                                        <div className={`font-bold ${producto.status === "cancelado" ? "text-red-500 line-through" : ""}`}>
                                            ${(producto.cantidad * producto.precio).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t pt-3 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Total:</span>
                                <span className="font-bold text-lg">${calculateTotal(selectedTicket.productos).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Botón de imprimir */}
                        <button
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer transition-colors flex items-center justify-center gap-2"
                            onClick={handlePrintTicket}
                        >
                            <FiPrinter />
                            Imprimir Ticket
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de envío por email */}
            {isEmailModalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-[999]"
                    onClick={() => setIsEmailModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative shadow-2xl border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de cerrar (X) */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setIsEmailModalOpen(false)}
                        >
                            <IoClose />
                        </button>

                        {/* Título */}
                        <h2 className="text-xl font-bold mb-4">Enviar Ticket por Email</h2>

                        {/* Campo de email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ingresa el email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer transition-colors"
                                onClick={handleSendEmail}
                                disabled={!email}
                            >
                                Enviar
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded cursor-pointer transition-colors"
                                onClick={() => setIsEmailModalOpen(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}