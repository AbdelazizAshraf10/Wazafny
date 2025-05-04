import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";

export default function LoginCompany() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Auto-dismiss message after 9 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  async function handleLogin(values) {
    try {
      const response = await axios.post("https://wazafny.online/api/login", {
        email: values.Email,
        password: values.Password,
        role: "Company",
      });

      console.log("Response:", response.status, response.data);

      if (response.status === 200) {
        localStorage.removeItem("token", response.data.token);
        localStorage.removeItem("user_id", response.data.user_id);
        localStorage.removeItem("role", response.data.role);
        localStorage.removeItem("company_id", response.data.role_id);


        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("company_id", response.data.role_id);
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/Dashboard/Overview"), 1000);
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
        if ( status === 422) {
          console.log("invalid data ana ba3et el data mosh sah");
        } else if(status === 401) {
          setMessage({
            text: "Login failed. Please try again.",
            type: "error",
          });
        }
      } else {
        setMessage({
          text: "Network error. Please check your connection and try again.",
          type: "error",
        });
      }
    }
  }

  let myValidationSchema = Yup.object().shape({
    Email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    Password: Yup.string()
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be 8-16 characters long"
      )
      .required("Password is required"),
  });

  let formik = useFormik({
    initialValues: {
      Email: "",
      Password: "",
    },
    validationSchema: myValidationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
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
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          textAlign: "center",
        }}
        className="flex justify-around mt-5"
      >
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

        <div className="scale-95 ">
          <img
            className="  ml-[-100px] animate-fadeIn"
            style={{ animationDelay: "0s" }}
            src="\src\assets\company-sign-up.png"
            alt="frame"
          />
        </div>
        <div
          className="sign-up bg-white rounded-lg shadow-lg p-8 animate-fadeIn"
          style={{ width: "450px", animationDelay: "0.1s" }}
        >
          <h2
            className="text-3xl text-[#242645] font-extrabold "
            
          >
            LOGIN
          </h2>
          <h3
            className="text-lg text-[#242645] font-semibold mb-6 "
            
          >
            COMPANY
          </h3>
          <form onSubmit={formik.handleSubmit} className="mx-auto">
            <div className="relative z-0 w-full mb-8 group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#242645] text-left"
              >
                EMAIL
              </label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Email}
                type="email"
                name="Email"
                id="email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                placeholder="YourEmail@company.com"
                required
              />
              {formik.errors.Email && formik.touched.Email ? (
                <div
                  className="text-sm text-red-500 text-left mt-2 animate-fadeIn"
                  style={{ animationDelay: "0.4s" }}
                >
                  {formik.errors.Email}
                </div>
              ) : null}
            </div>
            <div className="relative z-0 w-full mb-8 group">
              <label
                htmlFor="Password"
                className="block text-sm font-medium text-[#242645] text-left"
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Password}
                  type={showPassword ? "text" : "password"}
                  name="Password"
                  id="Password"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {formik.errors.Password && formik.touched.Password ? (
                <div
                  className="text-sm text-red-500 text-left mt-2 "
                  
                >
                  {formik.errors.Password}
                </div>
              ) : null}
            </div>

            <div
              className="w-full "
              
            >
              <button
                type="submit"
                className="bg-[#6A0DAD] text-[#FFFFFF] py-3 px-6 rounded-lg text-3xl font-sans w-full hover:bg-purple-700 transition duration-300"
              >
                LOGIN
              </button>
            </div>

            <div
              className="forget mt-4 "
              
            >
              <Link
                to={"/Forget"}
                className="text-[#6A0DAD] font-bold hover:underline"
              >
                Forget your password?
              </Link>
            </div>

            <div
              className="login-link mt-4 "
             
            >
              <p className="font-bold">
                New user?{" "}
                <Link
                  to={"/SignUpCompany"}
                  className="text-[#6A0DAD] font-bold text-lg hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>

            <div
              className="mt-4 login-link "
              
            >
              <Link
                to={"/Login"}
                className="text-[#6A0DAD] font-bold hover:underline"
              >
                Login As Seeker Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}