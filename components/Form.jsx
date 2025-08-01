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
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 shadow-sm mb-4 font-medium">
                                {serverError}
                            </div>
                        )}

                        {/* Mensaje de éxito */}
                        {successMessage && (
                            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg border border-green-200 shadow-sm mb-4 font-medium">
                                {successMessage}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-green-800 font-bold mb-1">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                className={`mt-1 block w-full border p-3 ${errors.name && touched.name ? 'border-red-500' : 'border-green-300'} rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all duration-200 outline-none`}
                                placeholder="Ingresa tu nombre"
                            />
                            {errors.name && touched.name && (
                                <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block font-bold text-green-800 mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className={`mt-1 block w-full p-3 border ${errors.email && touched.email ? 'border-red-500' : 'border-green-300'} rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all duration-200 outline-none`}
                                placeholder="usuario@ejemplo.com"
                            />
                            {errors.email && touched.email && (
                                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block font-bold text-green-800 mb-1">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                className={`mt-1 block w-full border p-3 ${errors.password && touched.password ? 'border-red-500' : 'border-green-300'} rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all duration-200 outline-none`}
                                placeholder="••••••"
                            />
                            {errors.password && touched.password && (
                                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block font-bold text-green-800 mb-1">Confirmar Contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmPassword}
                                className={`mt-1 block w-full border p-3 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-green-300'} rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all duration-200 outline-none`}
                                placeholder="••••••"
                            />
                            {errors.confirmPassword && touched.confirmPassword && (
                                <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-4 w-full rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold shadow-lg p-3 text-xl hover:scale-105 hover:from-green-500 hover:to-emerald-500 transition-all duration-200 border-2 border-green-300 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSubmitting ? 'Enviando...' : 'Registrarme'}
                        </button>
                    </form>
                )}
            </Formik>
        </div>
    );
}