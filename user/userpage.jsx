import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Navbar from "@/dashboardComponents/navbar";

// Función para los paneles de las pestañas
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Función para manejar los atributos de accesibilidad
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// Componente de pestañas
function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Datos Personales" {...a11yProps(0)} />
          <Tab label="Dirección" {...a11yProps(1)} />
          <Tab label="Información Local" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className="flex flex-col space-y-2">
            <h3 className='font-bold text-xl'>Datos personales</h3>
          <label htmlFor="name">Nombre</label>
          <input type="text" id="name" className="border p-2 rounded" />
          <label htmlFor="name">Apellido</label>
          <input type="text" id="name" className="border p-2 rounded" />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" className="border p-2 rounded" />
          <label htmlFor="phone">Teléfono</label>
          <input type="tel" id="phone" className="border p-2 rounded" />
          <label htmlFor="text">Empresa</label>
          <input type="text" id="email" className="border p-2 rounded" />
          <label htmlFor="text">Cargo</label>
          <input type="text" id="email" className="border p-2 rounded" />
        </div>
        <button className="mt-4 bg-blue-500 text-white p-2 rounded">Guardar Cambios</button>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Dirección
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Local
      </CustomTabPanel>
    </Box>
  );
}

// Componente principal
export default function UserPage() {
  return (
    <section>
      <Navbar />
      <div className="flex space-x-4 p-4">
        <h2 className="font-bold text-2xl">Mi Perfil</h2>
      </div>
        <BasicTabs />
    </section>
  );
}