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

export default function Ventas() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Datos específicos para diferentes gráficos
  const ventasSemanales = [
    { date: "2025-05-16", value: 15 },
    { date: "2025-05-17", value: 18 },
    { date: "2025-05-18", value: 12 },
    { date: "2025-05-19", value: 22 },
    { date: "2025-05-20", value: 25 },
    { date: "2025-05-21", value: 30 },
    { date: "2025-05-22", value: 28 },
  ];

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
              {/* <Tab label="Productos" value="3" /> */}
            </TabList>
          </Box>
          <TabPanel value="1">
            <Populares />
            <LineChartFull data={productosVendidos} title="Productos Vendidos por Día" />
          </TabPanel>
          <TabPanel value="2">
            <div className="space-y-6">
              <MainStats />
              <LineChartFull data={ventasSemanales} title="Ventas de la Semana" />
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}