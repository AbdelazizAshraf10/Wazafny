import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <HeaderCompany />
      <hr className="border-t-2 border-gray-300 my-4" />

      <div className="container mx-auto w-full min-h-screen p-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full">
          {/* Header Section */}
          <div className="flex justify-between items-center border-b pb-8 mb-8">
            <div className="flex gap-10">
              <button onClick={() => navigate(-1)}>
                <img src={back} alt="Back" />
              </button>

              <h1 className="text-2xl font-bold text-gray-900">
                Flutter Mobile App Developer
              </h1>
            </div>

            <div className="flex space-x-6">
              <button
                className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-lg font-semibold transition duration-300 shadow-sm"
                onClick={() => openModal("Reject")}
              >
                Reject
              </button>
              <button
                className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-2 rounded-lg font-semibold transition duration-300 shadow-sm"
                onClick={() => openModal("Accept")}
              >
                Accept
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            {/* Personal Details */}
            <div className="space-y-10">
              {/* Profile Image and Name */}
              <div className="flex items-center space-x-6">
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
              </div>

              {/* Personal Info */}
              <div className="space-y-6 text-gray-700">
                <div className="flex">
                  <span className="text-gray-500 font-semibold w-44">
                    First Name:
                  </span>
                  <span>{user.firstName}</span>
                </div>

                <div className="flex">
                  <span className="text-gray-500 font-semibold w-44">
                    Last Name:
                  </span>
                  <span>{user.lastName}</span>
                </div>

                <div className="flex">
                  <span className="text-gray-500 font-semibold w-44">
                    Phone Number:
                  </span>
                  <span>{user.phone}</span>
                </div>

                <div className="flex">
                  <span className="text-gray-500 font-semibold w-44">
                    Email:
                  </span>
                  <span>{user.email}</span>
                </div>

                <div className="flex">
                  <span className="text-gray-500 font-semibold w-44">
                    Address:
                  </span>
                  <span>{user.address}</span>
                </div>
              </div>

              {/* Resume Section */}
              <div className="mt-8">
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
              </div>
            </div>

            {/* Questions Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Questions
              </h2>
              {user.questions.map((q, index) => (
                <div
                  key={index}
                  className="mb-6 p-6 rounded-md font-sans bg-gray-50 hover:bg-gray-100 transition duration-300 border"
                >
                  <p className="text-gray-700 font-medium">{q.question}</p>
                  <p className="text-gray-900 font-semibold mt-2">
                    <span className="text-[#A1A1A1]">Answer:</span>{" "}
                    <span className="font-bold">{q.answer}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Modal */}
            {modalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[820px] h-auto">
                  <h2 className="text-xl font-sans font-bold mb-4">Leave a Comment</h2>
                  <textarea
                    className="w-full hover:border-[#201A23] rounded p-4"
                    rows="6"
                    maxLength="1500"
                    placeholder="Write your reason here... (max 300 words)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  {/* Word Count */}
                  <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                    {countWords(comment)} / 300 words
                  </div>
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-[#201A23] hover:bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={handleSubmit}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAppSeeker;
