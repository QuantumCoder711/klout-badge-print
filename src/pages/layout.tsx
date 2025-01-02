import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const RootLayout: React.FC = () => {
    return (
        <main>
            <Navbar />
            <div className='p-5'>
                <Outlet />
            </div>
        </main>
    )
}

export default RootLayout;