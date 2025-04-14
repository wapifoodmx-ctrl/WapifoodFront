import { TbSoup } from "react-icons/tb";
import { LuCupSoda } from "react-icons/lu";
import { GiCakeSlice } from "react-icons/gi";
import { CiPizza } from "react-icons/ci";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { LuSalad } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { GoChecklist } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";
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
        ingredientes: ["Lechuga romana", "Crutones", "Parmesano", "Aderezo César"],
    },
    {
        id: 2,
        nombre: "Pizza Margarita",
        precio: 150.0,
        descripcion: "Masa artesanal, salsa de tomate, mozzarella y albahaca fresca",
        categoria: "Pizzas",
        imagen: kime,
        ingredientes: ["Masa artesanal", "Salsa de tomate", "Mozzarella", "Albahaca fresca"],
    },
    {
        id: 3,
        nombre: "Sopa de Tomate",
        precio: 80.0,
        descripcion: "Sopa cremosa de tomate con un toque de albahaca",
        categoria: "Entradas",
        imagen: kime,
        ingredientes: ["Tomate", "Cebolla", "Ajo", "Albahaca"],
    },
    {
        id: 4,
        nombre: "Tarta de Chocolate",
        precio: 120.0,
        descripcion: "Tarta de chocolate con base de galleta y crema batida",
        categoria: "Postres",
        imagen: kime,
        ingredientes: ["Chocolate", "Galleta", "Crema batida"],
    },
    {
        id: 5,
        nombre: "Hamburguesa Clásica",
        precio: 200.0,
        descripcion: "Carne de res, lechuga, tomate y cebolla en pan artesanal jhguvuhvugivbufuhbuyvuvuhbuyvuhbjhvouckuhvugcvuhvoucoucviihvouycv ouhvoucuguhcoutcuhv",
        categoria: "Platos Principales",
        imagen: kime,   
        ingredientes: ["Carne de res", "Lechuga", "Tomate", "Cebolla", "Pan artesanal"],
    },
    {
        id: 6,
        nombre: "Batido de Fresa",
        precio: 90.0,
        descripcion: "Batido cremoso de fresa con leche y helado",
        categoria: "Bebidas",
        imagen: kime,
        ingredientes: ["Fresa", "Leche", "Helado"],
    },
    {
        id: 7,
        nombre: "Ensalada de Frutas",
        precio: 70.0,
        descripcion: "Mezcla de frutas frescas de temporada",
        categoria: "Ensaladas",
        imagen: kime,
        ingredientes: ["Fresas", "Kiwi", "Piña", "Mango"],
    },
    {
        id: 8,
        nombre: "Pizza Pepperoni",
        precio: 160.0,
        descripcion: "Masa artesanal, salsa de tomate, mozzarella y pepperoni",
        categoria: "Pizzas",
        imagen: kime,
        ingredientes: ["Masa artesanal", "Salsa de tomate", "Mozzarella", "Pepperoni"],
    },
    {
        id: 9,
        nombre: "Sopa de Pollo",
        precio: 85.0,
        descripcion: "Sopa caliente de pollo con verduras frescas",
        categoria: "Entradas",
        imagen: kime,
        ingredientes: ["Pollo", "Zanahoria", "Apio", "Cebolla"],
    },
    {
        id: 10,
        nombre: "Tarta de Limón",
        precio: 110.0,
        descripcion: "Tarta de limón con merengue y galleta",
        categoria: "Postres",
        imagen: kime,
        ingredientes: ["Limón", "Galleta", "Merengue"],
    },
    {
        id: 11,
        nombre: "Ensalada Griega",
        precio: 120.0,
        descripcion: "Lechuga, tomate, pepino, aceitunas y queso feta",
        categoria: "Ensaladas",
        imagen: kime,
        ingredientes: ["Lechuga", "Tomate", "Pepino", "Aceitunas", "Queso feta"],
    },
    {
        id: 12,
        nombre: "Club Sandwich",
        precio: 150.0,
        descripcion: "Pan tostado con pollo, tocino, lechuga y tomate",
        categoria: "Platos Principales",
        imagen: kime,
        ingredientes: ["Pan tostado", "Pollo", "Tocino", "Lechuga", "Tomate"],
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

export default function MenuCliente() {
    const [isOpen, setIsOpen] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los platillos");
    const [modalOpen, setModalOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [carritoModalOpen, setCarritoModalOpen] = useState(false);

    const productosFiltrados = categoriaSeleccionada === "Todos los platillos"
        ? productos
        : productos.filter(producto => producto.categoria === categoriaSeleccionada);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.menu-container') && !event.target.closest('.hamburger-button')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const openModal = (producto) => {
        setProductoSeleccionado(producto);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setProductoSeleccionado(null);
    };

    const agregarAlCarrito = (producto) => {
        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find((item) => item.id === producto.id);
            if (productoExistente) {
                return prevCarrito.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + producto.cantidad }
                        : item
                );
            }
            return [...prevCarrito, { ...producto, cantidad: producto.cantidad || 1 }];
        });
        closeModal();
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2);
    };

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

            {/* Botón flotante del carrito */}
            <button
                className="fixed bottom-10 right-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-green-600"
                onClick={() => setCarritoModalOpen(true)}
            >
                <FaShoppingCart className="text-xl" />
                {carrito.length > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {carrito.length}
                    </span>
                )}
            </button>

            {/* Modal del carrito */}
            {carritoModalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 z-50 flex justify-end"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setCarritoModalOpen(false);
                        }
                    }}
                >
                    <div className="bg-white w-80 h-full shadow-lg p-4">
                        <h2 className="text-xl font-bold mb-4">Tu Pedido</h2>
                        {carrito.length > 0 ? (
                            <ul className="mb-4">
                                {carrito.map((item) => (
                                    <li key={item.id} className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="font-bold">{item.nombre}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.cantidad} x ${item.precio.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="font-bold">
                                            ${(item.cantidad * item.precio).toFixed(2)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Tu carrito está vacío.</p>
                        )}
                        <div className="border-t pt-4">
                            <p className="text-lg font-bold">Total: ${calcularTotal()}</p>
                            <button
                                className="bg-green-500 text-white w-full py-2 rounded-lg mt-4 hover:bg-green-600"
                                onClick={() => {
                                    alert("Pedido realizado con éxito.");
                                    setCarrito([]);
                                    setCarritoModalOpen(false);
                                }}
                            >
                                Realizar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {modalOpen && productoSeleccionado && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-50"
                    onClick={(e) => {
                        // Cierra la modal si el clic ocurre fuera del contenido
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-4 w-10/12 md:w-7/10  relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={closeModal}
                        >
                            ✖
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">{productoSeleccionado.nombre}</h2>
                        <div className="w-full h-40 mb-4 flex justify-center">
                            <Image
                                src={productoSeleccionado.imagen}
                                alt={`Imagen de ${productoSeleccionado.nombre}`}
                                className="rounded-lg object-cover"
                                width={200}
                                height={150}
                            />
                        </div>
                        <p className="text-gray-700 mb-4 text-center text-sm">{productoSeleccionado.descripcion}</p>
                        <h3 className="text-md font-semibold mb-2">Ingredientes:</h3>
                        <ul className="mb-4 text-sm">
                            {productoSeleccionado.ingredientes.map((ingrediente, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <input type="checkbox" id={`ingrediente-${index}`} />
                                    <label htmlFor={`ingrediente-${index}`}>{ingrediente}</label>
                                </li>
                            ))}
                        </ul>
                        <textarea
                            className="w-full border rounded-lg p-2 mb-4 text-sm"
                            rows="3"
                            placeholder="Escribe tus comentarios aquí..."
                        ></textarea>

                        {/* Contador, Botones y Botón Agregar en la misma línea */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <button
                                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center"
                                    onClick={() => setProductoSeleccionado({
                                        ...productoSeleccionado,
                                        cantidad: Math.max((productoSeleccionado.cantidad || 1) - 1, 1),
                                    })}
                                >
                                    -
                                </button>
                                <span className="text-lg font-bold">{productoSeleccionado.cantidad || 1}</span>
                                <button
                                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center"
                                    onClick={() => setProductoSeleccionado({
                                        ...productoSeleccionado,
                                        cantidad: (productoSeleccionado.cantidad || 1) + 1,
                                    })}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
                                onClick={() => agregarAlCarrito(productoSeleccionado)}
                            >
                                Agregar - ${((productoSeleccionado.cantidad || 1) * productoSeleccionado.precio).toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer"
                                        onClick={() => openModal(producto)}
                                    >
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