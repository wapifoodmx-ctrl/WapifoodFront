import IdPedidos from './idpedidos';
import { useRouter } from 'next/router';
import Navbar from './navbar';
import MainContentDasboard from './mainContentDasboard';
import Pedidos from './pedidos';
import Ventas from './ventas';

export default function Dashboard2() {
    return (
        <main className='w-full min-h-screen  grid grid-rows-[100px_1fr]'>
            <Navbar />
            
            <MainContentDasboard />
           
            
            

          


        </main>
    );
}