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
            // console.log('Fetching ticket data for UUID:', orderUuid);
            const data = await getTicket(orderUuid);
            // console.log('Ticket data received:', data);
            setTicketData(data);
        } catch (err) {
            console.error('Error al obtener datos del ticket:', err);
            setError('Error al cargar los datos del ticket');
        } finally {
            setLoading(false);
        }
    };

    // Verificar si debe mostrar el modal basado en localStorage
    const shouldShowModal = () => {
        try {
            const ticketsEnabled = localStorage.getItem('tickets');
            return ticketsEnabled === 'true';
        } catch (error) {
            console.error('Error checking tickets permission:', error);
            return false;
        }
    };

    if (!isOpen || !shouldShowModal()) return null;

    return (
        <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
                {/* Botón de cerrar */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
                    onClick={onClose}
                >
                    <IoClose />
                </button>

                {/* Título */}
                <h2 className="text-xl font-bold mb-6 text-center pr-8">
                    Ticket generado para imprimir
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 p-4">
                        <p>{error}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={fetchTicketData}
                        >
                            Reintentar
                        </button>
                    </div>
                ) : ticketData ? (
                    <>
                        {/* Contenido del ticket */}
                        <div className="border-2 border-dashed border-gray-300 p-4 mb-6">
                            {/* Información del restaurante */}
                            <div className="text-center mb-4 border-b pb-4">
                                <h3 className="font-bold text-lg">{ticketData.restaurant_name || 'WapiFood'}</h3>
                            </div>

                            {/* Información de la orden */}
                            <div className="mb-4">
                                
                                <div className="flex justify-between text-sm">
                                    <span>Ticket</span>
                                    <span className="font-mono text-sm">#{ticketData.ticket_number}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Fecha:</span>
                                    <span>{new Date(ticketData.date_time).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Hora:</span>
                                    <span>{new Date(ticketData.date_time).toLocaleTimeString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Estado:</span>
                                    <span className="font-semibold text-green-600">{ticketData.order_status}</span>
                                </div>
                            </div>

                            {/* Productos */}
                            <div className="mb-4">
                                <h4 className="font-bold mb-2 border-b pb-1">Productos:</h4>
                                {ticketData.products?.map((product, index) => (
                                    <div key={index} className="mb-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="flex-1">{product.quantity}x {product.product_name}</span>
                                            <span className="font-semibold">${parseFloat(product.subtotal).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 ml-4">
                                            <span>Precio unitario: ${parseFloat(product.unit_price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="border-t pt-2 mb-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>${parseFloat(ticketData.total).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Método de pago:</span>
                                    <span className="capitalize font-semibold">{ticketData.metodo_pago}</span>
                                </div>
                            </div>

                            {/* Código QR */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Código QR del ticket:</p>
                                <div className="flex justify-center">
                                    <QRCodeCanvas
                                        value={ticketData.order_uuid}
                                        size={150}
                                        level="M"
                                        includeMargin={true}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Escanea con la app móvil para imprimir
                                </p>
                            </div>

                            {/* Pie del ticket */}
                            <div className="text-center mt-4 pt-2 border-t text-xs text-gray-500">
                                <p>¡Gracias por su visita!</p>
                                <p>Conserve este ticket como comprobante</p>
                            </div>
                        </div>

                        {/* Botón para cerrar */}
                        <div className="text-center">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded transition-colors"
                                onClick={onClose}
                            >
                                Cerrar
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
    );
}