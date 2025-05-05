import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Message } from "../../CustomMessage/FloatMessage";
import { motion } from "framer-motion";
import { useLoading } from "../../../Contexts/LoadingContext"; // Import the useLoading hook
import search from "../../../assets/seeker/search.png";
import loc from "../../../assets/seeker/location.png";
import blink from "../../../assets/seeker/blink.png";
import vod from "../../../assets/seeker/vod.png";

function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State for pop-up visibility
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading(); // Use the global loading context

  // Retrieve seeker_id and token from localStorage
  const seekerId = localStorage.getItem("seeker_id");
  const token = localStorage.getItem("token");

  // Fetch recommended jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      if (!seekerId) {
        setError("Missing seeker ID. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      startLoading();
      
      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 1000)); // Minimum 1-second delay

      try {
        const response = await axios.post(
          "https://laravel.wazafny.online/api/recommended-jobs-posts",
          { seeker_id: parseInt(seekerId) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        await minLoadingTime; // Ensure loader shows for at least 1 second

        

        if (response.data.nullskills) {
          setPending(
            "To receive tailored job recommendations, please add your professional skills to your profile."
          );
          setShowPopup(true); // Show the pop-up when nullskills is true
        }
        if (response.status === 204) {
          setPending("No jobs available at the moment.");
        }

        if (response.data.jobs && Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
          
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err) {
        await minLoadingTime; // Ensure loader shows even on error
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 500) {
          console.log("Server error. Please try again later.");
        } else if (err.response?.status === 422) {
          console.log("Validation error. Please check your input.");
        } else if (err.response?.status === 404) {
          console.log("Seeker_id not found");
        } else {
          console.error("Error fetching jobs:", err);
          setError("Failed to load jobs. Please try again later.");
        }
      } finally {
        stopLoading();
        
      }
    };

    fetchJobs();
  }, [navigate, seekerId]);

  // Timer to close the pop-up after 12 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setPending(null); // Clear the message after the pop-up closes
      }, 12000); // 12 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [showPopup]);

  // Filter jobs based on search term across multiple fields
  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.company.company_name.toLowerCase().includes(searchLower) ||
      job.job_type.toLowerCase().includes(searchLower) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchLower)) ||
      // Check for "remote" or "onsite" in job_type
      (searchLower.includes("remote") &&
        job.job_type.toLowerCase().includes("remote")) ||
      (searchLower.includes("onsite") &&
        job.job_type.toLowerCase().includes("onsite"))
    );
  });

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.2, // Stagger the cards
        staggerChildren: 0.1, // Stagger the children within each card
      },
    }),
  };

  // Animation variants for the child elements within the card
  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Pop-up Message on the Left Side */}
      {showPopup && (
        <div className="fixed left-4 transform -translate-y-1/2 w-80 bg-[#F2E9FF] border border-gray-300 rounded-xl shadow-lg p-4 z-[1000] animate-slideIn">
          <p className="text-[#201A23] text-sm font-semibold">{pending}</p>
        </div>
      )}

      {/* Floating Message Top Center */}
      <div className="fixed top-4 left-[460px] transform -translate-x-1/2 z-50 w-full px-4">
        <Message
          message={pending && !showPopup ? pending : null} // Show in top center only if pop-up is not active
          duration={8000}
          type="pending"
          onClose={() => setPending(null)}
        />
      </div>
      <div className="fixed top-4 left-[620px] transform -translate-x-1/2 z-50 w-full px-4">
        <Message message={error} type="error" onClose={() => setError(null)} />
      </div>

      {/* Search Bar Section */}
      <div className="w-[30%] mx-auto px-4 py-6">
        <div className="relative">
          <img
            src={search}
            alt="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 p-3 border border-gray-300 rounded-[88px] focus:outline-none focus:ring-2 focus:ring-[#D9D9D9]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="max-w-6xl border-2 rounded-[16px] border-[#D9D9D9] mx-auto px-4 p-12 bg-white">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <div key={job.job_id}>
              <motion.div
                className="p-6 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01] hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/seeker/apply/${job.job_id}`)}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                {/* Top Row: Company Name and Time Ago */}
                <motion.div
                  className="flex items-center justify-between"
                  variants={childVariants}
                >
                  <motion.div
                    className="flex items-center gap-4"
                    variants={childVariants}
                  >
                    <img
                      src={
                        job.company.profile_img ||
                        (job.company.company_name === "Blink22" ? blink : vod)
                      }
                      alt={`${job.company.company_name} logo`}
                      className="w-10 h-10 rounded-md object-contain"
                    />
                    <p className="text-lg font-semibold text-[#201A23]">
                      {job.company.company_name}
                    </p>
                  </motion.div>
                  <motion.div variants={childVariants}>
                    <span className="text-sm text-gray-500">
                      {job.time_ago}
                    </span>
                  </motion.div>
                </motion.div>

                {/* Job Title */}
                <motion.h3
                  className="text-xl font-semibold mt-3 text-gray-900"
                  variants={childVariants}
                >
                  {job.title}
                </motion.h3>

                {/* Job Description */}
                <motion.p
                  className="text-base text-[#201A23] mt-3 line-clamp-2"
                  variants={childVariants}
                >
                  {job.job_about}
                </motion.p>

                {/* Location and Skills */}
                <motion.div
                  className="flex text-lg justify-between mt-4"
                  variants={childVariants}
                >
                  <motion.div
                    className="flex gap-3"
                    variants={childVariants}
                  >
                    <img src={loc} alt="location icon" className="w-4 h-4" />
                    <span>
                      {job.job_city}, {job.job_country} ({job.job_type})
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-2"
                    variants={childVariants}
                  >
                    {job.skills.slice(0, 4).map((skill, idx) => (
                      <motion.span
                        key={idx}
                        className="bg-[#E6D9FF] text-[#201A23] font-semibold text-sm px-3 py-1 rounded-[8.63px]"
                        variants={childVariants}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>

              {index !== filteredJobs.length - 1 && (
                <hr className="border-t border-[#D9D9D9] mx-6 my-4" />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-6">No jobs available.</p>
        )}
      </div>

      {/* Inline Styles for Pop-up Animation */}
      <style>
        {`
          @keyframes slideIn {
            0% {
              transform: translateX(-100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            0% {
              transform: translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateX(-100%);
              opacity: 0;
            }
          }

          .animate-slideIn {
            animation: slideIn 0.5s ease-out forwards;
          }

          .animate-slideOut {
            animation: slideOut 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}

export default JobsPage;