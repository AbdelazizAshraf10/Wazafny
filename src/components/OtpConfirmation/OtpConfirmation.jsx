import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const OTPInput = ({ length = 6 }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [email, setEmail] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [resendAttempts, setResendAttempts] = useState(0);
  const [lastResendTime, setLastResendTime] = useState(null);
  const [cooldownTime, setCooldownTime] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Retrieve email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.warn('No email found in localStorage');
    }
  }, []);

  // Auto-dismiss message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Timer for cooldown
  useEffect(() => {
    let timer;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle OTP submission
  const handleOtp = async () => {
    const otpValue = otp.join('');
    if (!email) {
      setMessage({ text: 'Email not found. Please try again.', type: 'error' });
      return;
    }
    if (otpValue.length !== length) {
      setMessage({ text: 'Please enter a complete OTP.', type: 'error' });
      return;
    }

    try {
      const response = await axios.post(
        'https://laravel.wazafny.online/api/verify-otp',
        {
          email: email,
          otp: otpValue,
        }
      );

      if (response.status === 200) {
        setMessage({ text: 'OTP verified! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/ResetPassword'), 1000);
      } else {
        console.warn('Unexpected status:', response.status);
        setMessage({ text: 'Unexpected response. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          setMessage({ text: 'Invalid or Expired OTP.', type: 'error' });
        } else if (status === 422) {
          setMessage({ text: 'Email or OTP is invalid.', type: 'error' });
        } else {
          setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
        }
      } else {
        setMessage({
          text: 'Network error. Please check your connection and try again.',
          type: 'error',
        });
      }
    }
  };

  // Handle resend OTP with cooldown logic
  const handleResendOtp = async () => {
    if (!email) {
      setMessage({ text: 'Email not found. Please try again.', type: 'error' });
      return;
    }

    const now = Date.now();
    const timeSinceLastResend = lastResendTime ? (now - lastResendTime) / 1000 : Infinity;
    const isRestrictedMode = resendAttempts >= 10;
    const cooldownDuration = isRestrictedMode ? 300 : 30; // 5 minutes or 30 seconds

    if (timeSinceLastResend < cooldownDuration) {
      setMessage({
        text: `Please wait ${Math.ceil(cooldownDuration - timeSinceLastResend)} seconds before resending.`,
        type: 'error',
      });
      setCooldownTime(Math.ceil(cooldownDuration - timeSinceLastResend));
      return;
    }

    try {
      const response = await axios.post(
        'https://laravel.wazafny.online/api/generate-otp',
        {
          email: email,
        }
      );

      setMessage({ text: 'OTP resent successfully. Please check your email.', type: 'success' });
      setLastResendTime(now);
      setResendAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts === 10) {
          setMessage({
            text: 'Maximum attempts reached. Next resend available after 5 minutes.',
            type: 'warning',
          });
        }
        return newAttempts;
      });
      setCooldownTime(cooldownDuration);
    } catch (error) {
      console.error('Resend OTP Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      setMessage({ text: 'Failed to resend OTP. Please try again.', type: 'error' });
    }
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Animation variants for the inputs
  const inputVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
    focus: { scale: 1.05, borderColor: '#6a0dad', transition: { duration: 0.2 } },
  };

  // Animation variants for the button
  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  // Animation variants for the resend link
  const linkVariants = {
    hover: {
      scale: 1.05,
      color: '#4b0082',
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-20px);
              opacity: 0;
            }
          }

          .floating-message {
            position: fixed;
            top: 20px;
            left: 42%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out forwards;
          }

          .floating-message.success {
            background-color: #4caf50;
            color: white;
          }

          .floating-message.error {
            background-color: #f44336;
            color: white;
          }

          .floating-message.warning {
            background-color: #ff9800;
            color: white;
          }

          .floating-message.hide {
            animation: slideOut 0.9s ease-out forwards;
          }
        `}
      </style>
      <motion.div
        className="flex flex-col items-center text-center w-[50%] mx-auto my-10 px-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating Message */}
        {message.text && (
          <div
            className={`floating-message ${message.type} ${
              message.text ? '' : 'hide'
            }`}
          >
            {message.text}
          </div>
        )}

        <motion.h2
          className="text-4xl font-extrabold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } }}
        >
          Email Sent
        </motion.h2>
        <motion.p
          className="text-black mb-4 pb-7 pt-3 text-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } }}
        >
          If this email address was used to create an account, an OTP will be sent to you. Please check your email.
        </motion.p>
        <div className="flex gap-2 justify-center mb-4 pb-10">
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-14 h-20 text-center text-xl border-2 border-[#A1A1A1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileFocus="focus"
            />
          ))}
        </div>
        <motion.button
          className="bg-[#6a0dad] text-white py-2 px-10 rounded-xl text-lg font-bold"
          onClick={handleOtp}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Submit
        </motion.button>
        <motion.p
          className="mt-4 text-2xl text-black pt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.5 } }}
        >
          Didn’t get OTP?{' '}
          {cooldownTime > 0 ? (
            <span className="text-gray-500">
              Try again in {cooldownTime} seconds
            </span>
          ) : (
            <motion.span
              className="text-[#6a0dad] underline font-medium cursor-pointer"
              onClick={handleResendOtp}
              variants={linkVariants}
              whileHover="hover"
            >
              Try again
            </motion.span>
          )}
        </motion.p>
        {resendAttempts > 0 && (
          <motion.p
            className="mt-2 text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
          >
            Attempts used: {resendAttempts}
          </motion.p>
        )}
      </motion.div>
    </>
  );
};

export default OTPInput;