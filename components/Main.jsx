import Image from 'next/image'
import { useRouter } from 'next/router'
import Menu from '@/pages/assets/img/menu.png'
import Menuuwu from '@/pages/assets/img/Menuuwu.png'

export default function Main() {
    const router = useRouter();

    const handleStartClick = () => {
        router.push('#registro');
    };

    const handleHowItWorksClick = () => {
        router.push('/login');
    };

    return (
        <main className="bg-[#3fe283] h-auto ">
            <section className="py-10 flex justify-center items-center flex-col px-4  md:flex-row  md:items-center md:gap-4 md:px-10" id='main'>

                <div className="w-full md:w-1/2" >
                    <h2 className="text-4xl text-center font-bold text-black">Gestiona tus pedidos de forma fácil y eficiente!</h2>

                    <p className="text-center text-black text-lg mt-4">WapiFood es la plataforma que simplifica la gestión de pedidos para tu restaurante o negocio de comida.</p>

                    <div className="flex justify-center items-center my-8 flex-col gap-6">

                        <button 
                            className="rounded-lg bg-white text-black border-black  p-2 w-full cursor-pointer text-2xl"
                            onClick={handleStartClick}
                        >
                            Comenzar ahora
                        </button>

                        <button 
                            className="rounded-lg bg-[#3fe283] text-black p-2 w-full border-white border-3 cursor-pointer text-2xl"
                            onClick={handleHowItWorksClick}
                        >
                            Iniciar Sesión
                        </button>

                    </div>

                </div>

                <Image 
                    src={Menu} 
                    className="hidden md:block h-[400px] w-[500px] shadow-xl rounded-lg md:h-[50%] md:w-[50%] md:min-w-[400px]" 
                    alt="Imagen para pantallas grandes"
                />

                <Image 
                    src={Menuuwu}
                    className="block md:hidden h-[500px] w-[375px] shadow-xl rounded-lg" 
                    alt="Imagen para pantallas pequeñas"
                />

            </section>
        </main>
    )
}
