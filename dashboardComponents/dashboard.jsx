import IdPedidos from './idpedidos';
import Navbar from './navbar';
import MainContentDasboard from './mainContentDasboard';
import Pedidos from './pedidos';
import Ventas from './ventas';

export default function Dashboard2() {
    return (
        <main className='w-full min-h-screen  flex flex-col'>
            <Navbar />
            
            <MainContentDasboard />
           
            
            

          


        </main>
    );
}