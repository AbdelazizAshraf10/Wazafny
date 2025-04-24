import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import HeaderCompany from "./HeaderCompany";
import close from "../../assets/company/close.svg";
import edit from "../../assets/company/edit.svg";
import Delete from "../../assets/company/delete.svg";
import Del from "../../assets/company/delete-black.svg";
import Modal from "../home/NavIcons/PROFILE/profile/Modal";
import DelCut from "../../assets/company/delete-red-cut.svg";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function Jobpost() {
  const [menuOpen, setMenuOpen] = useState(null);
  const [hoveredJob, setHoveredJob] = useState(null);
  const [jobposts, setJobposts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToClose, setJobToClose] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [closeError, setCloseError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isBaseJobpostRoute = location.pathname === "/Dashboard/Jobpost";

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchJobPosts = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    if (!token || !companyId) {
      setError("Missing token or company ID. Please log in again.");
      setLoading(false);
      navigate("/LoginCompany");
      return;
    }

    try {
      const response = await axios.get(
        `https://wazafny.online/api/show-job-posts/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        setJobposts([]);
      } else {
        const { jobposts } = response.data;
        const mappedJobs = jobposts.map((job) => ({
          id: job.job_id,
          title: job.job_title,
          status: job.job_status,
          date: job.created_at,
          link: true,
        }));
        setJobposts(mappedJobs);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job posts:", error);
      if (error.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        navigate("/LoginCompany");
      } else if (error.response?.status === 404) {
        setError("Job posts not found.");
      } else if (error.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to fetch job posts. Please try again.");
      }
      setLoading(false);
    }
  };

  const fetchJobPostDetails = async (jobId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `https://wazafny.online/api/show-job-post/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if(error.status === 500){
        console.log("internal server error")
      } else if(error.status === 401){
        setMessage({text:"Unauthorized. Please log in again." , type:(error)})
        navigate("/LoginCompany");
      }else if(error.status === 404){
        console.log("invalid job post")
      }


      console.error("Error fetching job post details:", error);
      setError("Failed to fetch job post details. Please try again.");
      return null;

    }
  };

  const handleEdit = async (jobId) => {
    const jobData = await fetchJobPostDetails(jobId);
    if (jobData) {
      const formData = {
        jobTitle: jobData.jobpost.job_title || "",
        about: jobData.jobpost.job_about || "",
        country: jobData.jobpost.job_country || "",
        cityState: jobData.jobpost.job_city || "",
        jobType: jobData.jobpost.job_type || "",
        employmentType: jobData.jobpost.job_time || "",
      };

      const skills = jobData.skills
        ? jobData.skills.map((skillObj) => skillObj.skill)
        : [];
      const sections = jobData.sections
        ? jobData.sections.map((section) => ({
            title: section.section_name,
            description: section.section_description,
          }))
        : [];
      const questions = jobData.questions
        ? jobData.questions.map((question) => question.question) // Store as strings
        : [];

      navigate(`/Dashboard/Jobpost/${jobId}`, {
        state: { jobId, formData, skills, sections, questions, isEdit: true },
      });
    } else {
      setMessage({ text: "Failed to load job data for editing.", type: "error" });
    }
  };

  useEffect(() => {
    fetchJobPosts();
  }, [navigate]);

  const handleClose = async () => {
    const token = localStorage.getItem("token");

    if (!jobToClose) {
      setCloseError("No job selected to close.");
      return;
    }

    try {
      const response = await axios.put(
        `https://wazafny.online/api/close-job-post/${jobToClose}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage({ text: "Job closed successfully!", type: "success" });
      setCloseError(null);
      setIsModalOpen(false);
      setJobToClose(null);
      await fetchJobPosts();
    } catch (error) {
      console.error("Status update error:", error.message);
      if (error.response?.status === 401) {
        setCloseError("Unauthorized. Please log in again.");
        navigate("/LoginCompany");
      } else if (error.response?.status === 404) {
        setCloseError("Job not found.");
      } else if (error.response?.status === 400) {
        setCloseError("The job is already closed.");
      } else if (error.response?.status === 500) {
        setCloseError("Server error. Please try again later.");
      } else if (error.response?.status === 422) {
        setCloseError("Validation error. Please check your input.");
      } else {
        setCloseError("Failed to close job. Please try again.");
      }
    }
  };

  const handleCancelClose = () => {
    setIsModalOpen(false);
    setJobToClose(null);
    setCloseError(null);
  };

  const handleDeleteJob = async () => {
    const token = localStorage.getItem("token");

    if (!jobToDelete) {
      setDeleteError("No job selected to delete.");
      return;
    }

    try {
      const response = await axios.delete(
        `https://wazafny.online/api/delete-job-post/${jobToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage({ text: "Job deleted successfully", type: "success" });
      setDeleteError(null);
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
      if (selectedJobId === jobToDelete) {
        setSelectedJobId(null);
      }
      await fetchJobPosts();
    } catch (error) {
      console.error("Delete error:", error.message);
      if (error.response?.status === 401) {
        setDeleteError("Unauthorized. Please log in again.");
        navigate("/LoginCompany");
      } else if (error.response?.status === 404) {
        setDeleteError("Job not found.");
      } else if (error.response?.status === 500) {
        setDeleteError("Server error. Please try again later.");
      } else if (error.response?.status === 422) {
        setDeleteError("Validation error. Please check your input.");
      } else {
        setDeleteError("Failed to delete job. Please try again.");
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
    setDeleteError(null);
  };

  const handleSelectJob = (id) => {
    setSelectedJobId(id);
  };

  const sortedJobPosts = [...jobposts].sort((a, b) => {
    if (a.status === "Active" && b.status === "Closed") return -1;
    if (a.status === "Closed" && b.status === "Active") return 1;
    return 0;
  });

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-6">{error}</div>;
  }

  return (
    <>
      {message.text && (
        <div
          className={`floating-message ${message.type} ${
            !message.text ? "hide" : ""
          }`}
        >
          {message.text}
        </div>
      )}
      <style>
        {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes slideIn {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-20px);
              opacity: 0;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-in forwards;
          }

          .floating-message {
            position: fixed;
            top: 20px;
            left: 44%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out forwards;
          }

          .floating-message.success {
            background-color: #4caf50;
            color: white;
          }

          .floating-message.error {
            background-color: #f44336;
            color: white;
          }

          .floating-message.hide {
            animation: slideOut 0.3s ease-out forwards;
          }
        `}
      </style>
      <div>
        {isBaseJobpostRoute ? (
          <>
            <HeaderCompany />
            <hr className="border-t-2 border-gray-300 my-4" />
            <div className="mx-auto p-6">
              <div className="bg-white rounded-xl p-6 shadow-md overflow-x-auto">
                <div className="hidden md:table w-full border-collapse">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-700">
                        <th className="py-3 px-4 text-sm font-semibold">#</th>
                        <th className="py-3 px-4 text-sm font-semibold">
                          Job Post Title
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold">
                          Status
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold">
                          Date
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {sortedJobPosts.map((job) => (
                          <motion.tr
                            key={job.id}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={`border-b transition-all rounded-2xl hover:bg-gray-100 ${
                              selectedJobId === job.id ? "bg-gray-200" : ""
                            }`}
                            onMouseEnter={() => setHoveredJob(job.id)}
                            onMouseLeave={() => setHoveredJob(null)}
                          >
                            <td className="py-3 px-4">{job.id}</td>
                            <td className="py-8 px-4 font-bold text-[#201A23] truncate transition-colors duration-300 hover:text-[#6A0DAD] hover:underline">
                              <Link
                                to={`/Dashboard/JobOverview/${job.id}`}
                                onClick={() => handleSelectJob(job.id)}
                              >
                                {job.title}
                              </Link>
                            </td>
                            <td className="py-3 px-4 justify-between">
                              <div className="flex justify-between">
                                <span
                                  className={`px-2 py-1 text-sm font-semibold rounded-lg ${
                                    job.status === "Active"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {job.status}
                                </span>
                                {job.link && (
                                  <div className="mr-16 flex items-center">
                                    <Link
                                      to={`/Dashboard/view-applications/${job.id}`}
                                      className={`text-[#201A23] underline font-sans font-semibold text-sm hover:text-[#6A0DAD] transition-opacity duration-300 ${
                                        hoveredJob === job.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                      onClick={() => handleSelectJob(job.id)}
                                    >
                                      View applications
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[#201A23] font-sans font-semibold">
                              {job.date}
                            </td>
                            <td className="py-6 px-4 text-center relative">
                              {job.status === "Active" ? (
                                <div>
                                  <button
                                    onClick={() =>
                                      setMenuOpen(
                                        menuOpen === job.id ? null : job.id
                                      )
                                    }
                                    className="p-2 rounded-full hover:bg-gray-200 transition"
                                  >
                                    <MoreVertical className="w-5 h-5" />
                                  </button>
                                  {menuOpen === job.id && (
                                    <div className="absolute right-0 mt-1 font-bold w-32 bg-white shadow-lg rounded-xl z-10">
                                      <ul className="text-gray-700">
                                        <li
                                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                          onClick={() => {
                                            setJobToClose(job.id);
                                            setIsModalOpen(true);
                                            setMenuOpen(null);
                                          }}
                                        >
                                          <img
                                            src={close}
                                            alt="close"
                                            className="w-4 h-4 mr-2"
                                          />
                                          Close
                                        </li>
                                        <li
                                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                          onClick={() => {
                                            handleEdit(job.id);
                                            setMenuOpen(null);
                                          }}
                                        >
                                          <img
                                            src={edit}
                                            alt="edit"
                                            className="w-4 h-4 mr-2"
                                          />
                                          Edit
                                        </li>
                                        <li
                                          className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                                          onClick={() => {
                                            setJobToDelete(job.id);
                                            setIsDeleteModalOpen(true);
                                            setMenuOpen(null);
                                          }}
                                        >
                                          <img
                                            src={Delete}
                                            alt="delete"
                                            className="w-4 h-4 mr-2"
                                          />
                                          Delete
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setJobToDelete(job.id);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="p-2 rounded-full hover:bg-gray-400 transition ease-in-out duration-300"
                                >
                                  <img
                                    src={Del}
                                    alt="delete"
                                    className="w-5 h-5"
                                  />
                                </button>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                      {sortedJobPosts.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-6 text-center text-gray-500 font-semibold"
                          >
                            No job posts available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {isModalOpen && (
              <Modal
                isOpen={isModalOpen}
                onClose={handleCancelClose}
                showFooter={false}
              >
                <div className="flex flex-col items-center p-6">
                  <img
                    src={close}
                    alt="close"
                    className="w-20 h-16 p-2 bg-[#F4F4F4] rounded-2xl mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Close this Job?
                  </h2>
                  <p className="text-[#A1A1A1] text-center mt-2">
                    You will not be able to reopen it once it is closed.
                  </p>
                  {closeError && (
                    <p className="text-red-500 text-sm mt-2">{closeError}</p>
                  )}
                  <div className="mt-6 flex w-full gap-4 text-2xl font-bold">
                    <button
                      className="w-1/2 py-2 border border-gray-300 text-[#201A23] rounded-lg hover:bg-[#F4F4F4]"
                      onClick={handleCancelClose}
                    >
                      Cancel
                    </button>
                    <button
                      className="w-1/2 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Modal>
            )}

            {isDeleteModalOpen && (
              <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                showFooter={false}
              >
                <div className="flex flex-col items-center p-6">
                  <img
                    src={DelCut}
                    alt="delete"
                    className="w-20 h-17 bg-[#FEE2E2] p-4 rounded-3xl mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delete this Job?
                  </h2>
                  <p className="text-[#A1A1A1] text-center mt-2">
                    You will not be able to recover it once deleted.
                  </p>
                  {deleteError && (
                    <p className="text-red-500 text-sm mt-2">{deleteError}</p>
                  )}
                  <div className="mt-6 flex w-full gap-4 text-2xl font-bold">
                    <button
                      className="w-1/2 py-2 border border-gray-300 text-[#201A23] rounded-lg hover:bg-[#F4F4F4]"
                      onClick={handleCancelDelete}
                    >
                      Cancel
                    </button>
                    <button
                      className="w-1/2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      onClick={handleDeleteJob}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </>
  );
}

export default Jobpost;