import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InputField } from "../../home/NavIcons/PROFILE/profile/my-component";
import Cover from "../../../assets/company/default.png";
import axios from "axios";
import { Navigate } from "react-router-dom";
function FirstSection({
  companyId,
  companyName,
  headline,
  website,
  email,
  followers,
  jobs,
  bannerPhoto,
  profilePhoto,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const [companyData, setCompanyData] = useState({
    companyName: companyName || "Unknown Company",
    headline: headline || "No Headline",
    website: website || "",
    email: email || "No Email",
    followers: followers || "0",
    jobs: jobs || "0",
    bannerPhoto: bannerPhoto || Cover,
    profilePhoto: profilePhoto || null,
  });

  const [formData, setFormData] = useState({
    companyName: companyData.companyName,
    headline: companyData.headline,
    website: companyData.website,
    email: companyData.email,
  });

  const [formErrors, setFormErrors] = useState({
    companyName: "",
    headline: "",
    website: "",
    email: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    switch (name) {
      case "companyName":
        if (value.length > 100) {
          setFormErrors((prev) => ({
            ...prev,
            companyName: "Company name must be 100 characters or less",
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, companyName: "" }));
        }
        break;
      case "email":
        if (value.length > 255) {
          setFormErrors((prev) => ({
            ...prev,
            email: "Email must be 255 characters or less",
          }));
        } else if (!validateEmail(value)) {
          setFormErrors((prev) => ({
            ...prev,
            email: "Please enter a valid email address, no spaces allowed",
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, email: "" }));
        }
        break;
      case "website":
        if (value && /\s/.test(value)) {
          setFormErrors((prev) => ({
            ...prev,
            website: "Please enter a valid URL, no spaces allowed",
          }));
        } else if (value && !validateUrl(value)) {
          setFormErrors((prev) => ({
            ...prev,
            website: "Please enter a valid URL",
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, website: "" }));
        }
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    let errors = {};

    if (!formData.companyName) {
      errors.companyName = "Company name is required";
    } else if (formData.companyName.length > 100) {
      errors.companyName = "Company name must be 100 characters or less";
    }

    if (!formData.headline) {
      errors.headline = "Headline is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (formData.email.length > 255) {
      errors.email = "Email must be 255 characters or less";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (formData.website && !validateUrl(formData.website)) {
      errors.website = "Please enter a valid URL";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({
            text: "No authentication token found. Please log in.",
            type: "error",
          });
          return;
        }

        const payload = {
          company_id: companyId,
          company_name: formData.companyName,
          headline: formData.headline,
          company_website_link: formData.website,
          company_email: formData.email,
        };

        await axios.post(
          `https://wazafny.online/api/update-presonal-info`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setCompanyData((prevData) => ({
          ...prevData,
          companyName: formData.companyName,
          headline: formData.headline,
          website: formData.website,
          email: formData.email,
        }));

        setMessage({ text: "Changes saved successfully", type: "success" });
        setIsEditModalOpen(false);
      } catch (err) {
        console.error("Error updating company info:", err);
        if (err.response?.status === 401) {
          setMessage({
            text: "Unauthorized. Please log in again.",
            type: "error",
          });
          Navigate("/LoginCompany");
        } else if (err.response?.status === 422) {
          console.log("Invalid data provided. Please check your inputs.");
        }else if (err.response?.status === 500) {
          console.log("Internal server error");
        }else if (err.response?.status === 404) {
          console.log("Company not found id company not correct.");
        } else {
          setMessage({
            text: "Failed to update company info. Please try again later.",
            type: "error",
          });
        }
      }
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          text: "Please upload a JPEG, JPG, or PNG file.",
          type: "error",
        });
        return;
      }

      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage({
          text: "File size exceeds 1MB. Please upload a smaller file.",
          type: "error",
        });
        return;
      }

      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setMessage({
          text: "No user ID found. Please log in.",
          type: "error",
        });
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({
          text: "No authentication token found. Please log in.",
          type: "error",
        });
        return;
      }

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("cover_img", file);

      try {
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
        } catch (err) {
          console.error("Error uploading banner photo:", err);
          if (err.response?.status === 401) {
            setMessage({
              text: "Unauthorized. Please log in again.",
              type: "error",
            });
            Navigate("/LoginCompany");
          } else if (err.response?.status === 422) {
            console.log("Invalid data provided. Please check your inputs.");
          }else if (err.response?.status === 500) {
            console.log("Internal server error");
          }else if (err.response?.status === 404) {
            console.log("user not found id user not correct.");
          } else {
            setMessage({
              text: "Failed to upload banner photo. Please try again later.",
              type: "error",
            });
          }
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setCompanyData((prevData) => ({
            ...prevData,
            bannerPhoto: reader.result,
          }));
        };
        reader.readAsDataURL(file);

        setMessage({
          text: "Banner photo updated successfully",
          type: "success",
        });
      } catch (err) {
        console.error("Error uploading banner photo:", err);
        if (err.response?.status === 401) {
          setMessage({
            text: "Unauthorized. Please log in again.",
            type: "error",
          });
          // Clear invalid token and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          // Redirect to login page (adjust based on your app's routing)
          // window.location.href = "/login";
        } else if (err.response?.status === 400) {
          setMessage({
            text: "Invalid file or user ID. Please try again.",
            type: "error",
          });
        } else {
          setMessage({
            text: "Failed to update banner photo. Please try again later.",
            type: "error",
          });
        }
      }
    }
    setIsBannerModalOpen(false);
  };

  const handleBannerDelete = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setMessage({
        text: "No user ID found. Please log in.",
        type: "error",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({
        text: "No authentication token found. Please log in.",
        type: "error",
      });
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

      

      setCompanyData((prevData) => ({
        ...prevData,
        bannerPhoto: null,
      }));

      setMessage({
        text: "Banner photo deleted successfully",
        type: "success",
      });
    } catch (err) {
      console.error(
        "Error deleting banner photo:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        setMessage({
          text: "Unauthorized. Please log in again.",
          type: "error",
        });
        Navigate("/LoginCompany");
      }else if (err.response?.status === 500) {
        console.log("Internal server error");
      }else if (err.response?.status === 404) {
        console.log("user not found id user not correct.");
      } else {
        setMessage({
          text: "Failed to delete banner photo. Please try again later.",
          type: "error",
        });
      }
    }
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          text: "Please upload a JPEG, JPG, or PNG file.",
          type: "error",
        });
        return;
      }

      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage({
          text: "File size exceeds 1MB. Please upload a smaller file.",
          type: "error",
        });
        return;
      }

      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setMessage({
          text: "No user ID found. Please log in.",
          type: "error",
        });
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({
          text: "No authentication token found. Please log in.",
          type: "error",
        });
        return;
      }

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("profile_img", file);

      try {
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
        } catch (err) {
          console.error("Error updating profile photo:", err.response?.data || err.message);
          if (err.response?.status === 401) {
            setMessage({
              text: "Unauthorized. Please log in again.",
              type: "error",
            });
            Navigate("/LoginCompany");
          } else if (err.response?.status === 422) {
            console.log("Invalid data provided. Please check your inputs.");
          }else if (err.response?.status === 500) {
            console.log("Internal server error");
          }else if (err.response?.status === 404) {
            console.log("user not found id user not correct.");
          } else {
            setMessage({
              text: "Failed to update profile photo. Please try again later.",
              type: "error",
            });
          }
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setCompanyData((prevData) => ({
            ...prevData,
            profilePhoto: reader.result,
          }));
        };
        reader.readAsDataURL(file);

        setMessage({
          text: "Profile photo updated successfully",
          type: "success",
        });
      } catch (err) {
        console.error("Error uploading profile photo:", err);
        if (err.response?.status === 401) {
          setMessage({
            text: "Unauthorized. Please log in again.",
            type: "error",
          });
        } else if (err.response?.status === 400) {
          setMessage({
            text: "Invalid file or user ID. Please try again.",
            type: "error",
          });
        } else {
          setMessage({
            text: "Failed to update profile photo. Please try again later.",
            type: "error",
          });
        }
      }
    }
    setIsProfileModalOpen(false);
  };

  const handleProfileDelete = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setMessage({
        text: "No user ID found. Please log in.",
        type: "error",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({
        text: "No authentication token found. Please log in.",
        type: "error",
      });
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

      

      setCompanyData((prevData) => ({
        ...prevData,
        profilePhoto: null,
      }));

      setMessage({
        text: "Profile photo deleted successfully",
        type: "success",
      });
    } catch (err) {
      console.error(
        "Error deleting profile photo:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        setMessage({
          text: "Unauthorized. Please log in again.",
          type: "error",
        });
        Navigate("/LoginCompany");
      }else if (err.response?.status === 500) {
        console.log("Internal server error");
      }else if (err.response?.status === 404) {
        console.log("user not found id user not correct.");
      } else {
        setMessage({
          text: "Failed to delete profile photo. Please try again later.",
          type: "error",
        });
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const profilePhotoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const bannerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
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
            0% { opacity: 0; }
            100% { opacity: 1; }
          }

          @keyframes slideIn {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes slideOut {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-20px); opacity: 0; }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-in forwards;
          }

          .floating-message {
            position: fixed;
            top: 20px;
            left: 40%;
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

          .error-text {
            color: #f44336;
            font-size: 12px;
            margin-top: -8px;
            margin-bottom: 8px;
          }
        `}
      </style>
      <div className="relative border-[#D9D9D9] border-2 bg-[#ffffff] w-[1225px] rounded-[15.47px] mx-auto">
        <motion.div
          className="h-60 bg-purple-900 rounded-t-lg cursor-pointer"
          style={{
            backgroundImage: companyData.bannerPhoto
              ? `url(${companyData.bannerPhoto})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => setIsBannerModalOpen(true)}
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
        ></motion.div>

        <div className="relative p-6">
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
              <span className="text-white text-3xl font-bold">
                {companyData.companyName.charAt(0).toUpperCase()}
              </span>
            )}
          </motion.div>

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
                <a
                  href={companyData.website}
                  className="text-purple-600 underline"
                >
                  {companyData.website}
                </a>{" "}
                |{" "}
                <a
                  href={`mailto:${companyData.email}`}
                  className="text-purple-600 underline"
                >
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
              <form onSubmit={(e) => e.preventDefault()}>
                <div>
                  <InputField
                    label="Company name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    required
                  />
                  {formErrors.companyName && (
                    <p className="error-text">{formErrors.companyName}</p>
                  )}
                </div>
                <div>
                  <InputField
                    label="Headline"
                    name="headline"
                    value={formData.headline}
                    onChange={handleInputChange}
                    placeholder="Enter headline"
                    required
                  />
                  {formErrors.headline && (
                    <p className="error-text">{formErrors.headline}</p>
                  )}
                </div>
                <div>
                  <InputField
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Enter website"
                  />
                  {formErrors.website && (
                    <p className="error-text">{formErrors.website}</p>
                  )}
                </div>
                <div>
                  <InputField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    required
                  />
                  {formErrors.email && (
                    <p className="error-text">{formErrors.email}</p>
                  )}
                </div>
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
                A great background photo can make you more noticeable. (Max 5MB,
                JPEG/PNG/JPG)
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
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
                We recommend using an authentic logo or image that represents
                your company. (Max 5MB, JPEG/PNG/JPG)
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
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
    </>
  );
}

export default FirstSection;
