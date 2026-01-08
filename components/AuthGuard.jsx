import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthGuard({ children }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Rutas públicas que no requieren autenticación
    const publicRoutes = [
        '/login',
        '/resetpass',
        '/resetLink',
        '/terminosyCondiciones',
        '/clientmenu',
        '/meseroMenu',
        '/',
    ];

    // Verificar si la ruta actual es pública
    const isPublicRoute = (pathname) => {
        // Verificar rutas exactas
        if (publicRoutes.includes(pathname)) {
            return true;
        }
        
        // Verificar rutas dinámicas como /webmenu/[uuid]
        if (pathname.startsWith('/webmenu/')) {
            return true;
        }
        
        // Verificar ruta de tickets externos /tickets/externalTicketView
        if (pathname.startsWith('/tickets/externalTicketView')) {
            return true;
        }
        
        return false;
    };

    useEffect(() => {
        // Solo ejecutar cuando el router esté listo
        if (!router.isReady) return;

        const checkAuth = () => {
            setIsChecking(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const currentPath = router.pathname;

            // Si es una ruta pública, permitir acceso
            if (isPublicRoute(currentPath)) {
                setIsAuthorized(true);
                setIsChecking(false);
                return;
            }

            // Si no hay token y no es ruta pública, redirigir a login
            if (!token) {
                setIsAuthorized(false);
                setIsChecking(false);
                router.push('/login');
                return;
            }

            // Si hay token, permitir acceso
            setIsAuthorized(true);
            setIsChecking(false);
        };

        // Verificar autenticación
        checkAuth();

        // Escuchar cambios de ruta
        const handleRouteChange = () => {
            checkAuth();
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.isReady, router.pathname]);

    // Mostrar loading mientras se verifica la autenticación
    if (isChecking || (!isAuthorized && !isPublicRoute(router.pathname))) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="mt-4 text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
