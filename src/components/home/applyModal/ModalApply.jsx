import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cv from "../../../assets/seeker/cv.png";
import trash from "../../../assets/seeker/trash1.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function ModalApply({
  onClose,
  jobId,
  jobTitle = "Mobile Software Engineer",
  companyName = "Blink22",
  questions = [],
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  // Dynamically calculate total steps based on questions presence
  const totalSteps = questions && questions.length > 0 ? 3 : 2;
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

  // Initialize questionAnswers based on questions prop
  useEffect(() => {
    if (questions && questions.length > 0) {
      const initialAnswers = questions.reduce((acc, q) => {
        acc[q.question_id] = "";
        return acc;
      }, {});
      setFormData((prev) => ({ ...prev, questionAnswers: initialAnswers }));
    }
  }, [questions]);


  const phoneRegex = /^[+0-9]+$/;
  const maxPhoneLength = 20;
  const maxFileSize = 2 * 1024 * 1024; // 2MB

  // Simplified country/city map for example
  const countryCitiesMap = {
    Egypt: ["Cairo", "Alexandria", "Giza", "Luxor", "Aswan"],
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Liverpool", "Bristol"],
    Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    // Add more countries and cities as needed
  };

  const countries = Object.keys(countryCitiesMap).sort(); // Sort countries
  const cities = formData.country ? (countryCitiesMap[formData.country] || []).sort() : []; // Sort cities

  const validateStep = () => {
    let newErrors = { questionAnswers: {} }; // Initialize questionAnswers error object
    let isValid = true;
    const currentStepErrors = {}; // Store errors specific to the current step validation run

    if (step === 1) {
      if (!formData.firstName.trim()) {
        currentStepErrors.firstName = "First name is required.";
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        currentStepErrors.lastName = "Last name is required.";
        isValid = false;
      }
      // Basic phone validation - consider more robust library if needed
       if (!formData.phoneNumber) {
         currentStepErrors.phoneNumber = "Phone number is required.";
         isValid = false;
       } else if (!phoneRegex.test(formData.phoneNumber)) {
        currentStepErrors.phoneNumber = "Invalid characters in phone number.";
        isValid = false;
      } else if (formData.phoneNumber.length > maxPhoneLength) {
        currentStepErrors.phoneNumber = `Phone number cannot exceed ${maxPhoneLength} characters.`;
        isValid = false;
      }
      if (!formData.email.trim()) {
        currentStepErrors.email = "Email is required.";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        currentStepErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
      if (!formData.country) {
        currentStepErrors.country = "Country is required.";
        isValid = false;
      }
      if (!formData.city) {
        currentStepErrors.city = "City is required.";
        isValid = false;
      }
       Object.assign(newErrors, currentStepErrors); // Merge step 1 errors
    } else if (step === 2) {
      if (!formData.resume) {
        currentStepErrors.resume = "Resume is required.";
        isValid = false;
      }
       Object.assign(newErrors, currentStepErrors); // Merge step 2 errors
    } else if (step === 3 && totalSteps === 3) {
      questions.forEach((question) => {
        const answer = formData.questionAnswers[question.question_id] || "";
        if (!answer.trim()) {
          newErrors.questionAnswers[question.question_id] = "This field is required.";
          isValid = false;
        }
      });
       // Keep existing errors from other steps
       setErrors(prevErrors => ({ ...prevErrors, questionAnswers: newErrors.questionAnswers }));
       return isValid; // Return directly as errors are set
    }

     // Update errors state by merging new errors for the current step
     // only clearing errors for the fields validated IN THIS STEP
     setErrors(prevErrors => ({
         ...prevErrors,
         ...currentStepErrors, // Overwrite/add errors for current step fields
         // Clear errors for fields in this step that are now valid
         ...(isValid && step === 1 && { firstName: "", lastName: "", phoneNumber: "", email: "", country: "", city: "" }),
         ...(isValid && step === 2 && { resume: "" }),
         // Question answers are handled separately above or cleared on step change
     }));

    return isValid;
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError("");

    const token = localStorage.getItem("token");
    const seekerid = localStorage.getItem("seeker_id");

    // Basic frontend checks (redundant with backend but good UX)
    if (!token || !seekerid || !jobId || !formData.resume) {
        let missing = [];
        if (!token || !seekerid) missing.push("Authentication details");
        if (!jobId) missing.push("Job ID");
        if (!formData.resume) missing.push("Resume file");

        setSubmissionError(`${missing.join(', ')} missing. Please resolve and try again.`);
        setIsSubmitting(false);
        if (!token || !seekerid) setTimeout(() => navigate("/Login"), 2000);
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

    // Append answers only if there were questions
    if (totalSteps === 3) {
        Object.entries(formData.questionAnswers).forEach(([questionId, answer]) => {
            formDataToSend.append(`answers[${questionId}]`, answer || ""); // Send empty string if null/undefined
        });
    }


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

      
      setIsSubmitted(true); // Move to success screen
    } catch (error) {
      console.error("Error submitting application:", error);
      let errorMsg = "Failed to submit application. Please try again."; // Default
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          errorMsg = "Unauthorized. Please log in again.";
          setTimeout(() => navigate("/Login"), 2000);
        } else if (status === 422) {
           // Try to extract specific validation messages
           const validationErrors = data?.errors ? Object.values(data.errors).flat().join(' ') : null;
           errorMsg = validationErrors || data?.message || "Validation error. Please check your inputs.";
        } else if (status === 500) {
          errorMsg = data?.message || "Server error. Please try again later.";
        } else if (status === 400 && data?.message?.includes("Job is Closed")) {
           errorMsg = "This job is no longer accepting applications.";
        } else if (status === 406 && data?.message?.includes("already applied")) {
           errorMsg = "You have already applied for this job.";
        } else {
           errorMsg = data?.message || `An error occurred (Status: ${status}).`;
        }
      } else if (error.request) {
           errorMsg = "Network error. Could not reach the server. Please check connection.";
      } else {
           errorMsg = `An unexpected error occurred: ${error.message}`;
      }
       setSubmissionError(errorMsg); // Show error screen
    } finally {
      setIsSubmitting(false); // Ensure spinner stops
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
         // Clear only question errors when moving away from step 3
         if (step === 3) setErrors(prev => ({ ...prev, questionAnswers: {} }));
      } else {
        // Final step validation should already be done, proceed to submit
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
       // Clear errors for the step we are going back *to* if needed,
       // or just let validation run again on next attempt.
       // Clearing question errors when leaving step 3 towards step 2
       if (step === 3) setErrors(prev => ({ ...prev, questionAnswers: {} }));
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("question_")) {
      const questionId = name.replace("question_", "");
      setFormData((prev) => ({
        ...prev,
        questionAnswers: {
          ...prev.questionAnswers,
          [questionId]: value,
        },
      }));
      // Clear error for this specific question on change
      setErrors((prev) => ({
        ...prev,
        questionAnswers: {
          ...prev.questionAnswers,
          [questionId]: "", // Clear error for the changed question
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
      // Clear error for this specific field on change
      if (errors[name]) {
          setErrors({ ...errors, [name]: "" });
      }
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > maxFileSize) {
        setErrors({ ...errors, resume: `File size exceeds ${maxFileSize / 1024 / 1024}MB limit.` });
        setFormData({ ...formData, resume: null });
        e.target.value = null; // Clear the file input
      } else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
         setErrors({ ...errors, resume: "Invalid file type. Only PDF, DOC, DOCX allowed." });
         setFormData({ ...formData, resume: null });
         e.target.value = null; // Clear the file input
      } else {
        setFormData({ ...formData, resume: file });
        setErrors({ ...errors, resume: "" }); // Clear resume error
      }
    }
  };

   const handlePhoneChange = (phone) => {
     setFormData({ ...formData, phoneNumber: phone });
     // Clear phone error on change, validation runs on Next/Submit
     if (errors.phoneNumber) {
         setErrors({ ...errors, phoneNumber: "" });
     }
   };

   const handleCountrySelect = (country) => {
     setFormData({ ...formData, country, city: "" }); // Reset city when country changes
     // Clear country/city errors
     setErrors({ ...errors, country: "", city: "" });
     setIsCountryDropdownOpen(false);
   };

   const handleCitySelect = (city) => {
     setFormData({ ...formData, city });
     setErrors({ ...errors, city: "" }); // Clear city error
     setIsCityDropdownOpen(false);
   };

   const handleDeleteResume = () => {
     setFormData({ ...formData, resume: null });
     // Optionally clear the file input visually if storing a ref, but not strictly needed
   };

  const renderStepContent = () => {
      // Use a wrapper div that handles centering for these states
      const stateWrapperClasses = "flex flex-col items-center justify-center text-center h-full px-6 py-10";

    if (isSubmitted) {
      return (
        <div className={stateWrapperClasses}>
          <div className="w-16 h-16 bg-[#6A0DAD] rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
          <p className="text-base text-gray-600 font-medium mb-6 max-w-md">
            Thank you for applying for the {jobTitle} position at {companyName}. Your application has been received.
          </p>
          <button onClick={onClose} className="bg-black hover:bg-gray-800 transition-colors text-white px-7 py-2.5 rounded-full text-lg cursor-pointer">
            Done
          </button>
        </div>
      );
    }

    if (isSubmitting) {
      return (
        <div className={stateWrapperClasses}>
          <div className="w-12 h-12 border-4 border-[#6A0DAD] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600 font-semibold">Submitting application...</p>
        </div>
      );
    }

    if (submissionError) {
      return (
        <div className={stateWrapperClasses}>
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h3 className="text-xl font-bold text-center mb-2">Submission Failed</h3>
          <p className="text-base text-red-600 font-medium text-center mb-6 max-w-md">
            {submissionError}
          </p>
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 transition-colors text-white px-7 py-2.5 rounded-full text-lg cursor-pointer">
             Close
          </button>
        </div>
      );
    }


    // --- Step Content ---
    // Use consistent padding wrapper for steps
    const stepPaddingClasses = "px-6 md:px-8 lg:px-10";

    switch (step) {
      case 1:
        return (
          <div className={`${stepPaddingClasses} py-4 space-y-4`}>
            <h3 className="text-xl font-bold text-center mb-4">
              Contact Information
            </h3>
            {/* Input fields with adjusted spacing */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">First Name*</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] text-gray-700 box-border text-sm" placeholder="Enter first name"/>
              {errors.firstName && <p className="text-red-500 text-xs mt-1 text-left">{errors.firstName}</p>}
            </div>
             <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">Last Name*</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] text-gray-700 box-border text-sm" placeholder="Enter last name"/>
              {errors.lastName && <p className="text-red-500 text-xs mt-1 text-left">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">Phone Number*</label>
              {/* PhoneInput styling might need minor tweaks if library overrides heavily */}
              <PhoneInput
                country={"eg"} // Default country
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                inputClass="!border-gray-300 !rounded-md !text-sm !text-gray-700" // Use !important sparingly if needed
                inputStyle={{ width: "100%", height: "42px" }} // Ensure height matches other inputs
                buttonClass="!border-gray-300 !rounded-l-md !bg-gray-50"
                dropdownClass="!text-sm"
                searchClass="!text-sm"
              />
               {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 text-left">{errors.phoneNumber}</p>}
            </div>
             <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">Email address*</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] text-gray-700 box-border text-sm" placeholder="your.email@example.com"/>
               {errors.email && <p className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>}
            </div>

             {/* Country Dropdown */}
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">Country*</label>
                <div className="relative">
                    <button type="button" onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} className="w-full text-left p-2.5 border border-gray-300 rounded-md bg-white text-gray-700 text-sm flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]">
                        {formData.country || <span className="text-gray-400">Select Country</span>}
                         <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    {isCountryDropdownOpen && (
                         <ul className="absolute top-full left-0 right-0 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-20 mt-1 p-1 list-none">
                            {countries.map((country) => (
                                <li key={country} onClick={() => handleCountrySelect(country)} className="p-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-700 rounded">
                                    {country}
                                </li>
                             ))}
                         </ul>
                     )}
                 </div>
                 {errors.country && <p className="text-red-500 text-xs mt-1 text-left">{errors.country}</p>}
             </div>

             {/* City Dropdown */}
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">City*</label>
                <div className="relative">
                    <button type="button" onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)} className="w-full text-left p-2.5 border border-gray-300 rounded-md bg-white text-gray-700 text-sm flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]" disabled={!formData.country}>
                         {formData.city || <span className="text-gray-400">Select City</span>}
                         <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                     {isCityDropdownOpen && formData.country && (
                         <ul className="absolute top-full left-0 right-0 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-20 mt-1 p-1 list-none">
                             {cities.length > 0 ? cities.map((city) => (
                                <li key={city} onClick={() => handleCitySelect(city)} className="p-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-700 rounded">
                                    {city}
                                 </li>
                             )) : <li className="p-2 text-sm text-gray-500">No cities listed for this country</li>}
                         </ul>
                     )}
                 </div>
                 {errors.city && <p className="text-red-500 text-xs mt-1 text-left">{errors.city}</p>}
             </div>
           </div>
        );
      case 2:
        return (
          <div className={`${stepPaddingClasses} py-6 space-y-4`}>
            <h3 className="text-lg font-bold text-left mb-1">Resume*</h3>
            <p className="text-sm text-gray-600 mb-3 text-left">
              Upload your updated resume (PDF, DOC, DOCX, max 2MB).
            </p>
             {/* Adjusted resume upload box */}
             <div className={`border-2 ${errors.resume ? 'border-red-500' : 'border-dashed border-gray-400'} rounded-lg p-6 text-center min-h-[160px] flex flex-col items-center justify-center transition-colors duration-200 hover:border-[#6A0DAD]`}>
               {formData.resume ? (
                 <div className="flex items-center justify-between w-full bg-gray-50 rounded-md p-3 border border-gray-200">
                   <img src={cv} alt="CV Icon" className="w-8 h-8 mr-3 flex-shrink-0" />
                   <span className="text-sm font-medium text-gray-800 flex-grow text-left truncate mr-3" title={formData.resume.name}>
                     {formData.resume.name}
                   </span>
                   <button type="button" onClick={handleDeleteResume} className="text-gray-500 hover:text-red-600 flex-shrink-0" title="Remove resume">
                      <img src={trash} alt="Delete Icon" className="w-5 h-5"/>
                   </button>
                 </div>
               ) : (
                 <label className="cursor-pointer flex flex-col items-center text-gray-600 hover:text-[#6A0DAD]">
                   <img src={cv} alt="CV Icon" className="w-12 h-12 mb-2 text-[#6A0DAD]" /> {/* Use SVG icon if possible */}
                   <span className="text-black text-base font-semibold block">
                     Click to upload Resume
                   </span>
                   <span className="text-xs text-gray-500 block mt-1">
                     PDF, DOC, DOCX (max 2MB)
                   </span>
                   <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden"/>
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
      case 3: // Only shown if totalSteps is 3
        return (
           <div className={`${stepPaddingClasses} py-4 space-y-4`}>
            <h3 className="text-xl font-bold text-center mb-4">
              Additional Questions
            </h3>
            {questions.map((question) => (
              <div key={question.question_id}>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                   {question.question}{question.required ? '*' : ''}
                </label>
                 {/* Consider using textarea for potentially longer answers */}
                 <input
                  type="text"
                  name={`question_${question.question_id}`}
                  value={formData.questionAnswers[question.question_id] || ""}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] text-gray-700 box-border text-sm"
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
        );
      default:
        return null;
    }
  };


  return (
     // Backdrop - click outside closes only if not submitting/submitted/error
     <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={!isSubmitting && !isSubmitted && !submissionError ? onClose : undefined}
     >
      {/* Modal container - Adjust width, remove fixed height, add max-height */}
      <div
         className="bg-white mx-auto p-0 border border-gray-200 w-full max-w-lg rounded-lg flex flex-col max-h-[90vh] shadow-xl overflow-hidden"
         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
       >
        {/* Header Area - Progress Bar and Close Button */}
         {!isSubmitted && !isSubmitting && !submissionError && (
          <div className="relative px-6 pt-4 pb-3 border-b border-gray-200">
             <button
                 onClick={onClose}
                 className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                 aria-label="Close application modal"
              >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
             </button>
             {/* Progress Bar */}
             <div className="w-[70%] bg-gray-200 mx-auto mt-1 rounded-full h-2.5">
               <div
                 className="h-2.5 bg-[#6A0DAD] rounded-full transition-width duration-300 ease-out"
                 style={{ width: `${(step / totalSteps) * 100}%` }}
               />
             </div>
             {/* Step Counter */}
             <div className="text-center text-sm font-medium mt-2 text-gray-500">
                Step {step} of {totalSteps}
             </div>
           </div>
        )}

        {/* Content Area - Scrolls if content exceeds available height */}
         <div className="flex-1 overflow-y-auto">
           {renderStepContent()}
         </div>

        {/* Footer Area - Back/Next Buttons */}
        {!isSubmitted && !isSubmitting && !submissionError && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="bg-white text-[#6A0DAD] border border-[#6A0DAD] hover:bg-purple-50 transition-colors font-bold px-6 py-2 rounded-full text-base cursor-pointer"
              >
                Back
              </button>
            ) : (
                // Placeholder to keep Next button on the right
                <div />
            )}
            <button
               onClick={handleNext}
               className="bg-[#6A0DAD] hover:bg-purple-700 transition-colors text-white font-bold px-6 py-2 rounded-full text-base cursor-pointer"
            >
               {step === totalSteps ? "Submit Application" : "Next"}
             </button>
           </div>
        )}
      </div>
    </div>
  );
}

export default ModalApply;