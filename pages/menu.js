import Navbar from "@/dashboardComponents/navbar";
import MenuComponentes from "@/menuComponents/menucomponentes";
import Cards from "@/menuComponents/Cards";
import { useState } from "react";

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para la categoría seleccionada

  return (
    <section className="flex flex-col items-center justify-center ">
      <Navbar />
      <div className="w-11/12 ">
        <MenuComponentes
          onSearch={setSearchTerm}
          onCategoryChange={setSelectedCategory} // Pasar setSelectedCategory como prop
        />
      </div>

      <div className="w-full p-4 flex flex-wrap gap-4 justify-center items-center flex-col md:flex-row ">
        <Cards searchTerm={searchTerm} selectedCategory={selectedCategory} /> {/* Pasar selectedCategory */}
      </div>
    </section>
  );
}
