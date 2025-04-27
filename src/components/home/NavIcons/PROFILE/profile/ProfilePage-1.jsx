import PropTypes from "prop-types";
import EditProfile from "./edit-pencil";
import Email from "../../../../../assets/seeker/email.svg";
import CoverDefault from "../../../../../assets/company/default.png";
import Modal from "./Modal";
import About from "../about/about";
import Resume from "../resume/resume";
import Experience from "../experince/Experince";
import Skill from "../skills/skill";
import Education from "../education/Education";
import Following from "./Following-Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [about, setAbout] = useState(null);
  const [resume, setResume] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const navigate = useNavigate();

  const seekerId = localStorage.getItem("seeker_id");
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("Role");
console.log(token)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!seekerId || !token) {
        setError("Missing seeker ID or token. Please log in again.");
        setLoading(false);
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://wazafny.online/api/show-seeker-profile/${seekerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("User Profile API Response:", response.data);

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
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [seekerId, token, navigate]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    console.log("Current websiteLinks:", websiteLinks);
  }, [websiteLinks]);

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

      try {
        const response = await axios.post(
          "https://wazafny.online/api/update-cover-img",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Update Cover Image API Response:", response.data);

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
        } else if (err.response?.status === 400) {
          setMessage({
            text: "Invalid image or request. Please try again.",
            type: "error",
          });
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
      }
    } else {
      setMessage({
        text: "File size exceeds 1MB or file type is not supported. Please choose a smaller JPEG, PNG, or JPG file.",
        type: "error",
      });
    }
  };

  const handleDeleteCoverPhoto = async () => {
    if (!userId || !token) {
      setMessage({
        text: "Missing user ID or token. Please log in again.",
        type: "error",
      });
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    try {
      const response = await axios.delete(
        `https://wazafny.online/api/delete-cover-img/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Delete Cover Image API Response:", response.data);

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
        setMessage({
          text: "Cover image not found.",
          type: "error",
        });
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
    }
  };

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

      try {
        const response = await axios.post(
          "https://wazafny.online/api/update-profile-img",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Update Profile Image API Response:", response.data);

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
        } else if (err.response?.status === 400) {
          setMessage({
            text: "Invalid image or request. Please try again.",
            type: "error",
          });
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
      }
    } else {
      setMessage({
        text: "File size exceeds 1MB or file type is not supported. Please choose a smaller JPEG, PNG, or JPG file.",
        type: "error",
      });
    }
  };

  const handleDeleteProfilePhoto = async () => {
    if (!userId || !token) {
      setMessage({
        text: "Missing user ID or token. Please log in again.",
        type: "error",
      });
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    try {
      const response = await axios.delete(
        `https://wazafny.online/api/delete-profile-img/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Delete Profile Image API Response:", response.data);

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
        setMessage({
          text: "Profile image not found.",
          type: "error",
        });
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
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-5">
        <div className="bg-white border border-[#D9D9D9] rounded-xl w-[900px] p-6 text-center">
          Loading profile...
        </div>
      </div>
    );
  }

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
            left: 24%;
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
      <div className="flex justify-center mt-5 mb-2 max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] xl:max-h-[80vh] 2xl:max-h-[80vh] 3xl:max-h-[80vh] 4xl:max-h-[80vh]">
        <div className="bg-white border border-[#D9D9D9] rounded-xl w-[900px] pb-4">
          <div
            className="relative h-52 w-full cursor-pointer"
            onClick={userRole !== "Company" ? () => setIsCoverModalOpen(true) : undefined}
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
          </div>

          <div className="px-6 relative">
            <div className="flex items-start">
              <div
                className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg -mt-10 cursor-pointer"
                onClick={userRole !== "Company" ? () => setIsProfileModalOpen(true) : undefined}
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
              </div>
              {userRole !== "Company" && (
                <div className="absolute right-6 top-2">
                  <EditProfile
                    onLinksChange={setWebsiteLinks}
                    initialData={personalInfo}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-2">
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

              <Following
                isOpen={isFollowingModalOpen}
                onClose={() => setIsFollowingModalOpen(false)}
                followings={followingsList}
              />
            </div>

            <div className="mt-1 space-y-2 text-md">
              <p className="text-[#201A23]">{userProfileData.Headline}</p>
              <p className="text-[#A1A1A1]">{userProfileData.location}</p>
            </div>

            <div className="flex gap-2 mt-2 text-sm">
              <button
                onClick={() => setIsLinksModalOpen(true)}
                className="text-[#6A0DAD] text-lg font-bold bg-transparent border-none cursor-pointer"
                aria-label="View links"
              >
                Links
              </button>
              <img src={Email} alt="Email Icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <About userRole={userRole} initialAbout={about} />
      </div>

      <div className="flex justify-center mt-3">
        <Resume userRole={userRole} initialResume={resume} />
      </div>

      <div className="flex justify-center mt-3">
        <Experience userRole={userRole} initialExperiences={experiences} />
      </div>

      <div className="flex justify-center mt-3">
        <Skill userRole={userRole} initialSkills={skills} />
      </div>

      <div className="flex justify-center mt-3 mb-9">
        <Education userRole={userRole} initialEducation={education} />
      </div>

      <Modal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        title="Cover Photo"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-[700px] h-[500px] text-center relative">
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
                  className="w-20 object-cover"
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
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Profile Photo"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-[600px] text-center relative">
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
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isLinksModalOpen}
        onClose={() => setIsLinksModalOpen(false)}
        title="Links"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] h-[300px] max-h-[80vh] overflow-y-auto">
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
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserProfile;