import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GoChecklist } from "react-icons/go";
import { loginUser } from '@/useCases/login';

const LoginForm = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetPass = () => {
        router.push('/resetLink');
    };

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    const initialValues = {
        email: '',
        password: '',
        rememberMe: false,
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Correo electrónico inválido').required('Correo electrónico es requerido'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida'),
        rememberMe: Yup.boolean(),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        setServerError('');
        setIsLoading(true);
        console.log('Valores del formulario:', values);
        try {
            const response = await loginUser(values);

            if (response.ok) {
                const data = await response.json();

                if (data.access_token) {
                    if (values.rememberMe) {
                        localStorage.setItem('token', data.access_token);
                    } else {
                        sessionStorage.setItem('token', data.access_token);
                    }
                    router.push('/dashboard');
                } else {
                    setServerError('No se recibió un token válido. Por favor, intenta nuevamente.');
                }
            } else {
                setServerError('Usuario y/o contraseña incorrectos. Por favor, verifica tus credenciales.');
            }
        } catch (error) {
            setServerError('Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.');
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Fondo con gradiente moderno - tonos verdes */}
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
                {/* Decoración de fondo - tonos verdes */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl"></div>
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-100 rounded-full opacity-30 blur-xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-lg"></div>
                    <div className="absolute top-3/4 left-20 w-16 h-16 bg-teal-100 rounded-full opacity-25 blur-md"></div>
                </div>

                {/* Card principal */}
                <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 backdrop-blur-sm z-10">
                    {/* Decoración superior */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"></div>
                    </div>

                    {/* Logo e ícono central */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                            <GoChecklist size={32} className="text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl text-center font-bold text-gray-800 mb-2">
                        Iniciar Sesión
                    </h2>
                    <p className="text-center text-gray-600 text-sm mb-6">
                        Ingresa tus credenciales para acceder a WapiFood
                    </p>

                    {/* Loader */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-green-200 rounded-full animate-spin"></div>
                                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
                            </div>
                        </div>
                    ) : (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form className="flex flex-col gap-4">
                                    {/* Mensaje de error del servidor */}
                                    {serverError && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                                            {serverError}
                                        </div>
                                    )}

                                    {/* Campo de email */}
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
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* Campo de contraseña */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contraseña
                                        </label>
                                        <Field
                                            type="password"
                                            name="password"
                                            placeholder="Tu contraseña"
                                            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                        />
                                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* Checkbox recordar */}
                                    <div className="flex items-center gap-3 mt-2">
                                        <Field
                                            type="checkbox"
                                            name="rememberMe"
                                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                        />
                                        <label htmlFor="rememberMe" className="text-sm text-gray-700">
                                            Recordar sesión
                                        </label>
                                    </div>

                                    {/* Botón de inicio de sesión */}
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Iniciando sesión...
                                            </span>
                                        ) : (
                                            'Iniciar Sesión'
                                        )}
                                    </button>

                                    {/* Link de recuperación */}
                                    <div className="text-center mt-4">
                                        <button
                                            type="button"
                                            onClick={resetPass}
                                            className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
        </>
    );
};

export default LoginForm;