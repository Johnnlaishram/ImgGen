import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState("login") // default state
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === 'login') {
        // login logic
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          setToken(data.token)
          localStorage.setItem('token', data.token)
          setUser(data.user)
          setShowLogin(false)
        } else {
          toast.error(data.message)
        }
      } else {
        // signup logic
        if (password !== confirmPassword) {
          return toast.error("Passwords do not match")
        }

        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) {
          setToken(data.token)
          localStorage.setItem('token', data.token)
          setUser(data.user)
          setShowLogin(false)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden' // Disable scrolling when modal is open
    return () => {
      document.body.style.overflow = 'unset' // Enable scrolling when modal is closed
    }
  }, [state])

  return (
    <motion.div
      className='absolute top-0 left-0 z-10 w-full h-screen flex items-center justify-center backdrop-blur-sm bg-black/30 bg-opacity-30'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form onSubmit={onSubmitHandler}
        className='relative bg-white p-8 rounded-lg shadow-lg flex flex-col gap-6 w-96'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt="close"
          className='absolute top-4 right-4 cursor-pointer w-5 h-5'
        />

        <h1 className='text-center text-2xl text-neutral-700 font-medium'>
          {state === "login" ? "Login" : "Sign Up"}
        </h1>
        <p className='text-sm text-neutral-500 text-center'>
          {state === "login"
            ? "Welcome back! Please login to continue"
            : "Welcome! Please create your account"}
        </p>

        {state !== "login" && (
          <div className='flex items-center border-b py-2'>
            <img src={assets.profile_icon} alt='user' className='w-5 h-5 mr-2' />
            <input onChange={e => setName(e.target.value)} value={name} type='text' placeholder='Enter username' className='flex-1 text-black outline-none bg-transparent' />
          </div>
        )}

        <div className='flex items-center border-b py-2'>
          <img src={assets.email_icon} alt='email' className='w-5 h-5 mr-2' />
          <input onChange={e => setEmail(e.target.value)} type='email' placeholder='Enter email' className='flex-1 text-black outline-none bg-transparent' />
        </div>

        <div className='flex items-center border-b py-2'>
          <img src={assets.lock_icon} alt='lock' className='w-5 h-5 mr-2' />
          <input onChange={e => setPassword(e.target.value)} type='password' placeholder='Enter password' className='flex-1 text-black outline-none bg-transparent' />
        </div>

        {state !== "login" && (
          <div className='flex items-center border-b py-2'>
            <img src={assets.lock_icon} alt='confirm-lock' className='w-5 h-5 mr-2' />
            <input onChange={e => setConfirmPassword(e.target.value)} type='password' placeholder='Confirm password' className='flex-1 text-black outline-none bg-transparent' />
          </div>
        )}

        {state === "login" && (
          <p className='text-right text-sm text-red-500 cursor-pointer hover:underline'>
            Forgot password?
          </p>
        )}

        <button type='submit' className='bg-red-400 text-white rounded-md py-2 mt-2 hover:bg-red-600 transition'>
          {state === "login" ? "Login" : "Create Account"}
        </button>

        {state === "login" ? (
          <p className='text-sm text-neutral-500 text-center'>
            Don’t have an account?{" "}
            <span className='text-red-400 cursor-pointer hover:underline' onClick={() => setState("signup")}>
              Sign Up
            </span>
          </p>
        ) : (
          <p className='text-sm text-neutral-500 text-center'>
            Already have an account?{" "}
            <span className='text-red-400 cursor-pointer hover:underline' onClick={() => setState("login")}>
              Login
            </span>
          </p>
        )}
      </motion.form>
    </motion.div>
  )
}

export default Login
