import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { motion } from "framer-motion"; // Import framer-motion

export default function ResetPassword() {
  const [message, setMessage] = useState({ text: "", type: "" }); // State for floating message
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
    Password: Yup.string()
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
        "password must contain at least 1 uppercase letter and 1 special char"
      )
      .required("password is required"),
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref("Password")], "invalid confirmation password")
      .required("confirm password is required"),
  });

  let formik = useFormik({
    initialValues: {
      Password: "",
      ConfirmPassword: "",
    },
    validationSchema: myValidationSchema,
    onSubmit: handleReset,
  });

  const navigate = useNavigate();
  const [email, setEmail] = useState(null);

  // Retrieve email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.warn("No email found in localStorage");
    }
  }, []);

  //localstorage
  const role = localStorage.getItem("role");

  async function handleReset(values) {
    try {
      const response = await axios.post(
        "https://wazafny.online/api/reset-password",
        {
          email: email,
          password: values.Password,
        }
      );

      console.log("Response:", response.status, response.data);

      if (response.status === 200) {
        if (role === "Company") {
          setTimeout(() => {
            navigate("/Dashboard/Overview");
          }, 3000); // 1 second delay
        } else if (role === "Seeker") {
          setTimeout(() => {
            navigate("/location");
          }, 3000); // 1 second delay
        }
        setMessage({text:"Password reset successful!", type:"success"});
        localStorage.removeItem("userEmail");
        localStorage.removeItem("user_id");
      } else {
        console.warn("Unexpected status:", response.status);
        alert("Unexpected response. Please try again.");
      }
    } catch (error) {
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response) {
        const { status } = error.response;
        if (status === 404) {
          console.log("Invalid Email ");
        } else if (status === 422) {
          console.log("invalid Email moshkela 3ndy ");
        }
      } else {
        console.log("Network error. Please check your connection and try again.");
      }
    }
  }

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Animation variants for the inputs
  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.4 },
    }),
    focus: {
      scale: 1.02,
      borderColor: "#6a0dad",
      transition: { duration: 0.3 },
    },
  };

  // Animation variants for the button
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  // Animation variants for error messages
  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {message.text && (
        <div
          className={`floating-message ${message.type} ${
            !message.text ? "hide" : ""
          }`}
        >
          {message.text}
        </div>
      )}
      <style>
        {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

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

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-in forwards;
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
            animation: slideOut 0.3s ease-out forwards;
          }
        `}
      </style>
      <motion.div
        className="flex flex-wrap justify-around mx-auto w-full mt-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="border-2 border-solid border-[#d9d9d9] rounded-[7%] p-12 pt-8 w-[450px]"
          variants={containerVariants}
        >
          <motion.h2
            className="text-2xl font-sans text-center font-bold pb-7"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.5 },
            }}
          >
            Create New Password
          </motion.h2>
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-md mx-auto mb-1 my-form"
          >
            <div className="relative z-0 w-full mb-5 group">
              <motion.input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Password}
                type="password"
                name="Password"
                id="Password"
                className="block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-[1.77px] border-[#D9D9D9] appearance-none dark:border-gray-600 focus:outline-none focus:ring-0 peer"
                placeholder=" "
                required
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                custom={0}
                whileFocus="focus"
              />
              <label
                htmlFor="Password"
                className="left-0 peer-focus:font-medium absolute text-sm text-[#242645] dark:text-[#242645] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
              >
                Password
              </label>
            </div>
            {formik.errors.Password && formik.touched.Password ? (
              <motion.div
                className="mb-4 text-sm text-red-600 rounded-lg"
                role="alert"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
              >
                {formik.errors.Password}
              </motion.div>
            ) : null}

            <div className="relative z-0 w-full mb-5 group">
              <motion.input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.ConfirmPassword}
                type="password"
                name="ConfirmPassword"
                id="ConfirmPassword"
                className="block py-2 pb-5 px-0 w-full text-sm text-[#242645] bg-transparent border-0 border-b-[1.77px] border-gray-300 appearance-none dark:border-gray-600 focus:outline-none focus:ring-0 peer"
                placeholder=" "
                required
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                custom={1}
                whileFocus="focus"
              />
              <label
                htmlFor="ConfirmPassword"
                className="left-0 peer-focus:font-medium absolute text-sm text-[#242645] dark:text-[#242645] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
              >
                Confirm Password
              </label>
            </div>
            {formik.errors.ConfirmPassword && formik.touched.ConfirmPassword ? (
              <motion.div
                className="text-sm text-red-600"
                role="alert"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
              >
                {formik.errors.ConfirmPassword}
              </motion.div>
            ) : null}

            <div className="w-full text-center">
              <motion.button
                type="submit"
                className="px-16 bg-[#6a0dad] text-white my-7 mt-10 py-2 rounded-[17px] text-lg font-bold"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Update Password
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
}
