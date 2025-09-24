import React, { useContext } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { AppContext } from '../context/AppContext'
import lele from '../assets/lele.svg'

const NavBar = () => {
  const { user, setShowLogin ,logout,credit} = useContext(AppContext)
  const navigate = useNavigate()

  return (
    <div className='flex items-center justify-between py-4'>
      {/* Logo */}
      <Link to='/'>
        <img src={lele} alt='logo' className='w-28 sm:w-32 lg:w-40' />
      </Link>

      <div>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Credit Button */}
            <button
              onClick={() => navigate('/buy')}
              className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full hover:scale-105 transition-all duration-300"
            >
              <img className="w-5" src={assets.credit_star} alt="" />
              <p>Credit left:{credit}</p>
            </button>

            {/* Greeting */}
            <p className='text-gray-600 max-sm:hidden pl-4'>
              Hi, {user.name}
            </p>

            {/* Profile Dropdown */}
            <div className="relative group">
              <img
                src={assets.profile_icon}
                className='w-10 drop-shadow cursor-pointer'
                alt="profile"
              />
              <div className='absolute hidden group-hover:block top-0 right-0 z-20 text-black rounded pt-12'>
                <ul className='list-none bg-red-100 p-2 m-0 rounded-md border text-sm min-w-[100px] shadow-md'>
                  <li  onClick={logout} className='py-1 px-2 cursor-pointer hover:bg-red-200 rounded'>
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-3 sm:gap-5'>
            <p
              onClick={() => navigate('/buy')}
              className='cursor-pointer hover:text-red-500 transition'
            >
              Pricing
            </p>

            <button
              onClick={() => setShowLogin(true)}
              className='bg-red-400 text-white px-6 sm:px-7 py-2 text-sm rounded-full hover:bg-red-500 transition'
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar
