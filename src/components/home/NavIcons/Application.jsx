import { useState, useEffect } from "react";
import { ScrollText } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logoVodafone from "../../../assets/vodafone.png";
import logoBlink22 from "../../../assets/blink22.png";

// Fallback logo mapping based on company name
const getFallbackLogo = (companyName) => {
  switch (companyName) {
    case "Blink22":
      return logoBlink22;
    case "Vodafone Egypt":
      return logoVodafone;
    default:
      return logoVodafone; // Default fallback
  }
};

const JobApplicationDropdown = ({ isOpen, onToggle }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve seeker_id and token from localStorage
  const seekerId = localStorage.getItem("seeker_id");
  const token = localStorage.getItem("token");

  // Fetch latest applications from API
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
          `https://wazafny.online/api/show-lastest-application-seeker/${seekerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Latest Applications API Response:", response.data);

        if (response.status === 204 || !response.data.applications) {
          setApplications([]);
        } else {
          // Map API response to the component's expected format
          const mappedApplications = response.data.applications.map((app) => ({
            id: app.application_id,
            company: app.job.company.company_name,
            position: app.job.job_title,
            location: `${app.job.job_city}, ${app.job.job_country} (${app.job.job_type})`,
            status: app.status,
            daysAgo: app.time_ago, // Use time_ago directly
            logo: app.job.company.profile_img || getFallbackLogo(app.job.company.company_name),
          }));
          setApplications(mappedApplications);
        }
      } catch (err) {
        console.error("Error fetching latest applications:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          setTimeout(() => navigate("/Login"), 2000);
        } else if (err.response?.status === 404) {
          setError("No applications found.");
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

  return (
    <div className="relative">
      {/* Briefcase Icon */}
      <button
        onClick={onToggle}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <ScrollText
          className="w-7 h-8"
          style={{
            fill: isOpen ? "black" : "none",
            stroke: "black",
            strokeWidth: isOpen ? 0 : 2,
          }}
        />
      </button>

      {/* Application Panel */}
      {isOpen && (
        <div className="absolute right-4 mt-2 w-96 bg-white rounded-xl border border-gray-300 shadow-lg z-50">
          <div className="p-5 flex justify-center border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#201A23]">
              My Applications
            </h2>
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {loading ? (
              <p className="p-6 text-center text-lg font-semibold text-gray-400">
                Loading applications...
              </p>
            ) : error ? (
              <p className="p-6 text-center text-lg font-semibold text-red-500">
                {error}
              </p>
            ) : applications.length > 0 ? (
              applications.map(
                ({
                  id,
                  company,
                  position,
                  location,
                  status,
                  daysAgo,
                  logo,
                }) => (
                  <div
                    key={id}
                    className="p-4 flex justify-between items-center border-b border-gray-200 last:border-none"
                  >
                    {/* Left Section (Logo + Company Name) */}
                    <div className="items-center rtl:space-x-reverse">
                      <div className="flex items-center gap-2">
                        <img
                          src={logo}
                          alt={`${company} Logo`}
                          className="w-8 h-8 rounded-md"
                          onError={(e) => (e.target.src = getFallbackLogo(company))}
                        />
                        <p className="text-sm font-semibold text-[#201A23]">
                          {company}
                        </p>
                      </div>

                      <div className="mt-2 space-y-2">
                        <p className="text-sm font-bold text-black">
                          {position}
                        </p>
                        <p className="text-xs text-gray-500">{location}</p>
                      </div>
                    </div>

                    {/* Right Section (Days Ago & Status) */}
                    <div className="flex flex-col items-end space-y-9">
                      <p className="text-xs text-gray-400">{daysAgo}</p>
                      <span
                        className={`text-sm font-semibold ${
                          status === "Pending"
                            ? "text-yellow-500"
                            : status === "Not qualified"
                            ? "text-red-500"
                            : "text-red-500"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="p-6 text-center text-lg font-semibold text-gray-400">
                No applications to show
              </p>
            )}
          </div>

          {/* View All Button */}
          <div className="p-4 text-center border-t border-gray-200">
            <button
              onClick={() => {
                navigate("/seeker/Applications");
                onToggle(); // Close dropdown after navigation
              }}
              className="text-black font-bold hover:underline"
            >
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationDropdown;