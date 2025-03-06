import { useState } from "react";
import { ScrollText } from "lucide-react";
import logoVodafone from "../../../assets/vodafone.png";
import logoBlink22 from "../../../assets/blink22.png";

// Job Applications List
const jobApplications = [
  {
    id: 1,
    company: "Vodafone Egypt",
    position: "Flutter Mobile App Developer",
    location: "Egypt (Remote)",
    status: "Pending",
    daysAgo: 2,
    logo: logoVodafone,
  },
  {
    id: 2,
    company: "Blink22",
    position: "Mobile Software Engineer",
    location: "Cairo, Egypt (Remote)",
    status: "Not qualified",
    daysAgo: 4,
    logo: logoBlink22,
  },
];

const JobApplicationDropdown = ({ applications }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Briefcase Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <ScrollText
          className="w-7 h-8"
          style={{
            fill: open ? "black" : "none", // Solid black when clicked
            stroke: "black", // Ensure the outline remains consistent
            strokeWidth: open ? 0 : 2, // No stroke when filled
          }}
        />
      </button>

      {/* Application Panel */}
      {open && (
        <div className="absolute right-4 mt-2 w-96 bg-white rounded-xl border border-gray-300 shadow-lg z-50">
          <div className="p-5 flex justify-center border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#201A23]">
              My Applications
            </h2>
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {applications.length > 0 ? (
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

                    <div className="  items-center  rtl:space-x-reverse">
                      <div className="flex items-center gap-2">
                        <img
                          src={logo}
                          alt={`${company} Logo`}
                          className="w-8 h-8 rounded-md"
                        />
                        <p className="text-sm font-semibold text-[#201A23] ">
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
                      <p className="text-xs text-gray-400">{daysAgo}d</p>
                      <span
                        className={`text-sm font-semibold ${
                          status === "Pending"
                            ? "text-yellow-500"
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
            <button className="text-black font-bold hover:underline">
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Usage
const App = () => {
  return <JobApplicationDropdown applications={jobApplications} />;
};

export default App;
