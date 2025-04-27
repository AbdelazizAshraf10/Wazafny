import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserProfileDropdown = ({ isOpen, onToggle }) => {
  const [userData, setUserData] = useState({ userName: "Guest", profilePhoto: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve seeker_id, user_id, and token from localStorage
  const seekerId = localStorage.getItem("seeker_id");
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  // Fetch user personal info from API
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!seekerId || !token) {
        setError("Missing seeker ID or token. Please log in again.");
        setLoading(false);
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://wazafny.online/api/show-personal-info/${seekerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Personal Info API Response:", response.data);

        if (response.data && response.data.seeker_id) {
          const { first_name, last_name, profile_img } = response.data;
          setUserData({
            userName: `${first_name} ${last_name}`.trim() || "Guest",
            profilePhoto: profile_img || null,
          });
        } else {
          setUserData({ userName: "Guest", profilePhoto: null });
        }
      } catch (err) {
        console.error("Error fetching personal info:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          setError("User information not found.");
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to load user information. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [seekerId, token, navigate]);

  // Handle logout functionality
  const handleLogout = async () => {
    if (!userId || !token) {
      setError("Missing user ID or token. Please log in again.");
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    try {
      const response = await axios.post(
        "https://wazafny.online/api/logout",
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Logout API Response:", response.data);

      // Clear localStorage
      localStorage.removeItem("seeker_id");
      localStorage.removeItem("user_id");
      localStorage.removeItem("token");
      localStorage.removeItem("Role");

      // Redirect to login page
      navigate("/Login");
      onToggle(); // Close dropdown after navigation
    } catch (err) {
      console.error("Error logging out:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else if (err.response?.status === 400) {
        setError("Invalid request. Please try again.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to log out. Please try again later.");
      }

      // Clear localStorage and redirect even if the API fails (client-side logout)
      localStorage.removeItem("seeker_id");
      localStorage.removeItem("user_id");
      localStorage.removeItem("token");
      localStorage.removeItem("Role");
      navigate("/Login");
      onToggle(); // Close dropdown after navigation
    }
  };

  // Ensure userName is a string and provide a fallback
  const safeUserName = typeof userData.userName === "string" ? userData.userName : "Guest";
  const nameParts = safeUserName.split(" ").slice(0, 2).join(" ");
  const initials = safeUserName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Use fallback profile image if none is provided
  const profilePhoto = userData.profilePhoto;

  if (loading) {
    return (
      <button
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-lg font-bold"
        disabled
      >
        ...
      </button>
    );
  }

  if (error) {
    return (
      <button
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-lg font-bold"
        disabled
      >
        !
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-lg font-bold overflow-hidden"
        aria-label="Open profile menu"
      >
        {profilePhoto ? (
          <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-full" />
        ) : (
          initials
        )}
        {isOpen && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-purple-600 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-[#FFFFFF] text-xl font-bold overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                initials
              )}
            </div>
            <p className="mt-2 text-lg text-[#201A23] font-semibold">{nameParts}</p>
          </div>

          <div className="border-t border-gray-200">
            <Link
              to="/seeker/profile"
              onClick={() => onToggle()} // Close dropdown after navigation
            >
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
};

export default UserProfileDropdown;