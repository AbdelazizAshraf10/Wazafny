import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import person from "../../../assets/company/personnn.svg";
import Edu from "../../../assets/company/education.svg";
import Exp from "../../../assets/company/Experince.svg";

function SeekerProfile() {
  const { seekerId } = useParams(); // Get seeker_id from URL
  const [seekerData, setSeekerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch seeker profile data
  useEffect(() => {
    const fetchSeekerData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://laravel.wazafny.online/api/show-seeker-profile/${seekerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Map API data to seekerData structure
        const apiData = response.data;
        const mappedData = {
          name: `${apiData.personal_info.first_name} ${apiData.personal_info.last_name}`,
          following: apiData.personal_info.followings || 0,
          title: apiData.personal_info.headline || "",
          location: `${apiData.personal_info.city}, ${apiData.personal_info.country}`,
          profilePictureUrl: apiData.personal_info.profile_img || null,
          bannerUrl: apiData.personal_info.cover_img || null, // Use cover_img for banner
          about: apiData.personal_info.about || "",
          resumeUrl: apiData.personal_info.resume || null,
          experience: apiData.experiences.map((exp) => ({
            id: exp.experience_id,
            jobTitle: exp.job_title,
            company: exp.company,
            duration: `${exp.start_date} - ${exp.end_date}`,
            description: "", // API doesn't provide description, leaving empty
          })),
          skills: apiData.skills.map((skill) => skill.skill),
          education: apiData.education
            ? [
                {
                  id: apiData.education.education_id,
                  degree: apiData.education.college,
                  institution: apiData.education.university,
                  duration: `${apiData.education.start_date} - ${apiData.education.end_date}`,
                  details: "", // API doesn't provide details, leaving empty
                },
              ]
            : [],
        };

        setSeekerData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else if (err.response?.status === 404) {
          setError("Seeker profile not found.");
        } else {
          setError("Failed to fetch seeker profile. Please try again.");
        }
        setLoading(false);
      }
    };

    fetchSeekerData();
  }, [seekerId]);

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

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      backgroundColor: "#E6D9FF",
      transition: {
        duration: 0.2,
      },
    },
  };

  // Helper component for profile sections
  const ProfileSection = ({ title, children }) => (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
      variants={itemVariants}
      whileHover={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="text-gray-600">{children}</div>
    </motion.div>
  );

  // Handle loading and error states
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!seekerData) {
    return <div className="text-center p-8">No profile data available.</div>;
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* --- Header Card --- */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 shadow-lg"
        variants={itemVariants}
      >
        {/* Banner */}
        {seekerData.bannerUrl ? (
          <motion.img
            src={seekerData.bannerUrl}
            alt="Profile banner"
            className="w-full h-60 object-cover"
            onError={(e) => {
              console.log(
                "Banner image failed to load, using fallback background"
              );
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
            variants={itemVariants}
          />
        ) : null}
        <motion.div
          className={`w-full h-60 bg-gradient-to-r from-gray-200 to-gray-300 ${
            seekerData.bannerUrl ? "hidden" : "block"
          }`}
          variants={itemVariants}
        ></motion.div>

        {/* Profile Picture and Basic Info Container */}
        <div className="px-6 pb-8 relative">
          {/* Profile Picture Wrapper */}
          <motion.div
            className="absolute left-6 -mt-16"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 shadow-lg flex items-center justify-center overflow-hidden">
              {seekerData.profilePictureUrl ? (
                <img
                  src={seekerData.profilePictureUrl}
                  alt={`${seekerData.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={person}
                  alt="Default profile"
                  className="h-24 w-24 text-gray-400"
                />
              )}
            </div>
          </motion.div>

          {/* Text Info */}
          <motion.div
            className="text-left ml-40 mt-4 pt-4"
            variants={itemVariants}
          >
            <h1 className="text-3xl font-bold text-gray-900">
              {seekerData.name}
            </h1>
            {seekerData.following ? (
              <motion.span
                className="block text-sm font-medium text-gray-500 mt-1"
                variants={itemVariants}
              >
                {seekerData.following} Following
              </motion.span>
            ) : null}
            <motion.p
              className="text-lg text-[#6A0DAD] font-medium mt-2"
              variants={itemVariants}
            >
              {seekerData.title}
            </motion.p>
            <motion.p
              className="text-md text-gray-500 mt-1"
              variants={itemVariants}
            >
              {seekerData.location}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* --- About Section --- */}
      {seekerData.about && (
        <ProfileSection title="About">
          <motion.p
            className="text-base text-justify leading-relaxed text-gray-700"
            variants={itemVariants}
          >
            {seekerData.about}
          </motion.p>
        </ProfileSection>
      )}

      {/* --- Resume Section --- */}
      {seekerData.resumeUrl && (
        <ProfileSection title="Resume">
          <motion.p className="mb-4 text-gray-700" variants={itemVariants}>
            View or download the candidate's resume.
          </motion.p>
          <motion.a
            href={seekerData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#201A23] hover:bg-[#242645] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Resume
          </motion.a>
        </ProfileSection>
      )}

      {/* --- Experience Section --- */}
      {seekerData.experience && seekerData.experience.length > 0 && (
        <ProfileSection title="Experience">
          <ul className="space-y-6 divide-y divide-gray-200">
            {seekerData.experience.map((exp) => (
              <motion.li
                key={exp.id}
                className="pt-6 first:pt-0 flex items-start gap-4"
                variants={itemVariants}
              >
                <motion.img
                  src={Exp}
                  alt="Experience icon"
                  className="w-12 h-12 flex-shrink-0"
                  variants={itemVariants}
                />
                <div>
                  <motion.h3
                    className="font-semibold text-lg text-gray-800"
                    variants={itemVariants}
                  >
                    {exp.jobTitle}
                  </motion.h3>
                  <motion.p
                    className="text-[#201A23] font-medium"
                    variants={itemVariants}
                  >
                    {exp.company}
                  </motion.p>
                  <motion.p
                    className="text-sm text-gray-500 mb-2"
                    variants={itemVariants}
                  >
                    {exp.duration}
                  </motion.p>
                  {exp.description && (
                    <motion.p
                      className="text-base text-gray-600 whitespace-pre-line leading-relaxed"
                      variants={itemVariants}
                    >
                      {exp.description}
                    </motion.p>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </ProfileSection>
      )}

      {/* --- Skills Section --- */}
      {seekerData.skills && seekerData.skills.length > 0 && (
        <ProfileSection title="Skills">
          <motion.div className="flex flex-wrap gap-3" variants={itemVariants}>
            {seekerData.skills.map((skill, index) => (
              <motion.span
                key={index}
                className="inline-block bg-[#F2E9FF] text-[#201A23] rounded-md px-4 py-1 text-sm font-semibold"
                variants={skillVariants}
                whileHover="hover"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </ProfileSection>
      )}

      {/* --- Education Section --- */}
      {seekerData.education && seekerData.education.length > 0 && (
        <ProfileSection title="Education">
          <ul className="space-y-6 divide-y divide-gray-200">
            {seekerData.education.map((edu) => (
              <motion.li
                key={edu.id}
                className="first:pt-0 flex items-start gap-4"
                variants={itemVariants}
              >
                <motion.img
                  src={Edu}
                  alt="Education icon"
                  className="w-12 h-12 flex-shrink-0"
                  variants={itemVariants}
                />
                <div>
                  <motion.h3
                    className="font-semibold text-lg text-gray-800"
                    variants={itemVariants}
                  >
                    {edu.degree}
                  </motion.h3>
                  <motion.p
                    className="text-[#201A23] font-medium"
                    variants={itemVariants}
                  >
                    {edu.institution}
                  </motion.p>
                  <motion.p
                    className="text-sm text-gray-500 mb-2"
                    variants={itemVariants}
                  >
                    {edu.duration}
                  </motion.p>
                  {edu.details && (
                    <motion.p
                      className="text-base text-gray-600"
                      variants={itemVariants}
                    >
                      {edu.details}
                    </motion.p>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </ProfileSection>
      )}
    </motion.div>
  );
}

export default SeekerProfile;