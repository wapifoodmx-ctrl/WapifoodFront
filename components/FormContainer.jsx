import React from 'react';
import Form from './Form';

export default function FormContainer() {
    return (
            <section className='flex flex-col items-center justify-center py-16 md:px-30'>

                <div className='bg-[#3fe283] w-8/12 p-4 rounded-t-lg flex flex-col '>
                    <h3 className='font-bold text-xl'>
                        Registrate Ahora
                    </h3>
                    <p className='text-sm'>
                        Comienza a gestionar tus pedidos hoy mismo
                    </p>

                </div>

                <div className='flex flex-col items-center justify-center gap-4 bg-white k w-8/12 p-4 rounded-b-lg shadow-lg '>

                    <Form />

                    <p>¿Ya tienes una cuenta? <span> <a href="#" className='text-[#3fe283]'> Iniciar Sesión</a></span> </p>
                </div>
            </section>
    )
}