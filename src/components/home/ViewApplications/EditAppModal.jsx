import React, { useState } from "react";
import cv from "../../../assets/seeker/cv.png";
import trash from "../../../assets/seeker/trash1.svg";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

function EditAppModal({ isOpen, onClose, jobTitle = "Mobile Software Engineer", companyName = "Blink22" }) {
  if (!isOpen) return null;

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
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    country: "",
    city: "",
    resume: "",
    expectedSalary: "",
    graduationYear: "",
    mobileDevExperience: "",
  });

  const phoneRegex = /^[+0-9]+$/; // Regex to allow only + and digits
  const maxPhoneLength = 20; // Maximum length for phone number (including country code)
  const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

  // Static list of countries and their cities
  const countryCitiesMap = {
    Egypt: ["Cairo", "Alexandria", "Giza"],
    "United States": ["New York", "Los Angeles", "Chicago"],
    "United Kingdom": ["London", "Manchester", "Birmingham"],
    Canada: ["Toronto", "Vancouver", "Montreal"],
    Australia: ["Sydney", "Melbourne", "Brisbane"],
  };

  const countries = Object.keys(countryCitiesMap);
  const cities = formData.country ? countryCitiesMap[formData.country] || [] : [];

  const validateStep = () => {
    let newErrors = {};
    let isValid = true;

    if (step === 1) {
      // Step 1 validations (all fields required, including city)
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required.";
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required.";
        isValid = false;
      }
      if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone number can only contain digits and a plus sign.";
        isValid = false;
      } else if (formData.phoneNumber.length > maxPhoneLength) {
        newErrors.phoneNumber = `Phone number cannot exceed ${maxPhoneLength} characters.`;
        isValid = false;
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
      if (!formData.country) {
        newErrors.country = "Country is required.";
        isValid = false;
      }
      if (!formData.city) {
        newErrors.city = "City is required.";
        isValid = false;
      }
    } else if (step === 2) {
      // Step 2 validations (resume required)
      if (!formData.resume) {
        newErrors.resume = "Resume is required.";
        isValid = false;
      }
    } else if (step === 3) {
      // Step 3 validations (all fields required, no additional validation)
      if (!formData.expectedSalary.trim()) {
        newErrors.expectedSalary = "Expected salary is required.";
        isValid = false;
      }
      if (!formData.graduationYear.trim()) {
        newErrors.graduationYear = "Graduation year is required.";
        isValid = false;
      }
      if (!formData.mobileDevExperience.trim()) {
        newErrors.mobileDevExperience = "Mobile development experience is required.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
        setErrors({}); // Clear errors when moving to the next step
      } else {
        console.log("Form submitted:", formData);
        onClose(); // Close the modal on submit
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({}); // Clear errors when going back
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > maxFileSize) {
        setErrors({ ...errors, resume: "File size exceeds 5MB limit." });
        setFormData({ ...formData, resume: null });
      } else {
        setFormData({ ...formData, resume: file });
        setErrors({ ...errors, resume: "" });
      }
    }
  };

  const handlePhoneChange = (phone) => {
    setFormData({ ...formData, phoneNumber: phone });
    if (!phoneRegex.test(phone) && phone !== "") {
      setErrors({ ...errors, phoneNumber: "Phone number can only contain digits and a plus sign." });
    } else if (phone.length > maxPhoneLength) {
      setErrors({ ...errors, phoneNumber: `Phone number cannot exceed ${maxPhoneLength} characters.` });
    } else {
      setErrors({ ...errors, phoneNumber: "" });
    }
  };

  const handleCountrySelect = (country) => {
    setFormData({ ...formData, country, city: "" });
    setErrors({ ...errors, country: "", city: "" });
    setIsCountryDropdownOpen(false);
  };

  const handleCitySelect = (city) => {
    setFormData({ ...formData, city });
    setErrors({ ...errors, city: "" });
    setIsCityDropdownOpen(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="px-24 pt-2 pb-3 space-y-5">
            <h3 className="text-xl font-bold text-center">Add your contact information</h3>
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
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.firstName}</p>
                )}
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
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  Phone Number*
                </label>
                <PhoneInput
                  country={'eg'} // Default to Egypt
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  inputClass="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#6A0DAD] text-gray-600 box-border"
                  buttonClass="border-r border-gray-300"
                  dropdownClass="border border-gray-300 rounded-md shadow-md z-10"
                  inputStyle={{ width: '100%', paddingLeft: '50px' }}
                  buttonStyle={{ padding: '0 5px' }}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.phoneNumber}</p>
                )}
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
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-#6A0DAD text-gray-600 box-border"
                  placeholder="Yourname@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>
                )}
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
                    <ul className="absolute top-full left-0 w-full max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-10 p-1.5 list-none">
                      {countries.map((country, index) => (
                        <li
                          key={index}
                          onClick={() => handleCountrySelect(country)}
                          className="p-2.5 cursor-pointer hover:bg-gray-100 text-gray-600"
                        >
                          {country}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.country}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  City*
                </label>
                <div className="relative w-full border border-gray-300 rounded-md">
                  <button
                    type="button"
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="w-full text-left p-2.5 border-none bg-transparent text-gray-600 cursor-pointer"
                    disabled={!formData.country}
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
                  {isCityDropdownOpen && formData.country && (
                    <ul className="absolute top-full left-0 w-full max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-10 p-1.5 list-none">
                      {cities.map((city, index) => (
                        <li
                          key={index}
                          onClick={() => handleCitySelect(city)}
                          className="p-2.5 cursor-pointer hover:bg-gray-100 text-gray-600"
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.city}</p>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="px-12 py-5">
            <h3 className="text-lg font-bold text-left mb-4">Resume*</h3>
            <p className="text-sm text-gray-600 mb-4 text-left">
              Be sure to upload updated resume (max 5MB)
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
            {errors.resume && (
              <p className="text-red-500 text-xs mt-1 text-left">{errors.resume}</p>
            )}
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
                {errors.expectedSalary && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.expectedSalary}</p>
                )}
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
                {errors.graduationYear && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.graduationYear}</p>
                )}
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
                {errors.mobileDevExperience && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.mobileDevExperience}</p>
                )}
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

        {/* Progress Bar */}
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

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
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
            {step === totalSteps ? "Save" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAppModal;