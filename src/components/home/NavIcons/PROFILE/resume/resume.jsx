import { Pencil } from "lucide-react";
import { useState } from "react";
import Modal from "../profile/Modal";
import upload1 from "../../../../../assets/upload-file.png";
import upload2 from "../../../../../assets/resume-cv.png";

function Resume() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

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
    if (event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex justify-center mt-2">
      <div className="bg-white border border-[#D9D9D9] rounded-xl w-[900px] h-[130px] p-6 relative">
        {/* Title with Pencil Icon in the Top Right */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#201A23]">Resume</h3>
          <Pencil
            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Display Uploaded File Name */}
        <div className="flex items-center justify-center mt-3 ml-2">
          {file ? ( // Check if file exists before accessing file.name
            <>
              <img src={upload2} alt="Upload Icon" className="w-15 h-10 mr-3" />
              <p className="text-[#201A23] font-semibold">{file.name}</p>
            </>
          ) : (
            <p className="text-[#A1A1A1]  text-center">
              Upload your resume here to showcase your skills and experience.
            </p>
          )}
        </div>

        

        


          
        
        
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Resume"}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-[819px] h-[450px] text-center relative">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Resume</h2>
              <button
                className="text-gray-500 hover:text-black"
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
            </div>
            <p className="text-[#A1A1A1] text-left">
              Upload your resume here to showcase your skills and experience.
            </p>

            {/* Drag-and-Drop File Upload Box */}
            <div
              className={`w-full h-60 border-2 ${
                dragging ? "border-blue-500" : "border-gray-500"
              } border-dotted rounded-xl flex flex-col items-center justify-center p-6 mt-5`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="flex p-3 rounded-md">
                  <img src={upload1} alt="Upload Icon" />
                  <div>
                    <p className="text-xl text-left font-bold text-gray-900 mt-6">
                      {file ? file.name : "Upload Resume"}
                    </p>
                    <p className="text-md text-gray-500 mt-3">
                      Accepted file types are{" "}
                      <span className="font-semibold">PDF, DOC, DOCX</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                className="hidden"
                accept=".pdf, .doc, .docx"
                onChange={handleFileChange}
              />

              {/* Button for Manual Upload */}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf, .doc, .docx"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-[#201A23] font-bold text-white px-9 py-2 rounded-md"
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
