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

  // FUNCIÓN UNIFICADA para transformar datos - agrupar por fecha y sumar valores
  const transformarDatosAPI = (datosAPI) => {
    if (!Array.isArray(datosAPI) || datosAPI.length === 0) {
      return [];
    }

    // Crear un objeto para agrupar por fecha
    const datosPorFecha = {};

    datosAPI.forEach(item => {
      // Extraer solo la fecha (YYYY-MM-DD)
      const fecha = item.date.split('T')[0];
      
      // Si ya existe la fecha, sumar el valor; si no, crear nueva entrada
      if (datosPorFecha[fecha]) {
        datosPorFecha[fecha] += parseFloat(item.value || 0);
      } else {
        datosPorFecha[fecha] = parseFloat(item.value || 0);
      }
    });

    // Convertir el objeto agrupado a array y ordenar por fecha
    const resultado = Object.entries(datosPorFecha)
      .map(([fecha, valor]) => ({
        date: fecha,
        value: valor
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log('Datos transformados y agrupados:', resultado);
    return resultado;
  };


  // Funciones para cargar datos de cada sección
  const cargarDatosSemana = async () => {
    try {
      setLoadingSemana(true);
      setErrorSemana(null);

      console.log('Cargando datos de semana...');
      const resultado = await getGraficaSemana();
      console.log('Resultado de getGraficaSemana:', resultado);

      if (resultado.success) {
        console.log('Datos originales de semana:', resultado.data);
        const datosTransformados = transformarDatosAPI(resultado.data);
        console.log('Datos transformados de semana:', datosTransformados);
        setDatosSemana(datosTransformados);
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

  const cargarDatosMes = async () => {
    try {
      setLoadingMes(true);
      setErrorMes(null);

      console.log('Cargando datos de mes...');
      const resultado = await getGraficaMes();
      console.log('Resultado de getGraficaMes:', resultado);

      if (resultado.success) {
        console.log('Datos originales de mes:', resultado.data);
        const datosTransformados = transformarDatosAPI(resultado.data);
        console.log('Datos transformados de mes:', datosTransformados);
        setDatosMes(datosTransformados);
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

  const cargarDatosFechas = async () => {
    if (!startDate || !endDate) return;

    try {
      setLoadingFechas(true);
      setErrorFechas(null);

      const fechaInicio = formatDateToAPI(startDate);
      const fechaFin = formatDateToAPI(endDate);

      console.log('Cargando datos de fechas...', { fechaInicio, fechaFin });
      const resultado = await getGraficaFechas(fechaInicio, fechaFin);
      console.log('Resultado de getGraficaFechas:', resultado);

      if (resultado.success) {
        console.log('Datos originales de fechas:', resultado.data);
        const datosTransformados = transformarDatosAPI(resultado.data);
        console.log('Datos transformados de fechas:', datosTransformados);
        setDatosFechas(datosTransformados);
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

  const cargarDatosTodo = async () => {
    try {
      setLoadingTodo(true);
      setErrorTodo(null);

      console.log('Cargando datos de todo...');
      const resultado = await getADataGrafico();
      console.log('Resultado de getADataGrafico:', resultado);

      if (resultado.success) {
        console.log('Datos originales de todo:', resultado.data);
        const datosTransformados = transformarDatosAPI(resultado.data);
        console.log('Datos transformados de todo:', datosTransformados);
        setDatosTodo(datosTransformados);
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

  // Solo cargar datos de semana al inicio (pestaña por defecto)
  React.useEffect(() => {
    if (subTabValue === 'semana' && datosSemana.length === 0 && !loadingSemana) {
      cargarDatosSemana();
    }
  }, [subTabValue]);

  // Cargar datos cuando se seleccionen fechas
  React.useEffect(() => {
    if (subTabValue === 'Entre fechas' && startDate && endDate) {
      cargarDatosFechas();
    }
  }, [startDate, endDate]);

  // Función para aplicar el filtro de fechas
  const handleApplyDateFilter = async () => {
    setShowDatePickerModal(false);
  };

  // Componentes para cada sección
  const SemanaTab = () => {
    // Cargar datos al renderizar si no están cargados
    React.useEffect(() => {
      if (datosSemana.length === 0 && !loadingSemana && !errorSemana) {
        cargarDatosSemana();
      }
    }, []);

    return (
      <div className="space-y-6">
        {loadingSemana && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">Cargando datos de ventas semanales...</div>
          </div>
        )}

        {errorSemana && !loadingSemana && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">
              <p className="font-semibold">📊 No hay datos de ventas semanales</p>
              <p className="text-sm mt-2">No se pudieron cargar los datos de ventas por semana.</p>
              <p className="text-xs mt-1 text-gray-400">Error: {errorSemana}</p>
            </div>
          </div>
        )}

        {!loadingSemana && !errorSemana && datosSemana.length > 0 && (
          <LineChartFull
            data={datosSemana}
            title="Ventas por Semana"
          />
        )}

        {!loadingSemana && !errorSemana && datosSemana.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">
              <p className="font-semibold">📊 No hay ventas registradas por semana</p>
              <p className="text-sm mt-2">Conforme comiences a tener ventas, esta vista se irá actualizando automáticamente.</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MesTab = () => {
    // Cargar datos al renderizar si no están cargados
    React.useEffect(() => {
      if (datosMes.length === 0 && !loadingMes && !errorMes) {
        cargarDatosMes();
      }
    }, []);

    return (
      <div className="space-y-6">
        {loadingMes && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">Cargando datos de ventas mensuales...</div>
          </div>
        )}

        {errorMes && !loadingMes && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">
              <p className="font-semibold">📊 No hay datos de ventas mensuales</p>
              <p className="text-sm mt-2">No se pudieron cargar los datos de ventas por mes.</p>
              <p className="text-xs mt-1 text-gray-400">Error: {errorMes}</p>
            </div>
          </div>
        )}

        {!loadingMes && !errorMes && datosMes.length > 0 && (
          <LineChartFull
            data={datosMes}
            title="Ventas por Mes"
          />
        )}

        {!loadingMes && !errorMes && datosMes.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">
              <p className="font-semibold">📊 No hay ventas registradas por mes</p>
              <p className="text-sm mt-2">Conforme comiences a tener ventas, esta vista se irá actualizando automáticamente.</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const FechasTab = () => {
    return (
      <div className="space-y-6">
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

        {loadingFechas && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">Cargando datos de ventas por fechas...</div>
          </div>
        )}

        {errorFechas && !loadingFechas && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">
              <p className="font-semibold">📊 No hay datos de ventas para las fechas seleccionadas</p>
              <p className="text-sm mt-2">No se pudieron cargar los datos de ventas para el rango especificado.</p>
              <p className="text-xs mt-1 text-gray-400">Error: {errorFechas}</p>
            </div>
          </div>
        )}

        {!loadingFechas && !errorFechas && datosFechas.length > 0 && (
          <LineChartFull
            data={datosFechas}
            title="Ventas por Rango de Fechas"
          />
        )}

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
    );
  };

  const TodoTab = () => {
    // Cargar datos al renderizar si no están cargados
    React.useEffect(() => {
      if (datosTodo.length === 0 && !loadingTodo && !errorTodo) {
        cargarDatosTodo();
      }
    }, []);

    return (
      <div className="space-y-6">
        {loadingTodo && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">Cargando todos los datos de ventas...</div>
          </div>
        )}

        {errorTodo && !loadingTodo && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">
              <p className="font-semibold">📊 No hay datos de ventas totales</p>
              <p className="text-sm mt-2">No se pudieron cargar todos los datos de ventas.</p>
              <p className="text-xs mt-1 text-gray-400">Error: {errorTodo}</p>
            </div>
          </div>
        )}

        {!loadingTodo && !errorTodo && datosTodo.length > 0 && (
          <LineChartFull
            data={datosTodo}
            title="Todas las Ventas"
          />
        )}

        {!loadingTodo && !errorTodo && datosTodo.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500">
              <p className="font-semibold">📊 No hay ventas registradas</p>
              <p className="text-sm mt-2">Conforme comiences a tener ventas, esta vista se irá actualizando automáticamente.</p>
            </div>
          </div>
        )}
      </div>
    );
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
            <MainStats />
            
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
                  <SemanaTab />
                </TabPanel>

                <TabPanel value="mes" sx={{ p: 0 }}>
                  <MesTab />
                </TabPanel>

                <TabPanel value="Entre fechas" sx={{ p: 0 }}>
                  <FechasTab />
                </TabPanel>

                <TabPanel value="Todo" sx={{ p: 0 }}>
                  <TodoTab />
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
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowDatePickerModal(false)}
            >
              <IoClose />
            </button>

            <h2 className="text-xl font-bold mb-6 text-center">
              Seleccionar Rango de Fechas
            </h2>

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

            {startDate && endDate && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Rango seleccionado:</strong><br />
                  Desde: {formatDate(startDate)}<br />
                  Hasta: {formatDate(endDate)}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDatePickerModal(false);
                  setSubTabValue("semana");
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