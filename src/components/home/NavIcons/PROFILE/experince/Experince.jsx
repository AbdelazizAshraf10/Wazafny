import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import Modal from "../profile/Modal";
import { InputField, SelectField } from "../profile/my-component";

import Logo from "../../../../../assets/companyExpLogo.png";

function Experience() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalِaddOpen, setIsModaladdOpen] = useState(false);
  const [experienceList, setExperienceList] = useState([]); // Store experiences
  const [editingIndex, setEditingIndex] = useState(null);

  const [formInputs, setFormInputs] = useState({
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
  ];

  const handleSave = (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (
      !formInputs.Title ||
      !formInputs.Company ||
      !formInputs.StartDate.Month ||
      !formInputs.StartDate.Year
    ) {
      return;
    }
  
    if (editingIndex !== null) {
      // Editing an existing experience
      const updatedExperiences = [...experienceList];
      updatedExperiences[editingIndex] = formInputs;
      setExperienceList(updatedExperiences);
      setEditingIndex(null);
    } else {
      // Adding a new experience
      setExperienceList([...experienceList, formInputs]);
    }
  
    // Close the modal after saving
    setIsModalOpen(false);
    setIsModaladdOpen(false);
    
    // Reset form fields
    setFormInputs({
      Title: "",
      EmploymentType: "",
      Company: "",
      StartDate: { Month: "", Year: "" },
      EndDate: { Month: "", Year: "" },
      WorkingRole: false,
    });
  };
  



  
  
  const handleEdit = (index) => {
    
  
    const experienceToEdit = experienceList[index];
    setFormInputs(experienceToEdit);
    setEditingIndex(index);
    setIsModaladdOpen(true);
    setIsModalOpen(false);
  };
  
  


  const handleDelete = (index) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  return (
    <div className="max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] xl:max-h-[80vh] 2xl:max-h-[80vh] 3xl:max-h-[80vh] 4xl:max-h-[80vh] ">
    <div className="flex  mt-2 ">
      <div className="bg-white border border-[#D9D9D9] rounded-xl w-[900px] p-6 ">
        {/* Header with Icon */}
        <div className="flex justify-between  ">
          <h3 className="text-xl font-bold text-[#201A23]">Experience</h3>
          <div className="flex gap-4 ">
            <Plus
              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
              onClick={() => setIsModaladdOpen(true)}
            />

            <Pencil
              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        {/* Display Experience List or Placeholder */}
        {experienceList.length === 0 ? (
          <div className="text-center mt-7 text-[#A1A1A1]">
            Add your work experience, including job roles and responsibilities,
            here.
          </div>
        ) : (
          experienceList.map((exp, index) => (
            <div
              key={index}
              className="text-left flex mt-4 border-t pt-4  gap-4"
            >
              <img src={Logo}  className="w-[48px] h-[54px] mt-2.5"/>
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




      {/* modal for edit Experience */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="edit Experience"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form
            className="bg-white p-6 rounded-lg shadow-lg w-[700px] text-left relative overflow-y-auto max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] xl:max-h-[80vh] 2xl:max-h-[80vh] 3xl:max-h-[80vh] 4xl:max-h-[80vh] "
            onSubmit={() => setIsModalOpen(false)}
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
                      <img src={Logo} className="w-[48px] h-[54px] mt-2.5" />
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
                        className="w-5 h-5  fill-[#201A23] cursor-pointer "
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
              onClick={() => setIsModaladdOpen(true)}
              className="flex items-center gap-2 text-[#6A0DAD]  hover:text-black"
            >
              <span className="text-2xl">+</span> Add new Experience
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

      {/* Modal for ADD Experience */}
      <Modal
        isOpen={isModalِaddOpen}
        onClose={() => setIsModaladdOpen(false)}
        title="edit Experience"
        
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form
            className="bg-white p-6 rounded-lg shadow-lg w-[700px] text-left relative overflow-y-auto max-h-[90vh] space-y-3"
            onSubmit={handleSave}
          >
            <div className="flex justify-between items-center mb-3 relative">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <button
                className="text-gray-500 hover:text-black absolute top-0 right-0"
                onClick={() => setIsModaladdOpen(false)}
              >
                ✖
              </button>
            </div>

            {/* Title */}
            <InputField
              label="Title"
              name="Title"
              value={formInputs.Title}
              onChange={(e) =>
                setFormInputs({ ...formInputs, Title: e.target.value })
              }
              required
            />

            {/* Employment Type */}
            <InputField
              label="Employment Type"
              name="EmploymentType"
              value={formInputs.EmploymentType}
              onChange={(e) =>
                setFormInputs({ ...formInputs, EmploymentType: e.target.value })
              }
              required
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
            />

            {/* Start Date */}
            <div className="flex gap-4 mb-4">
              <SelectField
                label="Month"
                name="Month"
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
              />
              <SelectField
                label="Start year"
                name="Year"
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
              />
            </div>

            {/* End Date */}
            <div className="flex gap-4 mb-4">
              <SelectField
                label="End Date"
                name="Month"
                value={formInputs.EndDate.Month}
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    EndDate: { ...formInputs.EndDate, Month: e.target.value },
                  })
                }
                options={Month}
                required
              />
              <SelectField
                label=""
                name="Year"
                value={formInputs.EndDate.Year}
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    EndDate: { ...formInputs.EndDate, Year: e.target.value },
                  })
                }
                options={Year}
                required
              />
            </div>

            {/* Currently Working Checkbox */}
            <div className="flex mb-3 space-x-2">
              <input
                type="checkbox"
                checked={formInputs.WorkingRole}
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    WorkingRole: e.target.checked,
                  })
                }
                className="size-5 accent-black"
              />
              <p>I am currently working in this role</p>
            </div>

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
    </div>
    </div>
  );
}

export default Experience;
