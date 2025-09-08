import { IoCartOutline } from "react-icons/io5";
import { FaRegCopyright, FaWhatsapp } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

export default function Creditos() {
    const data = {
        Enlaces: {
            inicios: {
                title: "Inicio",
                href: "#main",
            },
            caracteristicas: {
                title: "Características",
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
                href: "/terminosyCondiciones",
            },
           
        }
    };

    const renderList = (title, items) => (
        <div className="flex flex-col pt-4 gap-3 w-full md:w-1/4">
            <h4 className="text-xl font-bold text-green-900">{title}</h4>
            <ul className="flex flex-col gap-2">
                {Object.keys(items).map((key, index) => (
                    <li className="font-medium text-sm" key={index}> 
                        <a 
                            href={items[key].href} 
                            className="text-green-800 hover:text-white transition-colors duration-200 flex items-center gap-1"
                        >
                            {items[key].title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <footer className="bg-gradient-to-br from-green-300 via-emerald-200 to-teal-200 shadow-inner">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg">
                            <IoCartOutline size={32} className="text-white" />
                        </div>
                        <h3 className="font-bold text-2xl bg-gradient-to-r from-green-800 via-emerald-700 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">WapiFood</h3>
                    </div>
                    <p className="font-medium text-green-700 md:w-full max-w-md">
                        La solución completa para la gestión de pedidos en tu negocio de comida. Simplifica tus operaciones y mejora la experiencia de tus clientes.
                    </p>

                    {/* Social Media Icons */}
                    <div className="flex gap-4">
                        <a href="https://www.facebook.com/people/Wapifood/61579855973221/" target="_blank" className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white hover:scale-110 transition-transform duration-200 shadow-md">
                            <FaFacebook size={18} />
                        </a>
                        <a href="https://www.tiktok.com/@wapifood" target="_blank" className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white hover:scale-110 transition-transform duration-200 shadow-md">
                            <FaTiktok size={18} />
                        </a>
                        <a href="https://www.instagram.com/wapi.food/" target="_blank" className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white hover:scale-110 transition-transform duration-200 shadow-md">
                            <FaInstagram size={18} />
                        </a>
                        <a href="https://api.whatsapp.com/message/DJESQM3TOQH5G1" target="_blank" className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white hover:scale-110 transition-transform duration-200 shadow-md">
                            <FaWhatsapp size={18} />
                        </a>
                    </div>
                </div>

                <hr className="my-8 border-green-400/30" />

                <div className="flex flex-col md:flex-row md:justify-between md:gap-10 w-full">
                    {renderList("Enlaces", data.Enlaces)}
                    {renderList("Legal", data.Legal)}

                    <div className="flex flex-col pt-4 gap-3 w-full md:w-1/3">
                        <h4 className="text-xl font-bold text-green-900">Contacto</h4>
                        <ul className="flex flex-col gap-3">
                            <li className="font-medium text-green-800 flex items-center gap-2">
                                <MdEmail size={18} className="text-emerald-600" />wapitech.dev@gmail.com
                            </li>
                            <li className="font-medium text-green-800 flex items-center gap-2">
                                <MdPhone size={18} className="text-emerald-600" />+52 5520535967
                            </li>
                            
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex items-center justify-center gap-2 text-green-800">
                    <FaRegCopyright size={15} />
                    <p className="font-medium text-sm">
                        2025 WapiFood. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}