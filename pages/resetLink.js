import Head from 'next/head';
import RecuperacionLink from '../recuperacionComponents/recuperacionLink';
export default function ResetPass() {
  
  return (
    <>
    <Head>
                    <title>Recuperción de link - WapiFood</title>
                    <meta name="description" content="Vista de cocina para gestionar órdenes en tiempo real" />
                </Head>
    
    <RecuperacionLink />
    </>
  );
}
