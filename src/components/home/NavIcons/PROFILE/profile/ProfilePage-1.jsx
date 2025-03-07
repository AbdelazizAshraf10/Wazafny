import { useState } from "react";
import CompanyNav from "../../company-nav";
import EditProfile from "./edit-pencil";
import PropTypes from "prop-types";
import Cover from "../../../../../assets/profile-banner.png";
import CoverDefault from "../../../../../assets/coverimagedefault.png";
import Modal from "./Modal";



import About from "../about/about";
import Resume from "../resume/resume";
import Experince from "../experince/Experince";
import Skill from "../skills/skill";
import Education from "../education/Education";
const UserProfile = ({
  FirstName = "Youssef",
  LastName = "Ahmed",
  Headline = "Intern Flutter Developer @DEPI",
  Location = "Benha, Al Qalyubiyah, Egypt",
}) => {
  // set Cover photo
  const [coverPhoto, setCoverPhoto] = useState(null);

  // set profile photo
  const [profilePhoto, setProfilePhoto] = useState(null);

  // check modal is open or not
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  UserProfile.propTypes = {
    FirstName: PropTypes.string.isRequired,
    LastName: PropTypes.string.isRequired,
    Headline: PropTypes.string.isRequired,
    Location: PropTypes.string.isRequired,
  };

  const user = {
    name: `${FirstName} ${LastName}`,
    following: 150,
    Headline: Headline,
    location: Location,
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result);
        setIsCoverModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setIsProfileModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <CompanyNav />
      <div className="flex justify-center mt-5 mb-2 max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] xl:max-h-[80vh] 2xl:max-h-[80vh] 3xl:max-h-[80vh] 4xl:max-h-[80vh] ">
        <div className="bg-white border  border-[#D9D9D9] rounded-xl w-[900px] pb-4">
          {/* Cover Photo */}
          <div
            className="relative h-32 w-full cursor-pointer"
            onClick={() => setIsCoverModalOpen(true)}
          >
            <img
              src={coverPhoto || Cover}
              alt="Cover"
              className="w-full h-full object-cover rounded-t-xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition duration-300"></div>
          </div>

          {/* Profile Section */}
          <div className="px-6 relative">
            <div className="flex items-start">
              {/* Profile Picture */}
              <div
                className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg -mt-10 cursor-pointer"
                onClick={() => setIsProfileModalOpen(true)}
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
              <div className="absolute right-6 top-2">
                <EditProfile />
              </div>
            </div>

            {/* User Info */}
            <div className="mt-2">
              <h2 className="text-xl font-bold text-black">{user.name}</h2>
              <p className="text-[#6A0DAD] font-medium">
                {user.following} Following
              </p>
            </div>

            {/* Headline and Location */}
            <div className="mt-1 text-sm">
              <p className="text-[#201A23]">{user.Headline}</p>
              <p className="text-[#A1A1A1]">{user.location}</p>
            </div>
          </div>
        </div>
      </div>









      {/* another sectionsssss */}

      

      <div className="flex justify-center ">
        <About/>
        
      </div>

      <div className="flex justify-center mt-3">
        <Resume/>
      </div>

      <div className="flex justify-center mt-3">
        <Experince/>
      </div>

      <div className="flex justify-center mt-3">
        <Skill/>
      </div>



      <div className="flex justify-center mt-3">
        <Education/>
      </div>



      {/* end of another sectionsss */}












      {/* cover photo modal */}

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
                className="text-gray-500 hover:text-black"
                onClick={() => setIsCoverModalOpen(false)}
              >
                ✖
              </button>
            </div>

            <div className="w-full h-60 border-2 border-solid border-[#000000] rounded-xl  flex items-center justify-center overflow-hidden">
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
                // If cover photo exists: Show both "Select photo" and "Delete" buttons
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
                // If no cover photo: Show only "Select photo" button (smaller size)
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

      {/* image photo modal */}

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
                className="text-gray-500 hover:text-black"
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
                // If a profile photo exists, show both "Select photo" and "Delete" buttons
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
                // If no profile photo, show only the "Select photo" button (smaller size)
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
    </>
  );
};

export default UserProfile;
