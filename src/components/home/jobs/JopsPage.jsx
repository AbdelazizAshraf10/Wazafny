import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import search from "../../../assets/seeker/search.png";
import loc from "../../../assets/seeker/location.png";
import blink from "../../../assets/seeker/blink.png";
import vod from "../../../assets/seeker/vod.png";

function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const jobs = [
    {
      company: "Vodafone Egypt",
      logo: vod,
      title: "Flutter Mobile App Developer",
      description:
        "We are looking for an experienced Senior Flutter Software Engineer/Developer to join our highly skilled technical team.",
      location: "Egypt (Remote)",
      tags: ["iOS", "Flutter", "Mobile App Development", "Firebase"],
      time: "2d",
    },
    {
      company: "Blink22",
      logo: blink,
      title: "Mobile Software Engineer",
      description:
        "We’re seeking an experienced Mobile Software Engineer with a passion for development and a team-oriented attitude, ready to bring powerful software to life.",
      location: "Cairo, Egypt (Remote)",
      tags: ["Dart", "Mobile App Development", "Firebase", "Flutter"],
      time: "4d",
    },
    {
      company: "Vodafone Egypt",
      logo: vod,
      title: "Mobile Software Engineer",
      description:
        "We’re seeking an experienced Mobile Software Engineer with a passion for development and a team-oriented attitude, ready to bring powerful software to life.",
      location: "Cairo, Egypt (Remote)",
      tags: ["Dart", "Mobile App Development", "Firebase", "Flutter"],
      time: "4d",
    },
    {
      company: "Blink22",
      logo: blink,
      title: "Mobile Software Engineer",
      description:
        "We’re seeking an experienced Mobile Software Engineer with a passion for development and a team-oriented attitude, ready to bring powerful software to life.",
      location: "Cairo, Egypt (Remote)",
      tags: ["Dart", "Mobile App Development", "Firebase", "Flutter"],
      time: "4d",
    },
  ];

  // Filter jobs based on search term (case-insensitive)
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Search Bar Section */}
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

      {/* Job Listings Section */}
      <div className="max-w-6xl border-2 rounded-[16px] border-[#D9D9D9] mx-auto px-4 p-12 bg-white">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <div key={index}>
              <div
                className="p-6 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01] hover:shadow-md cursor-pointer"
                onClick={() => navigate("/seeker/apply")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="w-10 h-10 rounded-md object-contain"
                    />
                    <p className="text-lg font-semibold text-[#201A23]">
                      {job.company}
                    </p>
                  </div>
                  <div className="">
                    <span className="text-sm text-gray-500">{job.time}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mt-3 text-gray-900">
                  {job.title}
                </h3>
                <p className="text-xl font-sans text-[#201A23] mt-3">
                  {job.description}
                </p>

                <div className="flex text-lg justify-between mt-8">
                  <div className="flex gap-3">
                    <img src={loc} alt="location icon" className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>

                  <div className="flex items-center gap-4 font-bold">
                    {job.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F2E9FF] text-[#201A23] text-md px-4 py-1 rounded-[9px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Horizontal Divider */}
              {index !== filteredJobs.length - 1 && (
                <hr className="border-t-2 border-[#D9D9D9] mx-6 p-4" />
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