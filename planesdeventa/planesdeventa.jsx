import { AiTwotonePrinter } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import { FaCheck, FaStar } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { GiModernCity } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi";
import Image from "next/image";
import Ticket from "@/pages/assets/images/Ticket.png";
import Cocina from "@/pages/assets/images/Cocina.png";
import Menu2 from "@/pages/assets/images/Menu2.png";
import Pntoventa from "@/pages/assets/images/Pntoventa.png";
import Pago from "@/pages/assets/images/Pago.png";
import Ticket2 from "@/pages/assets/images/Tickets2.png";
import Tickets1 from "@/pages/assets/images/Tickets1.png";
import Creditos from "@/components/Creditos";
import getPaymentsLink, { getAllPaymentLinks } from "@/useCases/getPaymentsLink";
import { useEffect, useState } from "react";

export default function PlanDeVentas() {

    const planes = [
        {
            id: 1,
            icon: <LuNotebookPen className="text-3xl text-green-600" />,
            title: "Registra tus pedidos en tiempo real",
            features: [
                "Recibe los datos de tus ventas al momento",
                "Se registran ventas y rendimiento hasta anualmente",
                "Grafica tu rendimiento para mejor comprencion",
            ],
            image: Ticket2,
        },
        {
            id: 2,
            icon: <IoMdTime className="text-3xl text-green-600" />,
            title: "Reduce tiempos de entrega",
            features: [
                "Mejora el tiempo de servicio a tus clientes",
                "Recibe ordenes desde la app directo a tu cocina",
                "Opción de ¡más vendidos!",
            ],
            image: Menu2,
        },
        {
            id: 3,
            icon: <GiModernCity className="text-3xl text-green-600" />,
            title: "Moderniza tu negocio",
            features: [
                "La app es amigable para todos los usuarios",
                "Actualízate con la vanguardia tecnológica",
                "Acepta cualquier forma de pago",
            ],
            image: Pago,
        },
        {
            id: 4,
            icon: <AiTwotonePrinter className="text-3xl text-green-600" />,
            title: "Imprime tikets desde Wapiticket",
            features: [
                "Impresión de tikets de venta",
                "Busqueda con código QR",
                "Impresora térmica incluida",
            ],
            image: Ticket,
        },
    ];

    const [planesAdicionales, setPlanesAdicionales] = useState([
        {
            id: 1,
            title: "Plan Ventas",
            description: "App de punto de venta para tu negocio.",
            price: "$150.00 mxn al mes",
            promoPrice: "$100.00 mxn al mes",
            promoText: "Precio de apertura",
            buttonText: "Seleccionar",
            prop: "basico",
            popular: false,
        },
        {
            id: 2,
            title: "Plan Restaurante",
            description: "App de punto de venta + 15 mesas para tu negocio.",
            price: "$250.00 mxn al mes",
            promoPrice: "$200.00 mxn al mes",
            promoText: "Precio de apertura",
            buttonText: "Seleccionar",
            prop: "profesional",
            popular: true,
        },
        {
            id: 3,
            title: "Plan Restaurante Plus",
            description: "App de punto de venta + 25 mesas para tu negocio.",
            price: "$350.00 mxn al mes",
            promoPrice: "$300.00 mxn al mes",
            promoText: "Precio de apertura",
            buttonText: "Seleccionar",
            prop: "empresarial",
            popular: false,
        },
        {
            id: 4,
            title: "Plan Ventas + Impresora",
            description: "App de punto de venta + Impresora + un año de servicio.",
            price: "$2800.00 mxn al año",
            promoPrice: "$1960.00 mxn al año",
            promoText: "Precio de apertura",
            buttonText: "Seleccionar",
            prop: "basico + impresora",
            popular: false,
        },
        {
            id: 5,
            title: "Plan Restaurante + Impresora",
            description: "App de punto de venta + 15 mesas para tu negocio + impresora + 1 año de servicio.",
            price: "$4000.00 mxn al año",
            promoPrice: "$2920.00 mxn al año",
            promoText: "Precio de apertura",
            buttonText: "Seleccionar",
            prop: "plan restaurante + impresora",
            popular: false,
        },
        {
            id: 6,
            title: "Plan Restaurante Plus + Impresora",
            description: "App de punto de venta + 25 mesas para tu negocio + impresora + 1 año de servicio.",
            price: "$5200.00 mxn al mes",
            promoPrice: "$3880.00 mxn al mes",
            promoText: "Precio de apertura",
            buttonText: "Seleccionar",
            prop: "plan restaurante plus + impresora",
            popular: false,
        }
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
            </div>

            <section className="relative z-10">
                {/* Header Hero Section */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="animate-fade-in-up">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                Planes que impulsan tu 
                                <span className="text-yellow-300"> negocio</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                                Descubre las herramientas perfectas para hacer crecer tu restaurante con tecnología de vanguardia
                            </p>
                            <div className="flex items-center justify-center gap-2 text-yellow-300">
                                <HiSparkles className="text-2xl animate-pulse" />
                                <span className="text-lg font-medium">Precios especiales de lanzamiento</span>
                                <HiSparkles className="text-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Planes de Precios - Tarjetas */}
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {planesAdicionales.map((plan) => (
                            <div 
                                key={plan.id} 
                                className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full border-2 ${
                                    plan.popular 
                                        ? 'border-yellow-400 ring-4 ring-yellow-100' 
                                        : 'border-green-100 hover:border-green-300'
                                }`}
                            >
                                {/* Badge Popular */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                                            <FaStar className="text-sm" />
                                            Más Popular
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 md:p-8 flex flex-col h-full">
                                    {/* Header del plan */}
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{plan.title}</h3>
                                        <p className="text-gray-600 text-sm md:text-base">{plan.description}</p>
                                    </div>

                                    {/* Precios */}
                                    <div className="text-center mb-6">
                                        <div className="relative">
                                            <p className="text-xl md:text-2xl font-bold text-gray-400 line-through mb-2">{plan.price}</p>
                                            <div className="absolute top-0 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold transform rotate-12">
                                                AHORRO
                                            </div>
                                        </div>
                                        <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                                            {plan.promoPrice}
                                        </p>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <p className="text-sm font-medium text-green-700">{plan.promoText}</p>
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>

                                    {/* Botón */}
                                    <div className="mt-auto">
                                        <button
                                            className={`w-full py-3 md:py-4 px-6 rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                                                plan.popular
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

                {/* Sección de Características */}
                <div className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                                ¿Por qué elegir 
                                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> WapiFood</span>?
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                                Descubre todas las ventajas que nuestra plataforma puede ofrecerte
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12 md:gap-16">
                            {planes.map((plan, index) => (
                                <div
                                    key={plan.id}
                                    className={`flex flex-col bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 md:flex-row lg:items-center ${
                                        index % 2 === 1 ? "md:flex-row-reverse" : ""
                                    }`}
                                >
                                    {/* Imagen */}
                                    <div className="flex-shrink-0 relative overflow-hidden md:w-1/2">
                                        <div className="absolute inset-0 bg-gradient-to-br z-10"></div>
                                        <Image
                                            src={plan.image}
                                            alt={`Imagen del plan ${plan.title}`}
                                            width={600}
                                            height={400}
                                            className="w-full h-64 md:h-80 lg:h-96 object-cover transform hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Contenido */}
                                    <div className={`flex flex-col flex-grow p-8 md:p-12 ${
                                        index % 2 === 1 ? "lg:pr-16" : "lg:pl-16"
                                    }`}>
                                        {/* Header con icono */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                                                {plan.icon}
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{plan.title}</h3>
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-4">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-4">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                        <FaCheck className="text-white text-sm" />
                                                    </div>
                                                    <span className="text-gray-700 text-base md:text-lg leading-relaxed">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer con Creditos */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
                    <Creditos />
                </div>
            </section>

            {/* Estilos CSS personalizados */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }

                .delay-200 {
                    animation-delay: 200ms;
                }

                .delay-300 {
                    animation-delay: 300ms;
                }

                .delay-500 {
                    animation-delay: 500ms;
                }

                .delay-1000 {
                    animation-delay: 1000ms;
                }

                .delay-1500 {
                    animation-delay: 1500ms;
                }
            `}</style>
        </div>
    );
}