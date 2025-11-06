import { assets } from '../assets/assets'

const Description = () => {
  return (
    <div className='flex flex-col items-center text-center justify-center my-24 md:px-28'>
        <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>Create AI Images</h1>
        <p className='text-gray-500 mb-8'>Make your imagination visible </p>
        <div className='flex flex-col items-center gap-5 md:gap-14 px-4 md:px-20 lg:px-40 text-gray-600 text-lg md:text-xl leading-8 '>
            <img src={assets.imgen3} alt="" className=' w-80 xl:w-96 rounded-lg' />
            <h2 className='text-2xl  text-gray-600 sm:text-3xl font-semibold'>
                introducing our AI-powered image generator, where creativity meets technology.
            </h2>
            <p className='text-justify text-gray-600 '>
                Our advanced algorithms transform your ideas into captivating visuals, making it easy to bring your imagination to life. Whether you're a designer, marketer, or simply looking to explore your creative side, our tool offers endless possibilities. With a user-friendly interface and a vast library of styles and themes, you can effortlessly create stunning images that stand out. Experience the future of design with our AI image generator and turn your concepts into reality in just a few clicks.
            </p>
        </div>
    </div>
  )
}

export default Description