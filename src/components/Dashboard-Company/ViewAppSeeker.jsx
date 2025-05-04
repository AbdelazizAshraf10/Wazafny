import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import profileDefault from "../../assets/company/profile-default.svg";
import { FaFileAlt } from "react-icons/fa";
import HeaderCompany from "./HeaderCompany";
import back from "../../assets/company/backButton.svg";
import axios from "axios";

function ViewAppSeeker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  const [message, setMessage] = useState({ text: "", type: "" });

  // Auto-dismiss message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const openModal = (type) => {
    setActionType(type);
    setModalOpen(true);
    setSubmissionError(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setComment("");
    setSubmissionError(null);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setSubmissionError("Missing token. Please log in again.");
      navigate("/LoginCompany");
      return;
    }

    try {
      const response = await axios.put(
        `https://wazafny.online/api/update-application-status/${id}`,
        {
          status: actionType,
          response: comment || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage({
        text: `Application ${actionType} successfully!`,
        type: "success",
      });
      
      closeModal();
      // Refresh the application data to reflect the updated status
      fetchApplication();
    } catch (error) {
      console.error("Status update error:", error.message);
      if (error.response?.status === 401) {
        setSubmissionError("Unauthorized. Please log in again.");
        navigate("/LoginCompany");
      } else if (error.response?.status === 404) {
        setSubmissionError("Application not found.");
      } else if (error.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (error.response?.status === 422) {
        setError("Validation error. Please check your input.");
      } else {
        setSubmissionError("Failed to update status. Please try again.");
      }
    }
  };

  const fetchApplication = async () => {
    const token = localStorage.getItem("token");

    if (!token || !id) {
      setError("Missing token or application ID. Please try again.");
      setLoading(false);
      navigate("/LoginCompany");
      return;
    }

    

    try {
      const response = await axios.get(
        `https://wazafny.online/api/show-application-company/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      setUser({
        seekerId: data.seeker_id,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        email: data.email,
        address: `${data.city}, ${data.country}`,
        resume: data.resume,
        profileImg: data.profile_img,
        jobTitle: data.job_title,
        status: data.status || "Pending", // Add status, default to "Pending" if not provided
        questions:
          data.questions?.map((q) => ({
            question: q.question_text,
            answer: q.answer || "Not answered",
          })) || [],
      });
      setLoading(false);
    } catch (error) {
      console.error("Fetch Application Error:", error.message);
      if (error.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        navigate("/LoginCompany");
      } else if (error.response?.status === 404) {
        setError("Application not found.");
      } else {
        setError("Failed to fetch application. Please try again.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id, navigate]);

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const detailVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  const questionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-6">{error}</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-6">No application data available.</div>
    );
  }

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
      <div className="w-full min-h-screen bg-gray-50">
        <HeaderCompany />
        <hr className="border-t-2 border-gray-300 my-4" />

        <div className="container mx-auto w-full min-h-screen p-6">
          <div className="bg-white shadow-xl rounded-2xl p-10 w-full">
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
                  {user.jobTitle || "Job Title"}
                </motion.h1>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {user.status === "Accepted" || user.status === "Rejected" ? (
                  <div
                    className={`px-6 py-2 rounded-lg font-semibold shadow-sm ${
                      user.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </div>
                ) : (
                  <div className="flex space-x-6">
                    <motion.button
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-lg font-semibold shadow-sm"
                      onClick={() => openModal("Rejected")}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Reject
                    </motion.button>
                    <motion.button
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-2 rounded-lg font-semibold shadow-sm"
                      onClick={() => openModal("Accepted")}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Accept
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
              <div className="space-y-10">
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
                  <div onClick={() => navigate(`/dashboard/SeekerApplicant/${user.seekerId}`)}>
                    <p className="text-xl font-bold text-gray-900 cursor-pointer underline">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </motion.div>

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

                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <p className="font-semibold text-gray-700 mb-3">Resume</p>
                  <a
                    href={user.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-gray-100 hover:bg-gray-200 p-5 rounded-lg shadow-sm transition duration-300"
                  >
                    <FaFileAlt className="text-gray-700 text-lg" />
                    <span className="ml-4 text-gray-800 font-medium">
                      View Resume
                    </span>
                  </a>
                </motion.div>
              </div>

              {user.questions.length > 0 && (
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
              )}
            </div>
          </div>
        </div>

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
                {submissionError && (
                  <p className="text-red-500 text-sm mb-4">{submissionError}</p>
                )}
                <textarea
                  className="w-full border-[#201A23] border-2 hover:border-[#201A23] rounded-lg p-4"
                  rows="6"
                  maxLength="1500"
                  placeholder="Write your reason here... (max 300 words)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="absolute bottom-15 left-8 text-sm text-gray-500">
                  {countWords(comment)} / 300 words
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <motion.button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-7 py-2 rounded-lg font-semibold shadow-sm"
                    onClick={closeModal}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="bg-[#201A23] text-white px-7 py-2 rounded-lg font-semibold shadow-sm"
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
    </>
  );
}

export default ViewAppSeeker;
