import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import vod from "../../../assets/seeker/vod.png"; // Fallback image

function CompanyPost({ profileImg, jobPosts }) {
  const navigate = useNavigate();

  // Animation variants for the container (stagger children)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between each child animation
      },
    },
  };

  // Animation variants for each job post
  const postVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const handleJobClick = (status, jobId) => {
    if (status === "Active") {
      navigate(`/seeker/apply/${jobId}`);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {jobPosts && jobPosts.length > 0 ? (
        jobPosts.map((post, index) => (
          <motion.div key={post.job_id} variants={postVariants}>
            <div
              className={`flex justify-between items-start p-4 ${
                post.job_status === "Active"
                  ? "cursor-pointer hover:bg-gray-50"
                  : "cursor-not-allowed"
              }`}
              onClick={() => handleJobClick(post.job_status, post.job_id)}
            >
              {/* Left Section: Logo and Job Details */}
              <div className="flex items-start gap-4">
                <img
                  src={profileImg || vod}
                  alt="Company Logo"
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {post.job_title}
                  </h4>
                  <p className="text-gray-600 text-base">
                    {`${post.job_country} (${post.job_type})`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {/* Right Section: Status */}
                <span
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    post.job_status === "Active"
                      ? "bg-[#D6F6D9] text-[#1B7908]"
                      : "bg-[#FEE5E5] text-[#C60000]"
                  }`}
                >
                  {post.job_status}
                </span>
                <p className="text-gray-500 text-sm mt-1">{post.time_ago}</p>
              </div>
            </div>

            {/* Horizontal Line (not for the last item) */}
            {index < jobPosts.length - 1 && (
              <hr className="border-t-2 border-[#D9D9D9]" />
            )}
          </motion.div>
        ))
      ) : (
        <p className="text-center text-gray-500 p-4">No job posts available.</p>
      )}
    </motion.div>
  );
}

export default CompanyPost;