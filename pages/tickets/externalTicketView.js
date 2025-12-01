import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaCheckCircle, FaClock, FaUtensils, FaReceipt } from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { QRCodeCanvas } from 'qrcode.react';

export default function ExternalTicketView() {
    const router = useRouter();
    const { uuid } = router.query;
    
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!uuid) return;

        const fetchTicketData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Llamar al endpoint público (sin autenticación)
                const endpoint = `http://201.137.169.6:8000/orders/${uuid}`;
                
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar el ticket');
                }

                const data = await response.json();
                setTicketData(data);
            } catch (err) {
                console.error('Error al cargar el ticket:', err);
                setError('No se pudo cargar el ticket. Verifica el código QR.');
            } finally {
                setLoading(false);
            }
        };

        fetchTicketData();
    }, [uuid]);

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

    if (loading) {
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
            </>
        );
    }

    if (error || !ticketData) {
        return (
            <>
                <Head>
                    <title>Error al cargar ticket | WapiFood</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                </Head>
                <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoClose className="text-red-600 text-3xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
                        <p className="text-gray-600 mb-6">{error || 'No se pudo cargar el ticket'}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
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
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <FaReceipt className="text-xl" />
                                {ticketData.restaurant_name || 'WapiFood'}
                            </h1>
                            <div className="bg-white text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                #{ticketData.ticket_number || 'N/A'}
                            </div>
                        </div>
                        <p className="text-green-100 text-sm">
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
                                
                                return (
                                    <div key={index} className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 transition-transform hover:scale-[1.02]">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-800 text-base mb-1">
                                                    {product.product_name}
                                                </h3>
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
                                value={ticketData.order_uuid}
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
