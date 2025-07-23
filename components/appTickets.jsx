import Menu1 from "@/pages/assets/images/Menu1.png";
import Image from "next/image";

export default function AppTickets() {
  
    return (
        <main className="bg-[#3fe283] h-auto ">
            <section className="py-10 flex justify-center items-center flex-col px-4  md:flex-row  md:items-center md:gap-4 md:px-10" id='main'>

            <Image 
                    src={Menu1} 
                    className="hidden md:block h-[400px] w-[500px] shadow-xl rounded-lg md:h-[50%] md:w-[50%] md:min-w-[400px]" 
                    alt="Imagen para pantallas grandes"
                />
                <div className="w-full md:w-1/2" >
                    <h2 className="text-4xl text-center font-bold text-black">Wapiticket para acompletar tu negocio</h2>

                    <p className="text-center text-black text-lg mt-4">Descarga nuestra app en playstore, contrata un paquete con impresora e imprime los tickets de tus clientes, tambien se los puedes mandar al correo para ser mas amigable con el ambiente.</p>

                    <div className="flex justify-center items-center my-8 flex-col gap-6">

                    </div>

                </div>

            </section>
        </main>
    )
}
