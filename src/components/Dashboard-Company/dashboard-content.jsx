import { motion } from "framer-motion";
import HeaderCompany from "./HeaderCompany";
import Time from "../../assets/company/time.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Toilet } from "lucide-react";

let role = "seeker";
localStorage.setItem("Role", role);

function DashboardContent() {
  const navigate = useNavigate();

  // State for first API call (statistics)
  const [fetchData, setFetchData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // State for second API call (latest applications)
  const [latestApplication, setlatestApplication] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState(null);

  // State for third API call (latest job posts)
  const [latestJob, setLatestJob] = useState([]);
  const [latestJobLoading, setLatestJobLoading] = useState(true);
  const [latestJobError, setLatestJobError] = useState(null);

  // First API call - Fetch statistics
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("company_id");

      console.log("Token:", token);
      console.log("Company ID:", companyId);

      if (!token || !companyId) {
        setStatsError("Missing token or company ID. Please log in again.");
        setStatsLoading(false);
        navigate("/LoginCompany");
        return;
      }

      try {
        const response = await axios.get(
          `https://wazafny.online/api/show-statics/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setFetchData(response.data);
        console.log("Fetched stats data:", response.data);
        setStatsLoading(false);
      } catch (error) {
        console.error("Stats API Error:", error);
        if (error.response?.status === 401) {
          setStatsError("Unauthorized. Please log in again.");
          navigate("/LoginCompany");
        } else if (error.response?.status === 404) {
          setStatsError("Invalid company ID.");
        } else if (error.response?.status === 500) {
          setStatsError("Server error. Please try again later.");
        } else {
          setStatsError("Failed to fetch statistics. Please try again.");
        }
        setStatsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Second API call - Fetch latest applications
  useEffect(() => {
    const fetchLatestApplications = async () => {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("company_id");

      if (!token || !companyId) {
        setApplicationsError("Missing token or company ID. Please log in again.");
        setApplicationsLoading(false);
        navigate("/LoginCompany");
        return;
      }

      try {
        const response = await axios.get(
          `https://wazafny.online/api/show-lastest-applications-company/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 204) {
          setlatestApplication([]);
        } else {
          const mappedApplications = response.data.applications.map(app => ({
            id: app.application_id,
            applicationName: `${app.seeker.first_name} ${app.seeker.last_name}`,
            jobpost: app.job.job_title,
            Time: app.time_ago,
            profileImg: app.seeker.profile_img,
          }));
          setlatestApplication(mappedApplications);
        }
        console.log("Fetched latest applications:", response.data);
        setApplicationsLoading(false);
      } catch (error) {
        console.error("Applications API Error:", error);
        if (error.response?.status === 401) {
          setApplicationsError("Unauthorized. Please log in again.");
          navigate("/LoginCompany");
        } else if (error.response?.status === 404) {
          setApplicationsError("Invalid company ID for applications.");
        } else if (error.response?.status === 500) {
          setApplicationsError("Server error fetching applications.");
        } else {
          setApplicationsError("Failed to fetch applications. Please try again.");
        }
        setApplicationsLoading(false);
      }
    };

    fetchLatestApplications();
  }, [navigate]);

  // Third API call - Fetch latest job posts
  useEffect(() => {
    const fetchLatestJobs = async () => {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("company_id");

      if (!token || !companyId) {
        setLatestJobError("Missing token or company ID. Please log in again.");
        setLatestJobLoading(false);
        navigate("/LoginCompany");
        return;
      }

      try {
        const response = await axios.get(
          `https://wazafny.online/api/lastest-job-posts/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 204) {
          setLatestJob([]);
        } else {
          // Map the response data to the expected structure
          const mappedJobs = response.data.map(job => ({
            id: job.job_id,
            jobpost: job.job_title,
            location: `${job.job_city} (${job.job_type})`,
            Time: job.time_ago,
          }));
          setLatestJob(mappedJobs);
        }
        console.log("Fetched latest job posts:", response.data);
        setLatestJobLoading(false);
      } catch (error) {
        console.error("Latest Job Posts API Error:", error);
        if (error.response?.status === 401) {
          setLatestJobError("Unauthorized. Please log in again.");
          navigate("/LoginCompany");
        } else if (error.response?.status === 404) {
          setLatestJobError("Invalid company ID for job posts.");
        } else if (error.response?.status === 500) {
          setLatestJobError("Server error fetching job posts.");
        } else {
          setLatestJobError("Failed to fetch job posts. Please try again.");
        }
        setLatestJobLoading(false);
      }
    };

    fetchLatestJobs();
  }, [navigate]);

  // Combine loading states
  if (statsLoading || applicationsLoading || latestJobLoading) {
    return <div>Loading...</div>;
  }

  // Handle errors
  if (statsError || applicationsError || latestJobError) {
    return (
      <div className="text-red-500 text-center">
        {statsError && <p>{statsError}</p>}
        {applicationsError && <p>{applicationsError}</p>}
        {latestJobError && <p>{latestJobError}</p>}
      </div>
    );
  }

  // Fallback if fetchData is null
  const stats = fetchData || {
    active_jobs_count: 0,
    applications_count: 0,
    followers_count: 0,
    jobs_count: 0,
  };

  // Destructure statistics data with fallback
  const { active_jobs_count, applications_count, followers_count, jobs_count } = stats;

  // Animation variants
  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  const applicationVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  const jobPostVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="flex flex-col px-6 py-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div>
        <HeaderCompany />
        <hr className="border-t-2 border-gray-300 my-4" />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Section - Statistics & Latest Applications */}
        <div className="col-span-2 space-y-6">
          {/* Stats Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border grid grid-cols-4 text-left">
            {[
              { label: "Total Job Posted", value: jobs_count },
              { label: "Total Followers", value: followers_count },
              { label: "Total Active Jobs", value: active_jobs_count },
              {
                label: "Total Applications Received",
                value: applications_count,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={statVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-gray-400">{stat.label}</p>
                <span className="text-4xl font-bold">{stat.value}</span>
              </motion.div>
            ))}
          </div>

          {/* Latest Applications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-2xl font-bold text-gray-900">
              Latest Applications Received
            </p>

            {/* Table Header */}
            <div className="flex justify-between font-bold my-4 pb-2">
              <p>Applicant Name</p>
              <p>Job Post Title</p>
              <img src={Time} className="" alt="Time Icon" />
            </div>

            {/* Applications List */}
            {latestApplication.length > 0 ? (
              latestApplication.map((application, index) => (
                <motion.div
                  key={application.id}
                  custom={index}
                  variants={applicationVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex justify-between py-3 ${
                    index !== latestApplication.length - 1 ? "border-b" : ""
                  }`}
                >
                  {/* Profile Picture & Name */}
                  <div
                    onClick={() => navigate("/seeker/profile")}
                    className="flex items-center w-1/3"
                  >
                    <div className="w-10 h-10 flex items-center cursor-pointer justify-center rounded-full bg-gray-200 mr-3">
                      <img
                        src={application.profileImg}
                        alt="Profile"
                        className="w-9 h-9 rounded-full"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/28")} // Fallback image on error
                      />
                    </div>
                    <p className="font-bold cursor-pointer">
                      {application.applicationName}
                    </p>
                  </div>

                  {/* Job Post Title */}
                  <p className="w-1/3 text-[#6A0DAD] ml-5 font-extrabold underline cursor-pointer text-sm">
                    {application.jobpost}
                  </p>

                  {/* Time */}
                  <p className="text-gray-500">{application.Time}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No applications found.</p>
            )}
          </div>
        </div>

        {/* Right Section - Latest Jobs Posted */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-xl text-[#201A23] text-center font-extrabold mb-4">
            Latest jobs posted
          </p>

          {/* Job Posts List */}
          <div className="space-y-4 text-sm text-gray-800">
            {latestJob.length > 0 ? (
              latestJob.map((job, index) => (
                <motion.div
                  key={job.id}
                  custom={index}
                  variants={jobPostVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex justify-between py-3 ${
                    index !== latestJob.length - 1 ? "border-b" : ""
                  }`}
                >
                  {/* Job Details (Left Side) */}
                  <div className="space-y-2">
                    <p className="font-bold text-base">{job.jobpost}</p>
                    <p className="text-gray-500">{job.location}</p>
                  </div>

                  {/* Time (Right Side) */}
                  <p className="text-gray-400 text-xs">{job.Time}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No job posts found.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardContent;