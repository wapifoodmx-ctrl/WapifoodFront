import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { IoClose, IoCalendarOutline, IoTrendingUpOutline, IoStatsChartOutline, IoTrophyOutline } from "react-icons/io5";
import { FaChartLine, FaCalendarAlt, FaClock, FaGlobe, FaTrophy, FaMedal, FaCrown } from "react-icons/fa";
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
  
  // Estados para el ranking de días
  const [datosRanking, setDatosRanking] = React.useState([]);
  const [loadingRanking, setLoadingRanking] = React.useState(false);
  const [errorRanking, setErrorRanking] = React.useState(null);
  const [startDateRanking, setStartDateRanking] = React.useState(null);
  const [endDateRanking, setEndDateRanking] = React.useState(null);
  
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
    // Ya no abrimos modal, solo cambiamos la pestaña
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

  // Función para obtener el nombre del día de la semana
  const obtenerNombreDia = (fecha) => {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const date = new Date(fecha);
    return diasSemana[date.getDay()];
  };

  // Función para transformar datos para el ranking
  const transformarDatosRanking = (datosAPI) => {
    if (!Array.isArray(datosAPI) || datosAPI.length === 0) {
      return [];
    }

    // Procesar y ordenar los datos por valor descendente
    const datosOrdenados = datosAPI
      .map(item => {
        const fecha = item.date.split('T')[0];
        const fechaObj = new Date(fecha);
        return {
          fecha: fecha,
          fechaFormateada: formatDate(fechaObj),
          diaSemana: obtenerNombreDia(fecha),
          valor: parseFloat(item.value || 0)
        };
      })
      .sort((a, b) => b.valor - a.valor);

    return datosOrdenados;
  };

  // Función para cargar datos del ranking
  const cargarDatosRanking = async () => {
    if (!startDateRanking || !endDateRanking) return;

    try {
      setLoadingRanking(true);
      setErrorRanking(null);

      const fechaInicio = formatDateToAPI(startDateRanking);
      const fechaFin = formatDateToAPI(endDateRanking);

      const resultado = await getGraficaFechas(fechaInicio, fechaFin);

      if (resultado.success) {
        const datosTransformados = transformarDatosRanking(resultado.data);
        setDatosRanking(datosTransformados);
      } else {
        setErrorRanking(resultado.error);
        setDatosRanking([]);
      }
    } catch (error) {
      console.error('Error inesperado al cargar datos de ranking:', error);
      setErrorRanking('Error inesperado al cargar los datos');
      setDatosRanking([]);
    } finally {
      setLoadingRanking(false);
    }
  };

  // Cargar datos del ranking cuando se seleccionen fechas
  React.useEffect(() => {
    if (startDateRanking && endDateRanking) {
      cargarDatosRanking();
    }
  }, [startDateRanking, endDateRanking]);

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

    // console.log('Datos transformados y agrupados:', resultado);
    return resultado;
  };


  // Funciones para cargar datos de cada sección
  const cargarDatosSemana = async () => {
    try {
      setLoadingSemana(true);
      setErrorSemana(null);

      // console.log('Cargando datos de semana...');
      const resultado = await getGraficaSemana();
      // console.log('Resultado de getGraficaSemana:', resultado);

      if (resultado.success) {
        // console.log('Datos originales de semana:', resultado.data);
        const datosTransformados = transformarDatosAPI(resultado.data);
        // console.log('Datos transformados de semana:', datosTransformados);
        setDatosSemana(datosTransformados);
      } else {
        // console.log('Error al cargar datos de semana:', resultado.error);
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

      // console.log('Cargando datos de mes...');
      const resultado = await getGraficaMes();
      // console.log('Resultado de getGraficaMes:', resultado);

      if (resultado.success) {
        // console.log('Datos originales de mes:', resultado.data);
        const datosTransformados = transformarDatosAPI(resultado.data);
        // console.log('Datos transformados de mes:', datosTransformados);
        setDatosMes(datosTransformados);
      } else {
        // console.log('Error al cargar datos de mes:', resultado.error);
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

      // console.log('Cargando datos de fechas...', { fechaInicio, fechaFin });
      const resultado = await getGraficaFechas(fechaInicio, fechaFin);
      // console.log('Resultado de getGraficaFechas:', resultado);

      if (resultado.success) {
        // console.log('Datos originales de fechas:', resultado.data);
        const datosTransformados = transformarDatosAPI(resultado.data);
        // console.log('Datos transformados de fechas:', datosTransformados);
        setDatosFechas(datosTransformados);
      } else {
        // console.log('Error al cargar datos de fechas:', resultado.error);
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

      // console.log('Cargando datos de todo...');
      const resultado = await getADataGrafico();
      // console.log('Resultado de getADataGrafico:', resultado);

      if (resultado.success) {
        // console.log('Datos originales de todo:', resultado.data);
        const datosTransformados = transformarDatosAPI(resultado.data);
        // console.log('Datos transformados de todo:', datosTransformados);
        setDatosTodo(datosTransformados);
      } else {
        // console.log('Error al cargar datos totales:', resultado.error);
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

  // Componente de Loading mejorado
  const LoadingCard = ({ message, icon: Icon }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
            <Icon className="text-white text-2xl" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-bounce"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
            <span className="text-gray-600 font-medium">{message}</span>
          </div>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de Error mejorado
  const ErrorCard = ({ title, message, error, onRetry }) => (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg border border-red-100 p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <IoStatsChartOutline className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        {error && (
          <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm font-mono">{error}</p>
          </div>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );

  // Componente de Empty State mejorado
  const EmptyStateCard = ({ title, message, icon: Icon, action }) => (
    <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="text-white text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
        {action && action}
      </div>
    </div>
  );

  // Componentes para cada sección MEJORADOS
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
          <LoadingCard 
            message="Cargando datos de ventas semanales..." 
            icon={FaClock}
          />
        )}

        {errorSemana && !loadingSemana && (
          <ErrorCard
            title="Error al cargar datos semanales"
            message="No se pudieron cargar los datos de ventas por semana."
            error={errorSemana}
            onRetry={cargarDatosSemana}
          />
        )}

        {!loadingSemana && !errorSemana && datosSemana.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center gap-3 text-white">
                <FaChartLine className="text-2xl" />
                <h3 className="text-xl font-bold">Ventas Semanales</h3>
              </div>
            </div>
            <div className="p-6">
              <LineChartFull
                data={datosSemana}
                title="Ventas por Semana"
              />
            </div>
          </div>
        )}

        {!loadingSemana && !errorSemana && datosSemana.length === 0 && (
          <EmptyStateCard
            title="Sin ventas semanales"
            message="Conforme comiences a tener ventas, esta vista se irá actualizando automáticamente."
            icon={FaChartLine}
          />
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
          <LoadingCard 
            message="Cargando datos de ventas mensuales..." 
            icon={FaCalendarAlt}
          />
        )}

        {errorMes && !loadingMes && (
          <ErrorCard
            title="Error al cargar datos mensuales"
            message="No se pudieron cargar los datos de ventas por mes."
            error={errorMes}
            onRetry={cargarDatosMes}
          />
        )}

        {!loadingMes && !errorMes && datosMes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center gap-3 text-white">
                <FaCalendarAlt className="text-2xl" />
                <h3 className="text-xl font-bold">Ventas Mensuales</h3>
              </div>
            </div>
            <div className="p-6">
              <LineChartFull
                data={datosMes}
                title="Ventas por Mes"
              />
            </div>
          </div>
        )}

        {!loadingMes && !errorMes && datosMes.length === 0 && (
          <EmptyStateCard
            title="Sin ventas mensuales"
            message="Conforme comiences a tener ventas, esta vista se irá actualizando automáticamente."
            icon={FaCalendarAlt}
          />
        )}
      </div>
    );
  };

  const FechasTab = () => {
    return (
      <div className="space-y-6">
        {/* Selector de fechas integrado */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <IoCalendarOutline className="text-2xl" />
              <h3 className="text-xl font-bold">Selecciona el Rango de Fechas</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                    <IoCalendarOutline className="text-white text-sm" />
                  </div>
                  Fecha de inicio
                </label>
                <div 
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 transition-colors focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 cursor-pointer"
                  onClick={() => {
                    // Buscar el input del DatePicker y hacer click
                    const input = document.querySelector('.fecha-inicio-input input');
                    if (input) input.focus();
                  }}
                >
                  <div className="fecha-inicio-input">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Selecciona fecha de inicio"
                      className="w-full text-lg font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      locale="es"
                      popperClassName="custom-datepicker-popper"
                      popperPlacement="bottom-start"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <IoCalendarOutline className="text-white text-sm" />
                  </div>
                  Fecha de fin
                </label>
                <div 
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-500 transition-colors focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 cursor-pointer"
                  onClick={() => {
                    // Buscar el input del DatePicker y hacer click
                    const input = document.querySelector('.fecha-fin-input input');
                    if (input) input.focus();
                  }}
                >
                  <div className="fecha-fin-input">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      placeholderText="Selecciona fecha de fin"
                      className="w-full text-lg font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      locale="es"
                      popperClassName="custom-datepicker-popper"
                      popperPlacement="bottom-start"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información del rango seleccionado */}
            {startDate && endDate && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoCalendarOutline className="text-white text-lg" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-green-800 font-bold text-lg mb-2">✅ Rango seleccionado correctamente</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-green-700">
                      <div className="bg-white/60 rounded-lg p-3">
                        <p className="font-semibold text-sm text-green-600 mb-1">Fecha de inicio:</p>
                        <p className="text-base font-bold">{formatDate(startDate)}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3">
                        <p className="font-semibold text-sm text-green-600 mb-1">Fecha de fin:</p>
                        <p className="text-base font-bold">{formatDate(endDate)}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-green-600">
                      <p>📊 Días incluidos: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} días</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estados de carga y gráfica */}
        {loadingFechas && (
          <LoadingCard 
            message="Cargando datos de ventas por fechas..." 
            icon={IoCalendarOutline}
          />
        )}

        {errorFechas && !loadingFechas && (
          <ErrorCard
            title="Error al cargar datos por fechas"
            message="No se pudieron cargar los datos de ventas para el rango especificado."
            error={errorFechas}
            onRetry={() => cargarDatosFechas()}
          />
        )}

        {!loadingFechas && !errorFechas && datosFechas.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <IoCalendarOutline className="text-2xl" />
                  <h3 className="text-xl font-bold">Ventas por Rango de Fechas</h3>
                </div>
                <button
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setDatosFechas([]);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/30 flex items-center gap-2"
                >
                  <IoCalendarOutline className="text-lg" />
                  Seleccionar otras fechas
                </button>
              </div>
            </div>
            <div className="p-6">
              <LineChartFull
                data={datosFechas}
                title="Ventas por Rango de Fechas"
              />
            </div>
          </div>
        )}

        {!loadingFechas && !errorFechas && startDate && endDate && datosFechas.length === 0 && (
          <EmptyStateCard
            title="Sin ventas en el rango seleccionado"
            message="No se encontraron ventas para las fechas especificadas. Prueba con un rango diferente."
            icon={IoCalendarOutline}
            action={
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <IoCalendarOutline className="text-lg" />
                Seleccionar otras fechas
              </button>
            }
          />
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
          <LoadingCard 
            message="Cargando todos los datos de ventas..." 
            icon={FaGlobe}
          />
        )}

        {errorTodo && !loadingTodo && (
          <ErrorCard
            title="Error al cargar datos totales"
            message="No se pudieron cargar todos los datos de ventas."
            error={errorTodo}
            onRetry={cargarDatosTodo}
          />
        )}

        {!loadingTodo && !errorTodo && datosTodo.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-500 to-gray-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <FaGlobe className="text-2xl" />
                <h3 className="text-xl font-bold">Todas las Ventas</h3>
              </div>
            </div>
            <div className="p-6">
              <LineChartFull
                data={datosTodo}
                title="Todas las Ventas"
              />
            </div>
          </div>
        )}

        {!loadingTodo && !errorTodo && datosTodo.length === 0 && (
          <EmptyStateCard
            title="Sin ventas registradas"
            message="Conforme comiences a tener ventas, esta vista se irá actualizando automáticamente."
            icon={FaGlobe}
          />
        )}
      </div>
    );
  };

  // Componente del Ranking de Días ACTUALIZADO
  const RankingTab = () => {
    // Función para obtener el icono según la posición
    const obtenerIconoPosicion = (posicion) => {
      switch (posicion) {
        case 1:
          return <FaCrown className="text-yellow-500 text-2xl" />;
        case 2:
          return <FaMedal className="text-gray-400 text-xl" />;
        case 3:
          return <FaTrophy className="text-orange-500 text-xl" />;
        default:
          return <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">{posicion}</div>;
      }
    };

    // Función para obtener el color del fondo según la posición
    const obtenerColorFondo = (posicion) => {
      switch (posicion) {
        case 1:
          return 'from-yellow-100 to-yellow-200 border-yellow-300';
        case 2:
          return 'from-gray-100 to-gray-200 border-gray-300';
        case 3:
          return 'from-orange-100 to-orange-200 border-orange-300';
        default:
          return 'from-blue-50 to-blue-100 border-blue-200';
      }
    };

    return (
      <div className="space-y-6">
        {/* Selector de fechas para ranking */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6">
            <div className="flex items-center gap-3 text-white">
              <IoTrophyOutline className="text-xl sm:text-2xl flex-shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold">Selecciona el Período para el Ranking</h3>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <label className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoCalendarOutline className="text-white text-sm" />
                  </div>
                  <span>Fecha de inicio</span>
                </label>
                <div 
                  className="border-2 border-gray-200 rounded-xl p-3 sm:p-4 hover:border-green-500 transition-colors focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 cursor-pointer"
                  onClick={() => {
                    // Buscar el input del DatePicker y hacer click
                    const input = document.querySelector('.ranking-fecha-inicio-input input');
                    if (input) input.focus();
                  }}
                >
                  <div className="ranking-fecha-inicio-input">
                    <DatePicker
                      selected={startDateRanking}
                      onChange={(date) => setStartDateRanking(date)}
                      selectsStart
                      startDate={startDateRanking}
                      endDate={endDateRanking}
                      placeholderText="Selecciona fecha de inicio"
                      className="w-full text-base sm:text-lg font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      locale="es"
                      popperClassName="custom-datepicker-popper"
                      popperPlacement="bottom-start"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoCalendarOutline className="text-white text-sm" />
                  </div>
                  <span>Fecha de fin</span>
                </label>
                <div 
                  className="border-2 border-gray-200 rounded-xl p-3 sm:p-4 hover:border-emerald-500 transition-colors focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 cursor-pointer"
                  onClick={() => {
                    // Buscar el input del DatePicker y hacer click
                    const input = document.querySelector('.ranking-fecha-fin-input input');
                    if (input) input.focus();
                  }}
                >
                  <div className="ranking-fecha-fin-input">
                    <DatePicker
                      selected={endDateRanking}
                      onChange={(date) => setEndDateRanking(date)}
                      selectsEnd
                      startDate={startDateRanking}
                      endDate={endDateRanking}
                      minDate={startDateRanking}
                      placeholderText="Selecciona fecha de fin"
                      className="w-full text-base sm:text-lg font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      locale="es"
                      popperClassName="custom-datepicker-popper"
                      popperPlacement="bottom-start"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información del rango seleccionado */}
            {startDateRanking && endDateRanking && (
              <div className="mt-4 sm:mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoTrophyOutline className="text-white text-sm sm:text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-green-800 font-bold text-base sm:text-lg mb-2">🏆 Período seleccionado para el ranking</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-green-700">
                      <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                        <p className="font-semibold text-xs sm:text-sm text-green-600 mb-1">Fecha de inicio:</p>
                        <p className="text-sm sm:text-base font-bold truncate">{formatDate(startDateRanking)}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                        <p className="font-semibold text-xs sm:text-sm text-green-600 mb-1">Fecha de fin:</p>
                        <p className="text-sm sm:text-base font-bold truncate">{formatDate(endDateRanking)}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs sm:text-sm text-green-600">
                      <p>📊 Días a evaluar: {Math.ceil((endDateRanking - startDateRanking) / (1000 * 60 * 60 * 24)) + 1} días</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estados de carga y ranking */}
        {loadingRanking && (
          <LoadingCard 
            message="Generando ranking de días..." 
            icon={IoTrophyOutline}
          />
        )}

        {errorRanking && !loadingRanking && (
          <ErrorCard
            title="Error al generar ranking"
            message="No se pudo generar el ranking de días para el período especificado."
            error={errorRanking}
            onRetry={() => cargarDatosRanking()}
          />
        )}

        {!loadingRanking && !errorRanking && datosRanking.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <IoTrophyOutline className="text-xl sm:text-2xl flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold truncate">🏆 Ranking de Días por Ventas</h3>
                </div>
                <div className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-lg flex-shrink-0 ml-2">
                  {datosRanking.length} días
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid gap-3 sm:gap-4">
                {datosRanking.map((dia, index) => {
                  const posicion = index + 1;
                  return (
                    <div
                      key={dia.fecha}
                      className={`bg-gradient-to-r ${obtenerColorFondo(posicion)} border-2 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-lg`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="flex items-center justify-center flex-shrink-0">
                            {obtenerIconoPosicion(posicion)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <h4 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                                {dia.diaSemana}
                              </h4>
                              <span className="text-xs sm:text-sm text-gray-600 bg-white/70 px-2 py-1 rounded-lg self-start">
                                {dia.fechaFormateada}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Posición #{posicion} en el ranking
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg sm:text-2xl font-bold text-gray-800">
                            ${dia.valor.toLocaleString()}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            en ventas
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Estadísticas del ranking */}
              <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-300 rounded-xl p-3 sm:p-4 text-center">
                  <FaCrown className="text-yellow-600 text-xl sm:text-2xl mx-auto mb-2" />
                  <h4 className="font-bold text-yellow-800 text-sm sm:text-base">Mejor Día</h4>
                  <p className="text-xs sm:text-sm text-yellow-700 truncate">{datosRanking[0]?.diaSemana}</p>
                  <p className="text-base sm:text-lg font-bold text-yellow-800">${datosRanking[0]?.valor.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300 rounded-xl p-3 sm:p-4 text-center">
                  <FaChartLine className="text-blue-600 text-xl sm:text-2xl mx-auto mb-2" />
                  <h4 className="font-bold text-blue-800 text-sm sm:text-base">Promedio</h4>
                  <p className="text-base sm:text-lg font-bold text-blue-800">
                    ${Math.round(datosRanking.reduce((acc, dia) => acc + dia.valor, 0) / datosRanking.length).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-200 border border-green-300 rounded-xl p-3 sm:p-4 text-center">
                  <FaGlobe className="text-green-600 text-xl sm:text-2xl mx-auto mb-2" />
                  <h4 className="font-bold text-green-800 text-sm sm:text-base">Total Período</h4>
                  <p className="text-base sm:text-lg font-bold text-green-800">
                    ${datosRanking.reduce((acc, dia) => acc + dia.valor, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loadingRanking && !errorRanking && startDateRanking && endDateRanking && datosRanking.length === 0 && (
          <EmptyStateCard
            title="Sin ventas en el período seleccionado"
            message="No se encontraron ventas para las fechas especificadas en el ranking."
            icon={IoTrophyOutline}
            action={
              <button
                onClick={() => {
                  setStartDateRanking(null);
                  setEndDateRanking(null);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base"
              >
                <IoCalendarOutline className="text-base sm:text-lg" />
                Seleccionar otras fechas
              </button>
            }
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px 12px 0 0',
            overflow: 'hidden'
          }}>
            <TabList 
              onChange={handleChange} 
              aria-label="lab API tabs example"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTab-root': {
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  minHeight: '64px',
                  minWidth: { xs: 'auto', sm: '160px' },
                  padding: { xs: '12px 16px', sm: '12px 24px' },
                  '&.Mui-selected': {
                    color: '#fbbf24',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#fbbf24',
                  height: '4px',
                  borderRadius: '2px'
                },
                '& .MuiTabs-scrollButtons': {
                  color: 'white',
                  '&.Mui-disabled': {
                    opacity: 0.3
                  }
                }
              }}
            >
              <Tab 
                label={
                  <div className="flex items-center gap-2">
                    <IoTrendingUpOutline className="text-xl" />
                    <span className="hidden sm:inline">Populares</span>
                    <span className="sm:hidden">Pop.</span>
                  </div>
                } 
                value="1" 
              />
              <Tab 
                label={
                  <div className="flex items-center gap-2">
                    <IoStatsChartOutline className="text-xl" />
                    <span>Ventas</span>
                  </div>
                } 
                value="2" 
              />
              <Tab 
                label={
                  <div className="flex items-center gap-2">
                    <IoTrophyOutline className="text-xl" />
                    <span className="hidden sm:inline">Ranking de días</span>
                    <span className="sm:hidden">Ranking</span>
                  </div>
                } 
                value="3" 
              />
            </TabList>
          </Box>
          
          <TabPanel value="1" sx={{ padding: { xs: '16px', sm: '24px' } }}>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <IoTrendingUpOutline className="text-2xl" />
                    <h3 className="text-xl font-bold">Productos Populares</h3>
                  </div>
                </div>
                <div className="p-6">
                  <Populares />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-500 to-gray-700 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <IoStatsChartOutline className="text-2xl" />
                    <h3 className="text-xl font-bold">Análisis de Ventas</h3>
                  </div>
                </div>
                <div className="p-6">
                  <BarChartBreakdown />
                </div>
              </div>
            </div>
          </TabPanel>
          
          <TabPanel value="2" sx={{ padding: { xs: '16px', sm: '24px' } }}>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <IoStatsChartOutline className="text-2xl" />
                    <h3 className="text-xl font-bold">Estadísticas Principales</h3>
                  </div>
                </div>
                <div className="p-6">
                  <MainStats />
                </div>
              </div>

              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={subTabValue}>
                  <Box sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider', 
                    mb: 3,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <TabList 
                      onChange={handleSubTabChange} 
                      aria-label="ventas tabs"
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        '& .MuiTab-root': {
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                          minHeight: '56px',
                          '&.Mui-selected': {
                            color: '#fbbf24',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          }
                        },
                        '& .MuiTabs-indicator': {
                          backgroundColor: '#fbbf24',
                          height: '3px',
                          borderRadius: '2px'
                        },
                        '& .MuiTabs-scrollButtons': {
                          color: 'white',
                          '&.Mui-disabled': {
                            opacity: 0.3
                          }
                        }
                      }}
                    >
                      <Tab 
                        label={
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <FaClock className="text-lg" />
                            <span>Semana</span>
                          </div>
                        } 
                        value="semana" 
                      />
                      <Tab 
                        label={
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <FaCalendarAlt className="text-lg" />
                            <span>Mes</span>
                          </div>
                        } 
                        value="mes" 
                      />
                      <Tab 
                        label={
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <IoCalendarOutline className="text-lg" />
                            <span>Entre fechas</span>
                          </div>
                        } 
                        value="Entre fechas" 
                      />
                      <Tab 
                        label={
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <FaGlobe className="text-lg" />
                            <span>Todo</span>
                          </div>
                        } 
                        value="Todo" 
                      />
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
            </div>
          </TabPanel>
          
          <TabPanel value="3" sx={{ padding: { xs: '16px', sm: '24px' } }}>
            <RankingTab />
          </TabPanel>
        </TabContext>
      </Box>

      {/* Estilos CSS simplificados para DatePicker SIN MODAL */}
      <style jsx global>{`
        /* Z-INDEX ALTO PARA DATEPICKER */
        .custom-datepicker-popper {
          z-index: 9999 !important;
        }

        .react-datepicker-popper {
          z-index: 9999 !important;
        }

        .react-datepicker {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
          font-family: inherit;
          z-index: 9999 !important;
        }

        .react-datepicker__header {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          border-bottom: none;
          border-radius: 10px 10px 0 0;
          color: white;
        }

        .react-datepicker__current-month {
          color: white !important;
          font-weight: bold;
          font-size: 16px;
        }

        .react-datepicker__day-name {
          color: white !important;
          font-weight: 600;
        }

        .react-datepicker__day {
          border-radius: 8px;
          margin: 2px;
          transition: all 0.2s ease;
        }

        .react-datepicker__day:hover {
          background-color: #10b981 !important;
          color: white !important;
          transform: scale(1.05);
        }

        .react-datepicker__day--selected {
          background-color: #059669 !important;z
          color: white !important;
          font-weight: bold;
        }

        .react-datepicker__day--in-range {
          background-color: #d1fae5 !important;
          color: #065f46 !important;
        }

        .react-datepicker__navigation {
          top: 15px;
        }

        .react-datepicker__navigation-icon::before {
          border-color: white !important;
        }

        .react-datepicker__year-dropdown,
        .react-datepicker__month-dropdown {
          z-index: 9999 !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
}