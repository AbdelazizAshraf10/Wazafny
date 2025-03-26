import { useState } from "react";
import logo from "../../assets/wazafny.png";
import DashboardContent from "./dashboard-content";
import Jobpost from "./jobpost";

// Icon imports
import homeActiveIcon from "../../assets/company/homeActiveIcon.svg";
import homeInactiveIcon from "../../assets/company/homeInactiveIcon.svg";
import jobPostActiveIcon from "../../assets/company/jobPostActiveIcon.svg";
import jobPostInactiveIcon from "../../assets/company/jobPostInactiveIcon.svg";

function Dashboard() {
  // State to track the active button
  const [activeButton, setActiveButton] = useState("overview");

  // State to toggle the side menu open/close
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Start with the menu closed

  // Mapping of button states to icons
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

  

  // Helper function to handle image loading errors
  const handleImageError = (event) => {
    event.target.src = "../../assets/default-icon.png"; // Fallback icon
    event.target.alt = "Default Icon";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Menu */}
      <nav
        onMouseEnter={() => setIsMenuOpen(true)} // Open menu on hover
        onMouseLeave={() => setIsMenuOpen(false)} // Close menu when cursor leaves
        className={`bg-white shadow-lg p-4 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isMenuOpen ? "w-60" : " md:w-20"
        }`}
      >
        {/* Logo */}
        <div className="mt-6 flex justify-center">
          <img
            src={logo}
            alt="Wazafny Logo"
            className={`w-30 transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-8 mt-20">
          {["overview", "jobposts"].map((buttonKey) => (
            <button
              key={buttonKey}
              className={`w-full py-3 px-4 rounded-md flex items-center font-bold transition-all duration-300 ${
                activeButton === buttonKey
                  ? "bg-[#F2E9FF] text-[#6A0DAD]"
                  : "hover:bg-gray-100 hover:text-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]`}
              onClick={() => setActiveButton(buttonKey)}
              aria-label={buttonKey === "overview" ? "Overview" : "Job Posts"}
            >
              {/* Icon - Centered & Sized Correctly */}
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10">
                <img
                  src={
                    activeButton === buttonKey
                      ? buttonIcons[buttonKey].active
                      : buttonIcons[buttonKey].inactive
                  }
                  alt={`${buttonKey} icon`}
                  className={`transition-all duration-300 ${
                    isMenuOpen ? "w-6 h-6" : "w-8 h-8 mr-5"
                  }`}
                  onError={handleImageError}
                />
              </div>

              {/* Text - Only Visible When Sidebar is Open */}
              <span
                className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${
                  isMenuOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {buttonKey.charAt(0).toUpperCase() + buttonKey.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Post New Job Button */}
        <div className="mt-auto">
          <button
            className={`w-full py-3 px-4 font-bold rounded-md flex items-center transition-all duration-300 ${
              activeButton === "post-job"
                ? "bg-[#6A0DAD] text-white"
                :isMenuOpen
                ? "bg-[#6A0DAD] text-white"
                : " hover:bg-[#6A0DAD] hover:text-white"
            } focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]`}
            onClick={() => alert("Post new job clicked!")}
            aria-label="Post New Job"
          >
            {/* Icon - Always Visible */}
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-6 h-6 transition-all duration-300 ${
                  isMenuOpen ? "w-6 h-6" : "w-10 h-10" // Increase size when collapsed
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>

            {/* Text - Only Visible When Sidebar is Open */}
            <span
              className={`ml-3 transition-opacity duration-300 ${
                isMenuOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              Post New Job
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto transition-all duration-300">
        {activeButton === "overview" ? <DashboardContent /> : <Jobpost />}
      </main>
    </div>
  );
}

export default Dashboard;
