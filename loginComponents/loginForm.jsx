import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GoChecklist } from "react-icons/go";
import { loginUser } from '@/useCases/login';

const LoginForm = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState(''); // Estado para manejar errores del servidor

    const resetPass = () => {
        router.push('/resetLink');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
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
        setServerError(''); // Limpiar errores previos
        try {
            const response = await loginUser(values); // Llamada a la función de login

            if (response.ok) {
                // Parsear el JSON de la respuesta
                const data = await response.json();

                if (data.access_token) {
                    // Guarda el token en localStorage o sessionStorage según corresponda
                    if (values.rememberMe) {
                        localStorage.setItem('token', data.access_token);
                    } else {
                        sessionStorage.setItem('token', data.access_token);
                    }
                    // Redirige al dashboard
                    router.push('/dashboard');
                } else {
                    // Si no hay access_token en la respuesta, muestra un error
                    setServerError('No se recibió un token válido. Por favor, intenta nuevamente.');
                }
            } else {
                // Si la respuesta no es satisfactoria, muestra un mensaje de error
                setServerError('Usuario y/o contraseña incorrectos. Por favor, verifica tus credenciales.');
            }
        } catch (error) {
            // Manejo de errores de red u otros problemas
            setServerError('Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen flex-col gap-4 mt-10 px-4">
            <h2 className="text-4xl text-center font-bold text-black pb-4">Iniciar Sesión en Comandapp</h2>
            <p className='text-2xl text-center'>Ingresa tus credenciales para acceder a tu cuenta</p>

            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex flex-col gap-4 mt-4">
                            <div className='text-[#3fe283] text-4xl flex justify-center'>
                                <div className='bg-[#3fe283] text-white p-2 rounded-lg'>
                                    <GoChecklist size={32} />
                                </div>
                            </div>

                            {/* Mensaje de error del servidor */}
                            {serverError && (
                                <div className="text-red-500 text-sm mb-2 text-center">
                                    {serverError}
                                </div>
                            )}

                            <div className='flex flex-col gap-2'>
                                <label>Ingresa tu correo electrónico</label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label>Ingresa tu contraseña</label>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Field
                                    type="checkbox"
                                    name="rememberMe"
                                    className="mr-2 h-[24px] w-[24px]"
                                />
                                <label htmlFor="rememberMe" className="text-black">Recordar</label>
                            </div>
                            <div className='flex flex-col gap-4'>
                                <button
                                    type="submit"
                                    className="bg-[#3fe283] text-white p-2 rounded-lg"
                                    disabled={isSubmitting}
                                >
                                    Iniciar Sesión
                                </button>

                                <p
                                    className='text-[#3fe283] cursor-pointer'
                                    onClick={resetPass}
                                >
                                    ¿Olvidaste tu contraseña?
                                </p>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginForm;