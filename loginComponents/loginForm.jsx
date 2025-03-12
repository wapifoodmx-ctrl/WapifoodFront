import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoDocumentTextOutline } from "react-icons/io5";



const LoginForm = () => {
    const router = useRouter();

    const login = () => {
        router.push('/login');
    }

    const resetPass = () => {
        router.push('/resetLink');
    }

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

    const onSubmit = (values, { setSubmitting }) => {
        console.log(JSON.stringify(values));
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
        if (values.rememberMe) {
            localStorage.setItem('token', 'your-token-here');
        } else {
            sessionStorage.setItem('token', 'your-token-here');
        }
        setSubmitting(false);
        router.push('/dashboard');
    };

    return (

        <div className="flex justify-center items-center h-screen flex-col gap-4 ">
            <h2 className="text-4xl text-center font-bold text-black pb-4">Iniciar Sesión en comandapp</h2>
            <p className='text-2xl'>Ingresa tus credenciales para acceder a tu cuenta</p>

            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex flex-col gap-7 mt-4" >
                            <div className=' text-[#3fe283] text-4xl flex justify-center'>

                                <div className='bg-[#3fe283] text-white p-2 rounded-lg'>
                                    <IoDocumentTextOutline size={32} />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label >Ingresa tu correo electrónico</label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label >Ingresa tu contraseña</label>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className="flex items-center gap-4 ">
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
                                >¿Olvidaste tu contraseña?</p>


                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginForm;