import PropTypes from "prop-types";
import EditProfile from "./edit-pencil";
import Email from "../../../../../assets/seeker/email.svg";
import CoverDefault from "../../../../../assets/company/default.png";
import Search from "../../../../../assets/searchhh.png";
import DefaultCompanyLogo from "../../../../../assets/company/default.png";
import Modal from "./Modal";
import About from "../about/about";
import Resume from "../resume/resume";
import Experience from "../experince/Experince";
import Skill from "../skills/skill";
import Education from "../education/Education";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useLoading } from "../../../../../Contexts/LoadingContext"; // Import the useLoading hook


const UserProfile = () => {
  const [userProfileData, setUserProfileData] = useState({
    name: "Guest",
    following: 0,
    Headline: "",
    location: "",
  });
  const [followingsList, setFollowingsList] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [websiteLinks, setWebsiteLinks] = useState([]);
  
  const [error, setError] = useState(null);
  const [about, setAbout] = useState(null);
  const [resume, setResume] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const navigate = useNavigate();

const { startLoading, stopLoading } = useLoading(); // Use the global loading context

  const seekerId = localStorage.getItem("seeker_id");
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("Role");

  

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!seekerId || !token) {
        setError("Missing seeker ID or token. Please log in again.");
        
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }
      startLoading(); // Start loading animation

      
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

        

        if (response.data && response.data.personal_info) {
          const { personal_info } = response.data;
          setUserProfileData({
            name: `${personal_info.first_name} ${personal_info.last_name}`.trim() || "Guest",
            following: Array.isArray(response.data.followings) ? response.data.followings.length : 0,
            Headline: personal_info.headline || "",
            location: `${personal_info.city}, ${personal_info.country}` || "",
          });
          setFollowingsList(Array.isArray(response.data.followings) ? response.data.followings : []);
          setProfilePhoto(personal_info.profile_img || null);
          setCoverPhoto(personal_info.cover_img || null);
          setWebsiteLinks(
            personal_info.links && personal_info.links.length > 0
              ? personal_info.links.map((link) => ({
                  website: link.link || "",
                  linkText: link.link_name || link.link || "",
                }))
              : []
          );
          setAbout(personal_info.about || null);
          setResume(personal_info.resume || "");
          setExperiences(response.data.experiences || []);
          setSkills(response.data.skills || []);
          setEducation(response.data.education || null);
          setPersonalInfo(personal_info);
        } else {
          setUserProfileData({
            name: "Guest",
            following: 0,
            Headline: "",
            location: "",
          });
          setFollowingsList([]);
          setProfilePhoto(null);
          setCoverPhoto(null);
          setWebsiteLinks([]);
          setAbout(null);
          setResume("");
          setExperiences([]);
          setSkills([]);
          setEducation(null);
          setPersonalInfo(null);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          setError("User profile not found.");
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to load user profile. Please try again later.");
        }
      } finally {
        stopLoading(); // Stop loading animation
      }
    };

    fetchUserProfile();
  }, [seekerId, token, navigate]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

 

  // Handle cover photo change
  const handleCoverPhotoChange = async (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg") &&
      file.size <= 1 * 1024 * 1024
    ) {
      if (!userId || !token) {
        setMessage({
          text: "Missing user ID or token. Please log in again.",
          type: "error",
        });
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("cover_img", file);

      startLoading(); // Start loading animation

      try {
        const response = await axios.post(
          "https://laravel.wazafny.online/api/update-cover-img",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

     

        const updatedCoverImg = response.data.cover_img || URL.createObjectURL(file);
        setCoverPhoto(updatedCoverImg);
        setIsCoverModalOpen(false);
        setMessage({
          text: "Cover image updated successfully.",
          type: "success",
        });
      } catch (err) {
        console.error("Error updating cover image:", err);
        if (err.response?.status === 401) {
          setMessage({
            text: "Unauthorized. Please log in again.",
            type: "error",
          });
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          console.log("User_id not found:", err.response?.data);
        } else if (err.response?.status === 500) {
          setMessage({
            text: "Server error. Please try again later.",
            type: "error",
          });
        } else {
          setMessage({
            text: "Failed to update cover image. Please try again later.",
            type: "error",
          });
        }
      }finally {
        stopLoading(); // Stop loading animation
      }
    } else {
      setMessage({
        text: "File size exceeds 1MB or file type is not supported. Please choose a smaller JPEG, PNG, or JPG file.",
        type: "error",
      });
    }
    
  };

  // Handle cover photo deletion
  const handleDeleteCoverPhoto = async () => {
    if (!userId || !token) {
      setMessage({
        text: "Missing user ID or token. Please log in again.",
        type: "error",
      });
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    startLoading(); // Start loading animation

    try {
      const response = await axios.delete(
        `https://laravel.wazafny.online/api/delete-cover-img/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      

      setCoverPhoto(null);
      setIsCoverModalOpen(false);
      setMessage({
        text: "Cover image deleted successfully.",
        type: "success",
      });
    } catch (err) {
      console.error("Error deleting cover image:", err);
      if (err.response?.status === 401) {
        setMessage({
          text: "Unauthorized. Please log in again.",
          type: "error",
        });
        setTimeout(() => navigate("/Login"), 2000);
      } else if (err.response?.status === 404) {
        console.log("User_id not found:", err.response?.data);
      } else if (err.response?.status === 500) {
        setMessage({
          text: "Server error. Please try again later.",
          type: "error",
        });
      } else {
        setMessage({
          text: "Failed to delete cover image. Please try again later.",
          type: "error",
        });
      }
    }finally {
      stopLoading(); // Stop loading animation
    }
  };

  // Handle profile photo change
  const handleUserPhotoChange = async (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg") &&
      file.size <= 1 * 1024 * 1024
    ) {
      if (!userId || !token) {
        setMessage({
          text: "Missing user ID or token. Please log in again.",
          type: "error",
        });
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("profile_img", file);
      startLoading(); // Start loading animation
      try {
        const response = await axios.post(
          "https://laravel.wazafny.online/api/update-profile-img",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

       

        const updatedProfileImg = response.data.profile_img || URL.createObjectURL(file);
        setProfilePhoto(updatedProfileImg);
        setIsProfileModalOpen(false);
        setMessage({
          text: "Profile image updated successfully.",
          type: "success",
        });
      } catch (err) {
        console.error("Error updating profile image:", err);
        if (err.response?.status === 401) {
          setMessage({
            text: "Unauthorized. Please log in again.",
            type: "error",
          });
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          console.log("User_id not found:", err.response?.data);
        } else if (err.response?.status === 500) {
          setMessage({
            text: "Server error. Please try again later.",
            type: "error",
          });
        } else {
          setMessage({
            text: "Failed to update profile image. Please try again later.",
            type: "error",
          });
        }
      }finally {
        stopLoading(); // Stop loading animation
      }
    } else {
      setMessage({
        text: "File size exceeds 1MB or file type is not supported. Please choose a smaller JPEG, PNG, or JPG file.",
        type: "error",
      });
    }
  };

  // Handle profile photo deletion
  const handleDeleteProfilePhoto = async () => {
    if (!userId || !token) {
      setMessage({
        text: "Missing user ID or token. Please log in again.",
        type: "error",
      });
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }
    startLoading(); // Start loading animation
    try {
      const response = await axios.delete(
        `https://laravel.wazafny.online/api/delete-profile-img/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      

      setProfilePhoto(null);
      setIsProfileModalOpen(false);
      setMessage({
        text: "Profile image deleted successfully.",
        type: "success",
      });
    } catch (err) {
      console.error("Error deleting profile image:", err);
      if (err.response?.status === 401) {
        setMessage({
          text: "Unauthorized. Please log in again.",
          type: "error",
        });
        setTimeout(() => navigate("/Login"), 2000);
      } else if (err.response?.status === 404) {
        console.log("User_id not found:", err.response?.data);
      } else if (err.response?.status === 500) {
        setMessage({
          text: "Server error. Please try again later.",
          type: "error",
        });
      } else {
        setMessage({
          text: "Failed to delete profile image. Please try again later.",
          type: "error",
        });
      }
    }finally {
      stopLoading(); // Stop loading animation
    }
  };

  // Animation variants for the profile card
  const profileCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for child elements within the profile card
  const profileChildVariants = {
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

  // Animation variants for sections (About, Resume, etc.)
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.2,
      },
    }),
  };

  // Animation variants for FollowingModal list items
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.1,
      },
    }),
  };

  // Animation variants for modal backdrop
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Animation variants for modal content
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Following Modal Component (Integrated)
  const FollowingModal = ({ isOpen, onClose, followings }) => {
    // Ensure followings is an array; default to empty array if undefined or not an array
    const initialFollowings = Array.isArray(followings)
      ? followings.map((company) => ({
          id: company.company_id,
          name: company.company_name,
          logo: company.profile_img,
        }))
      : [];

    // State for search term, filtered followings, and messages
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredFollowings, setFilteredFollowings] = useState(initialFollowings);
    const [followingMessage, setFollowingMessage] = useState({ text: "", type: "" });

    // Update filtered followings when followings prop or search term changes
    useEffect(() => {
      const term = searchTerm.toLowerCase();
      const filtered = initialFollowings.filter((company) =>
        company.name.toLowerCase().includes(term)
      );
      setFilteredFollowings(filtered);
    }, [searchTerm, followings]);

    // Handle search input changes
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };

    // Handle company click to navigate to company overview
    const handleCompanyClick = (companyId) => {
      
      if (!companyId || isNaN(companyId)) {
        console.error("companyId is undefined or invalid:");
        setFollowingMessage({
          text: "Invalid company ID. Please try again.",
          type: "error",
        });
        return;
      }
      navigate(`/seeker/companyOverview/${companyId}`);
    };

    // Handle unfollow action
    const handleUnfollow = async (companyId) => {
      if (!token) {
        setFollowingMessage({
          text: "Please log in to unfollow.",
          type: "error",
        });
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }

      if (!seekerId) {
        setFollowingMessage({
          text: "Missing seeker ID. Please log in again.",
          type: "error",
        });
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }

      
      try {
        const response = await axios.delete("https://laravel.wazafny.online/api/unfollow", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            seeker_id: seekerId,
            company_id: companyId,
          },
        });

        

        // Update followings list in UserProfile state
        setFollowingsList((prev) =>
          prev.filter((company) => company.company_id !== companyId)
        );
        setUserProfileData((prev) => ({
          ...prev,
          following: prev.following - 1,
        }));
        setFilteredFollowings((prev) =>
          prev.filter((company) => company.id !== companyId)
        );

        setFollowingMessage({
          text: "Unfollowed successfully.",
          type: "success",
        });
      } catch (err) {
        console.error("Error unfollowing company:", err);
        console.log("Error Response:", err.response?.data);

        if (err.response?.status === 401) {
          setFollowingMessage({
            text: "Unauthorized. Please log in again.",
            type: "error",
          });
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          console.error("Company not found. Please try again." + err.response?.data);
        } else if (err.response?.status === 500) {
          setFollowingMessage({
            text: "Server error. Please try again later.",
            type: "error",
          });
        } else {
          setFollowingMessage({
            text: "Failed to unfollow. Please try again.",
            type: "error",
          });
        }
      }
    };

    // Clear message after 3 seconds
    useEffect(() => {
      if (followingMessage.text) {
        const timer = setTimeout(() => {
          setFollowingMessage({ text: "", type: "" });
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [followingMessage]);

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Followings">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[450px] max-h-[80vh] overflow-y-auto relative space-y-4"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Message Display */}
                {followingMessage.text && (
                  <div
                    className={`floating-message ${followingMessage.type} ${
                      !followingMessage.text ? "hide" : ""
                    }`}
                  >
                    {followingMessage.text}
                  </div>
                )}

                {/* Header */}
                <div className="flex justify-center mb-7">
                  <h2 className="text-xl font-bold">Followings</h2>
                  <div className="absolute top-4 right-4 scale-150">
                    <button
                      className="text-gray-500 hover:text-black"
                      onClick={onClose}
                      aria-label="Close followings modal"
                    >
                      ✖
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full mt-9">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border text-sm rounded-full text-gray-700 focus:outline-none"
                    aria-label="Search followed companies"
                  />
                  <img
                    src={Search}
                    alt="Search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  />
                </div>

                {/* Followings List */}
                <ul className="space-y-6">
                  {filteredFollowings.length > 0 ? (
                    filteredFollowings.map((company, index) => (
                      <motion.li
                        key={company.id}
                        className="flex items-center justify-between"
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                      >
                        <div
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={() => handleCompanyClick(company.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleCompanyClick(company.id);
                            }
                          }}
                          aria-label={`View ${company.name} overview`}
                        >
                          <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="w-8 h-8 rounded-md object-cover"
                            onError={(e) => {
                              console.warn(`Failed to load logo for ${company.name}:`, company.logo);
                              e.target.src = DefaultCompanyLogo;
                            }}
                          />
                          <span className="text-md font-medium">{company.name}</span>
                        </div>
                        <button
                          className="border px-3 py-2 rounded-md border-[#201A23] text-black hover:bg-gray-100"
                          onClick={() => handleUnfollow(company.id)}
                          aria-label={`Unfollow ${company.name}`}
                        >
                          Following
                        </button>
                      </motion.li>
                    ))
                  ) : (
                    <div className="text-center text-gray-500">
                      No results found.
                    </div>
                  )}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    );
  };

  FollowingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    followings: PropTypes.arrayOf(
      PropTypes.shape({
        company_id: PropTypes.number.isRequired,
        company_name: PropTypes.string.isRequired,
        profile_img: PropTypes.string,
      })
    ),
  };

  FollowingModal.defaultProps = {
    followings: [],
  };

  // Render loading or error state
 

  if (error) {
    return (
      <div className="flex justify-center mt-5">
        <div className="bg-white border border-[#D9D9D9] rounded-xl w-[900px] p-6 text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }
 
  return (
    <>
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
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes slideIn {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-20px);
              opacity: 0;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-in forwards;
          }

          .floating-message {
            position: fixed;
            top: 20px;
            left: 41%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out forwards;
          }

          .floating-message.success {
            background-color: #4caf50;
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
      <motion.div
        className="flex justify-center mt-5 mb-2 max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] xl:max-h-[80vh] 2xl:max-h-[80vh] 3xl:max-h-[80vh] 4xl:max-h-[80vh]"
        variants={profileCardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white border border-[#D9D9D9] rounded-xl w-[900px] pb-4">
          <motion.div
            className="relative h-52 w-full cursor-pointer"
            onClick={userRole !== "Company" ? () => setIsCoverModalOpen(true) : undefined}
            variants={profileChildVariants}
          >
            <img
              src={coverPhoto || CoverDefault}
              alt="Cover"
              className="w-full h-full object-cover rounded-t-xl"
              onError={(e) => {
                console.warn("Failed to load cover image:", coverPhoto);
                e.target.src = CoverDefault;
              }}
            />
            {userRole !== "Company" && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition duration-300"></div>
            )}
          </motion.div>

          <div className="px-6 relative">
            <motion.div className="flex items-start" variants={profileChildVariants}>
              <motion.div
                className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg -mt-10 cursor-pointer"
                onClick={userRole !== "Company" ? () => setIsProfileModalOpen(true) : undefined}
                variants={profileChildVariants}
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      console.warn("Failed to load profile image:", profilePhoto);
                      e.target.src = CoverDefault;
                    }}
                  />
                ) : (
                  <svg
                    className="w-10 h-10 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"></path>
                  </svg>
                )}
              </motion.div>
              {userRole !== "Company" && (
                <motion.div
                  className="absolute right-6 top-2"
                  variants={profileChildVariants}
                >
                  <EditProfile
                    onLinksChange={setWebsiteLinks}
                    initialData={personalInfo}
                  />
                </motion.div>
              )}
            </motion.div>

            <motion.div className="flex gap-3 mt-2" variants={profileChildVariants}>
              <h2 className="text-xl font-bold text-black">
                {userProfileData.name}
              </h2>
              <button
                onClick={() => setIsFollowingModalOpen(true)}
                className="text-left bg-transparent border-none cursor-pointer"
                aria-label={`View ${userProfileData.following} followings`}
              >
                <p className="text-[#6A0DAD] text-lg font-semibold">
                  {userProfileData.following} Following
                </p>
              </button>
            </motion.div>

            <motion.div
              className="mt-1 space-y-2 text-md"
              variants={profileChildVariants}
            >
              <p className="text-[#201A23]">{userProfileData.Headline}</p>
              <p className="text-[#A1A1A1]">{userProfileData.location}</p>
            </motion.div>

            <motion.div
              className="flex gap-2 mt-2 text-sm"
              variants={profileChildVariants}
            >
              <button
                onClick={() => setIsLinksModalOpen(true)}
                className="text-[#6A0DAD] text-lg font-bold bg-transparent border-none cursor-pointer"
                aria-label="View links"
              >
                Links
              </button>
              <img src={Email} alt="Email Icon" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="flex justify-center"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <About userRole={userRole} initialAbout={about} />
      </motion.div>

      <motion.div
        className="flex justify-center mt-3"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <Resume userRole={userRole} initialResume={resume} />
      </motion.div>

      <motion.div
        className="flex justify-center mt-3"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <Experience userRole={userRole} initialExperiences={experiences} />
      </motion.div>

      <motion.div
        className="flex justify-center mt-3"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <Skill userRole={userRole} initialSkills={skills} />
      </motion.div>

      <motion.div
        className="flex justify-center mt-3 mb-9"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <Education userRole={userRole} initialEducation={education} />
      </motion.div>

      <FollowingModal
        isOpen={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        followings={followingsList}
      />

      <Modal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        title="Cover Photo"
      >
        <AnimatePresence>
          {isCoverModalOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-white p-10 rounded-lg shadow-lg w-[700px] h-[500px] text-center relative"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold">Banner photo</h2>
                  <button
                    className="text-gray-500 hover:text-black scale-150"
                    onClick={() => setIsCoverModalOpen(false)}
                    aria-label="Close cover photo modal"
                  >
                    ✖
                  </button>
                </div>

                <div className="w-full h-60 border-2 border-solid border-[#000000] rounded-xl flex items-center justify-center overflow-hidden">
                  {coverPhoto ? (
                    <img
                      src={coverPhoto}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={CoverDefault}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  A great background photo can make you more noticeable.
                </p>

                <div className="flex justify-center mt-4">
                  {coverPhoto ? (
                    <>
                      <label className="cursor-pointer px-5 py-2 bg-black text-white font-bold rounded-lg inline-block">
                        Select photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverPhotoChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        className="ml-4 px-5 py-2 border border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-100"
                        onClick={handleDeleteCoverPhoto}
                        aria-label="Delete cover photo"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer px-5 py-2 bg-black text-white font-bold rounded-lg inline-block">
                      Select photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverPhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Profile Photo"
      >
        <AnimatePresence>
          {isProfileModalOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-white p-10 rounded-lg shadow-lg w-[600px] text-center relative"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold">Profile photo</h2>
                  <button
                    className="text-gray-500 hover:text-black scale-150"
                    onClick={() => setIsProfileModalOpen(false)}
                    aria-label="Close profile photo modal"
                  >
                    ✖
                  </button>
                </div>

                <div className="w-28 h-28 mx-auto rounded-full border overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-gray-600">No profile photo</p>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  We suggest using a real photo of yourself.
                </p>

                <div className="flex justify-center mt-4">
                  {profilePhoto ? (
                    <>
                      <label className="cursor-pointer px-5 py-2 bg-black text-white font-bold rounded-lg inline-block">
                        Select photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUserPhotoChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        className="ml-4 px-5 py-2 border border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-100"
                        onClick={handleDeleteProfilePhoto}
                        aria-label="Delete profile photo"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer px-5 py-2 bg-black text-white font-bold rounded-lg inline-block">
                      Select photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUserPhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      <Modal
        isOpen={isLinksModalOpen}
        onClose={() => setIsLinksModalOpen(false)}
        title="Links"
      >
        <AnimatePresence>
          {isLinksModalOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-[700px] h-[300px] max-h-[80vh] overflow-y-auto"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Links</h2>
                  <button
                    className="text-gray-500 hover:text-black scale-150"
                    onClick={() => setIsLinksModalOpen(false)}
                    aria-label="Close links modal"
                  >
                    ✖
                  </button>
                </div>

                <div className="space-y-4">
                  {websiteLinks.length > 0 ? (
                    websiteLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <svg
                              className="w-6 h-6 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                          </div>
                          <a
                            href={link.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#201A23] font-semibold"
                          >
                            {link.linkText || link.website}
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center">No links added yet.</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
};

export default UserProfile;