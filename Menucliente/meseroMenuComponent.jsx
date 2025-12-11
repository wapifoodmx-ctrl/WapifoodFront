import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { IoHomeOutline, IoLogOutOutline } from "react-icons/io5";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { MdTableRestaurant } from "react-icons/md";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { getProducts } from "@/useCases/getProducts";
import { loginMesero } from '@/useCases/loginMesero';
import { createSimpleClientOrder } from "@/useCases/orderClientMenu";
import { getFinalOrder } from "@/useCases/getfinalOrderId";
import { getTables } from "@/useCases/getTables";
import { updateTableStatus } from "@/useCases/tablesStatus";
import { endOrder } from "@/useCases/endOrder";
import getCodigoConfirmacion from "@/useCases/getCodogoConfirmacion";
import TicketModal from "@/components/TicketModal";
import { getTicket } from "@/useCases/getTicket";
import descontarInventario from "@/useCases/inventarioDescontar"; 
import { getLatestOrdersByPlan } from "@/useCases/getLatestOrdersByPlan";
import ProductCard from "./ ProductCard";
import CartModal from "./CartModal";
import LoginMeseroModal from "./LoginMeseroModal";
import MeseroMesaSelectionModal from "./MeseroMesaSelectionModal";
import PaymentModal from "./PaymentModal";
import ProductDetailModal from "./ProductDetailModal";
import ConfirmationCodeModal from "./ConfirmationCodeModal";
import { toast } from "@/components/Toast";

const categoriaOrden = {
    "Entradas": 0,
    "Platos Principales": 1,
    "Ensaladas": 2,
    "Pizzas": 3,
    "Postres": 4,
    "Bebidas": 5,
    "Termos": 6,
};

const productosEstaticos = [];

