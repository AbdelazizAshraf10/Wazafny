import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import profileDefault from "../../assets/company/profile-default.svg";
import { FaFileAlt } from "react-icons/fa";
import HeaderCompany from "./HeaderCompany";
import back from "../../assets/company/backButton.svg";
import { useNavigate } from "react-router-dom";

function ViewAppSeeker() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [comment, setComment] = useState("");

  const openModal = (type) => {
    setActionType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setComment("");
  };

  const handleSubmit = () => {
    console.log(`Action: ${actionType}, Comment: ${comment}`);
    closeModal();
  };

  const user = {
    firstName: "Yousif",
    lastName: "Elfaham",
    phone: "+20 010 991 907 60",
    email: "yousifelfaham@gmail.com",
    address: "Cairo, Egypt",
    resume: "Yousif-flutter-Developer-cv.pdf",
    profileImg: "",
    questions: [
      { question: "Expected Monthly Salary", answer: "12k" },
      { question: "Graduation year", answer: "2025" },
      {
        question: "Number of years experience in Mobile Development",
        answer: "3 years",
      },
    ],
  };

  // Function to calculate word count
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Animation variants for personal details
  const detailVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  // Animation variants for questions
  const questionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  // Animation variants for the modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  // Animation variants for buttons
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <HeaderCompany />
      <hr className="border-t-2 border-gray-300 my-4" />

      <div className="container mx-auto w-full min-h-screen p-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full">
          {/* Header Section */}
          <div className="flex justify-between items-center border-b pb-8 mb-8">
            <div className="flex gap-10">
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <img src={back} alt="Back" />
              </motion.button>

              <motion.h1
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Flutter Mobile App Developer
              </motion.h1>
            </div>

            <div className="flex space-x-6">
              <motion.button
                className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-lg font-semibold shadow-sm"
                onClick={() => openModal("Reject")}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Reject
              </motion.button>
              <motion.button
                className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-2 rounded-lg font-semibold shadow-sm"
                onClick={() => openModal("Accept")}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Accept
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            {/* Personal Details */}
            <div className="space-y-10">
              {/* Profile Image and Name */}
              <motion.div
                className="flex items-center space-x-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img
                  src={user.profileImg || profileDefault}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border shadow-md object-cover"
                />
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </motion.div>

              {/* Personal Info */}
              <div className="space-y-6 text-gray-700">
                {[
                  { label: "First Name", value: user.firstName },
                  { label: "Last Name", value: user.lastName },
                  { label: "Phone Number", value: user.phone },
                  { label: "Email", value: user.email },
                  { label: "Address", value: user.address },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex"
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={detailVariants}
                  >
                    <span className="text-gray-500 font-semibold w-44">
                      {item.label}:
                    </span>
                    <span>{item.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* Resume Section */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <p className="font-semibold text-gray-700 mb-3">Resume</p>
                <Link
                  to="/resume-download"
                  className="flex items-center bg-gray-100 hover:bg-gray-200 p-5 rounded-lg shadow-sm transition duration-300"
                >
                  <FaFileAlt className="text-gray-700 text-lg" />
                  <span className="ml-4 text-gray-800 font-medium">
                    {user.resume}
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Questions Section */}
            <div>
              <motion.h2
                className="text-xl font-semibold text-gray-900 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Questions
              </motion.h2>
              {user.questions.map((q, index) => (
                <motion.div
                  key={index}
                  className="mb-6 p-6 rounded-md font-sans bg-gray-50 hover:bg-gray-100 transition duration-300 border"
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={questionVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-gray-700 font-medium">{q.question}</p>
                  <p className="text-gray-900 font-semibold mt-2">
                    <span className="text-[#A1A1A1]">Answer:</span>{" "}
                    <span className="font-bold">{q.answer}</span>
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
              {modalOpen && (
                <motion.div
                  className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white p-6 rounded-lg shadow-lg w-[820px] h-auto relative"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h2 className="text-xl font-sans font-bold mb-4">
                      Leave a Comment
                    </h2>
                    <textarea
                      className="w-full border-[#201A23] hover:border-[#201A23] rounded p-4"
                      rows="6"
                      maxLength="1500"
                      placeholder="Write your reason here... (max 300 words)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    {/* Word Count */}
                    <div className="absolute bottom-12 right-4 text-sm text-gray-500">
                      {countWords(comment)} / 300 words
                    </div>
                    <div className="flex justify-end space-x-4 mt-4">
                      <motion.button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                        onClick={closeModal}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        className="bg-[#201A23] hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Send
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAppSeeker;