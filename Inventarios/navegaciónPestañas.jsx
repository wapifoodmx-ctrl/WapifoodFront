import React, { useState } from 'react';
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

const NavegacionPestañas = ({ pestañaActiva, cambiarPestaña, insumos = [], isLoadingData = false, vistaActiva = 'cards' }) => {
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [insumoExpandido, setInsumoExpandido] = useState(null);

  const toggleSeleccionInsumo = (insumoId) => {
    setInsumosSeleccionados(prev => 
      prev.includes(insumoId) 
        ? prev.filter(id => id !== insumoId)
        : [...prev, insumoId]
    );
  };

  const toggleExpandirInsumo = (insumoId) => {
    setInsumoExpandido(prev => prev === insumoId ? null : insumoId);
  };

  const renderVistaCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {insumos.map((insumo) => (
        <div
          key={insumo.id}
          className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
            insumosSeleccionados.includes(insumo.id)
              ? 'border-green-500 bg-green-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
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
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              ID: {insumo.id}
            </span>
          </div>

          {/* Información del insumo */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 text-lg leading-tight line-clamp-2">
              {insumo.name}
            </h3>
            
            {/* Stock y Costo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span className={`font-medium text-sm px-2 py-1 rounded ${
                    insumo.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {insumo.stock} {insumo.unit}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Costo unitario:</span>
                <span className="font-medium text-gray-800">
                  ${insumo.cost}
                </span>
              </div>
              
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm text-gray-600 font-medium">Valor total:</span>
                <span className="font-semibold text-green-600">
                  ${(insumo.cost * insumo.stock).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Descripción */}
            {insumo.description && (
              <div className="bg-gray-50 p-2 rounded text-sm text-gray-600">
                <span className="font-medium">Descripción: </span>
                <span className="line-clamp-2">{insumo.description}</span>
              </div>
            )}
          </div>

          {/* Indicador de selección */}
          {insumosSeleccionados.includes(insumo.id) && (
            <div className="mt-3 flex items-center text-green-600 bg-green-100 p-2 rounded">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">Seleccionado</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderVistaLista = () => (
    <div className="space-y-3">
      {/* Header de la tabla - Solo en desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-gray-700 text-sm">
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            checked={insumosSeleccionados.length === insumos.length && insumos.length > 0}
            onChange={() => {
              if (insumosSeleccionados.length === insumos.length) {
                setInsumosSeleccionados([]);
              } else {
                setInsumosSeleccionados(insumos.map(i => i.id));
              }
            }}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
        </div>
        <div className="col-span-4">Nombre</div>
        <div className="col-span-2 text-center">Stock</div>
        <div className="col-span-2 text-center">Costo Unitario</div>
        <div className="col-span-2 text-center">Valor Total</div>
        <div className="col-span-1 text-center">Detalles</div>
      </div>

      {/* Lista de insumos */}
      <div className="space-y-2">
        {insumos.map((insumo) => (
          <div key={insumo.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Fila principal - Responsive */}
            <div 
              className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                insumosSeleccionados.includes(insumo.id) ? 'bg-green-50 border-green-200' : ''
              }`}
              onClick={() => toggleExpandirInsumo(insumo.id)}
            >
              {/* Vista Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4">
                {/* Checkbox */}
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={insumosSeleccionados.includes(insumo.id)}
                    onChange={() => toggleSeleccionInsumo(insumo.id)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Nombre */}
                <div className="col-span-4 flex items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 line-clamp-1">{insumo.name}</h3>
                    <span className="text-xs text-gray-400">ID: {insumo.id}</span>
                  </div>
                </div>

                {/* Stock */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className={`text-sm px-2 py-1 rounded font-medium ${
                    insumo.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {insumo.stock} {insumo.unit}
                  </span>
                </div>

                {/* Costo Unitario */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className="font-medium text-gray-800">${insumo.cost}</span>
                </div>

                {/* Valor Total */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className="font-semibold text-green-600">
                    ${(insumo.cost * insumo.stock).toFixed(2)}
                  </span>
                </div>

                {/* Botón detalles */}
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpandirInsumo(insumo.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title={insumoExpandido === insumo.id ? 'Ocultar detalles' : 'Ver detalles'}
                  >
                    {insumoExpandido === insumo.id ? (
                      <IoChevronUpOutline className="text-gray-600" />
                    ) : (
                      <IoChevronDownOutline className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Vista Mobile */}
              <div className="md:hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={insumosSeleccionados.includes(insumo.id)}
                      onChange={() => toggleSeleccionInsumo(insumo.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    {/* Nombre y Stock */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm truncate">{insumo.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">Stock:</span>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          insumo.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {insumo.stock} {insumo.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón dropdown */}
                  <button
                    className="p-2 hover:bg-gray-200 rounded transition-colors ml-2"
                    title={insumoExpandido === insumo.id ? 'Ocultar detalles' : 'Ver detalles'}
                  >
                    {insumoExpandido === insumo.id ? (
                      <IoChevronUpOutline className="text-gray-600 h-5 w-5" />
                    ) : (
                      <IoChevronDownOutline className="text-gray-600 h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Detalles expandibles */}
            {insumoExpandido === insumo.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Información General</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-medium">{insumo.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nombre:</span>
                        <span className="font-medium">{insumo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unidad:</span>
                        <span className="font-medium">{insumo.unit}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Valores</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock actual:</span>
                        <span className="font-medium">{insumo.stock} {insumo.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Costo unitario:</span>
                        <span className="font-medium">${insumo.cost}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-gray-600 font-medium">Valor total:</span>
                        <span className="font-semibold text-green-600">
                          ${(insumo.cost * insumo.stock).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {insumo.description && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Descripción</h4>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                      {insumo.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

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
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
                Gestión de Insumos
              </h2>
              {insumos.length > 0 && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Vista: <span className="font-medium">{vistaActiva === 'cards' ? 'Tarjetas' : 'Lista'}</span></span>
                  <span>Total: <span className="font-medium text-green-600">{insumos.length}</span></span>
                </div>
              )}
            </div>
            
            {/* Estado de carga */}
            {isLoadingData ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">Cargando insumos...</p>
              </div>
            ) : insumos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No hay insumos en el inventario</p>
                <p className="text-gray-400 text-sm mt-2">Utiliza el botón "Agregar insumo" para comenzar</p>
              </div>
            ) : (
              <div>
                {/* Header con información - Solo para vista de cards */}
                {vistaActiva === 'cards' && (
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">
                        Total de insumos: <span className="text-green-600 font-semibold">{insumos.length}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        Valor total: $
                        {insumos.reduce((total, insumo) => total + (insumo.cost * insumo.stock), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Renderizar según la vista activa */}
                {vistaActiva === 'cards' ? renderVistaCards() : renderVistaLista()}
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