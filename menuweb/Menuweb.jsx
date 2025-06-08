import { IoLocationOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import Profile from "@/pages/assets/images/Profile.jpg";
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
import kime from "@/pages/assets/img/kime.jpeg";
import Burger from "@/pages/assets/img/Burger.jpg";
import Sopadetomate from "@/pages/assets/img/sopatomate.jpg";
import Sopadepollo from "@/pages/assets/img/sopadepollo.jpeg";
import Clubsandwich from "@/pages/assets/img/clubsandwich.jpg";
import Cesar from "@/pages/assets/img/Cesar.jpg";
import Fruta from "@/pages/assets/img/fruta.jpg";
import Image from "next/image";
import { getProducts } from "@/useCases/getProducts";

const profileData = {
    profileImage: Profile, 
    name: "Las flautas de pepe",
    address: "Av. San Piter #43 col. Lomas de Pedro, Tlalpan",
    schedule: "Lun - Vie 9:00 a 6:00",
    phone: "55-57-18-10-51",
    whatsapp: true, 
  };

const categoriaOrden = {
    "Entradas": 0,
    "Platos Principales": 1,
    "Ensaladas": 2,
    "Pizzas": 3,
    "Postres": 4,
    "Bebidas": 5,
    "Termos": 6,
};

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
    const [productos, setProductos] = useState(productosEstaticos);
    const [productosFiltrados, setProductosFiltrados] = useState(productosEstaticos);
    const [mensajeError, setMensajeError] = useState("");
    const [historialPedidos, setHistorialPedidos] = useState([]);
    const [modalTotalOpen, setModalTotalOpen] = useState(false);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

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
        let productosFiltradosTemp = productos;

        if (categoriaSeleccionada !== "Todos los platillos") {
            productosFiltradosTemp = productosFiltradosTemp.filter(
                producto => producto.categoria === categoriaSeleccionada
            );
        }

        if (busqueda.trim() !== "") {
            productosFiltradosTemp = productosFiltradosTemp.filter(
                producto => producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        setProductosFiltrados(productosFiltradosTemp);
    }, [categoriaSeleccionada, productos, busqueda]);

    const categorias = ["Todos los platillos", ...new Set(productos.map(p => p.categoria))];

    const openModal = (producto) => {
        setProductoSeleccionado(producto);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setProductoSeleccionado(null);
    };

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

            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg 
                    transition-transform duration-300 ease-in-out menu-container z-11
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
            <div className="w-full h-auto py-4 shadow-md bg-white flex px-4"> 
    <div className="w-full flex items-center justify-center flex-col">
        {profileData.profileImage && (
            <Image
                src={profileData.profileImage}
                alt="Perfil"
                className="rounded-full w-20 h-20 object-cover mr-4"
                width={48}
                height={48}
            />
        )}

        {profileData.name && (
            <p className="font-bold text-2xl">{profileData.name}</p>
        )}

        <div className="md:flex md:justify-between items-center justify-center">
            {profileData.address && (
                <div className="flex items-center gap-2 text-center">
                    <p className="text-sm flex py-2">
                        |
                        <span className="px-2 self-center">
                            <IoLocationOutline className="text-green-600" />
                        </span> 
                        {profileData.address} |
                    </p>
                </div>
            )}

            {profileData.schedule && (
                <div className="flex items-center justify-center gap-2">
                    <p className="text-sm flex py-2">
                        | 
                        <span className="px-2 self-center">
                            <MdOutlineWatchLater className="text-green-600" />
                        </span> 
                        {profileData.schedule} |
                    </p>
                </div>
            )}

            {profileData.phone && (
                <p className="text-sm flex py-2 justify-center items-center">
                    | 
                    <span className="px-2 self-center">
                        <FaPhoneAlt className="text-green-600" />
                    </span> 
                    {profileData.phone} |
                </p>
            )}
        </div>

        {profileData.whatsapp && (
            <button className="cursor-pointer py-2">
                <FaWhatsapp className="text-xl md:text-3xl" />
            </button>
        )}
    </div>
</div>

            <div className="w-full max-w-4xl mx-auto px-4 py-6 z-10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg 
                            className="w-5 h-5 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                            />
                        </svg>
                    </div>
                    {busqueda && (
                        <button
                            onClick={() => setBusqueda("")}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {busqueda && (
                    <p className="mt-2 text-sm text-gray-600">
                        {productosFiltrados.length} resultado(s) encontrado(s) para "{busqueda}"
                    </p>
                )}
            </div>

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
                    </div>
                </div>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados
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
                        ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500 text-lg">No se encontraron platillos que coincidan con tu búsqueda.</p>
                        {busqueda && (
                            <button
                                onClick={() => setBusqueda("")}
                                className="mt-2 text-green-600 hover:text-green-800"
                            >
                                Limpiar búsqueda
                            </button>
                        )}
                    </div>
                )}
            </section>
        </section>
    );
}