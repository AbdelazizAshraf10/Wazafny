import { Pencil, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "../profile/Modal";
import { InputField, SelectField } from "../profile/my-component";
import Logo from "../../../../../assets/companyExpLogo.png";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import { Navigate } from "react-router-dom";

function Experience({ userRole, initialExperiences }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [experienceList, setExperienceList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [apiError, setApiError] = useState("");
  const [error, setError] = useState(null);
  const [floatMessage, setFloatMessage] = useState({ message: "", type: "" }); // State to manage float message
  const [shouldNavigate, setShouldNavigate] = useState(false); // State to control navigation

  const [formInputs, setFormInputs] = useState({
    experience_id: null,
    Title: "",
    EmploymentType: "",
    Company: "",
    StartDate: { Month: "", Year: "" },
    EndDate: { Month: "", Year: "" },
    WorkingRole: false,
  });

  const Month = [
    "Month",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const Year = [
    "Year",
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
    "2009",
    "2008",
    "2007",
    "2006",
    "2005",
    "2004",
    "2003",
    "2002",
    "2001",
    "2000",
  ];

  // Transform API data into the format expected by the component
  useEffect(() => {
    if (initialExperiences && initialExperiences.length > 0) {
      const transformedExperiences = initialExperiences.map((exp) => {
        const [startMonth, startYear] = exp.start_date.split(" ");
        const isWorkingRole = exp.end_date === "Present";
        let endMonth = "";
        let endYear = "";
        if (!isWorkingRole) {
          [endMonth, endYear] = exp.end_date.split(" ");
        }

        return {
          experience_id: exp.experience_id,
          Title: exp.job_title,
          EmploymentType: exp.job_time,
          Company: exp.company,
          StartDate: {
            Month: Month.find((m) => m.startsWith(startMonth)) || startMonth,
            Year: startYear,
          },
          EndDate: {
            Month: isWorkingRole
              ? ""
              : Month.find((m) => m.startsWith(endMonth)) || endMonth,
            Year: isWorkingRole ? "" : endYear,
          },
          WorkingRole: isWorkingRole,
        };
      });
      setExperienceList(transformedExperiences);
    }
  }, [initialExperiences]);

  // Function to show float message
  const showFloatMessage = (type, message) => {
    setFloatMessage({ message, type });
  };

  // Function to close float message
  const closeFloatMessage = () => {
    setFloatMessage({ message: "", type: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formInputs.Title ||
      !formInputs.Company ||
      !formInputs.StartDate.Month ||
      !formInputs.StartDate.Year
    ) {
      setApiError("Please fill in all required fields.");
      showFloatMessage("error", "Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const seeker_id = localStorage.getItem("seeker_id");

    if (!token) {
      setApiError("Authentication token not found. Please log in again.");
      showFloatMessage("error", "Authentication token not found. Please log in again.");
      setShouldNavigate(true);
      return;
    }

    if (!seeker_id) {
      setApiError("Seeker ID not found. Please log in again.");
      showFloatMessage("error", "Seeker ID not found. Please log in again.");
      setShouldNavigate(true);
      return;
    }

    // Format dates as "MMM YYYY" (e.g., "Feb 2012")
    const startDate = `${formInputs.StartDate.Month.slice(0, 3)} ${
      formInputs.StartDate.Year
    }`;
    const endDate = formInputs.WorkingRole
      ? "Present"
      : `${formInputs.EndDate.Month.slice(0, 3)} ${formInputs.EndDate.Year}`;

    // Prepare data for API
    const experienceData = {
      seeker_id: parseInt(seeker_id),
      company: formInputs.Company,
      job_title: formInputs.Title,
      job_time: formInputs.EmploymentType,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const response = await axios.post(
        "https://wazafny.online/api/create-experience",
        experienceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

     

      // Assuming the API returns the created experience with an experience_id
      const newExperience = {
        ...formInputs,
        experience_id: response.data.experience_id || Date.now(), // Fallback to timestamp if no ID is returned
      };

      // Add the new experience to the list
      setExperienceList([...experienceList, newExperience]);

      // Close the modal after saving
      setIsModalOpen(false);
      setIsModalAddOpen(false);

      // Reset form fields
      setFormInputs({
        experience_id: null,
        Title: "",
        EmploymentType: "",
        Company: "",
        StartDate: { Month: "", Year: "" },
        EndDate: { Month: "", Year: "" },
        WorkingRole: false,
      });
      setApiError("");
    } catch (error) {
      if (error.response?.status === 404) {
        console.error("Seeker not found:", error.response.data);
        setError(
          error.response?.data?.message || "Seeker not found. Please try again."
        );
        showFloatMessage("error", error.response?.data?.message || "Seeker not found. Please try again.");
      } else if (error.response?.status === 401) {
        const errorMessage = "Unauthorized: " + (error.response?.data?.message || "Invalid token. Please log in again.");
        showFloatMessage("error", errorMessage);
        setError("Unauthorized: Please log in again.");
        setShouldNavigate(true);
      } else if (error.response?.status === 500) {
        console.error("Server error:", error.response.data);
        setError(
          error.response?.data?.message || "Server error. Please try again later."
        );
        showFloatMessage("error", error.response?.data?.message || "Server error. Please try again later.");
      } else if (error.response?.status === 422) {
        console.error("Validation error:", error.response.data);
        setError(
          error.response?.data?.message || "Validation error. Please check your input."
        );
        showFloatMessage("error", error.response?.data?.message || "Validation error. Please check your input.");
      } else {
        console.error("Error creating experience:", error);
        setApiError(
          error.response?.data?.message || "Failed to create experience. Please try again."
        );
        showFloatMessage("error", error.response?.data?.message || "Failed to create experience. Please try again.");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formInputs.Title ||
      !formInputs.Company ||
      !formInputs.StartDate.Month ||
      !formInputs.StartDate.Year
    ) {
      setApiError("Please fill in all required fields.");
      showFloatMessage("error", "Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setApiError("Authentication token not found. Please log in again.");
      showFloatMessage("error", "Authentication token not found. Please log in again.");
      setShouldNavigate(true);
      return;
    }

    if (!formInputs.experience_id) {
      setApiError("Experience ID not found. Cannot update experience.");
      showFloatMessage("error", "Experience ID not found. Cannot update experience.");
      return;
    }

    // Format dates as "MMM YYYY" (e.g., "Feb 2012")
    const startDate = `${formInputs.StartDate.Month.slice(0, 3)} ${
      formInputs.StartDate.Year
    }`;
    const endDate = formInputs.WorkingRole
      ? "Present"
      : `${formInputs.EndDate.Month.slice(0, 3)} ${formInputs.EndDate.Year}`;

    // Prepare data for API
    const experienceData = {
      company: formInputs.Company,
      job_title: formInputs.Title,
      job_time: formInputs.EmploymentType,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const response = await axios.put(
        `https://wazafny.online/api/update-experience/${formInputs.experience_id}`,
        experienceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      

      // Update the local experience list
      const updatedExperiences = [...experienceList];
      updatedExperiences[editingIndex] = {
        ...formInputs,
        StartDate: {
          Month: formInputs.StartDate.Month,
          Year: formInputs.StartDate.Year,
        },
        EndDate: {
          Month: formInputs.WorkingRole ? "" : formInputs.EndDate.Month,
          Year: formInputs.WorkingRole ? "" : formInputs.EndDate.Year,
        },
        WorkingRole: formInputs.WorkingRole,
      };
      setExperienceList(updatedExperiences);

      // Close the modal after updating
      setIsModalOpen(false);
      setIsModalAddOpen(false);
      setEditingIndex(null);

      // Reset form fields
      setFormInputs({
        experience_id: null,
        Title: "",
        EmploymentType: "",
        Company: "",
        StartDate: { Month: "", Year: "" },
        EndDate: { Month: "", Year: "" },
        WorkingRole: false,
      });
      setApiError("");
    } catch (error) {
      if (error.response?.status === 404) {
        console.error("Seeker not found:", error.response.data);
        setError(
          error.response?.data?.message || "Seeker not found. Please try again."
        );
        showFloatMessage("error", error.response?.data?.message || "Seeker not found. Please try again.");
      } else if (error.response?.status === 401) {
        const errorMessage = "Unauthorized: " + (error.response?.data?.message || "Invalid token. Please log in again.");
        showFloatMessage("error", errorMessage);
        setError("Unauthorized: Please log in again.");
        setShouldNavigate(true);
      } else if (error.response?.status === 500) {
        console.error("Server error:", error.response.data);
        setError(
          error.response?.data?.message || "Server error. Please try again later."
        );
        showFloatMessage("error", error.response?.data?.message || "Server error. Please try again later.");
      } else if (error.response?.status === 422) {
        console.error("Validation error:", error.response.data);
        setError(
          error.response?.data?.message || "Validation error. Please check your input."
        );
        showFloatMessage("error", error.response?.data?.message || "Validation error. Please check your input.");
      } else {
        console.error("Error updating experience:", error);
        setApiError(
          error.response?.data?.message || "Failed to update experience. Please try again."
        );
        showFloatMessage("error", error.response?.data?.message || "Failed to update experience. Please try again.");
      }
    }
  };

  const handleEdit = (index) => {
    const experienceToEdit = experienceList[index];
    setFormInputs({
      ...experienceToEdit,
      experience_id: experienceToEdit.experience_id,
    });
    setEditingIndex(index);
    setIsModalAddOpen(true);
    setIsModalOpen(false);
  };

  const handleDelete = async (index) => {
    const experienceToDelete = experienceList[index];
    const experienceId = experienceToDelete.experience_id;

    if (!experienceId) {
      setApiError("Experience ID not found. Cannot delete experience.");
      showFloatMessage("error", "Experience ID not found. Cannot delete experience.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setApiError("Authentication token not found. Please log in again.");
      showFloatMessage("error", "Authentication token not found. Please log in again.");
      setShouldNavigate(true);
      return;
    }

    try {
      const response = await axios.delete(
        `https://wazafny.online/api/delete-experience/${experienceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      

      // Remove the experience from the local list
      setExperienceList(experienceList.filter((_, i) => i !== index));
      setApiError("");
    } catch (error) {
      if (error.response?.status === 404) {
        console.error("Seeker not found:", error.response.data);
        setError(
          error.response?.data?.message || "Seeker not found. Please try again."
        );
        showFloatMessage("error", error.response?.data?.message || "Seeker not found. Please try again.");
      } else if (error.response?.status === 401) {
        const errorMessage = "Unauthorized: " + (error.response?.data?.message || "Invalid token. Please log in again.");
        showFloatMessage("error", errorMessage);
        setError("Unauthorized: Please log in again.");
        setShouldNavigate(true);
      } else if (error.response?.status === 500) {
        console.error("Server error:", error.response.data);
        setError(
          error.response?.data?.message || "Server error. Please try again later."
        );
        showFloatMessage("error", error.response?.data?.message || "Server error. Please try again later.");
      } else {
        console.error("Error deleting experience:", error);
        setApiError(
          error.response?.data?.message || "Failed to delete experience. Please try again."
        );
        showFloatMessage("error", error.response?.data?.message || "Failed to delete experience. Please try again.");
      }
    }
  };

  // Animation variants for modal backdrop
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Animation variants for modal content
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Handle navigation after float message is shown
  if (shouldNavigate) {
    return <Navigate to="/Login" />;
  }

  return (
    <div className="max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] xl:max-h-[80vh] 2xl:max-h-[80vh] 3xl:max-h-[80vh] 4xl:max-h-[80vh]">
      {/* Render the float message component */}
      <floatmessages
        message={floatMessage.message}
        type={floatMessage.type}
        onClose={closeFloatMessage}
        duration={3000}
      />

      {error && <p className="text-red-600 mb-3">{error}</p>}
      <div className="flex mt-2">
        <div className="bg-white border border-[#D9D9D9] rounded-xl w-[900px] p-6">
          {/* Header with Icon */}
          <div className="flex justify-between">
            <h3 className="text-xl font-bold text-[#201A23]">Experience</h3>
            {userRole !== "Company" && (
              <div className="flex gap-4">
                <Plus
                  className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                  onClick={() => setIsModalAddOpen(true)}
                />
                <Pencil
                  className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            )}
          </div>

          {/* Display Experience List or Placeholder */}
          {experienceList.length === 0 ? (
            <div className="text-center mt-7 text-[#A1A1A1]">
              Add your work experience, including job roles and
              responsibilities, here.
            </div>
          ) : (
            experienceList.map((exp, index) => (
              <div
                key={index}
                className="text-left flex mt-4 border-t pt-4 gap-4"
              >
                <img
                  src={Logo}
                  className="w-[48px] h-[54px] mt-2.5"
                  alt="Company Logo"
                />
                <div>
                  <h4 className="font-bold text-lg">{exp.Title}</h4>
                  <p className="text-gray-600">
                    {exp.Company} - {exp.EmploymentType}
                  </p>
                  <p className="text-[#A1A1A1]">
                    {exp.StartDate.Month} {exp.StartDate.Year} -
                    {exp.WorkingRole
                      ? " Present"
                      : ` ${exp.EndDate.Month} ${exp.EndDate.Year}`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for Edit Experience */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Experience"
        >
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.form
                  className="bg-white p-6 rounded-lg shadow-lg w-[700px] text-left relative overflow-y-auto max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] xl:max-h-[80vh] 2xl:max-h-[80vh] 3xl:max-h-[80vh] 4xl:max-h-[80vh]"
                  onSubmit={
                    editingIndex !== null
                      ? handleUpdate
                      : () => setIsModalOpen(false)
                  }
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="flex justify-between items-center mb-3 relative">
                    <h2 className="text-xl font-bold">Experience</h2>
                    <button
                      className="text-gray-500 hover:text-black absolute top-0 right-0"
                      onClick={() => setIsModalOpen(false)}
                    >
                      ✖
                    </button>
                  </div>
                  <div className="mt-4 space-y-5">
                    {experienceList.length === 0 ? (
                      <div className="text-center mt-7 text-[#A1A1A1]">
                        Add your work experience here.
                      </div>
                    ) : (
                      experienceList.map((exp, index) => (
                        <div
                          key={index}
                          className="flex mt-4 border-t pt-4 gap-4 justify-between items-center"
                        >
                          <div className="flex gap-4">
                            <img
                              src={Logo}
                              className="w-[48px] h-[54px] mt-2.5"
                              alt="Company Logo"
                            />
                            <div>
                              <h4 className="font-bold text-lg">{exp.Title}</h4>
                              <p className="text-gray-600">
                                {exp.Company} - {exp.EmploymentType}
                              </p>
                              <p className="text-[#A1A1A1]">
                                {exp.StartDate.Month} {exp.StartDate.Year} -{" "}
                                {exp.WorkingRole
                                  ? "Present"
                                  : `${exp.EndDate.Month} ${exp.EndDate.Year}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-6">
                            <Trash
                              className="w-5 h-5 fill-[#201A23] cursor-pointer"
                              onClick={() => handleDelete(index)}
                            />
                            <Pencil
                              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                              onClick={() => handleEdit(index)}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {/* Display Experience List or Placeholder */}

                  <hr className="border-t-2 border-gray-300 my-[17px]" />

                  <button
                    onClick={() => setIsModalAddOpen(true)}
                    className="flex items-center gap-2 text-[#6A0DAD] hover:text-black"
                  >
                    <span className="text-2xl">+</span> Add New Experience
                  </button>

                  {/* Save Button */}
                  <div className="flex justify-end mb-4">
                    <button
                      type="submit"
                      className="p-2 w-[112px] bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition mx-4"
                    >
                      Save
                    </button>
                  </div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </Modal>

        {/* Modal for Add/Edit Experience */}
        <Modal
          isOpen={isModalAddOpen}
          onClose={() => setIsModalAddOpen(false)}
          title={editingIndex !== null ? "Edit Experience" : "Add Experience"}
        >
          <AnimatePresence>
            {isModalAddOpen && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.form
                  className="bg-white p-6 rounded-lg shadow-lg w-[700px] text-left relative overflow-y-auto max-h-[95vh]"
                  onSubmit={editingIndex !== null ? handleUpdate : handleSave}
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">
                      {editingIndex !== null
                        ? "Edit Experience"
                        : "Add Experience"}
                    </h2>
                    <button
                      className="text-gray-500 hover:text-black"
                      onClick={() => setIsModalAddOpen(false)}
                    >
                      ✖
                    </button>
                  </div>

                  <p className="text-[#A1A1A1] mb-3">
                    {editingIndex !== null
                      ? "Edit your work experience here."
                      : "Add your work experience, including job roles and responsibilities, here."}
                  </p>

                  {/* Error Message */}
                  {apiError && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                      {apiError}
                    </div>
                  )}

                  {/* Title */}
                  <InputField
                    label="Title"
                    name="Title"
                    value={formInputs.Title}
                    onChange={(e) =>
                      setFormInputs({ ...formInputs, Title: e.target.value })
                    }
                    required
                    className="w-full mb-4"
                  />

                  {/* Employment Type */}
                  <SelectField
                    label="Employment Type"
                    name="EmploymentType"
                    value={formInputs.EmploymentType}
                    onChange={(e) =>
                      setFormInputs({
                        ...formInputs,
                        EmploymentType: e.target.value,
                      })
                    }
                    options={["Select Field", "Full-time", "Part-time"]}
                    required
                    className="w-full mb-4"
                  />

                  {/* Company */}
                  <InputField
                    label="Company"
                    name="Company"
                    value={formInputs.Company}
                    onChange={(e) =>
                      setFormInputs({ ...formInputs, Company: e.target.value })
                    }
                    required
                    className="w-full mb-4"
                  />

                  {/* Start Date */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      Start Date*
                    </label>
                    <div className="flex gap-4 mt-1">
                      <SelectField
                        name="StartMonth"
                        value={formInputs.StartDate.Month}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            StartDate: {
                              ...formInputs.StartDate,
                              Month: e.target.value,
                            },
                          })
                        }
                        options={Month}
                        required
                        className="w-1/2"
                      />
                      <SelectField
                        name="StartYear"
                        value={formInputs.StartDate.Year}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            StartDate: {
                              ...formInputs.StartDate,
                              Year: e.target.value,
                            },
                          })
                        }
                        options={Year}
                        required
                        className="w-1/2"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      End Date*
                    </label>
                    <div className="flex gap-4 mt-1">
                      <SelectField
                        name="EndMonth"
                        value={formInputs.EndDate.Month}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            EndDate: {
                              ...formInputs.EndDate,
                              Month: e.target.value,
                            },
                          })
                        }
                        options={Month}
                        disabled={formInputs.WorkingRole}
                        required={!formInputs.WorkingRole}
                        className={`w-1/2 ${
                          formInputs.WorkingRole
                            ? "bg-[#EFF0F2] cursor-not-allowed"
                            : ""
                        }`}
                      />
                      <SelectField
                        name="EndYear"
                        value={formInputs.EndDate.Year}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            EndDate: {
                              ...formInputs.EndDate,
                              Year: e.target.value,
                            },
                          })
                        }
                        options={Year}
                        disabled={formInputs.WorkingRole}
                        className={`w-1/2 ${
                          formInputs.WorkingRole
                            ? "bg-[#EFF0F2] cursor-not-allowed"
                            : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Currently Working Checkbox */}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="checkbox"
                      checked={formInputs.WorkingRole}
                      onChange={(e) =>
                        setFormInputs({
                          ...formInputs,
                          WorkingRole: e.target.checked,
                          ...(e.target.checked && {
                            EndDate: { Month: "", Year: "" },
                          }),
                        })
                      }
                      className="size-5 accent-black"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      I am currently working in this role
                    </label>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="p-2 w-[112px] bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition"
                    >
                      Save
                    </button>
                  </div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </Modal>
      </div>
    </div>
  );
}

export default Experience;