import React from 'react';
import User from "/user.jpg";

const Navbar: React.FC = () => {

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <header className='sticky top-0 w-full backdrop-blur'>
      <nav className='p-5 shadow-lg flex justify-between items-center'>
        <h3 className='text-zinc-500 text-3xl uppercase'>Klout Club</h3>
        <div className='flex gap-3 items-center'>
          <img src={User} alt="user" width={32} height={32} className='border-2 rounded-full border-sky-600' />
          <button onClick={handleLogout} className='px-4 py-2 bg-red-500 text-white rounded-lg'>Logout</button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar;