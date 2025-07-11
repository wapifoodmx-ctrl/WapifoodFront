import { LuCalendarDays } from "react-icons/lu";
import { BsClock } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { QRCodeCanvas } from 'qrcode.react';
import getOrderTickets from "../../useCases/getOrderTickets";
import { checkPayment } from "../../useCases/checkPayment";
// Importaciones para el selector de fecha
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Ticketview() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketsData, setTicketsData] = useState([]);
    const [activeTab, setActiveTab] = useState("hoy");
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    // Estados para el modal de selección de fecha
    const [showDatePickerModal, setShowDatePickerModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                // Verificar suscripción primero
                const subscriptionData = await checkPayment();
                if (!subscriptionData.has_active_subscription) {
                    setShowSubscriptionModal(true);
                    return;
                }

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
                            total: parseFloat(order.total), // Usar el total de la API
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
                    
                    return acc;
                }, {});
                
                // Convertir el objeto agrupado a array
                const mappedTickets = Object.values(groupedOrders);
                
                setTicketsData(mappedTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                // Si hay error, también mostrar modal de suscripción
                setShowSubscriptionModal(true);
            }
        };

        fetchTickets();
    }, []);

    const handleCardClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleGoToPayments = () => {
        setShowSubscriptionModal(false);
        router.push('/payments');
    };

    // Función para obtener el total del ticket desde la API
    const getTicketTotal = (ticket) => {
        return ticket.total || 0;
    };

    // Función para filtrar tickets por fecha
    const filterTicketsByDate = (tickets, filter) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        return tickets.filter(ticket => {
            const ticketDate = new Date(ticket.date_time);
            const ticketDateOnly = new Date(ticketDate.getFullYear(), ticketDate.getMonth(), ticketDate.getDate());
            
            switch (filter) {
                case "hoy":
                    return ticketDateOnly.getTime() === today.getTime();
                case "semana":
                    return ticketDateOnly.getTime() < today.getTime() && ticketDateOnly.getTime() >= oneWeekAgo.getTime();
                case "mes":
                    return ticketDateOnly.getTime() < oneWeekAgo.getTime();
                case "Seleccionar Fecha":
                    // Si hay fechas seleccionadas, filtrar por ese rango
                    if (startDate && endDate) {
                        const start = new Date(startDate);
                        const end = new Date(endDate);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(23, 59, 59, 999);
                        const ticketDateTime = new Date(ticket.date_time);
                        return ticketDateTime >= start && ticketDateTime <= end;
                    }
                    return []; // No mostrar nada si no hay fechas seleccionadas
                default:
                    return true;
            }
        });
    };

    // Función para manejar el click en la pestaña "Seleccionar Fecha"
    const handleDateTabClick = () => {
        setActiveTab("Seleccionar Fecha");
        setShowDatePickerModal(true);
    };

    // Función para aplicar el filtro de fechas
    const handleApplyDateFilter = () => {
        setShowDatePickerModal(false);
        // Los tickets se filtrarán automáticamente
    };

    // Función para formatear fecha
    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Obtener tickets filtrados
    const filteredTickets = filterTicketsByDate(
        ticketsData.filter(ticket => ticket.statusOrden === 'Finalizado'),
        activeTab
    );

    return (
        <div className="w-full mt-16">
            {/* Modal de suscripción */}
            {showSubscriptionModal && (
                <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4 text-red-600">Suscripción Requerida</h2>
                        <p className="text-gray-700 mb-6">
                            Tu suscripción ha expirado o no tienes permisos para acceder a esta funcionalidad. 
                            Por favor, renueva tu suscripción para continuar.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleGoToPayments}
                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Ir a Pagos
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pestañas - Mismo estilo que VistaCocina */}
            <div className="w-full flex shadow-md p-4 overflow-x-auto whitespace-nowrap border-b">
                <button
                    className={`px-4 py-2 cursor-pointer ${
                        activeTab === "hoy" ? "border-b-2 border-green-600 font-bold" : ""
                    }`}
                    onClick={() => setActiveTab("hoy")}
                >
                    Hoy
                </button>
                <button
                    className={`px-4 py-2 cursor-pointer ${
                        activeTab === "semana" ? "border-b-2 border-green-600 font-bold" : ""
                    }`}
                    onClick={() => setActiveTab("semana")}
                >
                    Semana
                </button>
                <button
                    className={`px-4 py-2 cursor-pointer ${
                        activeTab === "mes" ? "border-b-2 border-green-600 font-bold" : ""
                    }`}
                    onClick={() => setActiveTab("mes")}
                >
                    Mes
                </button>
                <button
                    className={`px-4 py-2 cursor-pointer ${
                        activeTab === "Seleccionar Fecha" ? "border-b-2 border-green-600 font-bold" : ""
                    }`}
                    onClick={handleDateTabClick}
                >
                    Seleccionar Fecha
                </button>
            </div>

            {/* Contenido principal */}
            <div className="py-5 px-5">
                {/* Título dinámico */}
                <div className="mb-4">
                    <h2 className="text-lg font-bold">
                        {activeTab === "hoy" && "Tickets de Hoy"}
                        {activeTab === "semana" && "Tickets de esta Semana"}
                        {activeTab === "mes" && "Tickets del Mes"}
                        {activeTab === "Seleccionar Fecha" && "Tickets por Rango de Fecha"}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} encontrado{filteredTickets.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Grid de tickets */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {activeTab === "Seleccionar Fecha" && (!startDate || !endDate) ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-center">
                                Selecciona un rango de fechas para ver los tickets
                            </p>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-center">
                                No hay tickets disponibles para {
                                    activeTab === "hoy" ? "hoy" : 
                                    activeTab === "semana" ? "esta semana" : 
                                    activeTab === "mes" ? "este mes" :
                                    "el rango seleccionado"
                                }
                            </p>
                        </div>
                    ) : (
                        filteredTickets.map((ticket) => (
                            <div 
                                key={ticket.id}
                                className="cursor-pointer transition-opacity hover:opacity-80"
                                onClick={() => handleCardClick(ticket)}
                            >
                                <div className="border-l-green-600 border-l-5 bg-white shadow-md rounded-lg h-48 flex flex-col">
                                    <div className="p-3 flex-grow flex flex-col overflow-hidden">
                                        {/* Header fijo */}
                                        <div className="flex items-center mb-2 flex-shrink-0">
                                            <p className="font-bold text-base truncate">{ticket.mesa}</p>
                                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded flex-shrink-0 ${
                                                ticket.statusOrden === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                ticket.statusOrden === 'Finalizado' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {ticket.statusOrden}
                                            </span>
                                        </div>
                                        
                                        {/* Fecha y hora - fija */}
                                        <div className="flex justify-between text-xs text-gray-500 mb-2 flex-shrink-0">
                                            <div className="flex items-center">
                                                <LuCalendarDays className="mr-1" />
                                                <span>{ticket.fecha}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <BsClock className="mr-1" />
                                                <span>{ticket.hora}</span>
                                            </div>
                                        </div>

                                        {/* Área flexible para productos */}
                                        <div className="flex-grow flex flex-col min-h-0">
                                            <p className="text-xs text-gray-500 font-semibold mb-1 flex-shrink-0">
                                                Productos ({ticket.productos.length})
                                            </p>
                                            
                                            {ticket.productos.length > 0 && (
                                                <div className="bg-gray-50 rounded p-2 mb-1 flex-shrink-0">
                                                    <div className="flex justify-between items-center">
                                                        <p className={`font-semibold text-xs truncate pr-1 ${
                                                            ticket.productos[0].status === "cancelado" ? "text-red-500 line-through" : ""
                                                        }`}>
                                                            {ticket.productos[0].nombre}
                                                        </p>
                                                        <div className="flex items-center gap-1 flex-shrink-0">
                                                            <span className="bg-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                                X{ticket.productos[0].cantidad}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Información adicional - flexible */}
                                            <div className="flex-grow flex items-center justify-center">
                                                {ticket.productos.length > 1 && (
                                                    <div className="flex items-center justify-center text-xs text-blue-600 font-semibold">
                                                        <IoMdInformationCircleOutline className="mr-1" />
                                                        <span className="text-center">Click para ver más</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Total fijo en la parte inferior */}
                                        <div className="flex justify-between items-center pt-2 border-t flex-shrink-0">
                                            <span className="font-bold text-sm">Total:</span>
                                            <span className="font-bold text-sm text-green-600">
                                                ${getTicketTotal(ticket).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal para selector de fechas */}
            {showDatePickerModal && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[10000]"
                    onClick={() => setShowDatePickerModal(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de cerrar */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setShowDatePickerModal(false)}
                        >
                            <IoClose />
                        </button>

                        {/* Título */}
                        <h2 className="text-xl font-bold mb-6 text-center">
                            Seleccionar Rango de Fechas
                        </h2>

                        {/* Selector de fechas */}
                        <div className="mb-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de inicio
                                </label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    placeholderText="Selecciona fecha de inicio"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de fin
                                </label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    placeholderText="Selecciona fecha de fin"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                        </div>

                        {/* Información del rango seleccionado */}
                        {startDate && endDate && (
                            <div className="mb-4 p-3 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-700">
                                    <strong>Rango seleccionado:</strong><br />
                                    Desde: {formatDate(startDate)}<br />
                                    Hasta: {formatDate(endDate)}
                                </p>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowDatePickerModal(false);
                                    setActiveTab("hoy"); // Cambiar a otra pestaña al cancelar
                                    setStartDate(null);
                                    setEndDate(null);
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleApplyDateFilter}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                disabled={!startDate || !endDate}
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal principal del ticket */}
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

                        {/* Contenido del ticket */}
                        <div className="border-2 border-dashed border-gray-300 p-4 mb-6">
                            {/* Información del restaurante */}
                            <div className="text-center mb-4 border-b pb-4">
                                <h3 className="font-bold text-lg">{selectedTicket.restaurant_name || selectedTicket.restaurante}</h3>
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
                                    <span>${getTicketTotal(selectedTicket).toFixed(2)}</span>
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