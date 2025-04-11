import { TbSoup } from "react-icons/tb";
import { LuCupSoda } from "react-icons/lu";
import { GiCakeSlice } from "react-icons/gi";
import { CiPizza } from "react-icons/ci";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { LuSalad } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { GoChecklist } from "react-icons/go";
import React, { useState, useEffect } from "react";
import kime from "@/pages/assets/img/kime.jpeg";
import Image from "next/image";

export default function MenuCliente() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.menu-container') && !event.target.closest('.hamburger-button')) {
                setIsOpen(false); // Close menu if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <section>
            <header>
                <nav className="w-full bg-gray-100 text-gray-800 p-4">
                    <div className="flex items-center max-w-7xl mx-auto justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <GoChecklist size={36} className="text-green-600" />
                            <h1 className="text-3xl font-bold ml-2">Comandapp</h1>
                        </div>

                        {/* Botón del menú hamburguesa */}
                        <button
                            className="z-20 cursor-pointer py-3 md:hidden hamburger-button"
                            onClick={() => setIsOpen(!isOpen)} // Toggle menu on click
                            aria-label="Toggle menu"
                        >
                            <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                            <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                            <div className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Menú desplegable */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg 
                    transition-transform duration-300 ease-in-out menu-container
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <ul className="flex flex-col mt-16 p-4 text-xl">
                    <p className="text-gray-500 font-bold">Menú principal</p>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => setIsOpen(false)} // Close menu on click
                    >
                        <IoHomeOutline className="self-center"/> Todos los platillos
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => setIsOpen(false)} // Close menu on click
                    >
                        <TbSoup className="self-center"/>Entradas
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => setIsOpen(false)} // Close menu on click
                    >
                        <GiForkKnifeSpoon className="self-center"/>Platos principales
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => setIsOpen(false)} // Close menu on click
                    >
                        <LuSalad  className="self-center"/>Ensaladas
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => setIsOpen(false)} // Close menu on click
                    >
                        <CiPizza className="self-center"/>Pizzas
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => setIsOpen(false)} // Close menu on click
                    >
                        <GiCakeSlice className="self-center" />Postres
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => setIsOpen(false)} // Close menu on click
                    >
                        <LuCupSoda className="self-center"/>Bebidas
                    </li>
                </ul>
            </div>

            {/* Card Section */}
            <section className="rounded-lg shadow-lg flex flex-col w-11/12 md:w-1/2 lg:w-1/3 mx-auto my-8 bg-white ">
                <div className="w-full h-48">
                    <Image
                        src={kime} // Usa la imagen del producto o una predeterminada
                        alt="Imagen del producto"
                        className="rounded-t-lg w-full h-full object-cover"
                        width={300}
                        height={200}
                    />
                </div>

                <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-xl">{"Ensalada César"}</h3>
                        <p className="text-xl text-green-500 font-bold">${(100.00).toFixed(2)}</p>
                    </div>
                    <p className="text-gray-500 mb-4">
                        {"Lechuga romana, crutones, parmesano y aderezo César"}
                    </p>
                    <div className="flex justify-between items-center">
                        <p className="bg-green-300 text-green-800 rounded-full px-4 py-1 text-sm">
                            {"Ensalada"}
                        </p>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </section>
            
        </section>
    );
}