import { useState } from 'react';
import { MdOutlinePointOfSale, MdOutlineInventory2, MdOutlineTableRestaurant, MdOutlineMenuBook } from "react-icons/md";
import { HiOutlineChartBar, HiOutlineDeviceMobile } from "react-icons/hi";
import { GiCook } from "react-icons/gi";
import { BiReceipt } from "react-icons/bi";
import { FaUserTie, FaCheck, FaStar } from "react-icons/fa";

export default function Paquetes() {
    const [selectedCategory, setSelectedCategory] = useState('mensual');

    const planes = [
        // Planes Mensuales
        {
            id: 1,
            title: "Plan Ventas",
            subtitle: "Perfecto para empezar",
            price: "$400.00",
            period: "mxn/mes",
            popular: false,
            category: "mensual",
            specs: {
                mesas: 3,
                meseros: 2,
                apk: true,
            },
            features: [
                { icon: <MdOutlinePointOfSale size={18} />, text: "Punto de Venta Completo" },
                { icon: <HiOutlineChartBar size={18} />, text: "Dashboard & Reportes" },
                { icon: <MdOutlineMenuBook size={18} />, text: "Menú Digital con QR" },
                { icon: <BiReceipt size={18} />, text: "Tickets Digitales" },
                { icon: <HiOutlineDeviceMobile size={18} />, text: "APK para móviles" },
                { icon: <GiCook size={18} />, text: "Gestión de Cocina casi en tiempo real" },
                { icon: <MdOutlineInventory2 size={18} />, text: "Control de Inventario" },
                { icon: <FaUserTie size={18} />, text: "2 Meseros" },
            ]
        },
        {
            id: 2,
            title: "Plan Restaurante",
            subtitle: "Ideal para restaurantes",
            price: "$600.00",
            period: "mxn/mes",
            popular: true,
            category: "mensual",
            specs: {
                mesas: 15,
                meseros: 5,
                apk: true,
            },
            features: [
                { icon: <MdOutlinePointOfSale size={18} />, text: "Punto de Venta Completo" },
                { icon: <HiOutlineChartBar size={18} />, text: "Dashboard & Reportes" },
                { icon: <MdOutlineMenuBook size={18} />, text: "Menú Digital con QR" },
                { icon: <BiReceipt size={18} />, text: "Tickets Digitales" },
                { icon: <HiOutlineDeviceMobile size={18} />, text: "APK para móviles" },
                { icon: <GiCook size={18} />, text: "Gestión de Cocina casi en tiempo real" },
                { icon: <MdOutlineTableRestaurant size={18} />, text: "15 Mesas para tu negocio" },
                { icon: <MdOutlineInventory2 size={18} />, text: "Control de Inventario" },
                { icon: <FaUserTie size={18} />, text: "5 Meseros" },
            ]
        },
        {
            id: 3,
            title: "Plan Restaurante Plus",
            subtitle: "Máximo rendimiento",
            price: "$800.00",
            period: "mxn/mes",
            popular: false,
            category: "mensual",
            specs: {
                mesas: 25,
                meseros: 10,
                apk: true,
            },
            features: [
                { icon: <MdOutlinePointOfSale size={18} />, text: "Punto de Venta Completo" },
                { icon: <HiOutlineChartBar size={18} />, text: "Dashboard & Reportes" },
                { icon: <MdOutlineMenuBook size={18} />, text: "Menú Digital con QR" },
                { icon: <BiReceipt size={18} />, text: "Tickets Digitales" },
                { icon: <HiOutlineDeviceMobile size={18} />, text: "APK para móviles" },
                { icon: <GiCook size={18} />, text: "Gestión de Cocina casi en tiempo real" },
                { icon: <MdOutlineTableRestaurant size={18} />, text: "25 Mesas para tu negocio" },
                { icon: <MdOutlineInventory2 size={18} />, text: "Control de Inventario" },
                { icon: <FaUserTie size={18} />, text: "10 Meseros" },
            ]
        },
        // Planes Anuales
        {
            id: 4,
            title: "Plan Ventas Anual",
            subtitle: "Ahorra con el plan anual",
            price: "$4,000.00",
            period: "mxn/año",
            popular: false,
            category: "anual",
            savings: "Ahorras $800",
            specs: {
                mesas: 3,
                meseros: 2,
                apk: true,
            },
            features: [
                { icon: <FaCheck size={18} />, text: "Todo del Plan Ventas mensual" },
                { icon: <FaStar size={18} />, text: "2 meses GRATIS" },
            ]
        },
        {
            id: 5,
            title: "Plan Restaurante Anual",
            subtitle: "Mejor valor para tu restaurante",
            price: "$6,000.00",
            period: "mxn/año",
            popular: false,
            category: "anual",
            savings: "Ahorras $1,200",
            specs: {
                mesas: 15,
                meseros: 5,
                apk: true,
            },
            features: [
                { icon: <FaCheck size={18} />, text: "Todo del Plan Restaurante mensual" },
                { icon: <FaStar size={18} />, text: "2 meses GRATIS" },
            ]
        },
        {
            id: 6,
            title: "Plan Restaurante Plus Anual",
            subtitle: "Máximo ahorro y beneficios",
            price: "$8,000.00",
            period: "mxn/año",
            popular: false,
            category: "anual",
            savings: "Ahorras $1,600",
            specs: {
                mesas: 25,
                meseros: 10,
                apk: true,
            },
            features: [
                { icon: <FaCheck size={18} />, text: "Todo del Plan Restaurante Plus" },
                { icon: <FaStar size={18} />, text: "2 meses GRATIS" },
            ]
        },
    ];

    const filteredPlanes = planes.filter(plan => plan.category === selectedCategory);

    return (
        <div className="w-full py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
                        Nuestros <span className="text-green-500">Planes</span>
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-6">
                        Elige el plan perfecto para tu negocio y comienza a gestionar tus ventas de manera profesional
                    </p>
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span className="text-2xl">🎉</span>
                        <p className="text-lg md:text-xl font-bold">
                            Solicita tu prueba gratis de 15 días. Contáctanos por WhatsApp
                        </p>
                        <span className="text-2xl">📱</span>
                    </div>
                </div>

                {/* Selector de categoría */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-white rounded-full shadow-md p-1.5 border border-gray-200">
                        <button
                            onClick={() => setSelectedCategory('mensual')}
                            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                                selectedCategory === 'mensual'
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Mensual
                        </button>
                        <button
                            onClick={() => setSelectedCategory('anual')}
                            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                                selectedCategory === 'anual'
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Anual
                        </button>
                    </div>
                </div>

                {/* Cards de planes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPlanes.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                                plan.popular ? 'ring-4 ring-green-400' : ''
                            }`}
                        >
                            {/* Badge popular */}
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-1 rounded-bl-xl font-semibold text-sm shadow-lg">
                                    ⭐ Más Popular
                                </div>
                            )}

                            {/* Badge de ahorro */}
                            {plan.savings && (
                                <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-br-xl font-semibold text-sm shadow-lg">
                                    💰 {plan.savings}
                                </div>
                            )}

                            {/* Header de la card */}
                            <div className={`p-8 ${plan.popular ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gray-50'}`}>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.title}</h3>
                                <p className="text-gray-600 mb-4">{plan.subtitle}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl md:text-5xl font-bold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-600">/ {plan.period}</span>
                                </div>
                            </div>

                            {/* Especificaciones rápidas */}
                            <div className="px-8 py-4 bg-white border-b border-gray-100">
                                <div className="flex flex-wrap gap-3">
                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                        <MdOutlineTableRestaurant size={16} />
                                        {plan.specs.mesas} mesas
                                    </span>
                                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                        <FaUserTie size={14} />
                                        {plan.specs.meseros} meseros
                                    </span>
                                    {plan.specs.apk && (
                                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                            <HiOutlineDeviceMobile size={16} />
                                            APK incluida
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="p-8">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mt-0.5">
                                                {feature.icon}
                                            </span>
                                            <span className="text-gray-700 flex-1">{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
