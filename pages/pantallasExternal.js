import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import getListaProductos from '@/useCases/getListaProductos';
import { loginUser } from '@/useCases/login';
import { loginMesero } from '@/useCases/loginMesero';
import Head from 'next/head';
import { IoExpandOutline, IoContractOutline } from 'react-icons/io5';

export default function PantallasExternal() {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewMode, setViewMode] = useState('single');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const router = useRouter();

    // Verificar estado de pantalla completa
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Verificar si ya existe un token al cargar la página
    useEffect(() => {
        const checkExistingToken = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            if (token) {
                setLoading(true);
                try {
                    // Intentar cargar productos con el token existente
                    const productList = await getListaProductos();
                    
                    if (productList && productList.length > 0) {
                        setProducts(productList);
                        setIsAuthenticated(true);
                        setShowLogin(false);
                    } else {
                        // Si no hay productos, limpiar token y mostrar login
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                        setShowLogin(true);
                    }
                } catch (error) {
                    console.error('Error al cargar productos con token existente:', error);
                    // Si el token es inválido, limpiar y mostrar login
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    setShowLogin(true);
                } finally {
                    setLoading(false);
                }
            }
        };

        checkExistingToken();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoading(true);

        try {
            let token = null;
            let loginSuccess = false;

            // Intentar login de administrador
            try {
                const responseAdmin = await loginUser({
                    email: loginData.email,
                    password: loginData.password
                });

                if (responseAdmin.ok) {
                    const data = await responseAdmin.json();
                    token = data.token || data.access_token;
                    loginSuccess = true;
                }
            } catch (error) {
                console.log('Login admin falló, intentando con mesero...');
            }

            // Si falla, intentar con login de mesero usando el password como access_code
            if (!loginSuccess) {
                try {
                    const dataMesero = await loginMesero(loginData.email, loginData.password);
                    token = dataMesero.access_token;
                    loginSuccess = true;
                } catch (error) {
                    console.log('Login mesero también falló');
                }
            }

            if (loginSuccess && token) {
                // Guardar token en ambos almacenamientos para persistencia
                localStorage.setItem('token', token);
                sessionStorage.setItem('token', token);
                
                // Cargar productos
                const productList = await getListaProductos();
                
                if (productList && productList.length > 0) {
                    setProducts(productList);
                    setIsAuthenticated(true);
                    setShowLogin(false);
                } else {
                    setLoginError('No hay productos en la lista. Configure primero en Pantallas.');
                    localStorage.removeItem('token');
                }
            } else {
                setLoginError('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setLoginError('Error al iniciar sesión. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                }
            }
        } catch (error) {
            console.error('Error con fullscreen:', error);
        }
    };

    // Cambiar de producto según el modo de vista
    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            
            // Esperar a que termine la animación de salida
            setTimeout(() => {
                setCurrentIndex((prevIndex) => {
                    // Avanzar según el modo de vista
                    const increment = viewMode === 'single' ? 1 : 2;
                    const nextIndex = prevIndex + increment;
                    // Si llegamos al final, volver al inicio
                    return nextIndex >= products.length ? 0 : nextIndex;
                });
                
                // Reiniciar la transición para la animación de entrada
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 50);
            }, 300); // Tiempo de la animación de salida
        }, 8000); // 8 segundos para dar más tiempo a ver cada producto

        return () => clearInterval(interval);
    }, [products, viewMode]);

    const getImageUrl = (product) => {
        const raw = Array.isArray(product.image_url) ? product.image_url[0] : product.image_url;
        if (!raw) return "/Default.png";
        const cleaned = String(raw).replace(/[`'"]/g, "").trim();
        return cleaned || "/Default.png";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-yellow-400 text-2xl font-bold animate-pulse">Iniciando sesión...</p>
                </div>
            </div>
        );
    }

    // Pantalla de login
    if (showLogin) {
        return (
            <>
                <Head>
                    <title>Menú Digital - Login</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>

                <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
                    {/* Fondo animado */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl animate-blob"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Formulario de login */}
                    <div className="relative z-10 w-full max-w-md">
                        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700">
                            {/* Logo */}
                            <div className="text-center mb-8">
                                <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                                    WapiFood
                                </h1>
                                <p className="text-gray-400 text-lg">Menú para Pantallas</p>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        placeholder="correo@ejemplo.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                {loginError && (
                                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-sm">
                                        {loginError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                </button>
                            </form>

                            {/* Botón volver */}
                            <button
                                onClick={() => router.push('/')}
                                className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </div>

                    <style jsx>{`
                        @keyframes blob {
                            0%, 100% {
                                transform: translate(0, 0) scale(1);
                            }
                            25% {
                                transform: translate(20px, -50px) scale(1.1);
                            }
                            50% {
                                transform: translate(-20px, 20px) scale(0.9);
                            }
                            75% {
                                transform: translate(50px, 50px) scale(1.05);
                            }
                        }

                        .animate-blob {
                            animation: blob 7s infinite;
                        }

                        .animation-delay-2000 {
                            animation-delay: 2s;
                        }

                        .animation-delay-4000 {
                            animation-delay: 4s;
                        }
                    `}</style>
                </div>
            </>
        );
    }

    if (!isAuthenticated || products.length === 0) {
        return null;
    }

    const currentProduct = products[currentIndex];

    return (
        <>
            <Head>
                <title>Menú Digital - WapiFood</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen bg-black overflow-hidden relative">
                {/* Fondo con degradado animado */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl animate-blob"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
                    </div>
                </div>

                {/* Botones de control */}
                {!isFullscreen && (
                    <>
                        {/* Botón de pantalla completa */}
                        <button
                            onClick={toggleFullscreen}
                            className="fixed top-8 right-40 z-50 bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-all duration-300 shadow-2xl border border-white/20"
                            title="Pantalla completa"
                        >
                            <IoExpandOutline className="text-3xl" />
                        </button>

                        {/* Switch de diseño */}
                        <div className="fixed top-8 left-8 z-50 bg-white/10 backdrop-blur-md rounded-full p-2 shadow-2xl border border-white/20">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('single')}
                                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                                        viewMode === 'single'
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                                            : 'text-white hover:bg-white/10'
                                    }`}
                                >
                                    1 Producto
                                </button>
                                <button
                                    onClick={() => setViewMode('classic')}
                                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                                        viewMode === 'classic'
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                                            : 'text-white hover:bg-white/10'
                                    }`}
                                >
                                    2 Clásico
                                </button>
                                <button
                                    onClick={() => setViewMode('compact')}
                                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                                        viewMode === 'compact'
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                                            : 'text-white hover:bg-white/10'
                                    }`}
                                >
                                    2 Compacto
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Contenido principal */}
                <div className="relative z-10 h-screen flex items-center justify-center p-8 overflow-hidden">
                    <div className="w-full max-w-7xl relative">
                        {/* Carrusel de productos - Vista Single (1 producto) */}
                        {viewMode === 'single' && products[currentIndex] && (
                            <div className={`relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                                {/* Imagen del producto */}
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 rounded-3xl opacity-75 blur-xl"></div>
                                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                                        <div className="aspect-square relative">
                                            <img
                                                src={getImageUrl(products[currentIndex])}
                                                alt={products[currentIndex].name}
                                                className={`w-full h-full object-cover transition-all duration-700 ${isTransitioning ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            
                                            {/* Badge de disponibilidad */}
                                            {products[currentIndex].status === 'activo' && (
                                                <div className="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl animate-bounce-slow">
                                                    ✓ Disponible
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Información del producto */}
                                <div className="text-white space-y-6">
                                    {/* Categoría */}
                                    <div className="inline-block">
                                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg">
                                            {products[currentIndex].nombre_categoria || products[currentIndex].category_name || 'Destacado'}
                                        </span>
                                    </div>

                                    {/* Nombre del producto */}
                                    <h1 className="text-4xl md:text-5xl font-black leading-tight bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                                        {products[currentIndex].name}
                                    </h1>

                                    {/* Descripción */}
                                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light line-clamp-3">
                                        {products[currentIndex].description || 'Delicioso producto de nuestra selección especial'}
                                    </p>

                                    {/* Precio */}
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl px-8 py-4 shadow-2xl">
                                            <p className="text-sm text-black font-semibold uppercase">Precio</p>
                                            <p className="text-4xl font-black text-black">
                                                ${parseFloat(products[currentIndex].price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Carrusel de productos - Vista Clásica */}
                        {viewMode === 'classic' && (
                            <div className={`relative transition-all duration-700 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                {/* Primer producto */}
                                {products[currentIndex] && (
                                    <div className={`flex flex-col h-full transition-all duration-700 ${isTransitioning ? 'translate-x-[-30px] opacity-0' : 'translate-x-0 opacity-100'}`}>
                                        {/* Imagen del producto */}
                                        <div className="relative group flex-shrink-0">
                                            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 rounded-3xl opacity-75 blur-xl"></div>
                                            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                                                <div className="aspect-square relative">
                                                    <img
                                                        src={getImageUrl(products[currentIndex])}
                                                        alt={products[currentIndex].name}
                                                        className={`w-full h-full object-cover transition-all duration-700 ${isTransitioning ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                    
                                                    {/* Badge de disponibilidad */}
                                                    {products[currentIndex].status === 'activo' && (
                                                        <div className="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl animate-bounce-slow">
                                                            ✓ Disponible
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Información del producto */}
                                        <div className="text-white space-y-4 mt-6 flex-1 flex flex-col">
                                            {/* Categoría */}
                                            <div className="inline-block">
                                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg">
                                                    {products[currentIndex].nombre_categoria || products[currentIndex].category_name || 'Destacado'}
                                                </span>
                                            </div>

                                            {/* Nombre del producto */}
                                            <h1 className="text-3xl md:text-4xl font-black leading-tight bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 bg-clip-text text-transparent animate-gradient line-clamp-2">
                                                {products[currentIndex].name}
                                            </h1>

                                            {/* Descripción */}
                                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light line-clamp-3 flex-1">
                                                {products[currentIndex].description || 'Delicioso producto de nuestra selección especial'}
                                            </p>

                                            {/* Precio */}
                                            <div className="flex items-center gap-4 mt-auto">
                                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl px-8 py-4 shadow-2xl">
                                                    <p className="text-sm text-black font-semibold uppercase">Precio</p>
                                                    <p className="text-4xl font-black text-black">
                                                        ${parseFloat(products[currentIndex].price).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Segundo producto */}
                                {products[(currentIndex + 1) % products.length] && products.length > 1 && (
                                    <div className={`flex flex-col h-full transition-all duration-700 delay-100 ${isTransitioning ? 'translate-x-[30px] opacity-0' : 'translate-x-0 opacity-100'}`}>
                                        {/* Imagen del producto */}
                                        <div className="relative group flex-shrink-0">
                                            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl opacity-75 blur-xl"></div>
                                            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                                                <div className="aspect-square relative">
                                                    <img
                                                        src={getImageUrl(products[(currentIndex + 1) % products.length])}
                                                        alt={products[(currentIndex + 1) % products.length].name}
                                                        className={`w-full h-full object-cover transition-all duration-700 ${isTransitioning ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                    
                                                    {/* Badge de disponibilidad */}
                                                    {products[(currentIndex + 1) % products.length].status === 'activo' && (
                                                        <div className="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl animate-bounce-slow">
                                                            ✓ Disponible
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Información del producto */}
                                        <div className="text-white space-y-4 mt-6 flex-1 flex flex-col">
                                            {/* Categoría */}
                                            <div className="inline-block">
                                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg">
                                                    {products[(currentIndex + 1) % products.length].nombre_categoria || products[(currentIndex + 1) % products.length].category_name || 'Destacado'}
                                                </span>
                                            </div>

                                            {/* Nombre del producto */}
                                            <h1 className="text-3xl md:text-4xl font-black leading-tight bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 bg-clip-text text-transparent animate-gradient line-clamp-2">
                                                {products[(currentIndex + 1) % products.length].name}
                                            </h1>

                                            {/* Descripción */}
                                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light line-clamp-3 flex-1">
                                                {products[(currentIndex + 1) % products.length].description || 'Delicioso producto de nuestra selección especial'}
                                            </p>

                                            {/* Precio */}
                                            <div className="flex items-center gap-4 mt-auto">
                                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl px-8 py-4 shadow-2xl">
                                                    <p className="text-sm text-black font-semibold uppercase">Precio</p>
                                                    <p className="text-4xl font-black text-black">
                                                        ${parseFloat(products[(currentIndex + 1) % products.length].price).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        )}

                        {/* Carrusel de productos - Vista Compacta */}
                        {viewMode === 'compact' && (
                            <div className="relative h-[600px] flex items-center">
                                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 w-full transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                                    {/* Primer producto */}
                                    {products[currentIndex] && (
                                        <div className={`transition-all duration-700 ${isTransitioning ? 'translate-y-[20px]' : 'translate-y-0'}`}>
                                            <div className="relative group h-full">
                                                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 rounded-3xl opacity-75 blur-xl"></div>
                                                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col">
                                                    <div className="aspect-square relative">
                                                        <img
                                                            src={getImageUrl(products[currentIndex])}
                                                            alt={products[currentIndex].name}
                                                            className={`w-full h-full object-cover transition-all duration-700 ${isTransitioning ? 'scale-105' : 'scale-100'}`}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                        
                                                        {/* Badge de disponibilidad */}
                                                        {products[currentIndex].status === 'activo' && (
                                                            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                                                                ✓ Disponible
                                                            </div>
                                                        )}

                                                        {/* Categoría */}
                                                        <div className="absolute top-4 left-4">
                                                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg">
                                                                {products[currentIndex].nombre_categoria || products[currentIndex].category_name || 'Destacado'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Información del producto */}
                                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 line-clamp-2">
                                                                {products[currentIndex].name}
                                                            </h2>
                                                            <p className="text-lg text-gray-300 line-clamp-3">
                                                                {products[currentIndex].description || 'Delicioso producto de nuestra selección especial'}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Precio */}
                                                        <div className="mt-4">
                                                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-6 py-3 inline-block shadow-lg">
                                                                <p className="text-xs text-black font-semibold uppercase">Precio</p>
                                                                <p className="text-3xl font-black text-black">
                                                                    ${parseFloat(products[currentIndex].price).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Segundo producto */}
                                    {products[(currentIndex + 1) % products.length] && (
                                        <div className={`transition-all duration-700 delay-100 ${isTransitioning ? 'translate-y-[20px]' : 'translate-y-0'}`}>
                                            <div className="relative group h-full">
                                                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl opacity-75 blur-xl"></div>
                                                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col">
                                                    <div className="aspect-square relative">
                                                        <img
                                                            src={getImageUrl(products[(currentIndex + 1) % products.length])}
                                                            alt={products[(currentIndex + 1) % products.length].name}
                                                            className={`w-full h-full object-cover transition-all duration-700 ${isTransitioning ? 'scale-105' : 'scale-100'}`}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                        
                                                        {/* Badge de disponibilidad */}
                                                        {products[(currentIndex + 1) % products.length].status === 'activo' && (
                                                            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                                                                ✓ Disponible
                                                            </div>
                                                        )}

                                                        {/* Categoría */}
                                                        <div className="absolute top-4 left-4">
                                                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg">
                                                                {products[(currentIndex + 1) % products.length].nombre_categoria || products[(currentIndex + 1) % products.length].category_name || 'Destacado'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Información del producto */}
                                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 line-clamp-2">
                                                                {products[(currentIndex + 1) % products.length].name}
                                                            </h2>
                                                            <p className="text-lg text-gray-300 line-clamp-3">
                                                                {products[(currentIndex + 1) % products.length].description || 'Delicioso producto de nuestra selección especial'}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Precio */}
                                                        <div className="mt-4">
                                                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-6 py-3 inline-block shadow-lg">
                                                                <p className="text-xs text-black font-semibold uppercase">Precio</p>
                                                                <p className="text-3xl font-black text-black">
                                                                    ${parseFloat(products[(currentIndex + 1) % products.length].price).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contador de productos */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xl font-semibold">
                        <span className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 text-2xl">
                            {currentIndex + 1}/{products.length}
                        </span>
                    </div>
                </div>

                {/* Botón de salir (discreto) */}
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        setShowLogin(true);
                        setIsAuthenticated(false);
                    }}
                    className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 border border-white/20 z-20"
                >
                    Salir
                </button>

                {/* Botón de pantalla completa - solo visible cuando NO está en fullscreen */}
                {!isFullscreen && (
                    <button
                        onClick={toggleFullscreen}
                        className="absolute top-8 left-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 border border-white/20 z-20 flex items-center gap-2"
                    >
                        <IoExpandOutline className="text-2xl" />
                        <span className="hidden sm:inline">Pantalla Completa</span>
                    </button>
                )}

                <style jsx>{`
                    @keyframes fade-in {
                        from {
                            opacity: 0;
                            transform: scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }

                    @keyframes slide-in-left {
                        from {
                            opacity: 0;
                            transform: translateX(-50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    @keyframes slide-in-right {
                        from {
                            opacity: 0;
                            transform: translateX(50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    @keyframes blob {
                        0%, 100% {
                            transform: translate(0, 0) scale(1);
                        }
                        25% {
                            transform: translate(20px, -50px) scale(1.1);
                        }
                        50% {
                            transform: translate(-20px, 20px) scale(0.9);
                        }
                        75% {
                            transform: translate(50px, 50px) scale(1.05);
                        }
                    }

                    @keyframes gradient {
                        0%, 100% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                    }

                    @keyframes bounce-slow {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-10px);
                        }
                    }

                    @keyframes fade-slide-up {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .animate-fade-in {
                        animation: fade-in 0.8s ease-out;
                    }

                    .animate-slide-in-left {
                        animation: slide-in-left 0.8s ease-out;
                    }

                    .animate-slide-in-right {
                        animation: slide-in-right 0.8s ease-out;
                    }

                    .animate-blob {
                        animation: blob 7s infinite;
                    }

                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }

                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }

                    .animate-gradient {
                        background-size: 200% auto;
                        animation: gradient 3s ease infinite;
                    }

                    .animate-bounce-slow {
                        animation: bounce-slow 2s ease-in-out infinite;
                    }

                    .delay-100 {
                        transition-delay: 100ms;
                    }

                    .delay-200 {
                        transition-delay: 200ms;
                    }

                    /* Transiciones suaves para todos los elementos */
                    * {
                        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    }
                `}</style>
            </div>
        </>
    );
}
