import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HeaderCompany from "./HeaderCompany";
import time from "../../assets/company/time.svg";
import profile from "../../assets/company/profile-default.svg";

import badawy from "../../assets/company/badawy.png";
import menna from "../../assets/company/menna.png";
import yousif from "../../assets/company/tztoztyy.png";
import abdelaziz from "../../assets/company/abdelaziz.png";
import elham from "../../assets/company/elhamm.png";
import omar from "../../assets/company/ghonemy.png";
import amira from "../../assets/company/gbna.png";

const allApplications = [
  {
    id: 1,
    jobId: 1,
    name: "Yousif Ahmed",
    status: "Rejected",
    time: "2m",
    photo: yousif,
  },
  {
    id: 2,
    jobId: 1,
    name: "Menna Medhat",
    status: "Accepted",
    time: "3h",
    photo: menna,
  },
  {
    id: 3,
    jobId: 1,
    name: "Yousif Badawy",
    status: "Accepted",
    time: "1h",
    photo: badawy,
  },
  {
    id: 4,
    jobId: 1,
    name: "Abdelaziz Ashraf",
    status: "Pending",
    time: "1d",
    photo: abdelaziz,
  },
  {
    id: 5,
    jobId: 1,
    name: "Elham Mohsen",
    status: "Accepted",
    time: "2d",
    photo: elham,
  },
  {
    id: 6,
    jobId: 1,
    name: "Omar Elghonemy",
    status: "Accepted",
    time: "1w",
    photo: omar,
  },
  {
    id: 7,
    jobId: 1,
    name: "Amira Gadallah",
    status: "Accepted",
    time: "1w",
    photo: amira,
  },
];

const getStatusClass = (status) => {
  switch (status) {
    case "Rejected":
      return "bg-[#FEE5E5] text-[#C60000] px-2 py-1 rounded text-xs font-bold";
    case "Accepted":
      return "bg-[#D6F6D9] text-[#1B7908] px-2 py-1 rounded text-xs font-bold";
    case "Pending":
      return "bg-[#FEF4E5] text-[#EFA600] px-2 py-1 rounded text-xs font-bold";
    default:
      return "";
  }
};

function ViewApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const jobTitle = "Flutter Mobile App Developer";

  useEffect(() => {
    if (!jobId) return;
    const filteredApps = allApplications.filter(
      (app) => app.jobId === parseInt(jobId, 10)
    );
    setApplications(filteredApps);
  }, [jobId]);

  return (
    <div>
      <HeaderCompany />
      <hr className="border-t-2 border-gray-300 my-4" />
      <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          Applications Received - {jobTitle}
        </h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 text-sm font-semibold">#</th>
              <th className="p-3 text-sm font-semibold">Job Post Title</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold"></th>
              <th className="p-3 text-sm font-semibold">
                <img src={time} alt="" />
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id} className="border-b hover:bg-gray-50 group">
                <td className="p-3 text-sm">{index + 1}</td>
                <td className="p-3 text-sm font-medium flex items-center space-x-3">
                  <img
                    src={app.photo ? app.photo : profile}
                    alt="Profile"
                    className="w-10 h-9 rounded-full"
                  />
                  <span>{app.name}</span>
                </td>
                <td className="p-3 text-sm">
                  <span className={getStatusClass(app.status)}>
                    {app.status}
                  </span>
                </td>
                <td className="p-3 text-sm text-start">
                  <Link
                    to={`/Dashboard/application/${app.id}`} // ✅ Updated Route
                    className="text-[#242645] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity underline"
                  >
                    View application
                  </Link>
                </td>
                <td className="p-3 text-sm text-gray-500">{app.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewApplications;
