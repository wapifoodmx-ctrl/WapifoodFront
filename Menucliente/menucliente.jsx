import { FaRegEye } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
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
import Burger from "@/pages/assets/img/Burger.jpg";
import Sopadetomate from "@/pages/assets/img/sopatomate.jpg";
import Sopadepollo from "@/pages/assets/img/sopadepollo.jpeg";
import Clubsandwich from "@/pages/assets/img/clubsandwich.jpg";
import Cesar from "@/pages/assets/img/Cesar.jpg";
import Fruta from "@/pages/assets/img/fruta.jpg";
import Image from "next/image";

const productos = [
    {
        id: 1,
        nombre: "Ensalada César",
        precio: 100.0,
        descripcion: "Lechuga romana, crutones, parmesano y aderezo César",
        categoria: "Ensaladas",
        imagen: Cesar,
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
        imagen: Sopadetomate,
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
        descripcion: "Carne de res, lechuga, tomate y cebolla en pan artesanal, preparado con los mejores ingredientes y la carne mas selecta del mercado, con un adereso de mango que le da un sabor único y espectacular, con 2 carnes y 2 quesos, acompañado de papas fritas y una bebida de tu elección",
        categoria: "Platos Principales",
        imagen: Burger,   
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
        imagen: Fruta,
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
        imagen: Sopadepollo,
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
        imagen: Clubsandwich,
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
    const [productosFiltrados, setProductosFiltrados] = useState(productos);
    const [mensajeError, setMensajeError] = useState(""); // Estado para manejar el mensaje de error
    const [historialPedidos, setHistorialPedidos] = useState([]); // Estado para manejar el historial de pedidos
    const [modalTotalOpen, setModalTotalOpen] = useState(false); // Estado para la modal del total
    const [totalPedidos, setTotalPedidos] = useState(0); // Estado para almacenar el total acumulado

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

    useEffect(() => {
        setProductosFiltrados(
            categoriaSeleccionada === "Todos los platillos"
                ? productos
                : productos.filter(producto => producto.categoria === categoriaSeleccionada)
        );
    }, [categoriaSeleccionada]);

    useEffect(() => {
        // Recuperar carrito y historial de pedidos desde localStorage
        const carritoGuardado = localStorage.getItem("carrito");
        const historialGuardado = localStorage.getItem("historialPedidos");

        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }

        if (historialGuardado) {
            setHistorialPedidos(JSON.parse(historialGuardado));
        }
    }, []);

    useEffect(() => {
        // Guardar el carrito en localStorage
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    useEffect(() => {
        // Guardar el historial de pedidos en localStorage
        localStorage.setItem("historialPedidos", JSON.stringify(historialPedidos));
    }, [historialPedidos]);

    const openModal = (producto) => {
        setProductoSeleccionado(producto);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setProductoSeleccionado(null);
    };

    const agregarAlCarrito = (producto) => {
        const ingredientesExcluidos = Array.from(
            document.querySelectorAll('input[type="checkbox"]:checked')
        ).map((checkbox) => checkbox.nextSibling.textContent.replace("Sin ", "").trim());

        const productoConExclusiones = {
            ...producto,
            id: `${producto.id}-${ingredientesExcluidos.join(",")}`, // Genera un ID único basado en las exclusiones
            ingredientesExcluidos,
        };

        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find((item) => item.id === productoConExclusiones.id);
            if (productoExistente) {
                // Incrementa la cantidad del producto existente
                return prevCarrito.map((item) =>
                    item.id === productoConExclusiones.id
                        ? { ...item, cantidad: item.cantidad + (producto.cantidad || 1) }
                        : item
                );
            }
            // Agrega el producto al carrito si no existe
            return [...prevCarrito, { ...productoConExclusiones, cantidad: producto.cantidad || 1 }];
        });
    };

    const calcularTotal = () => {
        // Si el carrito está vacío, devuelve 0
        if (!carrito || carrito.length === 0) {
            return 0;
        }

        // Calcula el total sumando el precio de cada producto multiplicado por su cantidad
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2);
    };

    const realizarPedido = () => {
        if (carrito.length === 0) {
            setMensajeError("No puedes seguir porque no hay artículos en tu carrito");
            return;
        }

        // Agregar los productos del carrito al historial
        setHistorialPedidos((prevHistorial) => [
            ...prevHistorial,
            ...carrito.map((item) => ({
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
                ingredientesExcluidos: item.ingredientesExcluidos || [],
            })),
        ]);

        // Limpia el carrito y cierra la modal
        setCarrito([]);
        setCarritoModalOpen(false);
        setMensajeError(""); // Limpia el mensaje de error
    };

    const terminarOrden = () => {
        // Calcula el total acumulado del historial
        const total = historialPedidos.reduce(
            (acc, item) => acc + item.precio * item.cantidad,
            0
        );

        // Actualiza el total y abre la modal del total
        setTotalPedidos(total.toFixed(2));
        setHistorialPedidos([]); // Limpia el historial de pedidos
        setModalTotalOpen(true); // Abre la modal del total
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
                    <div className="bg-white w-80 h-full shadow-lg p-4 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Tu Pedido</h2>

                        {/* Carrito actual */}
                        {carrito.length > 0 ? (
                            <ul className="mb-4">
                                {carrito.map((item) => (
                                    <li key={item.id} className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="font-bold">{item.nombre}</p>
                                            {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                <p className="text-sm text-gray-500">
                                                    Sin: {item.ingredientesExcluidos.join(", ")}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-500">
                                                ${item.precio.toFixed(2)} c/u
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="bg-gray-300 text-gray-800 px-2 py-0.5 rounded hover:bg-gray-400"
                                                onClick={() => {
                                                    setCarrito((prevCarrito) =>
                                                        prevCarrito.map((producto) =>
                                                            producto.id === item.id
                                                                ? { ...producto, cantidad: Math.max(producto.cantidad - 1, 1) }
                                                                : producto
                                                        )
                                                    );
                                                }}
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-bold">{item.cantidad}</span>
                                            <button
                                                className="bg-gray-300 text-gray-800 px-2 py-0.5 rounded hover:bg-gray-400"
                                                onClick={() => {
                                                    setCarrito((prevCarrito) =>
                                                        prevCarrito.map((producto) =>
                                                            producto.id === item.id
                                                                ? { ...producto, cantidad: producto.cantidad + 1 }
                                                                : producto
                                                        )
                                                    );
                                                }}
                                                
                                            >
                                                +
                                            </button>
                                            <button
                                                className="text-xl"
                                                onClick={() => {
                                                    setCarrito((prevCarrito) =>
                                                        prevCarrito.filter((producto) => producto.id !== item.id)
                                                    );
                                                }}
                                            >
                                                <IoTrashOutline />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Tu carrito está vacío.</p>
                        )}

                        {/* Total del carrito */}
                        <div className="border-t pt-4">
                            <p className="text-lg font-bold">Total: ${calcularTotal()}</p>
                            {mensajeError && (
                                <p className="text-red-500 text-sm font-bold mt-2">{mensajeError}</p>
                            )}
                            <button
                                className="bg-green-500 text-white w-full py-2 rounded-lg mt-4 hover:bg-green-600"
                                onClick={realizarPedido}
                            >
                                Realizar Pedido
                            </button>
                        </div>

                        {/* Historial de pedidos */}
                        {historialPedidos.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-500 mb-2">Historial de Pedidos</h3>
                                <ul className="space-y-0">
                                    {historialPedidos.map((item, index) => (
                                        <li key={index} className="p-2 rounded shadow">
                                            <p className="font-bold">{item.cantidad}x {item.nombre}</p>
                                            {item.ingredientesExcluidos.length > 0 && (
                                                <p className="text-sm text-gray-500">
                                                    Sin: {item.ingredientesExcluidos.join(", ")}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-500">
                                                Precio: ${item.precio.toFixed(2)} c/u
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Botón "Terminar Orden" */}
                        <button
                            className="bg-red-500 text-white w-full py-2 rounded-lg mt-4 hover:bg-red-600"
                            onClick={terminarOrden}
                        >
                            Terminar Orden
                        </button>
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
                    <div
                        className="bg-white rounded-lg p-4 w-11/12 md:w-8/10 max-h-screen overflow-y-auto relative"
                    >
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
                                className="rounded-lg object-cover w-5/10 h-10/10"
                            />
                        </div>
                        <div className="flex justify-center items-center w-full">
                            <p className="text-gray-700 text-center text-md leading-relaxed w-9/10">
                                {productoSeleccionado.descripcion}
                            </p>
                        </div>
                        <h3 className="text-md font-semibold mb-2">Ingredientes:</h3>
                        <ul className="mb-4 text-sm">
                            {productoSeleccionado.ingredientes.map((ingrediente, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <input type="checkbox" id={`ingrediente-${index}`} />
                                    <label htmlFor={`ingrediente-${index}`}>Sin {ingrediente}</label>
                                </li>
                            ))}
                        </ul>

                        {/* Contador, Botones y Botón Agregar en la misma línea */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <button
                                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center"
                                    onClick={() =>
                                        setProductoSeleccionado({
                                            ...productoSeleccionado,
                                            cantidad: Math.max((productoSeleccionado.cantidad || 1) - 1, 1),
                                        })
                                    }
                                >
                                    -
                                </button>
                                <span className="text-lg font-bold">{productoSeleccionado.cantidad || 1}</span>
                                <button
                                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center"
                                    onClick={() =>
                                        setProductoSeleccionado({
                                            ...productoSeleccionado,
                                            cantidad: (productoSeleccionado.cantidad || 1) + 1,
                                        })
                                    }
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
                                onClick={() => {
                                    agregarAlCarrito(productoSeleccionado);
                                    closeModal(); // Cierra la modal después de agregar el producto
                                }}
                            >
                                Agregar - ${((productoSeleccionado.cantidad || 1) * productoSeleccionado.precio).toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal del total de pedidos */}
            {modalTotalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setModalTotalOpen(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center">Total de la Orden</h2>
                        <p className="text-lg text-center mb-4">El total de tus pedidos es: <span className="font-bold">${totalPedidos}</span></p>
                        <button
                            className="bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600"
                            onClick={() => setModalTotalOpen(false)}
                        >
                            Cerrar
                        </button>
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
                                </div>

                                {/* Botones "+" y "-" */}
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center cursor-pointer"
                                            onClick={() => {
                                                setProductosFiltrados((prevProductos) =>
                                                    prevProductos.map((item) =>
                                                        item.id === producto.id
                                                            ? {
                                                                  ...item,
                                                                  cantidad: Math.max((item.cantidad || 1) - 1, 1),
                                                              }
                                                            : item
                                                    )
                                                );
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="text-lg font-bold">{producto.cantidad || 1}</span>
                                        <button
                                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400 flex items-center justify-center cursor-pointer"
                                            onClick={() => {
                                                setProductosFiltrados((prevProductos) =>
                                                    prevProductos.map((item) =>
                                                        item.id === producto.id
                                                            ? {
                                                                  ...item,
                                                                  cantidad: (item.cantidad || 1) + 1,
                                                              }
                                                            : item
                                                    )
                                                );
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm cursor-pointer"
                                        onClick={() => agregarAlCarrito(producto)}
                                    >
                                        Agregar
                                    </button>
                                </div>

                                {/* Botón "Personalizar" */}
                                <div className="mt-4">
                                    <button
                                        className=" flex gap-4 items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer w-full"
                                        onClick={() => openModal(producto)}
                                    >
                                        <FaRegEye className="h-[20px] w-[20px]" />Personalizar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </section>
        </section>
    );
}