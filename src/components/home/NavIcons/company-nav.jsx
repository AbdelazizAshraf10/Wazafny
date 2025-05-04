import logo from "../../../assets/wazafny.png";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import NotificationDropdown from "./notofication";
import UserProfileDropdown from "./PROFILE/profile/ProfileIcon";
import JobApplicationDropdown from "./Application"; // Ensure correct import
import { Outlet } from "react-router-dom";
import { Message } from "../../CustomMessage/FloatMessage";

function CompanyNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Jobs");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // State for success message

  // Update activeTab based on the current URL
  useEffect(() => {
    if (location.pathname === "/seeker/JopsPage") {
      setActiveTab("Jobs");
    } else if (location.pathname === "/seeker/companypage") {
      setActiveTab("Company");
    }
  }, [location.pathname]);

  const handleJobsClick = () => {
    setActiveTab("Jobs");
    navigate("/seeker/JopsPage");
  };

  const handleCompanyClick = () => {
    setActiveTab("Company");
    navigate("/seeker/companypage");
  };

  // Handle dropdown toggle and ensure only one is open
  const handleDropdownToggle = (dropdownName) => {
    
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null); // Close the dropdown if it's already open
    } else {
      setActiveDropdown(dropdownName); // Open the clicked dropdown and close others
    }
    
  };

  // Animation variants for the buttons
  const buttonVariants = {
    active: {
      scale: 1.05,
      color: "#6A0DAD",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    inactive: {
      scale: 1,
      color: "#201A23",
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  // Animation variants for the icons
  const iconVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <div>
      {/* Success Message */}
      <div className="fixed top-9 left-1/2 transform -translate-x-1/2 z-50 w-full px-4">
        <Message
          message={successMessage}
          type="success"
          duration={3000}
          onClose={() => setSuccessMessage(null)}
        />
      </div>

      <div className="flex justify-between items-center px-5 mt-2">
        {/* Logo on the left */}
        <motion.div
          className="flex items-center ml-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={logo} alt="logo" />
        </motion.div>

        {/* Job and company select in the middle */}
        <div className="flex items-center gap-x-40 text-2xl font-bold mt-3 ml-4 relative">
          <motion.button
            onClick={handleJobsClick}
            className="relative pb-2"
            variants={buttonVariants}
            animate={activeTab === "Jobs" ? "active" : "inactive"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Jobs
            {activeTab === "Jobs" && (
              <motion.div
                className="absolute left-0 bottom-[-3px] w-full h-[4px] bg-[#6A0DAD]"
                layoutId="underline"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>

          <motion.button
            onClick={handleCompanyClick}
            className="relative pb-2"
            variants={buttonVariants}
            animate={activeTab === "Company" ? "active" : "inactive"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Company
            {activeTab === "Company" && (
              <motion.div
                className="absolute left-0 bottom-[-3px] w-full h-[4px] bg-[#6A0DAD]"
                layoutId="underline"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        </div>

        {/* Icons on the right */}
        <motion.div
          className="flex items-center space-x-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Application List Icon */}
          <motion.div
            className="relative"
            variants={iconVariants}
          >
            <JobApplicationDropdown
              isOpen={activeDropdown === "application"}
              onToggle={() => handleDropdownToggle("application")}
            />
          </motion.div>

          {/* Notification Icon with Badge */}
          <motion.div
            className="relative"
            variants={iconVariants}
          >
            <NotificationDropdown
              isOpen={activeDropdown === "notification"}
              onToggle={() => handleDropdownToggle("notification")}
            />
          </motion.div>

          {/* Profile Icon with Verification Badge */}
          <motion.div
            className="relative bg-[#6A0DAD] text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold"
            variants={iconVariants}
            whileHover="hover"
            
          >
            <UserProfileDropdown
              isOpen={activeDropdown === "profile"}
              onToggle={() => handleDropdownToggle("profile")}
              setSuccessMessage={setSuccessMessage} // Pass callback to set success message
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.hr
        className="border border-[#D9D9D9] mt-0.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <Outlet />
    </div>
  );
}

export default CompanyNav;