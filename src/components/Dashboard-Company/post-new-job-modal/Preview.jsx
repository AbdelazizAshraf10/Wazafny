import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Vod from "../../../assets/company/vod.png";

function Preview() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve data from location.state or localStorage, with fallback defaults
  const basicInfo = location.state?.basicInfo || JSON.parse(localStorage.getItem("basicInfoFormData")) || {
    companyName: "Vodafone Egypt",
    companyLogo: Vod,
    jobTitle: "Mobile Software Engineer",
    location: "Cairo, Egypt",
    workType: "Remote",
    employmentType: "Full-time",
    postedDate: "4 days ago",
    description:
      "We're seeking an experienced Mobile Software Engineer with a passion for development and a team-oriented attitude, ready to bring powerful software to life.\n\nAs a Mobile Engineer at Blink22, your role will involve collaborating with various departments within the company to ensure the successful creation and implementation of innovative and streamlined mobile experiences. Additionally, you will actively contribute to enhancing our internal workflows for fostering a culture of continuous improvement and transparency. This position also offers ample opportunities for personal and professional growth as a Mobile Engineer.",
  };

  const skills = location.state?.skills || JSON.parse(localStorage.getItem("skillsData")) || [
    "Dart",
    "Kotlin",
    "Java",
    "Firebase",
  ];

  const extraSections = location.state?.extraSections || JSON.parse(localStorage.getItem("extraSectionsData")) || [
    {
      titleLabel: "Requirements",
      description: "Required Technical Skills:",
    },
  ];

  const questions = location.state?.questions || JSON.parse(localStorage.getItem("questionsData")) || [];

  // Update localStorage when data is received via location.state
  useEffect(() => {
    if (location.state?.basicInfo) {
      localStorage.setItem("basicInfoFormData", JSON.stringify(location.state.basicInfo));
    }
    if (location.state?.skills) {
      localStorage.setItem("skillsData", JSON.stringify(location.state.skills));
    }
    if (location.state?.extraSections) {
      localStorage.setItem("extraSectionsData", JSON.stringify(location.state.extraSections));
    }
    if (location.state?.questions) {
      localStorage.setItem("questionsData", JSON.stringify(location.state.questions));
    }
  }, [location.state]);

  // Navigate to the previous step
  const handleBack = () => {
    navigate("/Dashboard/Jobpost/questions", { state: { basicInfo, skills, extraSections } });
  };

  // Navigate to the job post overview after saving and clear all stored data
  const handleSave = () => {
    // Clear all localStorage data related to the form
    localStorage.removeItem("basicInfoFormData");
    localStorage.removeItem("skillsData");
    localStorage.removeItem("extraSectionsData");
    localStorage.removeItem("questionsData");
    // Navigate back to the job post overview
    navigate("/Dashboard/Jobpost");
  };

  // Handle image loading errors
  const handleImageError = (event) => {
    event.target.src = "../../assets/default-logo.png"; // Fallback logo
    event.target.alt = "Default Logo";
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 rounded-xl shadow-md">
      {/* Buttons (Aligned to the top right) */}
      <div className="flex justify-end space-x-7 mb-6">
        <button
          onClick={handleBack}
          className="py-2 px-10 border-2 border-[#000000] font-sans rounded-lg text-[#201A23] font-bold hover:bg-gray-200 focus:outline-none"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="py-2 px-10 bg-[#6A0DAD] font-sans text-white rounded-lg font-bold hover:bg-[#5a0b9d] focus:outline-none"
        >
          Save
        </button>
      </div>

      {/* Header Section */}
      <div className="mb-6 ml-10">
        <div className="flex items-center mb-2">
          <div className="flex items-center text-black font-bold py-1 rounded-md">
            {/* Company Logo */}
            <img
              src={basicInfo.companyLogo}
              alt={`${basicInfo.companyName} Logo`}
              className="w-10 h-10 mr-2 rounded-sm"
              onError={handleImageError}
            />
            {/* Company Name */}
            <span>{basicInfo.companyName}</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[#201A23] mb-2">{basicInfo.jobTitle}</h2>
        <p className="text-gray-500">
          {basicInfo.location} • {basicInfo.workType} • {basicInfo.employmentType} •{" "}
          {basicInfo.postedDate}
        </p>
      </div>

      {/* Skills Section */}
      <div className="mb-6 ml-10">
        <h3 className="text-lg font-bold text-[#201A23] mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-[#F2E9FF] text-[#201A23] px-3 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* About the Job Section */}
      <div className="mb-6 ml-10">
        <h3 className="text-lg font-bold text-[#201A23] mb-2">About the job</h3>
        <p className="text-[#201A23] whitespace-pre-line">{basicInfo.description}</p>
      </div>

      {/* Extra Sections */}
      {extraSections.map((section, index) => (
        <div key={index} className="mb-6 ml-10">
          <h3 className="text-lg font-bold text-[#201A23] mb-2">{section.titleLabel || section.title}</h3>
          <p className="text-[#201A23] whitespace-pre-line">{section.description}</p>
        </div>
      ))}

      {/* Questions Section */}
      {questions.length > 0 && (
        <div className="mb-6 ml-10">
          <h3 className="text-lg font-bold text-[#201A23] mb-2">Questions</h3>
          <ul className="list-disc pl-5">
            {questions.map((question, index) => (
              <li key={index} className="text-[#201A23] mb-2">
                {question.question}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Preview;