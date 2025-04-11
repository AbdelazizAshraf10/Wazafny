import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from ".././../../assets/company/option-select.svg";

console.log("Select icon path:", Select);

function BasicInfo() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize formData with data from location.state or localStorage, fallback to empty defaults
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("basicInfoFormData");
    return location.state?.formData || (savedData ? JSON.parse(savedData) : {
      jobTitle: "",
      about: "",
      country: "",
      cityState: "",
      jobType: "",
      employmentType: "",
    });
  });

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("basicInfoFormData", JSON.stringify(formData));
  }, [formData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission (move to the next step)
  const handleNext = () => {
    const { jobTitle, about, country, cityState, jobType, employmentType } = formData;
    if (jobTitle && about && country && cityState && jobType && employmentType) {
      navigate("/Dashboard/Jobpost/skills", { state: { formData } });
    } else {
      alert("Please fill all required fields.");
    }
  };

  // Handle cancel (go back to job posts)
  const handleCancel = () => {
    localStorage.removeItem("basicInfoFormData"); // Optional: Clear data on cancel
    navigate("/Dashboard/Jobpost");
  };

  return (
    <div className="w-full bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-3xl font-sans font-bold text-[#201A23] mb-9 mt-5 text-center">Basic Information</h2>

      {/* Job Title */}
      <div className="mb-6">
        <label className="block text-[#201A23] font-bold mb-2" htmlFor="jobTitle">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="w-full p-3 border border-[#A1A1A1] rounded-lg focus:outline-none"
          placeholder="Enter job title"
        />
        <p className="text-sm text-gray-500 mt-1 text-right">0/200 words</p>
      </div>

      {/* About */}
      <div className="mb-6">
        <label className="block text-[#201A23] font-bold mb-2" htmlFor="about">
          About <span className="text-red-500">*</span>
        </label>
        <textarea
          id="about"
          name="about"
          value={formData.about}
          onChange={handleChange}
          className="w-full p-3 border border-[#A1A1A1] rounded-lg focus:outline-none h-32 resize-none"
          placeholder="Describe the job"
        />
        <p className="text-sm text-gray-500 mt-1 text-right">0/500 words</p>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-[#201A23] font-bold mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-4">
          <div className="w-1/2 relative">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none pr-10 custom-select"
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
            </select>
          </div>
          <div className="w-1/2">
            <input
              type="text"
              name="cityState"
              value={formData.cityState}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="City, State"
            />
          </div>
        </div>
      </div>

      {/* Job Type and Employment Type */}
      <div className="mb-6 flex space-x-4">
        <div className="w-1/2 relative">
          <label className="block text-[#201A23] font-bold mb-2" htmlFor="jobType">
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            id="jobType"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none pr-10 custom-select"
          >
            <option value="">Select Job Type</option>
            <option value="Full-Time">Remote</option>
            <option value="Part-Time">Hybrid</option>
            <option value="Contract">On-site</option>
          </select>
        </div>
        <div className="w-1/2 relative">
          <label className="block text-[#201A23] font-bold mb-2" htmlFor="employmentType">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none pr-10 custom-select"
          >
            <option value="">Select Employment Type</option>
            <option value="On-Site">Full-time</option>
            <option value="Remote">Part-Time</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between space-x-4">
        <button
          onClick={handleCancel}
          className="py-2 px-10 border-2 border-[#000000] rounded-lg text-[#201A23] font-sans font-extrabold hover:bg-gray-200 focus:outline-none"
        >
          Cancel
        </button>
        <button
          onClick={handleNext}
          className="px-10 bg-[#201A23] text-white rounded-lg font-extrabold font-sans hover:bg-gray-800 focus:outline-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BasicInfo;