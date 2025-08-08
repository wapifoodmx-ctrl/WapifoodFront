import { FaCreditCard } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import Navbar from "@/dashboardComponents/navbar";
import { IoTrashOutline } from "react-icons/io5";
import { BsTag } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FaShoppingCart } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getProducts } from "@/useCases/getProducts";
import { createSimpleOrder } from "@/useCases/OrderPntoVenta";
import TicketModal from "@/components/TicketModal";
import { endOrderPuntoDeVenta } from "@/useCases/endOrderPuntoDeVenta";
import { checkPayment } from "@/useCases/checkPayment";

export default function Pntoventa() {
    const router = useRouter();
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Categorías");
    const [disponibilidadSeleccionada, setDisponibilidadSeleccionada] = useState("Disponibles");
    const [busqueda, setBusqueda] = useState("");
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [carritoModalOpen, setCarritoModalOpen] = useState(false);
    const [mensajeError, setMensajeError] = useState("");
    const [modalTotalOpen, setModalTotalOpen] = useState(false);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalProductoOpen, setModalProductoOpen] = useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    
    // Estados para el TicketModal
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [completedOrderUuid, setCompletedOrderUuid] = useState(null);

    // Estado para pedidos pendientes (no enviados a cocina)
    const [pedidosPendientes, setPedidosPendientes] = useState([]);
    const [showCancelledOrderModal, setShowCancelledOrderModal] = useState(false);

    // Mock para establecer permisos de ticket automáticamente
    useEffect(() => {
        // Establecer permisos de ticket para testing
        localStorage.setItem('tickets', 'true');
        console.log('Permisos de ticket establecidos automáticamente');
    }, []);

    // Recuperar datos del localStorage al cargar la página
    useEffect(() => {
        const carritoGuardado = localStorage.getItem("carrito");
        const pedidosPendientesGuardados = localStorage.getItem("pedidosPendientes");

        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }
        if (pedidosPendientesGuardados) {
            setPedidosPendientes(JSON.parse(pedidosPendientesGuardados));
        }
    }, []);

    // Guardar datos en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    useEffect(() => {
        localStorage.setItem("pedidosPendientes", JSON.stringify(pedidosPendientes));
    }, [pedidosPendientes]);

    // Obtener productos desde la API
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                // Verificar suscripción primero
                const subscriptionData = await checkPayment();
                if (!subscriptionData.has_active_subscription) {
                    setShowSubscriptionModal(true);
                    return;
                }

                const data = await getProducts();
                setProductos(data);
                setProductosFiltrados(data);
            } catch (error) {
                console.error("Error al obtener los productos:", error.message);
                setProductos([]);
                setShowSubscriptionModal(true);
            }
        };

        fetchProductos();
    }, []);

    // Función para ir a la página de pagos
    const handleGoToPayments = () => {
        setShowSubscriptionModal(false);
        router.push('/payments');
    };

    // Función para abrir la modal de detalles del producto
    const openModal = (producto) => {
        setProductoSeleccionado(producto);
        setModalProductoOpen(true);
    };

    // Función para cerrar la modal de detalles del producto
    const closeModal = () => {
        setProductoSeleccionado(null);
        setModalProductoOpen(false);
    };

    const agregarAlCarrito = (producto) => {
        const productoConPersonalizacion = {
            ...producto,
            id: producto.id_products,
        };

        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find((item) => item.id === productoConPersonalizacion.id);
            if (productoExistente) {
                return prevCarrito.map((item) =>
                    item.id === productoConPersonalizacion.id
                        ? { ...item, cantidad: item.cantidad + (producto.cantidad || 1) }
                        : item
                );
            }
            return [...prevCarrito, { ...productoConPersonalizacion, cantidad: producto.cantidad || 1 }];
        });
    };

    // Función para mover productos del carrito a pedidos pendientes
    const terminarOrden = async () => {
        if (carrito.length === 0) {
            setMensajeError("No puedes seguir porque no hay artículos en tu carrito");
            return;
        }

        setIsCreatingOrder(true);
        setMensajeError("");

        try {
            // Mover productos del carrito a pedidos pendientes
            setPedidosPendientes((prevPendientes) => [
                ...prevPendientes,
                ...carrito.map((item) => ({
                    id_products: item.id_products,
                    name: item.name,
                    cantidad: item.cantidad,
                    price: item.price,
                    fechaAgregado: new Date().toISOString()
                })),
            ]);

            setCarrito([]);
            setMensajeError("¡Productos agregados al pedido! Presiona 'Terminar Orden' para proceder al pago.");
            
            setTimeout(() => {
                setMensajeError("");
            }, 3000);

        } catch (error) {
            console.error('Error al agregar productos:', error);
            setMensajeError(`Error al agregar productos: ${error.message}`);
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // Función para abrir modal de pago
    const finalizarTodasOrdenes = async () => {
        if (pedidosPendientes.length === 0) {
            setMensajeError("No hay pedidos para finalizar. Realiza al menos un pedido primero.");
            return;
        }

        const totalPendientes = pedidosPendientes.reduce((total, item) => total + (item.price * item.cantidad), 0);
        
        setTotalPedidos(totalPendientes.toFixed(2));
        setModalTotalOpen(true);
        setMensajeError("");
    };

    // Función para procesar el pago
    const confirmarPago = async () => {
        if (pedidosPendientes.length === 0) {
            setMensajeError("No hay pedidos para procesar.");
            return;
        }

        if (isProcessingPayment) {
            return;
        }

        setIsProcessingPayment(true);
        setMensajeError("");

        try {
            console.log(`Procesando pago con ${metodoPago} por $${totalPedidos}`);
            
            // Crear la orden en el sistema
            const productosParaOrden = pedidosPendientes.map(item => ({
                id: item.id_products,
                cantidad: item.cantidad
            }));

            const response = await createSimpleOrder(productosParaOrden, null);
            console.log('Orden creada en cocina:', response);

            // Obtener el estado del switch de cocina
            const cocinaEnabled = localStorage.getItem('cocinaSwitch');
            const switchEnabled = cocinaEnabled ? JSON.parse(cocinaEnabled) : false;
            
            const orderStatus = switchEnabled ? 'PuntoDeVenta' : 'Finalizado';
            console.log(`Estado de la orden será: ${orderStatus} (Switch cocina: ${switchEnabled ? 'ON' : 'OFF'})`);

            // Finalizar con el pago
            const pagoResponse = await endOrderPuntoDeVenta(response.order_uuid, metodoPago, orderStatus);
            
            if (pagoResponse && (pagoResponse.success !== false)) {
                console.log('Pago procesado exitosamente:', pagoResponse);
                
                // Limpiar todo después del éxito
                setPedidosPendientes([]);
                localStorage.removeItem("pedidosPendientes");
                localStorage.removeItem("carrito");
                
                setModalTotalOpen(false);
                setMetodoPago('efectivo');
                
                const mensajeExito = switchEnabled 
                    ? "¡Pago procesado! La orden ha sido enviada al punto de venta." 
                    : "¡Pago procesado y orden finalizada exitosamente!";
                
                setMensajeError(mensajeExito);
                
                // *** MOSTRAR TICKET SIEMPRE SI ESTÁ HABILITADO ***
                const ticketsEnabled = localStorage.getItem('tickets');
                if (ticketsEnabled === 'true') {
                    setCompletedOrderUuid(response.order_uuid);
                    setShowTicketModal(true);
                }
                
                setTimeout(() => {
                    setMensajeError("");
                }, 3000);
                
            } else {
                throw new Error(pagoResponse?.message || 'La API indicó que el pago no se pudo procesar');
            }
            
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            
            let mensajeErrorUsuario = "Error al procesar el pago. ";
            
            if (error.message.includes('fetch')) {
                mensajeErrorUsuario += "Problemas de conexión. Verifica tu internet e intenta nuevamente.";
            } else if (error.message.includes('token')) {
                mensajeErrorUsuario += "Sesión expirada. Por favor, inicia sesión nuevamente.";
            } else if (error.message.includes('404')) {
                mensajeErrorUsuario += "Error del servidor. Intenta nuevamente en unos momentos.";
            } else if (error.message.includes('500')) {
                mensajeErrorUsuario += "Error del servidor. Intenta nuevamente en unos momentos.";
            } else {
                mensajeErrorUsuario += error.message || "Error desconocido. Intenta nuevamente.";
            }
            
            setMensajeError(mensajeErrorUsuario);
            
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // Función para limpiar datos cuando la orden es cancelada
    const limpiarOrdenCancelada = () => {
        setPedidosPendientes([]);
        setCarrito([]);
        
        localStorage.removeItem("pedidosPendientes");
        localStorage.removeItem("carrito");
        
        setShowCancelledOrderModal(false);
        
        setMensajeError("Los datos han sido limpiados.");
        setTimeout(() => {
            setMensajeError("");
        }, 3000);
    };

    // Filtrar productos según búsqueda, categoría y disponibilidad
    useEffect(() => {
        let productosFiltrados = productos;

        if (busqueda.trim() !== "") {
            productosFiltrados = productosFiltrados.filter((producto) =>
                producto.name.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.description.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        if (categoriaSeleccionada && categoriaSeleccionada !== "Categorías" && categoriaSeleccionada !== "Todas las categorías") {
            productosFiltrados = productosFiltrados.filter(
                (producto) => producto.category_name === categoriaSeleccionada
            );
        }

        if (disponibilidadSeleccionada === "Disponibles") {
            productosFiltrados = productosFiltrados.filter((producto) => producto.status === "activo");
        } else if (disponibilidadSeleccionada === "No disponibles") {
            productosFiltrados = productosFiltrados.filter((producto) => producto.status !== "activo");
        }

        setProductosFiltrados(productosFiltrados);
    }, [productos, busqueda, categoriaSeleccionada, disponibilidadSeleccionada]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            <Navbar />

            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
            </div>

            <section className="relative z-10 pt-4 pb-8">
               
                {/* Modal de orden cancelada */}
                {showCancelledOrderModal && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[10000]">
                        <div className="bg-white rounded-2xl p-8 w-11/12 md:w-1/3 shadow-2xl border border-red-100">
                            <div className="text-center">
                                <div className="mb-6">
                                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold mb-4 text-red-600">Orden Cancelada</h2>
                                <p className="text-gray-700 mb-8 leading-relaxed">
                                    La orden ha sido cancelada desde cocina. No es posible procesar el pago.
                                    Se limpiarán todos los datos relacionados con esta orden.
                                </p>
                                <button
                                    onClick={limpiarOrdenCancelada}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de suscripción */}
                {showSubscriptionModal && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-green-100">
                            <div className="text-center">
                                <div className="mb-6">
                                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold mb-4 text-red-600">Suscripción Requerida</h2>
                                <p className="text-gray-700 mb-8 leading-relaxed">
                                    Tu suscripción ha expirado o no tienes permisos para acceder a esta funcionalidad. 
                                    Por favor, renueva tu suscripción para continuar.
                                </p>
                                <button
                                    onClick={handleGoToPayments}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Ir a Pagos
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Barra de búsqueda y filtros mejorada */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Barra de búsqueda mejorada */}
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <HiOutlineMagnifyingGlass className="text-green-500 text-xl" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 bg-white/80 text-gray-800 placeholder-green-400"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Filtros mejorados */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Dropdown de categorías */}
                                <div className="relative min-w-[200px]">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <BsTag className="text-green-500 text-lg" />
                                    </div>
                                    <select
                                        className="w-full pl-12 pr-8 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 bg-white/80 text-gray-800 appearance-none cursor-pointer"
                                        value={categoriaSeleccionada}
                                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                    >
                                        <option value="Todas las categorías">Todas las categorías</option>
                                        {[...new Set(productos.map((producto) => producto.category_name))].map((categoria) => (
                                            <option key={categoria} value={categoria}>
                                                {categoria}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dropdown de disponibilidad */}
                                <div className="relative min-w-[180px]">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FiFilter className="text-green-500 text-lg" />
                                    </div>
                                    <select
                                        className="w-full pl-12 pr-8 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 bg-white/80 text-gray-800 appearance-none cursor-pointer"
                                        value={disponibilidadSeleccionada}
                                        onChange={(e) => setDisponibilidadSeleccionada(e.target.value)}
                                    >
                                        <option value="Disponibles">Disponibles</option>
                                        <option value="No disponibles">No disponibles</option>
                                        <option value="Todas">Todas</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón flotante del carrito mejorado */}
                <button
                    className="fixed bottom-8 right-6 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 z-[9999] border-2 border-white"
                    onClick={() => setCarritoModalOpen(true)}
                >
                    <FaShoppingCart className="text-xl" />
                    {carrito.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                            {carrito.length}
                        </span>
                    )}
                </button>

                {/* Modal del carrito mejorado */}
                {carritoModalOpen && (
                    <div
                        className="fixed inset-0 backdrop-blur-sm bg-black/50 z-[9998] flex justify-end"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setCarritoModalOpen(false);
                            }
                        }}
                    >
                        <div className="bg-white w-96 h-full shadow-2xl overflow-y-auto border-l border-gray-200">
                            {/* Header del carrito */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <FaShoppingCart className="text-xl" />
                                        Tu Pedido
                                    </h2>
                                    <button
                                        onClick={() => setCarritoModalOpen(false)}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Carrito actual */}
                                {carrito.length > 0 ? (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Productos en carrito
                                        </h3>
                                        <div className="max-h-64 overflow-y-auto space-y-3">
                                            {carrito.map((item) => (
                                                <div key={item.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <p className="font-bold text-green-800">{item.name}</p>
                                                            <p className="text-sm text-green-600">
                                                                ${parseFloat(item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                                                            </p>
                                                        </div>
                                                        <button
                                                            className="text-red-500 hover:text-red-700 transition-colors ml-2"
                                                            onClick={() => {
                                                                setCarrito((prevCarrito) =>
                                                                    prevCarrito.filter((producto) => producto.id !== item.id)
                                                                );
                                                            }}
                                                        >
                                                            <IoTrashOutline className="text-lg" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            className="bg-green-200 hover:bg-green-300 text-green-800 w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-colors"
                                                            onClick={() => {
                                                                setCarrito((prevCarrito) =>
                                                                    prevCarrito.map((producto) =>
                                                                        producto.id === item.id
                                                                            ? { ...producto, cantidad: Math.max(producto.cantidad - 1, 1) }
                                                                            : producto
                                                                    )
                                                                );
                                                            }}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-lg font-bold text-green-800 min-w-[2rem] text-center">{item.cantidad}</span>
                                                        <button
                                                            className="bg-green-200 hover:bg-green-300 text-green-800 w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-colors"
                                                            onClick={() => {
                                                                setCarrito((prevCarrito) =>
                                                                    prevCarrito.map((producto) =>
                                                                        producto.id === item.id
                                                                            ? { ...producto, cantidad: producto.cantidad + 1 }
                                                                            : producto
                                                                    )
                                                                );
                                                            }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FaShoppingCart className="text-gray-400 text-xl" />
                                        </div>
                                        <p className="text-gray-500">Tu carrito está vacío</p>
                                    </div>
                                )}

                                {/* Total del carrito */}
                                {carrito.length > 0 && (
                                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-6 border border-green-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-green-800">Total del carrito:</span>
                                            <span className="text-xl font-bold text-green-600">
                                                ${carrito.reduce((total, item) => total + item.price * item.cantidad, 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Mensajes de estado */}
                                {mensajeError && (
                                    <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${
                                        mensajeError.includes('exitosamente') 
                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                            : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                        {mensajeError}
                                    </div>
                                )}

                                {/* Botón agregar al pedido */}
                                <button
                                    className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                                        isCreatingOrder 
                                            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105'
                                    }`}
                                    onClick={terminarOrden}
                                    disabled={isCreatingOrder}
                                >
                                    {isCreatingOrder ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                            </svg>
                                            Agregando...
                                        </span>
                                    ) : 'Agregar al pedido'}
                                </button>

                                {/* Pedidos pendientes */}
                                {pedidosPendientes.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                            Pedidos Pendientes de Pago
                                        </h3>
                                        <div className="max-h-64 overflow-y-auto space-y-3">
                                            {pedidosPendientes.map((item, index) => (
                                                <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200 shadow-sm">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-yellow-800">{item.cantidad} x {item.name}</p>
                                                            <p className="text-sm text-yellow-600">
                                                                ${parseFloat(item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-yellow-700 font-medium">⏳ Pendiente</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Total pendiente */}
                                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mt-4 border border-yellow-200">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-yellow-800">Total Pendiente:</span>
                                                <span className="text-lg font-bold text-yellow-600">
                                                    ${pedidosPendientes.reduce((total, item) => total + (item.price * item.cantidad), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                               
                                {/* Botón "Proceder al Pago" */}
                                <button
                                    className={`w-full py-3 rounded-xl font-medium transition-all duration-200 mt-6 ${
                                        pedidosPendientes.length > 0
                                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg transform hover:scale-105"
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                                    onClick={finalizarTodasOrdenes}
                                    disabled={pedidosPendientes.length === 0}
                                >
                                    💳 Proceder al Pago
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal del total de pedidos mejorado */}
                {modalTotalOpen && (
                    <div
                        className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[9999]"
                        onClick={(e) => {
                            if (isProcessingPayment) return;
                            if (e.target === e.currentTarget) {
                                setModalTotalOpen(false);
                            }
                        }}
                    >
                        <div className="bg-white rounded-2xl p-8 w-11/12 md:w-96 shadow-2xl border border-green-100 max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Confirmar Pago</h2>
                            </div>

                            {/* Métodos de pago */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Seleccionar método de pago:</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                            metodoPago === 'efectivo' 
                                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg' 
                                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                                        } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => !isProcessingPayment && setMetodoPago('efectivo')}
                                        disabled={isProcessingPayment}
                                    >
                                        <BsCashCoin className="text-3xl mb-2"/>
                                        <span className="font-medium">Efectivo</span>
                                    </button>
                                    <button 
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                            metodoPago === 'tarjeta' 
                                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 shadow-lg' 
                                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                                        } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => !isProcessingPayment && setMetodoPago('tarjeta')}
                                        disabled={isProcessingPayment}
                                    >
                                        <FaCreditCard className="text-3xl mb-2"/>
                                        <span className="font-medium">Tarjeta</span>
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 mb-6 border border-green-200">
                                <div className="text-center">
                                    <p className="text-lg text-green-800 mb-1">
                                        Total a pagar:
                                    </p>
                                    <p className="text-3xl font-bold text-green-600">
                                        ${parseFloat(totalPedidos).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-sm text-green-700 mt-2">
                                        Método: <span className="font-semibold capitalize">{metodoPago}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Mensajes de estado */}
                            {mensajeError && (
                                <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${
                                    mensajeError.includes('exitosamente') 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        {mensajeError.includes('exitosamente') ? (
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        )}
                                        {mensajeError}
                                    </div>
                                </div>
                            )}

                            {/* Botones de acción */}
                            <div className="space-y-3">
                                <button
                                    className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                                        isProcessingPayment 
                                            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105'
                                    }`}
                                    onClick={confirmarPago}
                                    disabled={isProcessingPayment}
                                >
                                    {isProcessingPayment ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : '💳 Confirmar Pago'}
                                </button>

                                {/* Botón de cancelar/cerrar */}
                                {mensajeError && !mensajeError.includes('exitosamente') && (
                                    <button
                                        className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                                        onClick={() => setModalTotalOpen(false)}
                                        disabled={isProcessingPayment}
                                    >
                                        Cerrar y reintentar más tarde
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de detalles del producto mejorado */}
                {modalProductoOpen && productoSeleccionado && (
                    <div
                        className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-[9996]"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                closeModal();
                            }
                        }}
                    >
                        <div className="bg-white rounded-2xl w-11/12 md:w-96 shadow-2xl border border-green-100 max-h-[90vh] overflow-y-auto">
                            {/* Header del modal */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white">{productoSeleccionado.name}</h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Imagen del producto */}
                                <div className="mb-6">
                                    <img
                                        src={productoSeleccionado.image_url[0]}
                                        alt={`Imagen de ${productoSeleccionado.name}`}
                                        className="w-full h-48 object-cover rounded-xl border border-green-100 shadow-sm"
                                    />
                                </div>

                                {/* Descripción */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                                    <p className="text-gray-600 leading-relaxed">{productoSeleccionado.description}</p>
                                </div>

                                {/* Precio */}
                                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-6 border border-green-200">
                                    <div className="text-center">
                                        <p className="text-lg text-green-800 mb-1">Precio:</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${parseFloat(productoSeleccionado.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>

                                {/* Botón agregar */}
                                <button
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    onClick={() => {
                                        agregarAlCarrito(productoSeleccionado);
                                        closeModal();
                                    }}
                                >
                                    🛒 Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Grid de productos mejorado */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productosFiltrados.map((producto) => (
                            <div
                                key={producto.id_products}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden group"
                            >
                                {/* Imagen del producto */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={producto.image_url[0]}
                                        alt={`Imagen de ${producto.name}`}
                                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${producto.status !== "activo" ? "opacity-50" : ""}`}
                                    />
                                    
                                    {/* Badge de estado */}
                                    {producto.status === "activo" ? (
                                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                            Disponible
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                                                No Disponible
                                            </div>
                                        </div>
                                    )}

                                    {/* Precio flotante */}
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                        <span className="text-lg font-bold text-green-600">
                                            ${parseFloat(producto.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>

                                {/* Contenido del producto */}
                                <div className="p-5">
                                    {/* Nombre y categoría */}
                                    <div className="mb-3">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{producto.name}</h3>
                                        <span className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                                            {producto.category_name}
                                        </span>
                                    </div>

                                    {/* Descripción */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {producto.description.length > 80
                                            ? `${producto.description.slice(0, 80)}...`
                                            : producto.description}
                                    </p>

                                    {/* Controles de cantidad */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 rounded-lg flex items-center justify-center font-bold transition-colors border border-green-200"
                                                onClick={() => {
                                                    setProductosFiltrados((prevProductos) =>
                                                        prevProductos.map((item) =>
                                                            item.id_products === producto.id_products
                                                                ? {
                                                                    ...item,
                                                                    cantidad: Math.max((item.cantidad || 1) - 1, 1),
                                                                }
                                                                : item
                                                        )
                                                    );
                                                }}
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-bold text-gray-800 min-w-[2rem] text-center">
                                                {producto.cantidad || 1}
                                            </span>
                                            <button
                                                className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 rounded-lg flex items-center justify-center font-bold transition-colors border border-green-200"
                                                onClick={() => {
                                                    setProductosFiltrados((prevProductos) =>
                                                        prevProductos.map((item) =>
                                                            item.id_products === producto.id_products
                                                                ? {
                                                                    ...item,
                                                                    cantidad: (item.cantidad || 1) + 1,
                                                                }
                                                                : item
                                                        )
                                                    );
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <button
                                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                producto.status === "activo"
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                            onClick={() => agregarAlCarrito(producto)}
                                            disabled={producto.status !== "activo"}
                                        >
                                            {producto.status === "activo" ? "Agregar" : "No disponible"}
                                        </button>
                                    </div>

                                    {/* Botón ver detalles */}
                                    <button
                                        className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${
                                            producto.status === "activo"
                                                ? "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 border border-gray-300"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                        onClick={() => openModal(producto)}
                                        disabled={producto.status !== "activo"}
                                    >
                                        👁️ Ver Detalles
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mensaje cuando no hay productos */}
                    {productosFiltrados.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron productos</h3>
                            <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Modal de Ticket */}
            <TicketModal
                isOpen={showTicketModal}
                onClose={() => {
                    setShowTicketModal(false);
                    setCompletedOrderUuid(null);
                }}
                orderUuid={completedOrderUuid}
            />
        </div>
    );
}