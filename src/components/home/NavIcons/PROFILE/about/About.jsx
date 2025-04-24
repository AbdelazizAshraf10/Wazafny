import { Pencil } from "lucide-react";
import { useState } from "react";
import Modal from "../profile/Modal";

function About({ userRole }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aboutText, setAboutText] = useState(""); // Stores the entered text
  const [savedText, setSavedText] = useState(""); // Stores the saved text
  const maxWords = 250;

  // Function to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Handle textarea change
  const handleChange = (e) => {
    const words = countWords(e.target.value);
    if (words <= maxWords) {
      setAboutText(e.target.value);
    }
  };

  // Save function
  const handleSave = () => {
    setSavedText(aboutText); // Save the entered text
    setIsModalOpen(false); // Close the modal
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
          <p className={`text-[#A1A1A1] ${savedText ? 'text-left' : 'text-center'} text-sm md:text-base`}>
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