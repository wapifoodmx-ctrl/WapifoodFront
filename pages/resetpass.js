import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { cambiarPass } from "../useCases/cambiarPass";

export default function ResetPass() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isValidToken, setIsValidToken] = useState(true);

  // Extraer el token de los query params
  useEffect(() => {
    if (router.isReady) {
      const { token: queryToken } = router.query;
      if (queryToken) {
        setToken(queryToken);
        console.log('Token extraído:', queryToken);
      } else {
        setIsValidToken(false);
        setErrorMessage("Token de recuperación no válido o expirado");
      }
    }
  }, [router.isReady, router.query]);

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

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      // Limpiar mensajes previos
      setSuccessMessage("");
      setErrorMessage("");

      if (!token) {
        setErrorMessage("Token de recuperación no válido");
        setSubmitting(false);
        return;
      }

      console.log('Enviando datos:', JSON.stringify({ 
        token: token, 
        new_password: values.newPassword 
      }));

      const result = await cambiarPass(token, values.newPassword);

      if (result.success) {
        setSuccessMessage("Contraseña actualizada exitosamente. Redirigiendo al login...");
        // Redirigir después de un tiempo
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErrorMessage(result.error || "Error al actualizar la contraseña");
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  // Si no hay un token válido, mostrar mensaje de error
  if (!isValidToken) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-red-100 backdrop-blur-sm z-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl text-center font-bold text-red-700 mt-4">
              Enlace no válido
            </h2>
            <p className="text-center text-gray-600 text-sm mt-2 mb-6">
              El enlace de recuperación no es válido o ha expirado.
            </p>
            
            <button
              onClick={login}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {/* Fondo con gradiente moderno */}
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Decoración de fondo */}
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

          {/* Mensajes de éxito y error */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            </div>
          )}
          
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
                  disabled={isSubmitting || !token}
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
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      Actualizar Contraseña
                    </span>
                  )}
                </button>

                {/* Información de seguridad */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs text-blue-700">
                      <p className="font-medium mb-1">Consejos de seguridad:</p>
                      <p>• Usa al menos 6 caracteres</p>
                      <p>• Combina letras, números y símbolos</p>
                      <p>• No uses información personal</p>
                    </div>
                  </div>
                </div>

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
