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
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import kime from "@/pages/assets/img/kime.jpeg";
import Burger from "@/pages/assets/img/Burger.jpg";
import Sopadetomate from "@/pages/assets/img/sopatomate.jpg";
import Sopadepollo from "@/pages/assets/img/sopadepollo.jpeg";
import Clubsandwich from "@/pages/assets/img/clubsandwich.jpg";
import Cesar from "@/pages/assets/img/Cesar.jpg";
import Fruta from "@/pages/assets/img/fruta.jpg";
import Image from "next/image";
import { getProducts } from "@/useCases/getProducts";
import { loginUser } from '@/useCases/login';

const categoriaOrden = {
    "Entradas": 0,
    "Platos Principales": 1,
    "Ensaladas": 2,
    "Pizzas": 3,
    "Postres": 4,
    "Bebidas": 5,
    "Termos": 6,
};

// Productos estáticos como fallback
const productosEstaticos = [
    // Agrega aquí tus productos estáticos como respaldo
];

export default function MenuCliente() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los platillos");
    const [modalOpen, setModalOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [carritoModalOpen, setCarritoModalOpen] = useState(false);
    const [productos, setProductos] = useState(productosEstaticos);
    const [productosFiltrados, setProductosFiltrados] = useState(productosEstaticos);
    const [mensajeError, setMensajeError] = useState("");
    const [historialPedidos, setHistorialPedidos] = useState([]);
    const [modalTotalOpen, setModalTotalOpen] = useState(false);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Estados para la modal de login
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Nuevo estado para controlar la autenticación

    // Verificar token al cargar el componente
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoginModalOpen(true); // Mostrar modal de login si no hay token
            setLoading(false); // Detener el loading ya que no hay token
        } else {
            setIsAuthenticated(true); // Marcar como autenticado si hay token
        }
    }, []);

    // Cargar productos solo después de autenticarse
    useEffect(() => {
        if (!isAuthenticated) return; // No cargar productos si no está autenticado

        const cargarProductos = async () => {
            try {
                setLoading(true);
                const productosAPI = await getProducts();
                const productosTransformados = transformarProductos(productosAPI);

                const productosActivos = productosTransformados.filter(
                    producto => producto.status === 'activo'
                );

                setProductos(productosActivos);
                setProductosFiltrados(productosActivos);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setMensajeError('Error al cargar los productos. Mostrando menú estático.');
                setProductos(productosEstaticos);
                setProductosFiltrados(productosEstaticos);
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, [isAuthenticated]); // Ejecutar solo cuando isAuthenticated cambie a true

    // Función para manejar el login
    const handleLogin = async (values, { setSubmitting }) => {
        setServerError('');
        setIsLoading(true);
        try {
            const response = await loginUser(values);

            if (response.ok) {
                const data = await response.json();

                if (data.access_token) {
                    // Guardar token siempre en localStorage
                    localStorage.setItem('token', data.access_token);
                    
                    // Cerrar modal de login y marcar como autenticado
                    setLoginModalOpen(false);
                    setServerError('');
                    setIsAuthenticated(true); // Esto disparará la carga de productos
                } else {
                    setServerError('No se recibió un token válido. Por favor, intenta nuevamente.');
                }
            } else {
                setServerError('Usuario y/o contraseña incorrectos. Por favor, verifica tus credenciales.');
            }
        } catch (error) {
            setServerError('Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.');
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    // Validación del login simplificada (sin rememberMe)
    const loginValidationSchema = Yup.object({
        email: Yup.string().email('Correo electrónico inválido').required('Correo electrónico es requerido'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida'),
    });

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
                : kime,
            ingredientes: producto.ingredientes || [],
            status: producto.status,
            cantidad: 1
        }));
    };

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
        localStorage.setItem("carrito1", JSON.stringify(carrito));
    }, [carrito]);

    useEffect(() => {
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

        const orden = {
            fecha: new Date().toISOString(),
            total: parseFloat(calcularTotal()),
            items: carrito.map((item) => ({
                producto_id: item.id.split('-')[0],
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

        console.log("=== ORDEN PARA ENVIAR A LA API ===");
        console.log(JSON.stringify(orden, null, 2));
        console.log("=== FIN DE LA ORDEN ===");

        setHistorialPedidos((prevHistorial) => [
            ...prevHistorial,
            ...carrito.map((item) => ({
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
                ingredientesExcluidos: item.ingredientesExcluidos || [],
            })),
        ]);

        setCarrito([]);
        setCarritoModalOpen(false);
        setMensajeError("");
    };

    const terminarOrden = () => {
        if (historialPedidos.length === 0) {
            setMensajeError("No hay pedidos para finalizar. Realiza al menos un pedido primero.");
            return;
        }

        const total = historialPedidos.reduce(
            (acc, item) => acc + item.precio * item.cantidad,
            0
        );

        setTotalPedidos(total.toFixed(2));
        setHistorialPedidos([]);
        setModalTotalOpen(true);
        setMensajeError("");
    };

    const categorias = ["Todos los platillos", ...new Set(productos.map(p => p.categoria))];

    // Mostrar loading solo si está autenticado y cargando productos
    if (loading && isAuthenticated) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando productos...</div>
            </div>
        );
    }

    return (
        <section>
            {/* Modal de Login */}
            {loginModalOpen && (
                <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[1000]">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                <div className='text-[#3fe283] text-4xl flex justify-center mb-4'>
                                    <div className='bg-[#3fe283] text-white p-2 rounded-lg'>
                                        <GoChecklist size={32} />
                                    </div>
                                </div>
                                <h2 className="text-2xl text-center font-bold text-black mb-2">Iniciar Sesión</h2>
                                <p className='text-center text-gray-600 mb-4'>Ingresa tus credenciales para acceder al menú</p>
                                
                                <Formik
                                    initialValues={{
                                        email: '',
                                        password: '',
                                    }}
                                    validationSchema={loginValidationSchema}
                                    onSubmit={handleLogin}
                                >
                                    {({ isSubmitting }) => (
                                        <Form className="flex flex-col gap-4">
                                            {serverError && (
                                                <div className="text-red-500 text-sm mb-2 text-center">
                                                    {serverError}
                                                </div>
                                            )}

                                            <div className='flex flex-col gap-2'>
                                                <label>Correo electrónico</label>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    placeholder="Correo electrónico"
                                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                                />
                                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>
                                            
                                            <div className='flex flex-col gap-2'>
                                                <label>Contraseña</label>
                                                <Field
                                                    type="password"
                                                    name="password"
                                                    placeholder="Contraseña"
                                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                                />
                                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>
                                            
                                            <button
                                                type="submit"
                                                className="bg-[#3fe283] text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                                                disabled={isSubmitting}
                                            >
                                                Iniciar Sesión
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </>
                        )}
                    </div>
                </div>
            )}

            <header>
                <nav className="w-full bg-gray-100 text-gray-800 p-4">
                    <div className="flex items-center max-w-7xl mx-auto justify-between">
                        <div className="flex items-center">
                            <GoChecklist size={36} className="text-green-600" />
                            <h1 className="text-3xl font-bold ml-2">WapiFood</h1>
                        </div>

                        <button
                            className="z-20 cursor-pointer py-3 hamburger-button"
                            onClick={() => setIsOpen(!isOpen)}
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

                        <button
                            className={`w-full py-2 rounded-lg mt-4 transition-colors ${
                                historialPedidos.length > 0 
                                    ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={terminarOrden}
                            disabled={historialPedidos.length === 0}
                        >
                            Terminar Orden {historialPedidos.length > 0 && `(${historialPedidos.length} productos)`}
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de producto */}
            {modalOpen && productoSeleccionado && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-50"
                    onClick={(e) => {
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
                                    closeModal();
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