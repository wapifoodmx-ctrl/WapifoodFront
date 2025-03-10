import { IoCartOutline } from "react-icons/io5";
import { FaRegCopyright } from "react-icons/fa";

export default function Creditos() {
    const data = {
        Enlaces: {
            inicios: {
                title: "Inicio",
                href: "#main",
            },
            caracteristicas: {
                title: "Cracterísticas",
                href: "#caracteristicas",
            },
            funcion: {
                title: "Funcionamiento",
                href: "#funcionamiento",
            },
            registro: {
                title: "Registro",
                href: "#registro",
            },

        },
        Legal: {
            terminos: {
                title: "Términos y condiciones",
                href: "#",
            },
            politicas: {
                title: "Políticas de privacidad",
                href: "#",
            },
            cookies: {
                title: "Cookies",
                href: "#",
            }
        }
    };

    const renderList = (title, items) => (
        <div className="flex flex-col pt-4 gap-2 w-full md:w-1/3">
            <h4 className="text-lg font-bold">{title}</h4>
            <ul className="flex flex-col gap-1">
                {Object.keys(items).map((key, index) => (
                    <li className="font-medium text-sm" key={index}> 
                    
                    <a href={items[key].href} className="hover:text-black">
                    {items[key].title}
                    </a>
                    
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <section className="flex flex-col items-center justify-center w-full px-4 py-10 bg-[#3fe283]">
            <div className="flex flex-col gap-4 w-full ">

                <div className="flex gap-4 items-center md:w-full">
                    <IoCartOutline size={32} />
                    <h3 className="font-bold text-2xl">Comandapp</h3>
                </div>
                <p className="font-medium text-sm text-left md:w-full">
                    La solución completa para la gestión de pedidos en tu negocio de comida.
                </p>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:gap-6 w-full mt-8">
                {renderList("Enlaces", data.Enlaces)}
                {renderList("Legal", data.Legal)}

                <div className="flex flex-col pt-4 gap-2 w-full md:w-1/3">
                    <h4 className="text-lg font-bold">Contacto</h4>
                    <ul className="flex flex-col gap-1">
                        <li className="font-medium text-sm" >comandaap@gmail.com</li>
                        <li className="font-medium text-sm" >1234567890</li>
                        <li className="font-medium text-sm" >Calle 123, Ciudad</li>

                    </ul>
                </div>
            </div>

            <div className="pt-8 flex items-center gap-2">
                <FaRegCopyright size={15} />
                <p className="font-medium text-sm">
                    2025 Comandapp. Todos los derechos reservados.
                </p>
            </div>
        </section>
    );
}