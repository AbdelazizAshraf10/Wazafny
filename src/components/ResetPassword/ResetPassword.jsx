import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

export default function ResetPassword() {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

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
        "Password must contain 8-16 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char." // Updated message for clarity
      )
      .required("Password is required"),
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref("Password")], "Passwords must match") // Simpler message
      .required("Confirm password is required"),
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
      console.warn("No email found in localStorage for password reset.");
      // Optional: Redirect or show an error if email is essential here
      // navigate('/forgot-password'); // Example redirection
      setMessage({ text: "Error: Email not found. Please start the process again.", type: "error" });
    }
  }, []);

  //localstorage
  const role = localStorage.getItem("role");

  async function handleReset(values) {
    if (!email) {
       setMessage({ text: "Cannot reset password without email.", type: "error" });
       return;
    }
    try {
      const response = await axios.post(
        "https://laravel.wazafny.online/api/reset-password",
        {
          email: email,
          password: values.Password,
          password_confirmation: values.ConfirmPassword, // Often APIs expect confirmation field
        }
      );

      

      if (response.status === 200) {
        setMessage({ text: "Password reset successful!", type: "success" });
        localStorage.removeItem("userEmail");
        localStorage.removeItem("user_id"); // Consider if user_id should always be removed here

        // Navigate after showing the message
        setTimeout(() => {
          if (role === "Company") {
            navigate("/Dashboard/Overview");
          } else if (role === "Seeker") {
            navigate("/location"); // Consider navigating to login: navigate("/login")
          } else {
            navigate("/login"); // Default navigation if role is unknown
          }
        }, 2000); // Reduced delay slightly

      } else {
        // This block might not be reached if axios throws for non-2xx status
        console.warn("Unexpected status:", response.status);
         setMessage({ text: `Unexpected response: ${response.status}. Please try again.`, type: "error" });
      }
    } catch (error) {
      console.error("Error details:", error);

      let errorMessage = "An unexpected error occurred. Please try again."; // Default error

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        const status = error.response.status;
        // Extract more specific message from backend if available
        const backendMessage = error.response.data?.message || (typeof error.response.data === 'string' ? error.response.data : null);

        if (status === 404) {
          errorMessage = backendMessage || "User not found or invalid request.";
        } else if (status === 422) {
           // Validation errors
           const errors = error.response.data?.errors;
           if (errors) {
             // Join multiple validation errors if needed, or take the first one
             errorMessage = Object.values(errors).flat().join(' '); // Example: Join all error messages
           } else {
             errorMessage = backendMessage || "Invalid data provided.";
           }
        } else if (status >= 500) {
            errorMessage = "Server error. Please try again later.";
        } else {
            errorMessage = backendMessage || `Error: ${status}. Please try again.`;
        }

      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        errorMessage = `Error: ${error.message}`;
      }
       setMessage({ text: errorMessage, type: "error" });
    }
  }

  // --- Animation Variants (Keep as they are) ---
  const containerVariants = { /* ... */ };
  const inputVariants = { /* ... */ };
  const buttonVariants = { /* ... */ };
  const errorVariants = { /* ... */ };

  return (
    <>
      {/* --- Floating Message (Keep as is) --- */}
      {message.text && (
        <div
          className={`floating-message ${message.type} ${
            !message.text ? "hide" : ""
          }`}
        >
          {message.text}
        </div>
      )}
      {/* --- Styles (Keep as is, maybe adjust floating message left position) --- */}
      <style>
        {`
          /* ... existing keyframes ... */

          .floating-message {
            position: fixed;
            top: 20px;
            /* Adjust left/transform for better centering if needed */
            left: 42%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out forwards;
            max-width: 90%; /* Prevent overflow on small screens */
            text-align: center;
          }

          .floating-message.success {
            background-color: #4caf50;
            color: white;
          }

          .floating-message.error {
            background-color: #f44336;
            color: white;
          }

         /* ... other existing styles ... */

         /* Style for the icon button */
         .password-toggle-icon {
            position: absolute;
            top: 50%;
            right: 0.75rem; /* Adjust as needed (pr-3 = 0.75rem) */
            transform: translateY(-50%);
            cursor: pointer;
            color: #9ca3af; /* gray-400 */
            background: transparent; /* Ensure no background */
            border: none; /* Ensure no border */
            padding: 0; /* Ensure no padding */
          }
          .password-toggle-icon:hover {
            color: #6b7280; /* gray-500 */
          }

        `}
      </style>

      <motion.div
        className="flex flex-wrap justify-around mx-auto w-full mt-14"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="border-2 border-solid border-[#d9d9d9] rounded-[7%] p-8 md:p-12 pt-8 w-[90%] max-w-[450px]" // Responsive padding and width
          variants={containerVariants} // Reusing variants might be okay here
        >
          <motion.h2
             className="text-2xl font-sans text-center font-bold pb-7"
            // ... animation props
          >
            Create New Password
          </motion.h2>

          {/* UPDATE: Removed space-y-10 here, will add margin below each input group */}
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-md mx-auto mb-1 my-form" // Removed space-y-10
          >
            {/* --- Password Field --- */}
            <div className="mb-4"> {/* Add margin bottom to group input + error */}
              <div className="relative z-0 w-full group">
                <motion.input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Password}
                  // UPDATE: Dynamic type based on state
                  type={showPassword ? "text" : "password"}
                  name="Password"
                  id="Password"
                  // UPDATE: Added pr-10 for padding-right to make space for the icon
                  className="block py-2 px-0 pr-10 w-full text-sm text-gray-900 bg-transparent border-0 border-b-[1.77px] border-[#D9D9D9] appearance-none dark:border-[#D9D9D9] focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                  required
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                  whileFocus="focus"
                />
                 {/* UPDATE: Added Show/Hide Icon */}
                 <button
                   type="button" // Prevent form submission
                   onClick={() => setShowPassword(!showPassword)}
                   className="password-toggle-icon"
                   aria-label={showPassword ? "Hide password" : "Show password"}
                 >
                   {showPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
                 </button>
                <label
                  htmlFor="Password"
                  className="left-0 peer-focus:font-medium absolute text-sm text-[#242645] dark:text-[#242645] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
                >
                  Password
                </label>
              </div>
              {/* UPDATE: Added mt-1 for small space above error */}
              {formik.errors.Password && formik.touched.Password ? (
                <motion.div
                  className="text-xs text-red-600 mt-1" // Use text-xs for smaller error text, mt-1 for spacing
                  role="alert"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {formik.errors.Password}
                </motion.div>
              ) : (
                <div className="h-4 mt-1"></div> // Placeholder to prevent layout shift
              )}
            </div>


            {/* --- Confirm Password Field --- */}
             <div className="mb-6"> {/* Add margin bottom to group input + error */}
              <div className="relative z-0 w-full group">
                <motion.input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.ConfirmPassword}
                   // UPDATE: Dynamic type based on state
                  type={showConfirmPassword ? "text" : "password"}
                  name="ConfirmPassword"
                  id="ConfirmPassword"
                   // UPDATE: Added pr-10 for padding-right
                  className="block py-2 pb-2 px-0 pr-10 w-full text-sm text-[#242645] bg-transparent border-0 border-b-[1.77px] border-gray-300 appearance-none dark:border-[#D9D9D9] focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                  required
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  whileFocus="focus"
                />
                 {/* UPDATE: Added Show/Hide Icon */}
                 <button
                   type="button" // Prevent form submission
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   className="password-toggle-icon"
                   aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                 >
                   {showConfirmPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
                 </button>
                <label
                  htmlFor="ConfirmPassword"
                  className="left-0 peer-focus:font-medium absolute text-sm text-[#242645] dark:text-[#242645] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
                >
                  Confirm Password
                </label>
              </div>
               {/* UPDATE: Added mt-1 for small space above error */}
              {formik.errors.ConfirmPassword && formik.touched.ConfirmPassword ? (
                <motion.div
                  className="text-xs text-red-600 mt-1" // Use text-xs for smaller error text, mt-1 for spacing
                  role="alert"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {formik.errors.ConfirmPassword}
                </motion.div>
              ) : (
                 <div className="h-4 mt-1"></div> // Placeholder to prevent layout shift
              )}
            </div>

            {/* --- Submit Button --- */}
            <div className="w-full text-center mt-8"> {/* Added top margin */}
              <motion.button
                type="submit"
                // UPDATE: Added disabled state while submitting or if form is invalid
                disabled={formik.isSubmitting || !formik.isValid}
                className="px-16 bg-[#6a0dad] text-white py-2 rounded-[17px] text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                whileHover={!formik.isSubmitting && formik.isValid ? "hover" : ""} // Disable hover effect when disabled
                whileTap={!formik.isSubmitting && formik.isValid ? "tap" : ""}   // Disable tap effect when disabled
              >
                {/* UPDATE: Show loading state */}
                {formik.isSubmitting ? 'Updating...' : 'Update Password'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
}