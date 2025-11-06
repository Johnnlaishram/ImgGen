import axios from "axios";
import { createContext, useState, useEffect } from "react";
export const AppContext = createContext();
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AppContextProvider = (props) => {
   const [user, setUser] = useState(null);
   const [showLogin, setShowLogin] = useState(false);
   const [token, setToken] = useState(localStorage.getItem('token'));
   const [credit, setCredit] = useState(0);
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
   const navigate = useNavigate();

  const loadCreditsData = async () => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/user/credits`,
      { userId: user?._id },
      { headers: { token } }
    );

    if (data.success) {
      setCredit(data.credit);
      setUser(data.user);
    }
  } catch (error) {
    console.error("Credit load error:", error.response?.data || error.message);
    toast.error("Something went wrong while loading credits");
  }
};


   const generateImage = async (prompt) => {
      if (!user) return; // prevent error
      try {
        const { data } = await axios.post(
            backendUrl + '/api/image/generate-image',
            { prompt, userId: user._id }, // send userId
            { headers: { token } }
         );
         if (data.success) {
            loadCreditsData(); // refresh credits
            setCredit(data.creditBalance); // update credit directly
            return data.resultImage;
         }
         else{
            toast.error(data.message);
            setCredit(data.creditBalance || credit);
            loadCreditsData(); // refresh credits
            if(data.creditBalance === 0){
               navigate('/buy');
               toast.info("You are out of credits. Please buy more credits to generate images.");
            }
         }
      } catch (error) {
         toast.error(error.message);
      }
   }

   const logout = () => {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setCredit(0); // reset credit
      toast.success("Logged out successfully");
   };

   useEffect(() => {
      if (token && user) {
         loadCreditsData();
      }
   }, [token]);

   const value = {
      user,
      setShowLogin,
      showLogin,
      setUser,
      backendUrl,
      setCredit,
      credit,
      token,
      setToken,
      logout,
      loadCreditsData,
      generateImage
   };

   return (
      <AppContext.Provider value={value}>
         {props.children}
      </AppContext.Provider>
   );
};

export default AppContextProvider;
