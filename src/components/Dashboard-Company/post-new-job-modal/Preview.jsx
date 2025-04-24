import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Vod from "../../../assets/seeker/vod.png";
import axios from "axios";

function Preview() {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [existingSections, setExistingSections] = useState([]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Load basicInfo, prioritizing location.state over localStorage
  const basicInfo = location.state?.formData ||
    JSON.parse(localStorage.getItem("basicInfoFormData")) || {
      companyName: localStorage.getItem("company_name"),
      companyLogo: localStorage.getItem("Profile_img"),
      jobTitle: "Mobile Software Engineer",
      about:
        "We're seeking an experienced Mobile Software Engineer with a passion for development and a team-oriented attitude, ready to bring powerful software to life.\n\nAs a Mobile Engineer at Blink22, your role will involve collaborating with various departments within the company to ensure the successful creation and implementation of innovative and streamlined mobile experiences. Additionally, you will actively contribute to enhancing our internal workflows for fostering a culture of continuous improvement and transparency. This position also offers ample opportunities for personal and professional growth as a Mobile Engineer.",
      country: "Egypt",
      cityState: "Cairo",
      jobType: "Remote",
      employmentType: "Full-time",
      postedDate: "4 days ago",
    };

  // Load skills, prioritizing location.state over localStorage
  const skills = location.state?.skills ||
    JSON.parse(localStorage.getItem("skillsData")) || [
      "Dart",
      "Kotlin",
      "Java",
      "Firebase",
    ];

  // Load sections, prioritizing location.state over localStorage
  const sections =
    location.state?.sections ||
    JSON.parse(localStorage.getItem("extraSectionsData")) ||
    [];

  // Load questions, normalizing to strings
  const rawQuestions =
    location.state?.questions ||
    JSON.parse(localStorage.getItem("questionsData")) ||
    [];
  const questions = Array.isArray(rawQuestions)
    ? rawQuestions
        .map((q) => {
          if (typeof q === "object" && q !== null) {
            return q.question || (typeof q === "string" ? q : null);
          }
          return typeof q === "string" ? q : null;
        })
        .filter((q) => q && typeof q === "string" && q.trim() !== "") // Ensure only non-empty strings
    : [];

  const isEdit = location.state?.isEdit || false;
  const jobId = location.state?.jobId;

  // Fetch existing job post data to get question IDs and section IDs
  useEffect(() => {
    const fetchJobPostDetails = async () => {
      if (isEdit && jobId) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `https://wazafny.online/api/show-job-post/${jobId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const jobData = response.data;
          // Extract existing questions with their IDs
          const fetchedQuestions = jobData.questions
            ? jobData.questions.map((q) => ({
                question_id: q.id,
                question: q.question,
              }))
            : [];
          setExistingQuestions(fetchedQuestions);

          // Extract existing sections with their IDs
          const fetchedSections = jobData.sections
            ? jobData.sections.map((s) => ({
                section_id: s.id,
                title: s.name,
                description: s.description,
              }))
            : [];
          setExistingSections(fetchedSections);
        } catch (error) {
          if(error.status === 500){
            console.log("internal server error")
          } else if(error.status === 401){
            setMessage({text:"Unauthorized. Please log in again." , type:(error)})
            navigate("/LoginCompany");
          }else if(error.status === 404){
            console.log("invalid job post")
          }
          console.error("Failed to fetch job post details:", error);
          setError("Failed to load job post details.");
          setTimeout(() => setError(null), 5000);
        }
      }
    };

    fetchJobPostDetails();
  }, [isEdit, jobId]);

  // Save form data to localStorage when location.state changes
  useEffect(() => {
    if (location.state?.formData) {
      localStorage.setItem(
        "basicInfoFormData",
        JSON.stringify(location.state.formData)
      );
    }
    if (location.state?.skills) {
      localStorage.setItem("skillsData", JSON.stringify(location.state.skills));
    }
    if (location.state?.sections) {
      localStorage.setItem(
        "extraSectionsData",
        JSON.stringify(location.state.sections)
      );
    }
    if (location.state?.questions) {
      localStorage.setItem(
        "questionsData",
        JSON.stringify(location.state.questions)
      );
    }
  }, [location.state]);

  const handleBack = () => {
    const backPath = isEdit
      ? `/Dashboard/Jobpost/${jobId}/questions`
      : "/Dashboard/Jobpost/questions";

    navigate(backPath, {
      state: {
        jobId,
        formData: basicInfo,
        skills,
        sections,
        questions,
        isEdit,
      },
    });
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("basicInfoFormData");
    localStorage.removeItem("skillsData");
    localStorage.removeItem("extraSectionsData");
    localStorage.removeItem("questionsData");
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    if (!token || !companyId) {
      setError("Missing token or company ID. Please log in again.");
      setTimeout(() => navigate("/LoginCompany"), 3000);
      return;
    }

    // Validate required fields
    const requiredFields = {
      job_title: basicInfo.jobTitle,
      job_about: basicInfo.about,
      job_time: basicInfo.employmentType,
      job_type: basicInfo.jobType,
      job_country: basicInfo.country,
      job_city: basicInfo.cityState,
      company_id: companyId,
      skills: skills,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => {
        if (key === "skills")
          return !Array.isArray(value) || value.length === 0;
        if (key === "company_id") return !value;
        return !value;
      })
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setError(
        `Missing required fields: ${missingFields.join(
          ", "
        )}. Please go back and fill them.`
      );
      setTimeout(() => setError(null), 5000);
      return;
    }

    // Construct the payload
    const jobPostData = {
      job_title: basicInfo.jobTitle || "",
      job_about: basicInfo.about || "",
      job_time: basicInfo.employmentType || "",
      job_type: basicInfo.jobType || "",
      job_country: basicInfo.country || "",
      job_city: basicInfo.cityState || "",
      company_id: parseInt(companyId),
      skills: skills,
    };

    // Handle questions for update
    if (questions.length > 0) {
      if (isEdit) {
        const updatedQuestions = questions.map((questionText) => {
          const existingQuestion = existingQuestions.find(
            (eq) => eq.question === questionText
          );
          return {
            question_id: existingQuestion ? existingQuestion.question_id : null,
            question: questionText,
          };
        });
        jobPostData.questions = updatedQuestions;
      } else {
        jobPostData.questions = questions;
      }
    } else {
      jobPostData.questions = [];
    }

    // Handle sections for update
    if (sections.length > 0) {
      if (isEdit) {
        const updatedSections = sections.map((section) => {
          const existingSection = existingSections.find(
            (es) =>
              es.title === section.title &&
              es.description === section.description
          );
          return {
            section_id: existingSection ? existingSection.section_id : null,
            name: section.title,
            description: section.description,
          };
        });
        jobPostData.sections = updatedSections;
      } else {
        jobPostData.sections = sections.map((section) => ({
          name: section.title,
          description: section.description,
        }));
      }
    } else {
      jobPostData.sections = [];
    }

    console.log("Payload being sent:", JSON.stringify(jobPostData, null, 2));

    if (isEdit) {
      // Handle update job post
      if (!jobId) {
        setError("Job ID is missing for update operation.");
        setTimeout(() => setError(null), 5000);
        return;
      }

      try {
        await axios.put(
          `https://wazafny.online/api/update-job-post-info/${jobId}`,
          jobPostData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        );
        console.log("Update payload:", jobPostData);
        clearLocalStorage();
        setMessage({ text: "Job updated successfully", type: "success" });
        setTimeout(() => navigate("/Dashboard/Jobpost"), 3000);
      } catch (error) {
        console.error("Error updating job post:", error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 404) {
            console.log("Invalid company ID or job ID.");
            setTimeout(() => navigate("/LoginCompany"), 3000);
          } else if (status === 422) {
            const validationErrors = data.errors || "Unknown validation error.";
            console.log(`Validation error: ${JSON.stringify(validationErrors)}.`);
          } else if (status === 500) {
            console.log(
              `Server error: ${data.message || "Please try again later."}`
            );
          } else if (status === 400) {
            setError("The job is already closed");
          } else if (status === 401) {
            setError("Unauthorized. Please log in again.");
            setTimeout(() => navigate("/LoginCompany"), 3000);
          } else {
            setError(
              `Failed to update job post: ${data.message || "Please try again."}`
            );
          }
        } else {
          setError("Network error. Please check your connection.");
        }
        setTimeout(() => setError(null), 5000);
      }
    } else {
      // Handle create job post
      try {
        await axios.post(
          "https://wazafny.online/api/create-job-post",
          jobPostData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        );
        console.log("Create payload:", jobPostData);
        clearLocalStorage();
        setMessage({ text: "Job created successfully", type: "success" });
        setTimeout(() => navigate("/Dashboard/Jobpost"), 3000);
      } catch (error) {
        console.error("Error creating job post:", error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 404) {
            console.log("Invalid company ID or job ID.");
            setTimeout(() => navigate("/LoginCompany"), 3000);
          } else if (status === 422) {
            const validationErrors = data.errors || "Unknown validation error.";
            console.log(`Validation error: ${JSON.stringify(validationErrors)}.`);
          } else if (status === 500) {
            console.log(
              `Server error: ${data.message || "Please try again later."}`
            );
          } else if (status === 400) {
            setError("Complete your profile first.");
          } else if (status === 401) {
            setError("Unauthorized. Please log in again.");
            setTimeout(() => navigate("/LoginCompany"), 3000);
          } else {
            setError(
              `Failed to create job post: ${data.message || "Please try again."}`
            );
          }
        } else {
          setError("Network error. Please check your connection.");
        }
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const handleCancel = () => {
    clearLocalStorage();
    navigate("/Dashboard/Jobpost");
  };

  const handleImageError = (event) => {
    event.target.src = "../../assets/default-logo.png";
    event.target.alt = "Default Logo";
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 rounded-xl shadow-md">
      {error && <div className="floating-message error">{error}</div>}
      {message.text && (
        <div
          className={`floating-message ${message.type} ${
            !message.text ? "hide" : ""
          }`}
        >
          {message.text}
        </div>
      )}
      <style>
        {`
          @keyframes slideIn {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes slideOut {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-20px); opacity: 0; }
          }

          .floating-message {
            position: fixed;
            top: 20px;
            left: 49%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out forwards;
          }

          .floating-message.success {
            background-color: #4CAF50;
            color: white;
          }

          .floating-message.error {
            background-color: #f44336;
            color: white;
          }

          .floating-message.hide {
            animation: slideOut 0.3s ease-out forwards;
          }
        `}
      </style>
      <div className="flex justify-end space-x-7 mb-6">
        <button
          onClick={handleCancel}
          className="py-2 px-10 border-2 border-[#000000] font-sans rounded-lg text-[#201A23] font-bold hover:bg-gray-200 focus:outline-none"
        >
          Cancel
        </button>
        <div className="flex space-x-4">
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
      </div>

      <div className="mb-6 ml-10">
        <div className="flex items-center mb-2">
          <div className="flex items-center text-black font-bold py-2 rounded-md">
            <img
              src={localStorage.getItem("Profile_img")}
              alt={`${basicInfo.companyName} Logo`}
              className="w-12 h-12 mr-2 rounded-md"
              onError={handleImageError}
            />
            <span>{localStorage.getItem("company_name")}</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[#201A23] mb-2">
          {basicInfo.jobTitle}
        </h2>
        <p className="text-[#201A23]">
          {basicInfo.country}, {basicInfo.cityState}
          {basicInfo.postedDate}
        </p>

        <div className="flex gap-4 mt-3">
          <div>
            <div className="bg-[#EFF0F2] px-4 py-1 rounded-md">
              {basicInfo.jobType}
            </div>
          </div>
          <div>
            <div className="bg-[#EFF0F2] px-4 py-1 rounded-md">
              {basicInfo.employmentType}
            </div>
          </div>
        </div>
      </div>

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

      <div className="mb-6 ml-10">
        <h3 className="text-lg font-bold text-[#201A23] mb-2">About the job</h3>
        <p className="text-[#201A23] whitespace-pre-line">{basicInfo.about}</p>
      </div>

      {sections.length > 0 &&
        sections.map((section, index) => (
          <div key={index} className="mb-6 ml-10">
            <h3 className="text-lg font-bold text-[#201A23] mb-2">
              {section.title}
            </h3>
            <p className="text-[#201A23] whitespace-pre-line">
              {section.description}
            </p>
          </div>
        ))}

      {questions.length > 0 && (
        <div className="mb-6 ml-10">
          <h3 className="text-lg font-bold text-[#201A23] mb-2">Questions</h3>
          <ul className="list-disc pl-5">
            {questions.map((question, index) => (
              <li key={index} className="text-[#201A23] mb-2">
                {question}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Preview;