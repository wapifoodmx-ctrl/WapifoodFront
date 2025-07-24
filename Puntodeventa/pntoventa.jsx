import { FaCreditCard } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import Navbar from "@/dashboardComponents/navbar";
import { FaRegEye } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { BsTag } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FaShoppingCart } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getProducts } from "@/useCases/getProducts";
import { createSimpleOrder } from "@/useCases/OrderPntoVenta";
import { getFinalOrder } from "@/useCases/getfinalOrderId";
import TicketModal from "@/components/TicketModal";
import { endOrderPuntoDeVenta } from "@/useCases/endOrderPuntoDeVenta";
import { checkPayment } from "@/useCases/checkPayment";
import { getTicket } from "@/useCases/getTicket";

// Mock de ingredientes general
const mockIngredientes = ["Tomate", "Cebolla", "Lechuga", "Queso", "Salsa"];

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
    const [historialPedidos, setHistorialPedidos] = useState([]);
    const [modalTotalOpen, setModalTotalOpen] = useState(false);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalProductoOpen, setModalProductoOpen] = useState(false);
    const [ordenActiva, setOrdenActiva] = useState(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [totalFinal, setTotalFinal] = useState(0);
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    
    // Estados para el TicketModal
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [completedOrderUuid, setCompletedOrderUuid] = useState(null);

    // Agregar nuevo estado para pedidos pendientes (no enviados a cocina)
    const [pedidosPendientes, setPedidosPendientes] = useState([]);

    // AGREGAR ESTE ESTADO QUE FALTA:
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
        const ordenActivaGuardada = localStorage.getItem("ordenActiva");

        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }
        if (pedidosPendientesGuardados) {
            setPedidosPendientes(JSON.parse(pedidosPendientesGuardados));
        }
        if (ordenActivaGuardada) {
            const orden = JSON.parse(ordenActivaGuardada);
            setOrdenActiva(orden);
        }
    }, []);

    // Guardar datos en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    useEffect(() => {
        localStorage.setItem("historialPedidos", JSON.stringify(historialPedidos));
    }, [historialPedidos]);

    useEffect(() => {
        if (ordenActiva) {
            localStorage.setItem("ordenActiva", JSON.stringify(ordenActiva));
        }
    }, [ordenActiva]);

    // Guardar pedidos pendientes en localStorage
    useEffect(() => {
        localStorage.setItem("pedidosPendientes", JSON.stringify(pedidosPendientes));
    }, [pedidosPendientes]);

    // Función para cargar el total final usando getFinalOrder
    const cargarTotalFinal = async (uuid) => {
        try {
            const response = await getFinalOrder(uuid);
            if (response && response.length > 0 && response[0].total_final) {
                setTotalFinal(response[0].total_final);
            }
        } catch (error) {
            console.error('Error al cargar el total final:', error);
        }
    };

    // Obtener productos desde la API - MODIFICADO para verificar suscripción
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
                setProductos(data); // Guardar los productos obtenidos
                setProductosFiltrados(data); // Inicializar los productos filtrados
            } catch (error) {
                console.error("Error al obtener los productos:", error.message);
                setProductos([]); // Si ocurre un error, deja los productos vacíos
                // Si hay error, también mostrar modal de suscripción
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
        setProductoSeleccionado({ ...producto, ingredientesExcluidos: [] }); // Inicializa los ingredientes excluidos
        setModalProductoOpen(true);
    };

    // Función para cerrar la modal de detalles del producto
    const closeModal = () => {
        setProductoSeleccionado(null);
        setModalProductoOpen(false);
    };

    const agregarAlCarrito = (producto, comentario = "", ingredientesExcluidos = []) => {
        const productoConPersonalizacion = {
            ...producto,
            id: `${producto.id_products}-${ingredientesExcluidos.join(",")}-${comentario}`, // Genera un ID único basado en las exclusiones y el comentario
            comentario,
            ingredientesExcluidos,
        };

        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find((item) => item.id === productoConPersonalizacion.id);
            if (productoExistente) {
                // Incrementa la cantidad del producto existente
                return prevCarrito.map((item) =>
                    item.id === productoConPersonalizacion.id
                        ? { ...item, cantidad: item.cantidad + (producto.cantidad || 1) }
                        : item
                );
            }
            // Agrega el producto al carrito con la cantidad actual
            return [...prevCarrito, { ...productoConPersonalizacion, cantidad: producto.cantidad || 1 }];
        });
    };

    // Función MODIFICADA - Ya no envía a cocina, solo guarda localmente
    const terminarOrden = async () => {
        if (carrito.length === 0) {
            setMensajeError("No puedes seguir porque no hay artículos en tu carrito");
            return;
        }

        setIsCreatingOrder(true);
        setMensajeError("");

        try {
            // Mover productos del carrito a pedidos pendientes (sin enviar a API)
            setPedidosPendientes((prevPendientes) => [
                ...prevPendientes,
                ...carrito.map((item) => ({
                    id_products: item.id_products,
                    name: item.name,
                    cantidad: item.cantidad,
                    price: item.price,
                    comentario: item.comentario || "",
                    ingredientesExcluidos: item.ingredientesExcluidos || [],
                    fechaAgregado: new Date().toISOString()
                })),
            ]);

            // Limpiar el carrito
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

    // Función MODIFICADA - Ahora valida pedidos pendientes en lugar del historial
    const finalizarTodasOrdenes = async () => {
        if (pedidosPendientes.length === 0) {
            setMensajeError("No hay pedidos para finalizar. Realiza al menos un pedido primero.");
            return;
        }

        // Calcular total de pedidos pendientes
        const totalPendientes = pedidosPendientes.reduce((total, item) => total + (item.price * item.cantidad), 0);
        
        setTotalPedidos(totalPendientes.toFixed(2));
        setModalTotalOpen(true);
        setMensajeError("");
    };

    // Función confirmarPago modificada para mostrar ticket
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
            
            // 1. PRIMERO: Crear la orden en el sistema (enviar a cocina)
            const productosParaOrden = pedidosPendientes.map(item => ({
                id: item.id_products,
                cantidad: item.cantidad
            }));

            const response = await createSimpleOrder(productosParaOrden, null);
            console.log('Orden creada en cocina:', response);

            // 2. SEGUNDO: Obtener el estado del switch de cocina desde localStorage
            const cocinaEnabled = localStorage.getItem('cocinaSwitch');
            const switchEnabled = cocinaEnabled ? JSON.parse(cocinaEnabled) : false;
            
            // 3. TERCERO: Determinar el estado según el switch
            const orderStatus = switchEnabled ? 'PuntoDeVenta' : 'Finalizado';
            console.log(`Estado de la orden será: ${orderStatus} (Switch cocina: ${switchEnabled ? 'ON' : 'OFF'})`);

            // 4. CUARTO: Finalizar con el pago y estado apropiado
            const pagoResponse = await endOrderPuntoDeVenta(response.order_uuid, metodoPago, orderStatus);
            
            if (pagoResponse && (pagoResponse.success !== false)) {
                console.log('Pago procesado exitosamente:', pagoResponse);
                
                // 5. QUINTO: Limpiar todo después del éxito
                setPedidosPendientes([]);
                setOrdenActiva(null);
                setTotalFinal(0);
                localStorage.removeItem("ordenActiva");
                localStorage.removeItem("pedidosPendientes");
                localStorage.removeItem("carrito");
                
                setModalTotalOpen(false);
                setMetodoPago('efectivo');
                
                // Mensaje de éxito personalizado según el estado
                const mensajeExito = switchEnabled 
                    ? "¡Pago procesado! La orden ha sido enviada al punto de venta." 
                    : "¡Pago procesado y orden finalizada exitosamente!";
                
                setMensajeError(mensajeExito);
                
                // Verificar si debe mostrar el modal de ticket (solo si está finalizado)
                const ticketsEnabled = localStorage.getItem('tickets');
                if (ticketsEnabled === 'true' && !switchEnabled) {
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
            
            // Personalizar mensaje según el tipo de error
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

    // Función MODIFICADA para limpiar pedidos pendientes también
    const limpiarOrdenCancelada = () => {
        // Limpiar estados
        setPedidosPendientes([]);
        setOrdenActiva(null);
        setTotalFinal(0);
        setCarrito([]);
        
        // Limpiar localStorage
        localStorage.removeItem("ordenActiva");
        localStorage.removeItem("pedidosPendientes");
        localStorage.removeItem("carrito");
        
        // Cerrar modal
        setShowCancelledOrderModal(false);
        
        setMensajeError("Los datos han sido limpiados.");
        setTimeout(() => {
            setMensajeError("");
        }, 3000);
    };

    return (
        <section className="mt-16">
            <Navbar />

            {/* Modal de orden cancelada */}
            {showCancelledOrderModal && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[10000]">
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg">
                        <div className="text-center">
                            <div className="mb-4">
                                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-4 text-red-600">Orden Cancelada</h2>
                            <p className="text-gray-700 mb-6">
                                La orden ha sido cancelada desde cocina. No es posible procesar el pago.
                                Se limpiarán todos los datos relacionados con esta orden.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={limpiarOrdenCancelada}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Barra de búsqueda y dropdowns */}
            <div className="p-4 ">
                <div className="flex flex-col md:flex-row gap-4 lg:px-16 md:px-6">
                    {/* Barra de búsqueda */}
                    <div className="flex items-center border p-2 rounded-xl w-full md:w-1/3">
                        <HiOutlineMagnifyingGlass className="text-gray-500 mr-2 text-xl" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="w-full bg-transparent outline-none"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {/* Dropdown de categorías */}
                    <div className="flex items-center border p-2 rounded-md w-full md:w-1/4">
                        <BsTag className="text-gray-500 mr-2 text-xl font-bold flex self-center" />
                        <select
                            className="w-full bg-transparent outline-none"
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        >
                            <option value="Todos los platillos">Todas las categorías</option>
                            {[...new Set(productos.map((producto) => producto.category_name))].map((categoria) => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown de disponibilidad */}
                    <div className="flex items-center border p-2 rounded-md w-full md:w-1/4">
                        <FiFilter className="text-gray-500 mr-2" />
                        <select
                            className="w-full bg-transparent outline-none"
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

            {/* Botón flotante del carrito */}
            <button
                className="fixed bottom-10 right-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-green-600 z-[9999]"
                onClick={() => setCarritoModalOpen(true)}
            >
                <FaShoppingCart className="text-xl" />
                {carrito.length > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {carrito.length}
                    </span>
                )}
            </button>

            {/* Modal del carrito - ACTUALIZADO */}
            {carritoModalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 z-[9998] flex justify-end"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setCarritoModalOpen(false);
                        }
                    }}
                >
                    <div className="bg-white w-80 h-full shadow-lg p-4 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Tu Pedido</h2>

                        {/* Carrito actual */}
                        {carrito.length > 0 ? (
                            <div className="max-h-48 overflow-y-auto mb-4">
                                <ul className="space-y-2">
                                    {carrito.map((item) => (
                                        <li key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded shadow">
                                            <div>
                                                <p className="font-bold">{item.name}</p>
                                                {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                    <p className="text-sm text-gray-500">
                                                        Sin: {item.ingredientesExcluidos.join(", ")}
                                                    </p>
                                                )}
                                                {item.comentario && (
                                                    <p className="text-sm text-gray-500">
                                                        Comentario: {item.comentario}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-500">
                                                    ${parseFloat(item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="bg-gray-300 text-gray-800 px-2 py-0.5 rounded hover:bg-gray-400"
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
                                                <span className="text-sm font-bold">{item.cantidad}</span>
                                                <button
                                                    className="bg-gray-300 text-gray-800 px-2 py-0.5 rounded hover:bg-gray-400"
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
                                                <button
                                                    className="text-xl"
                                                    onClick={() => {
                                                        setCarrito((prevCarrito) =>
                                                            prevCarrito.filter((producto) => producto.id !== item.id)
                                                        );
                                                    }}
                                                >
                                                    <IoTrashOutline />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-500">Tu carrito está vacío.</p>
                        )}

                        {/* Total del carrito */}
                        <p className="text-lg font-bold">Total: ${carrito.reduce((total, item) => total + item.price * item.cantidad, 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        {carrito.length > 3 && (
                            <p className="text-xs text-gray-400 text-center mt-2">
                                Mostrando {carrito.length} productos - Desliza para ver más
                            </p>
                        )}

                        <div className="border-t pt-4">
                            {mensajeError && (
                                <p className={`text-sm font-bold mt-2 ${
                                    mensajeError.includes('exitosamente') ? 'text-green-500' : 'text-red-500'
                                }`}>
                                    {mensajeError}
                                </p>
                            )}
                            <button
                                className={`w-full py-2 rounded-lg mt-4 ${
                                    isCreatingOrder 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-500 hover:bg-green-600'
                                } text-white`}
                                onClick={terminarOrden}
                                disabled={isCreatingOrder}
                            >
                                {isCreatingOrder ? 'Agregando...' : 'Agregar al pedido'}
                            </button>
                        </div>

                        {/* Pedidos pendientes (reemplaza historial) */}
                        {pedidosPendientes.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-500 mb-2">Pedidos Pendientes</h3>
                                <div className="max-h-48 overflow-y-auto">
                                    <ul className="space-y-2">
                                        {pedidosPendientes.map((item, index) => (
                                            <li key={index} className="p-2 rounded shadow bg-yellow-50 border border-yellow-200">
                                                <p className="font-bold">{item.cantidad} x {item.name}</p>
                                                {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                    <p className="text-sm text-gray-500">
                                                        Sin: {item.ingredientesExcluidos.join(", ")}
                                                    </p>
                                                )}
                                                {item.comentario && (
                                                    <p className="text-sm text-gray-500">
                                                        Comentario: {item.comentario}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-500">
                                                    Precio: ${parseFloat(item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                                                </p>
                                                <p className="text-xs text-yellow-600 font-medium">⏳ Pendiente de pago</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        
                        {/* Total de pedidos pendientes */}
                        {pedidosPendientes.length > 0 && (
                            <p className="text-sm text-gray-500 pt-2 font-semibold">
                                Total Pendiente: ${pedidosPendientes.reduce((total, item) => total + (item.price * item.cantidad), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        )}
                       
                        {/* Botón "Terminar Orden" - ACTUALIZADO */}
                        <div className="mt-4">
                            <button
                                className={`w-full py-2 rounded-lg mt-4 ${
                                    pedidosPendientes.length > 0
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={finalizarTodasOrdenes}
                                disabled={pedidosPendientes.length === 0}
                            >
                                Proceder al Pago
                            </button>
                            {mensajeError && pedidosPendientes.length === 0 && (
                                <p className="text-red-500 text-sm font-bold mt-2">{mensajeError}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal del total de pedidos - ACTUALIZADO CON SEGURIDAD */}
            {modalTotalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[9999]"
                    onClick={(e) => {
                        // Prevenir cierre accidental durante el procesamiento
                        if (isProcessingPayment) return;
                        if (e.target === e.currentTarget) {
                            setModalTotalOpen(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center">Total de la Orden</h2>
                        <div className="flex justify-between gap-2">
                            <button 
                                className={`flex items-center justify-center border-1 w-5/12 h-10 rounded-md transition-colors ${
                                    metodoPago === 'efectivo' 
                                        ? 'bg-green-400 text-white border-green-400' 
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => !isProcessingPayment && setMetodoPago('efectivo')}
                                disabled={isProcessingPayment}
                            >
                                <BsCashCoin className="text-2xl mr-2"/>
                                Efectivo
                            </button>
                            <button 
                                className={`flex items-center justify-center border-1 w-5/12 h-10 rounded-md transition-colors ${
                                    metodoPago === 'tarjeta' 
                                        ? 'bg-green-400 text-white border-green-400' 
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => !isProcessingPayment && setMetodoPago('tarjeta')}
                                disabled={isProcessingPayment}
                            >
                                <FaCreditCard className="text-2xl mr-2"/>
                                Tarjeta
                            </button>
                        </div>
                        <p className="text-lg text-center mb-4 pt-4">
                            El total de tus pedidos es: 
                            <span className="font-bold">
                                ${parseFloat(totalPedidos).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </p>
                        <p className="text-center text-gray-600 mb-4">
                            Método de pago: <span className="font-semibold capitalize">{metodoPago}</span>
                        </p>

                        {/* Mostrar mensajes de error/éxito */}
                        {mensajeError && (
                            <div className={`text-sm font-bold text-center mb-4 p-3 rounded-lg ${
                                mensajeError.includes('exitosamente') 
                                    ? 'text-green-700 bg-green-100 border border-green-300' 
                                    : 'text-red-700 bg-red-100 border border-red-300'
                            }`}>
                                {mensajeError}
                            </div>
                        )}

                        <button
                            className={`w-full py-2 rounded-lg transition-colors ${
                                isProcessingPayment 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                            onClick={confirmarPago}
                            disabled={isProcessingPayment}
                        >
                            {isProcessingPayment ? 'Procesando...' : 'Confirmar Pago'}
                        </button>

                        {/* Botón para cerrar y reintentar más tarde */}
                        {mensajeError && !mensajeError.includes('exitosamente') && (
                            <button
                                className="w-full py-2 rounded-lg mt-2 bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={() => setModalTotalOpen(false)}
                                disabled={isProcessingPayment}
                            >
                                Cerrar y reintentar más tarde
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de detalles del producto */}
            {modalProductoOpen && productoSeleccionado && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[9996]"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">{productoSeleccionado.name}</h2>
                        <img
                            src={productoSeleccionado.image_url[0]}
                            alt={`Imagen de ${productoSeleccionado.name}`}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-500 mb-4">{productoSeleccionado.description}</p>
                        <p className="text-lg font-bold text-green-500 mb-4">
                            Precio: ${parseFloat(productoSeleccionado.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <h3 className="text-md font-semibold mb-2">Ingredientes:</h3>
                        <ul className="mb-4 text-sm">
                            {(productoSeleccionado.ingredients || mockIngredientes).map((ingrediente, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`ingrediente-${index}`}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setProductoSeleccionado((prevProducto) => {
                                                const ingredientesExcluidos = isChecked
                                                    ? [...prevProducto.ingredientesExcluidos, ingrediente]
                                                    : prevProducto.ingredientesExcluidos.filter((ing) => ing !== ingrediente);
                                                return { ...prevProducto, ingredientesExcluidos };
                                            });
                                        }}
                                    />
                                    <label htmlFor={`ingrediente-${index}`}>Sin {ingrediente}</label>
                                </li>
                            ))}
                        </ul>
                        <button
                            className="bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600"
                            onClick={() => {
                                agregarAlCarrito(
                                    productoSeleccionado,
                                    productoSeleccionado.comentario || "",
                                    productoSeleccionado.ingredientesExcluidos
                                );
                                closeModal();
                            }}
                        >
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            )}
            {/* Card Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12">
                {productosFiltrados.map((producto) => (
                    <div
                        key={producto.id_products}
                        className="rounded-lg shadow-lg flex flex-col bg-white relative"
                    >
                        <div className="w-full h-48 relative">
                            <img
                                src={producto.image_url[0]}
                                alt={`Imagen de ${producto.name}`}
                                className={`rounded-t-lg w-full h-full object-cover ${producto.status !== "activo" ? "opacity-50" : ""
                                    }`}
                            />
                            {producto.status !== "activo" && (
                                <div className="absolute inset-0 backdrop-brightness-30 flex items-center justify-center">
                                    <p className="text-white text-center font-bold px-4">
                                        Producto no disponible, favor de actualizar disponibilidad en productos
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-xl">{producto.name}</h3>
                                <p className="text-xl text-green-500 font-bold">
                                    $ {parseFloat(producto.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <p className="text-gray-500 mb-4 line-clamp-2 min-h-[3rem]">
                                {producto.description.length > 80
                                    ? `${producto.description.slice(0, 80)}...`
                                    : producto.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <p className="bg-green-300 text-green-800 rounded-full px-4 py-1 text-sm">
                                    {producto.category_name}
                                </p>
                            </div>

                            {/* Botones "+" y "-" */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center cursor-pointer"
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
                                    <span className="text-lg font-bold">{producto.cantidad || 1}</span>
                                    <button
                                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center cursor-pointer"
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
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm cursor-pointer"
                                    onClick={() => agregarAlCarrito(producto)}
                                    disabled={producto.status !== "activo"}
                                >
                                    Agregar
                                </button>
                            </div>

                            {/* Botón "Personalizar" */}
                            <div className="mt-4">
                                <button
                                    className="flex gap-4 items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer w-full"
                                    onClick={() => openModal(producto)}
                                    disabled={producto.status !== "activo"}
                                >
                                    <FaRegEye className="h-[20px] w-[20px]" />
                                    Personalizar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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
        </section>
    );
}