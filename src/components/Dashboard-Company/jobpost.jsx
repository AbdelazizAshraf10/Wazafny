import { useState } from "react";
import { MoreVertical } from "lucide-react";
import HeaderCompany from "./HeaderCompany";
import close from "../../assets/company/close.svg";
import edit from "../../assets/company/edit.svg";
import Delete from "../../assets/company/delete.svg";
import Del from "../../assets/company/delete-black.svg";
import Modal from "../home/NavIcons/PROFILE/profile/Modal";
import DelCut from "../../assets/company/delete-red-cut.svg";
import { Link, useNavigate } from "react-router-dom";

function Jobpost() {
  const [menuOpen, setMenuOpen] = useState(null);
  const [hoveredJob, setHoveredJob] = useState(null);
  const [jobPosts, setJobPosts] = useState([
    {
      id: 1,
      title: "Flutter Mobile App Developer",
      status: "Active",
      date: "02/03/2025",
      link: "#",
    },
    {
      id: 2,
      title: "Cyber Security Engineer",
      status: "Active",
      date: "10/01/2025",
      link: "#",
    },
    {
      id: 3,
      title: "Backend Developer",
      status: "Closed",
      date: "12/12/2024",
      link: "#",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      status: "Closed",
      date: "05/08/2024",
      link: "#",
    },
    {
      id: 5,
      title: "Laravel Backend Developer",
      status: "Closed",
      date: "08/11/2023",
      link: "#",
    },
    {
      id: 6,
      title: "Swift IOS Mobile App Developer",
      status: "Closed",
      date: "09/06/2023",
      link: "#",
    },
    {
      id: 7,
      title: "Kotlin Android Mobile App Developer",
      status: "Closed",
      date: "15/12/2022",
      link: "#",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToClose, setJobToClose] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const navigate = useNavigate();

  const handleCloseJob = (id) => {
    setJobPosts((prevJobs) =>
      prevJobs.map((job) =>
        job.id === id ? { ...job, status: "Closed" } : job
      )
    );
  };

  const handleConfirmClose = () => {
    handleCloseJob(jobToClose);
    setIsModalOpen(false);
  };

  const handleCancelClose = () => {
    setIsModalOpen(false);
  };

  const handleDeleteJob = (id) => {
    setJobPosts((prevJobs) => prevJobs.filter((job) => job.id !== id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
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
                  <th className="py-3 px-4 text-sm font-semibold">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold">Date</th>
                  <th className="py-3 px-4 text-sm font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobPosts.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b transition-all rounded-2xl hover:bg-gray-100"
                    onMouseEnter={() => setHoveredJob(job.id)}
                    onMouseLeave={() => setHoveredJob(null)}
                  >
                    {/* ID */}
                    <td className="py-3 px-4">{job.id}</td>

                    {/* Job Title */}
                    <td className="py-8 px-4 font-bold text-[#201A23] truncate transition-colors duration-300 hover:text-[#6A0DAD] hover:underline">
                      <Link to={`/jobpost/${job.id}`}>{job.title}</Link>
                    </td>

                    {/* Status and View Applications */}
                    <td className="py-3 px-4 justify-between">
                      <div className="flex justify-between">
                        {/* Status Badge */}
                        <span
                          className={`px-2 py-1 text-sm font-semibold rounded-lg ${
                            job.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {job.status}
                        </span>

                        {/* View Applications Link */}
                        {job.link && (
                          <div className="mr-16 flex items-center">
                            <Link
                              to={`/Dashboard/view-applications/${job.id}`}  // Dynamic route with jobId
                              className={`text-[#201A23] underline font-sans font-semibold text-sm hover:text-[#6A0DAD] transition-opacity duration-300 ${
                                hoveredJob === job.id ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              View applications
                            </Link>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-[#201A23] font-sans font-semibold">
                      {job.date}
                    </td>

                    {/* Actions */}
                    <td className="py-6 px-4 text-center relative">
                      {job.status === "Active" ? (
                        <div>
                          {/* More Actions Dropdown */}
                          <button
                            onClick={() =>
                              setMenuOpen(menuOpen === job.id ? null : job.id)
                            }
                            className="p-2 rounded-full hover:bg-gray-200 transition"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {menuOpen === job.id && (
                            <div className="absolute right-0 mt-1 font-bold w-32 bg-white shadow-lg rounded-xl z-10">
                              <ul className="text-gray-700">
                                {/* Close Job */}
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

                                {/* Edit Job */}
                                <li
                                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() =>
                                    navigate(`/Dashboard/Jobpost/${job.id}`)
                                  }
                                >
                                  <img
                                    src={edit}
                                    alt="edit"
                                    className="w-4 h-4 mr-2"
                                  />
                                  Edit
                                </li>

                                {/* Delete Job */}
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
                        /* Delete Button for Closed Jobs */
                        <button
                          onClick={() => {
                            setJobToDelete(job.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-full hover:bg-gray-400 transition ease-in-out duration-300"
                        >
                          <img src={Del} alt="delete" className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {jobPosts.length === 0 && (
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

      {/* Close Modal */}
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
            <div className="mt-6 flex w-full gap-4 text-2xl font-bold">
              <button
                className="w-1/2 py-2 border border-gray-300 text-[#201A23] rounded-lg hover:bg-[#F4F4F4]"
                onClick={handleCancelClose}
              >
                Cancel
              </button>
              <button
                className="w-1/2 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                onClick={handleConfirmClose}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
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
            <div className="mt-6 flex w-full gap-4 text-2xl font-bold">
              <button
                className="w-1/2 py-2 border border-gray-300 text-[#201A23] rounded-lg hover:bg-[#F4F4F4]"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="w-1/2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => handleDeleteJob(jobToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Jobpost;