export default function MeseroMenuComponent() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los platillos");
    const [modalOpen, setModalOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [carritoModalOpen, setCarritoModalOpen] = useState(false);
    const [productos, setProductos] = useState(productosEstaticos);
    const [productosFiltrados, setProductosFiltrados] = useState(productosEstaticos);
    const [mensajeError, setMensajeError] = useState("");
    const [historialPedidos, setHistorialPedidos] = useState([]);
    const [modalTotalOpen, setModalTotalOpen] = useState(false);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState(""); 
    const [loginModalOpen, setLoginModalOpen] = useState(true);
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [ordenActiva, setOrdenActiva] = useState(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [totalFinal, setTotalFinal] = useState(0);
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [numeroMesa, setNumeroMesa] = useState('');
    const [mesas, setMesas] = useState([]);
    const [modalMesaOpen, setModalMesaOpen] = useState(false);
    const [loadingMesas, setLoadingMesas] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [completedOrderUuid, setCompletedOrderUuid] = useState(null);
    const [descuentoOrden, setDescuentoOrden] = useState({ tipo: 'porcentaje', valor: '', aplicado: false });
    const [modalConfirmacionCodigoOpen, setModalConfirmacionCodigoOpen] = useState(false);
    const [codigoConfirmacionEsperado, setCodigoConfirmacionEsperado] = useState('');
    const [isValidandoCode, setIsValidandoCode] = useState(false);
    const [errorCodigoConfirmacion, setErrorCodigoConfirmacion] = useState('');
    
    // Estados específicos del mesero
    const [meseroData, setMeseroData] = useState(null);
    const [ordenesActivas, setOrdenesActivas] = useState([]);
    const [ordenPendienteSeleccionada, setOrdenPendienteSeleccionada] = useState(null);

    useEffect(() => {
        localStorage.setItem('tickets', 'true');
    }, []);

    // Transformar productos de la API al formato del menú
    const transformarProductos = (productosAPI) => {
        return productosAPI.map((producto) => ({
            id: `${producto.id_products}-${Date.now()}`,
            id_products: producto.id_products,
            nombre: producto.name,
            name: producto.name,
            precio: parseFloat(producto.price),
            price: parseFloat(producto.price),
            categoria: producto.category_name || producto.nombre_categoria || producto.categoria || "Sin categoría",
            image: Array.isArray(producto.image_url) ? producto.image_url[0] : producto.image_url || producto.image || '/placeholder-food.png',
            descripcion: producto.description || "",
            description: producto.description || "",
            status: producto.status,
            ingredientes: producto.ingredientes ? producto.ingredientes.split(",").map(ing => ing.trim()) : [],
            cantidad: 1,
            comentario: "",
            ingredientesExcluidos: [],
        }));
    };

    // Login del mesero
    const handleLogin = async (values) => {
        setIsLoading(true);
        setServerError('');

        try {
            const response = await loginMesero(values.email, values.access_code);
            
            // Guardar token y datos del mesero
            localStorage.setItem('authToken', response.access_token);
            localStorage.setItem('meseroData', JSON.stringify({
                name: response.mesero_name,
                restaurant: response.restaurant_name,
                email: values.email
            }));

            setMeseroData({
                name: response.mesero_name,
                restaurant: response.restaurant_name,
                email: values.email
            });

            setIsAuthenticated(true);
            setLoginModalOpen(false);
            
            toast.success(`¡Bienvenido ${response.mesero_name}!`);
            
            // Cargar mesas y órdenes activas
            await cargarMesas();
            await cargarOrdenesActivas();
            
        } catch (error) {
            console.error('Error durante el login:', error);
            setServerError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar órdenes activas
    const cargarOrdenesActivas = async () => {
        try {
            const ordenes = await getLatestOrdersByPlan();
            // Filtrar órdenes excluyendo la mesa 1 (punto de venta)
            const ordenesFiltradas = ordenes.filter(orden => orden.mesa_number !== 1);
            setOrdenesActivas(ordenesFiltradas);
        } catch (error) {
            console.error('Error al cargar órdenes activas:', error);
        }
    };

    // Cargar mesas
    const cargarMesas = async () => {
        setLoadingMesas(true);
        try {
            const mesasData = await getTables();
            
            if (mesasData && mesasData.table_status) {
                const mesasArray = Object.entries(mesasData.table_status)
                    .filter(([numero]) => parseInt(numero) !== 1) // Excluir mesa 1
                    .map(([numero, estado]) => ({
                        numero: parseInt(numero),
                        estado: estado
                    }))
                    .sort((a, b) => a.numero - b.numero);
                
                setMesas(mesasArray);
            }
        } catch (error) {
            console.error('Error al cargar mesas:', error);
            setMensajeError('Error al cargar las mesas');
        } finally {
            setLoadingMesas(false);
        }
    };

    // Seleccionar mesa
    const seleccionarMesa = async (numeroMesaSeleccionada, ordenPendiente) => {
        // Si no hay mesa seleccionada, solo cerrar el modal
        if (!numeroMesaSeleccionada || numeroMesaSeleccionada === null) {
            setModalMesaOpen(false);
            return;
        }
        
        if (numeroMesaSeleccionada && numeroMesaSeleccionada !== '') {
            const mesaString = String(numeroMesaSeleccionada).trim();
            
            try {
                // Si hay una orden pendiente, cargarla
                if (ordenPendiente) {
                    setOrdenPendienteSeleccionada(ordenPendiente);
                    
                    // Cargar el ticket completo para obtener los productos
                    const ticketData = await getTicket(ordenPendiente.order_uuid);
                    
                    if (ticketData && ticketData.products) {
                        // Transformar productos del ticket al formato del historial
                        const productosHistorial = ticketData.products.map(producto => ({
                            id_products: producto.id_products || producto.product_id,
                            nombre: producto.product_name,
                            name: producto.product_name,
                            cantidad: producto.quantity,
                            precio: parseFloat(producto.unit_price),
                            price: parseFloat(producto.unit_price),
                            comentario: "",
                            ingredientesExcluidos: [],
                            order_id: ordenPendiente.id_orders,
                            fecha_orden: ordenPendiente.date_time,
                            estado: producto.order_detail_status
                        }));

                        setHistorialPedidos(productosHistorial);
                        setOrdenActiva({
                            order_uuid: ordenPendiente.order_uuid,
                            id_orders: ordenPendiente.id_orders,
                            total: parseFloat(ordenPendiente.total),
                            state: ordenPendiente.state,
                            order_status: ordenPendiente.order_status,
                            date_time: ordenPendiente.date_time
                        });
                        setTotalFinal(parseFloat(ordenPendiente.total));
                        
                        localStorage.setItem("ordenActiva_mesero", JSON.stringify({
                            order_uuid: ordenPendiente.order_uuid,
                            id_orders: ordenPendiente.id_orders,
                            total: parseFloat(ordenPendiente.total),
                            state: ordenPendiente.state,
                            order_status: ordenPendiente.order_status,
                            date_time: ordenPendiente.date_time
                        }));
                        localStorage.setItem("historialPedidos_mesero", JSON.stringify(productosHistorial));
                    }
                    
                    toast.info(`Mesa ${mesaString} tiene una orden activa`);
                } else {
                    // Mesa libre - limpiar datos
                    setOrdenPendienteSeleccionada(null);
                    setHistorialPedidos([]);
                    setOrdenActiva(null);
                    setTotalFinal(0);
                    setCarrito([]);
                    
                    localStorage.removeItem("ordenActiva_mesero");
                    localStorage.removeItem("historialPedidos_mesero");
                    localStorage.removeItem("carrito_mesero");
                }
                
                setNumeroMesa(mesaString);
                localStorage.setItem('numeroMesa_mesero', mesaString);
                setModalMesaOpen(false);
                setMensajeError('');
                
            } catch (error) {
                console.error('Error al seleccionar mesa:', error);
                toast.error('Error al cargar datos de la mesa');
            }
        } else {
            setMensajeError('Por favor selecciona una mesa válida');
        }
    };

    // Cerrar sesión del mesero
    const cerrarSesionMesero = () => {
        // Limpiar todos los datos
        localStorage.removeItem('authToken');
        localStorage.removeItem('meseroData');
        localStorage.removeItem('numeroMesa_mesero');
        localStorage.removeItem('ordenActiva_mesero');
        localStorage.removeItem('historialPedidos_mesero');
        localStorage.removeItem('carrito_mesero');
        
        setIsAuthenticated(false);
        setMeseroData(null);
        setNumeroMesa('');
        setOrdenActiva(null);
        setHistorialPedidos([]);
        setCarrito([]);
        setLoginModalOpen(true);
        
        toast.info('Sesión cerrada exitosamente');
        router.push('/');
    };

    // Cargar productos
    useEffect(() => {
        if (!isAuthenticated) return;

        const cargarProductos = async () => {
            try {
                setLoading(true);
                const productosAPI = await getProducts();
                const productosTransformados = transformarProductos(productosAPI);

                const productosActivos = productosTransformados.filter(
                    producto => producto.status === 'activo'
                );

                setProductos(productosActivos);
                setProductosFiltrados(productosActivos);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                toast.error('Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, [isAuthenticated]);

    // Persistencia de datos
    useEffect(() => {
        const carritoGuardado = localStorage.getItem("carrito_mesero");
        const historialGuardado = localStorage.getItem("historialPedidos_mesero");
        const ordenActivaGuardada = localStorage.getItem("ordenActiva_mesero");
        const mesaGuardada = localStorage.getItem("numeroMesa_mesero");
        const meseroGuardado = localStorage.getItem("meseroData");

        if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));
        if (historialGuardado) setHistorialPedidos(JSON.parse(historialGuardado));
        if (mesaGuardada) setNumeroMesa(mesaGuardada);
        if (meseroGuardado) {
            setMeseroData(JSON.parse(meseroGuardado));
            setIsAuthenticated(true);
            setLoginModalOpen(false);
        }
        if (ordenActivaGuardada) {
            const orden = JSON.parse(ordenActivaGuardada);
            setOrdenActiva(orden);
            if (orden && orden.order_uuid) {
                cargarTotalFinal(orden.order_uuid);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("carrito_mesero", JSON.stringify(carrito));
    }, [carrito]);

    useEffect(() => {
        localStorage.setItem("historialPedidos_mesero", JSON.stringify(historialPedidos));
    }, [historialPedidos]);

    useEffect(() => {
        if (ordenActiva) {
            localStorage.setItem("ordenActiva_mesero", JSON.stringify(ordenActiva));
        }
    }, [ordenActiva]);

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

    // Filtrar y buscar productos
    useEffect(() => {
        let productosFiltrados = productos;

        if (categoriaSeleccionada !== "Todos los platillos") {
            productosFiltrados = productosFiltrados.filter(
                (producto) => producto.categoria === categoriaSeleccionada
            );
        }

        if (busqueda.trim() !== "") {
            const busquedaLower = busqueda.toLowerCase();
            productosFiltrados = productosFiltrados.filter((producto) =>
                producto.nombre.toLowerCase().includes(busquedaLower)
            );
        }

        setProductosFiltrados(productosFiltrados);
    }, [categoriaSeleccionada, busqueda, productos]);

    const abrirModal = (producto) => {
        setProductoSeleccionado({
            ...producto,
            cantidad: 1,
            comentario: "",
            ingredientesExcluidos: [],
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setProductoSeleccionado(null);
    };

    const agregarAlCarrito = (producto) => {
        const productoConId = {
            ...producto,
            id: `${producto.id_products}-${Date.now()}`
        };

        setCarrito((prevCarrito) => [...prevCarrito, productoConId]);
        closeModal();
        toast.success(`${producto.nombre} agregado al carrito`);
    };

    // Realizar pedido
    const realizarPedido = async () => {
        if (carrito.length === 0) {
            toast.warning("El carrito está vacío");
            return;
        }

        if (!numeroMesa) {
            toast.error("Selecciona una mesa primero");
            setModalMesaOpen(true);
            return;
        }

        setIsCreatingOrder(true);
        setMensajeError("");

        try {
            const productos = carrito.map((item, index) => {
                const ingredientesBase = productos.find(p => p.id_products === item.id_products)?.ingredientes || [];
                const ingredientesFinales = ingredientesBase.filter(
                    ing => !item.ingredientesExcluidos.includes(ing)
                );

                return {
                    product_id: item.id_products,
                    quantity: item.cantidad,
                    unit_price: item.precio,
                    ingredientes: ingredientesFinales.join(", "),
                    comentario: item.comentario || ""
                };
            });

            const orderData = {
                mesa_number: parseInt(numeroMesa),
                productos: productos,
                descuento: descuentoOrden.aplicado 
                    ? (descuentoOrden.tipo === 'porcentaje' 
                        ? parseFloat(descuentoOrden.valor) 
                        : 0)
                    : 0,
                orderscol: `Orden creada por mesero: ${meseroData.name}`
            };

            // Si hay una orden activa, agregar su UUID
            if (ordenActiva && ordenActiva.order_uuid) {
                orderData.order_uuid = ordenActiva.order_uuid;
            }

            const response = await createSimpleClientOrder(orderData);

            if (!response || !response.order_uuid) {
                throw new Error('No se recibió un UUID de orden válido');
            }

            // Actualizar o crear orden activa
            setOrdenActiva({
                order_uuid: response.order_uuid,
                id_orders: response.id_orders,
                total: response.total,
                state: response.state,
                order_status: response.order_status,
                date_time: response.date_time
            });

            setHistorialPedidos((prevHistorial) => [
                ...prevHistorial,
                ...carrito.map((item) => ({
                    id_products: item.id_products || item.id.split('-')[0],
                    nombre: item.nombre || item.name,
                    name: item.name || item.nombre,
                    cantidad: item.cantidad,
                    precio: item.precio || item.price,
                    price: item.price || item.precio,
                    comentario: item.comentario || "",
                    ingredientesExcluidos: item.ingredientesExcluidos || [],
                    order_id: response.id_orders,
                    fecha_orden: response.date_time
                })),
            ]);

            setCarrito([]);
            setDescuentoOrden({ tipo: 'porcentaje', valor: '', aplicado: false });
            await cargarTotalFinal(response.order_uuid);
            await cargarOrdenesActivas(); // Actualizar lista de órdenes
            
            toast.success("¡Orden enviada exitosamente!");

        } catch (error) {
            console.error('Error al crear la orden:', error);
            toast.error(`Error al enviar la orden: ${error.message}`);
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // Terminar orden
    const terminarOrden = async () => {
        if (historialPedidos.length === 0) {
            toast.warning("No hay pedidos para finalizar");
            return;
        }

        if (ordenActiva && ordenActiva.order_uuid) {
            try {
                const ticketData = await getTicket(ordenActiva.order_uuid);
                
                if (ticketData.order_status === "Cancelado") {
                    toast.error("Esta orden ha sido cancelada");
                    return;
                }
                
                setTotalPedidos(totalFinal > 0 ? totalFinal.toFixed(2) : "0.00");
                setModalTotalOpen(true);
                setMensajeError("");
                
            } catch (error) {
                console.error('Error al verificar el estado de la orden:', error);
                toast.error("Error al verificar el estado de la orden");
                return;
            }
        } else {
            setTotalPedidos(totalFinal > 0 ? totalFinal.toFixed(2) : "0.00");
            setModalTotalOpen(true);
            setMensajeError("");
        }
    };

    // Confirmar pago
    const confirmarPago = async () => {
        if (!ordenActiva || !ordenActiva.order_uuid) {
            toast.error("No hay una orden activa para finalizar");
            return;
        }

        if (isProcessingPayment) return;

        setIsProcessingPayment(true);
        setMensajeError("");

        try {
            const currentOrderUuid = ordenActiva.order_uuid;
            const response = await endOrder(currentOrderUuid, metodoPago);
            
            if (response && (response.success !== false)) {
                // Limpiar datos
                setHistorialPedidos([]);
                setOrdenActiva(null);
                setTotalFinal(0);
                setCarrito([]);
                
                localStorage.removeItem("ordenActiva_mesero");
                localStorage.removeItem("historialPedidos_mesero");
                localStorage.removeItem("carrito_mesero");
                
                setModalTotalOpen(false);
                setModalConfirmacionCodigoOpen(false);
                setMetodoPago('efectivo');
                
                await cargarOrdenesActivas(); // Actualizar lista de órdenes
                
                toast.success("¡Pago procesado exitosamente!");
                
                const ticketsEnabled = localStorage.getItem('tickets');
                if (ticketsEnabled === 'true') {
                    setCompletedOrderUuid(currentOrderUuid);
                    setShowTicketModal(true);
                }
            } else {
                throw new Error(response?.message || 'Error al procesar el pago');
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            toast.error(`Error al procesar el pago: ${error.message}`);
            setErrorCodigoConfirmacion(error.message);
        } finally {
            setIsProcessingPayment(false);
            setIsValidandoCode(false);
        }
    };

    // Solicitar código de confirmación
    const solicitarCodigoConfirmacion = async () => {
        if (!metodoPago) {
            toast.warning("Selecciona un método de pago");
            return;
        }

        setIsProcessingPayment(true);
        setMensajeError("");
        setErrorCodigoConfirmacion("");

        try {
            const codigoData = await getCodigoConfirmacion();
            
            if (codigoData && codigoData.codigo_confirmacion) {
                setCodigoConfirmacionEsperado(codigoData.codigo_confirmacion);
                setModalConfirmacionCodigoOpen(true);
            } else {
                throw new Error("No se pudo obtener el código de confirmación");
            }
        } catch (error) {
            console.error('Error al obtener código de confirmación:', error);
            toast.error("Error al obtener el código de confirmación");
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // Validar código de confirmación
    const validarCodigoConfirmacion = async (codigoIngresado) => {
        if (codigoIngresado !== codigoConfirmacionEsperado) {
            setErrorCodigoConfirmacion("Código incorrecto");
            return;
        }

        setIsValidandoCode(true);
        setErrorCodigoConfirmacion("");

        try {
            // Descontar inventario (sin restricciones si falla)
            if (ordenActiva && ordenActiva.order_uuid) {
                try {
                    const ticketData = await getTicket(ordenActiva.order_uuid);
                    
                    if (ticketData && ticketData.products && Array.isArray(ticketData.products)) {
                        const productosParaDescontar = ticketData.products
                            .filter(producto => producto.order_detail_status !== "Cancelado")
                            .map(producto => {
                                const productId = producto.product_id || producto.id_products || producto.id;
                                return {
                                    product_id: parseInt(productId),
                                    quantity: parseInt(producto.quantity)
                                };
                            })
                            .filter(producto => !isNaN(producto.product_id));

                        if (productosParaDescontar.length > 0) {
                            await descontarInventario(productosParaDescontar).catch(error => {
                                console.error('Error al descontar inventario (continuando):', error);
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error al procesar inventario (continuando):', error);
                }
            }

            await confirmarPago();
        } catch (error) {
            console.error('Error al confirmar el pago:', error);
            setErrorCodigoConfirmacion("Error al procesar el pago");
        } finally {
            setIsValidandoCode(false);
        }
    };

    const cerrarModalConfirmacionCodigo = () => {
        if (isValidandoCode || isProcessingPayment) return;
        
        setModalConfirmacionCodigoOpen(false);
        setCodigoConfirmacionEsperado('');
        setErrorCodigoConfirmacion('');
    };

    const categorias = ["Todos los platillos", ...new Set(productos.map(p => p.categoria))];

    if (!isAuthenticated) {
        return (
            <LoginMeseroModal
                isOpen={loginModalOpen}
                onLogin={handleLogin}
                serverError={serverError}
                isLoading={isLoading}
            />
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
                <div className="text-lg text-green-700 font-bold">Cargando productos...</div>
            </div>
        );
    }

    return (
        <div className="h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-green-50">
            {/* Header */}
            <header className="relative z-10">
                <nav className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-4 shadow-lg">
                    <div className="flex items-center max-w-7xl mx-auto justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold ml-2 text-white">WapiFood</h1>
                            <span className="hidden sm:inline-block text-xs bg-orange-500 px-2 py-1 rounded-full font-semibold">Mesero</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Info del mesero */}
                            <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                                <FaUser className="text-white" size={16} />
                                <span className="text-sm font-semibold text-white">{meseroData?.name}</span>
                            </div>
                            
                            {/* Botón de Mesa */}
                            {numeroMesa ? (
                                <div 
                                    className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-lg cursor-pointer hover:bg-green-200 transition-colors border border-green-300 shadow"
                                    onClick={() => {
                                        setModalMesaOpen(true);
                                        cargarMesas();
                                        cargarOrdenesActivas();
                                    }}
                                    title="Click para cambiar de mesa"
                                >
                                    <MdTableRestaurant className="text-green-600" size={20} />
                                    <span className="text-sm font-medium text-green-800">
                                        Mesa {numeroMesa}
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setModalMesaOpen(true);
                                        cargarMesas();
                                        cargarOrdenesActivas();
                                    }}
                                    className="text-xs text-orange-200 hover:text-white transition-colors font-semibold"
                                >
                                    Seleccionar Mesa
                                </button>
                            )}
                            
                            {/* Botón logout */}
                            <button
                                onClick={cerrarSesionMesero}
                                className="hidden sm:flex items-center gap-1 bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                                title="Cerrar Sesión"
                            >
                                <IoLogOutOutline size={18} />
                                <span>Salir</span>
                            </button>
                            
                            {/* Menú hamburguesa */}
                            <button
                                className="z-20 cursor-pointer py-3 hamburger-button"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Toggle menu"
                            >
                                <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                                <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Menú lateral hamburguesa */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-green-100 to-emerald-100 shadow-2xl border-r border-green-200
                    transition-transform duration-300 ease-in-out menu-container z-20
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <ul className="flex flex-col mt-16 p-4 text-xl">
                    <p className="text-green-700 font-bold mb-2">Categorías</p>
                    {categorias.map((categoria, index) => (
                        <li
                            key={`${categoria}-${index}`}
                            className="flex hover:bg-green-200 p-2 rounded-xl cursor-pointer gap-2 transition-all duration-200"
                            onClick={() => {
                                setCategoriaSeleccionada(categoria);
                                setIsOpen(false);
                            }}
                        >
                            {categoria === "Todos los platillos" && <IoHomeOutline className="self-center text-green-600" />}
                            <span className="font-semibold text-green-800">{categoria}</span>
                        </li>
                    ))}
                    <hr className="my-4 border-green-300" />
                    <li
                        className="flex hover:bg-red-200 p-2 rounded-xl cursor-pointer gap-2 transition-all duration-200 sm:hidden"
                        onClick={cerrarSesionMesero}
                    >
                        <IoLogOutOutline className="self-center text-red-600" size={24} />
                        <span className="font-semibold text-red-700">Cerrar Sesión</span>
                    </li>
                </ul>
            </div>

            {/* Buscador */}
            <div className="max-w-4xl mx-auto px-4 py-6 z-10 relative">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 hover:border-green-300 text-green-800"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <HiMagnifyingGlass className="h-5 w-5 text-green-600" />
                    </div>
                    {busqueda && (
                        <button
                            onClick={() => setBusqueda("")}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {busqueda && (
                    <p className="mt-2 text-sm text-green-700">
                        {productosFiltrados.length} resultado(s) encontrado(s) para "{busqueda}"
                    </p>
                )}
            </div>

            {/* Botón flotante del carrito */}
            <button
                className="fixed bottom-10 right-6 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 z-[9999] border-2 border-white"
                onClick={() => setCarritoModalOpen(true)}
            >
                <FaShoppingCart className="text-xl" />
                {carrito.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                        {carrito.length}
                    </span>
                )}
            </button>

            {/* Mensajes */}
            {mensajeError && (
                <div className="max-w-4xl mx-auto px-4 mb-4">
                    <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                        {mensajeError}
                    </div>
                </div>
            )}

            {/* Grid de Productos */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12 relative z-10">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
                        <ProductCard
                            key={producto.id}
                            producto={producto}
                            onAddToCart={(prod, incremento) => {
                                if (incremento !== undefined) {
                                    setProductosFiltrados((prevProductos) =>
                                        prevProductos.map((item) =>
                                            item.id === prod.id
                                                ? { ...item, cantidad: Math.max((item.cantidad || 1) + incremento, 1) }
                                                : item
                                        )
                                    );
                                } else {
                                    abrirModal(prod);
                                }
                            }}
                            onViewDetails={abrirModal}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaShoppingCart className="text-gray-400 text-4xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron productos</h3>
                        <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                )}
            </section>

            {/* Modales */}
            <MeseroMesaSelectionModal
                isOpen={modalMesaOpen}
                loadingMesas={loadingMesas}
                mesas={mesas}
                ordenesActivas={ordenesActivas}
                mensajeError={mensajeError}
                onSelectMesa={seleccionarMesa}
                meseroName={meseroData?.name}
            />

            <CartModal
                isOpen={carritoModalOpen}
                carrito={carrito}
                historialPedidos={historialPedidos}
                totalFinal={totalFinal}
                mensajeError={mensajeError}
                isCreatingOrder={isCreatingOrder}
                ordenActiva={ordenActiva}
                descuentoOrden={descuentoOrden}
                setDescuentoOrden={setDescuentoOrden}
                onClose={() => setCarritoModalOpen(false)}
                onUpdateQuantity={(id, incremento) => {
                    setCarrito((prevCarrito) =>
                        prevCarrito.map((producto) =>
                            producto.id === id
                                ? { ...producto, cantidad: Math.max(producto.cantidad + incremento, 1) }
                                : producto
                        )
                    );
                }}
                onRemoveItem={(id) => {
                    setCarrito((prevCarrito) =>
                        prevCarrito.filter((producto) => producto.id !== id)
                    );
                }}
                onRealizarPedido={realizarPedido}
                onTerminarOrden={terminarOrden}
                onUpdateCart={setCarrito}
                getCodigoConfirmacion={getCodigoConfirmacion}
            />

            <PaymentModal
                isOpen={modalTotalOpen}
                totalPedidos={totalPedidos}
                metodoPago={metodoPago}
                mensajeError={mensajeError}
                isProcessingPayment={isProcessingPayment}
                onClose={() => setModalTotalOpen(false)}
                onSelectMetodoPago={setMetodoPago}
                onConfirmarPago={confirmarPago}
                onRequestConfirmationCode={solicitarCodigoConfirmacion}
            />

            <ConfirmationCodeModal
                isOpen={modalConfirmacionCodigoOpen}
                codigoEsperado={codigoConfirmacionEsperado}
                isValidando={isValidandoCode}
                mensajeError={errorCodigoConfirmacion}
                onClose={cerrarModalConfirmacionCodigo}
                onConfirm={validarCodigoConfirmacion}
            />

            <ProductDetailModal
                isOpen={modalOpen}
                producto={productoSeleccionado}
                onClose={closeModal}
                onAddToCart={(prod, incremento) => {
                    if (incremento !== undefined) {
                        setProductoSeleccionado({
                            ...prod,
                            cantidad: Math.max((prod.cantidad || 1) + incremento, 1),
                        });
                    } else {
                        agregarAlCarrito(prod);
                    }
                }}
            />

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
