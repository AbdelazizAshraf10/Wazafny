import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TrashIcon from "../../../assets/company/delete-icon.svg";

function Questions() {
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questionsData");
    const initialQuestions = location.state?.questions || (savedQuestions ? JSON.parse(savedQuestions) : []);
    // Ensure questions are strings, not objects
    return Array.isArray(initialQuestions)
      ? initialQuestions.map((q) => (typeof q === "object" && q.question ? q.question : q)).filter((q) => q != null)
      : [];
  });

  const [skills] = useState(() => {
    const savedSkills = localStorage.getItem("skillsData");
    return location.state?.skills || (savedSkills ? JSON.parse(savedSkills) : []);
  });

  const [sections] = useState(() => {
    const savedSections = localStorage.getItem("extraSectionsData");
    return location.state?.sections || (savedSections ? JSON.parse(savedSections) : []);
  });

  const [formData] = useState(() => location.state?.formData || {});

  useEffect(() => {
    localStorage.setItem("questionsData", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem("skillsData", JSON.stringify(skills));
  }, [skills]);

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleBack = () => {
    const backPath = location.state?.isEdit
      ? `/Dashboard/Jobpost/${location.state.jobId}/extra-sections`
      : "/Dashboard/Jobpost/extra-sections";

    navigate(backPath, {
      state: {
        jobId: location.state?.jobId,
        formData,
        skills,
        sections,
        questions,
        isEdit: location.state?.isEdit || false,
      },
    });
  };

  const handleNextOrPreview = () => {
    // Ensure jobId is available when in edit mode
    const jobId = location.state?.jobId;
    const isEdit = location.state?.isEdit || false;

    // Construct the correct path based on whether we're editing or creating
    let nextPath;
    if (isEdit) {
      if (!jobId) {
        console.error("Job ID is missing for edit mode navigation.");
        return; // Prevent navigation if jobId is missing
      }
      nextPath = `/Dashboard/Jobpost/${jobId}/preview`;
    } else {
      nextPath = "/Dashboard/Jobpost/preview";
    }

    navigate(nextPath, {
      state: {
        jobId: jobId, // Ensure jobId is passed even if not used in create mode
        formData,
        skills,
        sections,
        questions,
        isEdit: isEdit,
      },
    });
  };

  const handleCancel = () => {
    localStorage.removeItem("basicInfoFormData");
    localStorage.removeItem("skillsData");
    localStorage.removeItem("extraSectionsData");
    localStorage.removeItem("questionsData");
    navigate("/Dashboard/Jobpost");
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 rounded-xl shadow-md flex flex-col">
      <h2 className="text-4xl font-sans font-bold text-center mt-10 text-[#201A23] mb-10">
        Questions
      </h2>

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
                <div className="flex items-center mb-2">
                  <span className="text-[#201A23] font-bold mr-2">
                    Question {index + 1}
                  </span>
                  <span className="text-red-500">*</span>
                </div>
                <div className="flex items-center mb-6 relative">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="w-[1100px] p-3 border border-gray-300 rounded-lg focus:outline-none"
                    placeholder={`Enter question ${index + 1}`}
                  />
                  <button
                    onClick={() => handleRemoveQuestion(index)}
                    className="ml-4 text-gray-500 hover:text-red-500 focus:outline-none"
                  >
                    <img src={TrashIcon} alt="Delete" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
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

      <div className="mt-auto flex justify-between space-x-4 ml-10 mr-10 pb-8">
        <button
          onClick={handleCancel}
          className="py-2 px-6 border border-gray-300 rounded-lg text-[#201A23] font-bold hover:bg-gray-100 focus:outline-none"
        >
          Cancel
        </button>
        <div className="flex space-x-4">
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
    </div>
  );
}

export default Questions;