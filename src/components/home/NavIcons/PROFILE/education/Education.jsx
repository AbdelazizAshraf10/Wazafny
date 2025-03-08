import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import Modal from "../profile/Modal";
import { InputField, SelectField } from "../profile/my-component";
import Logo from "../../../../../assets/Education.png";

function Education() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [educationList, setEducationList] = useState([]); // Renamed from experienceList
  const [editingIndex, setEditingIndex] = useState(null);
  const [formInputs, setFormInputs] = useState({
    Degree: "", // Renamed from Title
    EducationType: "", // Renamed from EmploymentType
    Institution: "", // Renamed from Company
    StartDate: { Month: "", Year: "" },
    EndDate: { Month: "", Year: "" },
    CurrentlyStudying: false, // Renamed from WorkingRole
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
  ];

  const handleSave = (e) => {
    e.preventDefault();
    // Validate required fields
    if (
      !formInputs.University ||
      !formInputs.College ||
      !formInputs.StartDate.Month ||
      !formInputs.StartDate.Year
    ) {
      return;
    }
    if (editingIndex !== null) {
      // Editing an existing education entry
      const updatedEducations = [...educationList];
      updatedEducations[editingIndex] = formInputs;
      setEducationList(updatedEducations);
      setEditingIndex(null);
    } else {
      // Adding a new education entry
      setEducationList([...educationList, formInputs]);
    }
    // Close the modal after saving
    setIsModalOpen(false);
    setIsModalAddOpen(false);
    // Reset form fields
    setFormInputs({
      University: "",
      College: "",
      StartDate: { Month: "", Year: "" },
      EndDate: { Month: "", Year: "" },
    });
  };

  const handleEdit = (index) => {
    const educationToEdit = educationList[index];
    setFormInputs(educationToEdit);
    setEditingIndex(index);
    setIsModalAddOpen(true);
    setIsModalOpen(false);
  };

  const handleDelete = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  return (
    <div className="max-h-[80vh]">
      <div className="flex mt-2">
        <div className="bg-white border border-[#D9D9D9] rounded-xl w-[900px] p-6">
          {/* Header with Icon */}
          <div className="flex justify-between">
            <h3 className="text-xl font-bold text-[#201A23]">Education</h3>
            <div className="flex gap-4">
              {/* Conditionally show Plus button */}
              <Plus
                className={`w-5 h-5 text-gray-600 cursor-pointer hover:text-black ${
                  educationList.length > 0 ? "hidden" : ""
                }`}
                onClick={() => setIsModalAddOpen(true)}
              />
              {/* Conditionally disable Pencil button */}
              <Pencil
                className={`w-5 h-5 text-gray-600 cursor-pointer hover:text-black ${
                  educationList.length === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                onClick={() => educationList.length > 0 && setIsModalOpen(true)}
              />
            </div>
          </div>

          {/* Display Education List or Placeholder */}
          {educationList.length === 0 ? (
            <div className="text-center mt-7 text-[#A1A1A1]">
              Add your degree, field of study, and university name here.
            </div>
          ) : (
            educationList.map((edu, index) => (
              <div
                key={index}
                className="text-left flex mt-4 border-t pt-4 gap-4"
              >
                <img src={Logo} className="w-[60px] h-[54px] mt-2.5" />
                <div>
                  <h4 className="font-bold text-lg">{edu.University}</h4>
                  <p className="text-gray-600">{edu.College}</p>
                  <p className="text-[#A1A1A1]">
                    {edu.StartDate.Month} {edu.StartDate.Year} -{" "}
                    {edu.CurrentlyStudying
                      ? "Present"
                      : `${edu.EndDate.Month} ${edu.EndDate.Year}`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for Edit Education */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Education"
        >
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <form
              className="bg-white p-6 rounded-lg shadow-lg w-[700px] text-left relative overflow-y-auto max-h-[80vh]"
              onSubmit={() => setIsModalOpen(false)}
            >
              <div className="flex justify-between items-center mb-3 relative">
                <h2 className="text-xl font-bold">Education</h2>
                <button
                  className="text-gray-500 hover:text-black absolute top-0 right-0 scale-150"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✖
                </button>
              </div>
              <div className="mt-4 space-y-5">
                {educationList.length === 0 ? (
                  <div className="text-center mt-7 text-[#A1A1A1]">
                    Add your education details here.
                  </div>
                ) : (
                  educationList.map((edu, index) => (
                    <div
                      key={index}
                      className="flex mt-4 border-t pt-4 gap-4 justify-between items-center"
                    >
                      <div className="flex gap-4">
                        <img src={Logo} className="w-[48px] h-[54px] mt-2.5" />
                        <div>
                          <h4 className="font-bold text-lg">
                            {edu.University}
                          </h4>
                          <p className="text-gray-600">{edu.College}</p>
                          <p className="text-[#A1A1A1]">
                            {edu.StartDate.Month} {edu.StartDate.Year} -{" "}
                            {edu.CurrentlyStudying
                              ? "Present"
                              : `${edu.EndDate.Month} ${edu.EndDate.Year}`}
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
              <hr className="border-t-2 border-gray-300 my-[17px]" />
              <button
                onClick={() => setIsModalAddOpen(true)}
                className="flex items-center gap-2 text-[#6A0DAD] hover:text-black"
              >
                <span className="text-2xl">+</span> Add New Education
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
            </form>
          </div>
        </Modal>

        {/* Modal for Add Education */}
        <Modal
          isOpen={isModalAddOpen}
          onClose={() => setIsModalAddOpen(false)}
          title="Add Education"
        >
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <form
              className="bg-white p-6 rounded-lg shadow-lg w-[700px] text-left relative overflow-y-auto max-h-[95vh]"
              onSubmit={handleSave}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold">Education</h2>
                <button
                  className="text-gray-500 hover:text-black"
                  onClick={() => setIsModalAddOpen(false)}
                >
                  ✖
                </button>
              </div>
              <p className="text-[#A1A1A1] mb-3">
                Add your education details here.
              </p>
              {/* Degree */}
              <InputField
                label="University"
                name="University"
                value={formInputs.University}
                onChange={(e) =>
                  setFormInputs({ ...formInputs, University: e.target.value })
                }
                required
                className="w-full mb-4"
              />
              {/* Education Type */}
              <InputField
                label="College"
                name="College"
                value={formInputs.College}
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    College: e.target.value,
                  })
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
                    disabled={formInputs.CurrentlyStudying}
                    required={!formInputs.CurrentlyStudying}
                    className={`w-1/2 ${
                      formInputs.CurrentlyStudying
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
                    disabled={formInputs.CurrentlyStudying}
                    className={`w-1/2 ${
                      formInputs.WorkingRole
                        ? "bg-[#EFF0F2] cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
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
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Education;
