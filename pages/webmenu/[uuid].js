import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getwebMenu } from '@/useCases/getwebmenu';
import { getUserUUID } from '@/useCases/getUserUUID';
import externalOrderDelivery from '@/useCases/externalOrderDelivery';
import getDeliveryOnOff from '@/useCases/getDeliveryOnOff';
import Image from 'next/image';
import { FaWhatsapp, FaPhoneAlt, FaRegEye } from "react-icons/fa";
import { MdOutlineWatchLater, MdDeliveryDining } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiMessageSquare } from "react-icons/fi";
import Profile from "@/pages/assets/images/Profile.jpg";
import { getMenuStyle } from '@/styles/menuStyles';
import Default from "@/public/Default.png";
import Toast from '@/components/Toast';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function MenuWebDinamico() {
    const router = useRouter();
    const { uuid, style } = router.query;
    
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los platillos");
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [restauranteInfo, setRestauranteInfo] = useState(null);
    const [currentStyle, setCurrentStyle] = useState(getMenuStyle('default'));
    
    // Estados para delivery
    const [isDeliveryMode, setIsDeliveryMode] = useState(false);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderFolio, setOrderFolio] = useState(null);
    const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
    const [showDeliveryWarningModal, setShowDeliveryWarningModal] = useState(false);
    const [customerData, setCustomerData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
        codigo_postal: '',
        referencias: '',
    });
    const [formErrors, setFormErrors] = useState({});

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wapifood.com';

    // Aplicar estilo cuando cambie el parámetro
    useEffect(() => {
        const selectedStyle = getMenuStyle(style || 'default');
        setCurrentStyle(selectedStyle);
    }, [style]);

    // Función para validar si un valor es válido (no null ni "string")
    const esValorValido = (valor) => {
        return valor && valor !== "string" && typeof valor === 'string' && valor.trim() !== "";
    };

    // Nueva función para validar números
    const esNumeroValido = (valor) => {
        return valor !== null && valor !== undefined && valor !== 0 && valor !== "0" && valor !== "";
    };

    // Transformar los datos de la API al formato esperado
    const transformarDatosAPI = (datosAPI) => {
        const productosTransformados = [];
        datosAPI.forEach(categoria => {
            categoria.productos.forEach(producto => {
                productosTransformados.push({
                    id: producto.id_products,
                    nombre: producto.name,
                    precio: parseFloat(producto.price),
                    descripcion: producto.description,
                    categoria: producto.nombre_categoria,
                    imagen: producto.image_url && producto.image_url.length > 0
                        ? producto.image_url[0]
                        : Default.src,
                    status: producto.status,
                });
            });
        });
        return productosTransformados;
    };

    useEffect(() => {
        if (!uuid) return;

        const cargarDatos = async () => {
            try {
                setLoading(true);
                // Cargar datos del menú
                const datos = await getwebMenu(uuid);
                setCategorias(datos);
                
                const productosTransformados = transformarDatosAPI(datos);
                setProductosFiltrados(productosTransformados);

                // Cargar información del restaurante
                const infoRestaurante = await getUserUUID(uuid);
                setRestauranteInfo(infoRestaurante);
                
                // Verificar si el restaurante está abierto
                if (infoRestaurante?.horario) {
                    const isOpen = checkRestaurantHours(infoRestaurante.horario);
                    setIsRestaurantOpen(isOpen);
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar el menú. Por favor, intenta más tarde.');
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [uuid]);

    useEffect(() => {
        if (!categorias.length) return;

        let productos = transformarDatosAPI(categorias);
        
        if (categoriaSeleccionada !== "Todos los platillos") {
            productos = productos.filter(
                producto => producto.categoria === categoriaSeleccionada
            );
        }

        if (busqueda.trim() !== "") {
            productos = productos.filter(
                producto => producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        setProductosFiltrados(productos);
    }, [categoriaSeleccionada, busqueda, categorias]);

    const obtenerCategorias = () => {
        const categoriasUnicas = ["Todos los platillos"];
        categorias.forEach(categoria => {
            if (!categoriasUnicas.includes(categoria.nombre_categoria)) {
                categoriasUnicas.push(categoria.nombre_categoria);
            }
        });
        return categoriasUnicas;
    };

    const openModal = (producto) => {
        setProductoSeleccionado(producto);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setProductoSeleccionado(null);
    };

    // Función para verificar si el restaurante está abierto
    const checkRestaurantHours = (horarioString) => {
        if (!horarioString) return true; // Si no hay horario, asumimos que está abierto
        
        try {
            // Obtener día y hora actual del cliente
            const now = new Date();
            const currentDay = now.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTimeInMinutes = currentHour * 60 + currentMinute;

            // Regex para extraer horarios: "Lun-Vie 9:00-18:00" o "Sab-Dom 9:00-14:00"
            const horarioRegex = /([A-Za-zÁ-ú\-]+)\s+(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/g;
            let match;
            
            while ((match = horarioRegex.exec(horarioString)) !== null) {
                const [, dias, horaInicio, minInicio, horaFin, minFin] = match;
                
                // Convertir días a números
                const daysMap = {
                    'Lun': 1, 'Mar': 2, 'Mie': 3, 'Jue': 4, 'Vie': 5, 'Sab': 6, 'Dom': 0,
                    'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0
                };
                
                let validDays = [];
                
                // Manejar rangos de días (Ej: "Lun-Vie")
                if (dias.includes('-')) {
                    const [inicio, fin] = dias.split('-');
                    const diaInicio = daysMap[inicio];
                    const diaFin = daysMap[fin];
                    
                    if (diaInicio <= diaFin) {
                        for (let i = diaInicio; i <= diaFin; i++) {
                            validDays.push(i);
                        }
                    } else {
                        // Caso especial: Sab-Dom (6-0)
                        for (let i = diaInicio; i <= 6; i++) {
                            validDays.push(i);
                        }
                        for (let i = 0; i <= diaFin; i++) {
                            validDays.push(i);
                        }
                    }
                } else if (daysMap[dias] !== undefined) {
                    validDays.push(daysMap[dias]);
                }
                
                // Verificar si hoy está dentro de los días válidos
                if (validDays.includes(currentDay)) {
                    const openTime = parseInt(horaInicio) * 60 + parseInt(minInicio);
                    const closeTime = parseInt(horaFin) * 60 + parseInt(minFin);
                    
                    // Verificar si la hora actual está dentro del horario
                    if (currentTimeInMinutes >= openTime && currentTimeInMinutes <= closeTime) {
                        return true;
                    }
                }
            }
            
            return false; // No está en ningún horario válido
        } catch (error) {
            console.error('Error al verificar horario:', error);
            return true; // En caso de error, permitimos la orden
        }
    };

    // ===== FUNCIONES DE DELIVERY =====
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleAddToCart = (producto, quantity = 1, comment = '') => {
        setCart([...cart, {
            product_id: producto.id,
            name: producto.nombre,
            price: producto.precio,
            quantity: quantity,
            comment: comment,
            image_url: producto.imagen,
        }]);
        showToast(`${producto.nombre} agregado al carrito`, 'success');
    };

    const handleUpdateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCart = [...cart];
        updatedCart[index].quantity = newQuantity;
        setCart(updatedCart);
    };

    const handleRemoveItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
        showToast('Producto eliminado del carrito', 'success');
    };

    const validateForm = () => {
        const errors = {};
        
        if (!customerData.nombre.trim()) {
            errors.nombre = 'El nombre es requerido';
        }
        
        if (!customerData.telefono.trim()) {
            errors.telefono = 'El teléfono es requerido';
        } else if (!/^\d{10}$/.test(customerData.telefono.replace(/\s/g, ''))) {
            errors.telefono = 'Ingresa un teléfono válido de 10 dígitos';
        }
        
        if (!customerData.direccion.trim()) {
            errors.direccion = 'La dirección es requerida';
        }
        
        if (!customerData.codigo_postal.trim()) {
            errors.codigo_postal = 'El código postal es requerido';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleContinueWithOrder = async () => {
        if (cart.length === 0) {
            showToast('Agrega productos al carrito para continuar', 'error');
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Obtener el UUID directamente de los query params
            const restaurantUuid = uuid;
            
            if (!restaurantUuid) {
                showToast('Error: No se encontró el UUID del restaurante', 'error');
                setIsSubmitting(false);
                return;
            }
            
            // Verificar el estado del delivery
            const deliveryStatus = await getDeliveryOnOff(restaurantUuid);
            
            setIsSubmitting(false);
            
            // Si el delivery está activo (true), abrir el formulario directamente
            if (deliveryStatus.is_delivery_active) {
                setIsCartOpen(false);
                setShowCustomerForm(true);
                return;
            }
            
            // Si el delivery está desactivado (false), mostrar modal de advertencia
            setShowDeliveryWarningModal(true);
        } catch (error) {
            console.error('Error al verificar estado de delivery:', error);
            setIsSubmitting(false);
            // En caso de error, continuar con el flujo normal
            setIsCartOpen(false);
            setShowCustomerForm(true);
        }
    };

    const handleAcceptPickup = () => {
        // Usuario acepta recoger en el restaurante
        setShowDeliveryWarningModal(false);
        setIsCartOpen(false);
        setShowCustomerForm(true);
    };

    const handleCancelOrder = () => {
        // Usuario cancela, cerrar modal y limpiar carrito
        setShowDeliveryWarningModal(false);
        setIsCartOpen(false);
        setCart([]);
        showToast('Carrito vaciado', 'success');
    };

    const handleConfirmOrder = async () => {
        if (cart.length === 0) {
            showToast('Agrega productos al carrito para continuar', 'error');
            return;
        }
        
        if (!validateForm()) {
            showToast('Por favor completa todos los campos requeridos', 'error');
            return;
        }
        
        try {
            setIsSubmitting(true);
            const orderData = {
                customer: {
                    nombre: customerData.nombre,
                    telefono: customerData.telefono,
                    direccion: customerData.direccion,
                    codigo_postal: customerData.codigo_postal,
                    referencias: customerData.referencias || '',
                },
                items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    comment: item.comment || '',
                })),
            };
            
            const response = await externalOrderDelivery(uuid, orderData);
            
            // Guardar el folio web
            setOrderFolio(response.folio_web);
            
            // Mostrar modal de éxito
            setShowSuccessModal(true);
            
            // Limpiar después de 5 segundos
            setTimeout(() => {
                setCart([]);
                setCustomerData({ nombre: '', telefono: '', direccion: '', codigo_postal: '', referencias: '' });
                setShowCustomerForm(false);
                setShowSuccessModal(false);
                setOrderFolio(null);
                setIsDeliveryMode(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 5000);
        } catch (error) {
            console.error('Error al enviar pedido:', error);
            showToast('Error al realizar el pedido. Por favor intenta de nuevo.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

    // Componente para controles de delivery en las cards de productos
    const DeliveryProductControls = ({ producto, onAddToCart, currentStyle, style }) => {
        const [quantity, setQuantity] = useState(1);
        const [comment, setComment] = useState('');
        const [showCommentInput, setShowCommentInput] = useState(false);

        const handleIncrement = () => setQuantity(prev => prev + 1);
        const handleDecrement = () => { if (quantity > 1) setQuantity(prev => prev - 1); };

        const handleAdd = () => {
            if (producto.status !== 'activo') {
                showToast('Este producto no está disponible', 'error');
                return;
            }
            onAddToCart(producto, quantity, comment);
            setQuantity(1);
            setComment('');
            setShowCommentInput(false);
        };

        return (
            <div className="space-y-3">
                {/* Controles de cantidad */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Cantidad:</span>
                    <div className="flex items-center gap-3 bg-green-50 rounded-full px-2 py-1">
                        <button onClick={handleDecrement} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-green-600 hover:bg-green-100 transition-colors shadow-sm">
                            <FiMinus size={18} />
                        </button>
                        <span className="text-lg font-bold text-green-700 min-w-[30px] text-center">{quantity}</span>
                        <button onClick={handleIncrement} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-green-600 hover:bg-green-100 transition-colors shadow-sm">
                            <FiPlus size={18} />
                        </button>
                    </div>
                </div>

                {/* Botón para mostrar comentarios */}
                <button onClick={() => setShowCommentInput(!showCommentInput)} className="w-full flex items-center justify-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium py-2 transition-colors">
                    <FiMessageSquare size={16} />
                    {showCommentInput ? 'Ocultar comentarios' : 'Agregar comentarios'}
                </button>

                {/* Input de comentarios */}
                {showCommentInput && (
                    <div className="animate-fadeIn">
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ej: Sin cebolla, extra queso..." className="w-full px-3 py-2 text-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" rows="3" />
                    </div>
                )}

                {/* Botón agregar al carrito */}
                <button onClick={handleAdd} disabled={producto.status !== 'activo'} className={`w-full font-bold py-3 px-4 rounded-lg transition-all transform shadow-md flex items-center justify-center gap-2 ${
                    producto.status === 'activo' 
                        ? `bg-gradient-to-r ${currentStyle.colors.buttonGradient} hover:scale-105 text-white ${style === 'tokyo' ? currentStyle.colors.neonGlow : ''}` 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}>
                    <FiShoppingCart size={20} />
                    {producto.status === 'activo' ? 'Agregar al carrito' : 'No disponible'}
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando menú...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <>
      <Head>
        <title>Menú - {restauranteInfo?.nombre_restaurante && esValorValido(restauranteInfo.nombre_restaurante) 
        ? restauranteInfo.nombre_restaurante 
        : "WapiFood"}</title>
        <meta name="description" content="Menú digital del restaurante - Descubre nuestros deliciosos platillos" />
        <link rel="icon" href="/favicon.ico" />
        {/* Canónico y Open Graph dinámicos por restaurante/UUID */}
        <link rel="canonical" href={`${baseUrl}/webmenu/${uuid || ''}${style ? `?style=${style}` : ''}`} />
        <meta property="og:title" content={`Menú - ${restauranteInfo?.nombre_restaurante || 'WapiFood'}`} />
        <meta property="og:description" content="Menú digital del restaurante - Descubre nuestros deliciosos platillos" />
        <meta property="og:url" content={`${baseUrl}/webmenu/${uuid || ''}${style ? `?style=${style}` : ''}`} />
        <meta property="og:type" content="website" />
      </Head>
        
        {/* Toast */}
        {toast.show && <Toast message={toast.message} type={toast.type} />}
        
        {/* Loading Overlay */}
        {isSubmitting && <LoadingOverlay />}
        
        <section className={`min-h-screen bg-gradient-to-br ${currentStyle.colors.background} relative pb-16 ${
            style === 'tokyo' ? currentStyle.colors.backgroundPattern : ''
        }`}>
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-20 left-10 w-32 h-32 ${currentStyle.colors.decorativeCircles[0]} rounded-full opacity-30 blur-xl animate-pulse`}></div>
                <div className={`absolute top-40 right-20 w-40 h-40 ${currentStyle.colors.decorativeCircles[1]} rounded-full opacity-25 blur-xl animate-pulse delay-1000`}></div>
                <div className={`absolute bottom-32 left-1/4 w-24 h-24 ${currentStyle.colors.decorativeCircles[2]} rounded-full opacity-20 blur-lg animate-pulse delay-500`}></div>
                <div className={`absolute bottom-20 right-10 w-36 h-36 ${currentStyle.colors.decorativeCircles[3]} rounded-full opacity-15 blur-2xl animate-pulse delay-1500`}></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50">
                <nav className={`w-full bg-gradient-to-r ${currentStyle.colors.headerGradient} text-white p-4 shadow-lg ${
                    style === 'tokyo' ? currentStyle.colors.neonGlow : ''
                }`}>
                    <div className="flex items-center max-w-7xl mx-auto justify-between">
                        <div className="flex items-center gap-4">
                            <GoChecklist size={36} className={`${
                                style === 'tokyo' ? 'text-cyan-300' : 'text-yellow-300'
                            } drop-shadow-lg ${style === 'tokyo' ? currentStyle.colors.textGlow : ''}`} />
                            <button
                                onClick={() => router.push('/')}
                                className={`text-3xl font-bold text-white hover:text-yellow-200 transition-colors duration-200 cursor-pointer ${
                                    style === 'tokyo' ? currentStyle.colors.textGlow : ''
                                }`}
                            >
                                WapiFood
                            </button>
                            
                            {/* Switch Button para Delivery */}
                            <div className="hidden md:flex items-center gap-3 ml-6 bg-white/20 rounded-full p-1">
                                <button
                                    onClick={() => setIsDeliveryMode(false)}
                                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                                        !isDeliveryMode 
                                            ? currentStyle.colors.deliverySwitchActive
                                            : currentStyle.colors.deliverySwitchInactive
                                    }`}
                                >
                                    Ver Menú
                                </button>
                                <button
                                    onClick={() => setIsDeliveryMode(true)}
                                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
                                        isDeliveryMode 
                                            ? currentStyle.colors.deliverySwitchActive
                                            : currentStyle.colors.deliverySwitchInactive
                                    }`}
                                >
                                    <MdDeliveryDining size={20} />
                                    Delivery
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* Carrito (solo en modo delivery) */}
                            {isDeliveryMode && (
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-4 rounded-full transition-all shadow-lg"
                                >
                                    <FiShoppingCart size={24} />
                                    {getTotalItems() > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                                            {getTotalItems()}
                                        </span>
                                    )}
                                </button>
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
                    
                    {/* Switch móvil */}
                    <div className="flex md:hidden items-center gap-2 mt-3 bg-white/20 rounded-full p-1">
                        <button
                            onClick={() => setIsDeliveryMode(false)}
                            className={`flex-1 py-2 rounded-full font-semibold text-sm transition-all ${
                                !isDeliveryMode 
                                    ? currentStyle.colors.deliverySwitchActive
                                    : currentStyle.colors.deliverySwitchInactive
                            }`}
                        >
                            Ver Menú
                        </button>
                        <button
                            onClick={() => setIsDeliveryMode(true)}
                            className={`flex-1 py-2 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                                isDeliveryMode 
                                    ? currentStyle.colors.deliverySwitchActive
                                    : currentStyle.colors.deliverySwitchInactive
                            }`}
                        >
                            <MdDeliveryDining size={18} />
                            Delivery
                        </button>
                    </div>
                </nav>
            </header>

            {/* Menú lateral remodelado */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gradient-to-br ${currentStyle.colors.sidebarBg} shadow-2xl ${
                        style === 'tokyo' 
                            ? 'border-r border-pink-500/30' 
                            : `border-r border-${currentStyle.colors.primary}-200`
                    }
                    transition-transform duration-300 ease-in-out menu-container z-[60]
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <ul className="flex flex-col mt-16 p-4 text-xl">
                    <p className={`${currentStyle.colors.textPrimary} font-bold mb-2 ${
                        style === 'tokyo' ? currentStyle.colors.textGlow : ''
                    }`}>Menú principal</p>
                    {obtenerCategorias().map((categoria, index) => (
                        <li
                            key={index}
                            className={`flex ${currentStyle.colors.sidebarHover} p-2 rounded-xl cursor-pointer gap-2 transition-all duration-200`}
                            onClick={() => {
                                setCategoriaSeleccionada(categoria);
                                setIsOpen(false);
                            }}
                        >
                            {categoria === "Todos los platillos" && <IoHomeOutline className={`self-center ${currentStyle.colors.textSecondary}`} />}
                            <span className={`font-semibold ${currentStyle.colors.sidebarText}`}>{categoria}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Overlay para cerrar el menú al hacer clic fuera */}
            {isOpen && (
                <div 
                    className={`fixed inset-0 z-40 ${currentStyle.colors.overlayBg}`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Header del restaurante remodelado */}
            <div className={`w-full shadow-md ${
                style === 'tokyo' 
                    ? 'bg-slate-800/80 border-pink-500/30' 
                    : 'bg-white/80'
            } backdrop-blur-sm flex px-4 py-6 rounded-2xl border ${currentStyle.colors.cardBorder} relative  ${
                style === 'tokyo' ? currentStyle.colors.cardGlow : ''
            } ${restauranteInfo?.image && esValorValido(restauranteInfo.image) 
                    ? 'h-70' 
                    : 'h-30'
            }`}> 
                <div className="w-full flex items-center justify-center flex-col">
                    {restauranteInfo?.image && esValorValido(restauranteInfo.image) && (
                        <Image
                            src={restauranteInfo.image}
                            alt="Perfil"
                            className={`rounded-full w-20 h-20 mr-4 object-contain border-4 ${
                                style === 'tokyo' 
                                    ? 'border-pink-500' 
                                    : `border-${currentStyle.colors.primary}-200`
                            } shadow-lg ${style === 'tokyo' ? currentStyle.colors.neonGlow : ''}`}
                            width={80}
                            height={80}
                        />
                    )}
                    <p className={`font-bold text-2xl drop-shadow ${
                        style === 'tokyo' 
                            ? `text-cyan-300 ${currentStyle.colors.textGlow}` 
                            : currentStyle.colors.restaurantNameText
                    }`}>{restauranteInfo?.nombre_restaurante && esValorValido(restauranteInfo.nombre_restaurante) 
                        ? restauranteInfo.nombre_restaurante 
                        : "Las flautas de pepe"}
                    </p>
                    {restauranteInfo?.direccion && esValorValido(restauranteInfo.direccion) && (
                        <p className={`text-sm pt-2 ${currentStyle.colors.restaurantInfoText}`}>| {restauranteInfo.direccion} |</p>
                    )}
                    {(
                        (restauranteInfo?.ciudad && esValorValido(restauranteInfo.ciudad)) ||
                        (restauranteInfo?.alcaldia && esValorValido(restauranteInfo.alcaldia)) ||
                        (restauranteInfo?.codigo_postal && esNumeroValido(restauranteInfo.codigo_postal))
                    ) && (
                        <p className={`text-sm ${currentStyle.colors.restaurantInfoText}`}>
                            |
                            {restauranteInfo?.ciudad && esValorValido(restauranteInfo.ciudad) && ` ${restauranteInfo.ciudad}`}
                            {restauranteInfo?.alcaldia && esValorValido(restauranteInfo.alcaldia) && `, ${restauranteInfo.alcaldia}`}
                            {restauranteInfo?.codigo_postal && esNumeroValido(restauranteInfo.codigo_postal) && ` CP: ${restauranteInfo.codigo_postal}`}
                            |
                        </p>
                    )}
                    {restauranteInfo?.horario && esValorValido(restauranteInfo.horario) && (
                        <div className="flex items-center gap-2">
                            <p className={`text-sm flex py-2 ${currentStyle.colors.restaurantInfoText}`}>
                                | 
                                <span className="px-2 self-center">
                                    <MdOutlineWatchLater className={currentStyle.colors.textSecondary} />
                                </span> 
                                {restauranteInfo.horario} 
                                |
                            </p>
                        </div>
                    )}
                    {restauranteInfo?.telefono && esValorValido(restauranteInfo.telefono) && (
                        <p className={`text-sm flex ${currentStyle.colors.restaurantInfoText}`}>
                            | 
                            <span className="px-2 self-center"> 
                                <FaPhoneAlt className={currentStyle.colors.textSecondary}/> 
                            </span>
                            {restauranteInfo.telefono} 
                            |
                        </p>
                    )}
                    {restauranteInfo?.whatsapp && esValorValido(restauranteInfo.whatsapp) && (
                        <button 
                            className="cursor-pointer py-2"
                            onClick={() => window.open(`${restauranteInfo.whatsapp}`, '_blank')}
                            title="Contactar por WhatsApp"
                        >
                            <FaWhatsapp className={`text-xl ${currentStyle.colors.textSecondary} hover:${currentStyle.colors.textPrimary} transition-colors`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Buscador remodelado */}
            <div className={`sticky top-16 z-50 bg-gradient-to-br from-gray-50 via-white to-green-50 w-full px-4 py-4 sm:py-6 transition-opacity duration-200 ${(modalOpen || isCartOpen || showCustomerForm) ? 'hidden' : ''}`}>
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className={`w-full px-4 py-3 pl-12 border-2 ${currentStyle.colors.inputBorder} rounded-xl focus:outline-none focus:ring-2 ${
                            currentStyle.colors.inputBg
                        } backdrop-blur-sm shadow-lg transition-all duration-200 hover:border-${currentStyle.colors.primary}-300 ${
                            style === 'tokyo' 
                                ? `text-cyan-300 ${currentStyle.colors.inputPlaceholder} ${currentStyle.colors.neonGlow}` 
                                : `${currentStyle.colors.inputText} ${currentStyle.colors.inputPlaceholder}`
                        }`}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className={`h-5 w-5 ${currentStyle.colors.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    {busqueda && (
                        <button
                            onClick={() => setBusqueda("")}
                            className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                                style === 'tokyo' 
                                    ? 'text-pink-400 hover:text-cyan-400' 
                                    : `text-${currentStyle.colors.primary}-400 hover:text-${currentStyle.colors.primary}-600`
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {busqueda && (
                    <p className={`mt-2 text-sm ${
                        style === 'tokyo' ? 'text-cyan-400' : currentStyle.colors.textPrimary
                    }`}>
                        {productosFiltrados.length} resultado(s) encontrado(s) para {busqueda}
                    </p>
                )}
                </div>
            </div>

            <div className="relative z-0">

            {/* Modal de producto remodelado */}
            {modalOpen && productoSeleccionado && (
                <div
                    className="fixed inset-0 flex justify-center items-center z-[999999] bg-black/40 backdrop-blur-sm animate-fadeIn"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className={`${
                        style === 'tokyo' 
                            ? 'bg-slate-800 border-pink-500/30' 
                            : 'bg-white'
                    } rounded-3xl shadow-2xl w-11/12 md:w-[420px] border ${currentStyle.colors.cardBorder} max-h-[90vh] overflow-y-auto relative p-6 animate-slideUp ${
                        style === 'tokyo' ? currentStyle.colors.cardGlow : ''
                    }`}>
                        <button
                            className={`absolute top-4 right-4 ${
                                style === 'tokyo' 
                                    ? 'text-pink-400 hover:text-cyan-400' 
                                    : `text-${currentStyle.colors.primary}-500 hover:text-${currentStyle.colors.primary}-700`
                            } transition-colors text-2xl`}
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>
                        <div className="flex flex-col items-center">
                            <div className="w-full h-40 mb-4 flex justify-center">
                                <Image
                                    src={productoSeleccionado.imagen}
                                    alt={`Imagen de ${productoSeleccionado.nombre}`}
                                    className="rounded-lg object-cover w-5/10 h-10/10"
                                    width={400}
                                    height={300}
                                />
                            </div>
                            <h2 className={`text-2xl font-bold mb-2 text-center drop-shadow ${
                                style === 'tokyo' 
                                    ? `text-cyan-300 ${currentStyle.colors.textGlow}` 
                                    : currentStyle.colors.textPrimary
                            }`}>{productoSeleccionado.nombre}</h2>
                            <p className={`${
                                style === 'tokyo' 
                                    ? `${currentStyle.colors.badge} ${currentStyle.colors.neonGlow}` 
                                    : `${currentStyle.colors.badgeBg} ${currentStyle.colors.badgeText}`
                            } rounded-full px-4 py-1 text-sm font-semibold mb-2`}>{productoSeleccionado.categoria}</p>
                            <p className={`text-lg font-bold mb-4 ${
                                style === 'tokyo' 
                                    ? `text-cyan-300 ${currentStyle.colors.textGlow}` 
                                    : currentStyle.colors.textSecondary
                            }`}>
                                ${productoSeleccionado.precio.toFixed(2)} 
                            </p>
                            <p className={`text-center text-md leading-relaxed mb-4 ${
                                style === 'tokyo' ? 'text-pink-300' : 'text-gray-700'
                            }`}>
                                {productoSeleccionado.descripcion}
                            </p>
                            <div className="flex gap-2 mt-2">
                                {productoSeleccionado.status === "activo" ? (
                                    <span className={`${
                                        style === 'tokyo' 
                                            ? `${currentStyle.colors.badge} ${currentStyle.colors.neonGlow}` 
                                            : `${currentStyle.colors.badge}`
                                    } text-white px-3 py-1 rounded-full text-xs font-medium shadow`}>Disponible</span>
                                ) : (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow">No disponible</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>
            )}

            {/* Grid de productos remodelado */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12 relative z-10">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados
                        .map((producto) => (
                            <div
                                key={producto.id}
                                className={`${currentStyle.colors.cardBg} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border ${currentStyle.colors.cardBorder} overflow-hidden group ${
                                    style === 'tokyo' ? currentStyle.colors.cardGlow : ''
                                }`}
                            >
                                {/* Imagen del producto */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={producto.imagen}
                                        alt={`Imagen de ${producto.nombre}`}
                                        className="rounded-t-2xl w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        width={300}
                                        height={200}
                                    />
                                    {/* Badge de estado */}
                                    {producto.status === "activo" ? (
                                        <div className={`absolute top-3 right-3 ${
                                            style === 'tokyo' 
                                                ? `${currentStyle.colors.badge} text-white ${currentStyle.colors.neonGlow}` 
                                                : `${currentStyle.colors.badge} text-white`
                                        } px-2 py-1 rounded-full text-xs font-medium shadow`}>
                                            Disponible
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow">
                                                No Disponible
                                            </div>
                                        </div>
                                    )}
                                    {/* Precio flotante */}
                                    <div className={`absolute bottom-3 left-3 ${
                                        style === 'tokyo' 
                                            ? 'bg-slate-900/90 border border-cyan-500/50' 
                                            : 'bg-white/90'
                                    } backdrop-blur-sm px-3 py-1 rounded-full shadow-lg`}>
                                        <span className={`text-lg font-bold ${
                                            style === 'tokyo' 
                                                ? `text-cyan-300 ${currentStyle.colors.textGlow}` 
                                                : currentStyle.colors.textSecondary
                                        }`}>
                                            ${producto.precio.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                {/* Info del producto */}
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className={`font-bold text-xl ${style === 'tokyo' ? `text-cyan-300 ${currentStyle.colors.textGlow}` : currentStyle.colors.textCard}`}>
                                            {producto.nombre}
                                        </h3>
                                    </div>
                                    <p className={`mb-4 line-clamp-2 min-h-[3rem] ${style === 'tokyo' ? 'text-pink-300' : 'text-gray-500'}`}>
                                        {producto.descripcion.length > 80
                                            ? `${producto.descripcion.slice(0, 80)}...`
                                            : producto.descripcion}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <p className={`${style === 'tokyo' ? `${currentStyle.colors.badge} text-white ${currentStyle.colors.neonGlow}` : `${currentStyle.colors.badgeBg} ${currentStyle.colors.badgeText}`} rounded-full px-4 py-1 text-sm font-semibold`}>
                                            {producto.categoria}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        {!isDeliveryMode ? (
                                            <button
                                                className={`flex gap-4 items-center justify-center bg-gradient-to-r ${currentStyle.colors.buttonGradient} text-white px-4 py-2 rounded-lg text-sm cursor-pointer w-full shadow-lg font-semibold transition-all duration-200 ${style === 'tokyo' ? currentStyle.colors.neonGlow : ''}`}
                                                onClick={() => openModal(producto)}
                                            >
                                                <FaRegEye className="h-[20px] w-[20px]" />Detalles
                                            </button>
                                        ) : (
                                            <DeliveryProductControls 
                                                producto={producto} 
                                                onAddToCart={handleAddToCart}
                                                currentStyle={currentStyle}
                                                style={style}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className={`text-lg ${style === 'tokyo' ? 'text-pink-300' : 'text-gray-500'}`}>
                            No se encontraron productos.
                        </p>
                    </div>
                )}
            </section>

            {/* Modal del Carrito */}
            {isCartOpen && isDeliveryMode && (
                <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 z-[9999] flex items-end md:items-center justify-center">
                    <div className="bg-white w-full md:max-w-2xl md:mx-4 rounded-t-3xl md:rounded-2xl h-[70vh] flex flex-col shadow-2xl animate-slideUp">
                        {/* Header del carrito */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-3xl md:rounded-t-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FiShoppingCart className="text-white" size={28} />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Mi Carrito</h2>
                                    <p className="text-green-100 text-sm">
                                        {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Items del carrito */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <FiShoppingCart size={64} className="mb-4" />
                                    <p className="text-lg font-semibold">Tu carrito está vacío</p>
                                    <p className="text-sm">Agrega productos para continuar</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item, index) => (
                                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                            <div className="flex gap-3">
                                                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                    {item.image_url && (
                                                        <Image src={item.image_url} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">{item.name}</h3>
                                                    <p className="text-green-600 font-bold text-lg mb-2">${(item.price * item.quantity).toFixed(2)}</p>
                                                    {item.comment && (
                                                        <div className="bg-amber-50 border border-amber-200 rounded-md p-2 mb-2">
                                                            <p className="text-xs text-amber-800"><span className="font-semibold">Nota:</span> {item.comment}</p>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 bg-green-50 rounded-full px-2 py-1">
                                                            <button onClick={() => handleUpdateQuantity(index, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-green-600 hover:bg-green-100 transition-colors shadow-sm" disabled={item.quantity <= 1}>
                                                                <FiMinus size={14} />
                                                            </button>
                                                            <span className="text-sm font-bold text-green-700 min-w-[25px] text-center">{item.quantity}</span>
                                                            <button onClick={() => handleUpdateQuantity(index, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-green-600 hover:bg-green-100 transition-colors shadow-sm">
                                                                <FiPlus size={14} />
                                                            </button>
                                                        </div>
                                                        <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:bg-red-50 rounded-full p-2 transition-colors">
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer con total */}
                        {cart.length > 0 && (
                            <div className="border-t border-gray-200 p-6 bg-gray-50">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xl font-bold text-gray-700">Total:</span>
                                    <span className={`text-3xl font-bold ${currentStyle.colors.textSecondary}`}>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <button onClick={handleContinueWithOrder} className={`w-full bg-gradient-to-r ${currentStyle.colors.deliveryButtonGradient} text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg`}>
                                    Continuar con mi pedido
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Formulario del cliente */}
            {showCustomerForm && isDeliveryMode && (
                <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 z-[9999] flex items-center justify-center p-4 overflow-y-auto pt-32">
                    <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full my-8">
                        <div className={`bg-gradient-to-r ${currentStyle.colors.deliveryButtonGradient} p-6 rounded-t-xl`}>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <MdDeliveryDining size={28} />
                                Datos de entrega
                            </h2>
                        </div>
                        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo * <span className="text-gray-500 font-normal">(máx. 30 caracteres)</span></label>
                                <input type="text" value={customerData.nombre || ''} onChange={(e) => setCustomerData({...customerData, nombre: e.target.value})} placeholder="Juan Pérez" maxLength="30" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${formErrors.nombre ? currentStyle.colors.deliveryInputError : currentStyle.colors.deliveryInputBorder}`} />
                                {formErrors.nombre && <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>}
                            </div>
                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono * <span className="text-gray-500 font-normal">(máx. 10 dígitos)</span></label>
                                <input type="tel" value={customerData.telefono || ''} onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setCustomerData({...customerData, telefono: value});
                                }} placeholder="5512345678" maxLength="10" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${formErrors.telefono ? currentStyle.colors.deliveryInputError : currentStyle.colors.deliveryInputBorder}`} />
                                {formErrors.telefono && <p className="text-red-500 text-xs mt-1">{formErrors.telefono}</p>}
                            </div>
                            {/* Dirección */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección completa * <span className="text-gray-500 font-normal">(máx. 120 caracteres)</span></label>
                                <textarea value={customerData.direccion || ''} onChange={(e) => setCustomerData({...customerData, direccion: e.target.value})} placeholder="Calle, Número, Colonia" rows="3" maxLength="120" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-all ${formErrors.direccion ? currentStyle.colors.deliveryInputError : currentStyle.colors.deliveryInputBorder}`} />
                                {formErrors.direccion && <p className="text-red-500 text-xs mt-1">{formErrors.direccion}</p>}
                            </div>
                            {/* Código Postal */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Código Postal * <span className="text-gray-500 font-normal">(máx. 10 dígitos)</span></label>
                                <input type="text" value={customerData.codigo_postal || ''} onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setCustomerData({...customerData, codigo_postal: value});
                                }} placeholder="12345" maxLength="10" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${formErrors.codigo_postal ? currentStyle.colors.deliveryInputError : currentStyle.colors.deliveryInputBorder}`} />
                                {formErrors.codigo_postal && <p className="text-red-500 text-xs mt-1">{formErrors.codigo_postal}</p>}
                            </div>
                            {/* Referencias */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Referencias (opcional) <span className="text-gray-500 font-normal">(máx. 150 caracteres)</span></label>
                                <textarea value={customerData.referencias || ''} onChange={(e) => setCustomerData({...customerData, referencias: e.target.value})} placeholder="Casa blanca con portón negro, entre calle X y Y" rows="3" maxLength="150" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-all ${currentStyle.colors.deliveryInputBorder}`} />
                            </div>
                            <div className={`p-3 rounded-lg border ${currentStyle.colors.deliveryCardBorder} ${style === 'tokyo' ? 'bg-fuchsia-950/30' : 'bg-green-50'}`}>
                                <p className={`text-xs ${style === 'tokyo' ? 'text-cyan-300' : 'text-green-800'}`}><span className="font-semibold">Nota:</span> Los campos marcados con * son obligatorios</p>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3">
                            <button onClick={() => setShowCustomerForm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all">
                                Volver
                            </button>
                            <button onClick={handleConfirmOrder} className={`flex-1 bg-gradient-to-r ${currentStyle.colors.deliveryButtonGradient} text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}>
                                <MdDeliveryDining size={24} />
                                Confirmar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de éxito con folio */}
            {showSuccessModal && orderFolio && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
                        <div className="p-8 text-center">
                            {/* Checkmark animado */}
                            <div className="mb-6 flex justify-center">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${style === 'tokyo' ? 'bg-fuchsia-500/20' : 'bg-green-100'}`}>
                                    <svg className={`w-16 h-16 ${currentStyle.colors.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Título */}
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                ¡Pedido Confirmado!
                            </h3>
                            
                            {/* Número de folio */}
                            <div className={`mb-4 p-4 rounded-lg border-2 ${currentStyle.colors.deliveryCardBorder} ${style === 'tokyo' ? 'bg-fuchsia-950/30' : 'bg-green-50'}`}>
                                <p className="text-sm text-gray-600 mb-1">Número de Pre-Orden</p>
                                <p className={`text-4xl font-bold ${currentStyle.colors.textSecondary}`}>#{orderFolio}</p>
                            </div>
                            
                            {/* Mensaje */}
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Tu orden se ha mandado al restaurante, el restaurante lo contactará para validar su información
                            </p>
                            
                            {/* Información adicional */}
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-800">
                                    <span className="font-semibold">Importante:</span> Conserva tu número de pre-orden para seguimiento
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de advertencia de delivery desactivado */}
            {showDeliveryWarningModal && (
                <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex items-center justify-center z-[9999] p-4">
                    <div className={`${style === 'tokyo' ? 'bg-slate-800 border-pink-500/30' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn border ${currentStyle.colors.cardBorder} ${style === 'tokyo' ? currentStyle.colors.cardGlow : ''}`}>
                        <div className="p-8 text-center">
                            {/* Icono de advertencia */}
                            <div className="mb-6 flex justify-center">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${style === 'tokyo' ? 'bg-pink-500/20' : 'bg-amber-100'}`}>
                                    <MdDeliveryDining className={`w-16 h-16 ${style === 'tokyo' ? 'text-pink-400' : 'text-amber-600'}`} />
                                </div>
                            </div>
                            
                            {/* Título */}
                            <h3 className={`text-2xl font-bold mb-4 ${style === 'tokyo' ? `text-cyan-300 ${currentStyle.colors.textGlow}` : 'text-gray-800'}`}>
                                Información importante
                            </h3>
                            
                            {/* Mensaje */}
                            <p className={`leading-relaxed mb-6 text-lg ${style === 'tokyo' ? 'text-pink-300' : 'text-gray-600'}`}>
                                <span className="font-semibold">{restauranteInfo?.nombre_restaurante || 'Este restaurante'}</span> no cuenta con envío a domicilio, sin embargo puedes pedir y recoger en el Restaurante
                            </p>
                            
                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancelOrder}
                                    className={`flex-1 ${style === 'tokyo' ? 'bg-slate-700 hover:bg-slate-600 text-pink-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} font-bold py-3 px-6 rounded-xl transition-all`}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAcceptPickup}
                                    className={`flex-1 bg-gradient-to-r ${currentStyle.colors.deliveryButtonGradient} text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg ${style === 'tokyo' ? currentStyle.colors.neonGlow : ''}`}
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Botón flotante inferior (solo delivery) */}
            {isDeliveryMode && cart.length > 0 && !showCustomerForm && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-[998]">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <button onClick={() => { setIsCartOpen(true); }} className={`w-full bg-gradient-to-r ${currentStyle.colors.deliveryButtonGradient} text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                <FiShoppingCart size={24} />
                                <div className="text-left">
                                    <div className="text-sm opacity-90">{getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}</div>
                                    <div className="text-xl font-bold">${calculateTotal().toFixed(2)}</div>
                                </div>
                            </div>
                            <span className="flex items-center gap-2">
                                Ver Carrito
                                <svg className="w-5 h-5 rotate-[-90deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* Estilos extra para animaciones */}
            <style jsx>{`
                .delay-500 { animation-delay: 500ms; }
                .delay-1000 { animation-delay: 1000ms; }
                .delay-1500 { animation-delay: 1500ms; }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease;
                }
                .animate-slideUp {
                    animation: slideUp 0.4s cubic-bezier(.39,.58,.57,1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
            </div>
        </section>

        </>
    );
}