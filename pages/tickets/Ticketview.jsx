import { LuCalendarDays } from "react-icons/lu";
import { BsClock } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { FiPrinter } from "react-icons/fi";

export default function Ticketview() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Array de tickets con diferentes productos
    const ticketsData = [
        {
            id: "T01",
            mesa: "Mesa 2",
            fecha: "30/05/2025",
            hora: "13:33",
            productos: [
                { nombre: "Pizza Méxicana", cantidad: 2, precio: 150.00 },
                { nombre: "Dip de Queso", cantidad: 1, precio: 50.00 },
                { nombre: "Sprite", cantidad: 3, precio: 38.33, status: "cancelado" },
            ]
        },
        {
            id: "T02",
            mesa: "Mesa 5",
            fecha: "30/05/2025",
            hora: "14:15",
            productos: [
                { nombre: "Hamburguesa Clásica", cantidad: 1, precio: 120.00 },
                { nombre: "Papas Fritas", cantidad: 2, precio: 45.00 },
                { nombre: "Coca Cola", cantidad: 1, precio: 35.00 },
                { nombre: "Ensalada César", cantidad: 1, precio: 85.00 },
                { nombre: "Helado de Vainilla", cantidad: 2, precio: 40.00 },
            ]
        },
        {
            id: "T03",
            mesa: "Mesa 1",
            fecha: "30/05/2025",
            hora: "12:45",
            productos: [
                { nombre: "Tacos al Pastor", cantidad: 4, precio: 25.00 },
                { nombre: "Agua de Horchata", cantidad: 2, precio: 30.00 }
            ]
        },
        {
            id: "T04",
            mesa: "Mesa 8",
            fecha: "30/05/2025",
            hora: "15:20",
            productos: [
                { nombre: "Spaghetti Bolognesa", cantidad: 1, precio: 140.00 },
                { nombre: "Pan de Ajo", cantidad: 3, precio: 20.00 },
                { nombre: "Vino Tinto", cantidad: 1, precio: 180.00 },
                { nombre: "Tiramisu", cantidad: 2, precio: 65.00 }
            ]
        },
        {
            id: "T05",
            mesa: "Mesa 3",
            fecha: "30/05/2025",
            hora: "11:30",
            productos: [
                { nombre: "Desayuno Completo", cantidad: 1, precio: 95.00 },
                { nombre: "Café Americano", cantidad: 2, precio: 25.00 },
                { nombre: "Jugo de Naranja", cantidad: 1, precio: 35.00 },
                { nombre: "Tostadas Francesas", cantidad: 1, precio: 55.00 },
                { nombre: "Fruta de Temporada", cantidad: 1, precio: 40.00 },
                { nombre: "Yogurt con Granola", cantidad: 1, precio: 45.00 }
            ]
        },
        {
            id: "T06",
            mesa: "Mesa 12",
            fecha: "30/05/2025",
            hora: "16:10",
            productos: [
                { nombre: "Pollo a la Plancha", cantidad: 1, precio: 135.00 },
                { nombre: "Arroz Blanco", cantidad: 1, precio: 25.00 },
                { nombre: "Ensalada Verde", cantidad: 1, precio: 40.00 }
            ]
        },
        {
            id: "T07",
            mesa: "Mesa 6",
            fecha: "30/05/2025",
            hora: "13:50",
            productos: [
                { nombre: "Sushi Variado", cantidad: 2, precio: 180.00 },
                { nombre: "Sopa Miso", cantidad: 2, precio: 45.00 },
                { nombre: "Té Verde", cantidad: 2, precio: 30.00 },
                { nombre: "Edamame", cantidad: 1, precio: 35.00 },
                { nombre: "Tempura de Camarón", cantidad: 1, precio: 85.00 }
            ]
        },
        {
            id: "T08",
            mesa: "Mesa 15",
            fecha: "30/05/2025",
            hora: "17:25",
            productos: [
                { nombre: "Carne Asada", cantidad: 1, precio: 220.00 },
                { nombre: "Guacamole", cantidad: 1, precio: 60.00 }
            ]
        },
        {
            id: "T09",
            mesa: "Mesa 4",
            fecha: "30/05/2025",
            hora: "14:40",
            productos: [
                { nombre: "Pizza Hawaiana", cantidad: 1, precio: 165.00 },
                { nombre: "Alitas BBQ", cantidad: 12, precio: 15.00 },
                { nombre: "Cerveza", cantidad: 3, precio: 40.00 },
                { nombre: "Nachos", cantidad: 1, precio: 75.00 }
            ]
        },
        {
            id: "T10",
            mesa: "Mesa 9",
            fecha: "30/05/2025",
            hora: "18:15",
            productos: [
                { nombre: "Lasagna de Carne", cantidad: 1, precio: 155.00 },
                { nombre: "Ensalada Caprese", cantidad: 1, precio: 85.00 },
                { nombre: "Limonada", cantidad: 2, precio: 32.00 },
                { nombre: "Bruschetta", cantidad: 4, precio: 18.00 },
                { nombre: "Cheesecake", cantidad: 1, precio: 70.00 },
                { nombre: "Café Espresso", cantidad: 2, precio: 28.00 },
                { nombre: "Agua Mineral", cantidad: 1, precio: 25.00 }
            ]
        }
    ];

    // Datos del restaurante
    const restauranteData = {
        nombre: "Restaurante El Buen Sabor",
        direccion: "Av. Principal #123, Ciudad, Estado"
    };

    const handleCardClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handlePrintTicket = () => {
        setIsEmailModalOpen(true);
    };

    const handleSendEmail = () => {
        console.log(`Enviando ticket a: ${email}`);
        setIsEmailModalOpen(false);
        setEmail("");
        setIsModalOpen(false);
    };

    // Función para calcular el total de un ticket (excluyendo productos cancelados)
    const calculateTotal = (productos) => {
        return productos.reduce((sum, producto) => {
            if (producto.status === "cancelado") {
                return sum; // No sumar productos cancelados
            }
            return sum + (producto.cantidad * producto.precio);
        }, 0);
    };

    // Función para mostrar productos en la card (máximo 2, resto como "+x productos")
    const renderProductsForCard = (productos) => {
        if (productos.length <= 2) {
            return productos.map((producto, index) => (
                <li key={index} className="flex justify-between py-1">
                    <span className={producto.status === "cancelado" ? "text-red-500 line-through" : ""}>
                        {producto.nombre}
                    </span>
                    <span className="text-gray-600">x{producto.cantidad}</span>
                </li>
            ));
        } else {
            const firstTwo = productos.slice(0, 2);
            const remaining = productos.length - 2;
            return [
                ...firstTwo.map((producto, index) => (
                    <li key={index} className="flex justify-between py-1">
                        <span className={producto.status === "cancelado" ? "text-red-500 line-through" : ""}>
                            {producto.nombre}
                        </span>
                        <span className="text-gray-600">x{producto.cantidad}</span>
                    </li>
                )),
                <li key="more" className="flex justify-between py-1">
                    <span className="text-gray-500 italic">+{remaining} productos</span>
                    <span></span>
                </li>
            ];
        }
    };

    return (
        <div className="pt-20 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ticketsData.map((ticket) => (
                    <div 
                        key={ticket.id}
                        className="w-full border-l-green-600 border-l-3 shadow-md rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleCardClick(ticket)}
                    >
                        <div className="px-3 py-6">
                            <h2 className="font-bold text-xl">{ticket.id}</h2>
                            <p className="text-gray-600">{ticket.mesa}</p>
                            <h3 className="font-bold text-xl py-3">Productos</h3>
                            <div className="pb-2">
                                <ul>
                                    {renderProductsForCard(ticket.productos)}
                                </ul>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex">
                                    <LuCalendarDays className="self-center" />
                                    <p className="pl-1">{ticket.fecha}</p>
                                </div>
                                <div className="flex">
                                    <BsClock className="self-center" />
                                    <p className="pl-1">{ticket.hora}</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <p className="font-bold">Total</p>
                                <p>$ {calculateTotal(ticket.productos).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal principal del ticket */}
            {isModalOpen && selectedTicket && (
                <div
                    className={`fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[998]`}
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de cerrar (X) */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <IoClose />
                        </button>

                        {/* Información del restaurante */}
                        <div className="text-center mb-4 border-b pb-4">
                            <h1 className="font-bold text-lg">{restauranteData.nombre}</h1>
                            <p className="text-gray-600 text-sm">{restauranteData.direccion}</p>
                        </div>

                        {/* Información del ticket */}
                        <div className="mb-4">
                            <h2 className="font-bold text-xl">{selectedTicket.id}</h2>
                            <p className="text-gray-600">{selectedTicket.mesa}</p>
                            <div className="flex justify-between mt-2 text-sm">
                                <div className="flex">
                                    <LuCalendarDays className="self-center" />
                                    <p className="pl-1">{selectedTicket.fecha}</p>
                                </div>
                                <div className="flex">
                                    <BsClock className="self-center" />
                                    <p className="pl-1">{selectedTicket.hora}</p>
                                </div>
                            </div>
                        </div>

                        {/* Productos con precios */}
                        <div className="mb-4">
                            <h3 className="font-bold text-lg mb-3">Productos</h3>
                            <div className="space-y-2">
                                {selectedTicket.productos.map((producto, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <span className={`font-medium ${producto.status === "cancelado" ? "text-red-500 line-through" : ""}`}>
                                                {producto.nombre}
                                            </span>
                                            <div className="text-sm text-gray-600">
                                                x{producto.cantidad} - ${producto.precio.toFixed(2)} c/u
                                            </div>
                                        </div>
                                        <div className={`font-bold ${producto.status === "cancelado" ? "text-red-500 line-through" : ""}`}>
                                            ${(producto.cantidad * producto.precio).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t pt-3 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Total:</span>
                                <span className="font-bold text-lg">${calculateTotal(selectedTicket.productos).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Botón de imprimir */}
                        <button
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer transition-colors flex items-center justify-center gap-2"
                            onClick={handlePrintTicket}
                        >
                            <FiPrinter />
                            Imprimir Ticket
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de envío por email */}
            {isEmailModalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-[999]"
                    onClick={() => setIsEmailModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative shadow-2xl border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de cerrar (X) */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setIsEmailModalOpen(false)}
                        >
                            <IoClose />
                        </button>

                        {/* Título */}
                        <h2 className="text-xl font-bold mb-4">Enviar Ticket por Email</h2>

                        {/* Campo de email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ingresa el email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer transition-colors"
                                onClick={handleSendEmail}
                                disabled={!email}
                            >
                                Enviar
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded cursor-pointer transition-colors"
                                onClick={() => setIsEmailModalOpen(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}