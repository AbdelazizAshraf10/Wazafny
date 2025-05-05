import loc from "../../assets/seeker/location.png";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import motion for animations
import { Navigate } from "react-router-dom";

function JobTilteLink() {
  const { jobId } = useParams(); // Extract jobId from URL
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job details from API
  useEffect(() => {
    const fetchJobDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Missing token. Please log in again.");
        setLoading(false);
        return;
      }

      if (!jobId) {
        setError("Missing job ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://laravel.wazafny.online/api/show-job-post/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setJobData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job details:", err);
        if (err.response?.status === 500) {
          console.log("internal server error");
        } else if (err.response?.status === 401) {
          setError({ text: "Unauthorized. Please log in again.", type: err });
          Navigate("/LoginCompany");
        } else if (err.response?.status === 404) {
          console.log("invalid job post");
        } else {
          setError("Failed to fetch job details. Please try again.");
        }
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Loading state
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  // Fallback data if API response is missing fields
  const job = {
    company: jobData.company?.company_name || "Unknown Company",
    logo: jobData.profile_img || "https://via.placeholder.com/40", // Fallback logo
    title: jobData.jobpost?.job_title || "Untitled Job",
    location: `${jobData.jobpost?.job_country || "Unknown"}, ${jobData.jobpost?.job_city || "Unknown"}`,
    time: jobData.time_ago || "Unknown",
    employmentType: jobData.jobpost?.job_time || "Unknown",
    JobType: jobData.jobpost?.job_type || "Unknown",
    tags: jobData.skills?.map((skill) => skill.skill) || [],
    description: jobData.jobpost?.job_about || "No description available.",
    sections: jobData.sections || [],
  };

  return (
    <div className="min-h-screen mt-10">
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          className="bg-white shadow-sm rounded-[16px] p-9 border border-[#D9D9D9]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.img
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-10 h-10 rounded-md object-contain"
                onError={(e) => (e.target.src = "https://via.placeholder.com/40")} // Fallback on image error
                variants={itemVariants}
              />
              <motion.p className="text-lg font-semibold text-[#201A23]" variants={itemVariants}>
                {job.company}
              </motion.p>
            </div>
            <Link to="/Dashboard/Overview">
              <motion.button
                className="bg-[#F8F8F8] text-[#201A23] border-2 border-[#000000] font-semibold px-10 py-2 rounded-[9px] hover:bg-[#D9D9D9] transition-all duration-200"
                variants={itemVariants}
              >
                Back
              </motion.button>
            </Link>
          </motion.div>

          <motion.h3
            className="text-2xl font-semibold text-gray-900 mt-5"
            variants={itemVariants}
          >
            {job.title}
          </motion.h3>

          <motion.div
            className="flex items-center text-lg gap-3 mt-3 text-gray-600"
            variants={itemVariants}
          >
            <div className="flex gap-3">
              <motion.img src={loc} alt="location icon" className="w-4 h-6" variants={itemVariants} />
              <motion.span variants={itemVariants}>{job.location}</motion.span>
            </div>
            <motion.span variants={itemVariants}>{job.time}</motion.span>
          </motion.div>

          <motion.div className="mt-4 flex gap-4" variants={itemVariants}>
            <span className="bg-[#EFF0F2] text-[#201A23] text-md font-bold px-4 py-1 rounded-[9px]">
              {job.JobType}
            </span>
            <span className="bg-[#EFF0F2] text-[#201A23] text-md font-bold px-4 py-1 rounded-[9px]">
              {job.employmentType}
            </span>
          </motion.div>

          <motion.div className="mt-4" variants={itemVariants}>
            <motion.h4
              className="text-xl font-semibold text-gray-900"
              variants={itemVariants}
            >
              Skills
            </motion.h4>
            <motion.div className="flex flex-wrap gap-4 mt-2" variants={itemVariants}>
              {job.tags.length > 0 ? (
                job.tags.map((tag, idx) => (
                  <motion.span
                    key={idx}
                    className="bg-[#F2E9FF] text-[#201A23] text-md font-bold px-6 py-1 rounded-[9px]"
                    style={{
                      maxWidth: job.tags.length > 10 ? "calc(50% - 0.5rem)" : undefined,
                    }}
                    variants={itemVariants}
                  >
                    {tag}
                  </motion.span>
                ))
              ) : (
                <motion.span className="text-gray-500" variants={itemVariants}>
                  No skills listed.
                </motion.span>
              )}
            </motion.div>
          </motion.div>

          <hr className="border-[#D9D9D9] mt-9 w-[422px] mx-auto" />

          <motion.div className="mt-6" variants={itemVariants}>
            <motion.h4
              className="text-xl font-bold text-gray-900"
              variants={itemVariants}
            >
              About the job
            </motion.h4>
            <motion.p
              className="text-base text-[#201A23] whitespace-pre-line"
              variants={itemVariants}
            >
              {job.description}
            </motion.p>
          </motion.div>

          {job.sections.length > 0 &&
            job.sections.map((section, idx) => (
              <motion.div key={idx} className="mt-6" variants={itemVariants}>
                <motion.h4
                  className="text-xl font-bold text-gray-900"
                  variants={itemVariants}
                >
                  {section.section_name}
                </motion.h4>
                <motion.p
                  className="text-base text-[#201A23] whitespace-pre-line"
                  variants={itemVariants}
                >
                  {section.section_description}
                </motion.p>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </div>
  );
}

export default JobTilteLink;