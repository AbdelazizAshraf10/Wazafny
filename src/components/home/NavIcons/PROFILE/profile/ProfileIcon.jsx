import { useState } from "react";
import PropTypes from "prop-types"; // For prop validation
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";



import profile from "../../../../../assets/cow.png";
const UserProfileDropdown = ({ userName, profilePhoto }) => {
  const [open, setOpen] = useState(false);

  // Extract first name and second name
  const nameParts = userName.split(" ").slice(0, 2).join(" ");

  // Extract initials (first two characters) for fallback
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-lg font-bold overflow-hidden"
      >
        {profilePhoto ? (
          <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-full" />
        ) : (
          initials
        )}
        {open && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-purple-600 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="flex flex-col items-center p-4">
            {/* Profile Circle */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-[#FFFFFF] text-xl font-bold overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                initials
              )}
            </div>

            {/* ✅ Username is always displayed below the profile circle */}
            <p className="mt-2 text-lg text-[#201A23] font-semibold">{nameParts}</p>
          </div>

          <div className="border-t border-gray-200">
            <Link to="/profile">
              <button className="flex items-center w-full px-4 py-3 text-[#201A23] text-left hover:bg-gray-100">
                <User className="w-5 h-5 mr-3" />
                View Profile
              </button>
            </Link>

            <Link to="/">
              <button className="flex items-center w-full px-4 py-3 text-left text-[#201A23] hover:bg-red-100">
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Add PropTypes validation
UserProfileDropdown.propTypes = {
  userName: PropTypes.string.isRequired,
  profilePhoto: PropTypes.string,
};

// Example Usage
const App = () => {
  const userName = "Elsayed Elbadawy"; 
  const profilePhoto = profile; 
  const condition = true;
  return condition ? <UserProfileDropdown userName={userName} profilePhoto={profilePhoto} /> : null;
};

export default App;


