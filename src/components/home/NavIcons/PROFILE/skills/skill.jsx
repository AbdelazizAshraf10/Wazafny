import { useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import Modal from "../profile/Modal";

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
    <div className="flex justify-center mt-2">
      <div className="bg-white border border-[#D9D9D9] rounded-xl w-[900px] h-auto p-6 relative">
        {/* Title with Pencil Icon in the Top Right */}
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-[#201A23]">Skills</h3>
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
        </div>

        {/* Displaying the list of skills */}
        <div className="mt-4">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-[#F5F5F5] px-3 py-1 rounded-full text-sm text-[#201A23] flex items-center gap-2"
                >
                  {editingSkillIndex === index ? (
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleEditSkill(index, e.target.value)}
                      onBlur={() => setEditingSkillIndex(null)} // Exit edit mode on blur
                      autoFocus
                      className="border-none outline-none bg-transparent"
                    />
                  ) : (
                    <>
                      <span>{skill}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#A1A1A1]">
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
            <div className="bg-white p-12 rounded-lg shadow-lg w-[819px] max-h-[70vh] overflow-y-auto relative">
              {/* Header with spacing adjustments */}
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#201A23]">Add Skill</h2> {/* Increased font size */}
                <button
                  className="text-gray-500 hover:text-black text-lg" /* Increased icon size */
                  onClick={() => setIsModalAddOpen(false)}
                >
                  ✖
                </button>
              </div>

              {/* Search Bar with increased spacing */}
              <p className="text-[#A1A1A1] text-center mb-6">
                Search for a skill or type a new one and press <span className="font-bold text-[#201A23]">Enter </span>To Add. 
              </p>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddSkill();
                  }
                }}
                placeholder="Search or add a new skill"
                className="w-full px-6 py-3 border border-[#D9D9D9] rounded-md focus:outline-none focus:border-[#201A23] mb-6" /* Increased padding */
              />

              {/* Displaying the list of skills in the modal */}
              <div className="mt-6">
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-[#F5F5F5] px-4 py-2 rounded-full text-sm text-[#201A23] flex items-center gap-2"
                      >
                        <span>{skill}</span>
                        <X
                          className="w-5 h-5 text-[#A1A1A1] hover:text-red-500 cursor-pointer" /* Increased icon size */
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
            <div className="bg-white p-12 rounded-lg shadow-lg w-[650px] max-h-[90vh] overflow-y-auto relative">
              {/* Header with spacing adjustments */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#201A23]">Edit Skills</h2> {/* Increased font size */}
                <button
                  className="text-gray-500 hover:text-black text-lg" /* Increased icon size */
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="w-6 h-6" /> {/* Increased icon size */}
                </button>
              </div>

              {/* Search Bar for Filtering Skills with increased spacing */}
              <input
                type="text"
                value={editSearchTerm}
                onChange={(e) => setEditSearchTerm(e.target.value)}
                placeholder="Search here for your skills.."
                className="w-full px-6 py-3 border border-[#81828E] rounded-md focus:outline-none focus:border-[#201A23] mb-6" /* Increased padding */
              />

              {/* Editable Skills List with increased spacing */}
              <div className="border-2 border-[#201A23] rounded-lg p-6 min-h-[140px] flex flex-wrap gap-4">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-[#201A23] px-4 py-2 rounded-full text-sm text-[#FFFFFF]"
                    >
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleEditSkill(index, e.target.value)}
                        className="border-none outline-none bg-transparent flex-grow px-2"
                      />
                      <X
                        className="w-5 h-5 ml-2 text-gray-500 hover:text-red-500 cursor-pointer" /* Increased icon size */
                        onClick={() => handleDeleteSkill(index)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center">
                    No matching skills found.
                  </p>
                )}
              </div>

              {/* Save Button with increased spacing */}
              <div className="flex justify-end mt-8">
                <button
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 shadow-md text-lg" /* Increased padding and font size */
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