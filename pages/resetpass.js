import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function ResetPass() {
  const router = useRouter();
  const login = () => {
    router.push('/login');
  }

  const initialValues = {
    newPassword: "",
    confirmNewPassword: "",
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("Nueva contraseña es requerida"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Las contraseñas deben coincidir")
      .required("Confirmar nueva contraseña es requerida"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log(JSON.stringify(values));
    setSubmitting(false);
    login();
  };

  return (
    <>
      <Header />
      {/* Fondo con gradiente moderno - sin patrón SVG problemático */}
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Decoración de fondo alternativa */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-30 blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-100 rounded-full opacity-30 blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-100 rounded-full opacity-20 blur-lg"></div>
        </div>
        
        {/* Card principal */}
        <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 backdrop-blur-sm z-10">
          {/* Decoración superior */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg"></div>
          </div>
          
          {/* Ícono de seguridad */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl text-center font-bold text-gray-800 mt-4">
            Nueva Contraseña
          </h2>
          <p className="text-center text-gray-600 text-sm mt-2 mb-6">
            Ingresa tu nueva contraseña para completar el proceso
          </p>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva contraseña
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    placeholder="Ingresa tu nueva contraseña"
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <Field
                    type="password"
                    name="confirmNewPassword"
                    placeholder="Confirma tu nueva contraseña"
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                  <ErrorMessage
                    name="confirmNewPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Actualizando...
                    </span>
                  ) : (
                    'Actualizar Contraseña'
                  )}
                </button>

                {/* Link para volver al login */}
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={login}
                    className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200"
                  >
                    ← Volver al inicio de sesión
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
