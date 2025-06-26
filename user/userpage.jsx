import { TbWorldShare } from "react-icons/tb";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import Image from "next/image";
import Miokon from "@/pages/assets/images/Miokon.png";
import Navbar from "@/dashboardComponents/navbar";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/useCases/getUserInfo";
import { patchUserInfo } from "@/useCases/patchUserInfo";

// Validaciones con Yup
const personalInfoSchema = Yup.object().shape({
  telephone: Yup.string().required("Teléfono es requerido"),
  // Removida la validación obligatoria de profileImage
});

// Función helper para limpiar valores
const getCleanValue = (value) => {
  if (!value || value === "string" || value === "undefined" || value === "null" || value === null || value === undefined) {
    return "";
  }
  return value;
};

// Función helper para limpiar números
const getCleanNumber = (value) => {
  if (!value || value === "string" || value === "undefined" || value === "null" || value === null || value === undefined || value === 0) {
    return "";
  }
  return value;
};

// Función helper para crear la dirección completa
const getFullAddress = (userInfo) => {
  const direccion = getCleanValue(userInfo?.direccion);
  const ciudad = getCleanValue(userInfo?.ciudad);
  const codigoPostal = getCleanNumber(userInfo?.codigo_postal);
  const alcaldia = getCleanValue(userInfo?.alcaldia);
  
  // Crear un array con los valores que no están vacíos
  const addressParts = [direccion, ciudad, codigoPostal, alcaldia].filter(part => part !== "");
  
  // Si no hay partes de dirección, devolver el mensaje por defecto
  if (addressParts.length === 0) {
    return "Sin dirección";
  }
  
  // Unir las partes con espacios
  return addressParts.join(" ");
};

// Componente principal
export default function UserPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        const user = data.user_info;
        console.log('Información del usuario:', user);
        setUserInfo(user);
      } catch (error) {
        console.error('Error al cargar información del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updateData = {
        telefono: values.telephone,
        direccion: values.street,
        codigo_postal: values.postalCode ? parseInt(values.postalCode) : null,
        ciudad: values.neighborhood,
        alcaldia: values.delegation,
        nombre_restaurante: values.restaurantName,
        whatsapp: values.whatsapp,
        image: values.profileImage,
        Horario: values.Horario,
      };

      const updatedUser = await patchUserInfo(updateData);
      console.log('Datos actualizados:', updatedUser);
      
      // Actualizar el estado local con los nuevos datos
      setUserInfo(updatedUser);
      
      alert('Información actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la información');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section>
        <Navbar />
        <div className="flex justify-center items-center p-8">
          <p>Cargando información del usuario...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Navbar />
      <div className="flex space-x-4 p-4">
        <h2 className="font-bold text-2xl">Mi Perfil</h2>
      </div>
      <div className='bg-white shadow-md rounded-lg p-4'>
        <div className="flex flex-col items-center">
          <div className='w-20 h-20 rounded-full overflow-hidden mb-3'>
            <Image 
              src={userInfo?.image_user?.url || "/default-avatar.png"} 
              alt="***LOGO" 
              width={80} 
              height={80} 
              className="object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-xl">{getCleanValue(userInfo?.nombre_restaurante) || "Usuario"}</p>
          </div>
          <div className="border-b-1 w-full border-gray-500"></div>
        </div>
        <div className="pt-2 flex flex-col justify-center items-center md:flex-row ">
          <p className="flex gap-2">
            | <IoLocationOutline className="text-xl self-center" />
            {getFullAddress(userInfo)} |
          </p>
          <p className="flex gap-2">
            | <CiMail className="text-xl self-center" /> {getCleanValue(userInfo?.email) || "email@ejemplo.com"} |
          </p>
          <p className="flex gap-2">
            | <FaPhoneAlt className="text-xl self-center" /> {getCleanValue(userInfo?.telefono) || "Sin teléfono"} |
          </p>
          <a className="flex gap-2 cursor-pointer" href={`http://localhost:3000/webmenu/${userInfo?.user_uuid || ''}`}>
            | <TbWorldShare className="text-xl self-center"/>Tu menú digital |
          </a>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <Formik
          initialValues={{
            restaurantName: getCleanValue(userInfo?.nombre_restaurante),
            street: getCleanValue(userInfo?.direccion),
            neighborhood: getCleanValue(userInfo?.ciudad),
            delegation: getCleanValue(userInfo?.alcaldia),
            telephone: getCleanValue(userInfo?.telefono),
            whatsapp: getCleanValue(userInfo?.whatsapp),
            postalCode: getCleanNumber(userInfo?.codigo_postal),
            Horario: getCleanValue(userInfo?.Horario),
            profileImage: null,
          }}
          validationSchema={personalInfoSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="flex flex-col space-y-4">
              <h3 className="font-bold text-xl">Datos Generales</h3>
              <p>NOTA: Los siguientes datos apareceran en su página web, favor de revisar antes de dar click en "Guardar Cambios"</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="restaurantName">Nombre del restaurante</label>
                  <Field 
                    type="text" 
                    id="restaurantName" 
                    name="restaurantName" 
                    placeholder="Ej: Las Flautas de Pepe"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="restaurantName" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="street">Calle y número</label>
                  <Field 
                    type="text" 
                    id="street" 
                    name="street" 
                    placeholder="Ej: Av. Reforma #123"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="street" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="neighborhood">Colonia</label>
                  <Field 
                    type="text" 
                    id="neighborhood" 
                    name="neighborhood" 
                    placeholder="Ej: Lomas de Hidalgo"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="neighborhood" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="delegation">Delegación</label>
                  <Field 
                    type="text" 
                    id="delegation" 
                    name="delegation" 
                    placeholder="Ej: Cuauhtémoc"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="delegation" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="telephone">Teléfono</label>
                  <Field 
                    type="tel" 
                    id="telephone" 
                    name="telephone" 
                    placeholder="Ej: 55-1234-5678"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="telephone" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="whatsapp">WhatsApp</label>
                  <Field 
                    type="tel" 
                    id="whatsapp" 
                    name="whatsapp" 
                    placeholder="Ej: https://api.whatsapp.com/message/DJESQM3TOQH5G1"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="whatsapp" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="postalCode">Código Postal</label>
                  <Field 
                    type="number" 
                    id="postalCode" 
                    name="postalCode" 
                    placeholder="Ej: 06100"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="Horario">Horario</label>
                  <Field 
                    type="text" 
                    id="Horario" 
                    name="Horario" 
                    placeholder="Ej: Lun-Vie 9:00-18:00"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="Horario" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold cursor-pointer" htmlFor="profileImage">Imagen de perfil</label>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    className="border p-2 rounded cursor-pointer"
                    onChange={(event) => {
                      setFieldValue("profileImage", event.currentTarget.files[0]);
                    }}
                  />
                  <ErrorMessage name="profileImage" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-4 p-2 rounded cursor-pointer text-white ${
                  isSubmitting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}