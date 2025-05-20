import Navbar from "@/dashboardComponents/navbar";
import { FaRegEye } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { BsTag } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FaShoppingCart } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { getProducts } from "@/useCases/getProducts";

// Mock de ingredientes general
const mockIngredientes = ["Tomate", "Cebolla", "Lechuga", "Queso", "Salsa"];

export default function Pntoventa() {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Categorías");
    const [disponibilidadSeleccionada, setDisponibilidadSeleccionada] = useState("Disponibles");
    const [busqueda, setBusqueda] = useState("");
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [carritoModalOpen, setCarritoModalOpen] = useState(false);
    const [mensajeError, setMensajeError] = useState("");
    const [historialPedidos, setHistorialPedidos] = useState([]);
    const [modalTotalOpen, setModalTotalOpen] = useState(false);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Estado para el producto seleccionado
    const [modalProductoOpen, setModalProductoOpen] = useState(false); // Estado para la modal de detalles del producto

    // Recuperar carrito e historial del localStorage al cargar la página
    useEffect(() => {
        const carritoGuardado = localStorage.getItem("carrito");
        const historialGuardado = localStorage.getItem("historialPedidos");

        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }
        if (historialGuardado) {
            setHistorialPedidos(JSON.parse(historialGuardado));
        }
    }, []);

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    // Guardar el historial en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem("historialPedidos", JSON.stringify(historialPedidos));
    }, [historialPedidos]);

    // Obtener productos desde la API
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProducts();
                setProductos(data); // Guardar los productos obtenidos
                setProductosFiltrados(data); // Inicializar los productos filtrados
            } catch (error) {
                console.error("Error al obtener los productos:", error.message);
                setProductos([]); // Si ocurre un error, deja los productos vacíos
            }
        };

        fetchProductos();
    }, []);

    useEffect(() => {
        const productosFiltradosPorCategoria =
            categoriaSeleccionada === "Categorías" || categoriaSeleccionada === "Todos los platillos"
                ? productos
                : productos.filter((producto) => producto.category_name === categoriaSeleccionada);

        const productosFiltradosPorDisponibilidad =
            disponibilidadSeleccionada === "Todas"
                ? productosFiltradosPorCategoria
                : productosFiltradosPorCategoria.filter((producto) =>
                    disponibilidadSeleccionada === "Disponibles"
                        ? producto.status === "activo"
                        : producto.status !== "activo"
                );

        const productosFiltradosPorBusqueda = productosFiltradosPorDisponibilidad.filter((producto) =>
            producto.name.toLowerCase().includes(busqueda.toLowerCase())
        );

        setProductosFiltrados(productosFiltradosPorBusqueda);
    }, [categoriaSeleccionada, disponibilidadSeleccionada, busqueda, productos]);

    // Función para abrir la modal de detalles del producto
    const openModal = (producto) => {
        setProductoSeleccionado({ ...producto, ingredientesExcluidos: [] }); // Inicializa los ingredientes excluidos
        setModalProductoOpen(true);
    };

    // Función para cerrar la modal de detalles del producto
    const closeModal = () => {
        setProductoSeleccionado(null);
        setModalProductoOpen(false);
    };

    const agregarAlCarrito = (producto, comentario = "", ingredientesExcluidos = []) => {
        const productoConPersonalizacion = {
            ...producto,
            id: `${producto.id_products}-${ingredientesExcluidos.join(",")}-${comentario}`, // Genera un ID único basado en las exclusiones y el comentario
            comentario,
            ingredientesExcluidos,
        };

        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find((item) => item.id === productoConPersonalizacion.id);
            if (productoExistente) {
                // Incrementa la cantidad del producto existente
                return prevCarrito.map((item) =>
                    item.id === productoConPersonalizacion.id
                        ? { ...item, cantidad: item.cantidad + (producto.cantidad || 1) }
                        : item
                );
            }
            // Agrega el producto al carrito con la cantidad actual
            return [...prevCarrito, { ...productoConPersonalizacion, cantidad: producto.cantidad || 1 }];
        });
    };

    const terminarOrden = () => {
        if (carrito.length === 0) {
            setMensajeError("No puedes seguir porque no hay artículos en tu carrito");
            return;
        }

        setHistorialPedidos((prevHistorial) => [
            ...prevHistorial,
            ...carrito.map((item) => ({
                name: item.name,
                cantidad: item.cantidad,
                price: item.price,
                comentario: item.comentario || "",
                ingredientesExcluidos: item.ingredientesExcluidos || [],
            })),
        ]);

        setCarrito([]);
        setMensajeError("");
    };

    return (
        <section className="mt-16">
            <Navbar />

            {/* Barra de búsqueda y dropdowns */}
            <div className="p-4 ">
                <div className="flex flex-col md:flex-row gap-4 lg:px-16 md:px-6">
                    {/* Barra de búsqueda */}
                    <div className="flex items-center border p-2 rounded-xl w-full md:w-1/3">
                        <HiOutlineMagnifyingGlass className="text-gray-500 mr-2 text-xl" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="w-full bg-transparent outline-none"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {/* Dropdown de categorías */}
                    <div className="flex items-center border p-2 rounded-md w-full md:w-1/4">
                        <BsTag className="text-gray-500 mr-2 text-xl font-bold flex self-center" />
                        <select
                            className="w-full bg-transparent outline-none"
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        >
                            <option value="Todos los platillos">Todas las categorías</option>
                            {[...new Set(productos.map((producto) => producto.category_name))].map((categoria) => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown de disponibilidad */}
                    <div className="flex items-center border p-2 rounded-md w-full md:w-1/4">
                        <FiFilter className="text-gray-500 mr-2" />
                        <select
                            className="w-full bg-transparent outline-none"
                            value={disponibilidadSeleccionada}
                            onChange={(e) => setDisponibilidadSeleccionada(e.target.value)}
                        >
                            <option value="Disponibles">Disponibles</option>
                            <option value="No disponibles">No disponibles</option>
                            <option value="Todas">Todas</option>
                        </select>
                    </div>
                </div>
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
                                            <p className="font-bold">{item.name}</p>
                                            {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                <p className="text-sm text-gray-500">
                                                    Sin: {item.ingredientesExcluidos.join(", ")}
                                                </p>
                                            )}
                                            {item.comentario && (
                                                <p className="text-sm text-gray-500">
                                                    Comentario: {item.comentario}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-500">
                                                ${parseFloat(item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
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
                            <p className="text-lg font-bold">Total: ${carrito.reduce((total, item) => total + item.price * item.cantidad, 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            {mensajeError && (
                                <p className="text-red-500 text-sm font-bold mt-2">{mensajeError}</p>
                            )}
                            <button
                                className="bg-green-500 text-white w-full py-2 rounded-lg mt-4 hover:bg-green-600"
                                onClick={terminarOrden}
                            >
                                Añadir a la orden
                            </button>
                        </div>

                        {/* Historial de pedidos */}
                        {historialPedidos.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-500 mb-2">Historial de Pedidos</h3>
                                <ul className="space-y-0">
                                    {historialPedidos.map((item, index) => (
                                        <li key={index} className="p-2 rounded shadow">
                                            <p className="font-bold">{item.cantidad} x {item.name}</p>
                                            {item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 && (
                                                <p className="text-sm text-gray-500">
                                                    Sin: {item.ingredientesExcluidos.join(", ")}
                                                </p>
                                            )}
                                            {item.comentario && (
                                                <p className="text-sm text-gray-500">
                                                    Comentario: {item.comentario}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-500">
                                                Precio: ${parseFloat(item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Total: ${item.cantidad * item.price}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <p className="text-sm text-gray-500 pt-2" > Sub Total: ${historialPedidos.reduce((subtotal, item) => subtotal + item.price * item.cantidad, 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </p>
                       
                        {/* Botón "Terminar Orden" */}
                        <div className="mt-4">
                            <button
                                className={`w-full py-2 rounded-lg mt-4 ${historialPedidos.length > 0
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                onClick={() => {
                                    if (historialPedidos.length === 0) {
                                        setMensajeError("No habilitado, debes primero añadir productos a la orden");
                                        return;
                                    }
                                    const total = historialPedidos.reduce(
                                        (acc, item) => acc + item.price * item.cantidad,
                                        0
                                    );
                                    setTotalPedidos(total.toFixed(2));
                                    setHistorialPedidos([]);
                                    setModalTotalOpen(true);
                                    setMensajeError(""); // Limpia el mensaje de error si todo está bien
                                }}
                                disabled={historialPedidos.length === 0}
                            >
                                Terminar Orden
                            </button>
                            {mensajeError && (
                                <p className="text-red-500 text-sm font-bold mt-2">{mensajeError}</p>
                            )}
                            
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
                        <p className="text-lg text-center mb-4">El total de tus pedidos es: <span className="font-bold">${parseFloat(totalPedidos).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                        <button
                            className="bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600"
                            onClick={() => setModalTotalOpen(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de detalles del producto */}
            {modalProductoOpen && productoSeleccionado && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">{productoSeleccionado.name}</h2>
                        <img
                            src={productoSeleccionado.image_url[0]}
                            alt={`Imagen de ${productoSeleccionado.name}`}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-500 mb-4">{productoSeleccionado.description}</p>
                        <p className="text-lg font-bold text-green-500 mb-4">
                            Precio: ${parseFloat(productoSeleccionado.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <h3 className="text-md font-semibold mb-2">Ingredientes:</h3>
                        <ul className="mb-4 text-sm">
                            {(productoSeleccionado.ingredients || mockIngredientes).map((ingrediente, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`ingrediente-${index}`}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setProductoSeleccionado((prevProducto) => {
                                                const ingredientesExcluidos = isChecked
                                                    ? [...prevProducto.ingredientesExcluidos, ingrediente]
                                                    : prevProducto.ingredientesExcluidos.filter((ing) => ing !== ingrediente);
                                                return { ...prevProducto, ingredientesExcluidos };
                                            });
                                        }}
                                    />
                                    <label htmlFor={`ingrediente-${index}`}>Sin {ingrediente}</label>
                                </li>
                            ))}
                        </ul>
                        <button
                            className="bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600"
                            onClick={() => {
                                agregarAlCarrito(
                                    productoSeleccionado,
                                    productoSeleccionado.comentario || "",
                                    productoSeleccionado.ingredientesExcluidos
                                );
                                closeModal();
                            }}
                        >
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            )}
            {/* Card Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12">
                {productosFiltrados.map((producto) => (
                    <div
                        key={producto.id_products}
                        className="rounded-lg shadow-lg flex flex-col bg-white relative"
                    >
                        <div className="w-full h-48 relative">
                            <img
                                src={producto.image_url[0]}
                                alt={`Imagen de ${producto.name}`}
                                className={`rounded-t-lg w-full h-full object-cover ${producto.status !== "activo" ? "opacity-50" : ""
                                    }`}
                            />
                            {producto.status !== "activo" && (
                                <div className="absolute inset-0 backdrop-brightness-30 flex items-center justify-center">
                                    <p className="text-white text-center font-bold px-4">
                                        Producto no disponible, favor de actualizar disponibilidad en productos
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-xl">{producto.name}</h3>
                                <p className="text-xl text-green-500 font-bold">
                                    $ {parseFloat(producto.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <p className="text-gray-500 mb-4 line-clamp-2 min-h-[3rem]">
                                {producto.description.length > 80
                                    ? `${producto.description.slice(0, 80)}...`
                                    : producto.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <p className="bg-green-300 text-green-800 rounded-full px-4 py-1 text-sm">
                                    {producto.category_name}
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
                                                    item.id_products === producto.id_products
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
                                                    item.id_products === producto.id_products
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
                                    disabled={producto.status !== "activo"}
                                >
                                    Agregar
                                </button>
                            </div>

                            {/* Botón "Personalizar" */}
                            <div className="mt-4">
                                <button
                                    className="flex gap-4 items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer w-full"
                                    onClick={() => openModal(producto)}
                                    disabled={producto.status !== "activo"}
                                >
                                    <FaRegEye className="h-[20px] w-[20px]" />
                                    Personalizar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </section>
    );
}