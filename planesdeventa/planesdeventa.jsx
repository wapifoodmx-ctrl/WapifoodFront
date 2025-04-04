import { IoMdTime } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { GiModernCity } from "react-icons/gi";
import Image from "next/image";
import DashboardEstat from "@/pages/assets/images/DashboardEstat.png";
import DashboardVentas from "@/pages/assets/images/DashboardVentas.png";
import DashboardPedid from "@/pages/assets/images/DashboardPedid.png";
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
            image: DashboardEstat, // Ruta relativa para la imagen
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
            image: DashboardVentas, // Ruta relativa para la imagen
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
            image: DashboardPedid, // Ruta relativa para la imagen
        },
    ];

    return (
        <section className="">
            <div>
                {/* Encabezado */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h2 className="text-4xl font-bold mb-4 pt-14">Elige tu plan</h2>
                    <p className="text-lg text-gray-600">Selecciona el plan que mejor se adapte a las necesidades de tu negocio</p>
                </div>

                {/* Contenido principal */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 gap-8">
                        {planes.map((plan, index) => (
                            <div
                                key={plan.id}
                                className={`flex flex-col items-center bg-white shadow-lg rounded-lg p-6 gap-6 lg:flex-row ${
                                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                }`}
                            >
                                {/* Imagen */}
                                <div className="flex-shrink-0 hidden lg:block">
                                    <Image
                                        src={plan.image}
                                        alt={`Imagen del plan ${plan.title}`}
                                        width={500}
                                        height={300}
                                        className="rounded-lg object-cover"
                                    />
                                </div>

                                {/* Contenido del plan */}
                                <div className="flex flex-col flex-grow">
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
                </div>
            </div>

            {/* Plan adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8">
                {planes.map((plan) => (
                    <div key={plan.id} className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">{plan.title}</h3>
                        <p className="text-gray-600 mb-4">{plan.description}</p>
                        <p className="text-2xl font-bold mb-4">{plan.price}</p>
                        <button className="bg-green-500 text-white py-2 px-4 rounded">{plan.buttonText}</button>
                    </div>
                ))}
            </div>
        </section>
    );
}