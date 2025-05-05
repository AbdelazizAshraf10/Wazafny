import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Replace useLocation with useParams
import axios from "axios";
import { motion } from "framer-motion";
import profile from "../../../assets/seeker/profile-banner.png";
import vod from "../../../assets/seeker/vod.png";
import CompanyAbout from "./CompanyAbout";
import CompanyPost from "./CompanyPost";

function CompanyOverview() {
  const [activeTab, setActiveTab] = useState("overview");
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmail, setShowEmail] = useState(false); // State to toggle email visibility
  const { companyId } = useParams(); // Extract companyId from URL parameters
  const navigate = useNavigate();

  // Retrieve seeker_id and token from localStorage
  const seekerId = localStorage.getItem("seeker_id");
  const token = localStorage.getItem("token");



  // Fetch company profile data
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      // Check for missing parameters
      if (!companyId || isNaN(companyId)) {
        console.error("Company ID is undefined or invalid:");
        setError("Missing company ID. Please select a company.");
        setLoading(false);
        setTimeout(() => navigate("/seeker/JopsPage"), 2000); // Redirect to jobs page
        return;
      }

      if (!seekerId || !token) {
        console.error(
          "Seeker ID or token is missing. Seeker ID:",
          
          "Token:",
          
        );
        setError("Missing required parameters. Please log in again.");
        setLoading(false);
        setTimeout(() => navigate("/Login"), 2000); // Redirect to login page
        return;
      }

      setLoading(true);
      try {
        
        const response = await axios.get(
          `https://laravel.wazafny.online/api/show-company-profile/${companyId}/${seekerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        
        setCompanyData(response.data);
      } catch (err) {
        console.error("Error fetching company profile:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          setTimeout(() => navigate("/Login"), 2000); // Redirect to login
        } else if (err.response?.status === 404) {
          setError("Company profile not found.");
        } else if (err.response?.status === 500) {
          setError("Internal server error. Please try again later.");
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to fetch company profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [companyId, seekerId, token, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle follow/unfollow action
  const handleFollowToggle = async () => {
    if (!companyData || !seekerId || !companyId || !token) {
      setError("Missing required parameters. Please try again.");
      return;
    }

    const payload = {
      seeker_id: parseInt(seekerId),
      company_id: parseInt(companyId),
    };

    try {
      if (companyData.followstatus) {
        // Unfollow: Send DELETE request
        await axios.delete("https://laravel.wazafny.online/api/unfollow", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: payload, // DELETE requests can include a body in axios
        });
        
        // Update local state
        setCompanyData((prev) => ({
          ...prev,
          followstatus: false,
          followers_count: prev.followers_count - 1,
        }));
      } else {
        // Follow: Send POST request
        await axios.post("https://laravel.wazafny.online/api/follow", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        // Update local state
        setCompanyData((prev) => ({
          ...prev,
          followstatus: true,
          followers_count: prev.followers_count + 1,
        }));
      }
    } catch (err) {
      console.error("Error toggling follow status:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        setTimeout(() => navigate("/Login"), 2000);
      } else if (err.response?.status === 404) {
        setError("Company not found.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to update follow status"
        );
      }
    }
  };

  // Handle email toggle
  const handleEmailToggle = () => {
    setShowEmail((prev) => !prev);
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1, // Stagger the children within the container
      },
    },
  };

  // Animation variants for the child elements
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

  // Animation variants for tab buttons
  const tabVariants = {
    inactive: { scale: 1, opacity: 0.7 },
    active: { scale: 1.05, opacity: 1, transition: { duration: 0.2 } },
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">Error: {error}</div>;
  }

  if (!companyData) {
    return <div className="text-center p-6">No company data available.</div>;
  }

  // Ensure jobPosts is an array, even if jobposts is undefined or null
  const jobPosts = Array.isArray(companyData.jobposts)
    ? companyData.jobposts
    : [];

  return (
    <div className="px-8 sm:px-10 md:px-20 lg:px-[16%] py-24">
      {/* Company Info Container */}
      <motion.div
        className="bg-white border border-[#D9D9D9] rounded-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Banner Image */}
        <motion.div
          className="w-full h-48 overflow-hidden rounded-t-2xl"
          variants={childVariants}
        >
          <img
            src={companyData.cover_img || profile}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Header Section */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between mx-5 items-start sm:items-center p-2 sm:p-8"
          variants={childVariants}
        >
          {/* Company Logo and Details */}
          <div className="">
            <motion.div variants={childVariants}>
              <img
                src={companyData.profile_img || vod}
                alt="Company Logo"
                className="w-24 h-24 rounded-2xl sm:-mt-20 object-cover"
              />
              <motion.div className="my-4" variants={childVariants}>
                <h4 className="text-2xl sm:text-3xl font-bold">
                  {companyData.company_name}
                </h4>
                <span className="flex items-center font- text-[#201A23] text-sm sm:text-base">
                  <a
                    href={companyData.company_website_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {companyData.headline}
                  </a>
                </span>
                <div className="flex gap-1 mt-3">
                  <span className="items-center font-bold text-purple-700 text-sm sm:text-base">
                    <a
                      href={companyData.company_website_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {companyData.company_website_link}
                    </a>
                  </span>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              className="flex flex-wrap gap-6"
              variants={childVariants}
            >
              <motion.div
                className="flex flex-col items-center"
                variants={childVariants}
              >
                <div
                  className="flex mt-4 items-center cursor-pointer"
                  onClick={handleEmailToggle}
                >
                  {showEmail ? (
                    <span className="text-purple-700 font-bold text-sm sm:text-base">
                      {companyData.company_email}
                    </span>
                  ) : (
                    <>
                      <span className="text-purple-700 font-bold text-sm sm:text-base">
                        Email
                      </span>
                      <span className="text-purple-700 font-bold text-sm sm:text-base ml-1">
                        ↺
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col font-bold text-lg items-center"
                variants={childVariants}
              >
                <p className="sm:text-base">{companyData.followers_count}</p>
                <span className="text-gray-600">Followers</span>
              </motion.div>
              <motion.div
                className="flex flex-col items-center font-bold text-lg"
                variants={childVariants}
              >
                <p className="sm:text-base">{companyData.jobs_count}</p>
                <span className="text-gray-600">Jobs</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Follow and Share Buttons */}
          <motion.div
            className="flex items-center gap-2 mr-4 sm:mt-0"
            variants={childVariants}
          >
            <button
              className={`px-6 py-2 rounded-lg font-semibold text-sm sm:text-base text-white ${
                companyData.followstatus ? "bg-[#A1A1A1]" : "bg-black"
              } `}
              onClick={handleFollowToggle}
            >
              {companyData.followstatus ? "Following" : "Follow"}
            </button>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="relative flex justify-center border-t-2 border-b-2 space-x-16 border-[#D9D9D9]"
          variants={childVariants}
        >
          <motion.button
            className={`text-xl font-bold px-5 py-2 relative ${
              activeTab === "overview" ? "text-purple-700" : "text-gray-700"
            }`}
            onClick={() => handleTabChange("overview")}
            variants={tabVariants}
            animate={activeTab === "overview" ? "active" : "inactive"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Overview
            {activeTab === "overview" && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"
                layoutId="underline"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
          <motion.button
            className={`text-xl font-bold px-10 py-2 relative ${
              activeTab === "posts" ? "text-purple-700" : "text-gray-700"
            }`}
            onClick={() => handleTabChange("posts")}
            variants={tabVariants}
            animate={activeTab === "posts" ? "active" : "inactive"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Posts
            {activeTab === "posts" && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"
                layoutId="underline"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        </motion.div>

        {/* Tab Content */}
        <div className="p-4 sm:p-8">
          {activeTab === "overview" && (
            <CompanyAbout
              about={companyData.about}
              industry={companyData.company_industry}
              companySize={companyData.company_size}
              headquarters={companyData.company_heads}
              founded={companyData.company_founded}
            />
          )}
          {activeTab === "posts" && (
            <CompanyPost
              profileImg={companyData.profile_img}
              jobPosts={jobPosts}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default CompanyOverview;