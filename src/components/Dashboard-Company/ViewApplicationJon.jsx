import  { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeaderCompany from "./HeaderCompany";
import time from "../../assets/company/time.svg";
import profile from "../../assets/company/profile-default.svg";
import axios from "axios";

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
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState("Loading...");

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token || !jobId) {
        setError("Missing token or job ID. Please log in again.");
        setLoading(false);
        navigate("/LoginCompany");
        return;
      }

      console.log("jobid from view app:", jobId);

      try {
        const response = await axios.get(
          `https://wazafny.online/api/show-applications-company/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 204 ) {
          setApplications([]); // Treat 404 as no applications found
        } else {
           setJobTitle (response.data.job_title) 
          const { applications: latestApplications } = response.data;
          const mappedApplications = latestApplications.map((app) => ({
            id: app.application_id,
            name: `${app.seeker.first_name} ${app.seeker.last_name}`,
            status: app.status,
            time: app.time_ago,
            photo: app.seeker.profile_img || "",
            seeker_id: app.seeker.seeker_id,
          }));
          setApplications(mappedApplications);
        }
        console.log("Fetched applications:", response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        if (error.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          navigate("/LoginCompany");
        } else if (error.response?.status === 404) {
          setApplications([]); // Treat 404 as no applications found
          setLoading(false);
        } else if (error.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to fetch applications. Please try again.");
        }
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId, navigate]);

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

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-6">{error}</div>;
  }

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
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No applications found for this job.
                </td>
              </tr>
            ) : (
              applications.map((app, index) => (
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
                      src={app.photo || profile}
                      alt="Profile"
                      className="w-10 h-9 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                      onError={(e) => (e.target.src = profile)}
                    />
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                      onClick={() => navigate(`/Dashboard/SeekerApplicant/${app.seeker_id}`)}
                      className="text-[#242645] text-sm font-bold underline cursor-pointer"
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewApplications;