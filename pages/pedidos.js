import Navbar from "@/dashboardComponents/navbar";
import Pedidoscomp from "@/pedidos/pedidoscomp";
export default function Pedidos() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen w-full">
              <Navbar />
              <div className="w-11/12">
                <Pedidoscomp/>
              </div>
            </section>
        
    );
}