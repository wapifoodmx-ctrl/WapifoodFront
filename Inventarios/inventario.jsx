import { LiaFilterSolid } from "react-icons/lia";
import { IoAddOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Navbar from "@/dashboardComponents/navbar";
import { useState } from "react";

export default function Inventario() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombreProducto: "",
    cantidad: "",
    costo: "",
    comentarios: "",
    categoriaAdicional: "No"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el producto
    console.log("Producto a guardar:", formData);
    // Cerrar modal y resetear formulario
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
              placeholder="Buscar producto..."
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
                <span className="hidden sm:inline">Agregar producto</span>
                <span className="sm:hidden">Añadir</span>
              </button>
              
              {/* Botón Modificar */}
              <button className="flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 lg:text-base">
                <FiEdit className="text-lg" />
                <span className="hidden sm:inline">Modificar producto</span>
                <span className="sm:hidden">Modificar</span>
              </button>
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
              <h2 className="text-xl font-bold text-gray-800">Agregar Producto</h2>
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
                  Agregar Producto
                </label>
                <input
                  type="text"
                  name="nombreProducto"
                  value={formData.nombreProducto}
                  onChange={handleInputChange}
                  placeholder="Nombre del producto"
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
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}