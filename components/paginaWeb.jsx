import MenúDigital from "@/pages/assets/images/Menúdigital.png";
import Image from "next/image";

export default function PaginaWeb() {
    return (
        <main className="bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 min-h-screen flex items-center justify-center">
            <section className="flex flex-col md:flex-row items-center justify-center w-full px-4 md:gap-10 md:px-16 py-10 md:py-0 min-h-[80vh]" id='main'>
                <div className="w-full md:w-2/3 flex flex-col justify-center items-center">
                    <h2 className="text-4xl md:text-5xl text-center font-extrabold text-green-800 drop-shadow-lg mb-4 max-w-xl leading-tight">
                        ¡Tu menú digital automáticamente!
                    </h2>
                    <p className="text-center text-green-700 text-lg md:text-xl mt-2 mb-4 font-medium max-w-lg">
                        Nuestra app te diseña un menú digital de manera automática. Solo tienes que agregar tus datos y productos y ¡listo! Tendrás tu propia página web profesional.
                    </p>
                   
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Image 
                        src={MenúDigital} 
                        className="hidden md:block h-[900px] w-[600px] shadow-2xl rounded-2xl border-4 border-green-200 md:h-[50%] md:w-[50%] lg:w-[100%] md:min-w-[400px] lg:min-w-[600px] transition-all duration-300 hover:scale-105"
                        alt="Imagen para pantallas grandes"
                    />
                    <Image 
                        src={MenúDigital}
                        className="block md:hidden h-[350px] w-[90vw] max-w-[375px] shadow-2xl rounded-2xl border-4 border-emerald-200 transition-all duration-300 hover:scale-105"
                        alt="Imagen para pantallas pequeñas"
                    />
                </div>
            </section>
        </main>
    )
}
