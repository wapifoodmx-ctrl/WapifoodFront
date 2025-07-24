import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { IoClose } from "react-icons/io5";
import Populares from './populares';
import IdPedidos from './idpedidos';
import MainStats from './mainStats';
import { LineChartFull } from './chart';
import { getADataGrafico } from '@/useCases/getDataGrafico';
import { getGraficaSemana } from '@/useCases/getGraficaSemana';
import { getGraficaMes } from '@/useCases/getGraficaMes';
import { getGraficaFechas } from '@/useCases/getGraficaFechas';
import BarChartBreakdown from './chartbar';
// Importaciones para el selector de fecha
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Ventas() {
  const [value, setValue] = React.useState('1');
  const [subTabValue, setSubTabValue] = React.useState('semana');
  
  // Estados para todas las secciones
  const [datosSemana, setDatosSemana] = React.useState([]);
  const [datosMes, setDatosMes] = React.useState([]);
  const [datosFechas, setDatosFechas] = React.useState([]);
  const [datosTodo, setDatosTodo] = React.useState([]);
  
  // Estados de loading
  const [loadingSemana, setLoadingSemana] = React.useState(false);
  const [loadingMes, setLoadingMes] = React.useState(false);
  const [loadingFechas, setLoadingFechas] = React.useState(false);
  const [loadingTodo, setLoadingTodo] = React.useState(false);
  
  // Estados de error
  const [errorSemana, setErrorSemana] = React.useState(null);
  const [errorMes, setErrorMes] = React.useState(null);
  const [errorFechas, setErrorFechas] = React.useState(null);
  const [errorTodo, setErrorTodo] = React.useState(null);
  
  // Estados para el modal de selección de fecha
  const [showDatePickerModal, setShowDatePickerModal] = React.useState(false);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTabValue(newValue);
    
    // Si se selecciona "Entre fechas", abrir el modal
    if (newValue === "Entre fechas") {
      setShowDatePickerModal(true);
    }
  };

  // Función para formatear fecha a YYYY-MM-DD
  const formatDateToAPI = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };

  // Función para formatear fecha para mostrar
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para transformar datos de semana
  const procesarDatosSemana = (datosAPI) => {
    if (!Array.isArray(datosAPI) || datosAPI.length === 0) {
      return [];
    }

    // Agrupar por semana
    const ventasPorSemana = {};
    
    datosAPI.forEach(venta => {
      const fecha = new Date(venta.date);
      const year = fecha.getFullYear();
      const semana = getWeekNumber(fecha);
      const claveSeamana = `${year}-W${semana.toString().padStart(2, '0')}`;
      
      if (!ventasPorSemana[claveSeamana]) {
        ventasPorSemana[claveSeamana] = 0;
      }
      ventasPorSemana[claveSeamana] += parseFloat(venta.value || 0);
    });

    // Convertir a array y formatear
    return Object.entries(ventasPorSemana).map(([semana, total]) => {
      const weekNumber = semana.split('-W')[1];
      const year = semana.split('-W')[0];
      
      return {
        date: `Semana ${weekNumber}, ${year}`,
        value: total
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Función para obtener número de semana
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Función para transformar datos de mes
  const procesarDatosMes = (datosAPI) => {
    if (!Array.isArray(datosAPI) || datosAPI.length === 0) {
      return [];
    }

    // Agrupar por mes
    const ventasPorMes = {};
    
    datosAPI.forEach(venta => {
      const fecha = new Date(venta.date);
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1; // getMonth() devuelve 0-11
      const claveMes = `${year}-${month.toString().padStart(2, '0')}`;
      
      if (!ventasPorMes[claveMes]) {
        ventasPorMes[claveMes] = 0;
      }
      ventasPorMes[claveMes] += parseFloat(venta.value || 0);
    });

    // Convertir a array y formatear
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return Object.entries(ventasPorMes).map(([mes, total]) => {
      const [year, month] = mes.split('-');
      
      return {
        date: `${monthNames[parseInt(month) - 1]} ${year}`,
        value: total
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Función para transformar datos de fechas personalizadas
  const procesarDatosFechas = (datosAPI) => {
    if (!Array.isArray(datosAPI) || datosAPI.length === 0) {
      return [];
    }

    // Agrupar por día
    const ventasPorDia = {};
    
    datosAPI.forEach(venta => {
      const fecha = venta.date.split('T')[0]; // Obtener solo la fecha (YYYY-MM-DD)
      
      if (!ventasPorDia[fecha]) {
        ventasPorDia[fecha] = 0;
      }
      ventasPorDia[fecha] += parseFloat(venta.value || 0);
    });

    // Convertir a array y formatear
    return Object.entries(ventasPorDia).map(([fecha, total]) => ({
      date: fecha,
      value: total
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Función para transformar datos de "Todo"
  const transformarDatosAPI = (datosAPI) => {
    if (!Array.isArray(datosAPI) || datosAPI.length === 0) {
      return [];
    }

    // Agrupar por día
    const ventasPorDia = {};
    
    datosAPI.forEach(venta => {
      const fecha = venta.date.split('T')[0]; // Obtener solo la fecha (YYYY-MM-DD)
      
      if (!ventasPorDia[fecha]) {
        ventasPorDia[fecha] = 0;
      }
      ventasPorDia[fecha] += parseFloat(venta.value || 0);
    });

    // Convertir a array y formatear
    return Object.entries(ventasPorDia).map(([fecha, total]) => ({
      date: fecha,
      value: total
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Cargar datos de ventas por semana
  React.useEffect(() => {
    if (subTabValue === 'semana') {
      const cargarDatosSemana = async () => {
        try {
          setLoadingSemana(true);
          setErrorSemana(null);

          const resultado = await getGraficaSemana();

          if (resultado.success) {
            const datosTransformados = procesarDatosSemana(resultado.data);
            setDatosSemana(datosTransformados);
            console.log('Datos de ventas por semana cargados:', datosTransformados);
          } else {
            console.log('Error al cargar datos de semana:', resultado.error);
            setErrorSemana(resultado.error);
            setDatosSemana([]);
          }
        } catch (error) {
          console.error('Error inesperado al cargar datos de semana:', error);
          setErrorSemana('Error inesperado al cargar los datos');
          setDatosSemana([]);
        } finally {
          setLoadingSemana(false);
        }
      };

      cargarDatosSemana();
    }
  }, [subTabValue]);

  // Cargar datos de ventas por mes
  React.useEffect(() => {
    if (subTabValue === 'mes') {
      const cargarDatosMes = async () => {
        try {
          setLoadingMes(true);
          setErrorMes(null);

          const resultado = await getGraficaMes();

          if (resultado.success) {
            const datosTransformados = procesarDatosMes(resultado.data);
            setDatosMes(datosTransformados);
            console.log('Datos de ventas por mes cargados:', datosTransformados);
          } else {
            console.log('Error al cargar datos de mes:', resultado.error);
            setErrorMes(resultado.error);
            setDatosMes([]);
          }
        } catch (error) {
          console.error('Error inesperado al cargar datos de mes:', error);
          setErrorMes('Error inesperado al cargar los datos');
          setDatosMes([]);
        } finally {
          setLoadingMes(false);
        }
      };

      cargarDatosMes();
    }
  }, [subTabValue]);

  // Cargar datos por fechas personalizadas
  React.useEffect(() => {
    if (subTabValue === 'Entre fechas' && startDate && endDate) {
      const cargarDatosFechas = async () => {
        try {
          setLoadingFechas(true);
          setErrorFechas(null);

          const fechaInicio = formatDateToAPI(startDate);
          const fechaFin = formatDateToAPI(endDate);

          const resultado = await getGraficaFechas(fechaInicio, fechaFin);

          if (resultado.success) {
            const datosTransformados = procesarDatosFechas(resultado.data);
            setDatosFechas(datosTransformados);
            console.log('Datos de ventas por fechas cargados:', datosTransformados);
          } else {
            console.log('Error al cargar datos de fechas:', resultado.error);
            setErrorFechas(resultado.error);
            setDatosFechas([]);
          }
        } catch (error) {
          console.error('Error inesperado al cargar datos de fechas:', error);
          setErrorFechas('Error inesperado al cargar los datos');
          setDatosFechas([]);
        } finally {
          setLoadingFechas(false);
        }
      };

      cargarDatosFechas();
    }
  }, [subTabValue, startDate, endDate]);

  // Cargar datos de "Todo"
  React.useEffect(() => {
    if (subTabValue === 'Todo') {
      const cargarDatosTodo = async () => {
        try {
          setLoadingTodo(true);
          setErrorTodo(null);

          const resultado = await getADataGrafico();

          if (resultado.success) {
            const datosTransformados = transformarDatosAPI(resultado.data);
            setDatosTodo(datosTransformados);
            console.log('Datos de ventas totales cargados:', datosTransformados);
          } else {
            console.log('Error al cargar datos totales:', resultado.error);
            setErrorTodo(resultado.error);
            setDatosTodo([]);
          }
        } catch (error) {
          console.error('Error inesperado al cargar datos totales:', error);
          setErrorTodo('Error inesperado al cargar los datos');
          setDatosTodo([]);
        } finally {
          setLoadingTodo(false);
        }
      };

      cargarDatosTodo();
    }
  }, [subTabValue]);

  // Función para aplicar el filtro de fechas
  const handleApplyDateFilter = async () => {
    setShowDatePickerModal(false);
    // El useEffect ya se ejecutará cuando cambien startDate y endDate
  };

  return (
    <div>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Populares" value="1" />
              <Tab label="Ventas" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Populares />
            <div className='mt-4'> 
              <BarChartBreakdown />
            </div>
          </TabPanel>
          <TabPanel value="2">
            {/* MainStats debe ir aquí, fuera de las sub-pestañas */}
            <MainStats />
            
            {/* Sub-pestañas para Ventas */}
            <Box sx={{ width: '100%', typography: 'body1', mt: 3 }}>
              <TabContext value={subTabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <TabList onChange={handleSubTabChange} aria-label="ventas tabs">
                    <Tab label="Semana" value="semana" />
                    <Tab label="Mes" value="mes" />
                    <Tab label="Entre fechas" value="Entre fechas" />
                    <Tab label="Todo" value="Todo" />
                  </TabList>
                </Box>
                
                <TabPanel value="semana" sx={{ p: 0 }}>
                  <div className="space-y-6">
                    {/* Estado de carga para datos de semana */}
                    {loadingSemana && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">Cargando datos de ventas semanales...</div>
                      </div>
                    )}

                    {/* Error específico para datos de semana */}
                    {errorSemana && !loadingSemana && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">
                          <p className="font-semibold">📊 No hay datos de ventas semanales</p>
                          <p className="text-sm mt-2">No se pudieron cargar los datos de ventas por semana.</p>
                          <p className="text-xs mt-1 text-gray-400">Error: {errorSemana}</p>
                        </div>
                      </div>
                    )}

                    {/* Gráfico de ventas por semana */}
                    {!loadingSemana && !errorSemana && datosSemana.length > 0 && (
                      <LineChartFull
                        data={datosSemana}
                        title="Ventas por Semana"
                      />
                    )}

                    {/* Mensaje cuando no hay datos de semana */}
                    {!loadingSemana && !errorSemana && datosSemana.length === 0 && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">
                          <p className="font-semibold">📊 No hay ventas registradas por semana</p>
                          <p className="text-sm mt-2">Conforme comiences a tener ventas, esta vista se irá actualizando automáticamente.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabPanel>

                <TabPanel value="mes" sx={{ p: 0 }}>
                  <div className="space-y-6">
                    {/* Estado de carga para datos de mes */}
                    {loadingMes && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">Cargando datos de ventas mensuales...</div>
                      </div>
                    )}

                    {/* Error específico para datos de mes */}
                    {errorMes && !loadingMes && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">
                          <p className="font-semibold">📊 No hay datos de ventas mensuales</p>
                          <p className="text-sm mt-2">No se pudieron cargar los datos de ventas por mes.</p>
                          <p className="text-xs mt-1 text-gray-400">Error: {errorMes}</p>
                        </div>
                      </div>
                    )}

                    {/* Gráfico de ventas por mes */}
                    {!loadingMes && !errorMes && datosMes.length > 0 && (
                      <LineChartFull
                        data={datosMes}
                        title="Ventas por Mes"
                      />
                    )}

                    {/* Mensaje cuando no hay datos de mes */}
                    {!loadingMes && !errorMes && datosMes.length === 0 && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">
                          <p className="font-semibold">📊 No hay ventas registradas por mes</p>
                          <p className="text-sm mt-2">Conforme comiences a tener ventas, esta vista se irá actualizando automáticamente.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabPanel>

                <TabPanel value="Entre fechas" sx={{ p: 0 }}>
                  <div className="space-y-6">
                    {/* Mostrar información del rango seleccionado */}
                    {startDate && endDate && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-800 font-semibold">
                          Rango seleccionado: {formatDate(startDate)} - {formatDate(endDate)}
                        </p>
                        <button
                          onClick={() => setShowDatePickerModal(true)}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Cambiar fechas
                        </button>
                      </div>
                    )}

                    {/* Estado de carga para datos de fechas */}
                    {loadingFechas && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">Cargando datos de ventas por fechas...</div>
                      </div>
                    )}

                    {/* Error específico para datos de fechas */}
                    {errorFechas && !loadingFechas && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">
                          <p className="font-semibold">📊 No hay datos de ventas para las fechas seleccionadas</p>
                          <p className="text-sm mt-2">No se pudieron cargar los datos de ventas para el rango especificado.</p>
                          <p className="text-xs mt-1 text-gray-400">Error: {errorFechas}</p>
                        </div>
                      </div>
                    )}

                    {/* Gráfico de ventas por fechas */}
                    {!loadingFechas && !errorFechas && datosFechas.length > 0 && (
                      <LineChartFull
                        data={datosFechas}
                        title="Ventas por Rango de Fechas"
                      />
                    )}

                    {/* Mensaje cuando no hay fechas seleccionadas o no hay datos */}
                    {(!startDate || !endDate) && !loadingFechas && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">
                          <p className="font-semibold">📅 Selecciona un rango de fechas</p>
                          <p className="text-sm mt-2">Haz clic en el botón de arriba para seleccionar las fechas que deseas consultar.</p>
                          <button
                            onClick={() => setShowDatePickerModal(true)}
                            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            Seleccionar fechas
                          </button>
                        </div>
                      </div>
                    )}

                    {!loadingFechas && !errorFechas && startDate && endDate && datosFechas.length === 0 && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">
                          <p className="font-semibold">📊 No hay ventas en el rango seleccionado</p>
                          <p className="text-sm mt-2">No se encontraron ventas para las fechas especificadas.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabPanel>

                <TabPanel value="Todo" sx={{ p: 0 }}>
                  <div className="space-y-6">
                    {/* Estado de carga para datos totales */}
                    {loadingTodo && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">Cargando todos los datos de ventas...</div>
                      </div>
                    )}

                    {/* Error específico para datos totales */}
                    {errorTodo && !loadingTodo && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">
                          <p className="font-semibold">📊 No hay datos de ventas totales</p>
                          <p className="text-sm mt-2">No se pudieron cargar todos los datos de ventas.</p>
                          <p className="text-xs mt-1 text-gray-400">Error: {errorTodo}</p>
                        </div>
                      </div>
                    )}

                    {/* Gráfico de todas las ventas */}
                    {!loadingTodo && !errorTodo && datosTodo.length > 0 && (
                      <LineChartFull
                        data={datosTodo}
                        title="Todas las Ventas"
                      />
                    )}

                    {/* Mensaje cuando no hay datos totales */}
                    {!loadingTodo && !errorTodo && datosTodo.length === 0 && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">
                          <p className="font-semibold">📊 No hay ventas registradas</p>
                          <p className="text-sm mt-2">Conforme comiences a tener ventas, esta vista se irá actualizando automáticamente.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabPanel>
                
              </TabContext>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>

      {/* Modal para selector de fechas */}
      {showDatePickerModal && (
        <div
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[10000]"
          onClick={() => setShowDatePickerModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowDatePickerModal(false)}
            >
              <IoClose />
            </button>

            {/* Título */}
            <h2 className="text-xl font-bold mb-6 text-center">
              Seleccionar Rango de Fechas
            </h2>

            {/* Selector de fechas */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de inicio
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Selecciona fecha de inicio"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de fin
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="Selecciona fecha de fin"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>

            {/* Información del rango seleccionado */}
            {startDate && endDate && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Rango seleccionado:</strong><br />
                  Desde: {formatDate(startDate)}<br />
                  Hasta: {formatDate(endDate)}
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDatePickerModal(false);
                  setSubTabValue("semana"); // Cambiar a otra pestaña al cancelar
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyDateFilter}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={!startDate || !endDate}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}