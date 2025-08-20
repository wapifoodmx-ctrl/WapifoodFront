import { AiFillSignal } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { RiCoinsLine } from "react-icons/ri";

// "Objeto que retroalimenta las tarjetas";
const data = [
    {
        icon: <IoCartOutline size={32} />,
        title: "Gestiona tus pedidos",
        interm: "Recibe y organiza pedidos. Mantén un seguimiento claro de cada orden y optimiza la gestión de tu negocio.",
    },
    {
        icon: <FaRegUser size={32} />,
        title: "Amigable con tus clientes ",
        interm: "Crea perfiles de usuario para tu equipo y asigna roles y permisos personalizados. Controla el acceso a la información de tu negocio.",
    },
    {
        icon: <RiCoinsLine size={32} />,
        title: "Ahorra tiempo y dinero",
        interm: "Optimiza la gestión de tu restaurante y ahorra tiempo y dinero. WapiFood te permite gestionar tu negocio de forma eficiente.",
    },
    {
        icon: <AiFillSignal size={32} />,
        title: "Informes y estadísticas",
        interm: "Visualiza tus informes y estadísticas cuando quieras. Comprende el rendimiento de tu negocio y toma decisiones informadas.",
    },
    



];

export default function Características() {
    return (
        // Sección de las características principales de la aplicación
        <section className="py-10 flex justify-center items-center flex-col px-8 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50" id="caracteristicas">
            <div className="w-full">
                <h2 className="text-4xl text-center font-extrabold  w-full mb-8 drop-shadow-lg bg-gradient-to-r text-green-800  to-teal-200 bg-clip-text ">
                    Características Principales
                </h2>
                <div className="flex justify-center items-center my-8 flex-col gap-12 md:flex-row md:gap-6 md:px-10 md:flex-wrap">
                    {data.map((item, index) => (
                        <section
                            key={index}
                            className="bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 p-6 rounded-3xl w-full shadow-2xl flex justify-center items-center flex-col gap-4 md:w-5/12 md:min-h-[350px] md:max-h-[400px] lg:w-5/24 lg:max-h-[500px] lg:min-h-[400px] border-2 border-green-200 hover:scale-105 transition-all duration-300"
                        >
                            <div className="w-fit p-4 rounded-full self-start bg-gradient-to-br from-green-400 via-emerald-300 to-teal-200 shadow-lg">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-green-800 self-start drop-shadow">
                                {item.title}
                            </h3>
                            <p className="text-green-700 text-md">{item.interm}</p>
                        </section>
                    ))}
                </div>
            </div>
        </section>
    )
}