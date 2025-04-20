import React, { useState, useEffect } from "react";
import profile from "../../../assets/seeker/profile-banner.png";
import follow from "../../../assets/seeker/follow.png";
import vod from "../../../assets/seeker/vod.png";
import email from "../../../assets/seeker/email.svg";
import CompanyAbout from "./CompanyAbout";
import CompanyPost from "./CompanyPost";
function CompanyOverview() {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // This effect can be used to perform actions when the active tab changes.
    // For now, it's just setting the initial tab to 'overview' which is already handled by useState.
    // You can add additional logic here if needed, e.g., fetching data for the active tab.
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="px-8 sm:px-10 md:px-20 lg:px-[16%] py-24">
      {/* Company Info Container */}
      <div className="bg-white border border-[#D9D9D9] rounded-2xl">
        {/* Banner Image */}
        <div className="w-full h-48 overflow-hidden rounded-t-2xl">
          <img
            src={profile}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between mx-5 items-start sm:items-center p-2 sm:p-8">
          {/* Company Logo and Details */}
          <div className="">
            <div className="">
              <img
                src={vod}
                alt="Company Logo"
                className="w-24 h-24 rounded-2xl sm:-mt-20 object-cover"
              />
              <div className="my-4">
                <h4 className="text-2xl sm:text-3xl font-bold ">
                  Vodafone Egypt
                </h4>
                <span className="flex items-center font- text-[#201A23] text-sm sm:text-base">
                  <a
                    href="https://www.vodafone.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Together We Can
                  </a>
                </span>
                <div className="flex gap-1">
                  <span className=" items-center font-bold text-purple-700 text-sm sm:text-base">
                    <a
                      href="https://www.vodafone.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      http://www.vodafone.com/
                    </a>
                  </span>
                  <img src={email} alt="Email Icon" className="w-5 h-5 ml-1" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center ">
                <div className="flex items-center">
                  <span className="text-purple-700 font-semibold text-sm sm:text-base">
                    Email
                  </span>
                  <img src={email} alt="Email Icon" className="w-5 h-5 ml-1" />
                </div>
              </div>
              <div className="flex flex-col font-bold text-lg items-center">
                <p className="sm:text-base">6.9K</p>
                <span className="text-gray-600">Followers</span>
              </div>
              <div className="flex flex-col items-center font-bold text-lg">
                <p className="sm:text-base">46</p>
                <span className="text-gray-600">Jobs</span>
              </div>
            </div>
          </div>

          {/* Follow and Share Buttons */}
          <div className="flex items-center gap-2 mr-4 sm:mt-0">
            <button className="bg-black text-white px-6 py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-800">
              Follow
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-t-2 border-b-2 space-x-16 border-[#D9D9D9]">
          <button
            className={`text-xl font-bold px-5 py-2 ${
              activeTab === "overview"
                ? "border-b-4 border-purple-700"
                : "hover:border-b-4 hover:border-purple-700"
            }`}
            onClick={() => handleTabChange("overview")}
          >
            Overview
          </button>
          <button
            className={`text-xl font-bold px-10 py-2 ${
              activeTab === "posts"
                ? "border-b-4 border-purple-700"
                : "hover:border-b-4 hover:border-purple-700"
            }`}
            onClick={() => handleTabChange("posts")}
          >
            Posts
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-8">
          {activeTab === "overview" && <CompanyAbout />}
          {activeTab === "posts" && <CompanyPost />}
          
        </div>
      </div>
    </div>
  );
}

export default CompanyOverview;
