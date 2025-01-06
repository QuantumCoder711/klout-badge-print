import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const RootLayout: React.FC = () => {
    return (
        <main className='h-screen'>
            <Navbar />
            <div className='flex flex-1'>
                <Outlet />
            </div>
        </main>
    )
}

export default RootLayout;