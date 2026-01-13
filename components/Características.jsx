import { AiFillSignal } from "react-icons/ai";
import { IoCartOutline, IoRestaurantOutline } from "react-icons/io5";
import { FaRegUser, FaUserTie, FaConciergeBell } from "react-icons/fa";
import { RiCoinsLine } from "react-icons/ri";
import { MdOutlinePointOfSale, MdOutlineInventory2, MdOutlineReceipt, MdOutlineTableRestaurant, MdOutlineMenuBook } from "react-icons/md";
import { HiOutlineChartBar, HiOutlineClock, HiOutlineDeviceMobile } from "react-icons/hi";
import { GiCook } from "react-icons/gi";
import { BiReceipt } from "react-icons/bi";

// Features principales del software
const mainFeatures = [
    {
        icon: <MdOutlinePointOfSale size={32} />,
        title: "Punto de Venta",
        description: "Sistema de cobro completo con múltiples métodos de pago, descuentos y generación automática de tickets.",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        icon: <GiCook size={32} />,
        title: "Gestión de Cocina",
        description: "Los cocineros reciben pedidos casi en tiempo real, marcan productos como preparados y la mesa se notifica a tu cliente.",
        gradient: "from-orange-500 to-amber-500"
    },
    {
        icon: <MdOutlineMenuBook size={32} />,
        title: "Ticket Digital QR",
        description: "Tus clientes pueden ver su ticket digital escaneando un código QR, sin necesidad de apps ni descargas.",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: <FaUserTie size={32} />,
        title: "Portal de Meseros",
        description: "Los meseros gestionan mesas, toman pedidos y ven el estado de preparación desde su celular casi en tiempo real.",
        gradient: "from-purple-500 to-indigo-500"
    },
    {
        icon: <HiOutlineChartBar size={32} />,
        title: "Dashboard Analytics",
        description: "Visualiza ventas por día, productos más vendidos, rendimiento de meseros y estadísticas clave de tu negocio.",
        gradient: "from-teal-500 to-green-500"
    },
    {
        icon: <MdOutlineInventory2 size={32} />,
        title: "Control de Inventario",
        description: "Gestiona ingredientes, recetas, controla stock y descarga reportes de inventario.",
        gradient: "from-rose-500 to-pink-500"
    },
];

const additionalFeatures = [
    { icon: <BiReceipt size={24} />, title: "Tickets digitales", description: "Genera y visualiza tickets de cada pedido" },
    { icon: <MdOutlineTableRestaurant size={24} />, title: "Gestión de mesas", description: "Controla ocupación y estados de mesa" },
    { icon: <IoRestaurantOutline size={24} />, title: "Recetas y costos", description: "Vincula ingredientes y calcula costos" },
    { icon: <FaConciergeBell size={24} />, title: "Notificaciones", description: "Alertas casi en tiempo real de pedidos" },
    { icon: <HiOutlineDeviceMobile size={24} />, title: "Multi-dispositivo", description: "Funciona en PC y dispositivos móviles" },
    { icon: <HiOutlineClock size={24} />, title: "Tiempo real", description: "Sincronización casi instantánea" },
];

export default function Características() {
    return (
        <section className="py-16 flex justify-center items-center flex-col px-4 md:px-8 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50" id="caracteristicas">
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                        ✨ Todo incluido
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4">
                        Un ecosistema completo para tu restaurante
                    </h2>
                    <p className="text-green-600 text-lg max-w-2xl mx-auto">
                        Desde que el cliente ordena hasta que paga, WapiFood conecta cada parte de tu operación en tiempo real.
                    </p>
                </div>

                {/* Main Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {mainFeatures.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>

                {/* Additional Features */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
                        Y mucho más...
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {additionalFeatures.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300"
                            >
                                <div className="text-white mb-2 flex justify-center">
                                    {item.icon}
                                </div>
                                <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                                <p className="text-green-100 text-xs">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12">
                    <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl md:text-4xl font-medium text-green-600 mb-1">0%</div>
                        <div className="text-gray-600 text-xs md:text-sm">Comisiones por venta</div>
                    </div>
                    <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl md:text-4xl font-medium text-green-600 mb-1">GRATIS</div>
                        <div className="text-gray-600 text-xs md:text-sm">Soporte técnico con su suscripción</div>
                    </div>
                    <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl md:text-4xl font-medium text-green-600 mb-1">5 min</div>
                        <div className="text-gray-600 text-xs md:text-sm">Para configurar</div>
                    </div>
                    <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl md:text-4xl font-medium text-green-600 mb-1">Paquetes</div>
                        <div className="text-gray-600 text-xs md:text-sm">Para todos los restaurantes</div>
                    </div>
                </div>
            </div>
        </section>
    )
}