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
  phone: Yup.string().required("Teléfono es requerido"),
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
        <div className="space-y-2 mt-2 flex flex-col justify-center items-center">
          <p className="flex gap-2"><CiMail className="text-xl self-center" /> juan.dias@ejemplo.com</p>
          <p className="flex gap-2"><FaPhoneAlt className="text-xl self-center" /> +56912345678</p>
          <p className="flex gap-2"><IoLocationOutline className="text-xl self-center" /> CDMX, México</p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <Formik
          initialValues={{
            name: "",
            lastName: "",
            email: "",
            phone: "",
            position: "",
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
              <div className="grid grid-cols-1 md:grid-cols-2 space-y-2">
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="name">Nombre del restaurante</label>
                  <Field type="text" id="name" name="name" className="border p-2 rounded" />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="lastName">Calle y número</label>
                  <Field type="text" id="lastName" name="lastName" className="border p-2 rounded" />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="email">Colonia</label>
                  <Field type="email" id="email" name="email" className="border p-2 rounded" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="phone">Delegación</label>
                  <Field type="tel" id="phone" name="phone" className="border p-2 rounded" />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="position">Teléfono</label>
                  <Field type="text" id="position" name="position" className="border p-2 rounded" />
                  <ErrorMessage name="position" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="position">WhatsApp</label>
                  <Field type="text" id="position" name="position" className="border p-2 rounded" />
                  <ErrorMessage name="position" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex flex-col pr-4">
                  <label className="font-bold" htmlFor="profileImage">Imagen de perfil</label>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
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