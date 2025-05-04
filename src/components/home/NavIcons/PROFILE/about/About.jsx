import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "../profile/Modal";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import { Navigate } from "react-router-dom";

function About({ userRole, initialAbout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [apiError, setApiError] = useState("");
  const [floatMessage, setFloatMessage] = useState({ message: "", type: "" }); // State to manage float message
  const [shouldNavigate, setShouldNavigate] = useState(false); // State to control navigation
  const maxWords = 250;

  // Initialize state with initialAbout
  useEffect(() => {
    if (initialAbout !== null) {
      setAboutText(initialAbout);
      setSavedText(initialAbout);
    }
  }, [initialAbout]);

  // Function to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Handle textarea change
  const handleChange = (e) => {
    const words = countWords(e.target.value);
    if (words <= maxWords) {
      setAboutText(e.target.value);
      setApiError("");
    }
  };

  // Function to show float message
  const showFloatMessage = (type, message) => {
    setFloatMessage({ message, type });
  };

  // Function to close float message
  const closeFloatMessage = () => {
    setFloatMessage({ message: "", type: "" });
  };

  // Save function with API call
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const seeker_id = localStorage.getItem("seeker_id");

    if (!token) {
      setApiError("Authentication token not found. Please log in again.");
      showFloatMessage("error", "Authentication token not found. Please log in again.");
      setShouldNavigate(true);
      return;
    }

    if (!seeker_id) {
      setApiError("Seeker ID not found. Please log in again.");
      showFloatMessage("error", "Seeker ID not found. Please log in again.");
      setShouldNavigate(true);
      return;
    }

    const requestBody = {
      seeker_id: parseInt(seeker_id),
      about: aboutText,
    };

    try {
      const response = await axios.post(
        "https://wazafny.online/api/update-about",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      setSavedText(aboutText);
      setIsModalOpen(false);
      setApiError("");
    } catch (error) {
      console.error("Error updating about:", error);
      if (error.response?.status === 404) {
        console.error("Seeker not found:", error.response.data);
        setApiError(error.response?.data?.message || "Seeker not found. Please try again.");
        showFloatMessage("error", error.response?.data?.message || "Seeker not found. Please try again.");
      } else if (error.response?.status === 401) {
        const errorMessage = "Unauthorized: " + (error.response?.data?.message || "Invalid token. Please log in again.");
        showFloatMessage("error", errorMessage);
        setApiError("Unauthorized: Please log in again.");
        setShouldNavigate(true);
      } else if (error.response?.status === 500) {
        console.error("Server error:", error.response.data);
        setApiError(error.response?.data?.message || "Server error. Please try again later.");
        showFloatMessage("error", error.response?.data?.message || "Server error. Please try again later.");
      } else if (error.response?.status === 422) {
        console.error("Validation error:", error.response.data);
        setApiError(error.response?.data?.message || "Validation error. Please check your input.");
        showFloatMessage("error", error.response?.data?.message || "Validation error. Please check your input.");
      } else {
        setApiError(
          error.response?.data?.message || "Failed to update about. Please try again."
        );
        showFloatMessage("error", error.response?.data?.message || "Failed to update about. Please try again.");
      }
    }
  };

  // Animation variants for modal backdrop
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Animation variants for modal content
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Handle navigation after float message is shown
  if (shouldNavigate) {
    return <Navigate to="/Login" />;
  }

  return (
    <div className="flex justify-center mt-4 w-full">
      {/* Render the float message component */}
      <floatmessages
        message={floatMessage.message}
        type={floatMessage.type}
        onClose={closeFloatMessage}
        duration={3000}
      />

      {/* Main Container */}
      <div className="bg-white border border-[#D9D9D9] rounded-xl w-full max-w-[900px] p-6 md:p-8 relative">
        {/* Title with Pencil Icon in the Top Right */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-bold text-[#201A23]">About</h3>
          {userRole !== "Company" && (
            <Pencil
              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
              onClick={() => setIsModalOpen(true)}
            />
          )}
        </div>

        {/* Display Saved Text or Default Message */}
        <div className="mt-8">
          <p className={`text-[#201A23] text-justify ${savedText ? 'text-left' : 'text-center'} text-sm md:text-base`}>
            {savedText || "Mention your years of experience, industry, key skills, achievements, and past work experiences."}
          </p>
        </div>
      </div>

      {/* Modal for Editing About Text */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"About text area"}
      >
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-full max-w-[819px] h-auto relative"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="flex justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-bold">About</h2>
                  <button
                    className="text-gray-500 hover:text-black text-lg"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✖
                  </button>
                </div>

                {/* API Error Message */}
                {apiError && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                    {apiError}
                  </div>
                )}

                {/* Instructions */}
                <p className="text-[#A1A1A1] text-center text-sm md:text-base">
                  Mention your years of experience, industry, key skills,
                  achievements, and past work experiences.
                </p>

                {/* Textarea with Word Limit */}
                <textarea
                  className={`w-full h-40 md:h-60 border-2 rounded-xl p-2 mt-5 ${
                    countWords(aboutText) >= maxWords ? "border-red-500" : "border-[#201A23]"
                  }`}
                  value={aboutText}
                  onChange={handleChange}
                />
                <p
                  className={`text-xs md:text-sm mt-2 ${
                    countWords(aboutText) >= maxWords ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {countWords(aboutText)}/{maxWords} words
                </p>

                {/* Save Button */}
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-[#201A23] font-bold text-white px-6 py-2 rounded-md text-sm md:text-base"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
}

export default About;