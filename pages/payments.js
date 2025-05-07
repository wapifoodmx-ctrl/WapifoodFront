import Navbar from "@/dashboardComponents/navbar";
import PlanDeVentas from "@/planesdeventa/planesdeventa";
export default function Payments() {

    return (
        <section className=" min-h-screen flex flex-col w-full mt-16 "> 
            <Navbar />
            <PlanDeVentas />
        </section>
    );
}