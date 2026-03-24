import React, { useState } from 'react';
import RecipeCard from './RecipeCard';
import { FiEdit } from "react-icons/fi";

const RecetasExtras = ({
  recetas,
  recetasFiltradas,
  isLoadingRecetas,
  searchTerm,
  setSearchTerm,
  selectedRecipeId,
  onSelectRecipe,
  onTabChange,
  onOpenExtrasModal,
  todosLosExtras,
}) => {
  const [activeTab, setActiveTab] = useState('recetas');

  // Notificar al padre cuando cambie el tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Función para obtener los extras de una receta específica
  const getExtrasForRecipe = (recipeId) => {
    if (!todosLosExtras || todosLosExtras.length === 0) return [];
    return todosLosExtras.filter(extra => extra.recipe_id === recipeId);
  };

  // Función para obtener la cantidad de extras de una receta
  const getExtrasCount = (recipeId) => {
    return getExtrasForRecipe(recipeId).length;
  };

  // Función para verificar si una receta tiene extras
  const hasExtras = (recipeId) => {
    return getExtrasCount(recipeId) > 0;
  };

  // Filtrar recetas para la pestaña de extras según búsqueda
  const recetasFiltradasExtras = recetas?.filter(receta =>
    receta.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const countRecetas = recetasFiltradas?.length || 0;
  const countExtras = recetasFiltradasExtras?.length || 0;

  return (
    <div className="w-full">
      <div className="border-b border-gray-200 px-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            { key: 'recetas', label: 'Recetas', count: countRecetas },
            { key: 'extras', label: 'Extras', count: countExtras }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 py-1 px-2 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 bg-white pb-20">
        {isLoadingRecetas ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-4 text-lg text-gray-600">Cargando recetas...</span>
          </div>
        ) : (
          <>
            {activeTab === 'recetas' ? (
              <>
                {countRecetas > 0 && (
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 capitalize">
                      Recetas {searchTerm && `- "${searchTerm}"`}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {countRecetas} receta{countRecetas !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {recetasFiltradas && recetasFiltradas.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {recetasFiltradas.map((receta) => (
                      <RecipeCard
                        key={receta.id_recipe}
                        receta={receta}
                        isSelected={selectedRecipeId === receta.id_recipe}
                        onSelect={onSelectRecipe}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-gray-500 text-lg">
                      {searchTerm ? (
                        <>
                          <p className="mb-2">No se encontraron recetas con "{searchTerm}"</p>
                          <button
                            onClick={() => setSearchTerm("")}
                            className="text-green-500 hover:text-green-600 font-medium"
                          >
                            Limpiar búsqueda
                          </button>
                        </>
                      ) : (
                        <p>No hay recetas disponibles</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {countExtras > 0 && (
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 capitalize">
                      Extras {searchTerm && `- "${searchTerm}"`}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {countExtras} receta{countExtras !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {recetasFiltradasExtras && recetasFiltradasExtras.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {recetasFiltradasExtras.map((r) => {
                      const extrasCount = getExtrasCount(r.id_recipe);
                      const tieneExtras = hasExtras(r.id_recipe);
                      const extrasDeReceta = getExtrasForRecipe(r.id_recipe);

                      return (
                        <div
                          key={r.id_recipe}
                          onClick={tieneExtras ? undefined : () => onOpenExtrasModal && onOpenExtrasModal(r)}
                          className={`border-2 rounded-lg p-4 transition-all duration-200 bg-white relative ${
                            tieneExtras
                              ? 'border-green-500 bg-green-50/50'
                              : 'border-gray-200 hover:shadow-lg hover:border-green-500 cursor-pointer transform hover:scale-105 active:scale-95'
                          }`}
                        >
                          {/* Header con título y botón de editar */}
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-800 text-base sm:text-lg leading-tight flex-1 pr-2">
                              {r.name}
                            </h3>
                            {tieneExtras && (
                              <button
                                onClick={() => onOpenExtrasModal && onOpenExtrasModal(r)}
                                className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex-shrink-0"
                                title="Editar extras"
                              >
                                <FiEdit className="text-base sm:text-lg" />
                              </button>
                            )}
                          </div>

                          {/* Contador de extras - esquina inferior izquierda minimalista */}
                          {tieneExtras && (
                            <span className="absolute bottom-2 left-2 text-xs font-semibold text-green-600">
                              {extrasCount} {extrasCount === 1 ? 'Extra' : 'Extras'}
                            </span>
                          )}

                          {/* Mensaje para cards sin extras */}
                          {!tieneExtras && (
                            <p className="text-xs sm:text-sm text-gray-500 text-center mt-4">
                              Click para agregar extras
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-gray-500 text-lg">
                      {searchTerm ? (
                        <>
                          <p className="mb-2">No se encontraron recetas con "{searchTerm}"</p>
                          <button
                            onClick={() => setSearchTerm("")}
                            className="text-green-500 hover:text-green-600 font-medium"
                          >
                            Limpiar búsqueda
                          </button>
                        </>
                      ) : (
                        <p>No hay recetas para mostrar como extras</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecetasExtras;
