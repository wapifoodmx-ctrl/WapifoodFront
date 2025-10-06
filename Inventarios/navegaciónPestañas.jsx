import React, { useState } from 'react';

const NavegacionPestañas = ({ pestañaActiva, cambiarPestaña, insumos = [] }) => {
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);

  const toggleSeleccionInsumo = (insumoId) => {
    setInsumosSeleccionados(prev => 
      prev.includes(insumoId) 
        ? prev.filter(id => id !== insumoId)
        : [...prev, insumoId]
    );
  };

  return (
    <div>
      {/* Navegación de pestañas */}
      <div className="flex bg-gray-50 border-b border-gray-200 md:justify-start">
        <button
          className={`flex-1 md:flex-none md:px-8 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
            pestañaActiva === 'insumos'
              ? 'text-green-600 border-green-600 bg-white'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => cambiarPestaña('insumos')}
        >
          Insumos
        </button>
        <button
          className={`flex-1 md:flex-none md:px-8 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
            pestañaActiva === 'productos'
              ? 'text-green-600 border-green-600 bg-white'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => cambiarPestaña('productos')}
        >
          Productos
        </button>
        <button
          className={`flex-1 md:flex-none md:px-8 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
            pestañaActiva === 'otros'
              ? 'text-green-600 border-green-600 bg-white'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => cambiarPestaña('otros')}
        >
          Otros
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="p-6 bg-white min-h-96">
        {pestañaActiva === 'insumos' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Gestión de Insumos
            </h2>
            
            {insumos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No hay insumos agregados</p>
                <p className="text-gray-400 text-sm mt-2">Utiliza el botón "Agregar insumo" para comenzar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insumos.map((insumo) => (
                  <div
                    key={insumo.id}
                    className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                      insumosSeleccionados.includes(insumo.id)
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => toggleSeleccionInsumo(insumo.id)}
                  >
                    {/* Checkbox de selección */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={insumosSeleccionados.includes(insumo.id)}
                          onChange={() => toggleSeleccionInsumo(insumo.id)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="ml-2 text-xs text-gray-500">Seleccionar</span>
                      </div>
                      <span className="text-xs text-gray-400">#{insumo.id}</span>
                    </div>

                    {/* Información del insumo */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                        {insumo.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Stock:</span>
                          <span className="font-medium text-green-600">
                            {insumo.stock} {insumo.unit}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-600">Costo:</span>
                          <span className="font-medium text-gray-800 ml-1">
                            ${insumo.cost}
                          </span>
                        </div>
                      </div>

                      {insumo.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {insumo.description}
                        </p>
                      )}
                    </div>

                    {/* Indicador de selección */}
                    {insumosSeleccionados.includes(insumo.id) && (
                      <div className="mt-3 flex items-center text-green-600">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium">Seleccionado</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Acciones para elementos seleccionados */}
            {insumosSeleccionados.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">
                    {insumosSeleccionados.length} insumo(s) seleccionado(s)
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => setInsumosSeleccionados([])}
                      className="px-3 py-1 text-sm text-green-700 hover:text-green-900 transition-colors"
                    >
                      Deseleccionar todo
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                      Acciones
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {pestañaActiva === 'productos' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Gestión de Productos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Aquí va el contenido de los productos...
            </p>
          </div>
        )}

        {pestañaActiva === 'otros' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Otros Elementos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Aquí va el contenido de otros elementos...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavegacionPestañas;