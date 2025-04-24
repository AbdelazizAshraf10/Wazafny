import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TrashIcon from "../../../assets/company/delete-icon.svg";

function ExtraSections() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sections, setSections] = useState(() => {
    const savedSections = localStorage.getItem("extraSectionsData");
    return location.state?.sections || (savedSections ? JSON.parse(savedSections) : []);
  });

  const [skills] = useState(() => {
    const savedSkills = localStorage.getItem("skillsData");
    return location.state?.skills || (savedSkills ? JSON.parse(savedSkills) : []);
  });

  const [formData] = useState(() => location.state?.formData || {});

  useEffect(() => {
    localStorage.setItem("extraSectionsData", JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem("skillsData", JSON.stringify(skills));
  }, [skills]);

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        title: "",
        description: "",
      },
    ]);
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const handleRemoveSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const handleBack = () => {
    navigate("/Dashboard/Jobpost/skills", {
      state: {
        jobId: location.state?.jobId,
        formData,
        skills,
        sections,
        questions: location.state?.questions || [],
        isEdit: location.state?.isEdit || false,
      },
    });
  };

  const handleNext = () => {
    navigate("/Dashboard/Jobpost/questions", {
      state: {
        jobId: location.state?.jobId,
        formData,
        skills,
        sections,
        questions: location.state?.questions || [],
        isEdit: location.state?.isEdit || false,
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
    <div className="w-full min-h-screen bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-4xl font-sans font-bold text-center mt-10 text-[#201A23] mb-10">
        Extra Sections
      </h2>

      <div className="mb-6 ml-10">
        {sections.length === 0 ? (
          <button
            onClick={handleAddSection}
            className="text-[#6A0DAD] font-bold flex items-center gap-2"
          >
            <span className="text-2xl">+</span> Add Section
          </button>
        ) : (
          <>
            {sections.map((section, index) => (
              <div key={index} className="mb-8">
                <div className="flex items-center mb-2">
                  <span className="text-[#201A23] font-bold mr-2">Section Title</span>
                  <span className="text-red-500">*</span>
                </div>
                <div className="flex items-center mb-6 relative">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      handleSectionChange(index, "title", e.target.value)
                    }
                    className="w-[1100px] p-3 border border-gray-300 rounded-lg focus:outline-none"
                    placeholder="Enter section title"
                  />
                  <button
                    onClick={() => handleRemoveSection(index)}
                    className="ml-4 text-gray-500 hover:text-red-500 focus:outline-none"
                  >
                    <img src={TrashIcon} alt="Delete" className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-[#201A23] font-bold mr-2">Section Description</span>
                  <span className="text-red-500">*</span>
                </div>
                <div className="mb-6">
                  <textarea
                    value={section.description}
                    onChange={(e) =>
                      handleSectionChange(index, "description", e.target.value)
                    }
                    className="w-[1100px] p-3 border border-gray-300 rounded-lg focus:outline-none h-32 resize-none"
                    placeholder="Describe the section"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-right">
                    {wordCount(section.description)}/500 words
                  </p>
                </div>
              </div>
            ))}
            <div className="mb-6">
              <button
                onClick={handleAddSection}
                className="text-[#6A0DAD] font-bold flex items-center gap-2"
              >
                <span className="text-2xl">+</span> Add new Section
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between mt-20 space-x-4 ml-10 mr-10">
        <button
          onClick={handleCancel}
          className="py-2 px-10 border-2 font-sans border-[#000000] rounded-lg text-[#201A23] font-bold hover:bg-gray-200 focus:outline-none"
        >
          Cancel
        </button>
        <div className="flex space-x-4">
          <button
            onClick={handleBack}
            className="py-2 px-10 border-2 font-sans border-[#000000] rounded-lg text-[#201A23] font-bold hover:bg-gray-200 focus:outline-none"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="py-2 px-10 bg-[#201A23] font-sans text-white rounded-lg font-bold hover:bg-gray-800 focus:outline-none"
          >
            {sections.length === 0 ? "Skip" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExtraSections;