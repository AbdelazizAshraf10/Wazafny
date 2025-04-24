import React, { useState } from "react";
import loc from "../../../assets/seeker/location.png";
import blink from "../../../assets/seeker/blink.png";
import ModalApply from "../applyModal/ModalApply";

function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const job = {
    company: "Blink22",
    logo: blink,
    title: "Mobile Software Engineer",
    location: "Cairo, Egypt",
    time: "4 d",
    employmentType: "Full-time",
    JobType: "Remote",
    tags: ["Dart", "Kotlin", "Java", "Firebase"],
    description:
      "We’re seeking an experienced Mobile Software Engineer with a passion for development and a team-oriented attitude, ready to bring powerful software to life.\n\nAs a Mobile Engineer at Blink22, your role will involve collaborating with various departments within the company, ensure the successful creation and implementation of innovative and streamlined mobile experiences. Additionally, you will actively contribute to enhancing our internal workflows and fostering a culture of continuous improvement and transparency. This position also offers ample opportunities for personal and professional growth as a Mobile Engineer.",
    requirements:
      "Required Technical skills:\n- Proficiency in Dart, Kotlin, and Java.\n- Familiarity with Firebase and its services.\n- Experience with mobile app development frameworks and tools.",
    softSkills:
      "\n- Strong problem-solving skills and attention to detail.\n- Excellent communication and teamwork abilities.\n- Ability to work independently and manage time effectively.",
    benefits:
      "\n- Competitive salary and benefits package.\n- Flexible working hours.\n- Opportunity for career growth and development.",
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white shadow-sm rounded-[16px] p-9 border border-[#D9D9D9]">
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#6A0DAD] text-white font-semibold px-7 py-2 rounded-[9px] hover:bg-[#5B2494] transition-all duration-200"
            >
              Apply Now
            </button>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-5">
            {job.title}
          </h3>

          <div className="flex items-center text-lg gap-3 mt-3 text-gray-600">
            <div className="flex gap-3">
              <img src={loc} alt="location icon" className="w-4 h-6" />
              <span>{job.location}</span>
            </div>
            <span>{job.time}</span>
          </div>

          <div className="mt-4 flex gap-4">
            <span className="bg-[#EFF0F2] text-[#201A23] text-md font-bold px-4 py-1 rounded-[9px]">
              {job.JobType}
            </span>
            <span className="bg-[#EFF0F2] text-[#201A23] text-md font-bold px-4 py-1 rounded-[9px]">
              {job.employmentType}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-xl font-semibold text-gray-900">Skills</h4>
            <div className="flex items-center gap-4 mt-2">
              {job.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#F2E9FF] text-[#201A23] text-md font-bold px-6 py-1 rounded-[9px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-xl font-bold text-gray-900">About the job</h4>
            <p className="text-base text-[#201A23] mt-2 whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <div className="mt-6 space-y-9">
            <h4 className="text-lg font-semibold text-gray-900 whitespace-pre-line">
              {job.requirements}
            </h4>
            <h4 className="text-lg font-semibold text-gray-900 whitespace-pre-line">
              {job.softSkills}
            </h4>
            <h4 className="text-lg font-semibold text-gray-900 whitespace-pre-line">
              {job.benefits}
            </h4>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isModalOpen && <ModalApply onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default JobsPage;
