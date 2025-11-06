import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { user, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  const onClickHandler = () => {
    if (user) navigate('/results')
    else setShowLogin(true)
  }

  return (
    <motion.div 
      className='flex flex-col justify-center items-center text-center my-20' 
      initial={{ opacity: 0.2, y: 100 }}  
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1 }} 
      viewport={{ once: true }}
    >
      {/* Tagline */}
      <motion.div 
        className='text-stone-500 inline-flex items-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500'
        initial={{ opacity: 1, y: -20 }}  
        whileInView={{ opacity: 1, y: 0 }}  
        transition={{ delay: 0.2, duration: 0.8 }} 
        viewport={{ once: true }} 
        animate={{ scale: [1, 1.1, 1] }}
      >
        <p>Best text to image generator</p>
        <img src={assets.star_icon} alt="star" />
      </motion.div>

      {/* Heading */}
      <motion.h1 
        className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 my-6'  
        initial={{ opacity: 1, y: -20 }}  
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 2 }}  
        viewport={{ once: true }} 
        animate={{ scale: [1, 1.1, 1] }}
      >
        Create Stunning <span className='text-red-600'>Image</span> Images with AI
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        className='text-gray-600 text-lg sm:text-xl lg:text-2xl' 
        initial={{ opacity: 1, y: -20 }}  
        whileInView={{ opacity: 1, y: 0 }}  
        transition={{ delay: 0.6, duration: 0.8 }} 
        viewport={{ once: true }} 
        animate={{ scale: [1, 1.1, 1] }}
      >
        Transform your ideas into captivating visuals with our AI-powered image generator.
      </motion.p>

      {/* CTA Button */}
      <motion.button 
        onClick={onClickHandler} 
        className='bg-black sm:text-lg text-white w-auto px-12 py-2.5 mt-8 rounded-full flex items-center gap-2'
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}  
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        Get Started
        <img className='h-6' src={assets.star_group} alt="stars" />
      </motion.button>

      {/* Sample images */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}  
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ delay: 1, duration: 1 }} 
        viewport={{ once: true }}  
        className='flex flex-wrap justify-center items-center mt-16 gap-3'
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <img 
            key={index}
            className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10' 
            src={index % 2 === 0 ? assets.imgen1 : assets.imgen2} 
            alt={`sample-${index}`}  
            width={70}
          />
        ))}
      </motion.div>

      {/* Footer text */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}  
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ delay: 1.2, duration: 1 }} 
        viewport={{ once: true }}
        className='mt-2 text-neutral-600'
      >
        Generated images from ImgGen
      </motion.div>
    </motion.div>
  )
}

export default Header
