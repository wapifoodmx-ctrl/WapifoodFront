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

// Validaciones con Yup
const personalInfoSchema = Yup.object().shape({
  telephone: Yup.string().required("Teléfono es requerido"),
  profileImage: Yup.mixed().required("La imagen de perfil es requerida"),
});

// Componente principal
export default function UserPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        // console.log('Datos del usuario:', data);
        const user= data.user_info;
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
            <Image src={Miokon} alt="Imagen de perfil" width={80} height={80} className="object-cover" />
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-xl">{userInfo.nombre}</p>
          </div>
          <div className="border-b-1 w-full border-gray-500"></div>
        </div>
        <div className="pt-2 flex flex-col justify-center items-center md:flex-row ">
          <p className="flex gap-2">| <IoLocationOutline className="text-xl self-center" />{`${userInfo.direccion} ${userInfo.ciudad} ${userInfo.codigo_postal} ${userInfo.alcaldia}`} |</p>
          <p className="flex gap-2">| <CiMail className="text-xl self-center" /> {`${userInfo.email}`} |</p>
          <p className="flex gap-2">| <FaPhoneAlt className="text-xl self-center" /> {`${userInfo.telefono}`} |</p>
          <a className="flex gap-2 cursor-pointer">| <TbWorldShare className="text-xl self-center"/> www |</a>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <Formik
          initialValues={{
            restaurantName: "",
            street: "",
            neighborhood: "",
            delegation: "",
            telephone: "",
            whatsapp: "",
            profileImage: null,
          }}
          validationSchema={personalInfoSchema}
          onSubmit={(values) => {
            console.log("Datos Personales:", values);
          }}
        >
          {({ setFieldValue }) => (
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
                    value={userInfo.nombre_restaurante || ""}
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
                    value={userInfo.direccion || ""}
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
                    value={userInfo.ciudad || ""}
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
                    value={userInfo.alcaldia || ""}
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
                    value={userInfo.telefono || ""}
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
                    value={userInfo.whatsapp || ""}
                    placeholder="Ej: https://api.whatsapp.com/message/DJESQM3TOQH5G1"
                    className="border p-2 rounded" 
                  />
                  <ErrorMessage name="whatsapp" component="div" className="text-red-500 text-sm" />
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
              <button type="submit" className="mt-4 bg-green-500 text-white p-2 rounded cursor-pointer">Guardar Cambios</button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}