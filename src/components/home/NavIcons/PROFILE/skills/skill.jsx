import { useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import Modal from "../profile/Modal";
import Search from "../../../../../assets/searchhh.png";

function Skill() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for editing skills
  const [isModalAddOpen, setIsModalAddOpen] = useState(false); // State for adding skills
  const [skills, setSkills] = useState([]); // State to store the list of skills
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input in the "Add Skill" modal
  const [editSearchTerm, setEditSearchTerm] = useState(""); // State for the search input in the "Edit Skills" modal
  const [editingSkillIndex, setEditingSkillIndex] = useState(null); // Index of the skill being edited

  // Function to handle adding a new skill
  const handleAddSkill = () => {
    if (searchTerm.trim() !== "") {
      setSkills((prevSkills) => [...prevSkills, searchTerm.trim()]);
      setSearchTerm(""); // Clear the search bar after adding
    }
  };

  // Function to handle editing a skill
  const handleEditSkill = (index, newValue) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = newValue.trim();
    setSkills(updatedSkills);
    setEditingSkillIndex(null); // Exit edit mode
  };

  // Function to handle deleting a skill
  const handleDeleteSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  // Filter skills based on the search term in the "Edit Skills" modal
  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(editSearchTerm.toLowerCase())
  );

  return (
    <div className="flex justify-center mt-4 w-full">
      {/* Main Container */}
      <div className="bg-white border border-[#D9D9D9] rounded-xl w-full max-w-[900px]   relative">
        {/* Title with Pencil Icon in the Top Right */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-bold mt-5 ml-6 text-[#201A23]">
            Skills
          </h3>
          <div className="flex gap-4 mr-6">
            <Plus
              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
              onClick={() => setIsModalAddOpen(true)}
            />
            <Pencil
              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        {/* Displaying the list of skills */}
        <div className="mt-8">
          {skills.length > 0 ? (
            <ul
              className={`${
                skills.length > 5 ? "max-h-[200px] overflow-y-auto" : ""
              } mt-1`}
            >
              {skills.map((skill, index) => (
                <li
                  key={index}
                  className="py-3 border-b last:border-b-0 text-[#201A23] text-sm md:text-base"
                >
                  {editingSkillIndex === index ? (
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleEditSkill(index, e.target.value)}
                      onBlur={() => setEditingSkillIndex(null)}
                      autoFocus
                      className="border-none outline-none bg-transparent w-full"
                    />
                  ) : (
                    <span className="ml-6 font-bold text-md">{skill}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[#A1A1A1] text-sm md:text-base mb-4">
              List your key skills and expertise here.
            </p>
          )}
        </div>

        {/* Modal for Adding New Skill */}
        <Modal
          isOpen={isModalAddOpen}
          onClose={() => setIsModalAddOpen(false)}
          title={"Add New Skill"}
        >
          {/* Added extra padding and margin for better spacing */}
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-[819px] max-h-[70vh] overflow-y-auto relative">
              {/* Header with spacing adjustments */}
              <div className="flex justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-[#201A23]">
                  Add Skill
                </h2>
                <button
                  className="text-gray-500 hover:text-black text-lg scale-150"
                  onClick={() => setIsModalAddOpen(false)}
                >
                  ✖
                </button>
              </div>

              {/* Search Bar with increased spacing */}
              <p className="text-[#A1A1A1] text-center mb-4 md:mb-6 text-sm md:text-base">
                Search for a skill or type a new one and press{" "}
                <span className="font-bold text-[#201A23]">Enter</span> to add.
              </p>
              <div className="relative flex items-center w-full border border-gray-300 rounded-full overflow-hidden">
                {/* Search Icon */}
                <img
                  src={Search}
                  alt="Search Icon"
                  className="w-5 h-5 md:w-6 md:h-6 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
                />
                {/* Input Field */}
                <input
                  autoFocus
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddSkill();
                    }
                  }}
                  placeholder="Search here for your skills"
                  className="w-full pl-12 pr-4 py-2 text-gray-700 bg-white focus:outline-none rounded-full"
                />
              </div>

              {/* Displaying the list of skills in the modal */}
              <div className="mt-4 md:mt-6">
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-[#F5F5F5] px-3 py-1 rounded-full text-sm md:text-base text-[#201A23] flex items-center gap-2"
                      >
                        <span>{skill}</span>
                        <X
                          className="w-4 h-4 md:w-5 md:h-5 text-[#A1A1A1] hover:text-red-500 cursor-pointer"
                          onClick={() => handleDeleteSkill(index)} // Delete skill
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>

        {/* Modal for Editing Skills */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={"Edit Skills"}
        >
          {/* Added extra padding and margin for better spacing */}
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-[750px] max-h-[90vh] overflow-y-auto relative">
              {/* Header with spacing adjustments */}
              <div className="flex justify-between items-center mb-2 md:mb-2">
                <h2 className="text-lg md:text-xl font-bold text-[#201A23]">
                  Edit Skills
                </h2>

                <button
                  className="text-gray-500 hover:text-black text-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 scale-150" />
                </button>
              </div>
              <p className="mb-3 text-[#A1A1A1]">
                List your key skills and expertise here.
              </p>

              {/* Search Bar for Filtering Skills with increased spacing */}
              <div className="relative flex items-center w-full border border-[#81828E] rounded-md mb-5 overflow-hidden">
                {/* Search Icon */}
                <img
                  src={Search}
                  alt="Search Icon"
                  className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                {/* Input Field */}
                <input
                  type="text"
                  value={editSearchTerm}
                  onChange={(e) => setEditSearchTerm(e.target.value)}
                  placeholder="Search here for your skills..."
                  className="w-full pl-12 pr-4 py-2 text-gray-700 bg-white focus:outline-none border-none rounded-full"
                />
              </div>

              {/* Editable Skills List with better styling */}
              <div className="border border-gray-900 rounded-lg p-4 min-h-[100px] flex flex-wrap items-start gap-2">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-black text-white px-2 py-0.5 rounded-md text-xs whitespace-nowrap"
                      style={{
                        backgroundColor: "black",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        width: "fit-content",
                      }}
                    >
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleEditSkill(index, e.target.value)}
                        className="border-none outline-none bg-transparent  text-white px-1 text-xs md:text-sm"
                      />
                      <X
                        className="w-3 h-3 ml-1 text-white hover:text-red-400 cursor-pointer"
                        onClick={() => handleDeleteSkill(index)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs text-center w-full">
                    No matching skills found.
                  </p>
                )}
              </div>
                  
              {/* Save Button with increased spacing */}
              <div className="flex justify-end mt-4 md:mt-8">
                <button
                  className="bg-black text-white px-4 md:px-9 py-2 md:py-2 font-bold rounded-lg hover:bg-gray-800 shadow-md text-sm md:text-base"
                  onClick={() => setIsModalOpen(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Skill;
