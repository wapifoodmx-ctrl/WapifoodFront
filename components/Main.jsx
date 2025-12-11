import Image from 'next/image'
import { useRouter } from 'next/router'
import Menu from '@/pages/assets/img/menu.png'
import Menuuwu from '@/pages/assets/img/Menuuwu.png'
import Menu2 from '@/pages/assets/images/Menu2.png'

export default function Main() {
    const router = useRouter();

    const handleStartClick = () => {
        router.push('#registro');
    };

    const handleHowItWorksClick = () => {
        router.push('/login');
    };
    const handleClientMenuClick = () => {
        router.push('/clientmenu');
    }

    const handleMeseroMenuClick = () => {
        router.push('/meseroMenu');
    }

    return (
        <main className="bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 min-h-screen flex items-center justify-center">
            <section className="flex flex-col md:flex-row items-center justify-center w-full px-4 md:gap-10 md:px-16 py-10 md:py-0 min-h-[80vh]" id='main'>
                <div className="w-full md:w-2/3 flex flex-col justify-center items-center">
                    <h2 className="text-4xl md:text-5xl text-center font-extrabold text-green-800 drop-shadow-lg mb-4 max-w-xl leading-tight">
                        Gestiona tus pedidos de forma fácil y eficiente!
                    </h2>
                    <p className="text-center text-green-700 text-lg md:text-xl mt-2 mb-4 font-medium max-w-lg">
                        WapiFood es la plataforma que simplifica la gestión de pedidos para tu restaurante o negocio de comida.
                    </p>
                    <div className="flex flex-col gap-6 w-full max-w-md my-6">
                        <button 
                            className="rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold shadow-lg p-3 w-full text-2xl hover:scale-105 hover:from-green-500 hover:to-emerald-500 transition-all duration-200 border-2 border-green-300"
                            onClick={handleStartClick}
                        >
                            Comenzar ahora
                        </button>
                        <button 
                            className="rounded-xl bg-gradient-to-r from-white to-green-100 text-green-800 font-bold shadow-lg p-3 w-full text-2xl hover:scale-105 hover:bg-green-200 transition-all duration-200 border-2 border-emerald-200"
                            onClick={handleHowItWorksClick}
                        >
                            Iniciar Sesión
                        </button>
                        <button 
                            className="rounded-xl bg-gradient-to-r from-green-100 to-white text-emerald-700 font-bold shadow-lg p-3 w-full text-2xl hover:scale-105 hover:bg-emerald-100 transition-all duration-200 border-2 border-green-200"
                            onClick={handleClientMenuClick}
                        >
                            Menú del Cliente
                        </button>
                        <button 
                            className="rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-white font-bold shadow-lg p-3 w-full text-2xl hover:scale-105 hover:from-orange-500 hover:to-amber-500 transition-all duration-200 border-2 border-orange-300"
                            onClick={handleMeseroMenuClick}
                        >
                            Menú Mesero
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Image 
                        src={Menu2} 
                        className="hidden md:block h-[900px] w-[600px] shadow-2xl rounded-2xl border-4 border-green-200 md:h-[50%] md:w-[50%] lg:w-[100%] md:min-w-[400px] lg:min-w-[600px] transition-all duration-300 hover:scale-105"
                        alt="Imagen para pantallas grandes"
                    />
                    <Image 
                        src={Menuuwu}
                        className="block md:hidden h-[350px] w-[90vw] max-w-[375px] shadow-2xl rounded-2xl border-4 border-emerald-200 transition-all duration-300 hover:scale-105"
                        alt="Imagen para pantallas pequeñas"
                    />
                </div>
            </section>
        </main>
    )
}
