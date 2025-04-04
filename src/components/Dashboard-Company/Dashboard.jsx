import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/wazafny.png";

// Icon imports
import homeActiveIcon from "../../assets/company/homeActiveIcon.svg";
import homeInactiveIcon from "../../assets/company/homeInactiveIcon.svg";
import jobPostActiveIcon from "../../assets/company/jobPostActiveIcon.svg";
import jobPostInactiveIcon from "../../assets/company/jobPostInactiveIcon.svg";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sync activeButton with current path
  const getCurrentPage = () => {
    if (location.pathname.includes("Jobpost")) return "jobposts";
    return "overview";
  };

  const [activeButton, setActiveButton] = useState(getCurrentPage());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setActiveButton(getCurrentPage());
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Menu */}
      <nav
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
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
              onClick={() => handleNavigation(buttonKey)}
              aria-label={buttonKey === "overview" ? "Overview" : "Job Posts"}
            >
              {/* Icon */}
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

              {/* Label */}
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
              isMenuOpen
                ? "bg-[#6A0DAD] text-white"
                : " hover:bg-[#6A0DAD] hover:text-white"
            } focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]`}
            onClick={() => alert("Post new job clicked!")}
            aria-label="Post New Job"
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-all duration-300 ${
                  isMenuOpen ? "w-6 h-6" : "w-8 h-10"
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

      {/* Main Content Outlet */}
      <main className="flex-1 p-6 overflow-y-auto transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
