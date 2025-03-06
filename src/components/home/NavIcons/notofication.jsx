import { useState } from "react";
import { Bell, X } from "lucide-react";
import logo1 from "../../../assets/blink22.png";
import logo2 from "../../../assets/ibm.png";
import logo3 from "../../../assets/vodafone.png";

// Notifications List
const notifications = [
  { id: 1, company: "Vodafone Egypt", role: "Flutter", time: "22m", logo: logo3 },
  { id: 2, company: "Blink22", role: "Web Developer", time: "2d", logo: logo1 },
  { id: 3, company: "IBM", role: "Android Developer", time: "4d", logo: logo2 },
  
];

const NotificationDropdown = ({ notifications }) => {
  const [open, setOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([...notifications]);

  // Function to remove a single notification by ID
  const handleDismiss = (id) => {
    setNotificationList(notificationList.filter((notification) => notification.id !== id));
  };

  const clearNotifications = () => {
    setNotificationList([]);
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-full hover:bg-gray-200">
        <Bell className="w-7 h-8" style={{ fill: open ? "#201A23" : "none", stroke: "#201A23", strokeWidth: open ? "0" : "2" }} />
        {notificationList.length > 0 && (
          <span className="absolute top-0 right-0  h-4 w-4 text-xs bg-[#6A0DAD] opacity-75 text-white rounded-full flex items-center justify-center">
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
            {notificationList.length > 0 ? (
              notificationList.map(({ id, company, role, time, logo }) => (
                <div key={id} className="p-4 flex items-center space-x-4 border-b border-gray-200 last:border-none">
                  {/* Logo/Image */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full">
                    {logo ? <img src={logo} alt={`${company} Logo`} className="w-10 h-10 rounded-md" /> : <span className="text-lg">📢</span>}
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
  return <NotificationDropdown notifications={notifications} />;
};

export default App;






