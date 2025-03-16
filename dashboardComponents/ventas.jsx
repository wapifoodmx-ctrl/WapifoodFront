import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Datos del gráfico
const data = {
  labels: ['January', 'February', 'March', 'April', 'May'], // Etiquetas del eje X
  datasets: [
    {
      label: 'My First Dataset', // Nombre de la serie
      data: [65, 59, 80, 81, 56], // Datos para la serie
      fill: false, // Sin relleno bajo la línea
      borderColor: 'rgb(75, 192, 192)', // Color de la línea
      tension: 0.1, // Suaviza la curva de la línea
    },
  ],
};

// Opciones del gráfico (puedes personalizar lo que quieras)
const options = {

  plugins: {
    legend: {
      position: 'top', // Posición de la leyenda
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Personaliza las etiquetas del tooltip
        },
      },
    },
  },
};

// Componente del gráfico

export default function Ventas() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Día" value="1" />
              <Tab label="Semana" value="2" />
              <Tab label="Mes" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            1
          </TabPanel>
          <TabPanel value="2">
            2
          </TabPanel>
          <TabPanel value="3">
            3
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
