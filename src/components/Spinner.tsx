import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className='w-full h-full grid place-content-center'>
            <div className='w-10 h-10 p-2 rounded-full border-t-4 border-teal-500 bg-zinc-100 animate-spin' />
        </div>
    )
}

export default Spinner;