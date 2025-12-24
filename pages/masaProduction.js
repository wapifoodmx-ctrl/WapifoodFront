import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function MasaProduction() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simular carga inicial
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-green-700">Cargando producción de masa...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Producción de Masa | WapiFood</title>
                <meta name="description" content="Sistema de producción de masa para WapiFood" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
                                Producción de Masa
                            </h1>
                            <div className="text-center text-gray-600">
                                <p className="mb-4">Esta funcionalidad está en desarrollo.</p>
                                <p>Próximamente podrás gestionar la producción de masa aquí.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
