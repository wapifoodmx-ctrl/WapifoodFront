import { MdOutlineQrCode2, MdOutlineRestaurantMenu, MdOutlinePointOfSale, MdOutlineNotificationsActive } from "react-icons/md";
import { GiCook } from "react-icons/gi";
import { FaUserTie, FaCheck } from "react-icons/fa";
import { HiOutlineClipboardCheck, HiArrowRight } from "react-icons/hi";
import { BiReceipt } from "react-icons/bi";

export default function Funcionamiento() {
    const workflow = [
        {
            step: "1",
            title: "El cliente escanea el QR",
            description: "Tu cliente llega a tu restaurante y puede auto-servirse desde un menú digital o ser atendido por un mesero.",
            icon: <MdOutlineQrCode2 size={28} />,
            color: "from-blue-500 to-cyan-500"
        },
        {
            step: "2",
            title: "Orden 100% digital",
            description: "Explora el menú con fotos y descripciones, personaliza su pedido y envía la orden directamente a cocina.",
            icon: <MdOutlineRestaurantMenu size={28} />,
            color: "from-green-500 to-emerald-500"
        },
        {
            step: "3",
            title: "Cocina recibe el pedido",
            description: "El cocinero ve el pedido, prepara los productos y los marca como listos cuando están terminados.",
            icon: <GiCook size={28} />,
            color: "from-orange-500 to-amber-500"
        },
        {
            step: "4",
            title: "El mesero entrega la comida",
            description: "El mesero entrega el pedido cuando está listo.",
            icon: <MdOutlineNotificationsActive size={28} />,
            color: "from-purple-500 to-indigo-500"
        },
        {
            step: "5",
            title: "Se genera el ticket",
            description: "Al finalizar, se genera automáticamente el ticket con el desglose, método de pago y propina.",
            icon: <BiReceipt size={28} />,
            color: "from-teal-500 to-green-500"
        },
    ]

    const benefits = [
        "Reduce errores en los pedidos",
        "Aumenta la rotación de mesas",
        "Mejora la experiencia del cliente",
        "Ahorra en impresiones de menú",
        "Datos siempre disponibles",
        "Sin capacitación compleja"
    ]

    return (
        <section className="bg-gradient-to-br from-gray-50 via-white to-green-50 py-20 px-4 md:px-10" id="funcionamiento">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                        ⚡ Flujo de trabajo
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                        ¿Cómo funciona WapiFood?
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Un flujo simple y automatizado que conecta a tus clientes, meseros y cocina.
                    </p>
                </div>

                {/* Workflow Steps */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-green-200 to-teal-200 transform -translate-y-1/2 z-0"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
                        {workflow.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                                    {/* Step number with icon */}
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg mb-4`}>
                                        {item.icon}
                                    </div>
                                    
                                    {/* Step badge */}
                                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        {item.step}
                                    </div>
                                    
                                    <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm flex-grow">{item.description}</p>
                                </div>
                                
                                {/* Arrow for desktop */}
                                {index < workflow.length - 1 && (
                                    <div className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-20">
                                        <HiArrowRight className="text-gray-300" size={24} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Resultados que notarás desde el primer día
                            </h3>
                            <p className="text-green-100 text-lg">
                                WapiFood no solo organiza tu operación, también mejora la experiencia de tus clientes y aumenta la eficiencia de tu equipo.
                            </p>
                        </div>
                        <div className="md:w-1/2">
                            <div className="grid grid-cols-2 gap-3">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                                        <FaCheck className="text-green-200 flex-shrink-0" size={14} />
                                        <span className="text-white text-sm font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}