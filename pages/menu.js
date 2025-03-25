import Navbar from "@/dashboardComponents/navbar";
import MenuComponentes from "@/menuComponents/menucomponentes";
export default function Menu() {
  return (
    <section className="flex flex-col items-center justify-center">
      <Navbar />
      <div className="w-11/12">
        <MenuComponentes />
      </div>
    </section>
  );
}
