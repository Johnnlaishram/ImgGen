import React from 'react'
import { assets, testimonialsData } from '../assets/assets'
import { motion } from 'framer-motion'

const Testimonials = () => {
  return (
    <div className='flex flex-col items-center text-center justify-center my-20 md:px-28'>
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>
        Customer Testimonials
      </h1>
      <p className='text-gray-500 mb-12'>
        What our users are saying
      </p>

      <div className='flex flex-wrap justify-center gap-8'>
        {testimonialsData.map((testimonial, index) => (
          <motion.div
            key={index}
            className='bg-white p-6 rounded-lg shadow-md cursor-pointer hover:scale-[1.02] transition-all w-80 sm:w-96'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div>
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className='w-14 h-12 rounded-full mb-2 hover-scale-105'
              />
              <h2 className='font-semibold'>{testimonial.name}</h2>
              <p className='text-sm text-gray-500'>{testimonial.role}</p>

              <div className='flex items-center mt-2 mb-4'>
                {[...Array(testimonial.stars)].map((_, i) => (
                  <img
                    key={i}
                    src={assets.rating_star}
                    className='w-4 h-4'
                    alt="star"
                  />
                ))}
              </div>

              <p className='text-gray-600 text-sm'>{testimonial.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
