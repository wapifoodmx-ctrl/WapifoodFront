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
import { getMenuStyle } from '@/styles/menuStyles';

export default function MenuWebDinamico() {
    const router = useRouter();
    const { uuid, style } = router.query;
    
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
    const [currentStyle, setCurrentStyle] = useState(getMenuStyle('default'));

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wapifood.com';

    // Aplicar estilo cuando cambie el parámetro
    useEffect(() => {
        const selectedStyle = getMenuStyle(style || 'default');
        setCurrentStyle(selectedStyle);
    }, [style]);

    // Función para validar si un valor es válido (no null ni "string")
    const esValorValido = (valor) => {
        return valor && valor !== "string" && typeof valor === 'string' && valor.trim() !== "";
    };

    // Nueva función para validar números
    const esNumeroValido = (valor) => {
        return valor !== null && valor !== undefined && valor !== 0 && valor !== "0" && valor !== "";
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
        <link rel="icon" href="/favicon.ico" />
        {/* Canónico y Open Graph dinámicos por restaurante/UUID */}
        <link rel="canonical" href={`${baseUrl}/webmenu/${uuid || ''}${style ? `?style=${style}` : ''}`} />
        <meta property="og:title" content={`Menú - ${restauranteInfo?.nombre_restaurante || 'WapiFood'}`} />
        <meta property="og:description" content="Menú digital del restaurante - Descubre nuestros deliciosos platillos" />
        <meta property="og:url" content={`${baseUrl}/webmenu/${uuid || ''}${style ? `?style=${style}` : ''}`} />
        <meta property="og:type" content="website" />
      </Head>
        <section className={`min-h-screen bg-gradient-to-br ${currentStyle.colors.background} relative pb-16 ${
            style === 'tokyo' ? currentStyle.colors.backgroundPattern : ''
        }`}>
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-20 left-10 w-32 h-32 ${currentStyle.colors.decorativeCircles[0]} rounded-full opacity-30 blur-xl animate-pulse`}></div>
                <div className={`absolute top-40 right-20 w-40 h-40 ${currentStyle.colors.decorativeCircles[1]} rounded-full opacity-25 blur-xl animate-pulse delay-1000`}></div>
                <div className={`absolute bottom-32 left-1/4 w-24 h-24 ${currentStyle.colors.decorativeCircles[2]} rounded-full opacity-20 blur-lg animate-pulse delay-500`}></div>
                <div className={`absolute bottom-20 right-10 w-36 h-36 ${currentStyle.colors.decorativeCircles[3]} rounded-full opacity-15 blur-2xl animate-pulse delay-1500`}></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50">
                <nav className={`w-full bg-gradient-to-r ${currentStyle.colors.headerGradient} text-white p-4 shadow-lg ${
                    style === 'tokyo' ? currentStyle.colors.neonGlow : ''
                }`}>
                    <div className="flex items-center max-w-7xl mx-auto justify-between">
                        <div className="flex items-center">
                            <GoChecklist size={36} className={`${
                                style === 'tokyo' ? 'text-cyan-300' : 'text-yellow-300'
                            } drop-shadow-lg ${style === 'tokyo' ? currentStyle.colors.textGlow : ''}`} />
                            <button
                                onClick={() => router.push('/')}
                                className={`text-3xl font-bold ml-2 text-white hover:text-yellow-200 transition-colors duration-200 cursor-pointer ${
                                    style === 'tokyo' ? currentStyle.colors.textGlow : ''
                                }`}
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
                    fixed top-0 left-0 h-full w-64 bg-gradient-to-br ${currentStyle.colors.sidebarBg} shadow-2xl ${
                        style === 'tokyo' 
                            ? 'border-r border-pink-500/30' 
                            : `border-r border-${currentStyle.colors.primary}-200`
                    }
                    transition-transform duration-300 ease-in-out menu-container z-[60]
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <ul className="flex flex-col mt-16 p-4 text-xl">
                    <p className={`${currentStyle.colors.textPrimary} font-bold mb-2 ${
                        style === 'tokyo' ? currentStyle.colors.textGlow : ''
                    }`}>Menú principal</p>
                    {obtenerCategorias().map((categoria, index) => (
                        <li
                            key={index}
                            className={`flex ${currentStyle.colors.sidebarHover} p-2 rounded-xl cursor-pointer gap-2 transition-all duration-200`}
                            onClick={() => {
                                setCategoriaSeleccionada(categoria);
                                setIsOpen(false);
                            }}
                        >
                            {categoria === "Todos los platillos" && <IoHomeOutline className={`self-center ${currentStyle.colors.textSecondary}`} />}
                            <span className={`font-semibold ${currentStyle.colors.sidebarText}`}>{categoria}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Overlay para cerrar el menú al hacer clic fuera */}
            {isOpen && (
                <div 
                    className={`fixed inset-0 z-40 ${currentStyle.colors.overlayBg}`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Header del restaurante remodelado */}
            <div className={`w-full shadow-md ${
                style === 'tokyo' 
                    ? 'bg-slate-800/80 border-pink-500/30' 
                    : 'bg-white/80'
            } backdrop-blur-sm flex px-4 py-6 rounded-2xl border ${currentStyle.colors.cardBorder} relative z-10 ${
                style === 'tokyo' ? currentStyle.colors.cardGlow : ''
            } ${restauranteInfo?.image && esValorValido(restauranteInfo.image) 
                    ? 'h-70' 
                    : 'h-30'
            }`}> 
                <div className="w-full flex items-center justify-center flex-col">
                    {restauranteInfo?.image && esValorValido(restauranteInfo.image) && (
                        <Image
                            src={restauranteInfo.image}
                            alt="Perfil"
                            className={`rounded-full w-20 h-20 mr-4 object-contain border-4 ${
                                style === 'tokyo' 
                                    ? 'border-pink-500' 
                                    : `border-${currentStyle.colors.primary}-200`
                            } shadow-lg ${style === 'tokyo' ? currentStyle.colors.neonGlow : ''}`}
                            width={80}
                            height={80}
                        />
                    )}
                    <p className={`font-bold text-2xl drop-shadow ${
                        style === 'tokyo' 
                            ? `text-cyan-300 ${currentStyle.colors.textGlow}` 
                            : currentStyle.colors.restaurantNameText
                    }`}>{restauranteInfo?.nombre_restaurante && esValorValido(restauranteInfo.nombre_restaurante) 
                        ? restauranteInfo.nombre_restaurante 
                        : "Las flautas de pepe"}
                    </p>
                    {restauranteInfo?.direccion && esValorValido(restauranteInfo.direccion) && (
                        <p className={`text-sm pt-2 ${currentStyle.colors.restaurantInfoText}`}>| {restauranteInfo.direccion} |</p>
                    )}
                    {(
                        (restauranteInfo?.ciudad && esValorValido(restauranteInfo.ciudad)) ||
                        (restauranteInfo?.alcaldia && esValorValido(restauranteInfo.alcaldia)) ||
                        (restauranteInfo?.codigo_postal && esNumeroValido(restauranteInfo.codigo_postal))
                    ) && (
                        <p className={`text-sm ${currentStyle.colors.restaurantInfoText}`}>
                            |
                            {restauranteInfo?.ciudad && esValorValido(restauranteInfo.ciudad) && ` ${restauranteInfo.ciudad}`}
                            {restauranteInfo?.alcaldia && esValorValido(restauranteInfo.alcaldia) && `, ${restauranteInfo.alcaldia}`}
                            {restauranteInfo?.codigo_postal && esNumeroValido(restauranteInfo.codigo_postal) && ` CP: ${restauranteInfo.codigo_postal}`}
                            |
                        </p>
                    )}
                    {restauranteInfo?.horario && esValorValido(restauranteInfo.horario) && (
                        <div className="flex items-center gap-2">
                            <p className={`text-sm flex py-2 ${currentStyle.colors.restaurantInfoText}`}>
                                | 
                                <span className="px-2 self-center">
                                    <MdOutlineWatchLater className={currentStyle.colors.textSecondary} />
                                </span> 
                                {restauranteInfo.horario} 
                                |
                            </p>
                        </div>
                    )}
                    {restauranteInfo?.telefono && esValorValido(restauranteInfo.telefono) && (
                        <p className={`text-sm flex ${currentStyle.colors.restaurantInfoText}`}>
                            | 
                            <span className="px-2 self-center"> 
                                <FaPhoneAlt className={currentStyle.colors.textSecondary}/> 
                            </span>
                            {restauranteInfo.telefono} 
                            |
                        </p>
                    )}
                    {restauranteInfo?.whatsapp && esValorValido(restauranteInfo.whatsapp) && (
                        <button 
                            className="cursor-pointer py-2"
                            onClick={() => window.open(`${restauranteInfo.whatsapp}`, '_blank')}
                            title="Contactar por WhatsApp"
                        >
                            <FaWhatsapp className={`text-xl ${currentStyle.colors.textSecondary} hover:${currentStyle.colors.textPrimary} transition-colors`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Buscador remodelado */}
            <div className="sticky top-16 z-30 bg-gradient-to-br from-gray-50 via-white to-green-50 w-full px-4 py-4 sm:py-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className={`w-full px-4 py-3 pl-12 border-2 ${currentStyle.colors.inputBorder} rounded-xl focus:outline-none focus:ring-2 ${
                            currentStyle.colors.inputBg
                        } backdrop-blur-sm shadow-lg transition-all duration-200 hover:border-${currentStyle.colors.primary}-300 ${
                            style === 'tokyo' 
                                ? `text-cyan-300 ${currentStyle.colors.inputPlaceholder} ${currentStyle.colors.neonGlow}` 
                                : `${currentStyle.colors.inputText} ${currentStyle.colors.inputPlaceholder}`
                        }`}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className={`h-5 w-5 ${currentStyle.colors.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    {busqueda && (
                        <button
                            onClick={() => setBusqueda("")}
                            className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                                style === 'tokyo' 
                                    ? 'text-pink-400 hover:text-cyan-400' 
                                    : `text-${currentStyle.colors.primary}-400 hover:text-${currentStyle.colors.primary}-600`
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {busqueda && (
                    <p className={`mt-2 text-sm ${
                        style === 'tokyo' ? 'text-cyan-400' : currentStyle.colors.textPrimary
                    }`}>
                        {productosFiltrados.length} resultado(s) encontrado(s) para {busqueda}
                    </p>
                )}
                </div>
            </div>

            <div className="relative z-0">

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
                    <div className={`${
                        style === 'tokyo' 
                            ? 'bg-slate-800 border-pink-500/30' 
                            : 'bg-white'
                    } rounded-3xl shadow-2xl w-11/12 md:w-[420px] border ${currentStyle.colors.cardBorder} max-h-[90vh] overflow-y-auto relative p-6 animate-slideUp ${
                        style === 'tokyo' ? currentStyle.colors.cardGlow : ''
                    }`}>
                        <button
                            className={`absolute top-4 right-4 ${
                                style === 'tokyo' 
                                    ? 'text-pink-400 hover:text-cyan-400' 
                                    : `text-${currentStyle.colors.primary}-500 hover:text-${currentStyle.colors.primary}-700`
                            } transition-colors text-2xl`}
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
                            <h2 className={`text-2xl font-bold mb-2 text-center drop-shadow ${
                                style === 'tokyo' 
                                    ? `text-cyan-300 ${currentStyle.colors.textGlow}` 
                                    : currentStyle.colors.textPrimary
                            }`}>{productoSeleccionado.nombre}</h2>
                            <p className={`${
                                style === 'tokyo' 
                                    ? `${currentStyle.colors.badge} ${currentStyle.colors.neonGlow}` 
                                    : `${currentStyle.colors.badgeBg} ${currentStyle.colors.badgeText}`
                            } rounded-full px-4 py-1 text-sm font-semibold mb-2`}>{productoSeleccionado.categoria}</p>
                            <p className={`text-lg font-bold mb-4 ${
                                style === 'tokyo' 
                                    ? `text-cyan-300 ${currentStyle.colors.textGlow}` 
                                    : currentStyle.colors.textSecondary
                            }`}>
                                ${productoSeleccionado.precio.toFixed(2)} 
                            </p>
                            <p className={`text-center text-md leading-relaxed mb-4 ${
                                style === 'tokyo' ? 'text-pink-300' : 'text-gray-700'
                            }`}>
                                {productoSeleccionado.descripcion}
                            </p>
                            <div className="flex gap-2 mt-2">
                                {productoSeleccionado.status === "activo" ? (
                                    <span className={`${
                                        style === 'tokyo' 
                                            ? `${currentStyle.colors.badge} ${currentStyle.colors.neonGlow}` 
                                            : `${currentStyle.colors.badge}`
                                    } text-white px-3 py-1 rounded-full text-xs font-medium shadow`}>Disponible</span>
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
                                className={`${currentStyle.colors.cardBg} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border ${currentStyle.colors.cardBorder} overflow-hidden group ${
                                    style === 'tokyo' ? currentStyle.colors.cardGlow : ''
                                }`}
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
                                        <div className={`absolute top-3 right-3 ${
                                            style === 'tokyo' 
                                                ? `${currentStyle.colors.badge} text-white ${currentStyle.colors.neonGlow}` 
                                                : `${currentStyle.colors.badge} text-white`
                                        } px-2 py-1 rounded-full text-xs font-medium shadow`}>
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
                                    <div className={`absolute bottom-3 left-3 ${
                                        style === 'tokyo' 
                                            ? 'bg-slate-900/90 border border-cyan-500/50' 
                                            : 'bg-white/90'
                                    } backdrop-blur-sm px-3 py-1 rounded-full shadow-lg`}>
                                        <span className={`text-lg font-bold ${
                                            style === 'tokyo' 
                                                ? `text-cyan-300 ${currentStyle.colors.textGlow}` 
                                                : currentStyle.colors.textSecondary
                                        }`}>
                                            ${producto.precio.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                {/* Info del producto */}
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className={`font-bold text-xl ${style === 'tokyo' ? `text-cyan-300 ${currentStyle.colors.textGlow}` : currentStyle.colors.textCard}`}>
                                            {producto.nombre}
                                        </h3>
                                    </div>
                                    <p className={`mb-4 line-clamp-2 min-h-[3rem] ${style === 'tokyo' ? 'text-pink-300' : 'text-gray-500'}`}>
                                        {producto.descripcion.length > 80
                                            ? `${producto.descripcion.slice(0, 80)}...`
                                            : producto.descripcion}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <p className={`${style === 'tokyo' ? `${currentStyle.colors.badge} text-white ${currentStyle.colors.neonGlow}` : `${currentStyle.colors.badgeBg} ${currentStyle.colors.badgeText}`} rounded-full px-4 py-1 text-sm font-semibold`}>
                                            {producto.categoria}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            className={`flex gap-4 items-center justify-center bg-gradient-to-r ${currentStyle.colors.buttonGradient} text-white px-4 py-2 rounded-lg text-sm cursor-pointer w-full shadow-lg font-semibold transition-all duration-200 ${style === 'tokyo' ? currentStyle.colors.neonGlow : ''}`}
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
                        <p className={`text-lg ${style === 'tokyo' ? 'text-pink-300' : 'text-gray-500'}`}>
                            No se encontraron productos.
                        </p>
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
            </div>
        </section>

        </>
    );
}