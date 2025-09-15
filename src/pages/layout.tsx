import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { fetchEvents } from '../store/slices/eventSlice';

const RootLayout: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Fetch events when the app loads
        dispatch(fetchEvents());
    }, [dispatch]);

    return (
        <main className='h-screen flex flex-col'>
            <Navbar />
            <div className='flex flex-1'>
                <Outlet />
            </div>
        </main>
    )
}

export default RootLayout;