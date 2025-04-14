import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Forget() {
  const [message, setMessage] = useState({ text: "", type: "" }); // State for floating message
  const navigate = useNavigate();

  // Auto-dismiss message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  let myValidationSchema = Yup.object().shape({
    Email: Yup.string().email("invalid email").required("email is required"),
  });

  let formik = useFormik({
    initialValues: {
      Email: "",
    },
    validationSchema: myValidationSchema,
    onSubmit: handleLogin,
  });

  async function handleLogin(values) {
    try {
      const response = await axios.post(
        "https://wazafny.online/api/generate-otp",
        {
          email: values.Email,
        }
      );
      localStorage.setItem("userEmail", values.Email);

      console.log(localStorage.getItem("userEmail"));
      console.log("Response:", response.status, response.data);

      if (response.status === 200) {
        setMessage({ text: "OTP sent successfully! Redirecting...", type: "success" });
        setTimeout(() => navigate("/OtpConfirmation"), 1000); // Delay navigation to show message
      } else {
        console.warn("Unexpected status:", response.status);
        setMessage({ text: "Unexpected response. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response) {
        const { status } = error.response;
        if (status === 404 || status === 422) {
          setMessage({ text: "Invalid Email", type: "error" });
        } else {
          setMessage({ text: "An error occurred. Please try again.", type: "error" });
        }
      } else {
        setMessage({
          text: "Network error. Please check your connection and try again.",
          type: "error",
        });
      }
    }
  }

  // Animation variants for the form container
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Animation variants for the input
  const inputVariants = {
    initial: { scale: 1, borderColor: "#D9D9D9" },
    focus: { scale: 1.02, borderColor: "#6A0DAD", transition: { duration: 0.3 } },
  };

  // Animation variants for the button
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  // Animation variants for the error message
  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
            left: 44%;
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

          .floating-message.hide {
            animation: slideOut 0.9s ease-out forwards;
          }
        `}
      </style>
      <div className="flex items-center justify-center min-h-screen">
        {/* Floating Message */}
        {message.text && (
          <div
            className={`floating-message ${message.type} ${
              message.text ? "" : "hide"
            }`}
          >
            {message.text}
          </div>
        )}

        <motion.div
          className="bg-[#FFFFFF] border border-[#D9D9D9] rounded-2xl p-14 w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-2xl font-extrabold text-[#242645] mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.5 } }}
          >
            Forgot Password ?
          </motion.h2>
          <motion.p
            className="text-[#242645] mb-10 text-center font-bold leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.5 } }}
          >
            Enter the email address you used when you joined and we’ll send you
            instructions to reset your password.
          </motion.p>
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-xs font-bold text-[#242645] uppercase"
              >
                Email
              </label>
              <motion.input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Email}
                type="email"
                name="Email"
                id="email"
                className="w-full font-medium py-3 text-[#242645] border-0 border-b-2 bg-transparent border-gray-300 focus:outline-none placeholder-gray-400"
                placeholder="YourEmail@gmail.com"
                required
                variants={inputVariants}
                initial="initial"
                animate={formik.touched.Email ? "focus" : "initial"}
                whileFocus="focus"
              />
            </div>
            {formik.errors.Email && formik.touched.Email ? (
              <motion.div
                className="text-sm text-left text-red-600"
                role="alert"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
              >
                {formik.errors.Email}
              </motion.div>
            ) : null}

            <motion.button
              type="submit"
              className="w-full bg-[#6A0DAD] text-[#FFFFFF] text-2xl font-semibold py-4 rounded-[20px] hover:bg-purple-700 transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Send OTP
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}