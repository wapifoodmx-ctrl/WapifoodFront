import { useRouter } from 'next/router';
import Navbar from './navbar';
import MainContentDasboard from './mainContentDasboard';
export default function Dashboard2() {
    return (
        <main className='w-full min-h-screen bg-black grid grid-rows-[100px_1fr]'>
            <Navbar />
            <MainContentDasboard />
            
        </main>
    );
}