import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Import SVG as a static asset
import TrashIcon from "../../../assets/company/delete-icon.svg";

function ExtraSections() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize sections with data from location.state or localStorage, fallback to empty array
  const [sections, setSections] = useState(() => {
    const savedSections = localStorage.getItem("extraSectionsData");
    return location.state?.sections || (savedSections ? JSON.parse(savedSections) : []);
  });

  // Initialize skills with data from location.state or localStorage, fallback to empty array
  const [skills, setSkills] = useState(() => {
    const savedSkills = localStorage.getItem("skillsData");
    return location.state?.skills || (savedSkills ? JSON.parse(savedSkills) : []);
  });

  // Save sections to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("extraSectionsData", JSON.stringify(sections));
  }, [sections]);

  // Save skills to localStorage whenever it changes (optional, if skills can change here)
  useEffect(() => {
    localStorage.setItem("skillsData", JSON.stringify(skills));
  }, [skills]);

  // Function to add a new section
  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        title: "",
        description: "",
      },
    ]);
  };

  // Function to update section field values
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  // Function to remove a section
  const handleRemoveSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  // Function to calculate word count
  const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  // Navigate to the previous step
  const handleBack = () => {
    navigate("/Dashboard/Jobpost/skills", { state: { skills, sections } });
  };

  // Navigate to the next step
  const handleNext = () => {
    navigate("/Dashboard/Jobpost/questions", { state: { skills, sections } });
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-4xl font-sans font-bold text-center mt-10 text-[#201A23] mb-10">
        Extra Sections
      </h2>

      {/* Sections List */}
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
                {/* Section Title Label (Static Text) */}
                <div className="flex items-center mb-2">
                  <span className="text-[#201A23] font-bold mr-2">Section Title</span>
                  <span className="text-red-500">*</span>
                </div>

                {/* Section Title Input */}
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
                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveSection(index)}
                    className="ml-4 text-gray-500 hover:text-red-500 focus:outline-none"
                  >
                    <img src={TrashIcon} alt="Delete" className="w-5 h-5" />
                  </button>
                </div>

                {/* Section Description Label (Static Text) */}
                <div className="flex items-center mb-2">
                  <span className="text-[#201A23] font-bold mr-2">Section Description</span>
                  <span className="text-red-500">*</span>
                </div>

                {/* Section Description Textarea */}
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

            {/* Add New Section Button (Appears after adding a section) */}
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

      {/* Buttons */}
      <div className="flex justify-between mt-20 space-x-4 ml-10 mr-10">
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
  );
}

export default ExtraSections;