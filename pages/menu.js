import Navbar from "@/dashboardComponents/navbar";
import MenuComponentes from "@/menuComponents/menucomponentes";
import Cards from "@/menuComponents/Cards";

export default function Menu() {
  return (
    <section className="flex flex-col items-center justify-center ">
      <Navbar />
      <div className="w-11/12 ">
        <MenuComponentes />
      </div>

      <div className="w-full p-4 flex flex-wrap gap-4 justify-center items-center flex-col md:flex-row ">
        <Cards />
        <Cards />
        <Cards />

      
      </div>
    </section>
  );
}
