import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import HeaderCompany from "./HeaderCompany";
import time from "../../assets/company/time.svg";
import profile from "../../assets/company/profile-default.svg";

const allApplications = [
  {
    id: 1,
    jobId: 1,
    name: "Yousif Ahmed",
    status: "Rejected",
    time: "2m",
    photo: "",
  },
  {
    id: 4,
    jobId: 1,
    name: "Abdelaziz Ashraf",
    status: "Pending",
    time: "1d",
    photo: "",
  },
  {
    id: 3,
    jobId: 1,
    name: "Yousif Badawy",
    status: "Accepted",
    time: "1h",
    photo: "",
  },
  {
    id: 2,
    jobId: 1,
    name: "Menna Medhat",
    status: "Accepted",
    time: "3h",
    photo: "",
  },
  {
    id: 5,
    jobId: 1,
    name: "Elham Mohsen",
    status: "Accepted",
    time: "2d",
    photo: "",
  },
  {
    id: 6,
    jobId: 1,
    name: "Omar Elghonemy",
    status: "Accepted",
    time: "1w",
    photo: "",
  },
  {
    id: 7,
    jobId: 1,
    name: "Amira Gadallah",
    status: "Accepted",
    time: "1w",
    photo: "",
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

  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  // Animation variants for the table header
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Animation variants for the status badge
  const statusVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1 },
    },
  };

  // Animation variants for the "View application" link
  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div>
      <HeaderCompany />
      <hr className="border-t-2 border-gray-300 my-4" />
      <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
        <motion.h1
          className="text-xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Applications Received - {jobTitle}
        </motion.h1>
        <table className="w-full border-collapse">
          <motion.thead
            initial="hidden"
            animate="visible"
            variants={headerVariants}
          >
            <tr className="bg-gray-100 text-left">
              <th className="p-3 text-sm font-semibold">#</th>
              <th className="p-3 text-sm font-semibold">Job Post Title</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold"></th>
              <th className="p-3 text-sm font-semibold">
                <img src={time} alt="" />
              </th>
            </tr>
          </motion.thead>
          <tbody>
            {applications.map((app, index) => (
              <motion.tr
                key={app.id}
                className="border-b group"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                whileHover={{ backgroundColor: "#F7FAFC", scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <td className="p-3 text-sm">{index + 1}</td>
                <td className="p-3 text-sm font-medium flex items-center space-x-3">
                  <motion.img
                    src={app.photo ? app.photo : profile}
                    alt="Profile"
                    className="w-10 h-9 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  />
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                  >
                    {app.name}
                  </motion.span>
                </td>
                <td className="p-3 text-sm">
                  <motion.span
                    className={getStatusClass(app.status)}
                    variants={statusVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {app.status}
                  </motion.span>
                </td>
                <td className="p-3 text-sm text-start">
                  <motion.div
                    variants={linkVariants}
                    initial="hidden"
                    whileHover="visible"
                  >
                    <Link
                      to={`/Dashboard/application/${app.id}`}
                      className="text-[#242645] text-sm font-bold underline"
                    >
                      View application
                    </Link>
                  </motion.div>
                </td>
                <td className="p-3 text-sm text-gray-500">{app.time}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewApplications;