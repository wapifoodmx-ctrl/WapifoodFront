import { IoCartOutline } from "react-icons/io5";
import { FaRegCopyright } from "react-icons/fa";

export default function Creditos() {
    const data = {
        Enlaces: {
            inicios: "Inicio",
            caracteristicas: "Características",
            funcion: "Funcionamiento",
            registro: "Registro",
        },
        Legal: {
            terminos: "Términos y condiciones",
            politicas: "Políticas de privacidad",
            cookies: "Cookies",
        },
        Contacto: {
            email: "comandaap@gmail.com",
            telefono: "1234567890",
            direccion: "Calle 123, Ciudad",
        },
    };

    const renderList = (title, items) => (
        <div className="flex flex-col pt-4 gap-2 w-full md:w-1/3">
            <h4 className="text-lg font-bold">{title}</h4>
            <ul className="flex flex-col gap-1">
                {Object.keys(items).map((item, index) => (
                    <li className="font-medium text-sm" key={index}>{items[item]}</li>
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
                {renderList("Contacto", data.Contacto)}
            </div>

            <div className="pt-8 flex items-center gap-2">
                <FaRegCopyright size={15} />
                <p className="font-medium text-sm">
                    2021 Comandapp. Todos los derechos reservados.
                </p>
            </div>
        </section>
    );
}