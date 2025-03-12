import { useState } from "react";
import logo from "../../assets/wazafny.png";



import DashboardContent from "./dashboard-content";

// Icon imports
import homeActiveIcon from "../../assets/home-active.png";
import homeInactiveIcon from "../../assets/home-noActive.png";
import jobPostActiveIcon from "../../assets/job-post-active.png";
import jobPostInactiveIcon from "../../assets/job-post-not-active.png";

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
          isMenuOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="space-y-12">
          <div className="mt-12 flex justify-center">
            <img
              src={logo}
              alt="Wazafny Logo"
              className={`w-30 transition-opacity duration-300 ${
                isMenuOpen ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-6 text-[#A3A1A1]">
            {["overview", "jobposts"].map((buttonKey) => (
              <button
                key={buttonKey}
                className={`w-full py-3 px-4 rounded-md text-left flex items-center font-bold transition-all duration-300 ${
                  activeButton === buttonKey
                    ? "bg-white text-[#6A0DAD]"
                    : isMenuOpen
                    ? "hover:bg-[#F2E9FF] hover:text-[#A3A1A1]"
                    : ""
                }`}
                onClick={() => setActiveButton(buttonKey)}
                aria-label={buttonKey === "overview" ? "Overview" : "Job Posts"}
              >
                {/* Icon Wrapper - Always Visible */}
                <div className="w-8 h-8 flex items-center justify-center">
                  <img
                    src={
                      activeButton === buttonKey
                        ? buttonIcons[buttonKey].active
                        : buttonIcons[buttonKey].inactive
                    }
                    alt={`${buttonKey} icon`}
                    className="w-6 h-6"
                    onError={handleImageError}
                  />
                </div>

                {/* Text - Only Visible When Sidebar is Open */}
                <span
                  className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${
                    isMenuOpen ? "opacity-100" : "opacity-0 w-0"
                  }`}
                >
                  {buttonKey.charAt(0).toUpperCase() + buttonKey.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Post New Job Button */}
        <div className="mt-4">
          <button
            className={`w-full py-3 px-2 font-bold rounded-md transition-all duration-300 ${
              isMenuOpen ? "bg-[#6A0DAD] text-white" : "bg-white text-gray-500"
            }`}
            onClick={() => alert("Post new job clicked!")}
            aria-label="Post New Job"
          >
            <span
              className={`transition-opacity duration-300 ${
                isMenuOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Post New Job
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto transition-all duration-300">
        
        {activeButton === "overview" ? <DashboardContent /> : "Job Posts"}
        
        
      </main>
    </div>
  );
}

export default Dashboard;
