import { FaPlus } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import Image from "next/image";
import Miokon from "@/pages/assets/images/Miokon.png";
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
          <Tab label="Agregar Restaurante" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className="flex flex-col space-y-4">
          <h3 className='font-bold text-xl'>Datos personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 space-y-2">
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="name">Nombre</label>
              <input type="text" id="name" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="name">Apellido</label>
              <input type="text" id="name" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="email">Email</label>
              <input type="email" id="email" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="phone">Teléfono</label>
              <input type="tel" id="phone" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="text">Empresa</label>
              <input type="text" id="email" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="text">Cargo</label>
              <input type="text" id="email" className="border p-2 rounded" />
            </div>
          </div>
        </div>
        <button className="mt-4 w-1/9 bg-green-500 text-white p-2 rounded cursor-pointer">Guardar Cambios</button>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div className='flex flex-col space-y-4'>
          <h3 className='font-bold text-xl'>Dirección</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 space-y-2">
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="address">Dirección</label>
              <input type="text" id="address" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="city">Ciudad</label>
              <input type="text" id="city" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="postal-code">Código Postal</label>
              <input type="text" id="postal-code" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="address">Alcaldia</label>
              <input type="text" id="address" className="border p-2 rounded" />
            </div>
          </div>
          <button className="mt-4 w-1/9 bg-green-500 text-white p-2 rounded cursor-pointer">Guardar Cambios</button>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div className='flex flex-col space-y-4'>
          <h3 className='font-bold text-xl'>Agregar Restaurante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 space-y-2">
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="local">Nombre del restaurante</label>
              <input type="text" id="local" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="state">Estado/Provincia</label>
              <input type="text" id="state" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="city">Ciudad</label>
              <input type="text" id="city" className="border p-2 rounded" />
            </div>
            <div className="flex flex-col pr-4">
              <label className="font-bold" htmlFor="address">Alcaldia</label>
              <input type="text" id="address" className="border p-2 rounded" />
            </div>
          </div>
          <button className="flex justify-center w-1/8 mt-4 bg-green-500 text-white p-2 rounded cursor-pointer"><FaPlus className="text-xl self-center" /> Agregar Restaurante</button>
        </div>
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
      <div className='bg-white shadow-md rounded-lg p-4 m-4'>
        <div className="flex flex-col items-center">
          <div className='w-20 h-20 rounded-full overflow-hidden mb-3 justify-'>
            <Image src={Miokon} alt="Imagen de perfil" width={80} height={80} className="object-cover" />
          </div>
          <div className="flex flex-col">
            <p className="font-bold flex flex-col text-xl">Juan Días Rodriguez</p>
            <p className=" text-gray-500 pb-4 self-center">Gerente</p>
          </div>
          <div className="border-b-1 w-full border-gray-500"></div>
        </div>
        <div className="space-y-4 mt-4">
          <p className="flex gap-2"><CiMail className="text-xl" /> juan.dias@ejemplo.com</p>
          <p className="flex gap-2"><FaPhoneAlt className="text-xl" /> +56912345678</p>
          <p className="flex gap-2"><IoLocationOutline className="text-xl" /> CDMX, México</p>
        </div>
      </div>
      <BasicTabs />
    </section>
  );
}