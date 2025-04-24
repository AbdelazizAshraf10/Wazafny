import EditProfile from "./edit-pencil";
import Email from "../../../../../assets/seeker/email.svg";
import Cover from "../../../../../assets/profile-banner.png";
import CoverDefault from "../../../../../assets/coverimagedefault.png";
import Modal from "./Modal";
import About from "../about/about";
import Resume from "../resume/resume";
import Experince from "../experince/Experince";
import Skill from "../skills/skill";
import Education from "../education/Education";
import Following from "./Following-Modal";
import { useState, useEffect } from "react";

const UserProfile = () => {
  // Static user data
  const userProfileData = {
    name: "Youssef Ahmed",
    following: 150,
    Headline: "Intern Flutter Developer @DEPI",
    location: "Benha, Al Qalyubiyah, Egypt",
  };

  const [message, setMessage] = useState({ text: "", type: "" });

  // Auto-dismiss message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Retrieve role from localStorage
  const userRole = localStorage.getItem("Role");

  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen ]= useState(false);
  const [websiteLinks, setWebsiteLinks] = useState([
    { website: "", linkText: "" },
  ]);

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg") &&
      file.size <= 5 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result);
        setIsCoverModalOpen(false);
      };
      reader.readAsDataURL(file);
    } else {
      setMessage({
        text: 'File size exceeds 5MB or file type is not supported. Please choose a smaller JPEG, PNG, or JPG file.',
        type: 'error'
      });
    }
  };

  const handleUserPhotoChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg") &&
      file.size <= 5 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setIsProfileModalOpen(false);
      };
      reader.readAsDataURL(file);
    } else {
      setMessage({
        text: 'File size exceeds 5MB or file type is not supported.<br/> Please choose a smaller JPEG, PNG, or JPG file.',
        type: 'error'
      });
    }
  };

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
              src={coverPhoto || Cover}
              alt="Cover"
              className="w-full h-full object-cover rounded-t-xl"
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
                  <EditProfile onLinksChange={setWebsiteLinks} />
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
              >
                <p className="text-[#6A0DAD] text-lg font-semibold">
                  {userProfileData.following} Following
                </p>
              </button>

              <Following
                isOpen={isFollowingModalOpen}
                onClose={() => setIsFollowingModalOpen(false)}
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
              >
                Links
              </button>
              <img src={Email} alt="Email Icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <About userRole={userRole} />
      </div>

      <div className="flex justify-center mt-3">
        <Resume userRole={userRole} />
      </div>

      <div className="flex justify-center mt-3">
        <Experince userRole={userRole} />
      </div>

      <div className="flex justify-center mt-3">
        <Skill userRole={userRole} />
      </div>

      <div className="flex justify-center mt-3 mb-9">
        <Education userRole={userRole} />
      </div>

      <Modal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        title={"Cover Photo"}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-[700px] h-[500px] text-center relative">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Banner photo</h2>
              <button
                className="text-gray-500 hover:text-black scale-150"
                onClick={() => setIsCoverModalOpen(false)}
              >
                ✖
              </button>
            </div>

            <div className="w-full h-60 border-2 border-solid border-[#000000] rounded-xl flex items-center justify-center overflow-hidden">
              {coverPhoto ? (
                <img
                  src={coverPhoto || CoverDefault}
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
                    onClick={() => setCoverPhoto(null)}
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
        title={"Profile Photo"}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-[600px] text-center relative">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Profile photo</h2>
              <button
                className="text-gray-500 hover:text-black scale-150"
                onClick={() => setIsProfileModalOpen(false)}
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
                    onClick={() => setProfilePhoto(null)}
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
        title={"Links"}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] h-[300px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Links</h2>
              <button
                className="text-gray-500 hover:text-black scale-150"
                onClick={() => setIsLinksModalOpen(false)}
              >
                ✖
              </button>
            </div>

            <div className="space-y-4">
              {websiteLinks.length > 0 && websiteLinks[0].website ? (
                websiteLinks.map(
                  (link, index) =>
                    link.website && (
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
                    )
                )
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