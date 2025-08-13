import Head from 'next/head';
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
        return valor && valor !== "string" && typeof valor === 'string' && valor.trim() !== "";
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
                        : null,
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
        <>
        <Head>
    <title>Menú - {restauranteInfo?.nombre_restaurante && esValorValido(restauranteInfo.nombre_restaurante) 
        ? restauranteInfo.nombre_restaurante 
        : "WapiFood"}</title>
    <meta name="description" content="Menú digital del restaurante - Descubre nuestros deliciosos platillos" />
</Head>
        <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
            </div>

            {/* Header */}
            <header className="relative z-10">
                <nav className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-4 shadow-lg">
                    <div className="flex items-center max-w-7xl mx-auto justify-between">
                        <div className="flex items-center">
                            <GoChecklist size={36} className="text-yellow-300 drop-shadow-lg" />
                            <button
                                onClick={() => router.push('/')}
                                className="text-3xl font-bold ml-2 text-white hover:text-yellow-200 transition-colors duration-200 cursor-pointer"
                            >
                                WapiFood
                            </button>
                        </div>
                        <button
                            className="z-20 cursor-pointer py-3 hamburger-button"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                            <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Menú lateral remodelado */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-green-100 to-emerald-100 shadow-2xl border-r border-green-200
                    transition-transform duration-300 ease-in-out menu-container z-50
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <ul className="flex flex-col mt-16 p-4 text-xl">
                    <p className="text-green-700 font-bold mb-2">Menú principal</p>
                    {obtenerCategorias().map((categoria, index) => (
                        <li
                            key={index}
                            className="flex hover:bg-green-200 p-2 rounded-xl cursor-pointer gap-2 transition-all duration-200"
                            onClick={() => {
                                setCategoriaSeleccionada(categoria);
                                setIsOpen(false);
                            }}
                        >
                            {categoria === "Todos los platillos" && <IoHomeOutline className="self-center text-green-600" />}
                            <span className="font-semibold text-green-800">{categoria}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Overlay para cerrar el menú al hacer clic fuera */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 backdrop-brightness-50"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Header del restaurante remodelado */}
            <div className={`w-full shadow-md bg-white/80 backdrop-blur-sm flex px-4 py-6 rounded-2xl border border-green-100 relative z-10 ${
                restauranteInfo?.image && esValorValido(restauranteInfo.image) 
                    ? 'h-70' 
                    : 'h-30'
            }`}> 
                <div className="w-full flex items-center justify-center flex-col">
                    {restauranteInfo?.image && esValorValido(restauranteInfo.image) && (
                        <Image
                            src={restauranteInfo.image}
                            alt="Perfil"
                            className="rounded-full w-20 h-20 mr-4 object-contain border-4 border-green-200 shadow-lg"
                            width={80}
                            height={80}
                        />
                    )}
                    <p className="font-bold text-2xl  drop-shadow">{restauranteInfo?.nombre_restaurante && esValorValido(restauranteInfo.nombre_restaurante) 
                        ? restauranteInfo.nombre_restaurante 
                        : "Las flautas de pepe"}
                    </p>
                    {restauranteInfo?.direccion && esValorValido(restauranteInfo.direccion) && (
                        <p className="text-sm pt-2 ">| {restauranteInfo.direccion} |</p>
                    )}
                    {(
                        (restauranteInfo?.ciudad && esValorValido(restauranteInfo.ciudad)) ||
                        (restauranteInfo?.alcaldia && esValorValido(restauranteInfo.alcaldia)) ||
                        (restauranteInfo?.codigo_postal && esValorValido(restauranteInfo.codigo_postal))
                    ) && (
                        <p className="text-sm ">
                            |
                            {restauranteInfo?.ciudad && esValorValido(restauranteInfo.ciudad) && ` ${restauranteInfo.ciudad}`}
                            {restauranteInfo?.alcaldia && esValorValido(restauranteInfo.alcaldia) && `, ${restauranteInfo.alcaldia}`}
                            {restauranteInfo?.codigo_postal && esValorValido(restauranteInfo.codigo_postal) && ` CP: ${restauranteInfo.codigo_postal}`}
                            |
                        </p>
                    )}
                    {restauranteInfo?.horario && esValorValido(restauranteInfo.horario) && (
                        <div className="flex items-center gap-2">
                            <p className="text-sm flex py-2 ">| <span className="px-2 self-center"><MdOutlineWatchLater className="text-green-600" /></span> {restauranteInfo.horario} |</p>
                        </div>
                    )}
                    {restauranteInfo?.telefono && esValorValido(restauranteInfo.telefono) && (
                        <p className="text-sm flex ">| <span className="px-2 self-center"> <FaPhoneAlt className="text-green-600"/> </span>{restauranteInfo.telefono} |</p>
                    )}
                    {restauranteInfo?.whatsapp && esValorValido(restauranteInfo.whatsapp) && (
                        <button 
                            className="cursor-pointer py-2"
                            onClick={() => window.open(`${restauranteInfo.whatsapp}`, '_blank')}
                            title="Contactar por WhatsApp"
                        >
                            <FaWhatsapp className="text-xl text-green-600 hover:text-green-700 transition-colors" />
                        </button>
                    )}
                </div>
            </div>

            {/* Buscador remodelado */}
            <div className="max-w-4xl mx-auto px-4 py-6 z-10 relative">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 hover:border-green-300 text-green-800"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    {busqueda && (
                        <button
                            onClick={() => setBusqueda("")}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {busqueda && (
                    <p className="mt-2 text-sm text-green-700">
                        {productosFiltrados.length} resultado(s) encontrado(s) para {busqueda}
                    </p>
                )}
            </div>

            {/* Modal de producto remodelado */}
            {modalOpen && productoSeleccionado && (
                <div
                    className="fixed inset-0 flex justify-center items-center z-50 bg-black/40 backdrop-blur-sm animate-fadeIn"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="bg-white rounded-3xl shadow-2xl w-11/12 md:w-[420px] border border-green-100 max-h-[90vh] overflow-y-auto relative p-6 animate-slideUp">
                        <button
                            className="absolute top-4 right-4 text-green-500 hover:text-green-700 transition-colors text-2xl"
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>
                        <div className="flex flex-col items-center">
                            <div className="w-full h-40 mb-4 flex justify-center">
                                <Image
                                    src={productoSeleccionado.imagen}
                                    alt={`Imagen de ${productoSeleccionado.nombre}`}
                                    className="rounded-lg object-cover w-5/10 h-10/10"
                                    width={400}
                                    height={300}
                                />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-green-700 text-center drop-shadow">{productoSeleccionado.nombre}</h2>
                            <p className="bg-green-100 text-green-800 rounded-full px-4 py-1 text-sm font-semibold mb-2">{productoSeleccionado.categoria}</p>
                            <p className="text-lg font-bold text-green-600 mb-4">${productoSeleccionado.precio.toFixed(2)}</p>
                            <p className="text-gray-700 text-center text-md leading-relaxed mb-4">
                                {productoSeleccionado.descripcion}
                            </p>
                            <div className="flex gap-2 mt-2">
                                {productoSeleccionado.status === "activo" ? (
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow">Disponible</span>
                                ) : (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow">No disponible</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>
            )}

            {/* Grid de productos remodelado */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12 relative z-10">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados
                        .map((producto) => (
                            <div
                                key={producto.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-green-100 overflow-hidden group"
                            >
                                {/* Imagen del producto */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={producto.imagen}
                                        alt={`Imagen de ${producto.nombre}`}
                                        className="rounded-t-2xl w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        width={300}
                                        height={200}
                                    />
                                    {/* Badge de estado */}
                                    {producto.status === "activo" ? (
                                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow">
                                            Disponible
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow">
                                                No Disponible
                                            </div>
                                        </div>
                                    )}
                                    {/* Precio flotante */}
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                        <span className="text-lg font-bold text-green-600">
                                            ${producto.precio.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                {/* Info del producto */}
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-xl text-green-700">{producto.nombre}</h3>
                                    </div>
                                    <p className="text-gray-500 mb-4 line-clamp-2 min-h-[3rem]">
                                        {producto.descripcion.length > 80
                                            ? `${producto.descripcion.slice(0, 80)}...`
                                            : producto.descripcion}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <p className="bg-green-300 text-green-800 rounded-full px-4 py-1 text-sm font-semibold">
                                            {producto.categoria}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            className="flex gap-4 items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer w-full shadow-lg font-semibold transition-all duration-200"
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

            {/* Estilos extra para animaciones */}
            <style jsx>{`
                .delay-500 { animation-delay: 500ms; }
                .delay-1000 { animation-delay: 1000ms; }
                .delay-1500 { animation-delay: 1500ms; }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease;
                }
                .animate-slideUp {
                    animation: slideUp 0.4s cubic-bezier(.39,.58,.57,1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </section>
        </>
    );
}