import React, { useState } from "react";
import foodics from "../../../assets/seeker/foodics.png"; // Placeholder for Foodics logo
import vod from "../../../assets/seeker/vod.png"; // Placeholder for Vodafone logo
import blink22 from "../../../assets/seeker/blink.png"; // Placeholder for Blink22 logo
import trash from "../../../assets/seeker/trash1.svg"; // Placeholder for delete icon
import JobResModal from "./JobResModal";
import EditAppModal from "./EditAppModal";

function ViewApplications() {
  const [activeTab, setActiveTab] = useState("All");
  const [isJobResModalOpen, setIsJobResModalOpen] = useState(false);
  const [isEditAppModalOpen, setIsEditAppModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const applications = [
    {
      id: 1,
      companyLogo: foodics,
      companyName: "Foodics",
      jobTitle: "Flutter Mobile App Developer",
      location: "Cairo, Egypt (REMOTE/Full-time)",
      status: "Accepted",
      time: "2d",
    },
    {
      id: 2,
      companyLogo: vod,
      companyName: "Vodafone Egypt",
      jobTitle: "Flutter Mobile App Developer",
      location: "Egypt (Remote)",
      status: "Pending",
      time: "4d",
    },
    {
      id: 3,
      companyLogo: blink22,
      companyName: "Blink22",
      jobTitle: "Mobile Software Engineer",
      location: "Cairo, Egypt (REMOTE)",
      status: "Rejected",
      time: "1w",
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getActionText = (status) => {
    if (status === "Accepted" || status === "Rejected")
      return "View App Response";
    if (status === "Pending") return "Edit your application";
    return "";
  };

  const handleActionClick = (status, app) => {
    setSelectedApp(app);
    if (status === "Accepted" || status === "Rejected") {
      setIsJobResModalOpen(true);
    } else if (status === "Pending") {
      setIsEditAppModalOpen(true);
    }
  };

  const handleCloseJobResModal = () => {
    setIsJobResModalOpen(false);
    setSelectedApp(null);
  };

  const handleCloseEditAppModal = () => {
    setIsEditAppModalOpen(false);
    setSelectedApp(null);
  };

  // Filter applications based on the active tab
  const filteredApplications = applications.filter((app) => {
    if (activeTab === "All") return true;
    return app.status === activeTab;
  });

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <div className="px-5 sm:px-[5%] md:px-[10%] lg:px-[15%] py-10 w-full box-border">
        {/* Heading */}
        <div className="mb-5">
          <span className="text-2xl sm:text-2xl md:text-3xl lg:text-[25px] font-black text-gray-800">
            My Applications
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-5 border-b border-gray-300 mb-5">
          {["All", "Accepted", "Pending", "Rejected"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 text-base sm:text-lg font-semibold ${
                activeTab === tab
                  ? "text-gray-800 border-b-2 border-gray-800"
                  : "text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app, index) => (
              <div
                key={app.id}
                className="group flex items-center p-4 sm:p-5 hover:bg-gray-50 border-b border-gray-300 last:border-b-0"
              >
                <div className="flex items-center">
                  {/* Delete Icon */}
                  <div className="flex justify-center w-8 gap-4 sm:w-10">
                    <img
                      src={trash}
                      alt="Delete Icon"
                      className="w-4 sm:w-5 h-4 sm:h-5 cursor-pointer"
                    />
                  </div>

                  {/* Company Logo */}
                  <div className="flex w-14 sm:w-16 md:w-20 lg:w-[90px]">
                    <img
                      src={app.companyLogo}
                      alt="Company Logo"
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-[70px] lg:h-[70px] rounded-xl sm:rounded-2xl"
                    />
                  </div>

                  <div className="text-sm sm:text-base md:text-lg lg:text-[18px] text-gray-800 truncate">
                    {app.companyName}
                  </div>
                </div>

                <div className="flex justify-end items-center w-full">
                  {/* Company and Job Details */}
                  <div className="flex-1 min-w-0 sm:ml-4 mr-40 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px]">
                    <div className="text-xs sm:text-sm md:text-base lg:text-[15px]">
                      <div className="font-semibold text-gray-800 truncate">
                        {app.jobTitle}
                      </div>
                      <div className="text-gray-600 mt-1 sm:mt-2 truncate">
                        {app.location}
                      </div>
                    </div>
                  </div>

                  {/* Action Link (Visible on Hover) */}
                  <div className="w-32 sm:w-40 text-left">
                    {getActionText(app.status) && (
                      <button
                        onClick={() => handleActionClick(app.status, app)}
                        className="text-[#6A0DAD] text-xl sm:text-sm md:text-base lg:text-[17px] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {getActionText(app.status)}
                      </button>
                    )}
                  </div>
                </div>

                {/* Status and Time */}
                <div className="flex flex-col items-end text-right w-24 sm:w-28 md:w-32 lg:w-36 flex-shrink-0">
                  <div className="text-xs sm:text-sm md:text-base lg:text-[15px] text-gray-600 mb-2 sm:mb-3">
                    {app.time}
                  </div>
                  <div
                    className={`text-sm sm:text-base md:text-lg lg:text-[20px] font-medium ${
                      app.status === "Accepted"
                        ? "text-green-700"
                        : app.status === "Pending"
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {app.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 sm:p-5 text-center text-gray-600">
              No applications found for this status.
            </div>
          )}
        </div>
      </div>

      {/* Job Response Modal */}
      {selectedApp && (
        <JobResModal
          isOpen={isJobResModalOpen}
          onClose={handleCloseJobResModal}
          applicantName="Yousef Elsherif" // Replace with actual data
          jobTitle={selectedApp.jobTitle}
          companyName={selectedApp.companyName}
          startDate="2025-05-01" // Replace with actual data
          managerName="John Doe" // Replace with actual data
          officeLocation="Cairo Office" // Replace with actual data
          remoteDetails="(Remote Setup Details)" // Replace with actual data
          forms="employee handbook and forms" // Replace with actual data
          yourName="Jane Smith" // Replace with actual data
          yourPosition="HR Manager" // Replace with actual data
          contactInfo="jane.smith@company.com" // Replace with actual data
        />
      )}

      {/* Edit Application Modal */}
      {selectedApp && (
        <EditAppModal
          isOpen={isEditAppModalOpen}
          onClose={handleCloseEditAppModal}
          jobTitle={selectedApp.jobTitle}
          companyName={selectedApp.companyName}
        />
      )}
    </div>
  );
}

export default ViewApplications;