import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "../profile/Modal";
import upload1 from "../../../../../assets/ressssssss.svg";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import { Navigate } from "react-router-dom";

function Resume({ userRole, initialResume }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [isNewFile, setIsNewFile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [floatMessage, setFloatMessage] = useState({ message: "", type: "" }); // State to manage float message
  const [shouldNavigate, setShouldNavigate] = useState(false); // State to control navigation

  // Initialize state with initialResume
  useEffect(() => {
    if (initialResume) {
      setResumeUrl(initialResume);
      const fileName = initialResume.split("/").pop();
      setFile({ name: fileName });
      setIsNewFile(false);
    }
  }, [initialResume]);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Validate file type and size
    if (
      selectedFile &&
      /\.(pdf|doc|docx)$/i.test(selectedFile.name) &&
      selectedFile.size <= 5 * 1024 * 1024
    ) {
      setFile(selectedFile);
      setErrorMessage("");
      setApiError("");
      setIsNewFile(true);
    } else {
      setErrorMessage(
        "Invalid file type or size. Only PDF, DOC, and DOCX files up to 5MB are allowed."
      );
      showFloatMessage("error", "Invalid file type or size. Only PDF, DOC, and DOCX files up to 5MB are allowed.");
      setFile(null);
      setIsNewFile(false);
    }
  };

  // Drag-and-drop handlers
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile = event.dataTransfer.files[0];

    // Validate file type
    if (droppedFile && /\.(pdf|doc|docx)$/i.test(droppedFile.name)) {
      setFile(droppedFile);
      setErrorMessage("");
      setApiError("");
      setIsNewFile(true);
    } else {
      setErrorMessage(
        "Invalid file type. Only PDF, DOC, and DOCX files are allowed."
      );
      showFloatMessage("error", "Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
      setFile(null);
      setIsNewFile(false);
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
    if (!file) {
      setErrorMessage("Please upload a resume file.");
      showFloatMessage("error", "Please upload a resume file.");
      return;
    }

    setIsLoading(true);

    const token = localStorage.getItem("token");
    const seeker_id = localStorage.getItem("seeker_id");

    if (!token) {
      setApiError("Authentication token not found. Please log in again.");
      showFloatMessage("error", "Authentication token not found. Please log in again.");
      setIsLoading(false);
      setShouldNavigate(true);
      return;
    }

    if (!seeker_id) {
      setApiError("Seeker ID not found. Please log in again.");
      showFloatMessage("error", "Seeker ID not found. Please log in again.");
      setIsLoading(false);
      setShouldNavigate(true);
      return;
    }

    // Create FormData for the API request
    const formData = new FormData();
    formData.append("seeker_id", seeker_id);
    formData.append("resume", file);

    try {
      const response = await axios.post(
        "https://laravel.wazafny.online/api/update-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

     

      const updatedResumeUrl =
        response.data.resume || URL.createObjectURL(file);
      setResumeUrl(updatedResumeUrl);
      setIsModalOpen(false);
      setApiError("");
      setIsNewFile(false);
    } catch (error) {
      if (error.response?.status === 404) {
        console.error("Seeker not found:", error.response.data);
        setApiError(
          error.response?.data?.message || "Seeker not found. Please try again."
        );
        showFloatMessage("error", error.response?.data?.message || "Seeker not found. Please try again.");
      } else if (error.response?.status === 401) {
        const errorMessage = "Unauthorized: " + (error.response?.data?.message || "Invalid token. Please log in again.");
        showFloatMessage("error", errorMessage);
        setApiError("Unauthorized: Please log in again.");
        setShouldNavigate(true);
      } else if (error.response?.status === 500) {
        console.error("Server error:", error.response.data);
        setApiError(
          error.response?.data?.message || "Server error. Please try again later."
        );
        showFloatMessage("error", error.response?.data?.message || "Server error. Please try again later.");
      } else if (error.response?.status === 422) {
        console.error("Validation error:", error.response.data);
        setApiError(
          error.response?.data?.message || "Validation error. Please check your input."
        );
        showFloatMessage("error", error.response?.data?.message || "Validation error. Please check your input.");
      } else {
        console.error("Error updating resume:", error);
        setApiError(
          error.response?.data?.message || "Failed to update resume. Please try again."
        );
        showFloatMessage("error", error.response?.data?.message || "Failed to update resume. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
          <h3 className="text-lg md:text-xl font-bold text-[#201A23]">
            Resume
          </h3>
          {userRole !== "Company" && (
            <Pencil
              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
              onClick={() => setIsModalOpen(true)}
            />
          )}
        </div>

        {/* Display Uploaded File Name or Placeholder Message */}
        <div
          className={`flex items-center mt-4 ${
            file ? "justify-start" : "justify-center"
          }`}
        >
          {file ? (
            <div className="flex items-center ml-2">
              <img src={upload1} alt="Upload Icon" className="w-12 h-8 mr-3" />
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  download={file.name}
                  className="text-[#201A23] font-semibold text-sm md:text-base hover:underline"
                >
                  {file.name}
                </a>
              ) : (
                <p className="text-[#201A23] font-semibold text-sm md:text-base">
                  {file.name}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[#A1A1A1] text-sm md:text-base">
              Upload your resume here to showcase your skills and experience.
            </p>
          )}
        </div>
      </div>

      {/* Modal for Uploading Resume */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Resume"}
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
                className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-[819px] h-auto text-center relative"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 md:h-60">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#201A23]"></div>
                    <p className="mt-4 text-lg font-semibold text-[#201A23]">
                      Uploading Resume...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="flex justify-between mb-4">
                      <h2 className="text-lg md:text-xl font-bold">Resume</h2>
                      <button
                        className="text-gray-500 hover:text-black text-lg"
                        onClick={() => setIsModalOpen(false)}
                      >
                        ✖
                      </button>
                    </div>

                    {/* Instructions */}
                    <p className="text-[#A1A1A1] text-left text-sm md:text-base">
                      Upload your resume here to showcase your skills and
                      experience.
                    </p>

                    {/* Error Messages */}
                    {errorMessage && (
                      <p className="text-red-500 text-sm mt-2">
                        {errorMessage}
                      </p>
                    )}
                    {apiError && (
                      <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                        {apiError}
                      </div>
                    )}

                    {/* Drag-and-Drop File Upload Box */}
                    <label
                      htmlFor="file-upload"
                      className={`w-full h-48 md:h-60 border-2 ${
                        dragging ? "border-blue-500" : "border-gray-500"
                      } border-dotted rounded-xl flex flex-col items-center justify-center p-4 md:p-6 mt-5 cursor-pointer`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={upload1}
                          alt="Upload Icon"
                          className="w-10 h-10"
                        />
                        <div className="ml-3 text-center">
                          <p className="text-base md:text-lg font-bold text-gray-900 mt-2">
                            {file ? file.name : "Upload Resume"}
                          </p>
                          <p className="text-sm md:text-base text-gray-500 mt-1">
                            Accepted file types are{" "}
                            <span className="font-semibold">
                              PDF, DOC, DOCX
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>

                    {/* Save Button */}
                    <div className="flex justify-end mt-4">
                      <button
                        className={`font-bold text-white px-6 py-2 rounded-md text-sm md:text-base ${
                          isNewFile
                            ? "bg-[#201A23]"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        onClick={handleSave}
                        disabled={!isNewFile || isLoading}
                      >
                        Save
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
}

export default Resume;