import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "../profile/Modal";
import axios from "axios";

function About({ userRole, initialAbout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aboutText, setAboutText] = useState(""); // Stores the entered text
  const [savedText, setSavedText] = useState(""); // Stores the saved text
  const [apiError, setApiError] = useState(""); // For API errors
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
      setApiError(""); // Clear any previous errors when typing
    }
  };

  // Save function with API call
  const handleSave = async () => {
    // Retrieve the token and seeker_id from localStorage
    const token = localStorage.getItem("token");
    const seeker_id = localStorage.getItem("seeker_id");

    if (!token) {
      setApiError("Authentication token not found. Please log in again.");
      return;
    }

    if (!seeker_id) {
      setApiError("Seeker ID not found. Please log in again.");
      return;
    }

    // Prepare the API request body
    const requestBody = {
      seeker_id: parseInt(seeker_id), // Convert to integer as API expects a number
      about: aboutText,
    };

    try {
      const response = await axios.post(
        "https://wazafny.online/api/update-about",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );
      console.log("API Response:", response.data);

      // On success, save the text and close the modal
      setSavedText(aboutText);
      setIsModalOpen(false);
      setApiError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error updating about:", error);
      setApiError(
        error.response?.data?.message || "Failed to update about. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center mt-4 w-full">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {/* Responsive Modal Container */}
          <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-full max-w-[819px] h-auto relative">
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
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default About;