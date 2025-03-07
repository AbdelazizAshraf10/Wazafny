import { Pencil } from "lucide-react";
import { useState } from "react";
import Modal from "../profile/Modal";
import upload1 from "../../../../../assets/upload-file.png";

function Resume() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Validate file type
    if (selectedFile && /\.(pdf|doc|docx)$/i.test(selectedFile.name)) {
      setFile(selectedFile);
      setErrorMessage(""); // Clear any previous error
    } else {
      setErrorMessage("Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
      setFile(null); // Reset file state
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
      setErrorMessage(""); // Clear any previous error
    } else {
      setErrorMessage("Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
      setFile(null); // Reset file state
    }
  };

  return (
    <div className="flex justify-center mt-4 w-full">
      {/* Main Container */}
      <div className="bg-white border border-[#D9D9D9] rounded-xl w-full max-w-[900px] p-6 md:p-8 relative">
        {/* Title with Pencil Icon in the Top Right */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-bold text-[#201A23]">Resume</h3>
          <Pencil
            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Display Uploaded File Name */}
        <div className="flex items-center justify-center mt-4 ml-2">
          {file ? (
            <>
              <img src={upload1} alt="Upload Icon" className="w-12 h-8 mr-3" />
              <p className="text-[#201A23] font-semibold text-sm md:text-base">
                {file.name}
              </p>
            </>
          ) : (
            <p className="text-[#A1A1A1] text-center text-sm md:text-base">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {/* Responsive Modal Container */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-[819px] h-auto text-center relative">
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
              Upload your resume here to showcase your skills and experience.
            </p>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
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
                <img src={upload1} alt="Upload Icon" className="w-10 h-10" />
                <div className="ml-3 text-center">
                  <p className="text-base md:text-lg font-bold text-gray-900 mt-2">
                    {file ? file.name : "Upload Resume"}
                  </p>
                  <p className="text-sm md:text-base text-gray-500 mt-1">
                    Accepted file types are{" "}
                    <span className="font-semibold">PDF, DOC, DOCX</span>
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
                className="bg-[#201A23] font-bold text-white px-6 py-2 rounded-md text-sm md:text-base"
                onClick={() => setIsModalOpen(false)}
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

export default Resume;