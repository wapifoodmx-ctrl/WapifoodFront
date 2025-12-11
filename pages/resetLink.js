import Head from 'next/head';
import RecuperacionLink from '../recuperacionComponents/recuperacionLink';
export default function ResetPass() {
  
  return (
    <>
    <Head>
                    <title>Recuperación de Contraseña - WapiFood</title>
                    <meta name="description" content="Recupera el acceso a tu cuenta" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
    
    <RecuperacionLink />
    </>
  );
}
