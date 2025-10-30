import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from "next/image";
import { IoHomeOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { GoChecklist } from "react-icons/go";
import { MdTableRestaurant } from "react-icons/md";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import kime from "@/pages/assets/img/kime.jpeg";
import { getProducts } from "@/useCases/getProducts";
import { loginUser } from '@/useCases/login';
import { createSimpleClientOrder } from "@/useCases/orderClientMenu";
import { getFinalOrder } from "@/useCases/getfinalOrderId";
import { getTables } from "@/useCases/getTables";
import { updateTableStatus } from "@/useCases/tablesStatus";
import { endOrder } from "@/useCases/endOrder";
import getCodigoConfirmacion from "@/useCases/getCodogoConfirmacion";
import TicketModal from "@/components/TicketModal";
import { getTicket } from "@/useCases/getTicket";
import { HiMagnifyingGlass } from "react-icons/hi2";

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

export default function MenuCliente() {
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
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [ordenActiva, setOrdenActiva] = useState(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [totalFinal, setTotalFinal] = useState(0);
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [codigoConfirmacion, setCodigoConfirmacion] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [numeroMesa, setNumeroMesa] = useState('');
    const [mesas, setMesas] = useState([]);
    const [modalMesaOpen, setModalMesaOpen] = useState(false);
    const [loadingMesas, setLoadingMesas] = useState(false);
    const [modalCambioMesaOpen, setModalCambioMesaOpen] = useState(false);
    const [codigoCambioMesa, setCodigoCambioMesa] = useState('');
    const [errorCodigoMesa, setErrorCodigoMesa] = useState('');
    const [procesandoCambioMesa, setProcesandoCambioMesa] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [completedOrderUuid, setCompletedOrderUuid] = useState(null);
    const [modalOrdenActivaOpen, setModalOrdenActivaOpen] = useState(false);
    const [showCancelledOrderModal, setShowCancelledOrderModal] = useState(false);
    const [subscriptionError, setSubscriptionError] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(10);
    const [modalProductosCanceladosOpen, setModalProductosCanceladosOpen] = useState(false);
    const [productosCancelados, setProductosCancelados] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [modalExitFullscreenOpen, setModalExitFullscreenOpen] = useState(false);
    const [codigoExitFullscreen, setCodigoExitFullscreen] = useState('');
    const [errorCodigoExitFullscreen, setErrorCodigoExitFullscreen] = useState('');
    const [procesandoExitFullscreen, setProcesandoExitFullscreen] = useState(false);

    useEffect(() => {
        localStorage.setItem('tickets', 'true');
    }, []);

    // Función actualizada para monitorear tanto el estado de la mesa como la orden cada 45 segundos
    const monitorearEstadoMesaYOrden = async () => {
        if (!numeroMesa) return;

        try {
            // 1. Verificar estado de la mesa
            const mesasData = await getTables();
            
            // Verificar si hay errores de suscripción
            if (mesasData.error && mesasData.status === 403) {
                return;
            }
            
            // Verificar si es respuesta de paquete básico
            if (mesasData && 
                mesasData.max_mesas === 1 && 
                mesasData.table_status && 
                Object.keys(mesasData.table_status).length === 1 &&
                mesasData.table_status["1"] === "Libre") {
                return;
            }
            
            // Verificar el estado actual de la mesa seleccionada
            if (mesasData && mesasData.table_status && typeof mesasData.table_status === 'object') {
                const estadoMesaActual = mesasData.table_status[numeroMesa];
                
                // Si la mesa cambió a "Libre", significa que fue liberada desde otra vista
                if (estadoMesaActual === 'Libre') {
                    // console.log(`Mesa ${numeroMesa} fue liberada desde otra vista. Limpiando datos locales...`);
                    
                    // Limpiar localStorage
                    localStorage.removeItem('numeroMesa');
                    localStorage.removeItem("carrito1");
                    localStorage.removeItem("historialPedidos1");
                    localStorage.removeItem("ordenActiva1");
                    localStorage.removeItem("productosCanceladosSnapshot1"); // Limpiar snapshot también
                    
                    // Limpiar estados
                    setNumeroMesa('');
                    setCarrito([]);
                    setHistorialPedidos([]);
                    setOrdenActiva(null);
                    setTotalFinal(0);
                    
                    // Mostrar mensaje informativo
                    setMensajeError("La mesa fue liberada desde otro dispositivo. Por favor, selecciona una nueva mesa.");
                    
                    // Abrir modal para seleccionar nueva mesa
                    setTimeout(() => {
                        cargarMesas();
                        setMensajeError("");
                    }, 2000);
                    
                    return; // Salir de la función si la mesa fue liberada
                }
            }

            // 2. Verificar estado de la orden (solo si existe UUID)
            if (ordenActiva && ordenActiva.order_uuid) {
                try {
                    const ticketData = await getTicket(ordenActiva.order_uuid);
                    
                    if (ticketData) {
                        // *** NUEVA VERIFICACIÓN: Detectar orden cancelada ***
                        if (ticketData.order_status === "Cancelado") {
                            // console.log('Orden cancelada detectada por el listener');
                            
                            // Mostrar modal de orden cancelada automáticamente
                            setShowCancelledOrderModal(true);
                            
                            // No continuar con el resto del procesamiento
                            return;
                        }

                        // *** SOLO ACTUALIZAR HISTORIAL - NUNCA CANCELAR (si la orden NO está cancelada) ***
                        if (ticketData.products && Array.isArray(ticketData.products)) {
                            let hayProductosPreparados = false;
                            let hayProductosPendientes = false;
                            let hayProductosCancelados = false;
                            
                            // Crear historial con TODOS los productos, incluyendo cancelados
                            const historialActualizado = ticketData.products.map(producto => {
                                // Contar estados para mensajes informativos
                                if (producto.order_detail_status === "Preparado") {
                                    hayProductosPreparados = true;
                                } else if (producto.order_detail_status === "Pendiente") {
                                    hayProductosPendientes = true;
                                } else if (producto.order_detail_status === "Cancelado") {
                                    hayProductosCancelados = true;
                                }

                                return {
                                    id_products: producto.id_orders_details,
                                    nombre: producto.product_name,
                                    name: producto.product_name,
                                    cantidad: parseInt(producto.quantity),
                                    precio: parseFloat(producto.unit_price),
                                    price: parseFloat(producto.unit_price),
                                    comentario: "",
                                    ingredientesExcluidos: [],
                                    order_id: ticketData.id_orders,
                                    fecha_orden: ticketData.date_time,
                                    estado: producto.order_detail_status // Estado actual del producto
                                };
                            });

                            // *** LÓGICA DE MATCH PARA EVITAR MODALS REPETIDOS ***
                            const productosAhoraCancelados = historialActualizado.filter(item => item.estado === 'Cancelado');
                            
                            // Obtener snapshot de productos cancelados previamente mostrados
                            const snapshotKey = `productosCanceladosSnapshot1`;
                            const snapshotGuardado = localStorage.getItem(snapshotKey);
                            let productosCanceladosAnteriores = [];
                            
                            if (snapshotGuardado) {
                                try {
                                    productosCanceladosAnteriores = JSON.parse(snapshotGuardado);
                                } catch (error) {
                                    console.error('Error al parsear snapshot de productos cancelados:', error);
                                    productosCanceladosAnteriores = [];
                                }
                            }
                            
                            // Crear lista de IDs de productos ya mostrados como cancelados
                            const idsProductosCanceladosAnteriores = productosCanceladosAnteriores.map(p => p.id_products);
                            
                            // Filtrar solo los productos que son NUEVOS cancelados (no están en el snapshot)
                            const nuevosProductosCancelados = productosAhoraCancelados.filter(
                                producto => !idsProductosCanceladosAnteriores.includes(producto.id_products)
                            );
                            
                            // Solo mostrar modal si HAY productos REALMENTE NUEVOS cancelados
                            if (nuevosProductosCancelados.length > 0) {
                                // console.log('Nuevos productos cancelados detectados:', nuevosProductosCancelados.length);
                                setProductosCancelados(nuevosProductosCancelados);
                                setModalProductosCanceladosOpen(true);
                                
                                // Actualizar snapshot con TODOS los productos cancelados (anteriores + nuevos)
                                localStorage.setItem(snapshotKey, JSON.stringify(productosAhoraCancelados));
                            } else {
                                // console.log('No hay nuevos productos cancelados. Match encontrado.');
                            }

                            // Solo actualizar si hay cambios
                            const historialAnterior = JSON.stringify(historialPedidos);
                            const historialNuevo = JSON.stringify(historialActualizado);
                            
                            if (historialAnterior !== historialNuevo) {
                                setHistorialPedidos(historialActualizado);
                                
                                // Actualizar el total final basándose en el total de la API
                                const nuevoTotal = parseFloat(ticketData.total || 0);
                                setTotalFinal(nuevoTotal);

                                // Mostrar mensajes informativos solo cuando hay cambios (sin mencionar cancelación)
                                if (hayProductosPreparados && !hayProductosCancelados) {
                                    setMensajeError("¡Productos preparados y listos para recoger!");
                                } else if (hayProductosPreparados) {
                                    setMensajeError("Algunos productos están listos para recoger.");
                                } else if (hayProductosPendientes) {
                                    setMensajeError("Tu orden está siendo preparada en cocina.");
                                }
                                
                                setTimeout(() => {
                                    setMensajeError("");
                                }, 5000);
                            }
                        }

                        // Actualizar la orden activa con los datos más recientes (solo si NO está cancelada)
                        const ordenActualizada = {
                            ...ordenActiva,
                            order_status: ticketData.order_status,
                            state: ticketData.state,
                            total: ticketData.total
                        };
                        
                        setOrdenActiva(ordenActualizada);
                        
                        // Log para debugging
                        // console.log('Estado actual de la orden:', {
                        //     order_status: ticketData.order_status,
                        //     productos_total: ticketData.products?.length || 0,
                        //     total: ticketData.total
                        // });
                    }
                } catch (error) {
                    console.error('Error al verificar estado de la orden:', error);
                    // No mostrar errores al usuario para evitar interrupciones
                }
            }
        } catch (error) {
            console.error('Error al monitorear estado de mesa y orden:', error);
            // No mostrar errores al usuario para evitar interrupciones
        }
    };

    // useEffect para inicializar el monitoreo cuando hay una mesa seleccionada
    useEffect(() => {
        let intervalId;
        
        if (numeroMesa && isAuthenticated) {
            // Ejecutar inmediatamente la primera vez
            monitorearEstadoMesaYOrden();
            
            // Configurar intervalo de 45 segundos
            intervalId = setInterval(monitorearEstadoMesaYOrden, 45000);
            
            // console.log(`Iniciando monitoreo de mesa ${numeroMesa} y orden cada 45 segundos`);
        }
        
        // Limpiar intervalo cuando se desmonta o cambia la mesa
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
                // console.log('Deteniendo monitoreo de mesa y orden');
            }
        };
    }, [numeroMesa, isAuthenticated, ordenActiva?.order_uuid]);

    const seleccionarMesa = async (numeroMesaSeleccionada) => {
        if (numeroMesaSeleccionada && numeroMesaSeleccionada !== '') {
            const mesaString = String(numeroMesaSeleccionada).trim();
            
            try {
                const resultado = await updateTableStatus(parseInt(mesaString), 'NoDisponible');
                
                setNumeroMesa(mesaString);
                localStorage.setItem('numeroMesa', mesaString);
                setModalMesaOpen(false);
                setMensajeError('');
            } catch (error) {
                console.error('Error al actualizar el estatus de la mesa:', error);
                setMensajeError('Error al reservar la mesa. Inténtalo nuevamente.');
            }
        } else {
            setMensajeError('Por favor selecciona una mesa válida');
        }
    };

    const handleClickMesa = () => {
        if (ordenActiva && ordenActiva.order_uuid) {
            setModalOrdenActivaOpen(true);
            return;
        }
        
        setModalCambioMesaOpen(true);
        setCodigoCambioMesa('');
        setErrorCodigoMesa('');
    };

    const confirmarCambioMesa = async () => {
        try {
            const codigoAPI = await getCodigoConfirmacion();
            const codigoEsperado = codigoAPI.codigo_confirmacion;
            
            if (codigoCambioMesa !== codigoEsperado.toString()) {
                setErrorCodigoMesa('Código incorrecto. Intenta nuevamente.');
                return;
            }

            setProcesandoCambioMesa(true);
            setErrorCodigoMesa('');

            if (numeroMesa) {
                await updateTableStatus(parseInt(numeroMesa), 'Libre');
            }

            localStorage.removeItem('numeroMesa');
            setNumeroMesa('');
            setModalCambioMesaOpen(false);
            
            await cargarMesas();

        } catch (error) {
            console.error('Error al cambiar de mesa:', error);
            setErrorCodigoMesa('Error al obtener código de confirmación o al cambiar de mesa.');
        } finally {
            setProcesandoCambioMesa(false);
        }
    };

    const cerrarSesion = async () => {
        try {
            const codigoAPI = await getCodigoConfirmacion();
            const codigoEsperado = codigoAPI.codigo_confirmacion;
            
            if (codigoCambioMesa !== codigoEsperado.toString()) {
                setErrorCodigoMesa('Código incorrecto. Intenta nuevamente.');
                return;
            }

            setProcesandoCambioMesa(true);
            setErrorCodigoMesa('');

            if (numeroMesa) {
                await updateTableStatus(parseInt(numeroMesa), 'Libre');
            }

            localStorage.removeItem('token');
            localStorage.removeItem('numeroMesa');
            localStorage.removeItem("carrito1");
            localStorage.removeItem("historialPedidos1");
            localStorage.removeItem("ordenActiva1");

            sessionStorage.removeItem('token');

            setNumeroMesa('');
            setCarrito([]);
            setHistorialPedidos([]);
            setOrdenActiva(null);
            setTotalFinal(0);
            setModalCambioMesaOpen(false);
            setIsAuthenticated(false);
            
            setLoginModalOpen(true);

        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setErrorCodigoMesa('Error al obtener código de confirmación o al cerrar sesión.');
        } finally {
            setProcesandoCambioMesa(false);
        }
    };

    // Función para manejar el modo pantalla completa
    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                // Entrar a pantalla completa - sin restricciones
                await document.documentElement.requestFullscreen();
                setIsFullscreen(true);
            } else {
                // Salir de pantalla completa - requiere código de seguridad
                setModalExitFullscreenOpen(true);
                setCodigoExitFullscreen('');
                setErrorCodigoExitFullscreen('');
            }
        } catch (error) {
            console.error('Error al cambiar modo pantalla completa:', error);
        }
    };

    // Función para confirmar salida de pantalla completa con código
    const confirmarExitFullscreen = async () => {
        try {
            const codigoAPI = await getCodigoConfirmacion();
            const codigoEsperado = codigoAPI.codigo_confirmacion;
            
            if (codigoExitFullscreen !== codigoEsperado.toString()) {
                setErrorCodigoExitFullscreen('Código incorrecto. Intenta nuevamente.');
                return;
            }

            setProcesandoExitFullscreen(true);
            setErrorCodigoExitFullscreen('');

            // Salir de pantalla completa
            await document.exitFullscreen();
            setIsFullscreen(false);
            setModalExitFullscreenOpen(false);

        } catch (error) {
            console.error('Error al salir de pantalla completa:', error);
            setErrorCodigoExitFullscreen('Error al obtener código de confirmación.');
        } finally {
            setProcesandoExitFullscreen(false);
        }
    };

    // Escuchar cambios en el estado de pantalla completa
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const mesaGuardada = localStorage.getItem('numeroMesa');
        
        if (!token) {
            setLoginModalOpen(true);
            setLoading(false);
        } else {
            setIsAuthenticated(true);
            if (mesaGuardada) {
                setNumeroMesa(mesaGuardada);
            }
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && !numeroMesa) {
            cargarMesas();
        }
    }, [isAuthenticated, numeroMesa]);

    const cargarMesas = async () => {
        try {
            setLoadingMesas(true);
            setSubscriptionError(false);
            setRedirectCountdown(10);
            
            const mesasData = await getTables();
            
            // Guardar la respuesta para poder verificarla después
            localStorage.setItem('lastMesasResponse', JSON.stringify(mesasData));
            
            if (mesasData.error && mesasData.status === 403) {
                // console.log('Error 403 detectado - Suscripción requerida');
                setSubscriptionError(true);
                setMesas([]);
                setModalMesaOpen(true);
                setMensajeError('');
                return;
            }
            
            // Verificar si la respuesta es exactamente la que indica falta de función
            if (mesasData && 
                mesasData.max_mesas === 1 && 
                mesasData.table_status && 
                Object.keys(mesasData.table_status).length === 1 &&
                mesasData.table_status["1"] === "Libre") {
                
                // console.log('Detectado paquete básico sin función de mesas');
                setSubscriptionError(true);
                setMesas([]);
                setModalMesaOpen(true);
                setMensajeError('');
                return;
            }
            
            let mesasArray = [];
            
            if (mesasData && mesasData.table_status && typeof mesasData.table_status === 'object') {
                mesasArray = Object.entries(mesasData.table_status)
                    .map(([numeroMesa, estado]) => ({
                        id: parseInt(numeroMesa),
                        number: parseInt(numeroMesa),
                        status: estado
                    }))
                    .filter(mesa => !isNaN(mesa.number))
                    .sort((a, b) => a.number - b.number);
                
                const mesasLibres = mesasArray.filter(mesa => 
                    mesa.status === 'Libre' && mesa.number !== 1
                );
                
                setMesas(mesasLibres);
                
            } else {
                mesasArray = Array.from({ length: 25 }, (_, index) => ({
                    id: index + 2,
                    number: index + 2,
                    status: 'Libre'
                }));
                setMesas(mesasArray);
            }
            
            setModalMesaOpen(true);
            setMensajeError('');
            
        } catch (error) {
            console.error('Error al cargar las mesas:', error);
            
            if (error.message && (error.message.includes('403') || error.message.includes('Favor de renovar'))) {
                setSubscriptionError(true);
                setMesas([]);
                setModalMesaOpen(true);
                setMensajeError('');
                return;
            }
            
            setMensajeError(`Error al cargar las mesas: ${error.message}`);
            
            const mesasDefault = Array.from({ length: 25 }, (_, index) => ({
                id: index + 2,
                number: index + 2,
                status: 'Libre'
            }));
            
            setMesas(mesasDefault);
            setModalMesaOpen(true);
        } finally {
            setLoadingMesas(false);
        }
    };

    useEffect(() => {
        let interval;
        if (subscriptionError && redirectCountdown > 0) {
            interval = setInterval(() => {
                setRedirectCountdown(prev => prev - 1);
            }, 1000);
        } else if (subscriptionError && redirectCountdown === 0) {
            // Verificar si debe redirigir a user o payments
            const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
            if (mesasData.max_mesas === 1 && 
                mesasData.table_status && 
                Object.keys(mesasData.table_status).length === 1 &&
                mesasData.table_status["1"] === "Libre") {
                router.push('/user');
            } else {
                router.push('/payments');
            }
        }
        
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [subscriptionError, redirectCountdown, router]);

    const redirectToPayments = () => {
        router.push('/payments');
    };

    useEffect(() => {
        const carritoGuardado = localStorage.getItem("carrito1");
        const historialGuardado = localStorage.getItem("historialPedidos1");
        const ordenActivaGuardada = localStorage.getItem("ordenActiva1");

        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }
        if (historialGuardado) {
            setHistorialPedidos(JSON.parse(historialGuardado));
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
        localStorage.setItem("carrito1", JSON.stringify(carrito));
    }, [carrito]);

    useEffect(() => {
        localStorage.setItem("historialPedidos1", JSON.stringify(historialPedidos));
    }, [historialPedidos]);

    useEffect(() => {
        if (ordenActiva) {
            localStorage.setItem("ordenActiva1", JSON.stringify(ordenActiva));
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
                setMensajeError('Error al cargar los productos. Mostrando menú estático.');
                setProductos(productosEstaticos);
                setProductosFiltrados(productosEstaticos);
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.menu-container') && !event.target.closest('.hamburger-button')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        setProductosFiltrados(
            categoriaSeleccionada === "Todos los platillos"
                ? productos
                : productos.filter(producto => producto.categoria === categoriaSeleccionada)
        );
    }, [categoriaSeleccionada, productos]);

    useEffect(() => {
        const filtradosPorCategoria = categoriaSeleccionada === "Todos los platillos"
            ? productos
            : productos.filter(producto => producto.categoria === categoriaSeleccionada);
        
        if (busqueda.trim() !== "") {
            const terminoBusqueda = busqueda.toLowerCase().trim();
            const resultadosFiltrados = filtradosPorCategoria.filter(producto => 
                (producto.nombre || producto.name || "").toLowerCase().includes(terminoBusqueda) || 
                (producto.descripcion || producto.description || "").toLowerCase().includes(terminoBusqueda) ||
                (producto.categoria || "").toLowerCase().includes(terminoBusqueda)
            );
            setProductosFiltrados(resultadosFiltrados);
        } else {
            setProductosFiltrados(filtradosPorCategoria);
        }
    }, [categoriaSeleccionada, productos, busqueda]);

    const handleLogin = async (values, { setSubmitting }) => {
        setServerError('');
        setIsLoading(true);
        try {
            const response = await loginUser(values);

            if (response.ok) {
                const data = await response.json();

                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                    setLoginModalOpen(false);
                    setServerError('');
                    setIsAuthenticated(true);
                } else {
                    setServerError('No se recibió un token válido. Por favor, intenta nuevamente.');
                }
            } else {
                setServerError('Usuario y/o contraseña incorrectos. Por favor, verifica tus credenciales.');
            }
        } catch (error) {
            setServerError('Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.');
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    const loginValidationSchema = Yup.object({
        email: Yup.string().email('Correo electrónico inválido').required('Correo electrónico es requerido'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida'),
    });

    const transformarProductos = (productosAPI) => {
        return productosAPI.map(producto => ({
            id: producto.id_products,
            id_products: producto.id_products,
            nombre: producto.name,
            name: producto.name,
            precio: parseFloat(producto.price),
            price: parseFloat(producto.price),
            descripcion: producto.description,
            description: producto.description,
            categoria: producto.category_name || producto.nombre_categoria,
            imagen: producto.image_url && producto.image_url.length > 0
                ? producto.image_url[0]
                : kime,
            ingredientes: producto.ingredientes || [],
            status: producto.status,
            cantidad: 1
        }));
    };

    const openModal = (producto) => {
        setProductoSeleccionado(producto);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setProductoSeleccionado(null);
    };

    const agregarAlCarrito = (producto, comentario = "", ingredientesExcluidos = []) => {
        const ingredientesExcluidosModal = producto.ingredientes && producto.ingredientes.length > 0
            ? Array.from(
                document.querySelectorAll('input[type="checkbox"]:checked')
            ).map((checkbox) => checkbox.nextSibling.textContent.replace("Sin ", "").trim())
            : ingredientesExcluidos;

        const productoConExclusiones = {
            ...producto,
            id: `${producto.id || producto.id_products}-${ingredientesExcluidosModal.join(",")}-${comentario}`,
            id_products: producto.id_products || producto.id,
            ingredientesExcluidos: ingredientesExcluidosModal,
            comentario: comentario,
        };

        setCarrito((prevCarrito) => {
            const existingItemIndex = prevCarrito.findIndex(
                (item) => item.id === productoConExclusiones.id
            );

            if (existingItemIndex !== -1) {
                const updatedCarrito = [...prevCarrito];
                updatedCarrito[existingItemIndex].cantidad += (producto.cantidad || 1);
                return updatedCarrito;
            } else {
                return [...prevCarrito, { ...productoConExclusiones, cantidad: producto.cantidad || 1 }];
            }
        });

        closeModal();
    };

    const calcularTotal = () => {
        if (!carrito || carrito.length === 0) {
            return "0.00";
        }
        return carrito.reduce((total, item) => {
            const precio = item.precio || item.price || 0;
            return total + precio * item.cantidad;
        }, 0).toFixed(2);
    };

    const realizarPedido = async () => {
        if (carrito.length === 0) {
            setMensajeError("No puedes seguir porque no hay artículos en tu carrito");
            return;
        }

        if (!numeroMesa) {
            setMensajeError("Debes seleccionar una mesa antes de realizar el pedido");
            return;
        }

        setIsCreatingOrder(true);
        setMensajeError("");

        try {
            const productosParaOrden = carrito.map(item => ({
                id: item.id_products || item.id.split('-')[0],
                cantidad: item.cantidad
            }));

            const ordenUuid = ordenActiva ? ordenActiva.order_uuid : null;
            const response = await createSimpleClientOrder(
                productosParaOrden, 
                parseInt(numeroMesa),
                ordenUuid
            );

            if (!ordenActiva && numeroMesa) {
                try {
                    await updateTableStatus(parseInt(numeroMesa), 'Ocupado');
                } catch (error) {
                    console.error('Error al cambiar mesa a Ocupado:', error);
                }
            }

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
            await cargarTotalFinal(response.order_uuid);
            setMensajeError("¡Orden enviada exitosamente!");
            
            setTimeout(() => {
                setMensajeError("");
            }, 3000);

        } catch (error) {
            console.error('Error al crear la orden:', error);
            setMensajeError(`Error al enviar la orden: ${error.message}`);
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const terminarOrden = async () => {
        if (historialPedidos.length === 0) {
            setMensajeError("No hay pedidos para finalizar. Realiza al menos un pedido primero.");
            return;
        }

        if (ordenActiva && ordenActiva.order_uuid) {
            try {
                const ticketData = await getTicket(ordenActiva.order_uuid);
                
                if (ticketData.order_status === "Cancelado") {
                    setShowCancelledOrderModal(true);
                    return;
                }
                
                setTotalPedidos(totalFinal > 0 ? totalFinal.toFixed(2) : "0.00");
                setModalTotalOpen(true);
                setMensajeError("");
                
            } catch (error) {
                console.error('Error al verificar el estado de la orden:', error);
                setMensajeError("Error al verificar el estado de la orden. Intenta nuevamente.");
                return;
            }
        } else {
            setTotalPedidos(totalFinal > 0 ? totalFinal.toFixed(2) : "0.00");
            setModalTotalOpen(true);
            setMensajeError("");
        }
    };

    // Limpiar snapshot cuando se termina/cancela orden
    const limpiarOrdenCancelada = async () => {
        try {
            if (numeroMesa) {
                try {
                    await updateTableStatus(parseInt(numeroMesa), 'NoDisponible');
                    // console.log(`Mesa ${numeroMesa} cambiada a NoDisponible`);
                } catch (error) {
                    console.error('Error al cambiar mesa a NoDisponible:', error);
                }
            }
            
            setHistorialPedidos([]);
            setOrdenActiva(null);
            setTotalFinal(0);
            setCarrito([]);
            
            localStorage.removeItem("ordenActiva1");
            localStorage.removeItem("historialPedidos1");
            localStorage.removeItem("carrito1");
            localStorage.removeItem("productosCanceladosSnapshot1"); // Limpiar snapshot
            
            setShowCancelledOrderModal(false);
            
            setMensajeError("Los datos de la orden cancelada han sido limpiados.");
            setTimeout(() => {
                setMensajeError("");
            }, 3000);
            
        } catch (error) {
            console.error('Error al limpiar orden cancelada:', error);
            setMensajeError("Error al procesar la limpieza. Algunos datos pueden no haberse actualizado correctamente.");
            setTimeout(() => {
                setMensajeError("");
            }, 3000);
        }
    };

    // También limpiar snapshot cuando se confirma el pago
    const confirmarPago = async () => {
        if (!ordenActiva || !ordenActiva.order_uuid) {
            setMensajeError("No hay una orden activa para finalizar.");
            return;
        }

        if (isProcessingPayment) return;

        setIsProcessingPayment(true);
        setMensajeError("");

        try {
            const currentOrderUuid = ordenActiva.order_uuid;
            const response = await endOrder(currentOrderUuid, metodoPago);
            
            if (response && (response.success !== false)) {
                if (numeroMesa) {
                    try {
                        await updateTableStatus(parseInt(numeroMesa), 'NoDisponible');
                    } catch (error) {
                        console.error('Error al cambiar mesa a NoDisponible:', error);
                    }
                }
                
                setHistorialPedidos([]);
                setOrdenActiva(null);
                setTotalFinal(0);
                localStorage.removeItem("ordenActiva1");
                localStorage.removeItem("historialPedidos1");
                localStorage.removeItem("carrito1");
                localStorage.removeItem("productosCanceladosSnapshot1");
                
                setModalTotalOpen(false);
                setMetodoPago('efectivo');
                setCodigoConfirmacion('');
                
                setMensajeError("¡Pago procesado exitosamente!");
                
                const ticketsEnabled = localStorage.getItem('tickets');
                if (ticketsEnabled === 'true') {
                    setCompletedOrderUuid(currentOrderUuid);
                    setShowTicketModal(true);
                }
                
                setTimeout(() => {
                    setMensajeError("");
                }, 3000);
            } else {
                throw new Error(response?.message || 'La API indicó que el pago no se pudo procesar');
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            let mensajeErrorUsuario = "Error al procesar el pago. ";
            if (error.message && error.message.includes('fetch')) {
                mensajeErrorUsuario += "Problemas de conexión. Verifica tu internet e intenta nuevamente.";
            } else if (error.message && error.message.includes('token')) {
                mensajeErrorUsuario += "Sesión expirada. Por favor, inicia sesión nuevamente.";
            } else if (error.message && error.message.includes('404')) {
                mensajeErrorUsuario += "Orden no encontrada. Contacta con el administrador.";
            } else if (error.message && error.message.includes('500')) {
                mensajeErrorUsuario += "Error del servidor. Intenta nuevamente en unos momentos.";
            } else {
                mensajeErrorUsuario += error.message || "Error desconocido. Intenta nuevamente.";
            }
            setMensajeError(mensajeErrorUsuario);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const categorias = ["Todos los platillos", ...new Set(productos.map(p => p.categoria))];

    if (loading && isAuthenticated) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
                <div className="text-lg text-green-700 font-bold">Cargando productos...</div>
            </div>
        );
    }

    return (
        <div className="h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-green-50">
            <header className="relative z-10">
                <nav className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-4 shadow-lg">
                    <div className="flex items-center max-w-7xl mx-auto justify-between">
                        <div className="flex items-center">
                            <h1 className="text-3xl font-bold ml-2 text-white">WapiFood</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {numeroMesa ? (
                                <div 
                                    className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-lg cursor-pointer hover:bg-green-200 transition-colors border border-green-300 shadow"
                                    onClick={handleClickMesa}
                                    title="Click para cambiar de mesa"
                                >
                                    <MdTableRestaurant className="text-green-600" size={20} />
                                    <span className="text-sm font-medium text-green-800">
                                        Mesa {numeroMesa}
                                    </span>
                                </div>
                            ) : (
                                <div className="text-xs text-green-100">Sin mesa</div>
                            )}
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

            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-green-100 to-emerald-100 shadow-2xl border-r border-green-200
                    transition-transform duration-300 ease-in-out menu-container z-20
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <ul className="flex flex-col mt-16 p-4 text-xl">
                    <p className="text-green-700 font-bold mb-2">Menú principal</p>
                    {categorias.map((categoria, index) => (
                        <li
                            key={index}
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
                </ul>
            </div>

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

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12 relative z-10">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados
                        .sort((a, b) => {
                            const ordenA = categoriaOrden[a.categoria] ?? Number.MAX_SAFE_INTEGER;
                            const ordenB = categoriaOrden[b.categoria] ?? Number.MAX_SAFE_INTEGER;
                            return ordenA - ordenB;
                        })
                        .map((producto) => (
                            <div
                                key={producto.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={producto.imagen}
                                        alt={`Imagen de ${producto.nombre}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        width={300}
                                        height={200}
                                    />
                                    {producto.status === "activo" ? (
                                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow">
                                            Disponible
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow">
                                                No Disponible
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                        <span className="text-lg font-bold text-green-600">
                                            ${producto.precio.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="mb-3 flex justify-between items-center">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{producto.nombre}</h3>
                                        <span className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                                            {producto.categoria}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[3rem]">
                                        {producto.descripcion.length > 80
                                            ? `${producto.descripcion.slice(0, 80)}...`
                                            : producto.descripcion}
                                    </p>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 rounded-lg flex items-center justify-center font-bold transition-colors border border-green-200"
                                                onClick={() => {
                                                    setProductosFiltrados((prevProductos) =>
                                                        prevProductos.map((item) =>
                                                            item.id === producto.id
                                                                ? { ...item, cantidad: Math.max((item.cantidad || 1) - 1, 1) }
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
                                                className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 rounded-lg flex items-center justify-center font-bold transition-colores border border-green-200"
                                                onClick={() => {
                                                    setProductosFiltrados((prevProductos) =>
                                                        prevProductos.map((item) =>
                                                            item.id === producto.id
                                                                ? { ...item, cantidad: (item.cantidad || 1) + 1 }
                                                                : item
                                                        )
                                                    );
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            className={`bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer font-semibold shadow-lg transition-all duration-200 ${
                                                producto.status !== "activo" ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                            onClick={() => agregarAlCarrito(producto)}
                                            disabled={producto.status !== "activo"}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            className="flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm cursor-pointer w-full font-semibold shadow gap-2"
                                            onClick={() => openModal(producto)}
                                            disabled={producto.status !== "activo"}
                                        >
                                            <FaRegEye className="h-[20px] w-[20px]" />Ver detalles
                                        </button>
                                    </div>
                                </div>
                            </div>
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

            {modalMesaOpen && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[1001]">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                        {loadingMesas ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
                                <p className="ml-4 text-gray-600">Cargando mesas...</p>
                            </div>
                        ) : subscriptionError ? (
                            <>
                                <div className='text-green-500 text-4xl flex justify-center mb-4'>
                                    <div className='bg-green-500 text-white p-3 rounded-lg shadow-lg'>
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </div>
                                </div>
                                <h2 className="text-2xl text-center font-bold text-green-600 mb-2">
                                    {/* Verificar qué mensaje mostrar basado en la respuesta de la API */}
                                    {(() => {
                                        const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
                                        if (mesasData.max_mesas === 1 && 
                                            mesasData.table_status && 
                                            Object.keys(mesasData.table_status).length === 1 &&
                                            mesasData.table_status["1"] === "Libre") {
                                            return "Función No Disponible";
                                        } else {
                                            return "Suscripción Requerida";
                                        }
                                    })()}
                                </h2>
                                <p className='text-center text-gray-600 mb-6'>
                                    {(() => {
                                        const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
                                        if (mesasData.max_mesas === 1 && 
                                            mesasData.table_status && 
                                            Object.keys(mesasData.table_status).length === 1 &&
                                            mesasData.table_status["1"] === "Libre") {
                                            return "Su paquete contratado no cuenta con esta función";
                                        } else {
                                            return "Favor de actualizar o realizar su pago";
                                        }
                                    })()}
                                </p>
                                
                                <div className="flex flex-col items-center gap-4 mb-6">
                                    <div className="relative w-20 h-20">
                                        <div className="w-20 h-20 rounded-full border-4 border-green-200"></div>
                                        <div 
                                            className="absolute inset-0 w-20 h-20 rounded-full border-4 border-green-500 border-t-transparent transition-transform duration-1000"
                                            style={{
                                                transform: `rotate(${(10 - redirectCountdown) * 36}deg)`,
                                                transition: 'transform 1s linear'
                                            }}
                                        ></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-green-600">{redirectCountdown}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 text-center">
                                        Redirigiendo automáticamente en {redirectCountdown} segundos...
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colores font-semibold shadow-lg"
                                        onClick={() => {
                                            const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
                                            if (mesasData.max_mesas === 1 && 
                                                mesasData.table_status && 
                                                Object.keys(mesasData.table_status).length === 1 &&
                                                mesasData.table_status["1"] === "Libre") {
                                                router.push('/user');
                                            } else {
                                                router.push('/payments');
                                            }
                                        }}
                                    >
                                        {(() => {
                                            const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
                                            if (mesasData.max_mesas === 1 && 
                                                mesasData.table_status && 
                                                Object.keys(mesasData.table_status).length === 1 &&
                                                mesasData.table_status["1"] === "Libre") {
                                                return "👤 Ir a Perfil de Usuario";
                                            } else {
                                                return "💳 Ir a Pagos Ahora";
                                            }
                                        })()}
                                    </button>
                                </div>
                                
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-xs text-green-700 text-center">
                                        {(() => {
                                            const mesasData = JSON.parse(localStorage.getItem('lastMesasResponse') || '{}');
                                            if (mesasData.max_mesas === 1 && 
                                                mesasData.table_status && 
                                                Object.keys(mesasData.table_status).length === 1 &&
                                                mesasData.table_status["1"] === "Libre") {
                                                return "Su paquete actual no incluye la gestión de múltiples mesas. Para acceder a esta funcionalidad, actualice su plan desde su perfil de usuario.";
                                            } else {
                                                return "Su suscripción ha expirado o no es válida. Para continuar usando el sistema, debe renovar o adquirir una suscripción activa.";
                                            }
                                        })()}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='text-[#3fe283] text-4xl flex justify-center mb-4'>
                                    <div className='bg-[#3fe283] text-white p-2 rounded-lg'>
                                        <MdTableRestaurant size={32} />
                                    </div>
                                </div>
                                <h2 className="text-2xl text-center font-bold text-black mb-2">Elija número de mesa</h2>
                                <p className='text-center text-gray-600 mb-4'>
                                    Seleccione una mesa disponible ({mesas.length} mesas libres)
                                </p>
                                
                                {mensajeError && (
                                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">{mensajeError}</p>
                                    </div>
                                )}
                                
                                {mesas.length === 0 ? (
                                    <div className="text-center">
                                        <p className="text-green-600 mb-4">No hay mesas disponibles en este momento</p>
                                        <button
                                            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colores"
                                            onClick={() => setModalMesaOpen(false)}
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <div className='flex flex-col gap-2'>
                                            <label className="text-sm font-medium text-gray-700">
                                                Seleccionar Mesa Disponible
                                            </label>
                                            <select 
                                                className="p-3 border border-gray-300 rounded-lg w-full text-lg"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        seleccionarMesa(e.target.value);
                                                    }
                                                }}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>
                                                    -- Seleccione una mesa --
                                                </option>
                                                {mesas.map((mesa) => (
                                                    <option key={`mesa-${mesa.id}`} value={mesa.number}>
                                                        Mesa {mesa.number} - Disponible
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="text-center text-sm text-gray-500">
                                            Solo se muestran las mesas disponibles
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {showCancelledOrderModal && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[10000]">
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg">
                        <div className="text-center">
                            <div className="mb-4">
                                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-4 text-green-600">Orden Cancelada</h2>
                            <p className="text-gray-700 mb-6">
                                La orden ha sido cancelada desde cocina. No es posible procesar el pago.
                                Se limpiarán todos los datos relacionados con esta orden.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={limpiarOrdenCancelada}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loginModalOpen && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[1000]">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                <div className='text-[#3fe283] text-4xl flex justify-center mb-4'>
                                    <div className='bg-[#3fe283] text-white p-2 rounded-lg'>
                                        <GoChecklist size={32} />
                                    </div>
                                </div>
                                <h2 className="text-2xl text-center font-bold text-black mb-2">Iniciar Sesión</h2>
                                <p className='text-center text-gray-600 mb-4'>Ingresa tus credenciales para acceder al menú</p>
                                
                                <Formik
                                    initialValues={{
                                        email: '',
                                        password: '',
                                    }}
                                    validationSchema={loginValidationSchema}
                                    onSubmit={handleLogin}
                                >
                                    {({ isSubmitting }) => (
                                        <Form className="flex flex-col gap-4">
                                            {serverError && (
                                                <div className="text-red-500 text-sm mb-2 text-center">
                                                    {serverError}
                                                </div>
                                            )}

                                            <div className='flex flex-col gap-2'>
                                                <label>Correo electrónico</label>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    placeholder="Correo electrónico"
                                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                                />
                                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>
                                            
                                            <div className='flex flex-col gap-2'>
                                                <label>Contraseña</label>
                                                <Field
                                                    type="password"
                                                    name="password"
                                                    placeholder="Contraseña"
                                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                                />
                                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>
                                            
                                            <button
                                                type="submit"
                                                className="bg-[#3fe283] text-white p-2 rounded-lg hover:bg-green-600 transition-colores"
                                                disabled={isSubmitting}
                                            >
                                                Iniciar Sesión
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </>
                        )}
                    </div>
                </div>
            )}

            {modalOrdenActivaOpen && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[1003]">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-green-200 w-full max-w-md mx-4">
                        <div className='flex justify-center mb-4'>
                            <div className='bg-gradient-to-r from-green-400 to-emerald-400 text-white p-3 rounded-full shadow-lg'>
                                <MdTableRestaurant size={36} />
                            </div>
                        </div>
                        <h2 className="text-2xl text-center font-bold text-green-700 mb-2">
                            No se puede cambiar de mesa
                        </h2>
                        <p className='text-center text-gray-600 mb-6'>
                            No se puede cambiar la mesa porque tienes una orden activa.<br />
                            Por favor, termina la orden para poder cambiar de mesa.
                        </p>
                        {ordenActiva && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800 text-center">
                                    <strong>Orden Activa:</strong> {ordenActiva.order_uuid.slice(0, 8)}...
                                </p>
                                <p className="text-sm text-yellow-800 text-center">
                                    <strong>Estado:</strong> {ordenActiva.order_status || 'Activa'}
                                </p>
                            </div>
                        )}
                        <div className="flex gap-3 mt-2">
                            <button
                                className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colores font-semibold"
                                onClick={() => setModalOrdenActivaOpen(false)}
                            >
                                Entendido
                            </button>
                            <button
                                className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colores font-semibold"
                                onClick={() => {
                                    setModalOrdenActivaOpen(false);
                                    terminarOrden();
                                }}
                            >
                                Terminar Orden
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalCambioMesaOpen && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[1002]">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                        {procesandoCambioMesa ? (
                            <div className="flex flex-col justify-center items-center h-32">
                                <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin mb-4"></div>
                                <p className="text-gray-600">Procesando...</p>
                            </div>
                        ) : (
                            <>
                                <div className='flex justify-between items-start mb-4 relative'>
                                    <div className='text-[#3fe283] text-4xl flex justify-center w-full'>
                                        <div className='bg-[#3fe283] text-white p-2 rounded-lg'>
                                            <MdTableRestaurant size={32} />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0">
                                        <button
                                            onClick={toggleFullscreen}
                                            className="z-50 cursor-pointer bg-white/20 rounded-full p-2 shadow-lg border border-green-200 hover:bg-white/40 transition-all duration-200"
                                            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                                            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                        >
                                            {isFullscreen ? (
                                                <MdFullscreenExit className="w-6 h-6 text-black"/>
                                            ) : (
                                                <MdFullscreen className="w-6 h-6 text-black"/>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <h2 className="text-2xl text-center font-bold text-black mb-2">Cambiar Mesa</h2>
                                <p className='text-center text-gray-600 mb-4'>
                                    Ingrese código de 4 dígitos para cambiar el número de mesa o cerrar sesión
                                </p>
                                
                                <div className="flex flex-col gap-4">
                                    <div className='flex flex-col gap-2'>
                                        <label className="text-sm font-medium text-gray-700 text-center">
                                            Código de Seguridad
                                        </label>
                                        <input
                                            type="text"
                                            value={codigoCambioMesa}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d{0,4}$/.test(value)) {
                                                    setCodigoCambioMesa(value);
                                                    if (errorCodigoMesa) {
                                                        setErrorCodigoMesa('');
                                                    }
                                                }
                                            }}
                                            placeholder="****"
                                            maxLength="4"
                                            className="p-3 border border-gray-300 rounded-lg w-full text-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            autoFocus
                                        />
                                        
                                        {errorCodigoMesa && (
                                            <p className="text-red-500 text-sm text-center mt-1">
                                                {errorCodigoMesa}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button
                                            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colores"
                                            onClick={() => {
                                                setModalCambioMesaOpen(false);
                                                setCodigoCambioMesa('');
                                                setErrorCodigoMesa('');
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className={`flex-1 py-2 px-4 rounded-lg transition-colores ${
                                                codigoCambioMesa.length === 4
                                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                            onClick={confirmarCambioMesa}
                                            disabled={codigoCambioMesa.length !== 4}
                                        >
                                            Cambiar Mesa
                                        </button>
                                    </div>
                                    
                                    <button
                                        className={`w-full py-2 px-4 rounded-lg transition-colores ${
                                            codigoCambioMesa.length === 4
                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                        onClick={cerrarSesion}
                                        disabled={codigoCambioMesa.length !== 4}
                                    >
                                        Cerrar Sesión
                                    </button>
                                    
                                    <div className="text-center text-xs text-gray-500">
                                        Al cambiar de mesa, la mesa actual quedará disponible.<br/>
                                        Al cerrar sesión se liberará la mesa y perderás todos los datos.
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {carritoModalOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/50 z-[9998] flex justify-end items-stretch"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setCarritoModalOpen(false);
                        }
                    }}
                >
                    <div className="bg-white w-3/4 h-full sm:w-96 sm:h-screen flex flex-col shadow-2xl border border-gray-200 rounded-l-2xl sm:rounded-none sm:border-l overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 text-white rounded-tl-2xl sm:rounded-none">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                                    <FaShoppingCart className="text-base sm:text-xl" />
                                    Tu Pedido
                                </h2>
                                <button
                                    onClick={() => setCarritoModalOpen(false)}
                                    className="text-white hover:text-gray-200 transition-colores p-1 rounded-full hover:bg-white/20"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                            {carrito.length > 0 ? (
                                <div className="mb-4 sm:mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Productos en carrito
                                    </h3>
                                    <div className="max-h-36 sm:max-h-48 overflow-y-auto space-y-2 sm:space-y-3">
                                        {carrito.map((item) => (
                                            <div key={item.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-2 sm:p-4 border border-green-100 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-green-800 text-xs sm:text-base truncate">
                                                            {item.nombre || item.name}
                                                        </p>
                                                        {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                            <p className="text-xs text-green-700">
                                                                Sin: {item.ingredientesExcluidos.join(", ")}
                                                            </p>
                                                        )}
                                                        {item.comentario && (
                                                            <p className="text-xs text-green-700">
                                                                Nota: {item.comentario}
                                                            </p>
                                                        )}
                                                        <p className="text-xs sm:text-sm text-green-600">
                                                            ${parseFloat(item.precio || item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                                                        </p>
                                                    </div>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 transition-colores ml-2 flex-shrink-0 p-1"
                                                        onClick={() => {
                                                            setCarrito((prevCarrito) =>
                                                                prevCarrito.filter((producto) => producto.id !== item.id)
                                                            );
                                                        }}
                                                    >
                                                        <IoTrashOutline className="text-base sm:text-lg" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <button
                                                        className="bg-green-200 hover:bg-green-300 text-green-800 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold transition-colores text-sm"
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
                                                    <span className="text-base sm:text-lg font-bold text-green-800 min-w-[1.5rem] sm:min-w-[2rem] text-center">{item.cantidad}</span>
                                                    <button
                                                        className="bg-green-200 hover:bg-green-300 text-green-800 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold transition-colores text-sm"
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
                                <div className="text-center py-6 sm:py-8">
                                                                       <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                        <FaShoppingCart className="text-gray-400 text-lg sm:text-xl" />
                                    </div>
                                    <p className="text-gray-500 text-sm sm:text-base">Tu carrito está vacío</p>
                                </div>
                            )}

                            {carrito.length > 0 && (
                                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-green-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm sm:text-lg font-bold text-green-800">Total del carrito:</span>
                                        <span className="text-base sm:text-xl font-bold text-green-600">
                                            ${calcularTotal()}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {historialPedidos.length > 0 && (
                                <div className="mt-6 sm:mt-8">
                                    <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                        Historial de Pedidos
                                    </h3>
                                    <div className="max-h-36 sm:max-h-48 overflow-y-auto space-y-2 sm:space-y-3">
                                        {historialPedidos.map((item, index) => {
                                            const nombreCorto = (item.nombre || item.name).length > 16 
                                                ? `${(item.nombre || item.name).substring(0, 16)}...` 
                                                : (item.nombre || item.name);
                                            
                                            return (
                                                <div key={index} className={`rounded-xl p-2 sm:p-4 border shadow-sm ${
                                                    item.estado === 'Preparado' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
                                                    item.estado === 'Cancelado' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' :
                                                    'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                                                }`}>
                                                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`font-bold text-xs sm:text-base ${
                                                                item.estado === 'Preparado' ? 'text-green-800' :
                                                                item.estado === 'Cancelado' ? 'text-red-800' :
                                                                'text-yellow-800'
                                                            }`} title={`${item.cantidad} x ${item.nombre || item.name}`}>
                                                                {item.cantidad} x {nombreCorto}
                                                            </p>
                                                            {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                                <p className={`text-xs ${
                                                                    item.estado === 'Preparado' ? 'text-green-700' :
                                                                    item.estado === 'Cancelado' ? 'text-red-700' :
                                                                    'text-yellow-700'
                                                                }`}>
                                                                    Sin: {item.ingredientesExcluidos.join(", ")}
                                                                </p>
                                                            )}
                                                            {item.comentario && (
                                                                <p className={`text-xs ${
                                                                    item.estado === 'Preparado' ? 'text-green-700' :
                                                                    item.estado === 'Cancelado' ? 'text-red-700' :
                                                                    'text-yellow-700'
                                                                }`}>
                                                                    Nota: {item.comentario}
                                                                </p>
                                                            )}
                                                            <p className={`text-xs ${
                                                                item.estado === 'Preparado' ? 'text-green-600' :
                                                                item.estado === 'Cancelado' ? 'text-red-600 line-through' :
                                                                'text-yellow-600'
                                                            }`}>
                                                                ${parseFloat(item.precio || item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                                                            </p>
                                                        </div>
                                                        <div className="ml-2 flex-shrink-0">
                                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                                                                item.estado === 'Preparado' ? 'bg-green-500 text-white' :
                                                                item.estado === 'Cancelado' ? 'bg-red-500 text-white' :
                                                                'bg-yellow-500 text-white'
                                                            }`}>
                                                                {item.estado === 'Preparado' ? '✅ Listo' :
                                                                 item.estado === 'Cancelado' ? '❌ Cancelado' :
                                                                 '⏱️ Pendiente'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {totalFinal > 0 && (
                                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 sm:p-4 mt-3 sm:mt-4 border border-yellow-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-yellow-800 text-sm sm:text-base">Total Final:</span>
                                        <span className="text-sm sm:text-lg font-bold text-yellow-600">
                                            ${totalFinal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-3 sm:p-6 bg-white border-t border-gray-200 rounded-bl-2xl sm:rounded-none">
                            {mensajeError && (
                                <div className={`p-2 sm:p-4 rounded-xl mb-3 sm:mb-4 text-xs sm:text-sm font-medium ${
                                    mensajeError.includes('exitosamente') 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-green-100 text-green-800 border border-green-200'
                                }`}>
                                    {mensajeError}
                                </div>
                            )}

                            <button
                                className={`w-full py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 text-xs sm:text-base ${
                                    isCreatingOrder 
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105'
                                }`}
                                onClick={realizarPedido}
                                disabled={isCreatingOrder}
                            >
                                {isCreatingOrder ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                        </svg>
                                        Enviando...
                                    </span>
                                ) : ordenActiva ? 'Agregar a la orden' : 'Realizar Pedido'}
                            </button>

                            {(historialPedidos.length > 0 || ordenActiva) && (
                                <button
                                    className="w-full py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 mt-2 sm:mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg transform hover:scale-105 text-xs sm:text-base"
                                    onClick={terminarOrden}
                                >
                                    💳 Terminar Orden
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Confirmar Pago</h2>
                        </div>

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

                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 mb-6 border border-green-200">
                            <div className="text-center">
                                <p className="text-lg text-green-700 mb-1">
                                    Total a pagar:
                                </p>
                                <p className="text-3xl font-bold text-green-600">
                                    ${parseFloat(totalPedidos).toFixed(2)}
                                </p>
                                <p className="text-sm text-green-700 mt-2">
                                    Método: <span className="font-semibold capitalize">{metodoPago}</span>
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-center p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    El cobro será procesado por un empleado en el punto de venta. No se requiere código aquí.
                                </p>
                            </div>
                        </div>

                        {mensajeError && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${
                                mensajeError.includes('exitosamente') 
                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                    : 'bg-green-100 text-green-800 border border-green-200'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {mensajeError.includes('exitosamente') ? (
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    )}
                                    {mensajeError}
                                </div>
                            </div>
                        )}

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

                            {mensajeError && !mensajeError.includes('exitosamente') && (
                                <button
                                    className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colores"
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

            {modalOpen && productoSeleccionado && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="bg-white rounded-2xl w-11/12 md:w-96 shadow-2xl border border-green-100 max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">{productoSeleccionado.nombre || productoSeleccionado.name}</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-white hover:text-gray-200 transition-colores"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <Image
                                    src={productoSeleccionado.imagen}
                                    alt={`Imagen de ${productoSeleccionado.nombre || productoSeleccionado.name}`}
                                    className="w-full h-48 object-cover rounded-xl border border-green-100 shadow-sm"
                                    width={400}
                                    height={300}
                                />
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                                <p className="text-gray-600 leading-relaxed">{productoSeleccionado.descripcion}</p>
                            </div>

                            {productoSeleccionado.ingredientes && productoSeleccionado.ingredientes.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalizar</h3>
                                    <div className="space-y-2">
                                        {productoSeleccionado.ingredientes.map((ingrediente, index) => (
                                            <label key={index} className="flex items-center py-2 px-4 bg-green-50 rounded-lg border border-green-100">
                                                <input type="checkbox" className="w-4 h-4 text-green-600 rounded border-green-300 focus:ring-green-500" />
                                                <span className="ml-3 text-gray-700">Sin {ingrediente}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-6 border border-green-200">
                                <div className="text-center">
                                    <p className="text-lg text-green-700 mb-1">Precio:</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ${((productoSeleccionado.cantidad || 1) * (productoSeleccionado.precio || 0)).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center mb-6">
                                <button
                                    className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 rounded-lg flex items-center justify-center font-bold text-xl transition-colores border border-green-200"
                                    onClick={() =>
                                        setProductoSeleccionado({
                                            ...productoSeleccionado,
                                            cantidad: Math.max((productoSeleccionado.cantidad || 1) - 1, 1),
                                        })
                                    }
                                >
                                    -
                                </button>
                                <span className="mx-6 text-2xl font-bold text-gray-800">{productoSeleccionado.cantidad || 1}</span>
                                <button
                                    className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 rounded-lg flex items-center justify-center font-bold text-xl transition-colores border border-green-200"
                                    onClick={() =>
                                        setProductoSeleccionado({
                                            ...productoSeleccionado,
                                            cantidad: (productoSeleccionado.cantidad || 1) + 1,
                                        })
                                    }
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                                onClick={() => {
                                    agregarAlCarrito(productoSeleccionado);
                                }}
                            >
                                🛒 Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <TicketModal
                isOpen={showTicketModal}
                onClose={() => {
                    setShowTicketModal(false);
                    setCompletedOrderUuid(null);
                }}
                orderUuid={completedOrderUuid}
            />

            {modalProductosCanceladosOpen && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[10001]">
                    <div className="bg-white rounded-2xl p-8 w-11/12 md:w-2/3 lg:w-1/2 max-w-2xl shadow-2xl border border-red-200 max-h-[90vh] overflow-y-auto">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-2 text-red-600">¡Atención!</h2>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Productos No Disponibles</h3>
                            <p className="text-gray-600 mb-6">
                                Lamentamos informarte que los siguientes productos no pudieron ser preparados y han sido excluidos de tu orden:
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {productosCancelados.map((producto, index) => (
                                <div key={index} className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200 shadow-lg">
                                    <div className="flex justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </div>
                                                <h4 className="text-lg font-bold text-red-800">
                                                    {producto.cantidad} x {producto.nombre}
                                                </h4>
                                            </div>
                                            {producto.ingredientesExcluidos && producto.ingredientesExcluidos.length > 0 && (
                                                <p className="text-sm text-red-700 mb-1">
                                                    Sin: {producto.ingredientesExcluidos.join(", ")}
                                                </p>
                                            )}
                                            {producto.comentario && (
                                                <p className="text-sm text-red-700 mb-1">
                                                    Nota: {producto.comentario}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-red-600 line-through">
                                                ${parseFloat(producto.precio * producto.cantidad).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-red-500">No disponible</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-blue-800">¿Qué puedes hacer?</h4>
                            </div>
                            <ul className="text-blue-700 space-y-2">
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Tu orden sigue activa y puedes agregar más productos
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    El total se ha actualizado automáticamente
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Los productos restantes se están preparando normalmente
                                </li>
                            </ul>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => {
                                    setModalProductosCanceladosOpen(false);
                                    setProductosCancelados([]);
                                }}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                                ✓ Entendido, continuar
                            </button>
                        </div>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            Disculpa las molestias. Nuestro equipo trabaja para ofrecerte la mejor experiencia.
                        </div>
                    </div>
                </div>
            )}

            {modalExitFullscreenOpen && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[1004]">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                        {procesandoExitFullscreen ? (
                            <div className="flex flex-col justify-center items-center h-32">
                                <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin mb-4"></div>
                                <p className="text-gray-600">Procesando...</p>
                            </div>
                        ) : (
                            <>
                                <div className='text-red-500 text-4xl flex justify-center mb-4'>
                                    <div className='bg-red-500 text-white p-2 rounded-lg'>
                                        <MdFullscreenExit size={32} />
                                    </div>
                                </div>
                                <h2 className="text-2xl text-center font-bold text-black mb-2">Salir de Pantalla Completa</h2>
                                <p className='text-center text-gray-600 mb-4'>
                                    Ingrese código de 4 dígitos para salir del modo pantalla completa
                                </p>
                                
                                <div className="flex flex-col gap-4">
                                    <div className='flex flex-col gap-2'>
                                        <label className="text-sm font-medium text-gray-700 text-center">
                                            Código de Seguridad
                                        </label>
                                        <input
                                            type="text"
                                            value={codigoExitFullscreen}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d{0,4}$/.test(value)) {
                                                    setCodigoExitFullscreen(value);
                                                    if (errorCodigoExitFullscreen) {
                                                        setErrorCodigoExitFullscreen('');
                                                    }
                                                }
                                            }}
                                            placeholder="****"
                                            maxLength="4"
                                            className="p-3 border border-gray-300 rounded-lg w-full text-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            autoFocus
                                        />
                                        
                                        {errorCodigoExitFullscreen && (
                                            <p className="text-red-500 text-sm text-center mt-1">
                                                {errorCodigoExitFullscreen}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button
                                            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colores"
                                            onClick={() => {
                                                setModalExitFullscreenOpen(false);
                                                setCodigoExitFullscreen('');
                                                setErrorCodigoExitFullscreen('');
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className={`flex-1 py-2 px-4 rounded-lg transition-colores ${
                                                codigoExitFullscreen.length === 4
                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                            onClick={confirmarExitFullscreen}
                                            disabled={codigoExitFullscreen.length !== 4}
                                        >
                                            Salir de Pantalla Completa
                                        </button>
                                    </div>
                                    
                                    <div className="text-center text-xs text-gray-500">
                                        Por seguridad, se requiere código para salir del modo pantalla completa.
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .delay-500 { animation-delay: 500ms; }
                .delay-1000 { animation-delay: 1000ms; }
                .delay-1500 { animation-delay: 1500ms; }
                
                @keyframes countdown-rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}