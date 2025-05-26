import { IoMdTime } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { GiModernCity } from "react-icons/gi";
import Image from "next/image";
import Vistadecocina from "@/pages/assets/images/Vistadecocina.png";
import Menu1 from "@/pages/assets/images/Menu1.png";
import Pntoventa from "@/pages/assets/images/Pntoventa.png";
import Creditos from "@/components/Creditos";
import getPaymentsLink, { getAllPaymentLinks } from "@/useCases/getPaymentsLink";
import { useEffect, useState } from "react";

export default function PlanDeVentas() {
    const planes = [
        {
            id: 1,
            icon: <LuNotebookPen className="text-3xl bg-green-200 p-2 w-9 h-8 rounded-full" />,
            title: "Registra tus pedidos en tiempo real",
            features: [
                "Recibe los datos de tus ventas al momento",
                "Se registran ventas y rendimiento hasta anualmente",
                "Grafica tu rendimiento para mejor comprencion",
            ],
            image: Vistadecocina,
        },
        {
            id: 2,
            icon: <IoMdTime className="text-3xl bg-green-200 p-2 w-9 h-8 rounded-full" />,
            title: "Reduce tiempos de entrega",
            features: [
                "Mejora el tiempo de servicio a tus clientes",
                "Recibe ordenes desde la app directo a tu cocina",
                "Opción de ¡más vendidos!",
            ],
            image: Menu1,
        },
        {
            id: 3,
            icon: <GiModernCity className="text-3xl bg-green-200 p-2 w-9 h-8 rounded-full" />,
            title: "Moderniza tu negocio",
            features: [
                "La app es amigable para todos los usuarios",
                "Actualízate con la vanguardia tecnológica",
                "Acepta cualquier forma de pago",
            ],
            image: Pntoventa,
        },
    ];

    const [planesAdicionales, setPlanesAdicionales] = useState([
        {
            id: 1,
            title: "Plan Ventas",
            description: "App de punto de venta para tu negocio.",
            price: "$100.00 mxn al mes",
            buttonText: "Seleccionar",
            prop: "basico",
            link: null,
        },
        {
            id: 2,
            title: "Plan Restaurante",
            description: "App de punto de venta + 15 mesas para tu negocio.",
            price: "$200.00 mxn al mes",
            buttonText: "Seleccionar",
            prop: "profesional",
            link: null,
        },
        {
            id: 3,
            title: "Plan Restaurante +",
            description: "App de punto de venta + 25 mesas para tu negocio.",
            price: "$300.00 mxn al mes",
            buttonText: "Seleccionar",
            prop: "empresarial",
            link: null,
        },
    ]);

    useEffect(() => {
        const fetchPaymentLinks = async () => {
            try {
                const updatedPlans = await getAllPaymentLinks(planesAdicionales);
                setPlanesAdicionales(updatedPlans);
            } catch (error) {
                console.error("Error al cargar los enlaces de pago:", error.message);
            }
        };

        fetchPaymentLinks();
    }, []);

    return (
        <section>
            {/* Tipos de Planes - Ahora arriba */}
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-6 py-6">
                <div className="space-y-6 md:space-y-8 py-16 md:py-20 lg:py-30">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 pt-8 md:pt-14 md:pl-8">Tipos de Planes</h2>
                        <p className="text-base md:text-lg text-gray-600 md:pl-8">
                            Selecciona el plan que más te convenga
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {planesAdicionales.map((plan) => (
                            <div key={plan.id} className="bg-white shadow-lg rounded-lg p-4 md:p-6 flex flex-col h-full">
                                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{plan.title}</h3>
                                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base flex-grow">{plan.description}</p>
                                <p className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-green-600">{plan.price}</p>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 md:py-3 px-4 md:px-6 rounded cursor-pointer transition-colors duration-200 w-full text-sm md:text-base"
                                    onClick={() => {
                                        if (plan.link) {
                                            window.location.href = plan.link; // Redirigir al enlace de pago
                                        } else {
                                            console.error("El enlace de pago no está disponible.");
                                        }
                                    }}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Elige tu plan - Ahora abajo */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6 ">
                <h2 className="text-2xl md:text-4xl font-bold mb-4  text-center md:text-left">Elige tu plan</h2>
                <p className="text-base md:text-lg text-gray-600 text-center md:text-left">
                    Selecciona el plan que mejor se adapte a las necesidades de tu negocio
                </p>
            </div>

            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-6 py-6 pb-20">
                {/* Planes principales */}
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                    {planes.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={`flex flex-col bg-white shadow-lg rounded-lg p-4 md:p-6 gap-4 md:gap-6 md:flex-row lg:items-center ${
                                index % 2 === 1 ? "md:flex-row-reverse" : ""
                            }`}
                        >
                            <div className="flex-shrink-0 hidden md:block lg:block">
                                <Image
                                    src={plan.image}
                                    alt={`Imagen del plan ${plan.title}`}
                                    width={500}
                                    height={400}
                                    className="rounded-lg object-cover w-full md:w-[500px] lg:w-[700px] h-auto"
                                />
                            </div>
                            <div className={`flex flex-col flex-grow md:px-4 ${
                                index % 2 === 1 ? "lg:pr-24" : "lg:pl-24"
                            }`}>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mb-4">
                                    {plan.icon}
                                    <h3 className="font-bold text-xl md:text-2xl">{plan.title}</h3>
                                </div>
                                <ol className="flex flex-col gap-3 md:gap-4">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex gap-3 text-sm md:text-base">
                                            <FaCheck className="text-blue-600 text-lg md:text-xl flex-shrink-0 mt-1" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Creditos />
        </section>
    );
}