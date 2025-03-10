
import style from './OtpConfirmation.module.css'

import values from './../../../node_modules/lodash-es/values';
import { Link, useNavigate } from 'react-router-dom';





import { useState, useRef } from "react";

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete?.(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex flex-col items-center text-center w-[50%] mx-auto my-10 px-20">
      <h2 className="text-4xl font-extrabold mb-2">Email Sent</h2>
      <p className="text-black mb-4 pb-7 pt-3 text-2xl">If this email address was used to create an account, an OTP will be sent to you. Please check your email.</p>
      <div className="flex gap-2 justify-center mb-4 pb-10">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-12 h-12 text-center text-xl border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
          />
        ))}
      </div>
      <button className="bg-[#6a0dad] text-white py-2 px-6 rounded-lg text-lg font-bold"><Link to={"/ResetPassword"}>Submit</Link></button>
      <p className="mt-4 text-2xl text-black pt-3">Didn’t get OTP? <Link to={"/OtpConfirmation"}  className="  text-[#6a0dad] underline font-medium cursor-pointer">Try again</Link></p>
    </div>
  );
};

export default OTPInput;
