import { useState } from "react";
import { MoreVertical, XCircle } from "lucide-react";
import HeaderCompany from "./HeaderCompany";
import close from "../../assets/company/close.svg";
import edit from "../../assets/company/edit.svg";
import Delete from "../../assets/company/delete.svg";
import Del from "../../assets/company/delete-black.svg";
import Modal from "../home/NavIcons/PROFILE/profile/Modal";
import DelCut from "../../assets/company/delete-red-cut.svg";

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
      status: "Active",
      date: "12/12/2024",
      link: "#",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      status: "Active",
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

  // State for Close Confirmation Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToClose, setJobToClose] = useState(null);

  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Function to handle closing a job
  const handleCloseJob = (id) => {
    setJobPosts((prevJobs) =>
      prevJobs.map((job) =>
        job.id === id ? { ...job, status: "Closed" } : job
      )
    );
  };

  // Function to confirm closing the job
  const handleConfirmClose = () => {
    handleCloseJob(jobToClose); // Close the job
    setIsModalOpen(false); // Close the modal
  };

  // Function to cancel closing the job
  const handleCancelClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Function to handle deleting a job
  const handleDeleteJob = (id) => {
    setJobPosts((prevJobs) => prevJobs.filter((job) => job.id !== id));
    setIsDeleteModalOpen(false); // Close the modal after deletion
  };

  return (
    <div>
      {/* Header */}
      <HeaderCompany />
      <hr className="border-t-2 border-gray-300 my-4" />

      {/* Main Content */}
      <div className="mx-auto p-6">
        <div className="bg-white rounded-xl p-6 shadow-md overflow-x-auto">
          {/* Responsive Table */}
          <div className="hidden md:table w-full border-collapse">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-gray-700">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Job Post Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
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
                    <td className="py-3 px-4">{job.id}</td>
                    <td className="py-3 px-4 font-medium text-[#201A23] truncate transition-colors duration-300 hover:text-[#6A0DAD] hover:underline">
                      {job.title}
                    </td>
                    <td className="py-3 px-4 flex justify-between mt-4">
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
                        <div className=" mr-16 ">
                          <a
                            href={job.link}
                            className={`text-[#201A23] underline font-sans font-semibold text-sm hover:text-[#6A0DAD] transition-opacity duration-300 ${
                              hoveredJob === job.id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          >
                            View applications
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#201A23] font-sans font-semibold">
                      {job.date}
                    </td>
                    <td className="py-6 px-4 text-center relative">
                      {job.status === "Active" ? (
                        <div>
                          <button
                            onClick={() =>
                              setMenuOpen(menuOpen === job.id ? null : job.id)
                            }
                            className="p-2 rounded-full hover:bg-gray-200 transition"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {menuOpen === job.id && (
                            <div className="absolute right-0 mt-1 font-bold w-32 bg-[#FDFDFD] shadow-lg rounded-xl z-10">
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

      {/* Close Confirmation Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancelClose}
          showFooter={false} // Custom footer is used
        >
          <div className="flex flex-col items-center p-6">
            {/* Prohibition Icon */}
            <img
              src={close}
              alt="close"
              className="w-20 h-16 p-2 bg-[#F4F4F4] rounded-2xl mb-4"
            />
            {/* Modal Title */}
            <h2 className="text-xl font-semibold text-gray-900">
              Close this Job?
            </h2>
            {/* Warning Message */}
            <p className="text-[#A1A1A1] text-center mt-2">
              You will not be able to reopen it once it is closed.
            </p>
            {/* Button Section */}
            <div className="mt-6 flex w-full font-[somar sans] gap-4 text-2xl font-bold">
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          showFooter={false} // Custom footer is used
        >
          <div className="flex flex-col items-center p-6">
            {/* Delete Icon */}
            <img
              src={DelCut}
              alt="delete"
              className="w-20 h-17 bg-[#FEE2E2] p-4 rounded-3xl mb-4"
            />
            {/* Modal Title */}
            <h2 className="text-xl font-semibold text-gray-900">
              Delete this Job?
            </h2>
            {/* Warning Message */}
            <p className="text-[#A1A1A1] text-center mt-2">
              You will not be able to recover it once deleted.
            </p>
            {/* Button Section */}
            <div className="mt-6 flex w-full font-[somar sans] gap-4 text-2xl font-bold">
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

// {/* Stacked Layout for Mobile */}
// <div className="md:hidden">
// {jobPosts.map((job) => (
//   <div
//     key={job.id}
//     className="bg-gray-50 rounded-lg p-4 mb-4 shadow-sm"
//   >
//     <div className="flex justify-between items-center mb-2">
//       <span className="text-sm font-medium text-gray-500">#{job.id}</span>
//       <span
//         className={`px-2 py-1 text-xs font-semibold rounded-lg ${
//           job.status === "Active"
//             ? "bg-green-100 text-green-700"
//             : "bg-red-100 text-red-700"
//         }`}
//       >
//         {job.status}
//       </span>
//     </div>
//     <div className="mb-2">
//       <h3 className="text-lg font-bold text-purple-700 truncate">
//         {job.title}
//       </h3>
//       <p className="text-sm text-gray-600">{job.date}</p>
//     </div>
//     <div className="flex justify-between items-center">
//       {job.status === "Active" && (
//         <a
//           href={job.link}
//           className="text-blue-600 text-sm font-medium"
//         >
//           View applications
//         </a>
//       )}
//       <div className="relative">
//         {job.status === "Active" ? (
//           <button
//             onClick={() =>
//               setMenuOpen(menuOpen === job.id ? null : job.id)
//             }
//             className="p-2 rounded-full hover:bg-gray-200 transition"
//           >
//             <MoreVertical className="w-5 h-5" />
//           </button>
//         ) : (
//           <button
//             onClick={() => alert(`Deleting ${job.title}`)}
//             className="p-2 rounded-full hover:bg-red-100 transition"
//           >
//             <Trash2 className="w-5 h-5 text-red-600" />
//           </button>
//         )}
//         {menuOpen === job.id && (
//           <div className="absolute right-4 mt-5 w-32 bg-[#FDFDFD] shadow-xl rounded-xl z-10">
//             <ul className="text-gray-700">
//               <li
//                 className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => alert(`Closing ${job.title}`)}
//               >
//                 <XCircle className="w-4 h-4 mr-2 text-gray-500" />
//                 Close
//               </li>
//               <li
//                 className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => alert(`Editing ${job.title}`)}
//               >
//                 <Edit className="w-4 h-4 mr-2 text-blue-500" />
//                 Edit
//               </li>
//               <li
//                 className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => alert(`Deleting ${job.title}`)}
//               >
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 Delete
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// ))}
// </div>
