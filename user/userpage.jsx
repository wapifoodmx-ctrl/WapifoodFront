import { TbWorldShare } from "react-icons/tb";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneAlt, FaCheckCircle } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import Image from "next/image";
import Navbar from "@/dashboardComponents/navbar";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/useCases/getUserInfo";
import { patchUserInfo } from "@/useCases/patchUserInfo";
import Profile from "@/pages/assets/images/Profile.jpg";
import { useRouter } from 'next/router';

// Validaciones con Yup
const personalInfoSchema = Yup.object().shape({
  telephone: Yup.string()
    .matches(/^\d{10}$/, 'El teléfono debe tener exactamente 10 números')
    .required("Teléfono es requerido"),
  restaurantName: Yup.string().required("Nombre del restaurante es requerido"),
  confirmationCode: Yup.string()
    .matches(/^\d{4}$/, 'El código debe tener exactamente 4 números')
    .test('positive-numbers', 'Solo se permiten números positivos (1-9)', function(value) {
      if (!value) return true; // Campo opcional
      return /^[1-9]{4}$/.test(value);
    }),
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

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
        horario: values.horario,
        codigo_confirmacion: values.confirmationCode ? parseInt(values.confirmationCode) : null,
      };

      const updatedUser = await patchUserInfo(updateData);
      console.log('Datos actualizados:', updatedUser);
      
      // Actualizar el estado local con los nuevos datos
      setUserInfo(updatedUser);
      
      // Mostrar modal de éxito en lugar de alert
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la información');
    } finally {
      setSubmitting(false);
    }
  };

  // Función para cerrar el modal de éxito
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
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
      
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="mb-4">
              <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ¡Información actualizada exitosamente!
            </h3>
            <p className="text-gray-600 mb-6">
              Todos tus cambios han sido guardados correctamente.
            </p>
            <button
              onClick={closeSuccessModal}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      <div className="flex space-x-4 p-4">
        <h2 className="font-bold text-2xl">Mi Perfil</h2>
      </div>
      <div className='bg-white shadow-md rounded-lg p-4'>
        <div className="flex flex-col items-center">
          <div className='w-20 h-20 rounded-full overflow-hidden mb-3'>
            <Image 
              src={userInfo?.image_user?.url || Profile} 
              alt= "Imagen de perfil" 
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
        <div className="pt-4 flex flex-col justify-center items-center space-y-2">
          {/* Vista móvil - elementos apilados */}
          <div className="md:hidden flex flex-col space-y-2 w-full max-w-md">
            {/* Dirección */}
            <div className="px-2">
              <div className="flex justify-center items-start gap-2 text-center">
                <span className="text-gray-600 flex-shrink-0">|</span>
                <div className="flex flex-col items-center min-w-0 flex-1">
                  <IoLocationOutline className="text-xl text-green-600 mb-1" />
                  <span className="text-sm break-words leading-tight">
                    {getFullAddress(userInfo)}
                  </span>
                </div>
                <span className="text-gray-600 flex-shrink-0">|</span>
              </div>
            </div>

            {/* Email */}
            <div className="px-2">
              <div className="flex justify-center items-center gap-2 text-center">
                <span className="text-gray-600 flex-shrink-0">|</span>
                <div className="flex items-center justify-center min-w-0 flex-1 gap-2">
                  <CiMail className="text-xl text-green-600 flex-shrink-0" />
                  <span className="text-sm break-words">
                    {getCleanValue(userInfo?.email) || "email@ejemplo.com"}
                  </span>
                </div>
                <span className="text-gray-600 flex-shrink-0">|</span>
              </div>
            </div>

            {/* Teléfono */}
            <div className="px-2">
              <div className="flex justify-center items-center gap-2 text-center">
                <span className="text-gray-600 flex-shrink-0">|</span>
                <div className="flex items-center justify-center min-w-0 flex-1 gap-2">
                  <FaPhoneAlt className="text-xl text-green-600 flex-shrink-0" />
                  <span className="text-sm break-words">
                    {getCleanValue(userInfo?.telefono) || "Sin teléfono"}
                  </span>
                </div>
                <span className="text-gray-600 flex-shrink-0">|</span>
              </div>
            </div>

            {/* Enlace al menú digital */}
            <div className="px-2">
              <div className="flex justify-center items-center gap-2 text-center">
                <span className="text-gray-600 flex-shrink-0">|</span>
                <div className="flex items-center justify-center min-w-0 flex-1 gap-2">
                  <TbWorldShare className="text-xl text-green-600 flex-shrink-0" />
                  <button 
                    onClick={() => router.push(`/webmenu/${userInfo?.user_uuid}`)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
                  >
                    Tu menú digital
                  </button>
                </div>
                <span className="text-gray-600 flex-shrink-0">|</span>
              </div>
            </div>
          </div>

          {/* Vista desktop - todo en una línea */}
          <div className="hidden md:flex items-center justify-center gap-1 text-center flex-wrap">
            <span className="text-gray-600">|</span>
            <IoLocationOutline className="text-xl text-green-600" />
            <span className="text-sm">
              {getFullAddress(userInfo)}
            </span>
            <span className="text-gray-600">|</span>
            <CiMail className="text-xl text-green-600" />
            <span className="text-sm">
              {getCleanValue(userInfo?.email) || "email@ejemplo.com"}
            </span>
            <span className="text-gray-600">|</span>
            <FaPhoneAlt className="text-xl text-green-600" />
            <span className="text-sm">
              {getCleanValue(userInfo?.telefono) || "Sin teléfono"}
            </span>
            <span className="text-gray-600">|</span>
            <TbWorldShare className="text-xl text-green-600" />
            <a 
              className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
              href={`http://localhost:3000/webmenu/${userInfo?.user_uuid || ''}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tu menú digital
            </a>
            <span className="text-gray-600">|</span>
          </div>
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
            horario: getCleanValue(userInfo?.horario),
            confirmationCode: getCleanNumber(userInfo?.codigo_confirmacion),
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
                  <label className="font-bold" htmlFor="restaurantName">
                    Nombre del restaurante <span className="text-red-500">*</span>
                  </label>
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
                  <label className="font-bold" htmlFor="telephone">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <Field 
                    type="tel" 
                    id="telephone" 
                    name="telephone" 
                    placeholder="Ej: 5512345678"
                    maxLength="10"
                    className="border p-2 rounded" 
                    onInput={(e) => {
                      // Solo permitir números
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      // Limitar a 10 caracteres
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }}
                  />
                  <ErrorMessage name="telephone" component="div" className="text-red-500 text-sm" />
                  <p className="text-gray-500 text-xs mt-1">Solo números, máximo 10 dígitos</p>
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
                    type="text" 
                    id="postalCode" 
                    name="postalCode" 
                    placeholder="Ej: 06100"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="horario">Horario</label>
                  <Field 
                    type="text" 
                    id="horario" 
                    name="horario" 
                    placeholder="Ej: Lun-Vie 9:00-18:00"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="horario" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Nuevo campo: Código de confirmación */}
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="confirmationCode">
                    Código de confirmación
                  </label>
                  <Field 
                    type="text" 
                    id="confirmationCode" 
                    name="confirmationCode" 
                    placeholder="Ej: 1234"
                    maxLength="4"
                    className="border p-2 rounded" 
                    onInput={(e) => {
                      // Solo permitir números del 1-9
                      e.target.value = e.target.value.replace(/[^1-9]/g, '');
                      // Limitar a 4 caracteres
                      if (e.target.value.length > 4) {
                        e.target.value = e.target.value.slice(0, 4);
                      }
                    }}
                  />
                  <ErrorMessage name="confirmationCode" component="div" className="text-red-500 text-sm" />
                  <p className="text-gray-500 text-xs mt-1">4 números del 1 al 9 (opcional)</p>
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
                className={`p-2 rounded font-bold text-white ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
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
