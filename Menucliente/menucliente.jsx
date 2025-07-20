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
    
    // Estados para la modal de login
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Estados nuevos para las funcionalidades de pntoventa
    const [ordenActiva, setOrdenActiva] = useState(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [totalFinal, setTotalFinal] = useState(0);
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [codigoConfirmacion, setCodigoConfirmacion] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Estados para mesas
    const [numeroMesa, setNumeroMesa] = useState('');
    const [mesas, setMesas] = useState([]);
    const [modalMesaOpen, setModalMesaOpen] = useState(false);
    const [loadingMesas, setLoadingMesas] = useState(false);

    // Nuevos estados para cambio de mesa
    const [modalCambioMesaOpen, setModalCambioMesaOpen] = useState(false);
    const [codigoCambioMesa, setCodigoCambioMesa] = useState('');
    const [errorCodigoMesa, setErrorCodigoMesa] = useState('');
    const [procesandoCambioMesa, setProcesandoCambioMesa] = useState(false);

    // Estados para el TicketModal
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [completedOrderUuid, setCompletedOrderUuid] = useState(null);

    // Estado para el modal de advertencia de orden activa
    const [modalOrdenActivaOpen, setModalOrdenActivaOpen] = useState(false);

    // Mock para establecer permisos de ticket automáticamente
    useEffect(() => {
        localStorage.setItem('tickets', 'true');
    }, []);

    // Función para seleccionar mesa
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

    // Función modificada para manejar el click en el número de mesa
    const handleClickMesa = () => {
        // Verificar si hay una orden activa
        if (ordenActiva && ordenActiva.order_uuid) {
            setModalOrdenActivaOpen(true);
            return;
        }
        
        setModalCambioMesaOpen(true);
        setCodigoCambioMesa('');
        setErrorCodigoMesa('');
    };

    // Nueva función para cambiar de mesa
    const confirmarCambioMesa = async () => {
        try {
            // Obtener el código de confirmación de la API
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

    // Nueva función para cerrar sesión
    const cerrarSesion = async () => {
        try {
            // Obtener el código de confirmación de la API
            const codigoAPI = await getCodigoConfirmacion();
            const codigoEsperado = codigoAPI.codigo_confirmacion;
            
            if (codigoCambioMesa !== codigoEsperado.toString()) {
                setErrorCodigoMesa('Código incorrecto. Intenta nuevamente.');
                return;
            }

            setProcesandoCambioMesa(true);
            setErrorCodigoMesa('');

            // Cambiar mesa a "Libre" si existe
            if (numeroMesa) {
                await updateTableStatus(parseInt(numeroMesa), 'Libre');
            }

            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('numeroMesa');
            localStorage.removeItem("carrito1");
            localStorage.removeItem("historialPedidos1");
            localStorage.removeItem("ordenActiva1");

            // Limpiar sessionStorage también por si acaso
            sessionStorage.removeItem('token');

            // Resetear estados
            setNumeroMesa('');
            setCarrito([]);
            setHistorialPedidos([]);
            setOrdenActiva(null);
            setTotalFinal(0);
            setModalCambioMesaOpen(false);
            setIsAuthenticated(false);
            
            // Mostrar modal de login
            setLoginModalOpen(true);

        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setErrorCodigoMesa('Error al obtener código de confirmación o al cerrar sesión.');
        } finally {
            setProcesandoCambioMesa(false);
        }
    };

    // Verificar token al cargar el componente
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

    // Verificar si necesita mostrar modal de mesa después de autenticarse
    useEffect(() => {
        if (isAuthenticated && !numeroMesa) {
            cargarMesas();
        }
    }, [isAuthenticated, numeroMesa]);

    // Función para cargar las mesas disponibles
    const cargarMesas = async () => {
        try {
            setLoadingMesas(true);
            
            const mesasData = await getTables();
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

    // Recuperar datos del localStorage al cargar la página
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

    // Guardar datos en localStorage cuando cambien
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

    // Cargar productos solo después de autenticarse
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

    // Función para manejar el login
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

    // Función modificada para crear/actualizar órdenes
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

    // Función para finalizar todas las órdenes y abrir modal
    const terminarOrden = async () => {
        if (historialPedidos.length === 0) {
            setMensajeError("No hay pedidos para finalizar. Realiza al menos un pedido primero.");
            return;
        }

        // Verificar si hay una orden activa para validar su estado
        if (ordenActiva && ordenActiva.order_uuid) {
            try {
                // Hacer petición a getTicket para verificar el estado
                const ticketData = await getTicket(ordenActiva.order_uuid);
                
                // Verificar si la orden está cancelada
                if (ticketData.order_status === "Cancelado") {
                    // Mostrar modal de orden cancelada
                    setShowCancelledOrderModal(true);
                    return;
                }
                
                // Si la orden no está cancelada, continuar con el flujo normal
                setTotalPedidos(totalFinal > 0 ? totalFinal.toFixed(2) : "0.00");
                setModalTotalOpen(true);
                setMensajeError("");
                
            } catch (error) {
                console.error('Error al verificar el estado de la orden:', error);
                setMensajeError("Error al verificar el estado de la orden. Intenta nuevamente.");
                return;
            }
        } else {
            // Si no hay orden activa, proceder normalmente
            setTotalPedidos(totalFinal > 0 ? totalFinal.toFixed(2) : "0.00");
            setModalTotalOpen(true);
            setMensajeError("");
        }
    };

    // Agregar estado para el modal de orden cancelada
    const [showCancelledOrderModal, setShowCancelledOrderModal] = useState(false);

    // Función para limpiar todo cuando la orden esté cancelada
    const limpiarOrdenCancelada = async () => {
        try {
            // Cambiar mesa a "NoDisponible" si existe
            if (numeroMesa) {
                try {
                    await updateTableStatus(parseInt(numeroMesa), 'NoDisponible');
                    console.log(`Mesa ${numeroMesa} cambiada a NoDisponible`);
                } catch (error) {
                    console.error('Error al cambiar mesa a NoDisponible:', error);
                }
            }
            
            // Limpiar estados
            setHistorialPedidos([]);
            setOrdenActiva(null);
            setTotalFinal(0);
            setCarrito([]);
            
            // Limpiar localStorage específico del menú cliente
            localStorage.removeItem("ordenActiva1");
            localStorage.removeItem("historialPedidos1");
            localStorage.removeItem("carrito1");
            
            // Cerrar modal
            setShowCancelledOrderModal(false);
            
            // Mensaje de confirmación
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

    // Nueva función confirmarPago con TicketModal - MODIFICADA para mantener mesa
    const confirmarPago = async () => {
        if (!ordenActiva || !ordenActiva.order_uuid) {
            setMensajeError("No hay una orden activa para finalizar.");
            return;
        }

        if (isProcessingPayment) {
            return;
        }

        setIsProcessingPayment(true);
        setMensajeError("");

        try {
            const currentOrderUuid = ordenActiva.order_uuid;
            const response = await endOrder(currentOrderUuid, metodoPago);
            
            if (response && (response.success !== false)) {
                if (numeroMesa) {
                    try {
                        // CAMBIO: Cambiar a 'NoDisponible' en lugar de 'Libre'
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
            
            if (error.message.includes('fetch')) {
                mensajeErrorUsuario += "Problemas de conexión. Verifica tu internet e intenta nuevamente.";
            } else if (error.message.includes('token')) {
                mensajeErrorUsuario += "Sesión expirada. Por favor, inicia sesión nuevamente.";
            } else if (error.message.includes('404')) {
                mensajeErrorUsuario += "Orden no encontrada. Contacta con el administrador.";
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

    const categorias = ["Todos los platillos", ...new Set(productos.map(p => p.categoria))];

    if (loading && isAuthenticated) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando productos...</div>
            </div>
        );
    }

    return (
        <section>
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

            {/* Modal de selección de mesa */}
            {modalMesaOpen && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[1001]">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                        {loadingMesas ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
                                <p className="ml-4 text-gray-600">Cargando mesas...</p>
                            </div>
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
                                        <p className="text-red-600 mb-4">No hay mesas disponibles en este momento</p>
                                        <button
                                            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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

            {/* Modal de Login */}
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
                                                className="bg-[#3fe283] text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
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

            {/* Header */}
            <header>
                <nav className="w-full bg-gray-100 text-gray-800 p-4">
                    <div className="flex items-center max-w-7xl mx-auto justify-between">
                        <div className="flex items-center">
                            <GoChecklist size={36} className="text-green-600" />
                            <h1 className="text-3xl font-bold ml-2">WapiFood</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {numeroMesa ? (
                                <div 
                                    className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg cursor-pointer hover:bg-green-200 transition-colors"
                                    onClick={handleClickMesa}
                                    title="Click para cambiar de mesa"
                                >
                                    <MdTableRestaurant className="text-green-600" size={20} />
                                    <span className="text-sm font-medium text-green-800">
                                        Mesa {numeroMesa}
                                    </span>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500">Sin mesa</div>
                            )}

                            <button
                                className="z-20 cursor-pointer py-3 hamburger-button"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Toggle menu"
                            >
                                <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                                <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                                <div className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Modal de advertencia de orden activa */}
            {modalOrdenActivaOpen && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[1003]">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div className='text-red-500 text-4xl flex justify-center mb-4'>
                            <div className='bg-red-500 text-white p-2 rounded-lg'>
                                <MdTableRestaurant size={32} />
                            </div>
                        </div>
                        <h2 className="text-2xl text-center font-bold text-black mb-2">
                            No se puede cambiar de mesa
                        </h2>
                        <p className='text-center text-gray-600 mb-6'>
                            No se puede cambiar la mesa porque tienes una orden activa. 
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
                        
                        <div className="flex gap-3">
                            <button
                                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-red-600 transition-colors"
                                onClick={() => setModalOrdenActivaOpen(false)}
                            >
                                Entendido
                            </button>
                            <button
                                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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

            {/* Modal de cambio de mesa */}
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
                                <div className='text-[#3fe283] text-4xl flex justify-center mb-4'>
                                    <div className='bg-[#3fe283] text-white p-2 rounded-lg'>
                                        <MdTableRestaurant size={32} />
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
                                            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                            onClick={() => {
                                                setModalCambioMesaOpen(false);
                                                setCodigoCambioMesa('');
                                                setErrorCodigoMesa('');
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
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
                                    
                                    {/* Nuevo botón de Cerrar Sesión */}
                                    <button
                                        className={`w-full py-2 px-4 rounded-lg transition-colors ${
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

            {/* Menú desplegable */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg 
                    transition-transform duration-300 ease-in-out menu-container
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <ul className="flex flex-col mt-16 p-4 text-xl">
                    <p className="text-gray-500 font-bold">Menú principal</p>
                    {categorias.map((categoria, index) => (
                        <li
                            key={index}
                            className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                            onClick={() => {
                                setCategoriaSeleccionada(categoria);
                                setIsOpen(false);
                            }}
                        >
                            {categoria === "Todos los platillos" && <IoHomeOutline className="self-center" />}
                            {categoria}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Botón flotante del carrito */}
            <button
                className="fixed bottom-10 right-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-green-600"
                onClick={() => setCarritoModalOpen(true)}
            >
                <FaShoppingCart className="text-xl" />
                {carrito.length > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {carrito.length}
                    </span>
                )}
            </button>

            {/* Modal del carrito */}
            {carritoModalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 z-50 flex justify-end"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setCarritoModalOpen(false);
                        }
                    }}
                >
                    <div className="bg-white w-80 h-full shadow-lg p-4 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Tu Pedido</h2>

                        {ordenActiva && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="text-sm font-semibold text-blue-800">Orden Activa</h3>
                                <p className="text-xs text-blue-600">UUID: {ordenActiva.order_uuid.slice(0, 8)}...</p>
                                <p className="text-xs text-blue-600">Estado: {ordenActiva.order_status}</p>
                            </div>
                        )}

                        {carrito.length > 0 ? (
                            <div className="max-h-48 overflow-y-auto mb-4">
                                <ul className="space-y-2">
                                    {carrito.map((item) => (
                                        <li key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded shadow">
                                            <div>
                                                <p className="font-bold">{item.nombre || item.name}</p>
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
                                                    ${(item.precio || item.price || 0).toFixed(2)} c/u
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

                        <p className="text-lg font-bold">Total: ${calcularTotal()}</p>
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
                                onClick={realizarPedido}
                                disabled={isCreatingOrder}
                            >
                                {isCreatingOrder ? 'Enviando...' : 
                                 ordenActiva ? 'Agregar a la orden' : 'Realizar Pedido'}
                            </button>
                        </div>

                        {historialPedidos.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-500 mb-2">Historial de Pedidos</h3>
                                <div className="max-h-48 overflow-y-auto">
                                    <ul className="space-y-2">
                                        {historialPedidos.map((item, index) => (
                                            <li key={index} className="p-2 rounded shadow bg-gray-50">
                                                <p className="font-bold">{item.cantidad} x {item.nombre || item.name}</p>
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
                                                    Precio: ${(item.precio || item.price || 0).toFixed(2)} c/u
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {historialPedidos.length > 3 && (
                                    <p className="text-xs text-gray-400 text-center mt-2">
                                        Mostrando {historialPedidos.length} productos - Desliza para ver más
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Total final de todas las órdenes */}
                        {totalFinal > 0 && (
                            <p className="text-sm text-gray-500 pt-2 font-semibold">
                                Total Final: ${totalFinal.toFixed(2)}
                            </p>
                        )}

                        {/* Botón "Terminar Orden" */}
                        <div className="mt-4">
                            <button
                                className={`w-full py-2 rounded-lg ${
                                    historialPedidos.length > 0
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={terminarOrden}
                                disabled={historialPedidos.length === 0}
                            >
                                Terminar Orden
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal del total de pedidos */}
            {modalTotalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[9999]"
                    onClick={(e) => {
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
                                ${parseFloat(totalPedidos).toFixed(2)}
                            </span>
                        </p>
                        <p className="text-center text-gray-600 mb-4">
                            Método de pago: <span className="font-semibold capitalize">{metodoPago}</span>
                        </p>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                Código de confirmación
                            </label>
                            <input
                                type="text"
                                value={codigoConfirmacion}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,4}$/.test(value)) {
                                        setCodigoConfirmacion(value);
                                    }
                                }}
                                placeholder="0000"
                                maxLength="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                disabled={isProcessingPayment}
                            />
                        </div>

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

            {/* Modal de producto */}
            {modalOpen && productoSeleccionado && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-4 w-11/12 md:w-8/10 max-h-screen overflow-y-auto relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={closeModal}
                        >
                            ✖
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">{productoSeleccionado.nombre}</h2>
                        <div className="w-full h-40 mb-4 flex justify-center">
                            <Image
                                src={productoSeleccionado.imagen}
                                alt={`Imagen de ${productoSeleccionado.nombre}`}
                                className="rounded-lg object-cover w-5/10 h-10/10"
                                width={400}
                                height={300}
                            />
                        </div>
                        <div className="flex justify-center items-center w-full">
                            <p className="text-gray-700 text-center text-md leading-relaxed w-9/10">
                                {productoSeleccionado.descripcion}
                            </p>
                        </div>
                        {productoSeleccionado.ingredientes && productoSeleccionado.ingredientes.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Personalizar:</h4>
                                {productoSeleccionado.ingredientes.map((ingrediente, index) => (
                                    <label key={index} className="flex items-center mb-2">
                                        <input type="checkbox" className="mr-2" />
                                        <span>Sin {ingrediente}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <button
                                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center"
                                    onClick={() =>
                                        setProductoSeleccionado({
                                            ...productoSeleccionado,
                                            cantidad: Math.max((productoSeleccionado.cantidad || 1) - 1, 1),
                                        })
                                    }
                                >
                                    -
                                </button>
                                <span className="text-lg font-bold">{productoSeleccionado.cantidad || 1}</span>
                                <button
                                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center"
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
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
                                onClick={() => {
                                    agregarAlCarrito(productoSeleccionado);
                                    closeModal();
                                }}
                            >
                                Agregar - ${((productoSeleccionado.cantidad || 1) * (productoSeleccionado.precio || 0)).toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Card Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12">
                {productosFiltrados
                    .sort((a, b) => {
                        const ordenA = categoriaOrden[a.categoria] ?? Number.MAX_SAFE_INTEGER;
                        const ordenB = categoriaOrden[b.categoria] ?? Number.MAX_SAFE_INTEGER;
                        return ordenA - ordenB;
                    })
                    .map((producto) => (
                        <div
                            key={producto.id}
                            className="rounded-lg shadow-lg flex flex-col bg-white"
                        >
                            <div className="w-full h-48">
                                <Image
                                    src={producto.imagen}
                                    alt={`Imagen de ${producto.nombre}`}
                                    className="rounded-t-lg w-full h-full object-cover"
                                    width={300}
                                    height={200}
                                />
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-xl">{producto.nombre}</h3>
                                    <p className="text-xl text-green-500 font-bold">
                                        ${producto.precio.toFixed(2)}
                                    </p>
                                </div>
                                <p className="text-gray-500 mb-4 line-clamp-2 min-h-[3rem]">
                                    {producto.descripcion.length > 80
                                        ? `${producto.descripcion.slice(0, 80)}...`
                                        : producto.descripcion}
                                </p>
                                <div className="flex justify-between items-center">
                                    <p className="bg-green-300 text-green-800 rounded-full px-4 py-1 text-sm">
                                        {producto.categoria}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center cursor-pointer"
                                            onClick={() => {
                                                setProductosFiltrados((prevProductos) =>
                                                    prevProductos.map((item) =>
                                                        item.id === producto.id
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
                                                        item.id === producto.id
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
                                    >
                                        Agregar
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <button
                                        className=" flex gap-4 items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer w-full"
                                        onClick={() => openModal(producto)}
                                    >
                                        <FaRegEye className="h-[20px] w-[20px]" />Personalizar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </section>

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