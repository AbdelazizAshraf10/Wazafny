import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logoVodafone from "../../../assets/vodafone.png";
import logoBlink22 from "../../../assets/blink22.png";
import logoIBM from "../../../assets/ibm.png";

// Fallback logo mapping based on company name
const getFallbackLogo = (companyName) => {
  switch (companyName) {
    case "Blink22":
      return logoBlink22;
    case "Vodafone Egypt":
      return logoVodafone;
    case "IBM":
      return logoIBM;
    default:
      return logoVodafone; // Default fallback
  }
};

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve seeker_id and token from localStorage
  const seekerId = localStorage.getItem("seeker_id");
  const token = localStorage.getItem("token");

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!seekerId || !token) {
        setError("Missing seeker ID or token. Please log in again.");
        setLoading(false);
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://wazafny.online/api/show-notifications/${seekerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Notifications API Response:", response.data);

        if (response.status === 204 || !response.data.notifications) {
          setNotificationList([]);
        } else {
          // Map API response to the component's expected format
          const mappedNotifications = response.data.notifications.map((notif) => ({
            id: notif.notification_id,
            company: notif.company_name,
            role: extractRole(notif.message), // Extract role from message
            time: notif.time_ago,
            logo: notif.profile_img || getFallbackLogo(notif.company_name),
          }));
          setNotificationList(mappedNotifications);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          setError("No notifications found.");
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to load notifications. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [seekerId, token, navigate]);

  // Helper function to extract role from message (e.g., "posted a new job for : Kotlin Developer")
  const extractRole = (message) => {
    const match = message.match(/posted a new job for : (.+)/);
    return match ? match[1] : "Unknown Role";
  };

  // Function to remove a single notification by ID
  const handleDismiss = async (notificationId) => {
    if (!token) {
      setError("Missing token. Please log in again.");
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    try {
      await axios.delete(
        `https://wazafny.online/api/delete-notification/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Remove the notification from the state
      setNotificationList(notificationList.filter((notif) => notif.id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        setTimeout(() => navigate("/Login"), 2000);
      } else if (err.response?.status === 404) {
        setError("Notification not found.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to delete notification. Please try again later.");
      }
    }
  };

  // Function to clear all notifications
  const clearNotifications = async () => {
    if (!seekerId || !token) {
      setError("Missing seeker ID or token. Please log in again.");
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    try {
      await axios.delete(
        `https://wazafny.online/api/delete-all-notifications/${seekerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear all notifications from the state
      setNotificationList([]);
    } catch (err) {
      console.error("Error clearing notifications:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        setTimeout(() => navigate("/Login"), 2000);
      } else if (err.response?.status === 404) {
        setError("No notifications to clear.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to clear notifications. Please try again later.");
      }
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-full hover:bg-gray-200">
        <Bell className="w-7 h-8" style={{ fill: open ? "#201A23" : "none", stroke: "#201A23", strokeWidth: open ? "0" : "2" }} />
        {notificationList.length > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 text-xs bg-[#6A0DAD] opacity-75 text-white rounded-full flex items-center justify-center">
            {notificationList.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {open && (
        <div className="absolute right-4 mt-1 w-96 bg-white rounded-xl overflow-hidden border border-gray-300 z-50">
          <div className="p-5 flex justify-center">
            <h2 className="text-xl font-bold text-[#201A23]">My Notifications</h2>
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500 transition-all duration-300">
            {loading ? (
              <p className="p-6 text-center text-lg font-semibold text-gray-400">
                Loading notifications...
              </p>
            ) : error ? (
              <p className="p-6 text-center text-lg font-semibold text-red-500">
                {error}
              </p>
            ) : notificationList.length > 0 ? (
              notificationList.map(({ id, company, role, time, logo }) => (
                <div key={id} className="p-4 flex items-center space-x-4 border-b border-gray-200 last:border-none">
                  {/* Logo/Image */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full">
                    {logo ? (
                      <img
                        src={logo}
                        alt={`${company} Logo`}
                        className="w-10 h-10 rounded-md"
                        onError={(e) => (e.target.src = getFallbackLogo(company))}
                      />
                    ) : (
                      <span className="text-lg">📢</span>
                    )}
                  </div>

                  {/* Notification Details */}
                  <div className="flex-1">
                    <p className="text-black font-bold">{company}</p>
                    <p className="text-sm text-gray-600">
                      Posted new job for <span className="font-bold">{role}</span>
                    </p>
                  </div>

                  {/* Time */}
                  <span className="text-xs text-gray-500">{time}</span>

                  {/* Dismiss Button */}
                  <button onClick={() => handleDismiss(id)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="p-6 text-center text-lg font-semibold text-[#A1A1A1]">
                There are no notifications to show
              </p>
            )}
          </div>

          {/* Clear Button */}
          {notificationList.length > 0 && (
            <>
              <hr className="border-t border-gray-200" />
              <button onClick={clearNotifications} className="w-full p-3 text-center font-bold text-black hover:bg-gray-100">
                Clear
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Usage
const App = () => {
  return <NotificationDropdown />;
};

export default App;