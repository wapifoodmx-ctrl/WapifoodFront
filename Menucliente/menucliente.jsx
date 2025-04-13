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

const productos = [
    {
        id: 1,
        nombre: "Ensalada César",
        precio: 100.0,
        descripcion: "Lechuga romana, crutones, parmesano y aderezo César",
        categoria: "Ensaladas",
        imagen: kime,
    },
    {
        id: 2,
        nombre: "Pizza Margarita",
        precio: 150.0,
        descripcion: "Masa artesanal, salsa de tomate, mozzarella y albahaca fresca",
        categoria: "Pizzas",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
    {
        id: 3,
        nombre: "Sopa de Tomate",
        precio: 80.0,
        descripcion: "Sopa cremosa de tomate con un toque de albahaca",
        categoria: "Entradas",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
    {
        id: 4,
        nombre: "Tarta de Chocolate",
        precio: 120.0,
        descripcion: "Tarta de chocolate con base de galleta y crema batida",
        categoria: "Postres",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
    {
        id: 5,
        nombre: "Hamburguesa Clásica",
        precio: 200.0,
        descripcion: "Carne de res, lechuga, tomate y cebolla en pan artesanal jhguvuhvugivbufuhbuyvuvuhbuyvuhbjhvouckuhvugcvuhvoucoucviihvouycvouhvoucuguhcoutcuhv",
        categoria: "Platos Principales",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
    {
        id: 6,
        nombre: "Batido de Fresa",
        precio: 90.0,
        descripcion: "Batido cremoso de fresa con leche y helado",
        categoria: "Bebidas",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
    {
        id: 7,
        nombre: "Ensalada de Frutas",
        precio: 70.0,
        descripcion: "Mezcla de frutas frescas de temporada",
        categoria: "Ensaladas",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
    {
        id: 8,
        nombre: "Pizza Pepperoni",
        precio: 160.0,
        descripcion: "Masa artesanal, salsa de tomate, mozzarella y pepperoni",
        categoria: "Pizzas",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
    {
        id: 9,
        nombre: "Sopa de Pollo",
        precio: 85.0,
        descripcion: "Sopa caliente de pollo con verduras frescas",
        categoria: "Entradas",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
    {
        id: 10,
        nombre: "Tarta de Limón",
        precio: 110.0,
        descripcion: "Tarta de limón con merengue y galleta",
        categoria: "Postres",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
    {
        id: 11,
        nombre: "Ensalada Griega",
        precio: 120.0,
        descripcion: "Lechuga, tomate, pepino, aceitunas y queso feta",
        categoria: "Ensaladas",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
    {
        id: 12,
        nombre: "Club Sandwich",
        precio: 150.0,
        descripcion: "Pan tostado con pollo, tocino, lechuga y tomate",
        categoria: "Platos Principales",
        imagen: kime, // Cambia por otra imagen si es necesario
    },
];

const categoriaOrden = {
    "Entradas": 0,
    "Platos Principales": 1,
    "Ensaladas": 2,
    "Pizzas": 3,
    "Postres": 4,
    "Bebidas": 5,
};

console.log(productos.map(p => ({
    nombre: p.nombre,
    categoria: p.categoria,
    orden: categoriaOrden[p.categoria],
})));

export default function MenuCliente() {
    const [isOpen, setIsOpen] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los platillos");

    const productosFiltrados = categoriaSeleccionada === "Todos los platillos"
        ? productos
        : productos.filter(producto => producto.categoria === categoriaSeleccionada);

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
                            <h1 className="text-3xl font-bold ml-2">WapiFood</h1>
                        </div>

                        {/* Botón del menú hamburguesa */}
                        <button
                            className="z-20 cursor-pointer py-3 hamburger-button"
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
                        onClick={() => {
                            setCategoriaSeleccionada("Todos los platillos");
                            setIsOpen(false);
                        }}
                    >
                        <IoHomeOutline className="self-center"/> Todos los platillos
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => {
                            setCategoriaSeleccionada("Entradas");
                            setIsOpen(false);
                        }}
                    >
                        <TbSoup className="self-center"/>Entradas
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => {
                            setCategoriaSeleccionada("Platos Principales");
                            setIsOpen(false);
                        }}
                    >
                        <GiForkKnifeSpoon className="self-center"/>Platos principales
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => {
                            setCategoriaSeleccionada("Ensaladas");
                            setIsOpen(false);
                        }}
                    >
                        <LuSalad className="self-center"/>Ensaladas
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => {
                            setCategoriaSeleccionada("Pizzas");
                            setIsOpen(false);
                        }}
                    >
                        <CiPizza className="self-center"/>Pizzas
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => {
                            setCategoriaSeleccionada("Postres");
                            setIsOpen(false);
                        }}
                    >
                        <GiCakeSlice className="self-center" />Postres
                    </li>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => {
                            setCategoriaSeleccionada("Bebidas");
                            setIsOpen(false);
                        }}
                    >
                        <LuCupSoda className="self-center"/>Bebidas
                    </li>
                </ul>
            </div>

            {/* Card Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12">
                {productosFiltrados
                    .sort((a, b) => {
                        const ordenA = categoriaOrden[a.categoria] ?? Number.MAX_SAFE_INTEGER;
                        const ordenB = categoriaOrden[b.categoria] ?? Number.MAX_SAFE_INTEGER;
                        return ordenA - ordenB;
                    })
                    .map((producto) => (
                        <div
                            key={producto.id}
                            className="rounded-lg shadow-lg flex flex-col bg-white"
                        >
                            <div className="w-full h-48">
                                <Image
                                    src={producto.imagen}
                                    alt={`Imagen de ${producto.nombre}`}
                                    className="rounded-t-lg w-full h-full object-cover"
                                    width={300}
                                    height={200}
                                />
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-xl">{producto.nombre}</h3>
                                    <p className="text-xl text-green-500 font-bold">
                                        ${producto.precio.toFixed(2)}
                                    </p>
                                </div>
                                <p className="text-gray-500 mb-4 line-clamp-2 min-h-[3rem]">
                                    {producto.descripcion.length > 80
                                        ? `${producto.descripcion.slice(0, 80)}...`
                                        : producto.descripcion}
                                </p>
                                <div className="flex justify-between items-center">
                                    <p className="bg-green-300 text-green-800 rounded-full px-4 py-1 text-sm">
                                        {producto.categoria}
                                    </p>
                                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer">
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </section>
        </section>
    );
}