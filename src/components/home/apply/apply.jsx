import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

// Asset imports (ensure paths are correct)
import loc from "../../../assets/seeker/location.png";
import blink from "../../../assets/seeker/blink.png"; // For Blink22
import vod from "../../../assets/seeker/vod.png";   // For Vodafone (or as a fallback in original)
// It's good practice to have a generic fallback if specific logos aren't matched and profile_img is missing
import defaultCompanyLogoPlaceholder from "../../../assets/company/personnn.svg"; // ADD A GENERIC DEFAULT LOGO

import ModalApply from "../applyModal/ModalApply";

// Animation Variants (kept from previous animation-focused response)
const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const cardContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Variants for elements that might appear individually if desired later, but not used aggressively now
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
  }),
};


const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { delay: 0.2 } },
};

const modalContentVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.3 },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

function JobDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const seekerId = localStorage.getItem("seeker_id");

  useEffect(() => {
    const fetchJobDetails = async () => {
      // --- Your existing validation logic ---
      if (!jobId) {
        setError("Missing job ID. Please select a job.");
        setLoading(false);
        setTimeout(() => navigate("/seeker/JobsPage"), 2000);
        return;
      }
      if (!token) {
        setError("Missing authentication token. Please log in again.");
        setLoading(false);
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }
      if (!seekerId) { // Added check for seekerId as it's used in API URL
        setError("User session error (seekerId missing). Please log in again.");
        setLoading(false);
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }
      // --- End of validation ---
      
      setLoading(true);
      setError(null); // Reset error before new fetch
      try {
        const response = await axios.get(
          `https://laravel.wazafny.online/api/show-job-post/${jobId}/${seekerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setJobData(response.data);
      } catch (err) {
        let errorMsg = "Failed to load job details. Please try again later.";
        if (err.response?.status === 401) {
          errorMsg = "Unauthorized. Please log in again.";
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          errorMsg = "Job not found.";
        } else if (err.response?.status === 500) {
          errorMsg = "Server error. Please try again later.";
        } else {
          console.error("Error fetching job details:", err);
        }
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, token, seekerId, navigate]); // Added seekerId dependency

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };
  
  // Loading and Error states with simple fade animations
  if (loading) {
    return (
        <motion.div 
            className="flex justify-center items-center min-h-[calc(100vh-100px)] text-lg" // Original simple text
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            Loading job details...
        </motion.div>
    );
  }

  if (error) {
    return (
        <motion.div 
            className="text-center text-red-500 p-6"  // Original simple text and class
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            Error: {error}
        </motion.div>
    );
  }

  if (!jobData) {
    return (
        <motion.div 
            className="text-center p-6" // Original simple text
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            No job data available.
        </motion.div>
    );
  }

  // Use a more robust logo selection logic
  const getCompanyLogo = (apiJobData) => {
    if (apiJobData.profile_img) {
      return apiJobData.profile_img;
    }
    // Specific company checks (case-insensitive for robustness)
    const companyNameLower = apiJobData.company?.company_name?.toLowerCase();
    if (companyNameLower === "blink22") {
      return blink;
    }
    if (companyNameLower === "vodafone") { // Assuming 'vod.png' is for Vodafone
      return vod;
    }
    return defaultCompanyLogoPlaceholder; // Fallback to a generic placeholder
  };

  const job = {
    company: jobData.company?.company_name || "Unknown Company",
    logo: getCompanyLogo(jobData), // Use the new logo function
    title: jobData.jobpost?.job_title || "Untitled Job",
    location: `${jobData.jobpost?.job_city || "Unknown"}, ${jobData.jobpost?.job_country || "Unknown"}`,
    time: jobData.time_ago || "Unknown",
    employmentType: jobData.jobpost?.job_time || "Unknown",
    JobType: jobData.jobpost?.job_type || "Unknown",
    tags: Array.isArray(jobData.skills) ? jobData.skills.map((skill) => skill.skill) : [],
    description: jobData.jobpost?.job_about || "No description available.",
    sections: Array.isArray(jobData.sections) ? jobData.sections : [],
    applystatus: jobData.applystatus || false,
    companyId: jobData.jobpost?.company_id || null,
  };

  const skillChunks = chunkArray(job.tags, 8);

  return (
    <motion.div // Overall page animation
      className="min-h-screen mt-10"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.3 }} // Quick page transition
    >
      <div className="max-w-7xl mx-auto p-6">
        <motion.div // Main card animation
          className="bg-white shadow-sm rounded-[16px] p-9 border border-[#D9D9D9]"
          variants={cardContentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Content below will appear with the card, no individual staggers unless specified */}
          <div className="flex items-center justify-between">
            <div onClick={() => job.companyId && navigate(`/seeker/companyOverview/${job.companyId}`)} className={`flex items-center gap-4 ${job.companyId ? 'cursor-pointer' : ''}`}>
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-10 h-10 rounded-md object-contain" // Original classes
                onError={(e) => { e.target.style.display='none'; e.target.onerror = null; /* or set to a very basic placeholder */ const fallback = document.createElement('div'); fallback.className = 'w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500'; fallback.textContent = 'N/A'; e.target.parentNode.replaceChild(fallback, e.target);}}
              />
              <p className="text-lg font-semibold text-[#201A23]"> {/* Original classes */}
                {job.company}
              </p>
            </div>
            <div className="flex gap-4">
              <motion.button // Apply button can have a subtle individual animation or hover effect
                onClick={() => setIsModalOpen(true)}
                className={`font-semibold px-7 py-2 rounded-[9px] transition-all duration-200 ${ // Original classes
                  job.applystatus
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#6A0DAD] text-white hover:bg-[#5B2494]"
                }`}
                disabled={job.applystatus}
                whileHover={{ scale: job.applystatus ? 1 : 1.05 }} // Subtle hover
                whileTap={{ scale: job.applystatus ? 1 : 0.98 }}   // Subtle tap
              >
                {job.applystatus ? "Applied" : "Apply Now"}
              </motion.button>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-5"> {/* Original classes */}
            {job.title}
          </h3>

          <div className="flex items-center text-lg gap-3 mt-3 text-gray-600"> {/* Original classes */}
            <div className="flex gap-3">
              <img src={loc} alt="location icon" className="w-4 h-6" /> {/* Original classes */}
              <span>{job.location}</span>
            </div>
            <span>{job.time}</span>
          </div>

          <div className="mt-4 flex gap-4"> {/* Original classes */}
            <span className="bg-[#EFF0F2] text-[#201A23] text-md font-bold px-4 py-1 rounded-[9px]"> {/* Original classes */}
              {job.JobType}
            </span>
            <span className="bg-[#EFF0F2] text-[#201A23] text-md font-bold px-4 py-1 rounded-[9px]"> {/* Original classes */}
              {job.employmentType}
            </span>
          </div>

          <div className="mt-4"> {/* Original classes */}
            <h4 className="text-xl font-semibold text-gray-900">Skills</h4> {/* Original classes */}
            <div className="flex flex-col gap-2 mt-2"> {/* Original classes */}
              {job.tags.length > 0 ? (
                skillChunks.map((chunk, chunkIndex) => (
                  <div key={chunkIndex} className="flex flex-wrap items-center gap-4"> {/* Original classes */}
                    {chunk.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F2E9FF] text-[#201A23] text-md font-bold px-6 py-1 rounded-[9px]" /* Original classes */
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ))
              ) : (
                <span className="text-gray-500">No skills listed.</span> /* Original classes */
              )}
            </div>
          </div>

          <hr className="border-[#D9D9D9] mt-9 w-[422px] mx-auto" /> {/* Original classes */}

          <div className="mt-6"> {/* Original classes */}
            <h4 className="text-xl font-bold text-gray-900">About the job</h4> {/* Original classes */}
            <p className="text-base text-[#201A23] whitespace-pre-line"> {/* Original classes */}
              {job.description}
            </p>
          </div>

          <div> {/* Original classes */}
            {job.sections.length > 0 &&
              job.sections.map((section, idx) => (
                <div key={idx} className="mt-12"> {/* Original classes */}
                  <h4 className="text-xl font-bold text-gray-900"> {/* Original classes */}
                    {section.section_name}
                  </h4>
                  <p className="text-base text-[#201A23] mt-1 whitespace-pre-line"> {/* Original classes */}
                    {section.section_description}
                  </p>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Apply Modal with Animation */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div // Backdrop
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Clickable overlay to close modal */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)}
            ></div>
            <motion.div // Modal content
              variants={modalContentVariants}
              className="relative z-10" // Ensure modal content is above backdrop
              onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on content
            >
              <ModalApply
                onClose={() => setIsModalOpen(false)}
                jobId={jobId}
                jobTitle={job.title}
                companyName={job.company}
                questions={jobData.questions || []}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default JobDetails;