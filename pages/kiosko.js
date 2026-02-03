import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { MdCategory, MdFilterList } from "react-icons/md";
import { IoExpandOutline } from "react-icons/io5";
import { getProductsKiosko } from "@/useCases/getProductsKiosko";
import { kioskoPostOrder } from "@/useCases/kioskoPostOrder";
import { loginUser } from "@/useCases/login";
import TicketModal from "@/components/TicketModal";

export default function Kiosko() {
    const router = useRouter();
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
    const [disponibilidadSeleccionada, setDisponibilidadSeleccionada] = useState("Disponibles");
    const [busqueda, setBusqueda] = useState("");
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [carritoModalOpen, setCarritoModalOpen] = useState(false);
    const [mensajeError, setMensajeError] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalProductoOpen, setModalProductoOpen] = useState(false);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [completedOrderUuid, setCompletedOrderUuid] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const scrollContainerRef = useRef(null);
    const [showKeyboard, setShowKeyboard] = useState(false);
    
    // Estados para autenticación
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Verificar autenticación al cargar
    useEffect(() => {
        const token = sessionStorage.getItem('kioskoToken') || localStorage.getItem('kioskoToken');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setShowLoginModal(true);
        }
    }, []);

    // Función para cargar productos
    const fetchProductos = async () => {
        try {
            const data = await getProductsKiosko();
            setProductos(data);
            setProductosFiltrados(data);
        } catch (error) {
            console.error("Error al obtener los productos:", error.message);
            
            // Si el error es de autenticación, limpiar tokens y mostrar login
            if (error.message.includes('token') || error.message.includes('autenticación') || error.message.includes('401')) {
                handleLogout();
            }
            setProductos([]);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);

        try {
            const response = await loginUser(loginData);

            if (response.ok) {
                const data = await response.json();
                if (data.access_token) {
                    // Guardar token en ambos almacenamientos para persistencia
                    sessionStorage.setItem('kioskoToken', data.access_token);
                    localStorage.setItem('kioskoToken', data.access_token);
                    setIsAuthenticated(true);
                    setShowLoginModal(false);
                    setLoginData({ email: '', password: '' });
                    
                    // Cargar productos inmediatamente después del login exitoso
                    await fetchProductos();
                } else {
                    setLoginError('No se recibió un token válido');
                }
            } else {
                setLoginError('Usuario y/o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setLoginError('Error al iniciar sesión. Intente nuevamente.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('kioskoToken');
        localStorage.removeItem('kioskoToken');
        setIsAuthenticated(false);
        setShowLoginModal(true);
        vaciarCarrito();
    };

    // Verificar estado de pantalla completa
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                }
            }
        } catch (error) {
            console.error('Error con fullscreen:', error);
        }
    };

    // Funciones para drag scroll
    const handleMouseDown = (e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartY(e.pageY - scrollContainerRef.current.offsetTop);
        setScrollTop(scrollContainerRef.current.scrollTop);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const y = e.pageY - scrollContainerRef.current.offsetTop;
        const walk = (y - startY) * 2; // Multiplicador para velocidad
        scrollContainerRef.current.scrollTop = scrollTop - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Touch events para móviles
    const handleTouchStart = (e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartY(e.touches[0].pageY - scrollContainerRef.current.offsetTop);
        setScrollTop(scrollContainerRef.current.scrollTop);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        const y = e.touches[0].pageY - scrollContainerRef.current.offsetTop;
        const walk = (y - startY) * 2;
        scrollContainerRef.current.scrollTop = scrollTop - walk;
    };

    // Funciones del teclado virtual
    const handleKeyPress = (key) => {
        if (key === 'BORRAR') {
            setBusqueda(busqueda.slice(0, -1));
        } else if (key === 'ESPACIO') {
            setBusqueda(busqueda + ' ');
        } else if (key === 'LIMPIAR') {
            setBusqueda('');
        } else {
            setBusqueda(busqueda + key);
        }
    };

    // Obtener productos desde la API cuando ya hay autenticación
    useEffect(() => {
        if (isAuthenticated) {
            fetchProductos();
        }
    }, [isAuthenticated]);

    // Filtrar productos según categoría, disponibilidad y búsqueda
    useEffect(() => {
        let productosFiltrados = productos;

        if (categoriaSeleccionada !== "Todas") {
            productosFiltrados = productosFiltrados.filter(
                (producto) => producto.nombre_categoria === categoriaSeleccionada
            );
        }

        if (disponibilidadSeleccionada === "Disponibles") {
            productosFiltrados = productosFiltrados.filter((producto) => producto.status === "activo");
        }

        if (busqueda) {
            productosFiltrados = productosFiltrados.filter((producto) =>
                producto.name.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        setProductosFiltrados(productosFiltrados);
    }, [categoriaSeleccionada, disponibilidadSeleccionada, busqueda, productos]);

    // Obtener categorías únicas
    const categoriasUnicas = [...new Set(productos.map((producto) => producto.nombre_categoria))];

    // Agregar producto al carrito
    const agregarAlCarrito = (producto) => {
        const productoEnCarrito = carrito.find((item) => item.id_products === producto.id_products);

        if (productoEnCarrito) {
            setCarrito(
                carrito.map((item) =>
                    item.id_products === producto.id_products ? { ...item, cantidad: item.cantidad + 1 } : item
                )
            );
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    // Modificar cantidad en el carrito
    const modificarCantidad = (productoId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(productoId);
            return;
        }

        setCarrito(
            carrito.map((item) =>
                item.id_products === productoId ? { ...item, cantidad: nuevaCantidad } : item
            )
        );
    };

    // Eliminar producto del carrito
    const eliminarDelCarrito = (productoId) => {
        setCarrito(carrito.filter((item) => item.id_products !== productoId));
    };

    // Vaciar carrito
    const vaciarCarrito = () => {
        setCarrito([]);
    };

    // Calcular total
    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + parseFloat(item.price) * item.cantidad, 0);
    };

    // Procesar orden
    const procesarOrden = async () => {
        if (carrito.length === 0) {
            setMensajeError("El carrito está vacío");
            setTimeout(() => setMensajeError(""), 3000);
            return;
        }

        setIsProcessingOrder(true);
        setShowPaymentModal(false);

        try {
            const productIds = carrito.map((item) => item.id_products).join(',');
            const quantities = carrito.map((item) => item.cantidad).join(',');

            const orderData = await kioskoPostOrder(productIds, quantities, metodoPago);

            // Mostrar ticket
            setCompletedOrderUuid(orderData.order_uuid);
            setShowTicketModal(true);

            // Limpiar carrito
            vaciarCarrito();
        } catch (error) {
            console.error("Error al procesar la orden:", error);
            
            // Si el error es de autenticación, limpiar tokens y mostrar login
            if (error.message.includes('token') || error.message.includes('autenticación') || error.message.includes('401')) {
                handleLogout();
            }
            
            setMensajeError(error.message || "Error al procesar la orden");
            setTimeout(() => setMensajeError(""), 5000);
        } finally {
            setIsProcessingOrder(false);
        }
    };

    // Abrir modal de producto
    const abrirModalProducto = (producto) => {
        setProductoSeleccionado(producto);
        setModalProductoOpen(true);
    };

    // Obtener imagen del producto
    const getImageUrl = (product) => {
        const raw = Array.isArray(product.image_url) ? product.image_url[0] : product.image_url;
        if (!raw) return "/Default.png";
        const cleaned = String(raw).replace(/[`'"]/g, "").trim();
        return cleaned || "/Default.png";
    };

    return (
        <>
            <Head>
                <title>Kiosko - WapiFood</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* Modal de Login */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
                        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-md">
                        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700">
                            <div className="text-center mb-8">
                                <div className="bg-gradient-to-r from-green-400 to-emerald-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <FaShoppingCart size={40} className="text-white" />
                                </div>
                                <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                                    Kiosko WapiFood
                                </h1>
                                <p className="text-gray-300 text-sm">Inicia sesión para acceder al kiosko</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                {loginError && (
                                    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl text-sm">
                                        {loginError}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-gray-300 text-sm font-semibold">Correo electrónico</label>
                                    <input
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="correo@restaurante.com"
                                        required
                                        disabled={isLoggingIn}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-300 text-sm font-semibold">Contraseña</label>
                                    <input
                                        type="password"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoggingIn}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoggingIn}
                                >
                                    {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenido del Kiosko - Solo visible si está autenticado */}
            {isAuthenticated && (
            <div className={`bg-gradient-to-br from-green-50 via-white to-emerald-50 ${isFullscreen ? 'min-h-screen h-screen overflow-y-auto' : 'min-h-screen'}`}>
                {/* Header */}
                <header className="bg-gradient-to-r from-green-500 via-emerald-400 to-teal-400 text-white p-6 shadow-2xl sticky top-0 z-40">
                    <div className={`mx-auto flex items-center justify-between ${isFullscreen ? 'max-w-full px-6' : 'max-w-7xl'}`}>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <FaShoppingCart size={32} className="text-yellow-300" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black">Kiosko WapiFood</h1>
                                <p className="text-green-100 text-sm">Haz tu pedido de forma rápida y fácil</p>
                            </div>
                        </div>
                        {!isFullscreen && (
                            <button
                                onClick={toggleFullscreen}
                                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30 flex items-center gap-2"
                                title="Pantalla completa"
                            >
                                <IoExpandOutline size={24} />
                                Pantalla Completa
                            </button>
                        )}
                    </div>
                </header>

                {/* Mensaje de error */}
                {mensajeError && (
                    <div className="fixed top-24 right-4 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-bounce">
                        {mensajeError}
                    </div>
                )}

                <div className={`mx-auto p-4 md:p-6 ${isFullscreen ? 'max-w-full h-full' : 'max-w-7xl'}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Panel de productos */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Búsqueda y filtros */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Búsqueda */}
                                    <div className="flex-1 relative">
                                        <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                                        <input
                                            type="text"
                                            placeholder="Buscar productos..."
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                            onFocus={() => setShowKeyboard(true)}
                                            readOnly
                                            className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-400 transition-all text-lg cursor-pointer"
                                        />
                                    </div>

                                    {/* Filtro de categoría */}
                                    <div className="relative">
                                        <MdCategory className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                                        <select
                                            value={categoriaSeleccionada}
                                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                            className="pl-12 pr-8 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-400 transition-all appearance-none bg-white cursor-pointer text-lg font-semibold"
                                        >
                                            <option value="Todas">Todas las categorías</option>
                                            {categoriasUnicas.map((categoria) => (
                                                <option key={categoria} value={categoria}>
                                                    {categoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Filtro de disponibilidad */}
                                    <div className="relative">
                                        <MdFilterList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                                        <select
                                            value={disponibilidadSeleccionada}
                                            onChange={(e) => setDisponibilidadSeleccionada(e.target.value)}
                                            className="pl-12 pr-8 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-400 transition-all appearance-none bg-white cursor-pointer text-lg font-semibold"
                                        >
                                            <option value="Disponibles">Disponibles</option>
                                            <option value="Todos">Todos</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Grid de productos */}
                            <div 
                                ref={scrollContainerRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleMouseUp}
                                className={`grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'} ${isFullscreen ? 'max-h-[calc(100vh-280px)]' : 'max-h-[600px]'}`}
                                style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
                            >
                                {productosFiltrados.map((producto) => (
                                    <div
                                        key={producto.id_products}
                                        className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                                            producto.status !== 'activo' ? 'border-gray-300 opacity-60' : 'border-green-200'
                                        } ${!isDragging ? 'cursor-pointer' : 'cursor-grabbing'}`}
                                        onClick={(e) => {
                                            if (!isDragging && producto.status === 'activo') {
                                                abrirModalProducto(producto);
                                            }
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                    >
                                        <div className="relative aspect-square">
                                            <img
                                                src={getImageUrl(producto)}
                                                alt={producto.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {producto.status !== 'activo' && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                                                        No Disponible
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-2">
                                                {producto.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-2xl font-black text-green-600">
                                                    ${parseFloat(producto.price).toFixed(2)}
                                                </p>
                                                {producto.status === 'activo' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            agregarAlCarrito(producto);
                                                        }}
                                                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                                                    >
                                                        <FaPlus size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {productosFiltrados.length === 0 && (
                                <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-green-100">
                                    <p className="text-gray-500 text-xl">No se encontraron productos</p>
                                </div>
                            )}
                        </div>

                        {/* Panel del carrito */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 sticky top-24">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                                        <FaShoppingCart className="text-green-500" />
                                        Tu Pedido
                                    </h2>
                                    <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                                        {carrito.reduce((total, item) => total + item.cantidad, 0)}
                                    </span>
                                </div>

                                <div className={`space-y-3 overflow-y-auto mb-6 ${isFullscreen ? 'max-h-[calc(100vh-400px)]' : 'max-h-96'}`}>
                                    {carrito.length === 0 ? (
                                        <p className="text-gray-400 text-center py-8">
                                            Tu carrito está vacío
                                        </p>
                                    ) : (
                                        carrito.map((item) => (
                                            <div
                                                key={item.id_products}
                                                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-bold text-gray-800 flex-1 line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => eliminarDelCarrito(item.id_products)}
                                                        className="text-red-500 hover:text-red-700 ml-2"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => modificarCantidad(item.id_products, item.cantidad - 1)}
                                                            className="bg-white border-2 border-green-300 text-green-600 w-8 h-8 rounded-lg hover:bg-green-50 font-bold"
                                                        >
                                                            <FaMinus size={12} className="mx-auto" />
                                                        </button>
                                                        <span className="font-bold text-lg w-8 text-center">
                                                            {item.cantidad}
                                                        </span>
                                                        <button
                                                            onClick={() => modificarCantidad(item.id_products, item.cantidad + 1)}
                                                            className="bg-white border-2 border-green-300 text-green-600 w-8 h-8 rounded-lg hover:bg-green-50 font-bold"
                                                        >
                                                            <FaPlus size={12} className="mx-auto" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xl font-black text-green-600">
                                                        ${(parseFloat(item.price) * item.cantidad).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {carrito.length > 0 && (
                                    <>
                                        <div className="border-t-2 border-green-200 pt-4 mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xl font-bold text-gray-700">Total:</span>
                                                <span className="text-3xl font-black text-green-600">
                                                    ${calcularTotal().toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                onClick={() => setShowPaymentModal(true)}
                                                disabled={isProcessingOrder}
                                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg disabled:opacity-50"
                                            >
                                                {isProcessingOrder ? 'Procesando...' : 'Pagar Pedido'}
                                            </button>
                                            <button
                                                onClick={vaciarCarrito}
                                                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                                            >
                                                Vaciar Carrito
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Teclado Virtual */}
                {showKeyboard && (
                    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowKeyboard(false)}>
                        <div className="bg-white rounded-t-3xl w-full max-w-4xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Buscar Producto</h3>
                                <button
                                    onClick={() => setShowKeyboard(false)}
                                    className="bg-green-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-600 transition-all"
                                >
                                    Listo
                                </button>
                            </div>
                            
                            {/* Display de búsqueda */}
                            <div className="bg-gray-100 rounded-xl p-4 mb-4 min-h-[60px] flex items-center">
                                <p className="text-2xl font-semibold text-gray-800">
                                    {busqueda || 'Escribe para buscar...'}
                                </p>
                            </div>

                            {/* Teclas */}
                            <div className="space-y-2">
                                {/* Fila 1 */}
                                <div className="grid grid-cols-10 gap-2">
                                    {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => handleKeyPress(key)}
                                            className="bg-gradient-to-b from-white to-gray-100 border-2 border-gray-300 rounded-lg p-4 text-xl font-bold text-gray-800 hover:bg-green-100 hover:border-green-400 active:scale-95 transition-all shadow-md"
                                        >
                                            {key}
                                        </button>
                                    ))}
                                </div>

                                {/* Fila 2 */}
                                <div className="grid grid-cols-10 gap-2">
                                    <div className="col-span-1"></div>
                                    {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => handleKeyPress(key)}
                                            className="bg-gradient-to-b from-white to-gray-100 border-2 border-gray-300 rounded-lg p-4 text-xl font-bold text-gray-800 hover:bg-green-100 hover:border-green-400 active:scale-95 transition-all shadow-md"
                                        >
                                            {key}
                                        </button>
                                    ))}
                                </div>

                                {/* Fila 3 */}
                                <div className="grid grid-cols-10 gap-2">
                                    <div className="col-span-2"></div>
                                    {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => handleKeyPress(key)}
                                            className="bg-gradient-to-b from-white to-gray-100 border-2 border-gray-300 rounded-lg p-4 text-xl font-bold text-gray-800 hover:bg-green-100 hover:border-green-400 active:scale-95 transition-all shadow-md"
                                        >
                                            {key}
                                        </button>
                                    ))}
                                    <div className="col-span-1"></div>
                                </div>

                                {/* Fila 4 - Controles */}
                                <div className="grid grid-cols-10 gap-2">
                                    <button
                                        onClick={() => handleKeyPress('LIMPIAR')}
                                        className="col-span-2 bg-gradient-to-b from-green-400 to-green-500 border-2 border-green-600 rounded-lg p-4 text-lg font-bold text-white hover:from-green-500 hover:to-green-600 active:scale-95 transition-all shadow-md"
                                    >
                                        LIMPIAR
                                    </button>
                                    <button
                                        onClick={() => handleKeyPress('ESPACIO')}
                                        className="col-span-6 bg-gradient-to-b from-white to-gray-100 border-2 border-gray-300 rounded-lg p-4 text-lg font-bold text-gray-800 hover:bg-green-100 hover:border-green-400 active:scale-95 transition-all shadow-md"
                                    >
                                        ESPACIO
                                    </button>
                                    <button
                                        onClick={() => handleKeyPress('BORRAR')}
                                        className="col-span-2 bg-gradient-to-b from-green-400 to-green-500 border-2 border-green-600 rounded-lg p-4 text-lg font-bold text-white hover:from-green-500 hover:to-green-600 active:scale-95 transition-all shadow-md"
                                    >
                                        ← BORRAR
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de detalle de producto */}
                {modalProductoOpen && productoSeleccionado && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="relative">
                                <img
                                    src={getImageUrl(productoSeleccionado)}
                                    alt={productoSeleccionado.name}
                                    className="w-full h-64 object-cover"
                                />
                                <button
                                    onClick={() => setModalProductoOpen(false)}
                                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
                                >
                                    <HiXMark size={24} />
                                </button>
                            </div>
                            <div className="p-6">
                                <h2 className="text-3xl font-black text-gray-800 mb-2">
                                    {productoSeleccionado.name}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    {productoSeleccionado.description || 'Sin descripción'}
                                </p>
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-4xl font-black text-green-600">
                                        ${parseFloat(productoSeleccionado.price).toFixed(2)}
                                    </span>
                                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                                        {productoSeleccionado.nombre_categoria}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        agregarAlCarrito(productoSeleccionado);
                                        setModalProductoOpen(false);
                                    }}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                                >
                                    Agregar al Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de método de pago */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-8">
                            <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">
                                Selecciona el método de pago
                            </h2>
                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => setMetodoPago('efectivo')}
                                    className={`w-full p-4 rounded-xl font-bold text-lg transition-all border-2 ${
                                        metodoPago === 'efectivo'
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                                    }`}
                                >
                                    💵 Efectivo
                                </button>
                                <button
                                    onClick={() => setMetodoPago('tarjeta')}
                                    className={`w-full p-4 rounded-xl font-bold text-lg transition-all border-2 ${
                                        metodoPago === 'tarjeta'
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                                    }`}
                                >
                                    💳 Tarjeta
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={procesarOrden}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de ticket */}
                {showTicketModal && completedOrderUuid && (
                    <TicketModal
                        isOpen={showTicketModal}
                        onClose={() => {
                            setShowTicketModal(false);
                            setCompletedOrderUuid(null);
                        }}
                        orderUuid={completedOrderUuid}
                    />
                )}
            </div>
            )}

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.2;
                    }
                    50% {
                        opacity: 0.3;
                    }
                }

                .animate-pulse {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 1s;
                }

                .animation-delay-4000 {
                    animation-delay: 2s;
                }
            `}</style>
        </>
    );
}
