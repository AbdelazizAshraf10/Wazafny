import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cv from "../../../assets/seeker/cv.png";
import trash from "../../../assets/seeker/trash1.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function ModalApply({
  onClose,
  jobId, // Added jobId prop
  jobTitle = "Mobile Software Engineer",
  companyName = "Blink22",
  questions = [],
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = questions.length === 0 ? 2 : 3;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    country: "",
    city: "",
    resume: null,
    questionAnswers: {},
  });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    country: "",
    city: "",
    resume: "",
    questionAnswers: {},
  });

  const phoneRegex = /^[+0-9]+$/;
  const maxPhoneLength = 20;
  const maxFileSize = 2 * 1024 * 1024;

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
      if (!formData.resume) {
        newErrors.resume = "Resume is required.";
        isValid = false;
      }
    } else if (step === 3 && totalSteps === 3) {
      newErrors.questionAnswers = {};
      questions.forEach((question) => {
        const answer = formData.questionAnswers[question.question_id] || "";
        if (!answer.trim()) {
          newErrors.questionAnswers[question.question_id] = "This field is required.";
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError("");

    const token = localStorage.getItem("token");
    const seekerid = localStorage.getItem("seeker_id");

    if (!token) {
      setSubmissionError("Authentication token missing. Please log in again.");
      setIsSubmitting(false);
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    if (!seekerid) {
      setSubmissionError("User ID missing. Please log in again.");
      setIsSubmitting(false);
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    if (!jobId) {
      setSubmissionError("Job ID missing. Please try applying again.");
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("first_name", formData.firstName);
    formDataToSend.append("last_name", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("phone", formData.phoneNumber);
    formDataToSend.append("seeker_id", seekerid);
    formDataToSend.append("job_id", jobId);
    formDataToSend.append("resume", formData.resume);

    // Add question answers as answers[question_id]
    Object.entries(formData.questionAnswers).forEach(([questionId, answer]) => {
      formDataToSend.append(`answers[${questionId}]`, answer);
    });

    try {
      const response = await axios.post(
        "https://wazafny.online/api/create-application",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Application submitted successfully:", response.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          setSubmissionError("Unauthorized. Please log in again.");
          setTimeout(() => navigate("/Login"), 2000);
        } else if (status === 422) {
          setSubmissionError("Validation error. Please check your inputs and try again.");
          console.log(error.response)
        } else if (status === 500) {
          setSubmissionError("Server error. Please try again later.");
        }else {
          setSubmissionError("Failed to submit application. Please try again.");
        }
      } else {
        setSubmissionError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
        setErrors({ ...errors, questionAnswers: {} });
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({ ...errors, questionAnswers: {} });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("question_")) {
      const questionId = name.replace("question_", "");
      setFormData({
        ...formData,
        questionAnswers: {
          ...formData.questionAnswers,
          [questionId]: value,
        },
      });
      setErrors({
        ...errors,
        questionAnswers: {
          ...errors.questionAnswers,
          [questionId]: "",
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
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
      setErrors({
        ...errors,
        phoneNumber: "Phone number can only contain digits and a plus sign.",
      });
    } else if (phone.length > maxPhoneLength) {
      setErrors({
        ...errors,
        phoneNumber: `Phone number cannot exceed ${maxPhoneLength} characters.`,
      });
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
          <h3 className="text-xl font-bold text-center mb-2">
            Application Submitted Successfully!
          </h3>
          <p className="text-base text-gray-600 font-semibold text-center mb-6">
            Thank you for applying for the {jobTitle} position at {companyName}.{" "}
            <br />
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

    if (isSubmitting) {
      return (
        <div className="px-6 py-16 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#6A0DAD] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600 font-semibold">Submitting your application...</p>
        </div>
      );
    }

    if (submissionError) {
      return (
        <div className="px-6 py-16 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-center mb-2">Submission Failed</h3>
          <p className="text-base text-gray-600 font-semibold text-center mb-6">
            {submissionError}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setSubmissionError("");
                handleSubmit();
              }}
              className="bg-[#6A0DAD] text-white px-7 py-2.5 rounded-[20px] text-lg cursor-pointer"
            >
              Retry
            </button>
            <button
              onClick={onClose}
              className="bg-black text-white px-7 py-2.5 rounded-[20px] text-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="px-24 pt-2 pb-3 space-y-5">
            <h3 className="text-xl font-bold text-center">
              Add your contact information
            </h3>
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
                  <p className="text-red-500 text-xs mt-1 text-left">
                    {errors.firstName}
                  </p>
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
                  <p className="text-red-500 text-xs mt-1 text-left">
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  Phone Number*
                </label>
                <PhoneInput
                  country={"eg"}
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  inputClass="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#6A0DAD] text-gray-600 box-border"
                  buttonClass="border-r border-gray-300"
                  dropdownClass="border border-gray-300 rounded-md shadow-md z-10"
                  inputStyle={{ width: "100%", paddingLeft: "50px" }}
                  buttonStyle={{ padding: "0 5px" }}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1 text-left">
                    {errors.phoneNumber}
                  </p>
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
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#6A0DAD] text-gray-600 box-border"
                  placeholder="Yourname@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 text-left">
                    {errors.email}
                  </p>
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
                  <p className="text-red-500 text-xs mt-1 text-left">
                    {errors.country}
                  </p>
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
                  <p className="text-red-500 text-xs mt-1 text-left">
                    {errors.city}
                  </p>
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
              Be sure to upload updated resume (max 2MB)
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
              <p className="text-red-500 text-xs mt-1 text-left">
                {errors.resume}
              </p>
            )}
          </div>
        );
      case 3:
        return (
          <div className="px-16 pt-2 pb-3 max-w-xl mx-auto space-y-5">
            <h3 className="text-xl font-bold text-center mb-4">
              Additional Questions
            </h3>
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.question_id}>
                  <label className="block text-base font-medium text-gray-700 mb-1 text-left">
                    {question.question}*
                  </label>
                  <input
                    type="text"
                    name={`question_${question.question_id}`}
                    value={formData.questionAnswers[question.question_id] || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-[9px] focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] text-gray-600 box-border"
                    placeholder="Your answer"
                  />
                  {errors.questionAnswers[question.question_id] && (
                    <p className="text-red-500 text-xs mt-1 text-left">
                      {errors.questionAnswers[question.question_id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10 overflow-auto pt-2.5">
      <div className="bg-white mx-auto p-4 border border-gray-300 max-w-[550px] rounded-[10px] flex flex-col h-[550px]">
        <div className="relative">
          {!isSubmitted && !isSubmitting && !submissionError && (
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
          {!isSubmitted && !isSubmitting && !submissionError && (
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
        </div>

        <div
          className={`flex-1 ${
            step === 1 || (step === 3 && questions.length > 3)
              ? "max-h-[400px] overflow-y-auto"
              : ""
          }`}
        >
          {renderStepContent()}
        </div>

        {!isSubmitted && !isSubmitting && !submissionError && (
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