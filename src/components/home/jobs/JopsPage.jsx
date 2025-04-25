import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Message } from "../../CustomMessage/FloatMessage";
import { motion } from "framer-motion";
import search from "../../../assets/seeker/search.png";
import loc from "../../../assets/seeker/location.png";
import blink from "../../../assets/seeker/blink.png";
import vod from "../../../assets/seeker/vod.png";

function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setpending] = useState(null);
  const navigate = useNavigate();

  // Retrieve seeker_id and token from localStorage
  const seekerId = localStorage.getItem("seeker_id");
  const token = localStorage.getItem("token");

  // Fetch recommended jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      if (!seekerId) {
        setError("Missing seeker ID. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          "https://wazafny.online/api/recommended-jobs-posts",
          { seeker_id: parseInt(seekerId) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.data.nullskills) {
          setpending(`
            To receive tailored job recommendations, please add your professional skills to your profile.
          `);
        }
        if (response.status === 204) {
          setpending("No jobs available at the moment.");
        }

        if (response.data.jobs && Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
          console.log("Jobs:", response.data.jobs);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err) {
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
        setLoading(false);
      }
    };

    fetchJobs();
  }, [navigate, seekerId]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Animation variants for the child elements within the card最低: true;
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
      {/* Floating Message Top Center */}
      <div className="fixed top-4 left-[460px] transform -translate-x-1/2 z-50 w-full px-4">
        <Message
          message={pending}
          duration={8000}
          type="pending"
          onClose={() => setpending(null)}
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
        {loading ? (
          <p className="text-center text-gray-500 p-6">Loading jobs...</p>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <div key={job.job_id}>
              <motion.div
                className="p-6 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01] hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/seeker/apply/${job.job_id}`)} // Updated to include jobId in URL
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
    </div>
  );
}

export default JobsPage;