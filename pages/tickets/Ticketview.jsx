import { LuCalendarDays } from "react-icons/lu";
import { BsClock } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from 'qrcode.react';
import getOrderTickets from "../../useCases/getOrderTickets";

export default function Ticketview() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                            total: 0,
                            // Datos adicionales para el formato de ticket
                            date_time: order.date_time,
                            order_uuid: order.order_uuid,
                            restaurant_name: order.restaurant_name,
                            order_status: order.order_status,
                            metodo_pago: order.metodo_pago
                        };
                    }
                    
                    // Agregar productos de esta orden
                    const mappedProducts = order.products.map(product => ({
                        nombre: product.product_name,
                        cantidad: product.quantity,
                        precio: parseFloat(product.unit_price),
                        subtotal: parseFloat(product.subtotal),
                        status: product.order_detail_status.toLowerCase() === "pendiente" ? null : product.order_detail_status.toLowerCase(),
                        // Formato para ticket
                        quantity: product.quantity,
                        product_name: product.product_name,
                        unit_price: product.unit_price
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

    const handleCardClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
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

    return (
        <div className="pt-20 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {ticketsData
                    .filter(ticket => ticket.statusOrden === 'Finalizado')
                    .map((ticket) => (
                    <div 
                        key={ticket.id}
                        className="w-full border-l-green-600 border-l-4 bg-white shadow-md rounded-lg flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleCardClick(ticket)}
                    >
                        {/* Header de la card */}
                        <div className="p-3">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-lg">{ticket.mesa}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    ticket.statusOrden === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                    ticket.statusOrden === 'Finalizado' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {ticket.statusOrden}
                                </span>
                            </div>
                            
                            <div className="flex justify-between text-xs text-gray-500 mb-3">
                                <div className="flex items-center">
                                    <LuCalendarDays className="mr-1" />
                                    <span>{ticket.fecha}</span>
                                </div>
                                <div className="flex items-center">
                                    <BsClock className="mr-1" />
                                    <span>{ticket.hora}</span>
                                </div>
                            </div>

                            {/* Mostrar solo el primer producto */}
                            {ticket.productos.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-2 mb-3">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-medium truncate flex-1 mr-2 ${
                                            ticket.productos[0].status === "cancelado" ? "text-red-500 line-through" : ""
                                        }`}>
                                            {ticket.productos[0].nombre}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs">
                                            <span className="bg-white px-2 py-1 rounded border">
                                                x{ticket.productos[0].cantidad}
                                            </span>
                                            <span className="bg-white px-2 py-1 rounded border">
                                                ${ticket.productos[0].precio.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Leyenda para más productos */}
                            {ticket.productos.length > 1 && (
                                <p className="text-xs text-gray-500 italic text-center mb-2">
                                    +{ticket.productos.length - 1} producto(s) más. Da click para ver detalles.
                                </p>
                            )}

                            {/* Total */}
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="font-bold text-sm">Total:</span>
                                <span className="font-bold text-sm text-green-600">
                                    ${calculateTotal(ticket.productos).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal principal del ticket - Formato idéntico a TicketModal */}
            {isModalOpen && selectedTicket && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[10000]"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de cerrar (X) */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <IoClose />
                        </button>

                        {/* Título */}
                        <h2 className="text-xl font-bold mb-6 text-center pr-8">
                            Ticket generado para imprimir
                        </h2>

                        {/* Contenido del ticket - Formato idéntico a TicketModal */}
                        <div className="border-2 border-dashed border-gray-300 p-4 mb-6">
                            {/* Información del restaurante */}
                            <div className="text-center mb-4 border-b pb-4">
                                <h3 className="font-bold text-lg">{selectedTicket.restaurant_name || selectedTicket.restaurante}</h3>
                                <p className="text-gray-600 text-sm">Restaurant Digital</p>
                            </div>

                            {/* Información de la orden */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>ID:</span>
                                    <span className="font-mono text-xs">{selectedTicket.order_uuid?.slice(0, 8)}...</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Fecha:</span>
                                    <span>{selectedTicket.fecha}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Hora:</span>
                                    <span>{selectedTicket.hora}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Estado:</span>
                                    <span className="font-semibold text-green-600">{selectedTicket.order_status || selectedTicket.statusOrden}</span>
                                </div>
                            </div>

                            {/* Productos */}
                            <div className="mb-4">
                                <h4 className="font-bold mb-2 border-b pb-1">Productos:</h4>
                                {selectedTicket.productos?.map((product, index) => (
                                    <div key={index} className="mb-2">
                                        <div className="flex justify-between text-sm">
                                            <span className={`flex-1 ${product.status === "cancelado" ? "text-red-500 line-through" : ""}`}>
                                                {product.quantity || product.cantidad}x {product.product_name || product.nombre}
                                            </span>
                                            <span className={`font-semibold ${product.status === "cancelado" ? "text-red-500 line-through" : ""}`}>
                                                ${(parseFloat(product.subtotal) || (product.cantidad * product.precio)).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 ml-4">
                                            <span>Precio unitario: ${(parseFloat(product.unit_price) || product.precio).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="border-t pt-2 mb-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>${calculateTotal(selectedTicket.productos).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Método de pago:</span>
                                    <span className="capitalize font-semibold">{selectedTicket.metodo_pago || selectedTicket.metodoPago}</span>
                                </div>
                            </div>

                            {/* Código QR */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Código QR del ticket:</p>
                                <div className="flex justify-center">
                                    <QRCodeCanvas
                                        value={selectedTicket.order_uuid || selectedTicket.id}
                                        size={150}
                                        level="M"
                                        includeMargin={true}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Escanea con la app móvil para imprimir
                                </p>
                            </div>

                            {/* Pie del ticket */}
                            <div className="text-center mt-4 pt-2 border-t text-xs text-gray-500">
                                <p>¡Gracias por su visita!</p>
                                <p>Conserve este ticket como comprobante</p>
                            </div>
                        </div>

                        {/* Botón de cerrar */}
                        <div className="flex justify-center">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded cursor-pointer transition-colors"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}