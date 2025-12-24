import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/dashboardComponents/navbar";
import { BsTag } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FaShoppingCart } from "react-icons/fa";
import { FaPercent, FaDollarSign } from "react-icons/fa";
import { getProducts } from "@/useCases/getProducts";
import { createSimpleOrder } from "@/useCases/OrderPntoVenta";
import { endOrderPuntoDeVenta } from "@/useCases/endOrderPuntoDeVenta";
import { checkPayment } from "@/useCases/checkPayment";
import TicketModal from "@/components/TicketModal";
import CarritoModal from "./CarritoModal";
import { ModalConfirmarPago, ModalDescuentoProducto, ModalDescuentoOrden, ModalSuscripcion, ModalOrdenCancelada } from "./ModalsPago";
import ProductoCard, { ModalProducto } from "./ProductoCard";


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
    const [countdown, setCountdown] = useState(10);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [completedOrderUuid, setCompletedOrderUuid] = useState(null);
    const [pedidosPendientes, setPedidosPendientes] = useState([]);
    const [showCancelledOrderModal, setShowCancelledOrderModal] = useState(false);
    const [modalDescuentoOpen, setModalDescuentoOpen] = useState(false);
    const [productoDescuento, setProductoDescuento] = useState(null);
    const [tipoDescuento, setTipoDescuento] = useState('porcentaje');
    const [valorDescuento, setValorDescuento] = useState('');
    const [descuentoOrden, setDescuentoOrden] = useState({ tipo: 'porcentaje', valor: '', aplicado: false });
    const [modalDescuentoOrdenOpen, setModalDescuentoOrdenOpen] = useState(false);
    const [currentOrderUuid, setCurrentOrderUuid] = useState(null);

    // Mock para establecer permisos de ticket automáticamente
    useEffect(() => {
        localStorage.setItem('tickets', 'true');
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
        setCountdown(10);
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

    // Función para calcular el precio con descuento de un producto
    const calcularPrecioConDescuento = (producto) => {
        if (!producto.descuento || producto.descuento.valor === '' || producto.descuento.valor === '0') {
            return producto.price;
        }

        const precio = parseFloat(producto.price);
        const valorDesc = parseFloat(producto.descuento.valor);

        if (producto.descuento.tipo === 'porcentaje') {
            return precio - (precio * valorDesc / 100);
        } else {
            return Math.max(0, precio - valorDesc);
        }
    };

    // Función para calcular el total del carrito con descuentos
    const calcularTotalCarrito = () => {
        const subtotal = carrito.reduce((total, item) => {
            const precioConDescuento = calcularPrecioConDescuento(item);
            return total + (precioConDescuento * item.cantidad);
        }, 0);

        if (!descuentoOrden.aplicado || descuentoOrden.valor === '' || descuentoOrden.valor === '0') {
            return subtotal;
        }

        const valorDesc = parseFloat(descuentoOrden.valor);
        if (descuentoOrden.tipo === 'porcentaje') {
            return subtotal - (subtotal * valorDesc / 100);
        } else {
            return Math.max(0, subtotal - valorDesc);
        }
    };

    // Función para abrir modal de descuento por producto
    const abrirModalDescuento = (producto) => {
        setProductoDescuento(producto);
        setTipoDescuento(producto.descuento?.tipo || 'porcentaje');
        setValorDescuento(producto.descuento?.valor || '');
        setModalDescuentoOpen(true);
    };

    // Función para aplicar descuento a un producto
    const aplicarDescuentoProducto = () => {
        if (!productoDescuento || valorDescuento === '') return;

        const valor = parseFloat(valorDescuento);
        if (isNaN(valor) || valor < 0) {
            setMensajeError("El valor del descuento debe ser un número positivo");
            return;
        }

        if (tipoDescuento === 'porcentaje' && valor > 99) {
            setMensajeError("El descuento porcentual no puede ser mayor al 99%");
            return;
        }

        if (tipoDescuento === 'pesos') {
            const precioProducto = parseFloat(productoDescuento.price);
            if (valor >= precioProducto) {
                setMensajeError(`El descuento en pesos no puede ser mayor o igual al precio del producto ($${precioProducto.toFixed(2)})`);
                return;
            }
        }

        setCarrito(prevCarrito =>
            prevCarrito.map(item =>
                item.id === productoDescuento.id
                    ? {
                        ...item,
                        descuento: {
                            tipo: tipoDescuento,
                            valor: valorDescuento
                        }
                    }
                    : item
            )
        );

        setModalDescuentoOpen(false);
        setProductoDescuento(null);
        setValorDescuento('');
        setMensajeError('');
    };

    // Función para quitar descuento de un producto
    const quitarDescuentoProducto = (productId) => {
        setCarrito(prevCarrito =>
            prevCarrito.map(item =>
                item.id === productId
                    ? { ...item, descuento: null }
                    : item
            )
        );
    };

    // Función para aplicar descuento a toda la orden
    const aplicarDescuentoOrden = () => {
        if (descuentoOrden.valor === '') return;

        const valor = parseFloat(descuentoOrden.valor);
        if (isNaN(valor) || valor < 0) {
            setMensajeError("El valor del descuento debe ser un número positivo");
            return;
        }

        if (descuentoOrden.tipo === 'porcentaje' && valor > 99) {
            setMensajeError("El descuento porcentual no puede ser mayor al 99%");
            return;
        }

        if (descuentoOrden.tipo === 'pesos') {
            const totalCarrito = carrito.reduce((total, item) => {
                const precioConDescuento = calcularPrecioConDescuento(item);
                return total + (precioConDescuento * item.cantidad);
            }, 0);

            if (valor >= totalCarrito) {
                setMensajeError(`El descuento en pesos no puede ser mayor o igual al total de la orden ($${totalCarrito.toFixed(2)})`);
                return;
            }
        }

        setDescuentoOrden(prev => ({ ...prev, aplicado: true }));
        setModalDescuentoOrdenOpen(false);
        setMensajeError('');
    };

    const agregarAlCarrito = (producto) => {
        const productoConPersonalizacion = {
            ...producto,
            id: producto.id_products,
            descuento: null,
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

    // Función para mover productos del carrito a pedidos pendientes (Enviar a Cocina)
    const terminarOrden = async () => {
        if (carrito.length === 0) {
            setMensajeError("No puedes seguir porque no hay artículos en tu carrito");
            return;
        }

        setIsCreatingOrder(true);
        setMensajeError("");

        try {
            setPedidosPendientes((prevPendientes) => [
                ...prevPendientes,
                ...carrito.map((item) => ({
                    id_products: item.id_products,
                    name: item.name,
                    cantidad: item.cantidad,
                    price: item.price,
                    descuento: item.descuento,
                    fechaAgregado: new Date().toISOString()
                })),
            ]);

            setCarrito([]);

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

    // Función para abrir modal de pago (Finalizar Orden)
    const finalizarTodasOrdenes = async () => {
        if (pedidosPendientes.length === 0) {
            setMensajeError("No hay pedidos para finalizar. Realiza al menos un pedido primero.");
            return;
        }

        const subtotalConDescuentos = pedidosPendientes.reduce((total, item) => {
            const precioConDescuento = calcularPrecioConDescuento(item);
            return total + (precioConDescuento * item.cantidad);
        }, 0);

        let totalFinal = subtotalConDescuentos;
        if (descuentoOrden.aplicado && descuentoOrden.valor !== '' && descuentoOrden.valor !== '0') {
            const valorDesc = parseFloat(descuentoOrden.valor);
            if (descuentoOrden.tipo === 'porcentaje') {
                totalFinal = subtotalConDescuentos - (subtotalConDescuentos * valorDesc / 100);
            } else {
                totalFinal = Math.max(0, subtotalConDescuentos - valorDesc);
            }
        }

        setTotalPedidos(totalFinal.toFixed(2));
        setModalTotalOpen(true);
        setMensajeError("");
    };

    // Función para procesar el pago
    const confirmarPago = async () => {
        if (pedidosPendientes.length === 0) {
            setMensajeError("No hay pedidos para procesar.");
            return null;
        }

        if (isProcessingPayment) {
            return null;
        }

        setIsProcessingPayment(true);
        setMensajeError("");

        try {
            const response = await createSimpleOrder(
                pedidosPendientes.map(item => ({
                    id: item.id_products,
                    cantidad: item.cantidad,
                    descuento: item.descuento
                })),
                null,
                descuentoOrden.aplicado ? descuentoOrden : null,
                metodoPago
            );

            // Guardar el UUID de la orden para usarlo en la petición de inventario
            const orderUuid = response.order_uuid;
            setCurrentOrderUuid(orderUuid);

            const cocinaEnabled = localStorage.getItem('cocinaSwitch');
            const switchEnabled = cocinaEnabled ? JSON.parse(cocinaEnabled) : false;

            const orderStatus = switchEnabled ? 'PuntoDeVenta' : 'Finalizado';

            const pagoResponse = await endOrderPuntoDeVenta(
                orderUuid,
                metodoPago,
                orderStatus,
                pedidosPendientes.map(item => ({
                    id: item.id_products,
                    cantidad: item.cantidad,
                    descuento: item.descuento
                })),
                descuentoOrden.aplicado ? descuentoOrden : null
            );

            if (pagoResponse && (pagoResponse.success !== false)) {
                // Inventario logic removed

                setPedidosPendientes([]);
                localStorage.removeItem("pedidosPendientes");
                localStorage.removeItem("carrito");

                setDescuentoOrden({ tipo: 'porcentaje', valor: '', aplicado: false });

                setModalTotalOpen(false);
                setMetodoPago('efectivo');

                const mensajeExito = switchEnabled
                    ? "¡Pago procesado! La orden ha sido enviada al punto de venta."
                    : "¡Pago procesado y orden finalizada exitosamente!";

                setMensajeError(mensajeExito);

                const ticketsEnabled = localStorage.getItem('tickets');
                if (ticketsEnabled === 'true') {
                    setCompletedOrderUuid(orderUuid);
                    setShowTicketModal(true);
                }

                setTimeout(() => {
                    setMensajeError("");
                }, 3000);

                // Retornar el UUID de la orden para que pueda ser usado después
                return orderUuid;

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
            return null;

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

    // Efecto para el contador de la modal de suscripción
    useEffect(() => {
        let interval = null;

        if (showSubscriptionModal && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (showSubscriptionModal && countdown === 0) {
            handleGoToPayments();
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [showSubscriptionModal, countdown]);

    useEffect(() => {
        if (showSubscriptionModal) {
            setCountdown(10);
        }
    }, [showSubscriptionModal]);

    return (
        <div className="h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-green-50">
            <Navbar />

            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
            </div>

            <section className="relative z-10 pt-4 pb-8">
                {/* Modales de información (sin conflicto z-index) */}
                <ModalOrdenCancelada
                    isOpen={showCancelledOrderModal}
                    onLimpiar={limpiarOrdenCancelada}
                />

                <ModalSuscripcion
                    isOpen={showSubscriptionModal}
                    countdown={countdown}
                    onGoToPayments={handleGoToPayments}
                />

                {/* Barra de búsqueda y filtros */}
                <div className="sticky top-16 z-30 bg-gradient-to-br from-gray-50 via-white to-green-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-8 py-2 sm:py-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
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

                            <div className="flex flex-col sm:flex-row gap-4">
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

                {/* Botón flotante del carrito */}
                <button
                    className="fixed bottom-8 right-6 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 z-[9999] border-2 border-white"
                    onClick={() => setCarritoModalOpen(!carritoModalOpen)}
                >
                    <FaShoppingCart className="text-xl" />
                    {carrito.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                            {carrito.length}
                        </span>
                    )}
                </button>

                {/* Modal de confirmación de pago */}
                <ModalConfirmarPago
                    isOpen={modalTotalOpen}
                    onClose={() => !isProcessingPayment && setModalTotalOpen(false)}
                    totalPedidos={totalPedidos}
                    metodoPago={metodoPago}
                    setMetodoPago={setMetodoPago}
                    mensajeError={mensajeError}
                    isProcessingPayment={isProcessingPayment}
                    confirmarPago={confirmarPago}
                    orderUuid={currentOrderUuid}
                />

                {/* Modal de detalles del producto */}
                <ModalProducto
                    isOpen={modalProductoOpen}
                    onClose={closeModal}
                    producto={productoSeleccionado}
                    onAgregarAlCarrito={agregarAlCarrito}
                />

                {/* Grid de productos */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productosFiltrados.map((producto) => (
                            <ProductoCard
                                key={producto.id_products}
                                producto={producto}
                                onAgregarAlCarrito={agregarAlCarrito}
                                onOpenModal={openModal}
                            />
                        ))}
                    </div>

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

            {/* Modales de descuento - Fuera del contexto z-10 */}
            <ModalDescuentoProducto
                isOpen={modalDescuentoOpen}
                onClose={() => {
                    setModalDescuentoOpen(false);
                    setProductoDescuento(null);
                    setValorDescuento('');
                    setMensajeError('');
                }}
                productoDescuento={productoDescuento}
                tipoDescuento={tipoDescuento}
                setTipoDescuento={setTipoDescuento}
                valorDescuento={valorDescuento}
                setValorDescuento={setValorDescuento}
                mensajeError={mensajeError}
                setMensajeError={setMensajeError}
                aplicarDescuentoProducto={aplicarDescuentoProducto}
            />

            <ModalDescuentoOrden
                isOpen={modalDescuentoOrdenOpen}
                onClose={() => {
                    setModalDescuentoOrdenOpen(false);
                    setMensajeError('');
                }}
                descuentoOrden={descuentoOrden}
                setDescuentoOrden={setDescuentoOrden}
                mensajeError={mensajeError}
                setMensajeError={setMensajeError}
                aplicarDescuentoOrden={aplicarDescuentoOrden}
                calcularTotalCarrito={calcularTotalCarrito}
            />

            {/* Modal del carrito - Fuera del contexto z-10 */}
            <CarritoModal
                isOpen={carritoModalOpen}
                onClose={() => setCarritoModalOpen(false)}
                carrito={carrito}
                setCarrito={setCarrito}
                pedidosPendientes={pedidosPendientes}
                setPedidosPendientes={setPedidosPendientes}
                mensajeError={mensajeError}
                isCreatingOrder={isCreatingOrder}
                terminarOrden={terminarOrden}
                finalizarTodasOrdenes={finalizarTodasOrdenes}
                calcularPrecioConDescuento={calcularPrecioConDescuento}
                calcularTotalCarrito={calcularTotalCarrito}
                abrirModalDescuento={abrirModalDescuento}
                quitarDescuentoProducto={quitarDescuentoProducto}
                descuentoOrden={descuentoOrden}
                setDescuentoOrden={setDescuentoOrden}
                setModalDescuentoOrdenOpen={setModalDescuentoOrdenOpen}
                setMensajeError={setMensajeError}
            />

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