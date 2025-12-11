import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GoChecklist } from "react-icons/go";

const loginMeseroValidationSchema = Yup.object({
    email: Yup.string().email('Correo electrónico inválido').required('Correo electrónico es requerido'),
    access_code: Yup.string()
        .matches(/^[0-9]{6}$/, 'El código debe tener 6 dígitos')
        .required('Código de acceso es requerido'),
});

export default function LoginMeseroModal({ isOpen, onLogin, serverError, isLoading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-[1000]">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className='text-[#3fe283] text-4xl flex justify-center mb-4'>
                            <div className='bg-[#3fe283] text-white p-2 rounded-lg'>
                                <GoChecklist size={32} />
                            </div>
                        </div>
                        <h2 className="text-2xl text-center font-bold text-black mb-2">Iniciar Sesión - Mesero</h2>
                        <p className='text-center text-gray-600 mb-4'>Ingresa tus credenciales de mesero para acceder</p>
                        
                        <Formik
                            initialValues={{
                                email: '',
                                access_code: '',
                            }}
                            validationSchema={loginMeseroValidationSchema}
                            onSubmit={onLogin}
                        >
                            {({ isSubmitting }) => (
                                <Form className="flex flex-col gap-4">
                                    {serverError && (
                                        <div className="text-red-500 text-sm mb-2 text-center">
                                            {serverError}
                                        </div>
                                    )}

                                    <div className='flex flex-col gap-2'>
                                        <label>Correo electrónico del restaurante</label>
                                        <Field
                                            type="email"
                                            name="email"
                                            placeholder="correo@restaurante.com"
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    
                                    <div className='flex flex-col gap-2'>
                                        <label>Código de Acceso</label>
                                        <Field
                                            type="password"
                                            name="access_code"
                                            placeholder="123456"
                                            maxLength="6"
                                            className="p-2 border border-gray-300 rounded-lg w-full text-center text-2xl tracking-widest"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Ingresa tu código de 6 dígitos</p>
                                        <ErrorMessage name="access_code" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        className="bg-[#3fe283] text-white p-2 rounded-lg hover:bg-green-600 transition-colors mt-2"
                                        disabled={isSubmitting}
                                    >
                                        Iniciar Sesión
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </>
                )}
            </div>
        </div>
    );
}
