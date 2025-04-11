import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import framer-motion
import { InputField } from '../../home/NavIcons/PROFILE/profile/my-component'; // Your input field component
import Cover from "../../../assets/company/default.png"
function FirstSection() {
  // State to manage modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // State to manage company data
  const [companyData, setCompanyData] = useState({
    companyName: 'Vodafone Egypt',
    headline: 'Together We Can',
    website: 'www.vodafone.com',
    email: 'egypt@vodafone.com',
    followers: '65K',
    jobs: '46',
    bannerPhoto: Cover, // For banner photo
    profilePhoto: null, // For profile photo
  });

  // State to manage form inputs in the edit modal
  const [formData, setFormData] = useState({
    companyName: companyData.companyName,
    headline: companyData.headline,
    website: companyData.website,
    email: companyData.email,
  });

  // Handle input changes in the edit modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for the edit modal
  const handleSave = () => {
    setCompanyData((prevData) => ({
      ...prevData,
      companyName: formData.companyName,
      headline: formData.headline,
      website: formData.website,
      email: formData.email,
    }));
    setIsEditModalOpen(false); // Close the modal after saving
  };

  // Handle banner photo upload
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyData((prevData) => ({
          ...prevData,
          bannerPhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
    setIsBannerModalOpen(false);
  };

  // Handle banner photo deletion
  const handleBannerDelete = () => {
    setCompanyData((prevData) => ({
      ...prevData,
      bannerPhoto: null,
    }));
  };

  // Handle profile photo upload
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyData((prevData) => ({
          ...prevData,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
    setIsProfileModalOpen(false);
  };

  // Handle profile photo deletion
  const handleProfileDelete = () => {
    setCompanyData((prevData) => ({
      ...prevData,
      profilePhoto: null,
    }));
  };

  // Animation variants for the company details
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2, // Staggered delay for each element
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  // Animation variants for the profile photo
  const profilePhotoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Animation variants for the banner photo
  const bannerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="relative boder-[#D9D9D9] border-2 bg-[#ffffff] w-[1225px] rounded-[15.47px]  mx-auto">
      {/* Banner Photo Section */}
      <motion.div
        className="h-60 bg-purple-900 rounded-t-lg cursor-pointer"
        style={{
          backgroundImage: companyData.bannerPhoto
            ? `url(${companyData.bannerPhoto})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => setIsBannerModalOpen(true)}
        variants={bannerVariants}
        initial="hidden"
        animate="visible"
      ></motion.div>

      {/* Company Info Section */}
      <div className="relative p-6">
        {/* Profile Photo */}
        <motion.div
          className="absolute -top-12 left-6 w-24 h-24 bg-red-600 rounded-lg flex items-center justify-center cursor-pointer border-4 border-white"
          onClick={() => setIsProfileModalOpen(true)}
          variants={profilePhotoVariants}
          initial="hidden"
          animate="visible"
        >
          {companyData.profilePhoto ? (
            <img
              src={companyData.profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-white text-3xl font-bold">V</span>
          )}
        </motion.div>

        {/* Company Details */}
        <div className="ml-32">
          <div className="flex items-center justify-between">
            <motion.h1
              className="text-2xl font-bold text-black"
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              {companyData.companyName}
            </motion.h1>
            {/* Edit Pencil Icon */}
            <motion.button
              onClick={() => setIsEditModalOpen(true)}
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                />
              </svg>
            </motion.button>
          </div>
          <motion.p
            className="text-sm text-gray-600"
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            {companyData.headline}
          </motion.p>
          <motion.div
            className="mt-2 text-sm text-gray-600"
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <p>
              <a href={companyData.website} className="text-purple-600 underline">
                {companyData.website}
              </a>{' '}
              |{' '}
              <a href={`mailto:${companyData.email}`} className="text-purple-600 underline">
                {companyData.email}
              </a>
            </p>
          </motion.div>
          <motion.p
            className="mt-1 text-sm text-gray-600"
            custom={4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            {companyData.followers} Followers | {companyData.jobs} Jobs
          </motion.p>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <motion.div
            className="bg-white rounded-lg shadow-lg w-[800px] min-h-[500px] p-6 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <form>
              <InputField
                label="Company name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter company name"
              />
              <InputField
                label="Headline"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                placeholder="Enter headline"
                required
              />
              <InputField
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Enter website"
                required
              />
              <InputField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-black text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Banner Photo Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <motion.div
            className="bg-white rounded-lg shadow-lg w-[700px] min-h-[550px] p-6 relative text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4 mt-4">Banner photo</h2>
            <div className="w-full h-56 border border-gray-300 rounded-md flex items-center justify-center">
              {companyData.bannerPhoto ? (
                <img
                  src={companyData.bannerPhoto}
                  alt="Banner Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-10">
              A great background photo can make you more noticeable.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
                id="banner-upload"
              />
              <label
                htmlFor="banner-upload"
                className="inline-block bg-black text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Select photo
              </label>
              {companyData.bannerPhoto && (
                <button
                  onClick={handleBannerDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Profile Photo Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <motion.div
            className="bg-white rounded-lg shadow-lg w-[600px] min-h-[500px] p-6 relative text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold mt-6">Company profile photo</h2>
            <div className="w-32 h-32 mx-auto mt-20 bg-gray-200 rounded-full flex items-center justify-center">
              {companyData.profilePhoto ? (
                <img
                  src={companyData.profilePhoto}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-20">
              We recommend using an authentic logo or image that represents your company.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="hidden"
                id="profile-upload"
              />
              <label
                htmlFor="profile-upload"
                className="inline-block bg-black text-white px-4 mr-2 py-2 rounded-md cursor-pointer"
              >
                Select photo
              </label>
              {companyData.profilePhoto && (
                <button
                  onClick={handleProfileDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default FirstSection;