import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaFilePdf } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { getTicket } from '@/useCases/getTicket';
import { getTicketMeserosDetails } from '@/useCases/getTicketMeserosDetails';
import { generateTicketPDF, TICKET_SIZES } from '@/utils/pdfGenerator';

export default function TicketModal({ isOpen, onClose, orderUuid }) {
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedSize, setSelectedSize] = useState('STANDARD_80');
    const [meseroName, setMeseroName] = useState('');

    useEffect(() => {
        
        
        if (isOpen && orderUuid) {
            fetchTicketData();
            fetchMeseroData();
        } else {
        }
    }, [isOpen, orderUuid]);

    const fetchTicketData = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getTicket(orderUuid);
            setTicketData(data);
        } catch (err) {
            console.error('Error al obtener datos del ticket:', err);
            console.error('Detalles del error:', err.message, err.stack);
            setError('Error al cargar los datos del ticket');
        } finally {
            setLoading(false);
        }
    };

    const fetchMeseroData = async () => {
        try {
            const meserosData = await getTicketMeserosDetails();
            
            // Buscar la orden actual en los datos de meseros
            const currentOrder = meserosData.find(order => order.order_uuid === orderUuid);
            
            if (currentOrder && currentOrder.waiters && currentOrder.waiters.length > 0) {
                // Obtener el último mesero (quien finalizó la orden)
                const lastWaiter = currentOrder.waiters[currentOrder.waiters.length - 1];
                setMeseroName(lastWaiter.name);
            }
        } catch (err) {
            console.error('Error al obtener datos del mesero:', err);
            // No mostrar error al usuario, simplemente no mostrar mesero
        }
    };

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

    // Calcular descuento en el total
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

    const shouldShowModal = () => {
        // Comentar o eliminar esta verificación si no es necesaria
        // try {
        //     const ticketsEnabled = localStorage.getItem('tickets');
        //     console.log('Permisos de tickets en localStorage:', ticketsEnabled);
        //     return ticketsEnabled === 'true';
        // } catch (error) {
        //     console.error('Error checking tickets permission:', error);
        //     return false;
        // }
        
        // Permitir siempre mostrar el modal
        return true;
    };

    // Nuevo: presentación amigable del método de pago (no modifica ticketData)
    const displayPaymentMethod = (method) => {
        if (!method) return '';
        if (method === 'pasarela') return 'Aplicación';
        return String(method).charAt(0).toUpperCase() + String(method).slice(1);
    };

    // Función para generar PDF automáticamente al cambiar el tamaño
    const handleSizeChange = (sizeKey) => {
        setSelectedSize(sizeKey);
        
        if (!ticketData) return;

        // Calcular descuento total
        const totalDiscountInfo = calculateTotalDiscount();
        
        // Determinar si debe mostrar mesero
        // NO mostrar si: es mesa 1 (punto de venta) O si no hay meseros y no es mesa 1 (auto cobro)
        const shouldShowWaiter = ticketData.mesa_number !== 1 && meseroName;
        
        // Preparar datos para el PDF
        const pdfData = {
            id_pedidos: ticketData.order_id,
            ticket_number: ticketData.ticket_number,
            restaurant_name: ticketData.restaurant_name,
            fecha: new Date(ticketData.date_time).toLocaleDateString('es-MX'),
            hora: new Date(ticketData.date_time).toLocaleTimeString('es-MX'),
            numero_mesa: ticketData.mesa_number,
            estado: ticketData.order_status,
            productos: ticketData.products.map(p => {
                const discountInfo = calculateProductDiscount(p);
                return {
                    nombre: p.product_name,
                    cantidad: p.quantity,
                    precio: p.unit_price,
                    subtotal: p.subtotal,
                    notas: p.notes,
                    tieneDescuento: discountInfo.hasDiscount,
                    precioOriginal: discountInfo.originalPrice,
                    descuento: discountInfo.discount
                };
            }),
            subtotal: totalDiscountInfo.hasDiscount ? totalDiscountInfo.originalTotal : null,
            descuento_total: totalDiscountInfo.hasDiscount ? totalDiscountInfo.discount : null,
            total: ticketData.total,
            metodo_pago: displayPaymentMethod(ticketData.metodo_pago),
            mesero: shouldShowWaiter ? meseroName : null
        };
        
        generateTicketPDF(pdfData, sizeKey);
    };

  

    if (!isOpen) {
        return null;
    }

    if (!shouldShowModal()) {
        return null;
    }


    const totalDiscountInfo = ticketData ? calculateTotalDiscount() : { hasDiscount: false };

    return (
        <>
            {/* Estilos locales para animaciones y look moderno */}
            <style>{`
                .cm-modal-backdrop {
                    background: rgba(9, 10, 11, 0.55);
                    backdrop-filter: blur(4px) saturate(1.05);
                }
                .cm-card {
                    animation: cmFadeScale 260ms cubic-bezier(.2,.9,.3,1);
                    border-radius: 12px;
                    box-shadow: 0 14px 30px rgba(12, 14, 20, .35);
                }
                @keyframes cmFadeScale {
                    from { opacity: 0; transform: translateY(8px) scale(.985); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .cm-close {
                    transition: transform .16s ease, color .12s ease;
                }
                .cm-close:hover { transform: rotate(90deg) scale(1.05); color: #1f2937; }
                .cm-product {
                    transition: background .15s ease, transform .15s ease;
                    border-radius: 8px;
                }
                .cm-product:hover { background: rgba(249,250,251,0.9); transform: translateX(4px); }
                .cm-qr { transition: transform .18s ease; border-radius: 8px; padding: 6px; background: linear-gradient(180deg, #ffffff, #f7fafc); }
                .cm-qr:hover { transform: scale(1.06) rotate(1.5deg); box-shadow: 0 8px 20px rgba(15, 23, 42, .12); }
                .cm-button {
                    transition: transform .12s ease, box-shadow .12s ease;
                }
                .cm-button:active { transform: translateY(1px) scale(.997); }
                .cm-loader {
                    border-top-color: #10b981;
                }
                
                /* Nuevo: Estilos para layout fijo */
                .cm-modal-content {
                    display: flex;
                    flex-direction: column;
                    max-height: 85vh;
                }
                .cm-scrollable-content {
                    flex: 1;
                    overflow-y: auto;
                    margin-bottom: 1rem;
                }
                .cm-fixed-footer {
                    position: sticky;
                    bottom: 0;
                    background: white;
                    padding-top: 1rem;
                    border-top: 2px solid #e5e7eb;
                    z-index: 10;
                }
            `}</style>

            <div 
                className="fixed inset-0 cm-modal-backdrop flex items-center justify-center z-[10000] px-4 pt-8"
                onClick={onClose}
            >
                <div 
                    className="bg-white cm-card p-6 max-w-lg w-full mx-auto cm-modal-content"
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full mb-0 mt-6">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Ticket listo para imprimir
                            </h2>
                            <div className="mt-2 sm:mt-0 text-sm text-gray-700 sm:text-right">
                                <div className="text-xs text-gray-500">Número de mesa</div>
                                <div className="font-medium bg-gray-50 inline-block px-3 py-0.5 rounded-md mt-1 sm:mt-0">
                                    {ticketData?.mesa_number ?? '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-36">
                            <div className="loader cm-loader border-t-4 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 p-4">
                            <p>{error}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cm-button"
                                onClick={fetchTicketData}
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : ticketData ? (
                        <>
                            {/* Contenido scrolleable */}
                            <div className="cm-scrollable-content">
                                <div className="border border-gray-100 p-4 rounded-lg mb-4">
                                    <div className="text-center mb-3">
                                        <h3 className="font-extrabold text-xl tracking-tight text-gray-800">{ticketData.restaurant_name || 'WapiFood'}</h3>
                                        <p className="text-xs text-gray-500 mt-1">Ticket #{ticketData.ticket_number}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-xs">Fecha</span>
                                            <span className="font-medium">{new Date(ticketData.date_time).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-xs">Hora</span>
                                            <span className="font-medium">{new Date(ticketData.date_time).toLocaleTimeString()}</span>
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-xs">Estado</span>
                                            <span className="text-sm font-semibold text-green-600">{ticketData.order_status}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-xs">Pago</span>
                                            <span className="text-sm font-semibold">{displayPaymentMethod(ticketData.metodo_pago)}</span>
                                        </div>
                                    </div>

                                    {/* Productos */}
                                    <div className="mb-3">
                                        <h4 className="font-semibold text-gray-700 mb-2">Productos</h4>
                                        <div className="space-y-2">
                                            {ticketData.products?.map((product, index) => {
                                                const discountInfo = calculateProductDiscount(product);
                                                
                                                return (
                                                    <div key={index} className="cm-product p-2 flex items-start justify-between bg-white border border-gray-50">
                                                        <div className="flex-1 pr-3">
                                                            <div className="text-sm text-gray-800 font-medium">
                                                                {product.quantity}× {product.product_name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {discountInfo.hasDiscount ? (
                                                                    <>
                                                                        <span className="line-through text-red-500 mr-2">
                                                                            ${discountInfo.originalPrice.toFixed(2)}
                                                                        </span>
                                                                        <span className="text-green-600 font-semibold">
                                                                            -${discountInfo.discount.toFixed(2)}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span>Unit: ${parseFloat(product.unit_price).toFixed(2)}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-semibold text-gray-800">
                                                            ${parseFloat(product.subtotal).toFixed(2)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="mt-4 border-t pt-3">
                                        {totalDiscountInfo.hasDiscount && (
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Subtotal:</span>
                                                <span className="line-through text-red-500">
                                                    ${totalDiscountInfo.originalTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        {totalDiscountInfo.hasDiscount && (
                                            <div className="flex justify-between text-sm mb-1 text-green-600">
                                                <span className="font-semibold">Descuento aplicado:</span>
                                                <span className="font-semibold">
                                                    -${totalDiscountInfo.discount.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-end font-bold text-lg">
                                            <span>Total:</span>
                                            <span>${parseFloat(ticketData.total).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Mesero que atendió */}
                                    {ticketData.mesa_number !== 1 && meseroName && (
                                        <div className="mt-3 pt-3 border-t text-center">
                                            <p className="text-sm text-gray-600">
                                                Le atendió: <span className="font-semibold text-gray-800">{meseroName}</span>
                                            </p>
                                        </div>
                                    )}

                                    {/* QR */}
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-gray-500 mb-2">Código QR del ticket</p>
                                        <div className="justify-center cm-qr inline-block">
                                            <QRCodeCanvas
                                                value={`https://wapifood.com/tickets/externalTicketView?uuid=${ticketData.order_uuid}`}
                                                size={150}
                                                level="M"
                                                includeMargin={true}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Escanea para ver el ticket en tu móvil
                                        </p>
                                    </div>

                                    <div className="text-center mt-4 pt-3 border-t text-xs text-gray-400">
                                        <p>¡Gracias por su visita!</p>
                                        <p>Conserve este ticket como comprobante</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer fijo con selector de impresora y botón cerrar */}
                            <div className="cm-fixed-footer">
                                {/* Selector de tamaño de ticket - Versión compacta */}
                                <div className="mb-2 p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                                            <FaFilePdf className="text-red-600 text-sm" />
                                            Tamaño
                                        </label>
                                        <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded-full">
                                            Auto-descarga
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {Object.entries(TICKET_SIZES).map(([key, config]) => (
                                            <button
                                                key={key}
                                                onClick={() => handleSizeChange(key)}
                                                className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                                                    selectedSize === key
                                                        ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md'
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-red-400 hover:bg-red-50'
                                                }`}
                                            >
                                                {config.name.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Botón Cerrar */}
                                <div className="flex justify-center">
                                    <button
                                        className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 py-2 px-4 rounded-lg cm-button text-white text-sm font-semibold shadow-md"
                                        onClick={onClose}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-600 p-4">
                            No se pudieron cargar los datos del ticket
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}