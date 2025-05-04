import { useState, useEffect } from "react"; // Make sure useEffect is imported
import { Pencil, Plus, X } from "lucide-react";
import Modal from "../profile/Modal"; // Adjust path if needed
import Search from "../../../../../assets/searchhh.png"; // Adjust path if needed
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";

// This component matches the structure and styling of your *original* code,
// with only the necessary fixes for state initialization and variable scope.
function Skill({ userRole, initialSkills }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  // Store and use the complete skill objects directly
  const [skillsData, setSkillsData] = useState(
    initialSkills && Array.isArray(initialSkills) ? initialSkills : []
  );


  

  const [searchTerm, setSearchTerm] = useState("");
  const [editSearchTerm, setEditSearchTerm] = useState("");
  const [editingSkillIndex, setEditingSkillIndex] = useState(null); // For original inline edit
  const [apiSkills, setApiSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [floatMessage, setFloatMessage] = useState({ message: "", type: "" });
  const [shouldNavigate, setShouldNavigate] = useState(false);


  // --- ADDED useEffect Hook ---
  // This effect ensures the state updates if the prop changes after initial render.
  useEffect(() => {
    if (initialSkills && Array.isArray(initialSkills)) {
      setSkillsData(initialSkills);
    }
  }, [initialSkills]); // Dependency array: runs when initialSkills changes
  // --- End of Added useEffect Hook ---


  // Function to show float message (Original)
  const showFloatMessage = (type, message) => {
    setFloatMessage({ message, type });
  };

  // Fetch skills for suggestions (Original logic with variable rename)
  const fetchSkills = async (query) => {
    if (!query.trim()) {
      setApiSkills([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      const response = await fetch(
        `https://wazafny.online/api/skill-search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(`Failed to fetch skills: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      

      // *** RENAME local variable to avoid shadowing state variable ***
      let fetchedSkillsData = [];
      if (Array.isArray(data)) {
        fetchedSkillsData = data;
      } else if (data.skills && Array.isArray(data.skills)) {
        fetchedSkillsData = data.skills;
      } else if (data.data && Array.isArray(data.data)) {
        fetchedSkillsData = data.data;
      } else {
        throw new Error("Unexpected API response format"); // Original error handling
      }
      // *** Use the renamed variable ***
      setApiSkills(fetchedSkillsData);

    } catch (err) {
      console.error("Error in fetchSkills:", err.message);
      setError(err.message || "Error fetching skills. Please try again.");
      showFloatMessage("error", err.message || "Error fetching skills. Please try again.");
      setApiSkills([]);
      if (err.message.includes("Authentication failed") || err.message.includes("token")) {
        setShouldNavigate(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce effect for search (Original)
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSkills(searchTerm);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Add Skill (Original Logic - API sends all skills)
  const handleAddSkill = async (skillName, skillId = null) => {
    if (skillName.trim() === "" || skillName.trim().length > 50) {
      setError("Skill cannot be empty or longer than 50 characters.");
      showFloatMessage("error", "Skill cannot be empty or longer than 50 characters.");
      return;
    }
    const seekerId = localStorage.getItem("seeker_id");
    const token = localStorage.getItem("token");
    if (!seekerId || !token) {
      setError("Missing seeker ID or token. Please log in again.");
      showFloatMessage("error", "Missing seeker ID or token. Please log in again.");
      setShouldNavigate(true);
      return;
    }
    const currentSkillNames = skillsData.map(item => item.skill);
    const updatedSkillNames = [...currentSkillNames, skillName.trim()];
    const requestBody = {
      seeker_id: parseInt(seekerId),
      skills: updatedSkillNames, // Send updated list
    };
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://wazafny.online/api/update-skills", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
         if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication failed. Please log in again.");
         }
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.message || `Failed to update skills: ${response.status} ${response.statusText}`);
      }
      
      const newSkillObj = {
        skill_id: skillId || Date.now().toString(), // Use timestamp if no ID from suggestion
        skill: skillName.trim()
      };
      // Update state *after* successful API call in original logic
      setSkillsData([...skillsData, newSkillObj]);
      setSearchTerm("");
      setApiSkills([]);
      showFloatMessage("success", "Skill added."); // Simple success message

    } catch (err) {
       if (err.message.includes("Authentication failed") || err.message.includes("token")) {
        showFloatMessage("error", "Authentication failed. Please log in again.");
        setError("Authentication failed. Please log in again.");
        setShouldNavigate(true);
      } else {
        console.error("Error in handleAddSkill:", err.message);
        setError(err.message || "Error adding skill. Please try again.");
        showFloatMessage("error", err.message || "Error adding skill. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Skill (Original - for inline input value change)
  const handleEditSkill = (index, newValue) => {
    const updatedSkills = [...skillsData];
     // Ensure the skill object exists before trying to update it
    if (updatedSkills[index]) {
         // Assuming skillsData contains objects like { skill_id: ..., skill: ... }
         // If it's just an array of strings, this needs adjustment.
         // Based on initial state logic, it seems to be objects.
        updatedSkills[index] = { ...updatedSkills[index], skill: newValue.trim() };
        setSkillsData(updatedSkills);
    }
    // Note: Closing the input (setEditingSkillIndex(null)) happens onBlur in the input element itself
  };

  // Delete Skill (Original - local state update only)
  const handleDeleteSkill = (index) => {
    const updatedSkills = skillsData.filter((_, i) => i !== index);
    setSkillsData(updatedSkills);
  };

  // Save Skills (Original - From Edit Modal)
  const handleSaveSkills = async () => {
    const seekerId = localStorage.getItem("seeker_id");
    const token = localStorage.getItem("token");
    if (!seekerId || !token) {
      setError("Missing seeker ID or token. Please log in again.");
      showFloatMessage("error", "Missing seeker ID or token. Please log in again.");
      setShouldNavigate(true);
      return;
    }
    // Get all skill names for the API request (Original logic)
    const skillNames = skillsData.map(item => item.skill);
    setIsLoading(true);
    setError(null);
    try {
      const updateResponse = await fetch("https://wazafny.online/api/update-skills", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ seeker_id: parseInt(seekerId), skills: skillNames }),
      });
      if (!updateResponse.ok) {
        if (updateResponse.status === 401 || updateResponse.status === 403) {
          throw new Error("Authentication failed. Please log in again.");
        }
        const errorData = await updateResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update skills: ${updateResponse.status} ${updateResponse.statusText}`);
      }
      console.log("Skills updated successfully");
       showFloatMessage("success", "Skills saved."); // Simple success message
       setIsModalOpen(false); // Close modal
       setEditSearchTerm("");
       setError(null);
    } catch (err) {
      console.error("Error updating skills:", err.message);
       if (err.message.includes("Authentication failed") || err.message.includes("token")) {
          showFloatMessage("error", "Authentication failed. Please log in again.");
          setError("Authentication failed. Please log in again.");
          setShouldNavigate(true);
       } else {
          setError(err.message || "Error updating skills. Please try again.");
          showFloatMessage("error", err.message || "Error updating skills. Please try again.");
       }
       // Keep modal open on error
    } finally {
        setIsLoading(false);
    }
  };

  // Filter skills for Edit modal (Original logic)
  const filteredSkills = skillsData.filter((skillObj) =>
    // Add safety check for skillObj and skill property
    skillObj && typeof skillObj.skill === 'string' &&
    skillObj.skill.toLowerCase().includes(editSearchTerm.toLowerCase())
  );

  // Animation variants (Original)
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
  };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  // Handle navigation (Original)
  if (shouldNavigate) {
    return <Navigate to="/Login" />;
  }

  // --- Original JSX Structure & Styling ---
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
            <div className="flex gap-4 mr-6"> {/* Original gap */}
              <Plus
                className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black" // Original classes
                onClick={() => setIsModalAddOpen(true)}
              />
              <Pencil
                className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black" // Original classes
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Displaying the list of skills (Original list style) */}
        <div className="mt-8">
          {/* Add check for Array.isArray */}
          {Array.isArray(skillsData) && skillsData.length > 0 ? (
            <ul
              className={`${
                skillsData.length > 5 ? "max-h-[200px] overflow-y-auto" : ""
              } mt-1`} // Original classes
            >
              {skillsData.map((skillObj, index) => (
                <li
                  key={skillObj?.skill_id || index} // Use key if available
                  className="py-3 border-b last:border-b-0 text-[#201A23] text-sm md:text-base" // Original classes
                >
                  {editingSkillIndex === index ? (
                    <input
                      type="text"
                      // Add safe access to skill property
                      value={skillObj?.skill || ''}
                      onChange={(e) => handleEditSkill(index, e.target.value)} // Original handler
                      onBlur={() => setEditingSkillIndex(null)} // Original handler
                      onKeyPress={(e) => { if (e.key === 'Enter') setEditingSkillIndex(null); }} // Close on Enter
                      autoFocus
                      className="border-none outline-none bg-transparent w-full ml-6" // Original input style, added ml-6
                      maxLength={50}
                    />
                  ) : (
                    // Original span, add onClick to activate edit
                    <span
                      className="ml-6 font-bold text-md" // Original classes
                      // Only allow editing for non-Company roles
                      onClick={() => userRole !== "Company" && setEditingSkillIndex(index)}
                      style={{ cursor: userRole !== "Company" ? 'pointer' : 'default' }} // Add pointer cursor for edit
                    >
                       {/* Add safe access */}
                       {skillObj?.skill || '...'}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[#A1A1A1] text-sm md:text-base mb-4"> {/* Original classes */}
              List your key skills and expertise here.
            </p>
          )}
        </div>

        {/* --- Original Modal for Adding New Skill --- */}
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
          <AnimatePresence>
            {isModalAddOpen && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" // Original classes
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-[819px] max-h-[70vh] overflow-y-auto relative" // Original classes
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Header */}
                  <div className="flex justify-between mb-4 md:mb-6"> {/* Original classes */}
                    <h2 className="text-lg md:text-xl font-bold text-[#201A23]">Add Skill</h2> {/* Original classes */}
                    <button
                      className="text-gray-500 hover:text-black text-lg scale-150" // Original classes
                      onClick={() => { /* Original close logic */ setIsModalAddOpen(false); setSearchTerm(""); setApiSkills([]); setError(null); }}
                    >
                      ✖ {/* Original icon */}
                    </button>
                  </div>
                  {/* Instructions */}
                  <p className="text-[#A1A1A1] text-center mb-4 md:mb-6 text-sm md:text-base"> {/* Original classes */}
                    Search for a skill or type a new one and press{" "}
                    <span className="font-bold text-[#201A23]">Enter</span> to add.
                  </p>
                  {/* Search Bar */}
                  <div className="relative flex items-center w-full border border-gray-300 rounded-full overflow-hidden"> {/* Original classes */}
                    <img src={Search} alt="Search Icon" className="w-5 h-5 md:w-6 md:h-6 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"/> {/* Original classes */}
                    <input
                      autoFocus
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => { if (e.key === "Enter") { handleAddSkill(searchTerm); } }} // Original handler
                      placeholder="Search here for your skills"
                      className="w-full pl-12 pr-4 py-2 text-gray-700 bg-white focus:outline-none rounded-full" // Original classes
                      maxLength={50}
                    />
                  </div>
                  {/* API Suggestions */}
                  <div className="mt-2 min-h-[24px]"> {/* Added min-height for layout consistency */}
                    {isLoading && searchTerm && <p className="text-gray-500 text-sm">Loading...</p>} {/* Original loading */}
                    {error && <p className="text-red-500 text-sm">{error}</p>} {/* Original error display */}
                    {/* Original Suggestions List */}
                    {!isLoading && !error && apiSkills.length > 0 && (
                      <ul className="border border-gray-300 rounded-lg max-h-[150px] overflow-y-auto bg-white absolute z-10 w-[calc(100%-4rem)] left-8 shadow-lg"> {/* Position relative to input approx */}
                        {apiSkills.map((skillObj) => (
                          <li
                            key={skillObj.skill_id} // Original key
                            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer" // Original classes
                            onClick={() => handleAddSkill(skillObj.skill, skillObj.skill_id)} // Original handler
                            onMouseDown={(e)=>e.preventDefault()} // Prevent input blur
                          >
                            {skillObj.skill}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Displaying the list of skills in the modal */}
                  <div className="mt-4 md:mt-6"> {/* Original classes */}
                    {Array.isArray(skillsData) && skillsData.length > 0 && ( // Check array
                      <div className="flex flex-wrap gap-2 md:gap-4"> {/* Original classes */}
                        {skillsData.map((skillObj, index) => (
                          <div
                            key={skillObj?.skill_id || index} // Original key logic
                            className="bg-[#F5F5F5] px-3 py-1 rounded-full text-sm md:text-base text-[#201A23] flex items-center gap-2" // Original classes
                          >
                            <span>{skillObj?.skill || ''}</span> {/* Safe access */}
                            <X
                              className="w-4 h-4 md:w-5 md:h-5 text-[#A1A1A1] hover:text-red-500 cursor-pointer" // Original classes
                              onClick={() => handleDeleteSkill(index)} // Original handler
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Modal>

        {/* --- Original Modal for Editing Skills --- */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditSearchTerm("");
            setError(null);
            // Optional: Reset changes if closed without save
            // if (initialSkills && Array.isArray(initialSkills)) setSkillsData(initialSkills);
          }}
          title={"Edit Skills"}
        >
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" // Original classes
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-[750px] max-h-[90vh] overflow-y-auto relative" // Original classes
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-2 md:mb-2"> {/* Original classes */}
                    <h2 className="text-lg md:text-xl font-bold text-[#201A23]">Edit Skills</h2> {/* Original classes */}
                    <button
                      className="text-gray-500 hover:text-black text-lg" // Original classes
                      onClick={() => { /* Original close logic */ setIsModalOpen(false); setEditSearchTerm(""); setError(null); }}
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6 scale-150" /> {/* Original classes */}
                    </button>
                  </div>
                  <p className="mb-3 text-[#A1A1A1]"> {/* Original classes */}
                    List your key skills and expertise here.
                  </p>
                  {/* Search Bar for Filtering Skills */}
                  <div className="relative flex items-center w-full border border-[#81828E] rounded-md mb-5 overflow-hidden"> {/* Original classes */}
                    <img src={Search} alt="Search Icon" className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/> {/* Original classes */}
                    <input
                      type="text"
                      value={editSearchTerm}
                      onChange={(e) => setEditSearchTerm(e.target.value)}
                      placeholder="Search here for your skills..."
                      className="w-full pl-12 pr-4 py-2 text-gray-700 bg-white focus:outline-none border-none rounded-full" // Original classes
                    />
                  </div>
                  {/* Error Display Area */}
                  <div className="mt-2 min-h-[20px]"> {/* Added min-height */}
                    {error && <p className="text-red-500 text-sm">{error}</p>} {/* Original error display */}
                  </div>
                  {/* Editable Skills List */}
                  <div className="border border-gray-900 rounded-lg p-4 min-h-[100px] flex flex-wrap items-start gap-2 mt-4"> {/* Original classes */}
                     {/* Use filteredSkills */}
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((skillObj) => {
                         // Find original index for delete action
                        const originalIndex = skillsData.findIndex(s => s.skill_id ? s.skill_id === skillObj.skill_id : s.skill === skillObj.skill);
                         if (originalIndex === -1) return null;

                         return (
                          <div
                            key={skillObj?.skill_id || originalIndex} // Original key
                            className="flex items-center bg-black text-white px-2 py-0.5 rounded-md text-xs whitespace-nowrap" // Original classes
                            style={{ /* Original inline styles */ backgroundColor: "black", padding: "0.5rem", borderRadius: "0.5rem", width: "fit-content" }}
                          >
                            <span>{skillObj?.skill || ''}</span> {/* Safe access */}
                            <X
                              className="w-3 h-3 ml-1 text-white hover:text-red-400 cursor-pointer" // Original classes
                              onClick={() => handleDeleteSkill(originalIndex)} // Use original index
                            />
                          </div>
                         );
                        })
                    ) : (
                      <p className="text-gray-400 text-xs text-center w-full"> {/* Original classes */}
                        {editSearchTerm ? 'No matching skills found.' : 'No skills to display.'}
                      </p>
                    )}
                  </div>
                  {/* Save Button */}
                  <div className="flex justify-end mt-4 md:mt-8"> {/* Original classes */}
                    <button
                      className={`bg-black text-white px-4 md:px-9 py-2 md:py-2 font-bold rounded-lg hover:bg-gray-800 shadow-md text-sm md:text-base ${isLoading ? 'opacity-50 cursor-not-allowed': ''}`} // Original classes + loading state
                      onClick={handleSaveSkills} // Original handler
                      disabled={isLoading}
                    >
                       {isLoading ? 'Saving...' : 'Save'} {/* Original text + loading */}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Modal>

         

      </div>
    </div>
  );
}

export default Skill;