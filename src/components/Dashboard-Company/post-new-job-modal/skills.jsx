import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Skills() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize skills with data from location.state or localStorage, fallback to empty array
  const [skills, setSkills] = useState(() => {
    const savedSkills = localStorage.getItem("skillsData");
    return location.state?.skills || (savedSkills ? JSON.parse(savedSkills) : []);
  });

  // Retrieve formData from BasicInfo to pass back
  const [formData] = useState(() => location.state?.formData || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  // Save skills to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("skillsData", JSON.stringify(skills));
  }, [skills]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (showWarning && skills.length > 0) {
      setShowWarning(false);
    }
  };

  // Handle adding a skill when the user presses "Enter"
  const handleAddSkill = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      const newSkill = searchTerm.trim();
      if (!skills.some((skill) => skill.toLowerCase() === newSkill.toLowerCase())) {
        setSkills([...skills, newSkill]);
        setShowWarning(false);
      }
      setSearchTerm("");
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    if (updatedSkills.length === 0) {
      setShowWarning(true);
    }
  };

  // Navigate to the previous step (pass formData back)
  const handleBack = () => {
    navigate("/Dashboard/Jobpost/basic-info", { state: { formData, skills } });
  };

  // Navigate to the next step
  const handleNext = () => {
    if (skills.length === 0) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    navigate("/Dashboard/Jobpost/extra-sections", { state: { formData, skills } });
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-4xl font-sans font-bold text-center mt-10 text-[#201A23] mb-10">Skills</h2>

      {/* Search Input */}
      <div className="mb-6 ml-10">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleAddSkill}
            className="w-[1100px] p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Search here for your skills"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Selected Skills */}
      <div className="mb-6 ml-10">
        <div className="border w-[1100px] border-gray-300 rounded-lg p-4 min-h-[300px] flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <div
                key={index}
                className="bg-[#201A23] text-white h-10 px-3 py-1 rounded-md flex items-center gap-2"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-white hover:text-gray-300 focus:outline-none"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No skills added yet.</p>
          )}
        </div>
      </div>

      {/* Warning Message */}
      {showWarning && (
        <p className="text-sm text-red-500 mb-6 ml-10">Please add at least one skill to proceed.</p>
      )}

      {/* Note */}
      <p className="text-sm text-gray-500 mb-6 ml-10">Note : Add at least one skill</p>

      {/* Buttons */}
      <div className="flex justify-between mt-20 space-x-4 ml-10 mr-10">
        <button
          onClick={handleBack}
          className="py-2 px-6 border border-gray-300 rounded-lg text-[#201A23] font-bold hover:bg-gray-100 focus:outline-none"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="py-2 px-6 bg-[#201A23] text-white rounded-lg font-bold hover:bg-gray-800 focus:outline-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Skills;