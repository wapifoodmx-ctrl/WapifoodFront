import { IoAddOutline, IoClose } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/dashboardComponents/navbar";

export default function Recipes() {
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [isSelectSuppliesModalOpen, setIsSelectSuppliesModalOpen] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [plateQuantity, setPlateQuantity] = useState("");
  const [totalCost, setTotalCost] = useState("");
  
  const router = useRouter();

  const handleSaveRecipe = () => {
    // Lógica para guardar la receta
    console.log({
      name: recipeName,
      quantity: plateQuantity,
      cost: totalCost
    });
    // Cerrar modal y limpiar campos
    setIsAddRecipeModalOpen(false);
    setRecipeName("");
    setPlateQuantity("");
    setTotalCost("");
  };

  const handleSelectSupplies = () => {
    setIsSelectSuppliesModalOpen(true);
  };

  const handleRedirectToInventory = () => {
    router.push('/inventarios');
  };

  const handleBackdropClick = (e, closeFunction) => {
    if (e.target === e.currentTarget) {
      closeFunction();
    }
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
              placeholder="Buscar receta..."
              className="border border-gray-300 rounded-lg p-3 w-full lg:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:w-1/2 lg:justify-center lg:items-center">
              {/* Botón Añadir */}
              <button 
                onClick={() => setIsAddRecipeModalOpen(true)}
                className="flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 bg-white border-2 border-green-500 text-green-600 hover:bg-orange-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 lg:text-base"
              >
                <IoAddOutline className="text-lg" />
                <span>Agregar Receta</span>
              </button>
              
              {/* Botón Modificar */}
              <button className="flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 lg:text-base">
                <FiEdit className="text-lg" />
                <span>Modificar Receta</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Agregar Receta */}
      {isAddRecipeModalOpen && (
        <div 
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
          onClick={(e) => handleBackdropClick(e, () => setIsAddRecipeModalOpen(false))}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Agregar Nueva Receta</h2>
              <button
                onClick={() => setIsAddRecipeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Nombre de la receta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la receta
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="Ingresa el nombre de la receta..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>

              {/* Botones de selección */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleSelectSupplies}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                >
                  Seleccionar Insumos
                </button>
                <button className="flex-1 px-4 py-3 border-green-500 hover:border-green-600  rounded-lg font-bold transition-colors border-2 text-green-500 hover:text-green-600">
                  Crear Receta
                </button>
              </div>

              {/* Cantidad de platillos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad de platillos
                </label>
                <input
                  type="number"
                  value={plateQuantity}
                  onChange={(e) => setPlateQuantity(e.target.value)}
                  placeholder="Número de platillos que se pueden hacer..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>

              {/* Costo total */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo total del platillo
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  placeholder="Costo total en pesos..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleSaveRecipe}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Guardar Receta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Seleccionar Insumos */}
      {isSelectSuppliesModalOpen && (
        <div 
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-60 p-4"
          onClick={(e) => handleBackdropClick(e, () => setIsSelectSuppliesModalOpen(false))}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Seleccionar Insumos</h2>
              <button
                onClick={() => setIsSelectSuppliesModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {/* Barra de búsqueda con botón agregar */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Buscar insumo..."
                  className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
                <button
                  onClick={handleRedirectToInventory}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xl transition-colors flex items-center justify-center min-w-[50px]"
                >
                  +
                </button>
              </div>

              {/* Aquí irá la lista de insumos */}
              <div className="text-center text-gray-500 py-12">
                <p>Los insumos aparecerán aquí</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}