import React from 'react';
import { useRouter } from 'next/router';
import Form from './Form';

export default function FormContainer() {
    const router = useRouter();

    const login = () => {
        router.push('/login');
    }

    return (
        <section className='flex flex-col items-center justify-center px-4 md:px-30 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50' id='registro'>
            <div className='w-full max-w-2xl'>
                <div className='bg-gradient-to-r from-green-400 to-emerald-400 p-6 rounded-t-xl flex flex-col shadow-lg border-t-2 border-x-2 border-green-300'>
                    <h3 className='font-bold text-2xl text-white drop-shadow-md'>
                        Regístrate Ahora
                    </h3>
                    <p className='text-md text-white/90 font-medium mt-1'>
                        Comienza a gestionar tus pedidos hoy mismo
                    </p>
                </div>

                <div className='flex flex-col items-center justify-center gap-6 bg-white rounded-b-xl shadow-2xl p-8 border-b-4 border-x-2 border-green-200'>
                    <Form />

                    <p className="text-gray-600 font-medium">
                        ¿Ya tienes una cuenta? {" "}
                        <span 
                            className='text-green-500 font-bold cursor-pointer hover:text-emerald-600 transition-colors duration-200' 
                            onClick={login}
                        >
                            Iniciar Sesión
                        </span>
                    </p>
                </div>
            </div>
        </section>
    )
}