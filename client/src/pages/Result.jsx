import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext"; // make sure to import this

const Result = () => {
  const [image, setImage] = React.useState(assets.imgen2);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [input, setInput] = React.useState("");

  const { generateImage } = React.useContext(AppContext);

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (input) {
      const image = await generateImage(input);
      if (image) {
        setIsImageLoading(true); // fixed from setIsImageLoaded
        setImage(image);
      }
    }
      setLoading(false);
    
  };

  return (
    <motion.form
      className="flex flex-col items-center gap-6"
      onSubmit={onsubmitHandler}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Generated Image */}
      <motion.div
        className="relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src={image} alt="Generated" className="max-w-sm rounded shadow-md" />

        {/* Progress bar */}
        <motion.span
          className={`absolute bottom-0 left-0 bg-black h-1`}
          initial={{ width: 0 }}
          animate={{ width: loading ? "100%" : "0%" }}
          transition={{ duration: 3 }}
        />
        {loading && (
          <motion.p
            className="absolute bottom-2 left-2 text-white text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading...
          </motion.p>
        )}
      </motion.div>

      {/* Input + Button (shown when not loading) */}
      {!isImageLoading && (
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you imagine..."
            className="w-full max-w-md bg-transparent border-b border-gray-400 outline-none text-center py-2"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            className="bg-red-400 text-white px-10 sm:px-16 py-2 rounded-full hover:bg-zinc-800 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generate Image
          </motion.button>
        </motion.div>
      )}

      {/* After Image is Generated */}
      {isImageLoading && !loading && (
        <motion.div
          className="flex gap-4 flex-wrap justify-center text-black-400 text-sm mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p
            onClick={() => {
              setIsImageLoading(false);
              setInput("");
            }}
            className="bg-transparent border border-gray-400 px-9 py-4 rounded-full cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            Generate Another
          </motion.p>

          <motion.a
            href={image}
            download
            className="bg-red-400 px-9 py-4 rounded-full cursor-pointer text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download
          </motion.a>
        </motion.div>
      )}
    </motion.form>
  );
};

export default Result;
