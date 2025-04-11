import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Import SVG as a static asset
import TrashIcon from "../../../assets/company/delete-icon.svg";

function Questions() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize questions with data from location.state or localStorage, fallback to empty array
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questionsData");
    return location.state?.questions || (savedQuestions ? JSON.parse(savedQuestions) : []);
  });

  // Initialize skills with data from location.state or localStorage, fallback to empty array
  const [skills, setSkills] = useState(() => {
    const savedSkills = localStorage.getItem("skillsData");
    return location.state?.skills || (savedSkills ? JSON.parse(savedSkills) : []);
  });

  // Save questions to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("questionsData", JSON.stringify(questions));
  }, [questions]);

  // Save skills to localStorage whenever it changes (optional, as skills don't change here)
  useEffect(() => {
    localStorage.setItem("skillsData", JSON.stringify(skills));
  }, [skills]);

  // Function to add a new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
      },
    ]);
  };

  // Function to update question field values
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Function to remove a question
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Navigate to the previous step (Extra Sections)
  const handleBack = () => {
    navigate("/Dashboard/Jobpost/extra-sections", { state: { skills, questions } });
  };

  // Navigate to the preview page
  const handleNextOrPreview = () => {
    // Always navigate to the preview page, regardless of whether questions are added
    navigate("/Dashboard/Jobpost/preview", { state: { skills, questions } });
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 rounded-xl shadow-md flex flex-col">
      <h2 className="text-4xl font-sans font-bold text-center mt-10 text-[#201A23] mb-10">
        Questions
      </h2>

      {/* Questions List */}
      <div className="flex-1 mb-6 ml-10">
        {questions.length === 0 ? (
          <button
            onClick={handleAddQuestion}
            className="text-[#6A0DAD] font-bold flex items-center gap-2"
          >
            <span className="text-2xl">+</span> Add Question
          </button>
        ) : (
          <>
            {questions.map((question, index) => (
              <div key={index} className="mb-8">
                {/* Question Label (Dynamic Counter) */}
                <div className="flex items-center mb-2">
                  <span className="text-[#201A23] font-bold mr-2">
                    Question {index + 1}
                  </span>
                  <span className="text-red-500">*</span>
                </div>

                {/* Question Input with Trash Icon */}
                <div className="flex items-center mb-6 relative">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    className="w-[1100px] p-3 border border-gray-300 rounded-lg focus:outline-none"
                    placeholder={`Enter question ${index + 1}`}
                  />
                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveQuestion(index)}
                    className="ml-4 text-gray-500 hover:text-red-500 focus:outline-none"
                  >
                    <img src={TrashIcon} alt="Delete" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Question Button (Appears after adding a question) */}
            <div className="mb-6">
              <button
                onClick={handleAddQuestion}
                className="text-[#6A0DAD] font-bold flex items-center gap-2"
              >
                <span className="text-2xl">+</span> Add new Question
              </button>
            </div>
          </>
        )}
      </div>

      {/* Buttons Container (Sticky at the Bottom) */}
      <div className="mt-auto flex justify-between space-x-4 ml-10 mr-10 pb-8">
        <button
          onClick={handleBack}
          className="py-2 px-6 border border-gray-300 rounded-lg text-[#201A23] font-bold hover:bg-gray-100 focus:outline-none"
        >
          Back
        </button>
        <button
          onClick={handleNextOrPreview}
          className="py-2 px-6 bg-[#201A23] text-white rounded-lg font-bold hover:bg-gray-800 focus:outline-none"
        >
          {questions.length === 0 ? "Skip and Preview" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Questions;