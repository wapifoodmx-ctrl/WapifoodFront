import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Populares from './populares';
import IdPedidos from './idpedidos';
import MainStats from './mainStats';
import { LineChartFull } from './chart';
import { getADataGrafico } from '@/useCases/getDataGrafico';
import { getGraficaSemana } from '@/useCases/getGraficaSemana';
import BarChartBreakdown from './chartbar';

export default function Ventas() {
  const [value, setValue] = React.useState('1');
  const [subTabValue, setSubTabValue] = React.useState('semana');
  const [ventasSemanales, setVentasSemanales] = React.useState([]);
  const [datosSemana, setDatosSemana] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingSemana, setLoadingSemana] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [errorSemana, setErrorSemana] = React.useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTabValue(newValue);
  };

  // Función para transformar los datos de la API al formato esperado
  const transformarDatosAPI = (datosAPI) => {
    if (!Array.isArray(datosAPI) || datosAPI.length === 0) {
      return [];
    }

    return datosAPI.map(item => ({
      date: item.date.split('T')[0],
      value: item.value
    }));
  };

  // Función para procesar datos de ventas por semana
  const procesarDatosSemana = (datosAPI) => {
    if (!Array.isArray(datosAPI) || datosAPI.length === 0) {
      return [];
    }

    return datosAPI.map(semana => {
      // Calcular total de ventas de la semana (solo órdenes finalizadas)
      const totalSemana = semana.orders
        .filter(order => order.order_status === 'Finalizado')
        .reduce((total, order) => total + parseFloat(order.total || 0), 0);

      // Convertir formato de semana a fecha más legible
      const weekNumber = semana.week.split('-W')[1];
      const year = semana.week.split('-W')[0];
      
      return {
        date: `Semana ${weekNumber}, ${year}`,
        value: totalSemana,
        ordenes: semana.orders.filter(order => order.order_status === 'Finalizado').length,
        week: semana.week
      };
    });
  };

  // Cargar datos originales de la API
  React.useEffect(() => {
    const cargarDatosVentas = async () => {
      try {
        setLoading(true);
        setError(null);

        const resultado = await getADataGrafico();

        if (resultado.success) {
          const datosTransformados = transformarDatosAPI(resultado.data);
          setVentasSemanales(datosTransformados);
          console.log('Datos de ventas semanales cargados:', datosTransformados);
        } else {
          console.log('Error controlado:', resultado.error, resultado.message);

          if (resultado.error === 'sin-ventas' || resultado.error === 'sin-permisos') {
            setError('sin-ventas');
          } else {
            setError(resultado.message);
          }

          setVentasSemanales([]);
        }
      } catch (error) {
        console.error('Error inesperado:', error);
        setError('Error inesperado al cargar los datos');
        setVentasSemanales([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosVentas();
  }, []);

  // Cargar datos de ventas por semana
  React.useEffect(() => {
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
  }, []);

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
            {/* Sub-pestañas para Ventas */}
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={subTabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <TabList onChange={handleSubTabChange} aria-label="ventas tabs">
                    <Tab label="Semana" value="semana" />
                    <Tab label="Mes" value="mes" />
                    <Tab label="Año" value="año" />
                  </TabList>
                </Box>
                
                <TabPanel value="semana" sx={{ p: 0 }}>
                  <div className="space-y-6">
                    <MainStats />

                    {/* Mostrar estado de carga para datos de semana */}
                    {loadingSemana && (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center text-gray-500">Cargando datos de ventas semanales...</div>
                      </div>
                    )}

                    {/* Mostrar error específico para datos de semana */}
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
                    <MainStats />
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="text-center text-gray-500">
                        <p className="font-semibold">🚧 Vista de Mes</p>
                        <p className="text-sm mt-2">Esta funcionalidad estará disponible próximamente.</p>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value="año" sx={{ p: 0 }}>
                  <div className="space-y-6">
                    <MainStats />
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="text-center text-gray-500">
                        <p className="font-semibold">🚧 Vista de Año</p>
                        <p className="text-sm mt-2">Esta funcionalidad estará disponible próximamente.</p>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}