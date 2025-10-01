import { LiaFilterSolid } from "react-icons/lia";
import { IoAddOutline, IoClose } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import Navbar from "@/dashboardComponents/navbar";
import NavegacionPestañas from "@/Inventarios/navegaciónPestañas";
import { useState } from "react";

export default function Inventario() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [pestañaActiva, setPestañaActiva] = useState('insumos');
  const [formData, setFormData] = useState({
    nombreProducto: "",
    cantidad: "",
    costo: "",
    comentarios: "",
    categoriaAdicional: "No"
  });

  // Función para obtener el texto según la pestaña activa
  const obtenerTextosPorPestaña = (pestaña) => {
    const textos = {
      insumos: {
        buscar: "Buscar insumo...",
        agregar: "Agregar insumo",
        modificar: "Modificar insumo",
        titulo: "Agregar Insumo",
        label: "Agregar Insumo"
      },
      productos: {
        buscar: "Buscar producto...",
        agregar: "Agregar producto",
        modificar: "Modificar producto",
        titulo: "Agregar Producto",
        label: "Agregar Producto"
      },
      otros: {
        buscar: "Buscar otros...",
        agregar: "Agregar otros",
        modificar: "Modificar otros",
        titulo: "Agregar Otros",
        label: "Agregar Otros"
      }
    };
    return textos[pestaña] || textos.insumos;
  };

  const textos = obtenerTextosPorPestaña(pestañaActiva);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto a guardar:", formData);
    setIsAddProductModalOpen(false);
    setFormData({
      nombreProducto: "",
      cantidad: "",
      costo: "",
      comentarios: "",
      categoriaAdicional: "No"
    });
  };

  return (
    <section>
      <Navbar />
      <div className="pt-20">
        {/* Barra de búsqueda y botones */}
        <div className="px-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            {/* Barra de búsqueda */}
            <input
              type="text"
              placeholder={textos.buscar}
              className="border border-gray-300 rounded-lg p-3 w-full lg:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:w-1/2 lg:justify-center lg:items-center">
              {/* Botón Añadir */}
              <button 
                onClick={() => setIsAddProductModalOpen(true)}
                className="flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 bg-white border-2 border-green-500 text-green-600 hover:bg-orange-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 lg:text-base"
              >
                <IoAddOutline className="text-lg" />
                <span >{textos.agregar}</span>
              </button>
              
              {/* Botón Modificar */}
              <button className="flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 lg:text-base">
                <FiEdit className="text-lg" />
                <span >{textos.modificar}</span>

              </button>
            </div>
          </div>
        </div>

        {/* Navegación de pestañas y contenido */}
        <div className="px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Solo la navegación */}
            <NavegacionPestañas 
              pestañaActiva={pestañaActiva} 
              cambiarPestaña={setPestañaActiva} 
            />
            
            {/* Aquí puedes agregar el contenido específico de cada pestaña */}
            <div className="p-6 bg-white min-h-96">
              {pestañaActiva === 'insumos' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Gestión de Insumos
                  </h2>
                  {/* Aquí va tu contenido de insumos */}
                </div>
              )}

              {pestañaActiva === 'productos' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Gestión de Productos
                  </h2>
                  {/* Aquí va tu contenido de productos */}
                </div>
              )}

              {pestañaActiva === 'otros' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Otros Elementos
                  </h2>
                  {/* Aquí va tu contenido de otros */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Agregar Producto */}
      {isAddProductModalOpen && (
        <div 
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
          onClick={() => setIsAddProductModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">{textos.titulo}</h2>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nombre del Producto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {textos.label}
                </label>
                <input
                  type="text"
                  name="nombreProducto"
                  value={formData.nombreProducto}
                  onChange={handleInputChange}
                  placeholder={`Nombre del ${pestañaActiva === 'otros' ? 'elemento' : pestañaActiva.slice(0, -1)}`}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad a Añadir
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  placeholder="Cantidad"
                  min="1"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Costo por pieza */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Costo por pieza
                </label>
                <input
                  type="number"
                  name="costo"
                  value={formData.costo}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Comentarios */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comentarios
                </label>
                <textarea
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleInputChange}
                  placeholder="Comentarios adicionales (opcional)"
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Categoría Adicional */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoría Adicional
                </label>
                <select
                  name="categoriaAdicional"
                  value={formData.categoriaAdicional}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="No">No</option>
                  <option value="Si">Sí</option>
                </select>
              </div>

              {/* Botón Guardar */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <IoAddOutline className="text-lg" />
                  Guardar {pestañaActiva === 'otros' ? 'Elemento' : pestañaActiva.charAt(0).toUpperCase() + pestañaActiva.slice(1, -1)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}