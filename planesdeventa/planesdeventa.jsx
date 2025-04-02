import { IoMdTime } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { GiModernCity } from "react-icons/gi";

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
        },
        {
            id: 2,
            icon: <IoMdTime className="text-3xl bg-green-200 p-2 w-9 h-8 rounded-full" />,
            title: "Reduce tiempos de etrega",
            features: [
                "Mejora el tiempo de servicio a tus clientes",
                "Recibe ordenes desde la app directo a tu cocina",
                "opcion de ¡mas vendidos!",
            ],
        },
        {
            id: 3,
            icon: <GiModernCity className="text-3xl bg-green-200 p-2 w-9 h-8 rounded-full" />,
            title: "Moderniza tu negiocio",
            features: [
                "La app es amigable para todos los usuarios",
                "Actualizate con la vanguardia tecnologica",
                "Acepta cualquier forma de pago",
            ],
        },
    ];

    const planesAdicionales = [
        {
            id: 1,
            title: "Plan Básico",
            description: "Ideal para negocios pequeños que están empezando.",
            price: "$29.99/mes",
            buttonText: "Seleccionar",
        },
        {
            id: 2,
            title: "Plan Mensual",
            description: "Perfecto para negocios en crecimiento con más funciones.",
            price: "$49.99/mes",
            buttonText: "Seleccionar",
        },
        {
            id: 3,
            title: "Plan Anual",
            description: "Para empresas grandes que requieren todas las funciones.",
            price: "$99.99/mes",
            buttonText: "Seleccionar",
        },
    ];

    return (
        <section className="">
            <div>
                {/* Encabezado */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">1</span>
                        <span className="flex-1 h-1 mx-2 bg-black"></span>
                        <span className="flex items-center justify-center w-8 h-8 rounded-full border-1">2</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 pt-14">Elige tu plan</h2>
                    <p className="text-lg text-gray-600">Selecciona el plan que mejor se adapte a las necesidades de tu negocio</p>
                </div>

                {/* Contenido principal */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {planes.map((plan) => (
                            <div key={plan.id} className="bg-white shadow-lg rounded-lg p-6 gap-4">
                                <div className="flex gap-4">
                                    {plan.icon}
                                    <h3 className="flex font-bold text-2xl">{plan.title}</h3>
                                </div>
                                <ol className="flex flex-col gap-4 py-4">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex gap-3">
                                            <FaCheck className="text-blue-600 text-xl" />
                                            {feature}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Plan adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8">
                {planesAdicionales.map((plan) => (
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