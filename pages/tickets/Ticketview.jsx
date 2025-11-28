import { LuCalendarDays } from "react-icons/lu";
import { BsClock } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { HiDocumentDownload } from "react-icons/hi";
import { FaFilePdf } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { QRCodeCanvas } from 'qrcode.react';
import getOrdersDia from "../../useCases/getOrdersDia";
import { getOrdersSemana } from "../../useCases/getOrdersSemana";
import getOrdersMes from "../../useCases/getOrdersMes";
import { getOrdersFecha } from "../../useCases/getOrdesFecha";
import { checkPayment } from "../../useCases/checkPayment";
// Importaciones para el selector de fecha
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TicketModal from "../../components/TicketModal";
// Importar generadores de PDF
import { generateTicketPDF, generateTicketsReportPDF } from "../../utils/pdfGenerator";

export default function Ticketview() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketsData, setTicketsData] = useState([]);
    const [activeTab, setActiveTab] = useState("hoy");
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    // Estado para el contador
    const [countdown, setCountdown] = useState(10);
    // Estados para el modal de selección de fecha
    const [showDatePickerModal, setShowDatePickerModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    // Estados para el filtro de fechas desplegables
    const [expandedDates, setExpandedDates] = useState(new Set());
    // Estado para el switch de filtro de órdenes (true = exitosas, false = canceladas)
    const [showSuccessfulOrders, setShowSuccessfulOrders] = useState(true);

    // Función para formatear fecha a YYYY-MM-DD
    const formatDateToAPI = (date) => {
        if (!date) return null;
        return date.toISOString().split('T')[0];
    };

    // Función para calcular el total de tickets por fecha
    const calculateDayTotal = (tickets) => {
        return tickets.reduce((total, ticket) => total + (ticket.total || 0), 0);
    };

    // Función para agrupar tickets por fecha
    const groupTicketsByDate = (tickets) => {
        const groups = {};
        tickets.forEach(ticket => {
            const date = ticket.fecha;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(ticket);
        });
        
        // Ordenar las fechas de más reciente a más antigua
        const sortedDates = Object.keys(groups).sort((a, b) => {
            const dateA = new Date(a.split('/').reverse().join('-'));
            const dateB = new Date(b.split('/').reverse().join('-'));
            return dateB - dateA;
        });
        
        // Crear objeto ordenado
        const sortedGroups = {};
        sortedDates.forEach(date => {
            // Ordenar tickets dentro de cada fecha por hora (más recientes primero)
            sortedGroups[date] = groups[date].sort((a, b) => {
                const timeA = new Date(`${a.fecha} ${a.hora}`);
                const timeB = new Date(`${b.fecha} ${b.hora}`);
                return timeB - timeA;
            });
        });
        
        return sortedGroups;
    };

    // Función para alternar la visibilidad de una fecha
    const toggleDateExpansion = (date) => {
        const newExpanded = new Set(expandedDates);
        if (newExpanded.has(date)) {
            newExpanded.delete(date);
        } else {
            newExpanded.add(date);
        }
        setExpandedDates(newExpanded);
    };

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                // Verificar suscripción primero
                const subscriptionData = await checkPayment();
                if (!subscriptionData.has_active_subscription) {
                    setShowSubscriptionModal(true);
                    return;
                }

                if (activeTab === "hoy") {
                    const response = await getOrdersDia();
                    
                    if (!response.success) {
                        console.error("Error fetching orders:", response.error);
                        setShowSubscriptionModal(true);
                        return;
                    }

                    const apiData = response.data;
                    
                    // Mapear los datos de la API al formato esperado por el componente
                    const mappedTickets = apiData.map(order => ({
                        id: order.order_uuid,
                        mesa: `Mesa ${order.mesa_number}`,
                        fecha: new Date(order.date_time).toLocaleDateString(),
                        hora: new Date(order.date_time).toLocaleTimeString(),
                        restaurante: order.restaurant_name,
                        estado: order.state,
                        statusOrden: order.order_status,
                        metodoPago: order.metodo_pago,
                        productos: order.products.map(product => ({
                            nombre: product.product_name,
                            cantidad: product.quantity,
                            precio: parseFloat(product.unit_price),
                            subtotal: parseFloat(product.subtotal),
                            status: product.order_detail_status.toLowerCase() === "pendiente" ? null : product.order_detail_status.toLowerCase(),
                            // Formato para ticket
                            quantity: product.quantity,
                            product_name: product.product_name,
                            unit_price: product.unit_price
                        })),
                        total: parseFloat(order.total),
                        // Datos adicionales para el formato de ticket
                        date_time: order.date_time,
                        order_uuid: order.order_uuid,
                        restaurant_name: order.restaurant_name,
                        order_status: order.order_status,
                        metodo_pago: order.metodo_pago,
                        ticket_number: order.ticket_number
                    }));
                    
                    // Ordenar por fecha descendente (más recientes primero)
                    const sortedTickets = mappedTickets.sort((a, b) => 
                        new Date(b.date_time) - new Date(a.date_time)
                    );
                    
                    setTicketsData(sortedTickets);
                } else if (activeTab === "semana") {
                    const response = await getOrdersSemana();
                    
                    if (!response.success) {
                        console.error("Error fetching orders:", response.error);
                        setShowSubscriptionModal(true);
                        return;
                    }

                    const apiData = response.data;
                    
                    // Mapear los datos de la API al formato esperado por el componente
                    const mappedTickets = apiData.map(order => ({
                        id: order.order_uuid,
                        mesa: `Mesa ${order.mesa_number}`,
                        fecha: new Date(order.date_time).toLocaleDateString(),
                        hora: new Date(order.date_time).toLocaleTimeString(),
                        restaurante: order.restaurant_name,
                        estado: order.state,
                        statusOrden: order.order_status,
                        metodoPago: order.metodo_pago,
                        productos: order.products.map(product => ({
                            nombre: product.product_name,
                            cantidad: product.quantity,
                            precio: parseFloat(product.unit_price),
                            subtotal: parseFloat(product.subtotal),
                            status: product.order_detail_status.toLowerCase() === "pendiente" ? null : product.order_detail_status.toLowerCase(),
                            // Formato para ticket
                            quantity: product.quantity,
                            product_name: product.product_name,
                            unit_price: product.unit_price
                        })),
                        total: parseFloat(order.total),
                        // Datos adicionales para el formato de ticket
                        date_time: order.date_time,
                        order_uuid: order.order_uuid,
                        restaurant_name: order.restaurant_name,
                        order_status: order.order_status,
                        metodo_pago: order.metodo_pago,
                        ticket_number: order.ticket_number
                    }));
                    
                    // Ordenar por fecha descendente (más recientes primero)
                    const sortedTickets = mappedTickets.sort((a, b) => 
                        new Date(b.date_time) - new Date(a.date_time)
                    );
                    
                    setTicketsData(sortedTickets);
                } else if (activeTab === "mes") {
                    const response = await getOrdersMes();
                    
                    if (!response.success) {
                        console.error("Error fetching orders:", response.error);
                        setShowSubscriptionModal(true);
                        return;
                    }

                    const apiData = response.data;
                    
                    // Mapear los datos de la API al formato esperado por el componente
                    const mappedTickets = apiData.map(order => ({
                        id: order.order_uuid,
                        mesa: `Mesa ${order.mesa_number}`,
                        fecha: new Date(order.date_time).toLocaleDateString(),
                        hora: new Date(order.date_time).toLocaleTimeString(),
                        restaurante: order.restaurant_name,
                        estado: order.state,
                        statusOrden: order.order_status,
                        metodoPago: order.metodo_pago,
                        productos: order.products.map(product => ({
                            nombre: product.product_name,
                            cantidad: product.quantity,
                            precio: parseFloat(product.unit_price),
                            subtotal: parseFloat(order.subtotal),
                            status: product.order_detail_status.toLowerCase() === "pendiente" ? null : product.order_detail_status.toLowerCase(),
                            // Formato para ticket
                            quantity: product.quantity,
                            product_name: product.product_name,
                            unit_price: product.unit_price
                        })),
                        total: parseFloat(order.total),
                        // Datos adicionales para el formato de ticket
                        date_time: order.date_time,
                        order_uuid: order.order_uuid,
                        restaurant_name: order.restaurant_name,
                        order_status: order.order_status,
                        metodo_pago: order.metodo_pago,
                        ticket_number: order.ticket_number
                    }));
                    
                    // Ordenar por fecha descendente (más recientes primero)
                    const sortedTickets = mappedTickets.sort((a, b) => 
                        new Date(b.date_time) - new Date(a.date_time)
                    );
                    
                    setTicketsData(sortedTickets);
                } else if (activeTab === "Seleccionar Fecha") {
                    // Si hay fechas seleccionadas, hacer la petición a la API
                    if (startDate && endDate) {
                        const fechaInicio = formatDateToAPI(startDate);
                        const fechaFin = formatDateToAPI(endDate);
                        
                        const response = await getOrdersFecha(fechaInicio, fechaFin);
                        
                        // Verificar si la respuesta es válida (array vacío es válido para clientes nuevos)
                        if (!Array.isArray(response)) {
                            console.error("Error fetching orders:", "Invalid response format");
                            setShowSubscriptionModal(true);
                            return;
                        }

                        // Mapear los datos de la API al formato esperado por el componente
                        const mappedTickets = response.map(order => ({
                            id: order.order_uuid,
                            mesa: `Mesa ${order.mesa_number}`,
                            fecha: new Date(order.date_time).toLocaleDateString(),
                            hora: new Date(order.date_time).toLocaleTimeString(),
                            restaurante: order.restaurant_name,
                            estado: order.state,
                            statusOrden: order.order_status,
                            metodoPago: order.metodo_pago,
                            productos: order.products.map(product => ({
                                nombre: product.product_name,
                                cantidad: product.quantity,
                                precio: parseFloat(product.unit_price),
                                subtotal: parseFloat(product.subtotal),
                                status: product.order_detail_status.toLowerCase() === "pendiente" ? null : product.order_detail_status.toLowerCase(),
                                // Formato para ticket
                                quantity: product.quantity,
                                product_name: product.product_name,
                                unit_price: product.unit_price
                            })),
                            total: parseFloat(order.total),
                            // Datos adicionales para el formato de ticket
                            date_time: order.date_time,
                            order_uuid: order.order_uuid,
                            restaurant_name: order.restaurant_name,
                            order_status: order.order_status,
                            metodo_pago: order.metodo_pago,
                            ticket_number: order.ticket_number
                        }));
                        
                        // Ordenar por fecha descendente (más recientes primero)
                        const sortedTickets = mappedTickets.sort((a, b) => 
                            new Date(b.date_time) - new Date(a.date_time)
                        );
                        
                        setTicketsData(sortedTickets);
                    } else {
                        // Si no hay fechas seleccionadas, limpiar los datos
                        setTicketsData([]);
                    }
                } else {
                    // Para otras pestañas, limpiar los datos por ahora
                    setTicketsData([]);
                }
            } catch (error) {
                console.error("Error fetching tickets:", error);
                setShowSubscriptionModal(true);
            }
        };

        fetchTickets();
    }, [activeTab, startDate, endDate]);

    // Limpiar fechas expandidas cuando cambie la pestaña
    useEffect(() => {
        setExpandedDates(new Set());
    }, [activeTab]);

    const handleCardClick = (ticket) => {
        console.log('Ticket seleccionado:', ticket); // Debug
        console.log('Order UUID:', ticket.order_uuid); // Debug
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    // Efecto para el contador de la modal de suscripción
    useEffect(() => {
        let interval = null;
        
        if (showSubscriptionModal && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (showSubscriptionModal && countdown === 0) {
            // Cuando llegue a 0, redirigir automáticamente
            handleGoToPayments();
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [showSubscriptionModal, countdown]);

    // Función para resetear el contador cuando se abre la modal
    useEffect(() => {
        if (showSubscriptionModal) {
            setCountdown(10);
        }
    }, [showSubscriptionModal]);

    const handleGoToPayments = () => {
        setShowSubscriptionModal(false);
        setCountdown(10); // Resetear contador
        router.push('/payments');
    };

    // Función para obtener el total del ticket desde la API
    const getTicketTotal = (ticket) => {
        return ticket.total || 0;
    };

    // Función para aplicar el filtro de fechas
    const handleApplyDateFilter = async () => {
        setShowDatePickerModal(false);
        
        // No necesitamos hacer nada aquí porque el useEffect ya se ejecutará
        // cuando cambien startDate y endDate
    };

    // Función para filtrar tickets por fecha
    const filterTicketsByDate = (tickets, filter) => {
        switch (filter) {
            case "hoy":
            case "semana":
            case "mes":
                // Los datos ya vienen filtrados de la API - solo mostrar finalizados
                return tickets.filter(ticket => ticket.statusOrden === 'Finalizado');
            case "Seleccionar Fecha":
                // Filtrar según el estado del switch
                if (showSuccessfulOrders) {
                    // Mostrar órdenes exitosas (PuntoDeVenta y Finalizado)
                    return tickets.filter(ticket => 
                        ticket.statusOrden === 'Finalizado' || ticket.statusOrden === 'PuntoDeVenta'
                    );
                } else {
                    // Mostrar órdenes canceladas
                    return tickets.filter(ticket => ticket.statusOrden === 'Cancelado');
                }
            default:
                return tickets;
        }
    };

    // Función para manejar el click en la pestaña "Seleccionar Fecha"
    const handleDateTabClick = () => {
        setActiveTab("Seleccionar Fecha");
        setShowDatePickerModal(true);
        // Limpiar las fechas anteriores
        setStartDate(null);
        setEndDate(null);
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
    const filteredTickets = filterTicketsByDate(ticketsData, activeTab);

    // Verificar si la pestaña actual necesita agrupación por fecha
    const shouldGroupByDate = ["semana", "mes", "Seleccionar Fecha"].includes(activeTab);
    
    // Agrupar tickets por fecha si es necesario
    const groupedTickets = shouldGroupByDate ? groupTicketsByDate(filteredTickets) : null;

    return (
        <div className="w-full mt-16">
            {/* Modal de suscripción */}
            {showSubscriptionModal && (
                <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl">
                        {/* Contador circular en la parte superior */}
                        <div className="flex justify-center mb-4">
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                                    {/* Círculo de fondo */}
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        fill="none"
                                        stroke="#e5e7eb"
                                        strokeWidth="4"
                                    />
                                    {/* Círculo de progreso */}
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        fill="none"
                                        stroke="#059669"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(countdown / 10) * 175.93} 175.93`}
                                        className="transition-all duration-1000 ease-linear"
                                    />
                                </svg>
                                {/* Número del contador */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-green-600">
                                        {countdown}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mb-4 text-green-600 text-center">
                            Suscripción Requerida
                        </h2>
                        
                        <p className="text-gray-700 mb-4 text-center">
                            Tu suscripción ha expirado o no tienes permisos para acceder a esta funcionalidad. 
                            Por favor, renueva tu suscripción para continuar.
                        </p>

                        {/* Mensaje del contador */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                            <p className="text-green-700 text-sm text-center">
                                <span className="font-semibold">Redirección automática en {countdown} segundo{countdown !== 1 ? 's' : ''}</span>
                                <br />
                                Serás redirigido a la página de pagos automáticamente
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleGoToPayments}
                                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                            >
                                Ir a Pagos Ahora
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
                {/* Barra de acciones con título dinámico y botón de reporte */}
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
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
                    
                    {/* Botón para descargar reporte PDF */}
                    {filteredTickets.length > 0 && (
                        <button
                            onClick={() => {
                                const periodName = activeTab === "hoy" ? "Hoy" :
                                                 activeTab === "semana" ? "Semana" :
                                                 activeTab === "mes" ? "Mes" :
                                                 `${formatDate(startDate)} al ${formatDate(endDate)}`;
                                // Determinar si debe agrupar por fecha
                                const shouldGroup = activeTab === "semana" || activeTab === "mes" || activeTab === "Seleccionar Fecha";
                                generateTicketsReportPDF(filteredTickets, periodName, shouldGroup);
                            }}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 font-semibold text-sm"
                        >
                            <HiDocumentDownload className="text-xl" />
                            Descargar Reporte PDF
                        </button>
                    )}
                </div>

                {/* Contenido condicional según el tipo de vista */}
                {shouldGroupByDate ? (
                    /* Vista agrupada por fecha */
                    <div className="space-y-4">
                        {activeTab === "Seleccionar Fecha" && (!startDate || !endDate) ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-center">
                                    Selecciona un rango de fechas para ver los tickets
                                </p>
                            </div>
                        ) : Object.keys(groupedTickets).length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-center">
                                    No hay tickets disponibles para {
                                        activeTab === "semana" ? "esta semana" : 
                                        activeTab === "mes" ? "este mes" :
                                        "el rango seleccionado"
                                    }
                                </p>
                            </div>
                        ) : (
                            Object.entries(groupedTickets).map(([date, tickets]) => (
                                <div key={date} className="border rounded-lg overflow-hidden">
                                    {/* Botón de fecha */}
                                    <button
                                        onClick={() => toggleDateExpansion(date)}
                                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LuCalendarDays className="text-green-600" />
                                            <span className="font-semibold text-gray-800">{date}</span>
                                            <span className="text-sm text-gray-500">
                                                ({tickets.length} ticket{tickets.length !== 1 ? 's' : ''})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-green-600">
                                                Total: ${calculateDayTotal(tickets).toFixed(2)}
                                            </span>
                                            {expandedDates.has(date) ? (
                                                <IoChevronUp className="text-gray-500" />
                                            ) : (
                                                <IoChevronDown className="text-gray-500" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Contenido desplegable */}
                                    {expandedDates.has(date) && (
                                        <div className="p-4 bg-white">
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                                {tickets.map((ticket) => (
                                                    <div 
                                                        key={ticket.id}
                                                        className="cursor-pointer transition-opacity hover:opacity-80"
                                                        onClick={() => handleCardClick(ticket)}
                                                    >
                                                        <div className="border-l-green-600 border-l-5 bg-white shadow-md rounded-lg h-48 flex flex-col relative">
                                                            {/* Número de ticket en la esquina superior derecha */}
                                                            <div className="absolute top-2 right-4 sm:right-8 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded z-20">
                                                                #{ticket.ticket_number || 'N/A'}
                                                            </div>
                                                            
                                                            <div className="p-3 pr-10 flex-grow flex flex-col overflow-hidden">
                                                                {/* Header fijo */}
                                                                <div className="flex items-center mb-2 flex-shrink-0">
                                                                    <p className="font-bold text-base truncate">{ticket.mesa}</p>
                                                                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded flex-shrink-0 ${
                                                                        ticket.statusOrden === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                                        ticket.statusOrden === 'Finalizado' ? 'bg-green-100 text-green-800' :
                                                                        ticket.statusOrden === 'Cancelado' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {ticket.statusOrden}
                                                                    </span>
                                                                </div>
                                                                
                                                                {/* Hora - fija (fecha ya está en el header) */}
                                                                <div className="flex justify-center text-xs text-gray-500 mb-2 flex-shrink-0">
                                                                    <div className="flex items-center">
                                                                        <BsClock className="mr-1" />
                                                                        <span>{ticket.hora}</span>
                                                                    </div>
                                                                </div>

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
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    /* Vista normal (para "hoy") */
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filteredTickets.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-center">
                                    No hay tickets disponibles para hoy
                                </p>
                            </div>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <div 
                                    key={ticket.id}
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                    onClick={() => handleCardClick(ticket)}
                                >
                                    <div className="border-l-green-600 border-l-5 bg-white shadow-md rounded-lg h-48 flex flex-col relative">
                                        {/* Número de ticket en la esquina superior derecha */}
                                        <div className="absolute top-2 right-4 sm:right-8 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded z-20">
                                            #{ticket.ticket_number || 'N/A'}
                                        </div>
                                        
                                        <div className="p-3 pr-10 flex-grow flex flex-col overflow-hidden">
                                            {/* Header fijo */}
                                            <div className="flex items-center mb-2 flex-shrink-0">
                                                <p className="font-bold text-base truncate">{ticket.mesa}</p>
                                                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded flex-shrink-0 ${
                                                    ticket.statusOrden === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                    ticket.statusOrden === 'Finalizado' ? 'bg-green-100 text-green-800' :
                                                    ticket.statusOrden === 'Cancelado' ? 'bg-red-100 text-red-800' :
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
                )}
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

                        {/* Switch para filtrar por estado de órdenes */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                                        Filtro de Estado de Órdenes
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        {showSuccessfulOrders 
                                            ? "Mostrando órdenes exitosas (Finalizadas y PuntoDeVenta)"
                                            : "Mostrando órdenes canceladas"
                                        }
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-medium transition-colors ${
                                        !showSuccessfulOrders ? 'text-red-600' : 'text-gray-400'
                                    }`}>
                                        Canceladas
                                    </span>
                                    <button
                                        onClick={() => setShowSuccessfulOrders(!showSuccessfulOrders)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                                            showSuccessfulOrders ? 'bg-green-600' : 'bg-red-500'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                showSuccessfulOrders ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                    <span className={`text-sm font-medium transition-colors ${
                                        showSuccessfulOrders ? 'text-green-600' : 'text-gray-400'
                                    }`}>
                                        Exitosas
                                    </span>
                                </div>
                            </div>
                        </div>

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
                                    Hasta: {formatDate(endDate)}<br />
                                    <strong>Estado:</strong> {showSuccessfulOrders ? 'Órdenes Exitosas' : 'Órdenes Canceladas'}
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
                                    setShowSuccessfulOrders(true); // Resetear el switch
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
                <TicketModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedTicket(null);
                    }}
                    orderUuid={selectedTicket.order_uuid}
                />
            )}
        </div>
    );
}

