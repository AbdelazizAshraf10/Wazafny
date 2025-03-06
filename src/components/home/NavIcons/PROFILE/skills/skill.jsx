import { useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import Modal from "../profile/Modal";

function Skill() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for editing skills
  const [isModalAddOpen, setIsModalAddOpen] = useState(false); // State for adding skills
  const [skills, setSkills] = useState([]); // State to store the list of skills
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input
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
                      <button
                        className="text-[#A1A1A1] hover:text-red-500"
                        onClick={() => setEditingSkillIndex(index)} // Enter edit mode
                      >
                        ✎
                      </button>
                      <X
                        className="w-4 h-4 text-[#A1A1A1] hover:text-red-500 cursor-pointer"
                        onClick={() => handleDeleteSkill(index)} // Delete skill
                      />
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-10 rounded-lg shadow-lg w-[819px] h-auto relative">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Add Skill</h2>
                <button
                  className="text-gray-500 hover:text-black"
                  onClick={() => setIsModalAddOpen(false)}
                >
                  ✖
                </button>
              </div>

              <p className="text-[#A1A1A1] text-center mb-4">
                Search for a skill or type a new one and press Enter to add.
              </p>

              {/* Search Bar */}
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
                className="w-full px-4 py-2 border border-[#D9D9D9] rounded-md focus:outline-none focus:border-[#201A23]"
              />

              {/* Displaying the list of skills in the modal */}
              <div className="mt-4">
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-[#F5F5F5] px-3 py-1 rounded-full text-sm text-[#201A23] flex items-center gap-2"
                      >
                        <span>{skill}</span>
                        <X
                          className="w-4 h-4 text-[#A1A1A1] hover:text-red-500 cursor-pointer"
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-10 rounded-lg shadow-lg w-[819px] h-auto relative">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Edit Skills</h2>
                <button
                  className="text-gray-500 hover:text-black"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✖
                </button>
              </div>

              {/* Displaying editable skills */}
              <div className="mt-4">
                {skills.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-[#F5F5F5] px-3 py-1 rounded-full text-sm text-[#201A23]"
                      >
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleEditSkill(index, e.target.value)}
                          className="border-none outline-none bg-transparent flex-grow"
                        />
                        <X
                          className="w-4 h-4 text-[#A1A1A1] hover:text-red-500 cursor-pointer"
                          onClick={() => handleDeleteSkill(index)} // Delete skill
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-[#A1A1A1]">
                    No skills to edit. Add some skills first.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Skill;