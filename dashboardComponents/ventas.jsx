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

export default function Ventas() {
  const [value, setValue] = React.useState('1');
  const [ventasSemanales, setVentasSemanales] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Función para transformar los datos de la API al formato esperado
  const transformarDatosAPI = (datosAPI) => {
    // Verificar si datosAPI es un array válido
    if (!Array.isArray(datosAPI) || datosAPI.length === 0) {
      return [];
    }

    return datosAPI.map(item => ({
      date: item.date.split('T')[0], // Extraer solo la fecha (YYYY-MM-DD)
      value: item.value
    }));
  };

  // Cargar datos de la API
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
          // Manejar diferentes tipos de errores sin lanzar excepciones
          console.log('Error controlado:', resultado.error, resultado.message);
          
          if (resultado.error === 'sin-ventas' || resultado.error === 'sin-permisos') {
            setError('sin-ventas');
          } else {
            setError(resultado.message);
          }
          
          setVentasSemanales([]);
        }
      } catch (error) {
        // Este catch ya no debería ejecutarse, pero lo mantenemos por seguridad
        console.error('Error inesperado:', error);
        setError('Error inesperado al cargar los datos');
        setVentasSemanales([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosVentas();
  }, []);

  // Datos estáticos para productos vendidos (mantener como está)
  const productosVendidos = [
    { date: "2025-05-16", value: 45 },
    { date: "2025-05-17", value: 52 },
    { date: "2025-05-18", value: 38 },
    { date: "2025-05-19", value: 65 },
    { date: "2025-05-20", value: 72 },
    { date: "2025-05-21", value: 80 },
    { date: "2025-05-22", value: 75 },
  ];

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
            <LineChartFull data={productosVendidos} title="Productos Vendidos por Día" />
          </TabPanel>
          <TabPanel value="2">
            <div className="space-y-6">
              <MainStats />
              
              {/* Mostrar estado de carga */}
              {loading && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center text-gray-500">Cargando datos de ventas...</div>
                </div>
              )}
              
              {/* Mostrar mensaje específico para sin ventas */}
              {error === 'sin-ventas' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center text-gray-500">
                    <p className="font-semibold">📊 No hay ventas registradas</p>
                    <p className="text-sm mt-2">Conforme comiences a tener ventas, esta vista se irá actualizando automáticamente.</p>
                    <p className="text-xs mt-1 text-gray-400">¡Las gráficas aparecerán aquí cuando tengas datos!</p>
                  </div>
                </div>
              )}

              {/* Gráfico de ventas solo si hay datos y no hay error */}
              {!loading && !error && ventasSemanales.length > 0 && (
                <LineChartFull 
                  data={ventasSemanales} 
                  title="Ventas Totales" 
                />
              )}

            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}