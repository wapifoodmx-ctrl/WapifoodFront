import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FaCheckCircle, FaClock, FaUtensils, FaReceipt } from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { GoChecklist } from 'react-icons/go';
import { QRCodeCanvas } from 'qrcode.react';
import { getTicketMeserosDetails } from '../../useCases/getTicketMeserosDetails';
import { toast } from '../../components/Toast';
import ToastContainer from '../../components/Toast';

export default function ExternalTicketView() {
    const router = useRouter();
    const { uuid } = router.query;
    
    const [ticketData, setTicketData] = useState(null);
    const [meseroName, setMeseroName] = useState('');
    const [previousProductsStatus, setPreviousProductsStatus] = useState({});
    const [audioContext, setAudioContext] = useState(null);
    
    // useRef para mantener siempre el estado más actual
    const previousProductsStatusRef = useRef({});
    const isInitialLoadRef = useRef(true); // Rastrear si es la primera carga
    const hasValidDataRef = useRef(false); // Rastrear si alguna vez hemos tenido datos válidos

    // Inicializar AudioContext después de la primera interacción del usuario
    useEffect(() => {
        const initAudio = () => {
            try {
                const context = new (window.AudioContext || window.webkitAudioContext)();
                setAudioContext(context);
            } catch (error) {
                // Error silencioso
            }
        };

        // Inicializar después de cualquier click en la página
        const handleUserInteraction = () => {
            if (!audioContext) {
                initAudio();
                document.removeEventListener('click', handleUserInteraction);
                document.removeEventListener('touchstart', handleUserInteraction);
            }
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
        };
    }, [audioContext]);

    // Función para reproducir sonido de notificación
    const playNotificationSound = () => {
        try {
            let context = audioContext;
            
            if (!context) {
                context = new (window.AudioContext || window.webkitAudioContext)();
                setAudioContext(context);
            }

            if (context.state === 'suspended') {
                context.resume();
            }
            
            // Reproducir 3 beeps cortos
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    try {
                        const oscillator = context.createOscillator();
                        const gainNode = context.createGain();
                        
                        oscillator.connect(gainNode);
                        gainNode.connect(context.destination);
                        
                        oscillator.frequency.value = 1000;
                        oscillator.type = 'square';
                        
                        gainNode.gain.setValueAtTime(0.8, context.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
                        
                        oscillator.start(context.currentTime);
                        oscillator.stop(context.currentTime + 0.3);
                    } catch (beepError) {
                        // Error silencioso
                    }
                }, i * 400);
            }
            
            // Fallback: vibración en móviles
            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200, 100, 200]);
            }
        } catch (error) {
            // Error silencioso
        }
    };

    // Solicitar permiso para notificaciones
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (!uuid) return;

        const fetchTicketData = async () => {
            try {
                const wasInitialLoad = isInitialLoadRef.current;
                
                // Llamar al endpoint público (sin autenticación)
                const endpoint = `https://api.wapifood.com/orders/${uuid}`;
                
                // Agregar timeout de 15 segundos para evitar que se quede colgado en móviles
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);
                
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                // Validar que la respuesta tenga la estructura esperada
                if (!data || typeof data !== 'object') {
                    throw new Error('Respuesta inválida del servidor');
                }
                
                // Verificar cambios de estado solo si NO es la primera carga
                if (!wasInitialLoad && data.products) {
                    data.products.forEach(product => {
                        const productId = product.id_orders_details;
                        const newStatus = product.order_detail_status;
                        const previousStatus = previousProductsStatusRef.current[productId];

                        // Si el estado cambió a "Preparado" y antes no lo estaba
                        if (newStatus === 'Preparado') {
                            if (!previousStatus || previousStatus !== 'Preparado') {
                                playNotificationSound();
                                
                                // Notificación del navegador
                                if ('Notification' in window && Notification.permission === 'granted') {
                                    new Notification('¡Producto listo!', {
                                        body: `${product.product_name} está preparado`,
                                        icon: '/favicon.ico',
                                    });
                                }
                            }
                        }
                    });
                    
                    // SIEMPRE actualizar estados previos después de verificar
                    const newProductsStatus = {};
                    data.products.forEach(product => {
                        newProductsStatus[product.id_orders_details] = product.order_detail_status;
                    });
                    previousProductsStatusRef.current = newProductsStatus;
                    setPreviousProductsStatus(newProductsStatus);
                } else if (wasInitialLoad && data.products) {
                    // Primera carga - inicializar estados previos sin notificar
                    const initialStatus = {};
                    data.products.forEach(product => {
                        initialStatus[product.id_orders_details] = product.order_detail_status;
                    });
                    previousProductsStatusRef.current = initialStatus;
                    setPreviousProductsStatus(initialStatus);
                    
                    // Marcar que ya NO es la primera carga
                    isInitialLoadRef.current = false;
                }
                
                // Actualizar ticketData de forma segura
                setTicketData(prevData => {
                    // Si es la misma estructura, React podría no re-renderizar
                    // así que creamos un nuevo objeto para forzar el update
                    return { ...data };
                });
                
                // Marcar que tenemos datos válidos
                hasValidDataRef.current = true;
                
                // Cargar información del mesero solo si hay token disponible
                try {
                    // Verificar si hay token disponible (usuario autenticado)
                    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                    
                    if (token) {
                        const meserosData = await getTicketMeserosDetails();
                        
                        // Buscar la orden actual en los datos de meseros
                        const currentOrder = meserosData.find(order => order.order_uuid === uuid);
                        
                        if (currentOrder && currentOrder.waiters && currentOrder.waiters.length > 0) {
                            // Obtener el último mesero (quien finalizó la orden)
                            const lastWaiter = currentOrder.waiters[currentOrder.waiters.length - 1];
                            
                            // Solo mostrar si no es mesa 1 (punto de venta)
                            if (data.mesa_number !== 1) {
                                setMeseroName(lastWaiter.name);
                            }
                        }
                    }
                } catch (meseroError) {
                    // No mostrar error al usuario
                }
                
                // Marcar que ya no es la primera carga después de obtener datos
                if (wasInitialLoad) {
                    isInitialLoadRef.current = false;
                }
            } catch (err) {
                // Mostrar toast con el error
                if (isInitialLoadRef.current) {
                    // Primera carga falló, mostrar toast
                    toast.error('No se pudo cargar el ticket. Reintentando...');
                    isInitialLoadRef.current = false;
                } else {
                    // Actualización falló, mostrar toast pero mantener datos anteriores
                    toast.warning('Error al actualizar. Mostrando última versión conocida.');
                }
            }
        };

        // Cargar datos iniciales
        fetchTicketData();

        // Configurar polling cada 60 segundos
        const pollInterval = setInterval(() => {
            fetchTicketData();
        }, 60000);

        // Limpiar intervalo al desmontar
        return () => {
            clearInterval(pollInterval);
        };
    }, [uuid]); // Solo depender de uuid

    // Calcular descuentos por producto
    const calculateProductDiscount = (product) => {
        const quantity = parseFloat(product.quantity);
        const unitPrice = parseFloat(product.unit_price);
        const subtotal = parseFloat(product.subtotal);
        const expectedTotal = quantity * unitPrice;

        if (subtotal < expectedTotal) {
            return {
                hasDiscount: true,
                originalPrice: expectedTotal,
                discount: expectedTotal - subtotal
            };
        }

        return { hasDiscount: false };
    };

    // Calcular descuento total
    const calculateTotalDiscount = () => {
        if (!ticketData) return { hasDiscount: false };

        const productsTotal = ticketData.products.reduce((sum, product) => {
            return sum + parseFloat(product.subtotal);
        }, 0);

        const orderTotal = parseFloat(ticketData.total);

        if (orderTotal < productsTotal) {
            return {
                hasDiscount: true,
                originalTotal: productsTotal,
                discount: productsTotal - orderTotal
            };
        }

        return { hasDiscount: false };
    };

    const totalDiscountInfo = ticketData ? calculateTotalDiscount() : { hasDiscount: false };

    // Función para formatear método de pago
    const displayPaymentMethod = (method) => {
        if (!method) return 'No especificado';
        if (method === 'pasarela') return 'Aplicación';
        return String(method).charAt(0).toUpperCase() + String(method).slice(1);
    };

    // Solo mostrar loading si no hay datos válidos aún
    if (!ticketData && !hasValidDataRef.current) {
        return (
            <>
                <Head>
                    <title>Cargando ticket... | WapiFood</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                </Head>
                <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Cargando tu ticket...</p>
                    </div>
                </div>
                <ToastContainer />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Ticket #{ticketData.ticket_number || 'N/A'} | {ticketData.restaurant_name || 'WapiFood'}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name="description" content={`Ticket de compra - ${ticketData.restaurant_name || 'WapiFood'}`} />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6 px-4 shadow-lg sticky top-0 z-10">
                    <div className="max-w-2xl mx-auto">
                        {/* Logo WapiFood */}
                        <div className="flex items-center justify-center mb-4">
                            <GoChecklist className="text-yellow-300 drop-shadow-lg text-3xl sm:text-4xl" />
                            <h1 className="text-2xl sm:text-3xl font-bold ml-2 bg-gradient-to-r from-yellow-300 via-green-100 to-white bg-clip-text text-transparent">
                                WapiFood
                            </h1>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                                <FaReceipt className="text-base sm:text-lg" />
                                {ticketData.restaurant_name || 'Restaurante'}
                            </h2>
                            <div className="bg-white text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                #{ticketData.ticket_number || 'N/A'}
                            </div>
                        </div>
                        <p className="text-green-100 text-xs sm:text-sm">
                            Ticket de compra - {new Date(ticketData.date_time).toLocaleDateString('es-MX', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="max-w-2xl mx-auto p-4 pb-8">
                    {/* Estado del pedido */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    ticketData.order_status === 'Finalizado' ? 'bg-green-100' :
                                    ticketData.order_status === 'Cancelado' ? 'bg-red-100' :
                                    'bg-yellow-100'
                                }`}>
                                    {ticketData.order_status === 'Finalizado' ? (
                                        <FaCheckCircle className="text-green-600 text-2xl" />
                                    ) : ticketData.order_status === 'Cancelado' ? (
                                        <IoClose className="text-red-600 text-2xl" />
                                    ) : (
                                        <FaClock className="text-yellow-600 text-2xl" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Estado del pedido</p>
                                    <p className={`text-lg font-bold ${
                                        ticketData.order_status === 'Finalizado' ? 'text-green-600' :
                                        ticketData.order_status === 'Cancelado' ? 'text-red-600' :
                                        'text-yellow-600'
                                    }`}>
                                        {ticketData.order_status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información del pedido */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MdRestaurant className="text-green-600" />
                            Información del pedido
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Mesa</p>
                                <p className="font-bold text-gray-800">Mesa {ticketData.mesa_number}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Hora</p>
                                <p className="font-bold text-gray-800">
                                    {new Date(ticketData.date_time).toLocaleTimeString('es-MX', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                                <p className="text-xs text-gray-500 mb-1">Método de pago</p>
                                <p className="font-bold text-gray-800">
                                    {displayPaymentMethod(ticketData.metodo_pago)}
                                </p>
                            </div>
                            
                            {/* Mostrar mesero si existe */}
                            {meseroName && (
                                <div className="bg-green-50 rounded-lg p-3 col-span-2 border border-green-200">
                                    <p className="text-xs text-green-600 mb-1">Le atendió</p>
                                    <p className="font-bold text-green-800 text-lg">
                                        {meseroName}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaUtensils className="text-green-600" />
                            Productos ({ticketData.products?.length || 0})
                        </h2>
                        
                        <div className="space-y-3">
                            {ticketData.products?.map((product, index) => {
                                const discountInfo = calculateProductDiscount(product);
                                const isPrepared = product.order_detail_status === 'Preparado';
                                
                                return (
                                    <div key={index} className={`bg-gradient-to-r border rounded-xl p-4 transition-all duration-300 ${
                                        isPrepared 
                                            ? 'from-green-50 to-emerald-50 border-green-300 shadow-md' 
                                            : 'from-gray-50 to-white border-gray-100 hover:scale-[1.02]'
                                    }`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-800 text-base">
                                                        {product.product_name}
                                                    </h3>
                                                    {isPrepared && (
                                                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 animate-pulse">
                                                            <FaCheckCircle className="text-xs" />
                                                            Listo
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                                        x{product.quantity}
                                                    </span>
                                                    <span>•</span>
                                                    <span>${parseFloat(product.unit_price).toFixed(2)} c/u</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-800">
                                                    ${parseFloat(product.subtotal).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {discountInfo.hasDiscount && (
                                            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center text-sm">
                                                <span className="text-gray-500 line-through">
                                                    Precio original: ${discountInfo.originalPrice.toFixed(2)}
                                                </span>
                                                <span className="text-green-600 font-semibold">
                                                    Ahorro: ${discountInfo.discount.toFixed(2)}
                                                </span>
                                            </div>
                                        )}

                                        {product.notes && product.notes !== 'string' && (
                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                <p className="text-xs text-gray-500">Nota:</p>
                                                <p className="text-sm text-gray-700 italic">{product.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg p-6 text-white mb-4">
                        {totalDiscountInfo.hasDiscount && (
                            <>
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-green-400">
                                    <span className="text-green-100">Subtotal</span>
                                    <span className="line-through text-green-200">
                                        ${totalDiscountInfo.originalTotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-green-400">
                                    <span className="text-green-100">Descuento aplicado</span>
                                    <span className="font-bold text-yellow-300">
                                        -${totalDiscountInfo.discount.toFixed(2)}
                                    </span>
                                </div>
                            </>
                        )}
                        
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">Total</span>
                            <span className="text-3xl font-bold">
                                ${parseFloat(ticketData.total).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Código QR */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Código del ticket</h3>
                        <div className="bg-gray-50 inline-block p-4 rounded-xl">
                            <QRCodeCanvas
                                value={`${window.location.origin}/tickets/externalTicketView?uuid=${ticketData.order_uuid}`}
                                size={200}
                                level="M"
                                includeMargin={true}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            Guarda este código para futuras consultas
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-gray-500 text-sm">
                        <p className="mb-2">¡Gracias por tu preferencia!</p>
                        <p className="text-xs">
                            Conserva este ticket como comprobante de tu compra
                        </p>
                        <p className="text-xs mt-4 text-gray-400">
                            Powered by <span className="font-semibold text-green-600">WapiFood</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer />

            <style jsx global>{`
                body {
                    margin: 0;
                    padding: 0;
                    -webkit-tap-highlight-color: transparent;
                }
                
                * {
                    -webkit-overflow-scrolling: touch;
                }
            `}</style>
        </>
    );
}
