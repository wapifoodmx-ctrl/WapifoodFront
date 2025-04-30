import Navbar from "@/dashboardComponents/navbar";
import MenuComponentes from "@/menuComponents/menucomponentes";
import Cards from "@/menuComponents/Cards";
import { useState, useEffect } from "react";
import { getProducts } from "@/useCases/getProducts";
import { getCategoria } from "@/useCases/getCategoria";

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para la categoría seleccionada
  const [products, setProducts] = useState([]); // Estado para los productos
  const [categories, setCategories] = useState([]); // Estado para las categorías

  // Función para obtener los productos
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data); // Actualizar los productos
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  // Función para obtener las categorías
  const fetchCategories = async () => {
    try {
      const data = await getCategoria();
      setCategories(data); // Actualizar las categorías
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  // Obtener los datos al cargar el componente
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Función para manejar la actualización global
  const handleRefresh = async () => {
    await fetchProducts(); // Actualizar los productos
    await fetchCategories(); // Actualizar las categorías
  };

  return (
    <section className="flex flex-col items-center justify-center ">
      <Navbar />
      <div className="w-11/12 ">
        <MenuComponentes
          onSearch={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onRefresh={handleRefresh} // Pasar handleRefresh como prop
          categories={categories} // Pasar las categorías como prop
        />
      </div>

      <div className="w-full p-4 flex flex-wrap gap-4 justify-center items-center flex-col md:flex-row ">
        <Cards
          products={products} // Pasar los productos como prop
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories} // Pasar las categorías como prop
        />
      </div>
    </section>
  );
}
