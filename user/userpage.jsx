import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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

// Validaciones con Yup
const personalInfoSchema = Yup.object().shape({
  name: Yup.string().required("Nombre es requerido"),
  lastName: Yup.string().required("Apellido es requerido"),
  email: Yup.string().email("Email inválido").required("Email es requerido"),
  phone: Yup.string().required("Teléfono es requerido"),
  company: Yup.string().required("Empresa es requerida"),
  position: Yup.string().required("Cargo es requerido"),
});

const addressSchema = Yup.object().shape({
  address: Yup.string().required("Dirección es requerida"),
  city: Yup.string().required("Ciudad es requerida"),
  postalCode: Yup.string()
    .matches(/^\d{5}$/, "El Código Postal es invalido")
    .required("Código Postal es requerido"),
  alcaldia: Yup.string().required("Alcaldía es requerida"),
});

const restaurantSchema = Yup.object().shape({
  restaurantName: Yup.string().required("Nombre del restaurante es requerido"),
  state: Yup.string().required("Estado/Provincia es requerido"),
  city: Yup.string().required("Ciudad es requerida"),
  alcaldia: Yup.string().required("Alcaldía es requerida"),
});

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
        <Formik
          initialValues={{
            name: "",
            lastName: "",
            email: "",
            phone: "",
            company: "",
            position: "",
          }}
          validationSchema={personalInfoSchema}
          onSubmit={(values) => {
            console.log("Datos Personales:", values);
          }}
        >
          {() => (
            <Form className="flex flex-col space-y-4">
              <h3 className="font-bold text-xl">Datos personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 space-y-2">
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="name">Nombre/s</label>
                  <Field type="text" id="name" name="name" className="border p-2 rounded" />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="lastName">Apellidos</label>
                  <Field type="text" id="lastName" name="lastName" className="border p-2 rounded" />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="email">Email</label>
                  <Field type="email" id="email" name="email" className="border p-2 rounded" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="phone">Teléfono</label>
                  <Field type="tel" id="phone" name="phone" className="border p-2 rounded" />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="company">Empresa</label>
                  <Field type="text" id="company" name="company" className="border p-2 rounded" />
                  <ErrorMessage name="company" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="position">Cargo</label>
                  <Field type="text" id="position" name="position" className="border p-2 rounded" />
                  <ErrorMessage name="position" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <button type="submit" className="mt-4 md:w-2/9 xl:w-1/9 bg-green-500 text-white p-2 rounded w-2/3 cursor-pointer">Guardar Cambios</button>
            </Form>
          )}
        </Formik>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Formik
          initialValues={{
            address: "",
            city: "",
            postalCode: "",
            alcaldia: "",
          }}
          validationSchema={addressSchema}
          onSubmit={(values) => {
            console.log("Dirección:", values);
          }}
        >
          {() => (
            <Form className="flex flex-col space-y-4">
              <h3 className="font-bold text-xl">Dirección</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 space-y-2">
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="address">Dirección</label>
                  <Field type="text" id="address" name="address" className="border p-2 rounded" />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="city">Ciudad</label>
                  <Field type="text" id="city" name="city" className="border p-2 rounded" />
                  <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="postalCode">Código Postal</label>
                  <Field type="text" id="postalCode" name="postalCode" className="border p-2 rounded" />
                  <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="alcaldia">Alcaldía</label>
                  <Field type="text" id="alcaldia" name="alcaldia" className="border p-2 rounded" />
                  <ErrorMessage name="alcaldia" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <button type="submit" className="mt-4 md:w-2/9 xl:w-1/9 bg-green-500 text-white p-2 rounded w-2/3 cursor-pointer">Guardar Cambios</button>
            </Form>
          )}
        </Formik>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Formik
          initialValues={{
            restaurantName: "",
            state: "",
            city: "",
            alcaldia: "",
          }}
          validationSchema={restaurantSchema}
          onSubmit={(values) => {
            console.log("Agregar Restaurante:", values);
          }}
        >
          {() => (
            <Form className="flex flex-col space-y-4">
              <h3 className="font-bold text-xl">Agregar Restaurante</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 space-y-2">
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="restaurantName">Nombre del restaurante</label>
                  <Field type="text" id="restaurantName" name="restaurantName" className="border p-2 rounded" />
                  <ErrorMessage name="restaurantName" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="state">Estado/Provincia</label>
                  <Field type="text" id="state" name="state" className="border p-2 rounded" />
                  <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="city">Ciudad</label>
                  <Field type="text" id="city" name="city" className="border p-2 rounded" />
                  <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="alcaldia">Alcaldía</label>
                  <Field type="text" id="alcaldia" name="alcaldia" className="border p-2 rounded" />
                  <ErrorMessage name="alcaldia" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <button type="submit" className="flex justify-center md:w-2/8 xl:w-1/8 mt-4 bg-green-500 text-white p-2 rounded cursor-pointer w-2/3 gap-2"><FaPlus className="text-xl self-center" /> Agregar Restaurante</button>
            </Form>
          )}
        </Formik>
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
          <p className="flex gap-2"><CiMail className="text-xl self-center" /> juan.dias@ejemplo.com</p>
          <p className="flex gap-2"><FaPhoneAlt className="text-xl self-center" /> +56912345678</p>
          <p className="flex gap-2"><IoLocationOutline className="text-xl self-center" /> CDMX, México</p>
        </div>
      </div>
      <BasicTabs />
    </section>
  );
}