import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function RecuperacionLink() {
    const router = useRouter();

    const initialValues = {
        email: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Correo electrónico inválido")
            .required("Correo electrónico es requerido"),
    });

    const onSubmit = (values, { setSubmitting }) => {
        console.log(JSON.stringify(values));
        // Simular delay de envío
        setTimeout(() => {
            alert("Se ha enviado un enlace de recuperación a tu correo electrónico");
            setSubmitting(false);
            router.push("/login");
        }, 2000);
    };

    const goToLogin = () => {
        router.push("/login");
    };

    return (
        <>
            <Header />
            {/* Fondo con gradiente moderno - tonos verdes */}
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
                {/* Decoración de fondo - tonos verdes */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl"></div>
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-100 rounded-full opacity-30 blur-xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-lg"></div>
                    <div className="absolute top-3/4 left-20 w-16 h-16 bg-teal-100 rounded-full opacity-25 blur-md"></div>
                </div>
                
                {/* Card principal */}
                <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 backdrop-blur-sm z-10">
                    {/* Decoración superior - verde */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"></div>
                    </div>
                    
                    {/* Ícono de email - verde */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl text-center font-bold text-gray-800 mt-4">
                        Recuperar Contraseña
                    </h2>
                    <p className="text-center text-gray-600 text-sm mt-2 mb-6">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
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
                                        Correo electrónico
                                    </label>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="ejemplo@correo.com"
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                    />
                                    <ErrorMessage
                                        name="email"
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
                                            Enviando enlace...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Enviar Enlace de Recuperación
                                        </span>
                                    )}
                                </button>

                                {/* Información adicional - verde */}
                                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-xs text-green-700">
                                            <p className="font-medium mb-1">¿No recibes el correo?</p>
                                            <p>Revisa tu carpeta de spam o correo no deseado. El enlace será válido por 15 minutos.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Link para volver al login - verde */}
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={goToLogin}
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