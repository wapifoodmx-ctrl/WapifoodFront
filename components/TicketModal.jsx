import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { QRCodeCanvas } from 'qrcode.react';
import { getTicket } from '@/useCases/getTicket';

export default function TicketModal({ isOpen, onClose, orderUuid }) {
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && orderUuid) {
            fetchTicketData();
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
            setError('Error al cargar los datos del ticket');
        } finally {
            setLoading(false);
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
        try {
            const ticketsEnabled = localStorage.getItem('tickets');
            return ticketsEnabled === 'true';
        } catch (error) {
            console.error('Error checking tickets permission:', error);
            return false;
        }
    };

    // Nuevo: presentación amigable del método de pago (no modifica ticketData)
    const displayPaymentMethod = (method) => {
        if (!method) return '';
        if (method === 'pasarela') return 'Aplicación';
        return String(method).charAt(0).toUpperCase() + String(method).slice(1);
    };

    if (!isOpen || !shouldShowModal()) return null;

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
            `}</style>

            <div className="fixed inset-0 cm-modal-backdrop flex items-center justify-center z-[10000] px-4">
                <div className="bg-white cm-card p-6 max-w-lg w-full mx-auto max-h-[75vh] overflow-y-auto relative">
                    <button
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl z-20 cm-close bg-white p-1 rounded-full shadow"
                        onClick={onClose}
                        aria-label="Cerrar ticket"
                    >
                        <IoClose />
                    </button>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full mb-0">
                            {/* Reservar espacio a la derecha para el botón de cerrar */}
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
                            <div className="border border-gray-100 p-4 rounded-lg mb-6">
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

                                {/* QR */}
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-500 mb-2">Código QR del ticket</p>
                                    <div className="flex justify-center cm-qr inline-block">
                                        <QRCodeCanvas
                                            value={ticketData.order_uuid}
                                            size={150}
                                            level="M"
                                            includeMargin={true}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Escanea con la app móvil para imprimir
                                    </p>
                                </div>

                                <div className="text-center mt-4 pt-3 border-t text-xs text-gray-400">
                                    <p>¡Gracias por su visita!</p>
                                    <p>Conserve este ticket como comprobante</p>
                                </div>
                            </div>

                            <div className="flex justify-center gap-3">
                                <button
                                    className="bg-gray-700 hover:bg-gray-800 py-2 px-6 rounded cm-button border-gray-700 hover:border-gray-800 text-white"
                                    onClick={onClose}
                                >
                                    Cerrar
                                </button>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded cm-button"
                                    onClick={() => window.print()}
                                >
                                    Imprimir
                                </button>
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