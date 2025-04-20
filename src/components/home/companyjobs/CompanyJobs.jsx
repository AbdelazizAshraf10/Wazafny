import React, { useState } from "react";
import search from "../../../assets/seeker/search.png";
import loc from "../../../assets/seeker/location.png";
import ibm from "../../../assets/seeker/ibm.png";
import vod from "../../../assets/seeker/vod.png";

import { useNavigate } from "react-router-dom";
function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const companies = [
    {
      company: "Vodafone Egypt",
      logo: vod,
      followers: "6.9K",
      jobs: "46",
      description:
        "Here at Vodafone, we do amazing things to empower everybody to be confidently connected, and that could be providing superfast network speeds to smartphones...",
      location: "Cairo, Cairo Governorate",
    },
    {
      company: "IBM",
      logo: ibm,
      followers: "1.8K",
      jobs: "24",
      description:
        "IBM works to design, advance, and scale the technologies that define each era. Restlessly reinventing since 1911, we are one of the largest technology, consulting and rese...",
      location: "Armonk, NY1",
    },
  ];

  const filteredCompanies = companies.filter((company) =>
    company.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen  ">
      {/* Search Bar */}
      <div className="w-[30%] mx-auto px-4 py-6">
        <div className="relative">
          <img
            src={search}
            alt="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 p-3 border border-gray-300 rounded-[88px] focus:outline-none focus:ring-2 focus:ring-[#D9D9D9]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Company Cards */}
      <div className="max-w-6xl border-2 rounded-[16px] border-[#D9D9D9] mx-auto px-4 p-10 bg-white">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company, index) => (
            <div key={index}>
              <div
                onClick={() => navigate("/seeker/companyOverview")}
                className="p-6 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01] hover:shadow-md cursor-pointer"
              >
                {/* Top Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={company.logo}
                      alt={`${company.company} logo`}
                      className="w-10 h-10 rounded-md object-contain"
                    />
                    <p className="text-xl font-bold text-[#201A23]">
                      {company.company}
                    </p>
                  </div>

                  <div className="flex gap-20 text-sm font-semibold  text-center text-[#201A23]">
                    <div>
                      <p className="text-base">{company.followers}</p>
                      <p className="text-gray-500">Followers</p>
                    </div>
                    <div>
                      <p className="text-base">{company.jobs}</p>
                      <p className="text-gray-500">Jobs</p>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <p className="mt-4 text-xl font-bold text-[#201A23]">About</p>
                <p className="mt-2 text-lg text-[#201A23]">
                  {company.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 mt-5 text-md text-[#201A23]">
                  <img src={loc} alt="location icon" className="w-4 h-4" />
                  <span>{company.location}</span>
                </div>
              </div>

              {/* Divider */}
              {index !== filteredCompanies.length - 1 && (
                <hr className="border-t border-[#D9D9D9] my-4" />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-6">No jobs found.</p>
        )}
      </div>
    </div>
  );
}

export default JobsPage;
