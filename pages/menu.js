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
  const [availabilityFilter, setAvailabilityFilter] = useState("todos"); // Estado para el filtro de disponibilidad
  const [loading, setLoading] = useState(true); // Estado para el loader

  // Función para obtener los productos
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data); // Actualizar los productos
    } catch (error) {
      console.error("Error al obtener los productos:", error.message);
      setProducts([]); // Si ocurre un error, simplemente deja los productos vacíos
    }
  };

  // Función para obtener las categorías
  const fetchCategories = async () => {
    try {
      const data = await getCategoria();
      setCategories(data); // Actualizar las categorías
    } catch (error) {
      console.error("Error al obtener las categorías:", error.message);
      setCategories([]); // Si ocurre un error, simplemente deja las categorías vacías
    }
  };

  // Obtener los datos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Activar el loader
      await fetchProducts();
      await fetchCategories();
      setLoading(false); // Desactivar el loader
    };

    fetchData();
  }, []);

  // Función para manejar la actualización global
  const handleRefresh = async () => {
    setLoading(true); // Activar el loader
    await fetchProducts(); // Actualizar los productos
    await fetchCategories(); // Actualizar las categorías
    setLoading(false); // Desactivar el loader
  };

  if (loading) {
    return <p className="text-gray-500">Cargando productos...</p>;
  }

  if (products.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center ">
        <Navbar />
        <div className="w-11/12 ">
          <MenuComponentes
            onSearch={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onRefresh={handleRefresh} // Pasar handleRefresh como prop
            categories={categories} // Pasar las categorías como prop
            onAvailabilityChange={setAvailabilityFilter} // Pasar el manejador del filtro de disponibilidad
          />
        </div>
        <p className="text-center text-gray-500 mt-4">
          Para comenzar, primero debes crear una categoría, después puedes comenzar a crear productos y ya podrás verlos en esta sección.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center ">
      <Navbar />
      <div className="w-11/12 ">
        <MenuComponentes
          onSearch={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onRefresh={handleRefresh} // Pasar handleRefresh como prop
          categories={categories} // Pasar las categorías como prop
          onAvailabilityChange={setAvailabilityFilter} // Pasar el manejador del filtro de disponibilidad
        />
      </div>

      <div className="w-full p-4 flex flex-wrap gap-4 justify-center items-center flex-col md:flex-row ">
        <Cards
          products={products} // Pasar los productos como prop
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories} // Pasar las categorías como prop
          onRefresh={handleRefresh} // Pasar handleRefresh como prop
          availabilityFilter={availabilityFilter} // Pasar el filtro de disponibilidad
        />
      </div>
    </section>
  );
}
