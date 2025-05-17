import { IoMdTime } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { GiModernCity } from "react-icons/gi";
import Image from "next/image";
import DashboardEstat from "@/pages/assets/images/DashboardEstat.png";
import DashboardVentas from "@/pages/assets/images/DashboardVentas.png";
import DashboardPedid from "@/pages/assets/images/DashboardPedid.png";

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
            image: DashboardEstat,
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
            image: DashboardVentas,
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
            image: DashboardPedid,
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6">
                <h2 className="text-4xl font-bold mb-4 pt-14">Elige tu plan</h2>
                <p className="text-lg text-gray-600">
                    Selecciona el plan que mejor se adapte a las necesidades de tu negocio
                </p>
            </div>

            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-6 py-6">
                {/* Planes principales */}
                <div className="grid grid-cols-1 gap-8">
                    {planes.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={`flex flex-col items-center bg-white shadow-lg rounded-lg p-6 gap-6 lg:flex-row ${
                                index % 2 === 1 ? "lg:flex-row-reverse" : ""
                            }`}
                        >
                            <div className="flex-shrink-0 hidden lg:block">
                                <Image
                                    src={plan.image}
                                    alt={`Imagen del plan ${plan.title}`}
                                    width={500}
                                    height={300}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                            <div className="flex flex-col flex-grow lg:pl-24">
                                <div className="flex items-center gap-4 mb-4">
                                    {plan.icon}
                                    <h3 className="font-bold text-2xl">{plan.title}</h3>
                                </div>
                                <ol className="flex flex-col gap-4">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex gap-3">
                                            <FaCheck className="text-blue-600 text-xl" />
                                            {feature}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Planes adicionales */}
                <div className="space-y-8 py-30">
                    <h2 className="text-4xl font-bold mb-4 pt-14 md:pl-8">Tipos de Planes</h2>
                    <p className="text-lg text-gray-600 md:pl-8">
                        Selecciona el plan que más te convenga
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {planesAdicionales.map((plan) => (
                            <div key={plan.id} className="bg-white shadow-lg rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-4">{plan.title}</h3>
                                <p className="text-gray-600 mb-4">{plan.description}</p>
                                <p className="text-2xl font-bold mb-4">{plan.price}</p>
                                <button
                                    className="bg-green-500 text-white py-2 px-4 rounded cursor-pointer"
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

            <Creditos />
        </section>
    );
}