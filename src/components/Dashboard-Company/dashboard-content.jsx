import React from "react";
import HeaderCompany from "./HeaderCompany";
import Time from "../../assets/company/time.svg";
import Person from "../../assets/company/person.png";

function DashboardContent() {
  const users = [
    {
      id: 1,
      applicationName: "Yousif Ahmed",
      jobpost: "Flutter Mobile App Developer",
      Time: "2m",
    },
    {
      id: 2,
      applicationName: "Menna Medhat",
      jobpost: "Cloud Security",
      Time: "1h",
    },
    {
      id: 3,
      applicationName: "Yousif Badawy",
      jobpost: "Backend Developer",
      Time: "3h",
    },
    {
      id: 4,
      applicationName: "Abdelaziz Ashraf",
      jobpost: "Front End Developer",
      Time: "1d",
    },
    {
      id: 5,
      applicationName: "Elham Mohsen",
      jobpost: "Full-Stack Web Developer",
      Time: "2d",
    },
    {
      id: 6,
      applicationName: "Omar Elghonemy",
      jobpost: "Cyber Security Engineer",
      Time: "4d",
    },
    {
      id: 7,
      applicationName: "Amira Gadallah",
      jobpost: "Machine Learning Engineer",
      Time: "5d",
    },
  ];

  const LatestJobPost = [
    {
      id: 1,
      jobpost: "Flutter Mobile App Developer",
      location: "Giza (Full-Time)",
      Time: "2m",
    },
    {
      id: 2,
      jobpost: "Cloud Security",
      location: "Giza (Full-Time)",
      Time: "1h",
    },
    {
      id: 3,
      jobpost: "Backend Developer",
      location: "Giza (Full-Time)",
      Time: "3h",
    },
    {
      id: 4,
      jobpost: "Front End Developer",
      location: "Cairo (Part-Time)",
      Time: "1d",
    },
    {
      id: 5,
      jobpost: "Full-Stack Web Developer",
      location: "Alexandria (Full-Time)",
      Time: "2d",
    },
    {
      id: 6,
      jobpost: "Cyber Security Engineer",
      location: "Giza (Full-Time)",
      Time: "4d",
    },
    {
      id: 7,
      jobpost: "Machine Learning Engineer",
      location: "Remote",
      Time: "5d",
    },
  ];

  return (
    <div className="flex flex-col px-6 py-4">
      {/* Header */}
      <div>
        <HeaderCompany />
        <hr className="border-t-2 border-gray-300 my-4" />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Section - Statistics & Latest Applications */}
        <div className="col-span-2 space-y-6">
          {/* Stats Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border grid grid-cols-4 text-left">
            <div>
              <p className="text-gray-400">Total Job Posted</p>
              <span className="text-4xl font-bold">68</span>
            </div>
            <div>
              <p className="text-gray-400">Total Followers</p>
              <span className="text-4xl font-bold">1.2k</span>
            </div>
            <div>
              <p className="text-gray-400">Total Active Jobs</p>
              <span className="text-4xl font-bold">5</span>
            </div>
            <div>
              <p className="text-gray-400">Total Applications Received</p>
              <span className="text-4xl font-bold">103</span>
            </div>
          </div>





          {/* Latest Applications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-2xl font-bold text-gray-900">
              Latest Applications Received
            </p>

            {/* Table Header */}
            <div className="flex justify-between font-bold my-4  pb-2">
              <p>Applicant Name</p>
              <p>Job Post Title</p>
              <img src={Time} className="" alt="Time Icon" />
            </div>

            {/* Applications List */}
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`flex justify-between py-3 ${
                  index !== users.length - 1 ? "border-b" : ""
                }`}
              >
                {/* Profile Picture & Name */}
                <div className="flex items-center w-1/3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 mr-3">
                    <img
                      src={Person}
                      alt="Profile"
                      className="w-7 h-7 rounded-full"
                    />
                  </div>
                  <p className="font-bold">{user.applicationName}</p>
                </div>

                {/* Job Post Title */}
                <p className="w-1/3 text-[#6A0DAD] ml-5 font-extrabold solid  underline cursor-pointer text-sm">
                  {user.jobpost}
                </p>

                {/* Time */}
                <p className="text-gray-500">{user.Time}</p>
              </div>
            ))}
          </div>
        </div>




        {/* Right Section - Latest Jobs Posted */}
        <div className="bg-white rounded-xl p-6 shadow-sm ">
          <p className="text-xl text-[#201A23] text-center font-extrabold mb-4">Latest jobs posted</p>

          {/* Job Posts List */}
          <div className="space-y-4 text-sm text-gray-800">
            {LatestJobPost.map((job,index) => (
              <div
              key={LatestJobPost.id}
              className={`flex justify-between py-3 ${
                index !== users.length - 1 ? "border-b" : ""
              }`}
            >
                {/* Job Details (Left Side) */}
                <div className="space-y-2">
                  <p className="font-bold text-base">{job.jobpost}</p>
                  <p className="text-gray-500">{job.location}</p>
                </div>

                {/* Time (Right Side) */}
                <p className="text-gray-400 text-xs">{job.Time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
