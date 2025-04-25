import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import foodics from "../../../assets/seeker/foodics.png"; // Placeholder for Foodics logo
import vod from "../../../assets/seeker/vod.png"; // Placeholder for Vodafone logo
import blink22 from "../../../assets/seeker/blink.png"; // Placeholder for Blink22 logo
import trash from "../../../assets/seeker/trash1.svg"; // Placeholder for delete icon
import JobResModal from "./JobResModal";
import EditAppModal from "./EditAppModal";
import { Message } from "../../CustomMessage/FloatMessage";

function ViewApplications() {
  const [activeTab, setActiveTab] = useState("All");
  const [isJobResModalOpen, setIsJobResModalOpen] = useState(false);
  const [isEditAppModalOpen, setIsEditAppModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const navigate = useNavigate();

  // Retrieve seeker_id and token from localStorage
  const seekerId = localStorage.getItem("seeker_id");
  const token = localStorage.getItem("token");

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      if (!seekerId || !token) {
        setError("Missing seeker ID or token. Please log in again.");
        setLoading(false);
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://wazafny.online/api/show-applications-seeker/${seekerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Applications API Response:", response.data);

        if (response.status === 204 || !response.data.applications) {
          setApplications([]);
        } else {
          // Map API response to the component's expected format
          const mappedApplications = response.data.applications.map((app) => ({
            id: app.application_id,
            companyLogo: app.job.company.profile_img || getFallbackLogo(app.job.company.company_name),
            companyName: app.job.company.company_name,
            jobTitle: app.job.job_title,
            location: `${app.job.job_city}, ${app.job.job_country} (${app.job.job_type}/${app.job.job_time})`,
            status: app.status,
            time: app.time_ago,
            response: app.response || null, // Include the response field
          }));
          setApplications(mappedApplications);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          setError("No applications found for this seeker.");
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to load applications. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [seekerId, token, navigate]);

  // Helper function to determine fallback logo based on company name
  const getFallbackLogo = (companyName) => {
    switch (companyName) {
      case "Blink22":
        return blink22;
      case "Vodafone Egypt":
        return vod;
      case "Foodics":
        return foodics;
      default:
        return vod; // Default fallback if company name doesn't match
    }
  };

  // Handle delete application
  const handleDelete = async (applicationId) => {
    if (!token) {
      setMessage("Missing token. Please log in again.");
      setMessageType("error");
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    try {
      await axios.delete(
        `https://wazafny.online/api/delete-application/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Remove the deleted application from the state
      setApplications(applications.filter((app) => app.id !== applicationId));
      setMessage("Application deleted successfully");
      setMessageType("success");
    } catch (err) {
      console.error("Error deleting application:", err);
      if (err.response?.status === 401) {
        setMessage("Unauthorized. Please log in again.");
        setMessageType("error");
        setTimeout(() => navigate("/Login"), 2000);
      } else if (err.response?.status === 404) {
        setMessage("Application not found.");
        setMessageType("error");
      } else if (err.response?.status === 500) {
        setMessage("Server error. Please try again later.");
        setMessageType("error");
      } else {
        setMessage("Failed to delete application. Please try again later.");
        setMessageType("error");
      }
    }
  };

  // Handle message close
  const handleMessageClose = () => {
    setMessage(null);
    setMessageType(null);
  };

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
    console.log("Selected App Response:", app.response); // Debug log
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

  if (loading) {
    return <div className="text-center p-6">Loading applications...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">Error: {error}</div>;
  }

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
                <div className="flex items-center w-[40%] sm:w-[30%]">
                  {/* Delete Icon */}
                  <div className="flex justify-center w-8 sm:w-10">
                    <img
                      src={trash}
                      alt="Delete Icon"
                      className="w-4 sm:w-5 h-4 sm:h-5 cursor-pointer"
                      onClick={() => handleDelete(app.id)}
                    />
                  </div>

                  {/* Company Logo */}
                  <div className="flex w-14 sm:w-16 md:w-20 lg:w-[90px]">
                    <img
                      src={app.companyLogo}
                      alt="Company Logo"
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-[70px] lg:h-[70px] rounded-xl sm:rounded-2xl"
                      onError={(e) => (e.target.src = getFallbackLogo(app.companyName))}
                    />
                  </div>

                  {/* Company Name */}
                  <div className="text-sm sm:text-base md:text-lg lg:text-[18px] text-gray-800 truncate flex-1 pr-4">
                    {app.companyName}
                  </div>
                </div>

                <div className="flex justify-end items-center w-[60%] sm:w-[70%]">
                  {/* Job Details */}
                  <div className="flex-1 min-w-0 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px]">
                    <div className="text-xs ml-9 sm:text-sm md:text-base lg:text-[15px]">
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

      {/* Floating Message */}
      {/* <Message
        message={message}
        type={messageType}
        onClose={handleMessageClose}
        duration={3000}
      /> */}

      {/* Job Response Modal */}
      {selectedApp && (
        <JobResModal
          isOpen={isJobResModalOpen}
          onClose={handleCloseJobResModal}
          applicantName="Yousef Elsherif"
          jobTitle={selectedApp.jobTitle}
          companyName={selectedApp.companyName}
          startDate="2025-05-01"
          managerName="John Doe"
          officeLocation="Cairo Office"
          remoteDetails="(Remote Setup Details)"
          forms="employee handbook and forms"
          yourName="Jane Smith"
          yourPosition="HR Manager"
          contactInfo="jane.smith@company.com"
          response={selectedApp.response}
        />
      )}

      {/* Edit Application Modal */}
      {selectedApp && (
        <EditAppModal
          isOpen={isEditAppModalOpen}
          onClose={handleCloseEditAppModal}
          jobTitle={selectedApp.jobTitle}
          companyName={selectedApp.companyName}
          applicationId={selectedApp.id} // Pass application_id
        />
      )}
    </div>
  );
}

export default ViewApplications;