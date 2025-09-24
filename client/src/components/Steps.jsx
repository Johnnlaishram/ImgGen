import React from 'react'
import { stepsData } from '../assets/assets'
import { motion } from "motion/react"

const Steps = () => {
  return (
    <motion.div 
      className='flex flex-col items-center text-center justify-center mt-20 mb-10' 
      initial={{ opacity: 0, y: 80 }}  
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1.2, ease: "easeOut" }} 
      viewport={{ once: true }}
    > 
      {/* Heading */}
      <motion.h1 
        className='text-3xl sm:text-4xl font-semibold mb-2' 
        initial={{ opacity: 0, y: -20 }}  
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2, duration: 1, ease: "easeOut" }} 
        viewport={{ once: true }} 
        animate={{ scale: [1, 1.05, 1] }}
      >
        How it works
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        className='text-gray-600 mb-10'
        initial={{ opacity: 0, y: -15 }}  
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }} 
        viewport={{ once: true }} 
        animate={{ scale: [1, 1.02, 1] }}
      >
        Follow these simple steps to create your AI-generated images
      </motion.p>

      {/* Steps */}
      <motion.div 
        className='space-y-4 w-full max-w-3xl text-sm' 
        initial={{ opacity: 0, y: 50 }}  
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }} 
        viewport={{ once: true }}
      >
        {stepsData.map((item, index) => (
          <motion.div 
            key={index}
            className='flex items-center gap-4 px-8 py-5 bg-red-300 shadow-md cursor-pointer hover:scale-[1.03] transition-transform duration-300 border rounded-lg'
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <img src={item.icon} alt={item.title} />
            <div>
              <h2 className='text-xl font-medium'>{item.title}</h2>
              <p className='text-gray-500'>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Steps
