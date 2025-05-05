import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import axios from "axios";

function HeaderCompany() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [companyName, setCompanyName] = useState("Loading...");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [error, setError] = useState(null);
  const [sucessce, setsucessce] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Helper: Extract initials from company name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2); // Only first 2 initials
  };

  // Fetch company profile
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("company_id");

      try {
        const response = await axios.get(
          `https://laravel.wazafny.online/api/show-company-profile/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const { company_name, profile_img } = response.data;

        setCompanyName(company_name);
        setProfilePhoto(profile_img); // empty string is fine if there's no image

        localStorage.setItem("company_name", company_name);
        localStorage.setItem("Profile_img", profile_img);
      } catch (error) {
        console.error("Error fetching company profile:", error);
        if (error.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          navigate("/LoginCompany");
        } else if (error.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to fetch company profile.");
        }
      }
    };

    fetchCompanyProfile();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Missing token. Please log in again.");
      setTimeout(() => navigate("/LoginCompany"), 2000);
      return;
    }

    if (!userId) {
      setError("Missing user ID. Please log in again.");
      setTimeout(() => navigate("/LoginCompany"), 2000);
      return;
    }

    try {
      await axios.post(
        "https://laravel.wazafny.online/api/logout",
        { user_id: parseInt(userId) }, // Send user_id in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("company_id");
      localStorage.removeItem("company_name");
      localStorage.removeItem("Profile_img");

      // Redirect to login page
      setsucessce("Logout successful.");
      setTimeout(() => navigate("/LoginCompany"), 1000);
    } catch (error) {
      console.error("Error logging out:", error);
      if (error.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        navigate("/LoginCompany");
      } else if (error.response?.status === 500) {
        console.log("Server error. Please try again later.");
      } else if (error.response?.status === 404) {
        console.log("User not found. Please log in again.");
      } else {
        setError("Failed to log out. Please try again.");
      }
      setTimeout(() => {
        setError(null);
        navigate("/LoginCompany");
      }, 2000);
    }
  };

  const initials = getInitials(companyName);

  return (
    <div className="relative flex items-center justify-between">
      {/* Error message */}
      {error && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-md">
          {error}
        </div>
      )}

      {/* sucessce message */}
      {sucessce && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-md shadow-md">
          {sucessce}
        </div>
      )}

      {/* Welcome message and company name */}
      <div className="items-center">
        <h6 className="font-bold">Welcome</h6>
        <span className="text-2xl font-extrabold text-[#201A23]">
          {companyName}
        </span>
      </div>

      {/* User profile icon */}
      <div className="mt-2">
        <button
          onClick={toggleDropdown}
          className="dropdown-button relative w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-lg font-bold overflow-hidden"
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{initials}</span>
          )}
          {isDropdownOpen && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-purple-600 rounded-full border-2 border-white"></span>
          )}
        </button>
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute top-12 right-2 mt-1 w-60 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-[#FFFFFF] text-xl font-bold overflow-hidden">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <p className="mt-2 text-lg text-[#201A23] font-semibold">
              {companyName}
            </p>
          </div>

          <div className="border-t border-gray-200">
            <Link to="/Dashboard/profile-company">
              <button className="flex items-center w-full px-4 py-3 text-[#201A23] text-left hover:bg-gray-100">
                <User className="w-5 h-5 mr-3" />
                View Profile
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-left text-[#201A23] hover:bg-red-100"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderCompany;
