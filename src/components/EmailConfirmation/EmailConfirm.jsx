import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmailConfirm() {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

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

  //local storages
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  let MAX_ATTEMPTS = 24; // Limit to 20 automatic retries

  // Retrieve email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      console.warn("No email found in localStorage");
      setUserEmail("user");
    }
  }, []);

  // Retrieve user_id from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.warn("No UserId found in localStorage");
      setUserId("user_id");
    }
  }, []);

  // Poll API to check email verification status
  useEffect(() => {
    if (!userId || userId === "user_id") return; // Skip if userId is invalid

    let intervalId;

    const checkVerification = async () => {
      try {
        const response = await axios.get(
          `https://wazafny.online/api/check/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
          { timeout: 10000 } // 10-second timeout
        );
        console.log("API Response:", response.data);
        if (MAX_ATTEMPTS === 0) {
          clearInterval(intervalId);
          if (role === "Company") {
            navigate("/SignUpCompany"); // Navigate to company page
          } else if (role === "Seeker") {
            navigate("/Register"); // Navigate to seeker page
          }
          localStorage.removeItem("userEmail");
          localStorage.removeItem("user_id");
        }
        MAX_ATTEMPTS--;
        if (response.status === 200) {
          // Check if verified is 1 (response.data.verified, not response.data directly)
          if (response.data.verified === 1) {
            setMessage({
              text: "Email verified successfully",
              type: "success",
            });
            clearInterval(intervalId); // Stop polling immediately
            if (role === "Company") {
              setTimeout(() => {
                navigate("/Dashboard/Overview");
              }, 3000); // 1 second delay
            } else if (role === "Seeker") {
              setTimeout(() => {
                navigate("/location");
              }, 3000); // 1 second delay
            }

            localStorage.removeItem("userEmail");
            localStorage.removeItem("user_id");
          } else if (response.data.verified === 0) {
            console.log("Email not verified yet, retrying...");
          } else {
            console.warn("Unexpected API response:", response.data);
          }
          return;
        }
      } catch (error) {
        console.error("Error checking verification:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          code: error.code,
        });
        if (error.code === "ECONNABORTED") {
          console.warn("API request timed out after 10 seconds, retrying...");
        } else {
          console.warn("API request failed, retrying...");
        }
        if (error.status === 500) {
          console.error(error.response);
          console.error(error.response.message);
        } else if (error.status === 404) {
          console.log("user not found ");
        } else if (error.status === 401) {
          console.log("unauthorized User");
          if (role === "Company") {
            navigate("/SignUpCompany"); // Navigate to company page
          } else if (role === "Seeker") {
            navigate("/Register"); // Navigate to seeker page
          }
        }
      }
    };

    // Poll every 10 seconds
    intervalId = setInterval(checkVerification, 10000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
      console.log("Cleared polling interval");
    };
  }, [userId, navigate]);

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Animation variants for the heading
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
  };

  // Animation variants for the message
  const messageVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.5 } },
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
      <div className="flex items-center justify-center mt-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-5xl font-extrabold text-[#242645] mb-6 text-center"
            variants={headingVariants}
          >
            Verify your email
          </motion.h2>
          <motion.p
            className="text-2xl text-[#242645] mb-8 text-center leading-relaxed"
            variants={messageVariants}
          >
            Thank you for signing up,{" "}
            <span className="font-semibold">{userEmail}</span>! We've sent a
            verification email to your inbox.
            <br /> Please check your email and click the{" "}
            <span className="font-semibold">"Verify Email"</span> button to
            activate your account. Once verified, you'll be redirected to the
            site.
            <br />
            If you don’t see the email, check your spam or junk folder.
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}

export default EmailConfirm;
