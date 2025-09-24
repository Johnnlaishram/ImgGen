import React, { useContext } from 'react';
import lele from '../assets/lele.svg';
import { plans } from '../assets/assets';
import { motion } from "framer-motion";
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BuyCredit = () => {
  const { user, backendUrl, token, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

 const initpay = (order) => {
  console.log("Razorpay object:", window.Razorpay);
  console.log("Order object:", order);

  if (!window.Razorpay) return toast.error("Razorpay is not loaded");

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Credits Payment",
    description: "Credits Payment",
    order_id: order.id,
    handler: async (response) => {
      try {
        const { data } = await axios.post(
          backendUrl + '/api/user/verify-razor',
          response,
          { headers: { token } }
        );
        if (data.success) {
          toast.success("Payment successful");
          navigate('/');
          toast.info("Credits added to your account");
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
    theme: { color: "#f43f5e" } 
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


      
  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true);
        return;
      }

      const { data } = await axios.post(
        backendUrl + '/api/user/pay-razor',
        { planId },
        { headers: { token } }
      );

      if (data.success) {
        initpay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div className="min-h-screen flex flex-col items-center justify-center gap-10 py-16">
      <motion.h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">Choose the plan</motion.h1>
      <motion.div className="flex flex-wrap justify-center items-center gap-6">
        {plans.map((item, index) => (
          <motion.div key={index} className="border p-6 rounded-lg shadow-lg flex flex-col items-center gap-4 w-64 bg-white">
            <img src={lele} alt={item.id} className="w-20 h-20 mb-4" />
            <p className="mt-3 mb-1 font-semibold text-lg">{item.id}</p>
            <p className="text-gray-600 text-sm text-center">{item.desc}</p>
            <p className="text-xl font-bold text-red-500">
              ${item.price}
              <span className="text-gray-500 text-sm"> / {item.credits} credits</span>
            </p>
            <motion.button
              onClick={() => paymentRazorpay(item.id.toLowerCase())}
              className="w-full bg-red-400 text-white mt-6 text-sm rounded-md py-2.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user ? 'Purchase' : 'Get Started'}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default BuyCredit;
