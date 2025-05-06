import React, { useState, useEffect } from "react";
import axios from "axios";
import cv from "../../../assets/seeker/cv.png";
import trash from "../../../assets/seeker/trash1.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function EditAppModal({
  isOpen,
  onClose,
  jobTitle = "Mobile Software Engineer",
  companyName = "Blink22",
  applicationId,
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(2);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    country: "",
    city: "",
    resume: null,
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
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
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countryCitiesMap, setCountryCitiesMap] = useState({});

  const phoneRegex = /^[+0-9]+$/;
  const maxPhoneLength = 20;
  const maxFileSize = 2 * 1024 * 1024;

  // Fetch countries and cities on component mount
  useEffect(() => {
    const fetchCountriesAndCities = async () => {
      try {
        const countriesResponse = await axios.get("https://countriesnow.space/api/v0.1/countries");
        if (countriesResponse.data.error) {
          throw new Error(countriesResponse.data.msg);
        }
        const countriesData = countriesResponse.data.data;
        const sortedCountries = countriesData.map(item => item.country).sort();
        setCountries(sortedCountries);

        const map = {};
        countriesData.forEach(item => {
          map[item.country] = item.cities.sort();
        });
        setCountryCitiesMap(map);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setFetchError("Failed to load countries. Please try again later.");
      }
    };

    fetchCountriesAndCities();
  }, []);

  const cities = formData.country ? (countryCitiesMap[formData.country] || []).sort() : [];

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token || !applicationId) {
        setFetchError("Missing token or application ID. Please log in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://laravel.wazafny.online/api/show-application-seeker/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          phoneNumber: data.phone || "",
          email: data.email || "",
          country: data.country || "",
          city: data.city || "",
          resume: data.resume
            ? { name: "Existing Resume", url: data.resume }
            : null,
        });

        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setTotalSteps(3);
          const initialAnswers = {};
          data.questions.forEach((q) => {
            initialAnswers[q.question_id] = q.answer || "";
          });
          setAnswers(initialAnswers);
        } else {
          setQuestions([]);
          setTotalSteps(2);
        }
      } catch (err) {
        console.error("Error fetching application details:", err);
        if (err.response?.status === 401) {
          setFetchError("Unauthorized. Please log in again.");
        } else if (err.response?.status === 404) {
          setFetchError("Application not found.");
        } else if (err.response?.status === 500) {
          setFetchError("Server error. Please try again later.");
        } else {
          setFetchError(
            "Failed to load application details. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchApplicationDetails();
    }
  }, [isOpen, applicationId]);

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
        newErrors.phoneNumber =
          "Phone number can only contain digits and a plus sign.";
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
      questions.forEach((q) => {
        if (!answers[q.question_id] || !answers[q.question_id].trim()) {
          newErrors[q.question_id] = "This question is required.";
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = validateStep();

    if (isValid) {
      if (step < totalSteps) {
        setStep(step + 1);
        setErrors({});
      } else {
        const token = localStorage.getItem("token");
        if (!token || !applicationId) {
          setSubmitError(
            "Missing token or application ID. Please log in again."
          );
          return;
        }

        const formDataToSubmit = new FormData();
        formDataToSubmit.append("first_name", formData.firstName);
        formDataToSubmit.append("last_name", formData.lastName);
        formDataToSubmit.append("email", formData.email);
        formDataToSubmit.append("country", formData.country);
        formDataToSubmit.append("city", formData.city);
        formDataToSubmit.append("phone", formData.phoneNumber);

        if (formData.resume instanceof File) {
          formDataToSubmit.append("resume", formData.resume);
        }

        if (totalSteps === 3 && questions.length > 0) {
          Object.keys(answers).forEach((questionId, index) => {
            formDataToSubmit.append(`answers[${index}]`, answers[questionId]);
          });
        } else {
          for (let i = 0; i < 10; i++) {
            formDataToSubmit.append(`answers[${i}]`, "no");
          }
        }

        setLoading(true);
        setSubmitError(null);

        try {
          const response = await axios.post(
            `https://laravel.wazafny.online/api/update-application/${applicationId}`,
            formDataToSubmit,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          setIsSubmitted(true);
          setTimeout(() => {
            onClose();
          }, 2000);
        } catch (err) {
          console.error("Error updating application:", err);
          console.error("Error response:", err.response?.data);
          if (err.response?.status === 401) {
            setSubmitError("Unauthorized. Please log in again.");
          } else if (err.response?.status === 404) {
            setSubmitError("Application not found.");
          } else if (err.response?.status === 500) {
            setSubmitError("Server error. Please try again later.");
          } else if (err.response?.status === 422) {
            setSubmitError(
              "Validation error: " +
                (err.response?.data?.message || "Invalid data provided.")
            );
          } else if (err.response?.status === 400) {
            console.log(
              "the application is already submitted accept or reject "
            );
          } else {
            setSubmitError(
              "Failed to update application: " +
                (err.response?.data?.message || "Please try again later.")
            );
          }
        } finally {
          setLoading(false);
        }
      }
    } else {
      console.log("Validation failed, API call skipped.");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
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
        setErrors({ ...errors, resume: "File size exceeds 2MB limit." });
        setFormData({ ...formData, resume: null });
      } else if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        setErrors({
          ...errors,
          resume: "Invalid file type. Only PDF, DOC, and DOCX are allowed.",
        });
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

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
    setErrors({ ...errors, [questionId]: "" });
  };

  const renderStepContent = () => {
    const stateWrapperClasses = "flex flex-col items-center justify-center text-center h-full px-6 py-10";
    if (isSubmitted) {
      return (
        <div className={stateWrapperClasses}>
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
          <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
          <p className="text-base text-gray-600 font-medium mb-6 max-w-md">
            Thank you for applying for the {jobTitle} position at {companyName}.
            Your application has been received.
          </p>
          <button
            onClick={onClose}
            className="bg-black hover:bg-gray-800 transition-colors text-white px-7 py-2.5 rounded-full text-lg cursor-pointer"
          >
            Done
          </button>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="text-center p-6">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="text-center text-red-500 p-6">Error: {fetchError}</div>
      );
    }

    if (submitError) {
      return (
        <div className="text-center text-red-500 p-6">Error: {submitError}</div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="px-20 pt-2 pb-3 space-y-5">
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
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-#6A0DAD text-gray-600 box-border"
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
                    onClick={() =>
                      setIsCountryDropdownOpen(!isCountryDropdownOpen)
                    }
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
                  <a
                    href={
                      formData.resume.url ||
                      URL.createObjectURL(formData.resume)
                    }
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-blue-600 underline cursor-pointer flex-grow text-left hover:text-blue-800"
                  >
                    {formData.resume.name}
                  </a>
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
                  <span className="text-sm text-gray-600 block">
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
          <div className="px-20 pt-2 pb-3">
            <h3 className="text-xl font-bold text-center mb-4">
              Additional Questions
            </h3>
            <div className="space-y-4">
              {questions.length > 0 ? (
                questions.map((q) => (
                  <div key={q.question_id}>
                    <label className="block text-base font-medium text-gray-700 mb-1 text-left">
                      {q.question_text}*
                    </label>
                    <input
                      type="text"
                      value={answers[q.question_id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(q.question_id, e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-[9px] focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] text-gray-600 "
                      placeholder="Your answer"
                    />
                    {errors[q.question_id] && (
                      <p className="text-red-500 text-xs mt-1 text-left">
                        {errors[q.question_id]}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  No additional questions available.
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10 overflow-auto ">
      <div className="bg-white mx-auto my-auto p-4 border border-gray-300 w-full max-w-[600px] text-center relative rounded-[10px] box-border">
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

        {renderStepContent()}

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
              disabled={loading}
            >
              {step === totalSteps ? (loading ? "Saving..." : "Save") : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditAppModal;