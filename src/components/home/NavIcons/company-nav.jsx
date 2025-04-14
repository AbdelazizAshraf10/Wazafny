import logo from "../../../assets/wazafny.png";
import { useState } from "react";
import NotificationDropdown from "./notofication";
import UserProfileDropdown from "./PROFILE/profile/ProfileIcon";
import Application from "./Application";
import Home from "../homee/Home";

function CompanyNav() {
  const [activeTab, setActiveTab] = useState("Jobs"); // Default active tab

  return (
    <div>
      <div className="flex justify-between items-center px-5 mt-2">
        {/* Logo on the left */}
        <div className="flex items-center ml-20">
          <img src={logo} alt="logo" />
        </div>

        {/* Job and company select in the middle */}
        <div className="flex items-center gap-x-40 text-2xl font-bold mt-3 ml-4">
          <button
            onClick={() => setActiveTab("Jobs")}
            className={`relative pb-2 ${
              activeTab === "Jobs"
                ? "text-[#6A0DAD] font-bold after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[4px] after:bg-[#6A0DAD]"
                : "text-[#201A23] hover:text-[#6A0DAD]"
            }`}
          >
            Jobs
          </button>

          <button
            onClick={() => setActiveTab("Company")}
            className={`relative pb-2 ${
              activeTab === "Company"
                ? "text-[#6A0DAD] font-bold after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[4px] after:bg-[#6A0DAD]"
                : "text-[#201A23] hover:text-[#6A0DAD]"
            }`}
          >
            Company
          </button>
        </div>

        {/* Icons on the right */}
        <div className="flex items-center space-x-8">
          {/* Application List Icon */}
          <div className="relative">
            <Application />
          </div>

          {/* Notification Icon with Badge */}
          <div className="relative">
            <NotificationDropdown />
          </div>

          {/* Profile Icon with Verification Badge */}
          <div className="relative bg-[#6A0DAD] text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold">
            <UserProfileDropdown />
          </div>
        </div>
      </div>

      <hr className="border border-[#D9D9D9] mt-0.5" />

      {/* Conditionally render Home component when activeTab is "Jobs" */}
      {activeTab === "Jobs" && <Home />}
    </div>
  );
}

export default CompanyNav;