import React from 'react';
import LogoFull from "/logo-full.png";
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {

  const handleLogout = (): void => {
    localStorage.removeItem("klout-badge-print");
    window.location.reload();
  }

  return (
    <header className='sticky top-0 w-full backdrop-blur'>
      <nav className='px-5 py-2 shadow-lg flex justify-between items-center'>
        {/* <h3 className='text-zinc-500 text-xl sm:text-3xl uppercase'>Klout Club</h3> */}
        <Link to="/">
          <img src={LogoFull} alt="Klout Club" className='max-h-10 cursor-pointer' />
        </Link>
        <div className='flex gap-3 items-center'>
          {/* <img src={User} alt="user" width={32} height={32} className='border-2 rounded-full border-sky-600' /> */}
          <button onClick={handleLogout} className='px-4 py-2 bg-red-500 text-white rounded-lg'>Logout</button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar;