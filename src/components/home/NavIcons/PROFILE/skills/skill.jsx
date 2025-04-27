import { useState, useEffect } from "react";
import { Pencil, Plus, X } from "lucide-react";
import Modal from "../profile/Modal";
import Search from "../../../../../assets/searchhh.png";

function Skill({ userRole, initialSkills }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for editing skills
  const [isModalAddOpen, setIsModalAddOpen] = useState(false); // State for adding skills
  const [skills, setSkills] = useState(
    initialSkills && Array.isArray(initialSkills)
      ? initialSkills.map((skillObj) => skillObj.skill || "")
      : []
  ); // Initialize with skill names as strings
  const [originalSkills, setOriginalSkills] = useState(
    initialSkills && Array.isArray(initialSkills) ? initialSkills : []
  ); // Store original skills with IDs
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input in the "Add Skill" modal
  const [editSearchTerm, setEditSearchTerm] = useState(""); // State for the search input in the "Edit Skills" modal
  const [editingSkillIndex, setEditingSkillIndex] = useState(null); // Index of the skill being edited
  const [apiSkills, setApiSkills] = useState([]); // State to store API-fetched skills
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Function to fetch skills from the API (used only in "Add Skill" modal)
  const fetchSkills = async (query) => {
    if (!query.trim()) {
      setApiSkills([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }

      const response = await fetch(`https://wazafny.online/api/skill-search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(`Failed to fetch skills: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Skill Search API Response:", data); // Log the response to debug

      // Handle different possible response structures
      let skillsData = [];
      if (Array.isArray(data)) {
        skillsData = data; // Direct array
      } else if (data.skills && Array.isArray(data.skills)) {
        skillsData = data.skills; // Object with skills array
      } else if (data.data && Array.isArray(data.data)) {
        skillsData = data.data; // Object with data array (common in some APIs)
      } else {
        throw new Error("Unexpected API response format");
      }

      setApiSkills(skillsData);
    } catch (err) {
      console.error("Error in fetchSkills:", err.message);
      setError(err.message || "Error fetching skills. Please try again.");
      setApiSkills([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced API call when search term changes (only for "Add Skill" modal)
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSkills(searchTerm);
    }, 300); // 300ms debounce to avoid excessive API calls
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Function to handle adding a new skill
  const handleAddSkill = (skill = searchTerm) => {
    if (skill.trim() !== "" && skill.trim().length <= 50) {
      setSkills((prevSkills) => [...prevSkills, skill.trim()]);
      setSearchTerm(""); // Clear the search bar after adding
      setApiSkills([]); // Clear suggestions
    }
  };

  // Function to handle editing a skill
  const handleEditSkill = (index, newValue) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = newValue.trim();
    setSkills(updatedSkills);
    setEditingSkillIndex(null); // Exit edit mode
  };

  // Function to handle deleting a skill locally
  const handleDeleteSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  // Function to delete skills via API when "Save" is clicked
  const handleSaveSkills = async () => {
    const seekerId = localStorage.getItem("seeker_id");
    const token = localStorage.getItem("token");

    if (!seekerId || !token) {
      setError("Missing seeker ID or token. Please log in again.");
      return;
    }

    // Identify deleted skills by comparing originalSkills with current skills
    const deletedSkills = originalSkills.filter(
      (originalSkill) => !skills.includes(originalSkill.skill)
    );

    // Make DELETE API calls for each deleted skill
    for (const deletedSkill of deletedSkills) {
      try {
        const response = await fetch(
          `https://wazafny.online/api/delete-skill/${seekerId}/${deletedSkill.skill_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Authentication failed. Please log in again.");
          }
          throw new Error(`Failed to delete skill: ${response.status} ${response.statusText}`);
        }

        console.log(`Skill ${deletedSkill.skill} deleted successfully`);
      } catch (err) {
        console.error("Error deleting skill:", err.message);
        setError(err.message || "Error deleting skill. Please try again.");
        return; // Stop if there's an error
      }
    }

    // Update originalSkills to match the current skills state
    setOriginalSkills(
      skills.map((skill) => {
        const existingSkill = originalSkills.find((os) => os.skill === skill);
        return existingSkill || { skill }; // Keep skill_id if it exists, otherwise just the skill name
      })
    );

    // Close the modal and reset states
    setIsModalOpen(false);
    setEditSearchTerm("");
    setApiSkills([]);
    setError(null);
  };

  // Filter skills based on the search term in the "Edit Skills" modal
  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(editSearchTerm.toLowerCase())
  );

  return (
    <div className="flex justify-center mt-4 w-full">
      {/* Main Container */}
      <div className="bg-white border border-[#D9D9D9] rounded-xl w-full max-w-[900px] relative">
        {/* Title with Pencil Icon in the Top Right */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-bold mt-5 ml-6 text-[#201A23]">
            Skills
          </h3>
          {userRole !== "Company" && (
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
          )}
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
                      maxLength={50}
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
          onClose={() => {
            setIsModalAddOpen(false);
            setSearchTerm("");
            setApiSkills([]);
            setError(null);
          }}
          title={"Add New Skill"}
        >
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-[819px] max-h-[70vh] overflow-y-auto relative">
              {/* Header */}
              <div className="flex justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-[#201A23]">
                  Add Skill
                </h2>
                <button
                  className="text-gray-500 hover:text-black text-lg scale-150"
                  onClick={() => {
                    setIsModalAddOpen(false);
                    setSearchTerm("");
                    setApiSkills([]);
                    setError(null);
                  }}
                >
                  ✖
                </button>
              </div>

              {/* Instructions */}
              <p className="text-[#A1A1A1] text-center mb-4 md:mb-6 text-sm md:text-base">
                Search for a skill or type a new one and press{" "}
                <span className="font-bold text-[#201A23]">Enter</span> to add.
              </p>

              {/* Search Bar */}
              <div className="relative flex items-center w-full border border-gray-300 rounded-full overflow-hidden">
                <img
                  src={Search}
                  alt="Search Icon"
                  className="w-5 h-5 md:w-6 md:h-6 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
                />
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

              {/* API Suggestions */}
              <div className="mt-2">
                {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {apiSkills.length > 0 && (
                  <ul className="border border-gray-300 rounded-lg max-h-[150px] overflow-y-auto bg-white">
                    {apiSkills.map((skillObj) => (
                      <li
                        key={skillObj.skill_id} // Use skill_id as the unique key
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAddSkill(skillObj.skill)} // Pass only the skill string
                      >
                        {skillObj.skill} {/* Render the skill string */}
                      </li>
                    ))}
                  </ul>
                )}
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
                          onClick={() => handleDeleteSkill(index)}
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
          onClose={() => {
            setIsModalOpen(false);
            setEditSearchTerm("");
            setApiSkills([]);
            setError(null);
          }}
          title={"Edit Skills"}
        >
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-[750px] max-h-[90vh] overflow-y-auto relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-2 md:mb-2">
                <h2 className="text-lg md:text-xl font-bold text-[#201A23]">
                  Edit Skills
                </h2>
                <button
                  className="text-gray-500 hover:text-black text-lg"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditSearchTerm("");
                    setApiSkills([]);
                    setError(null);
                  }}
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 scale-150" />
                </button>
              </div>
              <p className="mb-3 text-[#A1A1A1]">
                List your key skills and expertise here.
              </p>

              {/* Search Bar for Filtering Skills */}
              <div className="relative flex items-center w-full border border-[#81828E] rounded-md mb-5 overflow-hidden">
                <img
                  src={Search}
                  alt="Search Icon"
                  className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={editSearchTerm}
                  onChange={(e) => setEditSearchTerm(e.target.value)}
                  placeholder="Search here for your skills..."
                  className="w-full pl-12 pr-4 py-2 text-gray-700 bg-white focus:outline-none border-none rounded-full"
                />
              </div>

              {/* No API Suggestions in Edit Skills Modal */}
              <div className="mt-2">
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              {/* Editable Skills List */}
              <div className="border border-gray-900 rounded-lg p-4 min-h-[100px] flex flex-wrap items-start gap-2 mt-4">
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
                      <span>{skill}</span>
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

              {/* Save Button */}
              <div className="flex justify-end mt-4 md:mt-8">
                <button
                  className="bg-black text-white px-4 md:px-9 py-2 md:py-2 font-bold rounded-lg hover:bg-gray-800 shadow-md text-sm md:text-base"
                  onClick={handleSaveSkills} // Call the new function to handle deletions
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