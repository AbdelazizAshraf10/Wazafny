import React from "react";
import { useNavigate } from "react-router-dom";
import vod from "../../../assets/seeker/vod.png"; // Assuming this is the Vodafone logo

function CompanyPost() {
  const navigate = useNavigate();

  // Sample data for job posts
  const jobPosts = [
    {
      id: 1,
      title: "Flutter Mobile App Developer",
      location: "Egypt (Remote)",
      status: "Active",
      time: "2d",
    },
    {
      id: 2,
      title: "Flutter Mobile App Developer",
      location: "Egypt (Remote)",
      status: "Active",
      time: "5d",
    },
    {
      id: 3,
      title: "Flutter Mobile App Developer",
      location: "Egypt (Remote)",
      status: "Closed",
      time: "1w",
    },
  ];

  const handleJobClick = (status) => {
    if (status === "Active") {
      navigate("/seeker/apply");
    }
  };

  return (
    <div className="space-y-4">
      {jobPosts.map((post, index) => (
        <div key={post.id}>
          <div
            className={`flex justify-between items-start p-4 ${
              post.status === "Active"
                ? "cursor-pointer hover:bg-gray-50"
                : "cursor-not-allowed"
            }`}
            onClick={() => handleJobClick(post.status)}
          >
            {/* Left Section: Logo and Job Details */}
            <div className="flex items-start gap-4">
              <img
                src={vod}
                alt="Company Logo"
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {post.title}
                </h4>
                <p className="text-gray-600 text-base">{post.location}</p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {/* Right Section: Status */}
              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  post.status === "Active"
                    ? "bg-[#D6F6D9] text-[#1B7908]"
                    : "bg-[#FEE5E5] text-[#C60000]"
                }`}
              >
                {post.status}
              </span>
              <p className="text-gray-500 text-sm mt-1">{post.time}</p>
            </div>
          </div>

          {/* Horizontal Line (not for the last item) */}
          {index < jobPosts.length - 1 && (
            <hr className="border-t-2 border-[#D9D9D9]" />
          )}
        </div>
      ))}
    </div>
  );
}

export default CompanyPost;