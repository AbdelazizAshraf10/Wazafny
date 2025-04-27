import { Pencil, Plus, Trash } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "../profile/Modal";
import { InputField, SelectField } from "../profile/my-component";
import Logo from "../../../../../assets/Education.png";

function Education({ userRole, initialEducation }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [educationList, setEducationList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [universities, setUniversities] = useState(["Select University"]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    University: "",
    College: "",
    StartDate: { Month: "", Year: "" },
    EndDate: { Month: "", Year: "" },
    CurrentlyStudying: false,
  });
  const dropdownRef = useRef(null);

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

  const fallbackUniversities = [
    "Select University",
    "Harvard University",
    "Stanford University",
    "Massachusetts Institute of Technology (MIT)",
    "University of Oxford",
    "University of Cambridge",
  ];

  // Initialize educationList with initialEducation
  useEffect(() => {
    if (initialEducation) {
      const formatDate = (dateStr) => {
        const [monthAbbr, year] = dateStr.split(" ");
        const monthMap = {
          Jan: "January",
          Feb: "February",
          Mar: "March",
          Apr: "April",
          May: "May",
          Jun: "June",
          Jul: "July",
          Aug: "August",
          Sep: "September",
          Oct: "October",
          Nov: "November",
          Dec: "December",
        };
        const fullMonth = monthMap[monthAbbr] || monthAbbr;
        return { Month: fullMonth, Year: year };
      };

      const educationData = {
        University: initialEducation.university,
        College: initialEducation.college,
        StartDate: formatDate(initialEducation.start_date),
        EndDate:
          initialEducation.end_date === "Present"
            ? { Month: "", Year: "" }
            : formatDate(initialEducation.end_date),
        CurrentlyStudying: initialEducation.end_date === "Present",
      };

      setEducationList([educationData]);
    } else {
      setEducationList([]);
    }
  }, [initialEducation]);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json"
        );
        const universityNames = response.data.map((uni) => uni.name);
        setUniversities(["Select University", ...universityNames]);
        setFilteredUniversities(["Select University", ...universityNames]);
        setError(null);
      } catch (err) {
        console.error("Error fetching universities:", err);
        setError("Failed to load universities. Using fallback options.");
        setUniversities(fallbackUniversities);
        setFilteredUniversities(fallbackUniversities);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFormInputs({ ...formInputs, University: query });

    if (query.trim() === "") {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter((uni) =>
        uni.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUniversities(
        filtered.length > 0 ? filtered : ["No results found"]
      );
    }
    setIsDropdownOpen(true);
  };

  const handleSelectUniversity = (university) => {
    if (university !== "No results found" && university !== "Select University") {
      setFormInputs({ ...formInputs, University: university });
      setSearchQuery(university);
    }
    setIsDropdownOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !formInputs.University ||
      !formInputs.College ||
      !formInputs.StartDate.Month ||
      !formInputs.StartDate.Year
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const seekerId = localStorage.getItem("seeker_id");
    const token = localStorage.getItem("token");

    if (!seekerId || !token) {
      setError("User authentication details are missing.");
      return;
    }

    const educationData = {
      seeker_id: parseInt(seekerId),
      university: formInputs.University,
      college: formInputs.College,
      start_date: `${formInputs.StartDate.Month.slice(0, 3)} ${
        formInputs.StartDate.Year
      }`,
      end_date: formInputs.CurrentlyStudying
        ? "Present"
        : `${formInputs.EndDate.Month.slice(0, 3)} ${formInputs.EndDate.Year}`,
    };

    try {
      await axios.post(
        "https://wazafny.online/api/update-education",
        educationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (editingIndex !== null) {
        const updatedEducations = [...educationList];
        updatedEducations[editingIndex] = formInputs;
        setEducationList(updatedEducations);
        setEditingIndex(null);
      } else {
        setEducationList([...educationList, formInputs]);
      }

      setIsModalOpen(false);
      setIsModalAddOpen(false);
      setFormInputs({
        University: "",
        College: "",
        StartDate: { Month: "", Year: "" },
        EndDate: { Month: "", Year: "" },
        CurrentlyStudying: false,
      });
      setSearchQuery("");
      setFilteredUniversities(universities);
      setError(null);
    } catch (err) {
      console.error("Error saving education:", err);
      setError("Failed to save education details. Please try again.");
    }
  };

  const handleEdit = (index) => {
    const educationToEdit = educationList[index];
    setFormInputs(educationToEdit);
    setSearchQuery(educationToEdit.University);
    setEditingIndex(index);
    setIsModalAddOpen(true);
    setIsModalOpen(false);
  };

  const handleDelete = async (index) => {
    const seekerId = localStorage.getItem("seeker_id");
    const token = localStorage.getItem("token");

    if (!seekerId || !token) {
      setError("User authentication details are missing.");
      return;
    }

    try {
      await axios.delete(
        `https://wazafny.online/api/delete-education/${seekerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEducationList(educationList.filter((_, i) => i !== index));
      setError(null);
    } catch (err) {
      console.error("Error deleting education:", err);
      setError("Failed to delete education. Please try again.");
    }
  };

  return (
    <div className="max-h-[80vh]">
      <div className="flex mt-2">
        <div className="bg-white border border-[#D9D9D9] rounded-xl w-[900px] p-6">
          <div className="flex justify-between">
            <h3 className="text-xl font-bold text-[#201A23]">Education</h3>
            {userRole !== "Company" && (
              <div className="flex gap-4">
                <Plus
                  className={`w-5 h-5 text-gray-600 cursor-pointer hover:text-black ${
                    educationList.length > 0 ? "hidden" : ""
                  }`}
                  onClick={() => setIsModalAddOpen(true)}
                />
                <Pencil
                  className={`w-5 h-5 text-gray-600 cursor-pointer hover:text-black ${
                    educationList.length === 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  onClick={() => educationList.length > 0 && setIsModalOpen(true)}
                />
              </div>
            )}
          </div>
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
              {loading && (
                <p className="text-gray-600 mb-3">Loading universities...</p>
              )}
              {error && <p className="text-red-600 mb-3">{error}</p>}
              <div className="mb-4 relative" ref={dropdownRef}>
                <label className="text-sm font-medium text-gray-700">
                  University*
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search for a university"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  disabled={loading}
                />
                {isDropdownOpen && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredUniversities.map((uni, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectUniversity(uni)}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                          uni === "No results found" ? "text-gray-500" : ""
                        }`}
                      >
                        {uni}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
                    required={!formInputs.CurrentlyStudying}
                    className={`w-1/2 ${
                      formInputs.CurrentlyStudying
                        ? "bg-[#EFF0F2] cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  checked={formInputs.CurrentlyStudying}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      CurrentlyStudying: e.target.checked,
                      ...(e.target.checked && {
                        EndDate: { Month: "", Year: "" },
                      }),
                    })
                  }
                  className="size-5 accent-black"
                />
                <label className="text-sm font-medium text-gray-700">
                  I am currently studying
                </label>
              </div>
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