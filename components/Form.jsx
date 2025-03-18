import { Formik } from 'formik';
import * as Yup from 'yup';
import { createUser } from '@/useCases/createUser';
import { useState } from 'react';

export default function Form() {
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    return (
        <div className="w-full">
            <Formik
                initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .max(35, 'Debe tener 35 caracteres o menos')
                        .min(3, 'Debe tener al menos 3 caracteres')
                        .required('Requerido'),
                    email: Yup.string()
                        .email('Dirección de correo inválida')
                        .required('Requerido'),
                    password: Yup.string()
                        .min(6, 'Debe tener al menos 6 caracteres')
                        .required('Requerido'),
                    confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
                        .required('Requerido'),
                })}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    setServerError(''); // Limpiar errores previos
                    setSuccessMessage(''); // Limpiar mensajes de éxito previos
                    try {
                        const response = await createUser(values);
                        setSuccessMessage('Usuario creado satisfactoriamente'); // Mostrar mensaje de éxito
                        resetForm(); // Reiniciar el formulario
                    } catch (error) {
                        setServerError(error.message || 'Ocurrió un error al crear el usuario');
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg w-full">
                        {/* Mensaje de error del servidor */}
                        {serverError && (
                            <div className="text-red-500 text-sm mb-2">
                                {serverError}
                            </div>
                        )}

                        {/* Mensaje de éxito */}
                        {successMessage && (
                            <div className="text-green-600 text-sm mb-2">
                                {successMessage}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-black font-bold">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                className={`mt-1 block w-full border p-2 ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            />
                            {errors.name && touched.name && (
                                <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block font-bold text-black">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className={`mt-1 block w-full p-2 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            />
                            {errors.email && touched.email && (
                                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block font-bold text-black">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                className={`mt-1 block w-full border p-2 ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            />
                            {errors.password && touched.password && (
                                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block font-bold text-black">Confirmar Contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmPassword}
                                className={`mt-1 block w-full border p-2 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            />
                            {errors.confirmPassword && touched.confirmPassword && (
                                <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-4 w-full bg-[#95edba] text-black py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Enviar
                        </button>
                    </form>
                )}
            </Formik>
        </div>
    );
}