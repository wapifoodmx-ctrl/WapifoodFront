import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getwebMenu } from '@/useCases/getwebmenu';
import { getUserUUID } from '@/useCases/getUserUUID';
import Image from 'next/image';
import { FaWhatsapp, FaPhoneAlt, FaRegEye } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";
import Profile from "@/pages/assets/images/Profile.jpg";

export default function MenuWebDinamico() {
    const router = useRouter();
    const { uuid } = router.query;
    
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los platillos");
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [restauranteInfo, setRestauranteInfo] = useState(null);

    // Función para validar si un valor es válido (no null ni "string")
    const esValorValido = (valor) => {
        return valor && valor !== "string" && valor.trim() !== "";
    };

    // Transformar los datos de la API al formato esperado
    const transformarDatosAPI = (datosAPI) => {
        const productosTransformados = [];
        datosAPI.forEach(categoria => {
            categoria.productos.forEach(producto => {
                productosTransformados.push({
                    id: producto.id_products,
                    nombre: producto.name,
                    precio: parseFloat(producto.price),
                    descripcion: producto.description,
                    categoria: producto.nombre_categoria,
                    imagen: producto.image_url && producto.image_url.length > 0
                        ? producto.image_url[0]
                        : Profile,
                    status: producto.status,
                });
            });
        });
        return productosTransformados;
    };

    useEffect(() => {
        if (!uuid) return;

        const cargarDatos = async () => {
            try {
                setLoading(true);
                // Cargar datos del menú
                const datos = await getwebMenu(uuid);
                setCategorias(datos);
                
                const productosTransformados = transformarDatosAPI(datos);
                setProductosFiltrados(productosTransformados);

                // Cargar información del restaurante
                const infoRestaurante = await getUserUUID(uuid);
                setRestauranteInfo(infoRestaurante);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar el menú. Por favor, intenta más tarde.');
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [uuid]);

    useEffect(() => {
        if (!categorias.length) return;

        let productos = transformarDatosAPI(categorias);
        
        if (categoriaSeleccionada !== "Todos los platillos") {
            productos = productos.filter(
                producto => producto.categoria === categoriaSeleccionada
            );
        }

        if (busqueda.trim() !== "") {
            productos = productos.filter(
                producto => producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        setProductosFiltrados(productos);
    }, [categoriaSeleccionada, busqueda, categorias]);

    const obtenerCategorias = () => {
        const categoriasUnicas = ["Todos los platillos"];
        categorias.forEach(categoria => {
            if (!categoriasUnicas.includes(categoria.nombre_categoria)) {
                categoriasUnicas.push(categoria.nombre_categoria);
            }
        });
        return categoriasUnicas;
    };

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
                <div className="text-lg">Cargando menú...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-600">{error}</div>
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

            {/* Menú lateral */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg 
                    transition-transform duration-300 ease-in-out menu-container
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <ul className="flex flex-col mt-16 p-4 text-xl">
                    <p className="text-gray-500 font-bold">Menú principal</p>
                    {obtenerCategorias().map((categoria, index) => (
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

            {/* Header del restaurante */}
            <div className="w-full h-70 shadow-md bg-white flex px-4"> 
                <div className="w-full flex items-center justify-center flex-col ">
                    <Image
                        src={restauranteInfo?.image && esValorValido(restauranteInfo.image) 
                            ? `https://comandapp-api.h-dev.xyz/${restauranteInfo.image}`
                            : Profile}
                        alt="Perfil"
                        className="rounded-full w-20 h-20 object-cover mr-4"
                        width={48}
                        height={48}
                    />
                    <p className="font-bold text-2xl ">
                        {restauranteInfo?.nombre_restaurante && esValorValido(restauranteInfo.nombre_restaurante) 
                            ? restauranteInfo.nombre_restaurante 
                            : "Las flautas de pepe"}
                    </p>
                    
                    {/* Dirección - solo mostrar si es válida */}
                    {restauranteInfo?.direccion && esValorValido(restauranteInfo.direccion) && (
                        <p className="text-sm pt-2">| {restauranteInfo.direccion} |</p>
                    )}

                    {/* Información adicional de ubicación - solo si alguno es válido */}
                    {(
                        (restauranteInfo?.ciudad && esValorValido(restauranteInfo.ciudad)) ||
                        (restauranteInfo?.alcaldia && esValorValido(restauranteInfo.alcaldia)) ||
                        (restauranteInfo?.codigo_postal && esValorValido(restauranteInfo.codigo_postal))
                    ) && (
                        <p className="text-sm">
                            |
                            {restauranteInfo?.ciudad && esValorValido(restauranteInfo.ciudad) && ` ${restauranteInfo.ciudad}`}
                            {restauranteInfo?.alcaldia && esValorValido(restauranteInfo.alcaldia) && `, ${restauranteInfo.alcaldia}`}
                            {restauranteInfo?.codigo_postal && esValorValido(restauranteInfo.codigo_postal) && ` CP: ${restauranteInfo.codigo_postal}`}
                            |
                        </p>
                    )}

                    {/* Horario - mantener el original por ahora */}
                    <div className="flex items-center gap-2">
                        <p className="text-sm flex py-2">| <span className=" px-2 self-center"><MdOutlineWatchLater className="text-green-600" /></span> Lun - Vie 9:00 a 6:00 |</p>
                    </div>

                    {/* Teléfono - solo mostrar si es válido */}
                    {restauranteInfo?.telefono && esValorValido(restauranteInfo.telefono) && (
                        <p className="text-sm flex">| <span className=" px-2 self-center"> <FaPhoneAlt className="text-green-600"/> </span>{restauranteInfo.telefono} |</p>
                    )}

                    {/* WhatsApp - solo mostrar si es válido */}
                    {restauranteInfo?.whatsapp && esValorValido(restauranteInfo.whatsapp) && (
                        <button 
                            className="cursor-pointer py-2"
                            onClick={() => window.open(`https://wa.me/${restauranteInfo.whatsapp}`, '_blank')}
                        >
                            <FaWhatsapp className="text-xl"/>
                        </button>
                    )}
                </div>
            </div>

            {/* Buscador */}
            <div className="w-full max-w-4xl mx-auto px-4 py-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

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
                    <div className="bg-white rounded-lg p-4 w-11/12 md:w-8/10 max-h-screen overflow-y-auto relative">
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
                    </div>
                </div>
            )}

            {/* Grid de productos */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
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
                                        className="flex gap-4 items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer w-full"
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
                        <p className="text-gray-500 text-lg">No se encontraron productos.</p>
                    </div>
                )}
            </section>
        </section>
    );
}