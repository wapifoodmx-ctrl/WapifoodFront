import { useRouter } from 'next/router';
import Head from 'next/head';
import { IoRestaurantOutline, IoHomeOutline } from "react-icons/io5";
import { MdOutlineRestaurantMenu, MdOutlineArrowBack } from "react-icons/md";
import { FaSadCry } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

export default function Custom404() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>404 - Página no encontrada | WapiFood</title>
                <meta name="description" content="La página que buscas no existe" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 flex items-center justify-center px-4 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-green-300/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-300/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-300/20 rounded-full blur-2xl"></div>

                <div className="max-w-2xl w-full text-center relative z-10">
                    {/* Animated Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-white rounded-full p-8 shadow-2xl">
                                <FaSadCry className="text-8xl text-orange-500" />
                            </div>
                        </div>
                    </div>

                    {/* Error Code */}
                    <h1 className="text-9xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                        404
                    </h1>

                    {/* Main Message */}
                    <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
                        ¡Ups! Esta página no está en el menú
                    </h2>

                    <p className="text-lg md:text-xl text-green-700 mb-8 max-w-xl mx-auto">
                        Parece que el platillo que buscas no existe en nuestro sistema. 
                        Pero no te preocupes, ¡tenemos muchas otras opciones deliciosas para ti!
                    </p>

                    {/* Fun Messages */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-green-200 shadow-lg">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <HiOutlineSparkles className="text-emerald-500" size={20} />
                            <p className="text-green-800 font-semibold">¿Sabías qué?</p>
                            <HiOutlineSparkles className="text-emerald-500" size={20} />
                        </div>
                        <p className="text-green-700">
                            Este error es más raro que encontrar piña en una pizza napolitana 🍕
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 border-2 border-green-400"
                        >
                            <MdOutlineArrowBack size={20} />
                            Volver atrás
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 border-2 border-green-300"
                        >
                            <IoHomeOutline size={20} />
                            Ir al inicio
                        </button>

                        <button
                            onClick={() => router.push('/login')}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r bg-green-400  text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 border-2 border-blue-400"
                        >
                            <MdOutlineRestaurantMenu size={20} />
                            Iniciar Sesión
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 flex flex-wrap justify-center gap-6 text-green-600">
                        <div className="flex items-center gap-2">
                            <IoRestaurantOutline size={20} className="text-emerald-500" />
                            <span className="text-sm">WapiFood siempre abierto</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span className="text-sm">Soporte continuo!</span>
                        </div>
                    </div>

                    {/* Footer Message */}
                    <p className="mt-8 text-green-600 text-sm">
                        Si crees que esto es un error, contáctanos en{' '}
                        <a href="mailto:wapifoodmx.dev@gmail.com" className="text-emerald-600 font-semibold hover:underline">
                            wapifoodmx.dev@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
