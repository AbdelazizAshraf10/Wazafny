import React, { useState } from "react";
import cv from "../../../assets/seeker/cv.png";
import trash from "../../../assets/seeker/trash1.svg";

function ModalApply({ onClose, jobTitle = "Mobile Software Engineer", companyName = "Blink22" }) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    country: "",
    city: "",
    resume: null,
    expectedSalary: "",
    graduationYear: "",
    mobileDevExperience: "",
  });
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+20");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      console.log("Form submitted:", formData);
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleCountryCodeSelect = (code) => {
    setSelectedCountryCode(code);
    setIsPhoneDropdownOpen(false);
  };

  const renderStepContent = () => {
    if (isSubmitted) {
      return (
        <div className="px-6 py-16 flex space-y-6 flex-col items-center">
          <div className="w-16 h-16 bg-[#6A0DAD] rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-center mb-2">Application Submitted Successfully!</h3>
          <p className="text-base text-gray-600 font-semibold text-center mb-6">
            Thank you for applying for the {jobTitle} position at {companyName}. <br />
            Your application has been received and will be reviewed.
          </p>
          <button
            onClick={onClose}
            className="bg-black text-white px-7 py-2.5 rounded-[20px] text-lg cursor-pointer"
          >
            Done
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="px-24 pt-2 pb-3 space-y-5">
            <h3 className="text-xl font-bold text-center mt-">Add your contact information</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  First Name*
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#6A0DAD] text-gray-600 box-border"
                  placeholder="Yousef"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  Last Name*
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#6A0DAD] text-gray-600 box-border"
                  placeholder="Elsherif"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  Phone Number*
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <div className="relative w-1/4 border-r border-gray-300">
                    <button
                      type="button"
                      onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                      className="flex items-center w-full p-2.5 bg-white border-none cursor-pointer text-gray-600"
                    >
                      <span className="mr-2">🇪🇬 {selectedCountryCode}</span>
                      <svg
                        className="w-4 h-4 text-[#6A0DAD] absolute right-2.5 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isPhoneDropdownOpen && (
                      <ul className="absolute top-full left-0 w-[150px] bg-white border border-gray-300 rounded-md shadow-md z-10 p-1.5 list-none">
                        <li
                          onClick={() => handleCountryCodeSelect("+20")}
                          className="flex items-center p-2.5 cursor-pointer hover:bg-gray-100 text-gray-600"
                        >
                          🇪🇬 +20
                        </li>
                        {/* Add more country codes as needed */}
                      </ul>
                    )}
                  </div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-3/4 p-2.5 border-none rounded-r-md focus:outline-none text-gray-600 box-border"
                    placeholder="1234567890"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  Email address*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#6A0DAD] text-gray-600 box-border"
                  placeholder="Yourname@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  Country*
                </label>
                <div className="relative w-full border border-gray-300 rounded-md">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full text-left p-2.5 border-none bg-transparent text-gray-600 cursor-pointer"
                  >
                    {formData.country || "Select Country"}
                    <svg
                      className="w-4 h-4 text-[#6A0DAD] absolute right-2.5 top-1/2 transform -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isCountryDropdownOpen && (
                    <select
                      value={formData.country}
                      onChange={(e) => {
                        setFormData({ ...formData, country: e.target.value });
                        setIsCountryDropdownOpen(false);
                      }}
                      className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-10 p-1.5 appearance-none text-gray-600"
                    >
                      <option value="">Select Country</option>
                      <option value="Egypt">Egypt</option>
                      {/* Add more countries as needed */}
                    </select>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  City (optional)
                </label>
                <div className="relative w-full border border-gray-300 rounded-md">
                  <button
                    type="button"
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="w-full text-left p-2.5 border-none bg-transparent text-gray-600 cursor-pointer"
                  >
                    {formData.city || "Select City"}
                    <svg
                      className="w-4 h-4 text-[#6A0DAD] absolute right-2.5 top-1/2 transform -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isCityDropdownOpen && (
                    <select
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        setIsCityDropdownOpen(false);
                      }}
                      className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-10 p-1.5 appearance-none text-gray-600"
                    >
                      <option value="">Select City</option>
                      <option value="Cairo">Cairo</option>
                      {/* Add more cities as needed */}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="px-12 py-5">
            <h3 className="text-lg font-bold text-left mb-4">Resume*</h3>
            <p className="text-sm text-gray-600 mb-4 text-left">
              Be sure to upload updated resume
            </p>
            <div className="border-2 border-black rounded-[20px] p-8 text-center h-[185px] w-full mb-0 flex items-center justify-center">
              {formData.resume ? (
                <div className="flex items-center justify-between w-full rounded-[10px] p-4">
                  <img src={cv} alt="CV Icon" className="w-10 h-10 mr-4" />
                  <span className="text-base font-medium text-black flex-grow text-left">
                    {formData.resume.name}
                  </span>
                  <img
                    src={trash}
                    alt="Delete Icon"
                    className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-800"
                    onClick={() => setFormData({ ...formData, resume: null })}
                  />
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <img src={cv} alt="CV Icon" />
                  <span className="text-black text-base font-semibold mt-2 block">
                    Upload Resume
                  </span>
                  <span className="text-sm text-gray-400 block">
                    Accepted file types are PDF, DOC, DOCX
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="px-20 pt-2 pb-3">
            <h3 className="text-xl font-bold text-center mb-4">Additional Questions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1 text-left">
                  Expected Monthly Salary*
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-[9px] focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] text-gray-600 box-border"
                  placeholder="12,000 LE"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1 text-left">
                  Graduation Year*
                </label>
                <input
                  type="text"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-[9px] focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] text-gray-600 box-border"
                  placeholder="2021"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1 text-left">
                  Number of Year Experience in Mobile Development*
                </label>
                <input
                  type="text"
                  name="mobileDevExperience"
                  value={formData.mobileDevExperience}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-[9px] focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] text-gray-600 box-border"
                  placeholder="3"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10 overflow-auto pt-2.5">
      <div className="bg-white mx-auto my-[5%] p-4 border border-gray-300 w-4/5 max-w-[600px] text-center relative rounded-[10px] box-border">
        {/* Close Button */}
        {!isSubmitted && (
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 mr-5 mt-3.5 text-gray-400 hover:text-black text-2xl font-bold cursor-pointer"
          >
            <svg
              className="w-6 h-6"
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
        )}

        {/* Progress Bar */}
        {!isSubmitted && (
          <div className="pt-3">
            <div className="w-[70%] bg-white mx-auto mt-2.5 border-2 border-[#cecdcd] rounded-[15px]">
              <div
                className="h-[15px] bg-[#6A0DAD] rounded-[15px]"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
            <div className="flex text-base font-semibold mt-3 justify-center text-gray-600">
              <span>
                Page {step} of {totalSteps}
              </span>
            </div>
            <hr className="mt-2 border-solid border border-[#D9D9D9]" />
          </div>
        )}

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        {!isSubmitted && (
          <div className="flex justify-between my-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="bg-white text-[#6A0DAD] font-extrabold px-7 py-2.5 rounded-[20px] text-lg cursor-pointer mx-5"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-[#6A0DAD] text-white px-7 py-2.5 rounded-[20px] text-lg cursor-pointer mx-5 ml-auto"
            >
              {step === totalSteps ? "Submit" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalApply;