import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmailConfirm() {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();



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
          { timeout: 10000 } // 10-second timeout
        );
        console.log("API Response:", response.data);
        if(MAX_ATTEMPTS === 0) {
          clearInterval(intervalId);
          navigate("/Register");
        }
        MAX_ATTEMPTS --;

        // Check if verified is 1 (response.data.verified, not response.data directly)
        if (response.data.verified === 1) {
          console.log("Email verified, navigating to logcation...");
          clearInterval(intervalId); // Stop polling immediately
          navigate("/location", { replace: true }); // Navigate to location
          localStorage.removeItem('userEmail');
          localStorage.removeItem('user_id');
        } else if (response.data.verified === 0) {
          console.log("Email not verified yet, retrying...");
        } else {
          console.warn("Unexpected API response:", response.data);
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
  );
}

export default EmailConfirm;