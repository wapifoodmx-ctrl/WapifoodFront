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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [restauranteAEliminar, setRestauranteAEliminar] = React.useState(null);
  const [restauranteAEditar, setRestauranteAEditar] = React.useState(null);

  // Estado para manejar la lista de restaurantes
  const [restaurantes, setRestaurantes] = React.useState([
    { id: 1, nombre: "Restaurante El Buen Sabor", direccion: "Av. Siempre Viva 123, CDMX" },
    { id: 2, nombre: "La Parrilla Mexicana", direccion: "Calle Falsa 456, Monterrey" },
    { id: 3, nombre: "Sushi Express", direccion: "Blvd. Reforma 789, Guadalajara" },
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Función para mostrar la modal de confirmación
  const confirmarEliminarRestaurante = (id) => {
    setRestauranteAEliminar(id);
    setIsConfirmModalOpen(true);
  };

  // Función para eliminar un restaurante
  const eliminarRestaurante = () => {
    setRestaurantes((prevRestaurantes) =>
      prevRestaurantes.filter((restaurante) => restaurante.id !== restauranteAEliminar)
    );
    setIsConfirmModalOpen(false);
    console.log(`Restaurante con ID ${restauranteAEliminar} eliminado`);
  };

  // Función para abrir la modal de edición
  const editarRestaurante = (id) => {
    const restaurante = restaurantes.find((restaurante) => restaurante.id === id);
    setRestauranteAEditar(restaurante);
    setIsEditModalOpen(true);
  };

  // Función para guardar los cambios del restaurante editado
  const guardarCambiosRestaurante = (values) => {
    setRestaurantes((prevRestaurantes) =>
      prevRestaurantes.map((restaurante) =>
        restaurante.id === values.id ? { ...restaurante, ...values } : restaurante
      )
    );
    setIsEditModalOpen(false);
    console.log(`Restaurante con ID ${values.id} actualizado`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Datos Personales" {...a11yProps(0)} />
          <Tab label="Dirección" {...a11yProps(1)} />
          <Tab label="Restaurantes" {...a11yProps(2)} />
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
                  <label className="font-bold" htmlFor="position">Cargo</label>
                  <Field type="text" id="position" name="position" className="border p-2 rounded" />
                  <ErrorMessage name="position" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Input para subir imagen con la mitad del tamaño */}
                <div className="flex flex-col pr-4 w-1/2">
                  <label className="font-bold" htmlFor="profileImage">Imagen de Perfil</label>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    className="border p-2 rounded cursor-pointer"
                    onChange={(event) => {
                      console.log("Archivo seleccionado:", event.target.files[0]);
                    }}
                  />
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
        <div className="space-y-4">
          <h3 className="font-bold text-xl">Lista de Restaurantes</h3>
          <ul className="space-y-4">
            {restaurantes.map((restaurante) => (
              <li key={restaurante.id} className="border p-4 rounded shadow">
                <p className="font-bold">{restaurante.nombre}</p>
                <p className="text-gray-500">{restaurante.direccion}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => editarRestaurante(restaurante.id)}
                  >
                    Editar Restaurante
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => confirmarEliminarRestaurante(restaurante.id)}
                  >
                    Eliminar Restaurante
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={toggleModal}
          >
            Agregar Restaurante
          </button>
        </div>

        {/* Modal para agregar restaurante */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={toggleModal} // Cierra la modal al hacer clic fuera
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2"
              onClick={(e) => e.stopPropagation()} // Evita cerrar la modal al hacer clic dentro
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={toggleModal}
              >
                ✖
              </button>
              <h3 className="font-bold text-xl mb-4">Agregar Restaurante</h3>
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
                  toggleModal(); // Cierra la modal después de enviar
                }}
              >
                {() => (
                  <Form className="flex flex-col space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 space-y-2">
                      <div className="flex flex-col pr-4">
                        <label className="font-bold" htmlFor="restaurantName">Nombre del restaurante</label>
                        <Field type="text" id="restaurantName" name="restaurantName" className="border p-2 rounded" />
                        <ErrorMessage name="restaurantName" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="flex flex-col pr-4">
                        <label className="font-bold" htmlFor="state">Calle y número</label>
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
                    <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Guardar Restaurante
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* Modal para editar restaurante */}
        {isEditModalOpen && restauranteAEditar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsEditModalOpen(false)} // Cierra la modal al hacer clic fuera
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2"
              onClick={(e) => e.stopPropagation()} // Evita cerrar la modal al hacer clic dentro
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setIsEditModalOpen(false)}
              >
                ✖
              </button>
              <h3 className="font-bold text-xl mb-4">Editar Restaurante</h3>
              <Formik
                initialValues={{
                  id: restauranteAEditar.id,
                  restaurantName: restauranteAEditar.nombre,
                  state: restauranteAEditar.direccion,
                  city: restauranteAEditar.city || "",
                  alcaldia: restauranteAEditar.alcaldia || "",
                }}
                validationSchema={restaurantSchema}
                onSubmit={guardarCambiosRestaurante}
              >
                {() => (
                  <Form className="flex flex-col space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 space-y-2">
                      <div className="flex flex-col pr-4">
                        <label className="font-bold" htmlFor="restaurantName">Nombre del restaurante</label>
                        <Field
                          type="text"
                          id="restaurantName"
                          name="restaurantName"
                          className="border p-2 rounded"
                        />
                        <ErrorMessage
                          name="restaurantName"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="flex flex-col pr-4">
                        <label className="font-bold" htmlFor="state">Calle y número</label>
                        <Field
                          type="text"
                          id="state"
                          name="state"
                          className="border p-2 rounded"
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="flex flex-col pr-4">
                        <label className="font-bold" htmlFor="city">Ciudad</label>
                        <Field
                          type="text"
                          id="city"
                          name="city"
                          className="border p-2 rounded"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="flex flex-col pr-4">
                        <label className="font-bold" htmlFor="alcaldia">Alcaldía</label>
                        <Field
                          type="text"
                          id="alcaldia"
                          name="alcaldia"
                          className="border p-2 rounded"
                        />
                        <ErrorMessage
                          name="alcaldia"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Guardar Cambios
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* Modal de confirmación para eliminar restaurante */}
        {isConfirmModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsConfirmModalOpen(false)} // Cierra la modal al hacer clic fuera
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3"
              onClick={(e) => e.stopPropagation()} // Evita cerrar la modal al hacer clic dentro
            >
              <h3 className="font-bold text-xl mb-4">¿Seguro que quieres eliminar este restaurante?</h3>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={eliminarRestaurante}
                >
                  Sí
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setIsConfirmModalOpen(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
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