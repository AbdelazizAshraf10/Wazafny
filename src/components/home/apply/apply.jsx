import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import loc from "../../../assets/seeker/location.png";
import blink from "../../../assets/seeker/blink.png";
import vod from "../../../assets/seeker/vod.png";
import ModalApply from "../applyModal/ModalApply";

function JobDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId } = useParams(); // Get jobId from URL params
  const navigate = useNavigate();

 

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  const seekerId = localStorage.getItem("seeker_id");

  // Fetch job details from API
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setError("Missing job ID. Please select a job.");
        setLoading(false);
        setTimeout(() => navigate("/seeker/JobsPage"), 2000); // Fixed typo: JopsPage -> JobsPage
        return;
      }

      if (!token) {
        setError("Missing authentication token. Please log in again.");
        setLoading(false);
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }
      
      setLoading(true);
      try {
        const response = await axios.get(
          `https://wazafny.online/api/show-job-post/${jobId}/${seekerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

       
        setJobData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          setError("Job not found.");
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          console.error("Error fetching job details:", err);
          setError("Failed to load job details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, token, navigate]);

  // Utility function to chunk array into subarrays of specified size
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  if (loading) {
    return <div className="text-center p-6">Loading job details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">Error: {error}</div>;
  }

  if (!jobData) {
    return <div className="text-center p-6">No job data available.</div>;
  }

  // Map API response to UI structure with fallbacks
  const job = {
    company: jobData.company?.company_name || "Unknown Company",
    logo: jobData.profile_img || (jobData.company?.company_name === "Blink22" ? blink : vod),
    title: jobData.jobpost?.job_title || "Untitled Job",
    location: `${jobData.jobpost?.job_city || "Unknown"}, ${jobData.jobpost?.job_country || "Unknown"}`,
    time: jobData.time_ago || "Unknown",
    employmentType: jobData.jobpost?.job_time || "Unknown",
    JobType: jobData.jobpost?.job_type || "Unknown",
    tags: jobData.skills?.map((skill) => skill.skill) || [],
    description: jobData.jobpost?.job_about || "No description available.",
    sections: jobData.sections || [],
    applystatus: jobData.applystatus || false, // Extract applystatus with fallback to false
  };

  // Split tags into chunks of 8
  const skillChunks = chunkArray(job.tags, 8);

  return (
    <div className="min-h-screen mt-10">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white shadow-sm rounded-[16px] p-9 border border-[#D9D9D9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-10 h-10 rounded-md object-contain"
                onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
              />
              <p className="text-lg font-semibold text-[#201A23]">
                {job.company}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className={`font-semibold px-7 py-2 rounded-[9px] transition-all duration-200 ${
                  job.applystatus
                    ? "bg-gray-400 text-white cursor-not-allowed" // Disabled style for "Applied"
                    : "bg-[#6A0DAD] text-white hover:bg-[#5B2494]" // Active style for "Apply Now"
                }`}
                disabled={job.applystatus} // Disable button if already applied
              >
                {job.applystatus ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-5">
            {job.title}
          </h3>

          <div className="flex items-center text-lg gap-3 mt-3 text-gray-600">
            <div className="flex gap-3">
              <img src={loc} alt="location icon" className="w-4 h-6" />
              <span>{job.location}</span>
            </div>
            <span>{job.time}</span>
          </div>

          <div className="mt-4 flex gap-4">
            <span className="bg-[#EFF0F2] text-[#201A23] text-md font-bold px-4 py-1 rounded-[9px]">
              {job.JobType}
            </span>
            <span className="bg-[#EFF0F2] text-[#201A23] text-md font-bold px-4 py-1 rounded-[9px]">
              {job.employmentType}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-xl font-semibold text-gray-900">Skills</h4>
            <div className="flex flex-col gap-2 mt-2">
              {job.tags.length > 0 ? (
                skillChunks.map((chunk, chunkIndex) => (
                  <div key={chunkIndex} className="flex flex-wrap items-center gap-4">
                    {chunk.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F2E9FF] text-[#201A23] text-md font-bold px-6 py-1 rounded-[9px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ))
              ) : (
                <span className="text-gray-500">No skills listed.</span>
              )}
            </div>
          </div>

          <hr className="border-[#D9D9D9] mt-9 w-[422px] mx-auto" />

          <div className="mt-6">
            <h4 className="text-xl font-bold text-gray-900">About the job</h4>
            <p className="text-base text-[#201A23] whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <div>
            {job.sections.length > 0 &&
              job.sections.map((section, idx) => (
                <div key={idx} className="mt-12">
                  <h4 className="text-xl font-bold text-gray-900">
                    {section.section_name}
                  </h4>
                  <p className="text-base text-[#201A23] mt-1 whitespace-pre-line">
                    {section.section_description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isModalOpen && (
        <ModalApply
          onClose={() => setIsModalOpen(false)}
          jobId={jobId}
          jobTitle={job.title}
          companyName={job.company}
          questions={jobData.questions || []}
        />
      )}
    </div>
  );
}

export default JobDetails;