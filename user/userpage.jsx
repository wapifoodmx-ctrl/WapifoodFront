import { TbWorldShare } from "react-icons/tb";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import Image from "next/image";
import Miokon from "@/pages/assets/images/Miokon.png";
import Navbar from "@/dashboardComponents/navbar";

// Validaciones con Yup
const personalInfoSchema = Yup.object().shape({
  telephone: Yup.string().required("Teléfono es requerido"),
  profileImage: Yup.mixed().required("La imagen de perfil es requerida"),
});

// Componente principal
export default function UserPage() {
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
            <p className="font-bold text-xl">Juan Días Rodriguez</p>
          </div>
          <div className="border-b-1 w-full border-gray-500"></div>
        </div>
        <div className="pt-2 flex flex-col justify-center items-center md:flex-row ">
          <p className="flex gap-2">| <IoLocationOutline className="text-xl self-center" /> CDMX, México |</p>
          <p className="flex gap-2">| <CiMail className="text-xl self-center" /> juan.dias@ejemplo.com |</p>
          <p className="flex gap-2">| <FaPhoneAlt className="text-xl self-center" /> +56912345678 |</p>
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
                    placeholder="Ej: https://api.whatsapp.com/message/DJESQM3TOQH5G1?autoload=1&app_absent=0"
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