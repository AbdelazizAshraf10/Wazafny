import  { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// --- Framer Motion Imports ---
import { motion, AnimatePresence } from "framer-motion";
// ---------------------------
import foodics from "../../../assets/seeker/foodics.png"; // Placeholder for Foodics logo
import vod from "../../../assets/seeker/vod.png"; // Placeholder for Vodafone logo
import blink22 from "../../../assets/seeker/blink.png"; // Placeholder for Blink22 logo
import trash from "../../../assets/seeker/trash1.svg"; // Placeholder for delete icon
import JobResModal from "./JobResModal"; // Assuming this component can handle animation internally or we wrap it
import EditAppModal from "./EditAppModal"; // Assuming this component can handle animation internally or we wrap it


// --- Animation Variants ---
const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05, // Stagger effect
      duration: 0.3,
      ease: "easeOut",
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};


// ------------------------

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

  const seekerId = localStorage.getItem("seeker_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      // ... (fetch logic remains the same)
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
          const mappedApplications = response.data.applications.map((app) => ({
            id: app.application_id,
            companyLogo: app.job.company.profile_img || getFallbackLogo(app.job.company.company_name),
            companyName: app.job.company.company_name,
            jobTitle: app.job.job_title,
            location: `${app.job.job_city}, ${app.job.job_country} (${app.job.job_type}/${app.job.job_time})`,
            status: app.status,
            time: app.time_ago,
            response: app.response || null,
          }));
          setApplications(mappedApplications);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          // Don't set error if 404, just show empty list
           setApplications([]);
          // setError("No applications found for this seeker.");
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

  const getFallbackLogo = (companyName) => {
      // ... (fallback logo logic remains the same)
     switch (companyName) {
      case "Blink22":
        return blink22;
      case "Vodafone Egypt":
        return vod;
      case "Foodics":
        return foodics;
      default:
        // You might want a generic placeholder logo here
        return "https://via.placeholder.com/150?text=Logo"; // Example generic placeholder
    }
  };

  const handleDelete = async (applicationId) => {
      // ... (delete logic remains the same)
      if (!token) {
        setMessage("Missing token. Please log in again.");
        setMessageType("error");
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }

      // Optimistic UI update (optional but good UX)
      const originalApplications = [...applications];
      setApplications(apps => apps.filter((app) => app.id !== applicationId));

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
        // No need to filter again if optimistic update worked
        setMessage("Application deleted successfully");
        setMessageType("success");
      } catch (err) {
        // Revert optimistic update on error
        setApplications(originalApplications);

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
    console.log("Selected App Response:", app.response);
    if (status === "Accepted" || status === "Rejected") {
      setIsJobResModalOpen(true);
    } else if (status === "Pending") {
      setIsEditAppModalOpen(true);
    }
  };

  const handleCloseJobResModal = () => {
    setIsJobResModalOpen(false);
    // No need to setSelectedApp(null) here if using AnimatePresence onExitComplete
  };

  const handleCloseEditAppModal = () => {
    setIsEditAppModalOpen(false);
     // No need to setSelectedApp(null) here if using AnimatePresence onExitComplete
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "All") return true;
    return app.status === activeTab;
  });

  // Use motion component for loading/error for consistency
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center p-6"
      >
        Loading applications...
      </motion.div>
    );
  }

  if (error && applications.length === 0) { // Only show error if no apps are loaded/available
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center text-red-500 p-6"
      >
        Error: {error}
      </motion.div>
    );
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
        <div className="flex gap-5 border-b border-gray-300 mb-5 relative"> {/* Added relative positioning */}
          {["All", "Accepted", "Pending", "Rejected"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 text-base sm:text-lg font-semibold relative transition-colors duration-300 ${ // Added relative and transition
                activeTab === tab
                  ? "text-gray-800"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
              {/* Animated Underline */}
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gray-800"
                  layoutId="underline" // Connects the underline across tabs
                  transition={{ type: "spring", stiffness: 300, damping: 25 }} // Smooth spring animation
                />
              )}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="border border-gray-300 rounded-lg overflow-hidden min-h-[200px]"> {/* Added min-height */}
          <AnimatePresence mode="wait"> {/* 'wait' ensures exit animation completes before enter */}
             {filteredApplications.length > 0 ? (
                // Use a key on the wrapping div that changes with the filter to trigger AnimatePresence correctly
                <motion.div key={activeTab}>
                    <AnimatePresence initial={false}>
                        {filteredApplications.map((app, index) => (
                        <motion.div
                            key={app.id} // Key is crucial for AnimatePresence
                            custom={index} // Pass index for stagger
                            layout 
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="group flex items-center p-4 sm:p-5 hover:bg-gray-50 border-b border-gray-300 last:border-b-0"
                        >
                            {/* --- Content remains the same --- */}
                            <div className="flex items-center w-[40%] sm:w-[30%]">
                                {/* Delete Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.1 }} // Simple hover scale
                                    whileTap={{ scale: 0.9 }}   // Simple tap scale
                                    className="flex justify-center w-8 sm:w-10 mr-2 sm:mr-4" // Added margin
                                >
                                    <img
                                    src={trash}
                                    alt="Delete Icon"
                                    className="w-4 sm:w-5 h-4 sm:h-5 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent row click if needed
                                        handleDelete(app.id);
                                    }}
                                    />
                                </motion.div>

                                {/* Company Logo */}
                                <div className="flex w-14 sm:w-16 md:w-20 lg:w-[90px]">
                                    <img
                                    src={app.companyLogo}
                                    alt={`${app.companyName} Logo`}
                                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-[70px] lg:h-[70px] rounded-xl sm:rounded-2xl object-contain" // Added object-contain
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
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent row click if needed
                                            handleActionClick(app.status, app);
                                        }}
                                        // Use Framer motion for hover opacity for better control if needed
                                        // Or stick with Tailwind's group-hover which is simpler here
                                        className="text-[#6A0DAD] text-xl sm:text-sm md:text-base lg:text-[17px] hover:underline opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        {getActionText(app.status)}
                                    </button>
                                    )}
                                </div>
                            </div>

                             {/* Status and Time */}
                            <div className="flex flex-col items-end text-right w-24 sm:w-28 md:w-32 lg:w-36 flex-shrink-0 ml-4"> {/* Added margin */}
                                <div className="text-xs sm:text-sm md:text-base lg:text-[15px] text-gray-600 mb-2 sm:mb-3">
                                    {app.time}
                                </div>
                                <div
                                    className={`text-sm sm:text-base md:text-lg lg:text-[20px] font-medium ${
                                    app.status === "Accepted"
                                        ? "text-green-500"
                                        : app.status === "Pending"
                                        ? "text-yellow-500"
                                        : "text-red-500"
                                    }`}
                                >
                                    {app.status}
                                </div>
                            </div>
                            {/* --- End of Content --- */}
                        </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
              // Animate the "No applications" message as well
              <motion.div
                key="no-apps" // Unique key for AnimatePresence
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 sm:p-5 text-center text-gray-600"
              >
                No applications found for this status.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    


      {/* Modals with Animation */}
      <AnimatePresence
         // Wait for exit animation before removing component from DOM
         mode="wait"
         // Reset selectedApp *after* the exit animation completes
         onExitComplete={() => setSelectedApp(null)}
      >
        {isJobResModalOpen && selectedApp && (
          // You might need to wrap JobResModal or add motion inside it
          // This example wraps the call
          <motion.div
            key="jobResModal"
            className="fixed inset-0 z-50 flex items-center justify-center" // Ensure modal positioning
            // variants={modalOverlayVariants} // Use variants for overlay fade
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* If JobResModal itself doesn't handle motion, wrap its content */}
            <JobResModal
               
                isOpen={isJobResModalOpen} // Keep passing isOpen
                onClose={handleCloseJobResModal}
                applicantName="Yousef Elsherif" // Replace with dynamic data if available
                jobTitle={selectedApp.jobTitle}
                companyName={selectedApp.companyName}
                startDate="2025-05-01" // Replace with dynamic data if available
                managerName="John Doe" // Replace with dynamic data if available
                officeLocation="Cairo Office" // Replace with dynamic data if available
                remoteDetails="(Remote Setup Details)" // Replace with dynamic data if available
                forms="employee handbook and forms" 
                yourName="Jane Smith" 
                yourPosition="HR Manager" 
                contactInfo="jane.smith@company.com" 
                response={selectedApp.response}
            />
           </motion.div>
        )}

        {isEditAppModalOpen && selectedApp && (
           // You might need to wrap EditAppModal or add motion inside it
           // This example wraps the call
          <motion.div
            key="editAppModal"
            className="fixed inset-0 z-50 flex items-center justify-center" // Ensure modal positioning
            // variants={modalOverlayVariants} // Use variants for overlay fade
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* If EditAppModal itself doesn't handle motion, wrap its content */}
            <EditAppModal
                
                isOpen={isEditAppModalOpen} 
                onClose={handleCloseEditAppModal}
                jobTitle={selectedApp.jobTitle}
                companyName={selectedApp.companyName}
                applicationId={selectedApp.id}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ViewApplications;