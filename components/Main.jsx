import Image from 'next/image'
import { useRouter } from 'next/router'
import imagenes from '@/pages/assets/img/imagenes'

export default function Main() {
    const router = useRouter();

    const handleStartClick = () => {
        router.push('/Demopage');
    };

    const handleHowItWorksClick = () => {
        router.push('/Demopage');
    };

    return (
        <main className="bg-[#3fe283] h-auto ">
            <section className="py-10 flex justify-center items-center flex-col px-4">

                <div className="w-full ">
                    <h2 className="text-4xl text-center font-bold text-black">Gestiona tus pedidos de forma fácil y eficiente!</h2>

                    <p className="text-center text-black text-lg mt-4">Comandapp es la plataforma que simplifica la gestión de pedidos para tu restaurante o negocio de comida.</p>

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
                            ¿Cómo funciona?
                        </button>

                    </div>

                </div>

                <Image src={imagenes.img2} className='h-[400px] w-[500px] shadow-xl rounded-lg ' />

            </section>
        </main>
    )
}
