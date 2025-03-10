import { AiFillSignal } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { RiCoinsLine } from "react-icons/ri";

// "Objeto que retroalimenta las tarjetas";
const data = [
    {
        icon: <IoCartOutline size={32} />,
        title: "Gestiona tus pedidos",
        interm: "Recibe y organiza pedidos en tiempo real. Mantén un seguimiento claro de cada orden y optimiza la gestión de tu negocio.",
    },
    {
        icon: <FaRegUser size={32} />,
        title: "Amigable con tus clientes ",
        interm: "Crea perfiles de usuario para tu equipo y asigna roles y permisos personalizados. Controla el acceso a la información de tu negocio.",
    },
    {
        icon: <RiCoinsLine size={32} />,
        title: "Ahorra tiempo y dinero",
        interm: "Optimiza la gestión de tu restaurante y ahorra tiempo y dinero. Comandapp te permite gestionar tu negocio de forma eficiente.",
    },
    {
        icon: <AiFillSignal size={32} />,
        title: "Informes y estadísticas",
        interm: "Visualiza informes y estadísticas en tiempo real. Comprende el rendimiento de tu negocio y toma decisiones informadas.",
    },




];

export default function Características() {
    return (

        // "Sección de las características principales de la aplicación";
        < section className="py-10 flex justify-center items-center flex-col px-8" id="caracteristicas" >

            <div className="w-full">
                <h2 className="text-4xl text-center font-bold text-black w-full">Características Principales</h2>

                <div className="flex justify-center items-center my-8 flex-col gap-12 md:flex-row md:gap-4 md:px-10 md:flex-wrap  ">
                    {
                        data.map((item, index) => (
                            <section key={index} className="bg-[#95edba] p-4 rounded-lg w-full shadow-lg flex 
                            justify-center items-center flex-col  
                            gap-4 md:w-5/12 md:min-h-[350px] 
                            md:max-h-[400px] 
                            lg:w-5/24 
                            lg:max-h-[500px] lg:min-h-[400px]  ">

                                <div className="w-fit p-4 rounded-full self-start bg-[#3fe283]">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-black self-start">{item.title}</h3>
                                <p className="text-black text-md">{item.interm}</p>
                            </section>
                        ))
                    }

                </div>
            </div>

        </section >

    )
}