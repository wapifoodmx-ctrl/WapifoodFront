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
import { useRouter } from 'next/router'; // Agregar esta importación
import kime from "@/pages/assets/img/kime.jpeg";
import Burger from "@/pages/assets/img/Burger.jpg";
import Sopadetomate from "@/pages/assets/img/sopatomate.jpg";
import Sopadepollo from "@/pages/assets/img/sopadepollo.jpeg";
import Clubsandwich from "@/pages/assets/img/clubsandwich.jpg";
import Cesar from "@/pages/assets/img/Cesar.jpg";
import Fruta from "@/pages/assets/img/fruta.jpg";
import Image from "next/image";
import { getProducts } from "@/useCases/getProducts";

const categoriaOrden = {
    "Entradas": 0,
    "Platos Principales": 1,
    "Ensaladas": 2,
    "Pizzas": 3,
    "Postres": 4,
    "Bebidas": 5,
    "Termos": 6, // Agregamos la nueva categoría
};

// Productos estáticos como fallback (necesitas definir esto)
const productosEstaticos = [
    // Agrega aquí tus productos estáticos como respaldo
];

export default function MenuCliente() {
    const router = useRouter(); // Mover dentro del componente
    const [isOpen, setIsOpen] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los platillos");
    const [modalOpen, setModalOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [productos, setProductos] = useState(productosEstaticos); // Estado para productos dinámicos
    const [productosFiltrados, setProductosFiltrados] = useState(productosEstaticos);
    const [mensajeError, setMensajeError] = useState("");
    const [historialPedidos, setHistorialPedidos] = useState([]);
    const [modalTotalOpen, setModalTotalOpen] = useState(false);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const [loading, setLoading] = useState(true); // Estado de carga

    // Mover el useEffect dentro del componente
    useEffect(() => {
        // Verificar si el token existe en el localStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            router.push('/login'); // Redirigir al login si no hay token
        }
    }, [router]);

    // Función para transformar productos de la API al formato local
    const transformarProductos = (productosAPI) => {
        return productosAPI.map(producto => ({
            id: producto.id_products,
            nombre: producto.name,
            precio: parseFloat(producto.price),
            descripcion: producto.description,
            categoria: producto.category_name || producto.nombre_categoria,
            imagen: producto.image_url && producto.image_url.length > 0
                ? producto.image_url[0]
                : kime, // Imagen por defecto
            ingredientes: producto.ingredientes || [], // Opcional: solo si existe
            status: producto.status,
            cantidad: 1 // Agregar cantidad inicial
        }));
    };

    // Cargar productos desde la API
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setLoading(true);
                const productosAPI = await getProducts();
                const productosTransformados = transformarProductos(productosAPI);

                // Filtrar solo productos activos
                const productosActivos = productosTransformados.filter(
                    producto => producto.status === 'activo'
                );

                setProductos(productosActivos);
                setProductosFiltrados(productosActivos);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setMensajeError('Error al cargar los productos. Mostrando menú estático.');
                // Mantener productos estáticos en caso de error
                setProductos(productosEstaticos);
                setProductosFiltrados(productosEstaticos);
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

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
    }, [categoriaSeleccionada, productos]);

    useEffect(() => {
        // Recuperar carrito y historial de pedidos desde localStorage
        const carritoGuardado = localStorage.getItem("carrito1");
        const historialGuardado = localStorage.getItem("historialPedidos1");

        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }

        if (historialGuardado) {
            setHistorialPedidos(JSON.parse(historialGuardado));
        }
    }, []);

    useEffect(() => {
        // Guardar el carrito en localStorage
        localStorage.setItem("carrito1", JSON.stringify(carrito));
    }, [carrito]);

    useEffect(() => {
        // Guardar el historial de pedidos en localStorage
        localStorage.setItem("historialPedidos1", JSON.stringify(historialPedidos));
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
        // Solo procesar ingredientes si existen
        const ingredientesExcluidos = producto.ingredientes && producto.ingredientes.length > 0
            ? Array.from(
                document.querySelectorAll('input[type="checkbox"]:checked')
            ).map((checkbox) => checkbox.nextSibling.textContent.replace("Sin ", "").trim())
            : [];

        const productoConExclusiones = {
            ...producto,
            id: `${producto.id}-${ingredientesExcluidos.join(",")}`,
            ingredientesExcluidos,
        };

        setCarrito((prevCarrito) => {
            const existingItemIndex = prevCarrito.findIndex(
                (item) => item.id === productoConExclusiones.id
            );

            if (existingItemIndex !== -1) {
                const updatedCarrito = [...prevCarrito];
                updatedCarrito[existingItemIndex].cantidad += 1;
                return updatedCarrito;
            } else {
                return [...prevCarrito, { ...productoConExclusiones, cantidad: 1 }];
            }
        });

        closeModal();
    };

    const calcularTotal = () => {
        if (!carrito || carrito.length === 0) {
            return "0.00";
        }
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2);
    };

    const realizarPedido = () => {
        if (carrito.length === 0) {
            setMensajeError("No puedes seguir porque no hay artículos en tu carrito");
            return;
        }

        // Crear la orden en el formato que espera la API
        const orden = {
            fecha: new Date().toISOString(),
            total: parseFloat(calcularTotal()),
            items: carrito.map((item) => ({
                producto_id: item.id.split('-')[0], // Remover las exclusiones del ID
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio_unitario: item.precio,
                precio_total: item.precio * item.cantidad,
                categoria: item.categoria,
                ingredientes_excluidos: item.ingredientesExcluidos || [],
                personalizaciones: item.ingredientesExcluidos && item.ingredientesExcluidos.length > 0 
                    ? `Sin: ${item.ingredientesExcluidos.join(", ")}` 
                    : null
            })),
            resumen: {
                total_items: carrito.reduce((total, item) => total + item.cantidad, 0),
                subtotal: parseFloat(calcularTotal()),
                total_final: parseFloat(calcularTotal())
            }
        };

        // Imprimir la orden en consola
        console.log("=== ORDEN PARA ENVIAR A LA API ===");
        console.log(JSON.stringify(orden, null, 2));
        console.log("=== FIN DE LA ORDEN ===");

        // También puedes imprimir solo los datos esenciales
        console.log("=== DATOS ESENCIALES ===");
        console.log("Total:", orden.total);
        console.log("Cantidad de items:", orden.resumen.total_items);
        console.log("Items:", orden.items);

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
        setMensajeError(""); // Limpia el mensaje de error
    };

    const terminarOrden = () => {
        // Validar que existe historial de pedidos
        if (historialPedidos.length === 0) {
            setMensajeError("No hay pedidos para finalizar. Realiza al menos un pedido primero.");
            return;
        }

        // Calcula el total acumulado del historial
        const total = historialPedidos.reduce(
            (acc, item) => acc + item.precio * item.cantidad,
            0
        );

        // Actualiza el total y abre la modal del total
        setTotalPedidos(total.toFixed(2));
        setHistorialPedidos([]); // Limpia el historial de pedidos
        setModalTotalOpen(true); // Abre la modal del total
        setMensajeError(""); // Limpiar cualquier mensaje de error previo
    };

    // Obtener categorías únicas de los productos cargados
    const categorias = ["Todos los platillos", ...new Set(productos.map(p => p.categoria))];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando productos...</div>
            </div>
        );
    }

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
                    {categorias.map((categoria, index) => (
                        <li
                            key={index}
                            className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                            onClick={() => {
                                setCategoriaSeleccionada(categoria);
                                setIsOpen(false);
                            }}
                        >
                            {categoria === "Todos los platillos" && <IoHomeOutline className="self-center" />}
                            {categoria}
                        </li>
                    ))}
                </ul>
            </div>

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
                                width={400}
                                height={300}
                            />
                        </div>
                        <div className="flex justify-center items-center w-full">
                            <p className="text-gray-700 text-center text-md leading-relaxed w-9/10">
                                {productoSeleccionado.descripcion}
                            </p>
                        </div>
                        {productoSeleccionado.ingredientes && productoSeleccionado.ingredientes.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Personalizar:</h4>
                                {productoSeleccionado.ingredientes.map((ingrediente, index) => (
                                    <label key={index} className="flex items-center mb-2">
                                        <input type="checkbox" className="mr-2" />
                                        <span>Sin {ingrediente}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        
    
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

                                {/* Botón "Personalizar" */}
                                <div className="mt-4">
                                    <button
                                        className=" flex gap-4 items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer w-full"
                                        onClick={() => openModal(producto)}
                                    >
                                        <FaRegEye className="h-[20px] w-[20px]" />Detalles
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </section>
        </section>
    );
}