import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import logo from "../../assets/wazafny.png";

// Icon imports
import homeActiveIcon from "../../assets/company/homeActiveIcon.svg";
import homeInactiveIcon from "../../assets/company/homeInactiveIcon.svg";
import jobPostActiveIcon from "../../assets/company/jobPostActiveIcon.svg";
import jobPostInactiveIcon from "../../assets/company/jobPostInactiveIcon.svg";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeButton, setActiveButton] = useState("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPostingJob, setIsPostingJob] = useState(false);

  // Determine current page from path
  const getCurrentPage = () => {
    if (location.pathname.includes("Jobpost")) return "jobposts";
    return "overview";
  };

  useEffect(() => {
    const currentPage = getCurrentPage();
    setActiveButton(currentPage);

    if (location.pathname.includes("/Dashboard/Jobpost/")) {
      setIsPostingJob(true);
    } else {
      setIsPostingJob(false);
    }
  }, [location.pathname]);

  const buttonIcons = {
    overview: {
      active: homeActiveIcon,
      inactive: homeInactiveIcon,
    },
    jobposts: {
      active: jobPostActiveIcon,
      inactive: jobPostInactiveIcon,
    },
  };

  const handleImageError = (event) => {
    event.target.src = "../../assets/default-icon.png";
    event.target.alt = "Default Icon";
  };

  const handleNavigation = (buttonKey) => {
    setActiveButton(buttonKey);
    if (buttonKey === "overview") {
      navigate("/Dashboard/Overview");
    } else if (buttonKey === "jobposts") {
      navigate("/Dashboard/Jobpost");
    }
  };

  // Define job steps
  const jobSteps = ["Basic Info", "Skills", "Extra Sections", "Questions", "Preview"];

  // Track the current step index
  const getCurrentStepIndex = () => {
    const stepPaths = ["basic-info", "skills", "extra-sections", "questions", "preview"];
    const currentPath = location.pathname.split("/").pop();
    return stepPaths.indexOf(currentPath);
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(getCurrentStepIndex());

  useEffect(() => {
    setCurrentStepIndex(getCurrentStepIndex());
  }, [location.pathname]);

  // Animation variants
  const sidebarVariants = {
    open: { width: "15rem" }, // 240px
    closed: { width: "5rem" }, // 80px
  };

  const buttonVariants = {
    rest: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, opacity: 0.9 },
    active: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const postButtonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.nav
        variants={sidebarVariants}
        initial="closed"
        animate={isPostingJob || isMenuOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => !isPostingJob && setIsMenuOpen(true)}
        onMouseLeave={() => !isPostingJob && setIsMenuOpen(false)}
        className={`bg-white shadow-lg p-4 flex flex-col justify-between`}
      >
        {/* Logo */}
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isMenuOpen || isPostingJob ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <img src={logo} alt="Wazafny Logo" className="w-30" />
        </motion.div>

        {/* Navigation Buttons */}
        {!isPostingJob && (
          <div className="space-y-8 mt-20">
            {["overview", "jobposts"].map((buttonKey) => (
              <motion.button
                key={buttonKey}
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="active"
                className={`w-full py-3 px-4 rounded-md flex items-center font-bold ${
                  activeButton === buttonKey
                    ? "bg-[#F2E9FF] text-[#6A0DAD]"
                    : "hover:bg-gray-100 hover:text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]`}
                onClick={() => handleNavigation(buttonKey)}
                aria-label={buttonKey === "overview" ? "Overview" : "Job Posts"}
              >
                {/* Icon */}
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10">
                  <motion.img
                    src={
                      activeButton === buttonKey
                        ? buttonIcons[buttonKey].active
                        : buttonIcons[buttonKey].inactive
                    }
                    alt={`${buttonKey} icon`}
                    className={`${
                      isMenuOpen ? "w-6 h-6" : "w-8 h-8 mr-5"
                    }`}
                    onError={handleImageError}
                    initial={{ scale: 1 }}
                    animate={{ scale: activeButton === buttonKey ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                {/* Label */}
                <motion.span
                  className={`ml-3 whitespace-nowrap`}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{
                    opacity: isMenuOpen ? 1 : 0,
                    width: isMenuOpen ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {buttonKey.charAt(0).toUpperCase() + buttonKey.slice(1)}
                </motion.span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Timeline Navigation */}
        {isPostingJob && (
          <div className="flex-grow flex items-center justify-center mt-[-180px]">
            <div className="relative">
              {/* Full Vertical Line (Uncompleted Portion) */}
              <motion.div
                className="absolute left-0 top-0 h-[275px] ml-3 border-l-4 rounded-xl"
                style={{ borderColor: "#B37FFF" }}
                initial={{ height: 0 }}
                animate={{ height: 275 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              {/* Dynamic Vertical Line (Completed Portion) */}
              <motion.div
                className="absolute left-0 top-0 border-l-4 ml-3 rounded-xl"
                style={{ borderColor: "#6A0DAD" }}
                initial={{ height: 0 }}
                animate={{
                  height: `${((currentStepIndex + 1) / jobSteps.length) * 275}px`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              {/* Steps */}
              <div className="flex flex-col space-y-10 pl-9">
                {jobSteps.map((step, idx) => (
                  <motion.div
                    key={step}
                    className="flex items-center"
                    custom={idx}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <p
                      className={`text-[#6A0DAD] font-bold font-sans ${
                        idx <= currentStepIndex ? "font-extrabold" : "opacity-60"
                      }`}
                    >
                      {step.toUpperCase()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Post New Job Button */}
        {!isPostingJob && (
          <div className="mt-auto">
            <motion.button
              variants={postButtonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={`w-full py-3 px-4 font-bold rounded-md flex items-center ${
                isMenuOpen
                  ? "bg-[#6A0DAD] text-white"
                  : "hover:bg-[#6A0DAD] hover:text-white"
              } focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]`}
              onClick={() => {
                setIsPostingJob(true);
                navigate("/Dashboard/Jobpost/basic-info");
              }}
              aria-label="Post New Job"
            >
              <div className="flex items-center justify-center">
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${isMenuOpen ? "w-6 h-6" : "w-8 h-10"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </motion.svg>
              </div>
              <motion.span
                className={`ml-3`}
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: isMenuOpen ? 1 : 0,
                  width: isMenuOpen ? "auto" : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                Post New Job
              </motion.span>
            </motion.button>
          </div>
        )}
      </motion.nav>

      {/* Main Content */}
      <motion.main
        className="flex-1 p-6 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}

export default Dashboard;