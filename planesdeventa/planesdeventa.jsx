import { AiTwotonePrinter } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import { FaCheck, FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { GiModernCity } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi";
import { MdOutlinePointOfSale, MdOutlineInventory2, MdOutlineTableRestaurant, MdOutlineMenuBook } from "react-icons/md";
import { HiOutlineChartBar, HiOutlineDeviceMobile } from "react-icons/hi";
import { GiCook } from "react-icons/gi";
import { BiReceipt } from "react-icons/bi";
import { FaUserTie, FaConciergeBell } from "react-icons/fa";

import Menu2 from "@/pages/assets/images/Menu2.png";
import Pago from "@/pages/assets/images/Pago.png";

import Vistadecocina from "@/pages/assets/images/Vistadecocina.png"; 
import getPaymentsLink, { getAllPaymentLinks } from "@/useCases/getPaymentsLink";
import { useEffect, useState } from "react";

export default function PlanDeVentas() {


    const [planesAdicionales, setPlanesAdicionales] = useState([
        // Planes Mensuales
        {
            id: 1,
            title: "Plan Ventas",
            subtitle: "Perfecto para empezar",
            price: "$400.00",
            period: "mxn/mes",
            buttonText: "Seleccionar Plan",
            prop: "basico",
            popular: false,
            category: "mensual",
            specs: {
                mesas: 1,
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
            buttonText: "Seleccionar Plan",
            prop: "profesional",
            popular: true,
            category: "mensual",
            specs: {
                mesas: 15,
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
                { icon: <MdOutlineTableRestaurant size={18} />, text: "15 Mesas para tu negocio" },
                { icon: <MdOutlineInventory2 size={18} />, text: "Control de Inventario" },
                { icon: <FaUserTie size={18} />, text: "10 Meseros" },
            ]
        },
        {
            id: 3,
            title: "Plan Restaurante Plus",
            subtitle: "Máximo rendimiento",
            price: "$800.00",
            period: "mxn/mes",
            buttonText: "Seleccionar Plan",
            prop: "empresarial",
            popular: false,
            category: "mensual",
            specs: {
                mesas: 25,
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
            buttonText: "Seleccionar Plan",
            prop: "basico_impresora",
            popular: false,
            category: "anual",
            savings: "Ahorras $800",
            specs: {
                mesas: 1,
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
            buttonText: "Seleccionar Plan",
            prop: "restaurante_impresora",
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
            buttonText: "Seleccionar Plan",
            prop: "plus_restaurante_impresora",
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

    ]);

    async function getLink(prop) {
        try {
            const response = await getPaymentsLink({ plan: prop });
            // console.log("Enlace de pago obtenido:", response);

            if (response.checkout_url) {
                window.location.href = response.checkout_url;
            } else {
                console.error("No se recibió un enlace de pago válido");
            }
        } catch (error) {
            console.error("Error al obtener el enlace de pago:", error.message);
        }
    }

    return (
        <div className="h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-green-50">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-4 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-4 sm:right-20 w-32 h-32 sm:w-40 sm:h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-4 sm:right-10 w-28 h-28 sm:w-36 sm:h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
            </div>

            <section className="relative z-10">
                {/* Header Hero Section */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Planes que impulsan tu
                                <span className="text-yellow-300"> negocio</span>
                            </h2>
                            <p className="text-lg md:text-xl text-green-100 mb-6 max-w-3xl mx-auto">
                                Descubre las herramientas perfectas para hacer crecer tu restaurante con tecnología de vanguardia
                            </p>

                            {/* Plan de Inauguración - Card Normal */}
                            <div className="max-w-7xl mx-auto mb-8">
                                <div className="max-w-sm mx-auto">
                                    <div className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full border-2 border-yellow-400 ring-4 ring-yellow-100">
                                        {/* Badge Popular */}
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                                                <HiSparkles className="text-sm" />
                                                Oferta Inauguración
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-8 pt-10 md:pt-12 flex flex-col h-full">
                                            {/* Header del plan */}
                                            <div className="text-center mb-6">
                                                <h5 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Plan Ventas</h5>
                                                <p className="text-sm text-gray-500 mb-4">Precio especial de lanzamiento</p>
                                                
                                                {/* Precio */}
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-center gap-2 mb-2">
                                                        <span className="text-lg text-gray-400 line-through">$400</span>
                                                        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                            90% OFF
                                                        </div>
                                                    </div>
                                                    <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                        $40.00
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">mxn/mes</div>
                                                </div>
                                            </div>

                                            {/* Especificaciones del plan */}
                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                    <div>
                                                        <div className="text-2xl font-bold text-green-600">1</div>
                                                        <div className="text-xs text-gray-600">Mesa</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-2xl font-bold text-green-600">2</div>
                                                        <div className="text-xs text-gray-600">Meseros</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-2xl font-bold text-green-600">✓</div>
                                                        <div className="text-xs text-gray-600">APK</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Características incluidas */}
                                            <div className="mb-6 flex-grow">
                                                <h6 className="text-sm font-bold text-gray-700 mb-3">Incluye:</h6>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                                                        <span>Punto de Venta Completo</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                                                        <span>Dashboard & Reportes</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                                                        <span>Menú Digital con QR</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                                                        <span>APK para móviles</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Botón */}
                                            <div className="mt-auto">
                                                <button
                                                    className="w-full py-3 md:py-4 px-6 rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                                                    onClick={() => getLink("inauguracion")}
                                                >
                                                    Seleccionar Plan
                                                </button>
                                            </div>
                                        </div>

                                        {/* Efecto de brillo en hover */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                </div>
                            </div>


                            <div className="flex items-center justify-center gap-2 text-yellow-300 mt-4">
                                <HiSparkles className="text-2xl animate-pulse" />
                                <span className="text-lg font-medium">Precios especiales de lanzamiento</span>
                                <HiSparkles className="text-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Planes de Precios - Tarjetas Mejoradas */}
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8 relative z-20">

                    {/* Planes Mensuales */}
                    <div className="mb-12">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Planes Mensuales</h3>
                            <p className="text-gray-600">Flexibilidad mes a mes para tu negocio</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {planesAdicionales.filter(p => p.category === 'mensual').map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full border-2 ${plan.popular
                                        ? 'border-yellow-400 ring-4 ring-yellow-100'
                                        : 'border-green-100 hover:border-green-300'
                                        }`}
                                >
                                    {/* Badge Popular */}
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                                                <FaStar className="text-sm" />
                                                Más Popular
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6 md:p-8 flex flex-col h-full">
                                        {/* Header del plan */}
                                        <div className="text-center mb-6">
                                            <h5 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{plan.title}</h5>
                                            <p className="text-sm text-gray-500 mb-4">{plan.subtitle}</p>

                                            {/* Precio */}
                                            <div className="mb-4">
                                                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                    {plan.price}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">{plan.period}</div>
                                            </div>
                                        </div>

                                        {/* Especificaciones del plan */}
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <div className="text-2xl font-bold text-green-600">{plan.specs.mesas}</div>
                                                    <div className="text-xs text-gray-600">Mesa{plan.specs.mesas > 1 ? 's' : ''}</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-green-600">{plan.specs.meseros}</div>
                                                    <div className="text-xs text-gray-600">Meseros</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-green-600">✓</div>
                                                    <div className="text-xs text-gray-600">APK</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Características incluidas */}
                                        <div className="mb-6 flex-grow">
                                            <h6 className="text-sm font-bold text-gray-700 mb-3">Incluye:</h6>
                                            <ul className="space-y-2">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <span className="text-green-600 mt-0.5 flex-shrink-0">{feature.icon}</span>
                                                        <span>{feature.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Botón */}
                                        <div className="mt-auto">
                                            <button
                                                className={`w-full py-3 md:py-4 px-6 rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${plan.popular
                                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
                                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                                                    }`}
                                                onClick={() => getLink(plan.prop)}
                                            >
                                                {plan.buttonText}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Efecto de brillo en hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Planes Anuales */}
                    <div className="mb-12">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Planes Anuales</h3>
                            <p className="text-gray-600">¡Ahorra 2 meses con el pago anual! 🎉</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {planesAdicionales.filter(p => p.category === 'anual').map((plan) => (
                                <div
                                    key={plan.id}
                                    className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full border-2 border-emerald-100 hover:border-emerald-300"
                                >
                                    {/* Badge de ahorro */}
                                    {plan.savings && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                                                {plan.savings}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6 md:p-8 flex flex-col h-full">
                                        {/* Header del plan */}
                                        <div className="text-center mb-6">
                                            <h5 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{plan.title}</h5>
                                            <p className="text-sm text-gray-500 mb-4">{plan.subtitle}</p>

                                            {/* Precio */}
                                            <div className="mb-4">
                                                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                    {plan.price}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">{plan.period}</div>
                                            </div>
                                        </div>

                                        {/* Especificaciones del plan */}
                                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 mb-6">
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <div className="text-2xl font-bold text-emerald-600">{plan.specs.mesas}</div>
                                                    <div className="text-xs text-gray-600">Mesa{plan.specs.mesas > 1 ? 's' : ''}</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-emerald-600">{plan.specs.meseros}</div>
                                                    <div className="text-xs text-gray-600">Meseros</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-emerald-600">✓</div>
                                                    <div className="text-xs text-gray-600">APK</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Características incluidas */}
                                        <div className="mb-6 flex-grow">
                                            <h6 className="text-sm font-bold text-gray-700 mb-3">Incluye:</h6>
                                            <ul className="space-y-2">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <span className="text-emerald-600 mt-0.5 flex-shrink-0">{feature.icon}</span>
                                                        <span>{feature.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Botón */}
                                        <div className="mt-auto">
                                            <button
                                                className="w-full py-3 md:py-4 px-6 rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                                                onClick={() => getLink(plan.prop)}
                                            >
                                                {plan.buttonText}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Efecto de brillo en hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Sección de beneficios comunes */}
                    <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-8 md:p-12 shadow-2xl">
                        <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
                            ✨ Todos los planes incluyen:
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300">
                                <div className="text-white mb-2 flex justify-center">
                                    <MdOutlinePointOfSale size={24} />
                                </div>
                                <h4 className="text-white font-semibold text-sm mb-1">Punto de Venta</h4>
                                <p className="text-green-100 text-xs">Sistema POS completo</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300">
                                <div className="text-white mb-2 flex justify-center">
                                    <HiOutlineChartBar size={24} />
                                </div>
                                <h4 className="text-white font-semibold text-sm mb-1">Reportes</h4>
                                <p className="text-green-100 text-xs">Analytics y gráficas</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300">
                                <div className="text-white mb-2 flex justify-center">
                                    <MdOutlineMenuBook size={24} />
                                </div>
                                <h4 className="text-white font-semibold text-sm mb-1">Menú Digital</h4>
                                <p className="text-green-100 text-xs">Con código QR</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300">
                                <div className="text-white mb-2 flex justify-center">
                                    <BiReceipt size={24} />
                                </div>
                                <h4 className="text-white font-semibold text-sm mb-1">Tickets Digitales</h4>
                                <p className="text-green-100 text-xs">Generación automática</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300">
                                <div className="text-white mb-2 flex justify-center">
                                    <GiCook size={24} />
                                </div>
                                <h4 className="text-white font-semibold text-sm mb-1">Gestión de Cocina</h4>
                                <p className="text-green-100 text-xs">Casi en tiempo real</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300">
                                <div className="text-white mb-2 flex justify-center">
                                    <FaUserTie size={24} />
                                </div>
                                <h4 className="text-white font-semibold text-sm mb-1">Portal Meseros</h4>
                                <p className="text-green-100 text-xs">App móvil incluida</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300">
                                <div className="text-white mb-2 flex justify-center">
                                    <MdOutlineInventory2 size={24} />
                                </div>
                                <h4 className="text-white font-semibold text-sm mb-1">Inventario</h4>
                                <p className="text-green-100 text-xs">Control de stock</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300">
                                <div className="text-white mb-2 flex justify-center">
                                    <FaConciergeBell size={24} />
                                </div>
                                <h4 className="text-white font-semibold text-sm mb-1">Notificaciones</h4>
                                <p className="text-green-100 text-xs">Alertas casi en tiempo real</p>
                            </div>
                        </div>

                        {/* Stats adicionales */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/20">
                            <div className="text-center">
                                <div className="text-4xl font-extrabold text-yellow-300 mb-1">0%</div>
                                <div className="text-white text-sm">Comisiones</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-extrabold text-yellow-300 mb-1">Gratis</div>
                                <div className="text-white text-sm">Soporte con tu sub</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-extrabold text-yellow-300 mb-1">5 min</div>
                                <div className="text-white text-sm">Configuración</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-extrabold text-yellow-300 mb-1">∞</div>
                                <div className="text-white text-sm">Actualizaciones</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de Contacto para Integraciones Personalizadas */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12 pb-8">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border-2 border-green-200 p-8 md:p-10">
                        <div className="text-center mb-6">
                            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                                ¿Necesitas algo más personalizado?
                            </h3>
                            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                                Si requieres integraciones adicionales o características especiales para tu negocio,
                                ¡estamos aquí para ayudarte!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {/* Email */}
                            <a
                                href="mailto:wapifoodmx@gmail.com"
                                className="flex items-center gap-4 p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-gray-500 mb-1">Correo Electrónico</div>
                                    <div className="text-base font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                                        wapifoodmx@gmail.com
                                    </div>
                                </div>
                            </a>

                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/5220535967"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-gray-500 mb-1">WhatsApp</div>
                                    <div className="text-base font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                                        55-2053-5967
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                💡 Nuestro equipo está listo para crear la solución perfecta para tu negocio
                            </p>
                        </div>
                    </div>
                </div>

            </section>

            {/* Estilos CSS personalizados */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }

                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                /* Reducir el uso de backdrop-blur en móviles */
                @media (max-width: 768px) {
                    .backdrop-blur-sm {
                        backdrop-filter: none;
                        background: rgba(255, 255, 255, 0.2);
                    }
                }
            `}</style>
        </div>
    );
}