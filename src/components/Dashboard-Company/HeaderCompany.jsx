import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { User, LogOut } from "lucide-react"; // Import icons (replace with your preferred icon library)

function HeaderCompany() {
  // State to manage the visibility of the dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State to manage the profile photo dynamically
  const [profilePhoto, setProfilePhoto] = useState(
    "https://via.placeholder.com/150" // Initial placeholder image
  );

  // Example data (replace with actual props or context)
  const initials = "VE"; // Replace with actual initials
  const nameParts = "Vodafone Egypt"; // Replace with actual username

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  

  

   
  return (
    <div className="relative flex items-center justify-between">
      {/* Welcome message and company name */}
      <div className="items-center">
        <h6 className=" font-bold">Welcome</h6>
        <span className="text-2xl font-extrabold text-[#201A23]">{nameParts}</span>
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
            initials
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
            {/* Profile Circle */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-[#FFFFFF] text-xl font-bold overflow-hidden">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                initials
              )}
            </div>

            {/* Username */}
            <p className="mt-2 text-lg text-[#201A23] font-semibold">
              {nameParts}
            </p>
          </div>

          <div className="border-t border-gray-200">
            <Link to="/profile">
              <button className="flex items-center w-full px-4 py-3 text-[#201A23] text-left hover:bg-gray-100">
                <User className="w-5 h-5 mr-3" />
                View Profile
              </button>
            </Link>

            <Link to="/LoginCompany">
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
}

export default HeaderCompany;