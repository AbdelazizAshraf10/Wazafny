import React, { useContext } from "react";
import logo from "../../../assets/Photo.png";
import back from "../../../assets/BG.png";
import Nav from "./nav";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Contexts/Authenticate";
import { motion } from "framer-motion";

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren", // Animate children after the container
      staggerChildren: 0.2, // Stagger child animations
    },
  },
};

// Animation variants for text elements (heading, subheading, buttons)
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Animation variants for the image
const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// Animation variants for buttons (hover/tap effect)
const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

const Welcome = () => {
  const { isLoggedIn } = useContext(AuthContext); // Access authentication state
  const navigate = useNavigate(); // For navigation

  // Function to handle "Post a Job" button click
  const handlePostJobClick = () => {
    if (!isLoggedIn) {
      
      navigate("/Login"); // Redirect to login page
    } 
  };

  return (
    <div
      className=" bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${back})` }}
    >
      <Nav />
      <hr className="border-t-2 border-gray-300 my-4 sm:my-6 md:my-7" />

      <motion.div
        className="flex lg:flex-row items-center justify-between px-4 sm:px-8 md:px-16 lg:px-1 py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side: Text Content */}
        <div className="text-center lg:text-left mb-8 ml-12">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-[#242645] leading-tight"
            variants={textVariants}
          >
            Find Your Dream Job or <br />
            Hire the Best Talent
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-[#6A0DAD] mt-6 sm:mt-8 md:mt-12"
            variants={textVariants}
          >
            WAZAFNY connects job seekers and employers for the perfect match.
          </motion.p>

          {/* Responsive Buttons */}
          <motion.div
            className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center lg:justify-start"
            variants={textVariants}
          >
            <Link to="/Login">
              <motion.button
                className="bg-[#6a0dad] text-white px-4 sm:px-6 py-2 sm:py-3.5 rounded-xl font-bold text-base sm:text-xl md:text-2xl transition duration-300 hover:bg-[#5c0bb8]"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Find Jobs Now
              </motion.button>
            </Link>

            <Link to="/LoginCompany">
              <motion.button
                onClick={handlePostJobClick} // Handle button click
                className="border-4 border-[#242645] text-[#242645] px-4 sm:px-8 sm:py-2.5 rounded-xl font-bold text-base sm:text-xl md:text-2xl transition duration-300 hover:bg-gray-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Post a Job
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Responsive Image */}
        <motion.div
          className="flex items-center justify-end lg:w-3/4 mt-8 lg:mt-0"
          variants={imageVariants}
        >
          <img
            src={logo}
            alt="Job Search Illustration"
            className="w-full sm:w-5/6 lg:w-11/12 h-auto object-cover rounded-lg sm:ml-4 md:ml-9 lg:ml-8"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;