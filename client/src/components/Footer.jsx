import React from "react";
import { assets } from "../assets/assets";
import lele from "../assets/lele.svg";

const Footer = () => {
  return (
    <div className="flex  items-center text-center justify-center mt-20 gap-4 mt-20">
      <img src={lele} alt="lele" className="w-28 sm:w-32 lg:w-40" width={150} />

      <p className="text-gray-500 flex-1 border-t border-gray-300 mt-6 pt-6 max-sm-hidden">
        2026 AI Image Generator. All rights reserved.
      </p>
      <div className="flex justify-center items-center gap-6 mt-4">
        <img src={assets.facebook_icon} alt="Facebook" width={35} />
        <img src={assets.twitter_icon} alt="Twitter" width={35} /> 
        <img src={assets.instagram_icon} alt="Instagram" width={35} />
      </div>
    </div>
  );
};

export default Footer;
