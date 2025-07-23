import MenúDigital from "@/pages/assets/images/Menúdigital.png";
import Image from "next/image";

export default function PaginaWeb() {
  
    return (
        <main className="bg-[#3fe283] h-auto ">
            <section className="py-10 flex justify-center items-center flex-col px-4  md:flex-row  md:items-center md:gap-4 md:px-10" id='main'>

                <div className="w-full md:w-1/2" >
                    <h2 className="text-4xl text-center font-bold text-black">Haz tu página web automaticamente!</h2>

                    <p className="text-center text-black text-lg mt-4">Nuestra app te diseña un menú digital de manera automatica, solo tiene sque poner tus datos y listo.</p>

                    <div className="flex justify-center items-center my-8 flex-col gap-6">

                    </div>

                </div>

                <Image 
                    src={MenúDigital} 
                    className="hidden md:block h-[400px] w-[500px] shadow-xl rounded-lg md:h-[50%] md:w-[50%] md:min-w-[400px]" 
                    alt="Imagen para pantallas grandes"
                />

                

            </section>
        </main>
    )
}
