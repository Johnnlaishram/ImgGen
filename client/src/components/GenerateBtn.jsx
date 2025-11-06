
import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'  

const GenerateBtn = () => {
  return (
    <motion.div 
      initial={{ opacity: 0.2, y: 100 }}  
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1 }} 
      viewport={{ once: true }}
    >
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2 text-center mt-20'>
        Generate Your AI Image Now
      </h1>
    </motion.div>
  )
}

export default GenerateBtn
