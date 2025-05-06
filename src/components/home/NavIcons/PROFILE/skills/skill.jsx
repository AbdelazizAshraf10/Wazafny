import { useState, useEffect } from "react";
import { Pencil, Plus, X } from "lucide-react";
import Modal from "../profile/Modal"; // Adjust path if needed
import Search from "../../../../../assets/searchhh.png"; // Adjust path if needed
import { motion, AnimatePresence } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom"; // Import useNavigate

// This component matches the structure and styling of your *original* code,
// with only the necessary fixes for state initialization and variable scope.
function Skill({ userRole, initialSkills }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const [skillsData, setSkillsData] = useState(
    initialSkills && Array.isArray(initialSkills) ? initialSkills : []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [editSearchTerm, setEditSearchTerm] = useState("");
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [apiSkills, setApiSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Error state for API calls within modals
  const [floatMessage, setFloatMessage] = useState({ message: "", type: "" }); // Assuming this is for a different notification system
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigateHook = useNavigate(); // Renamed to avoid conflict if 'navigate' is a prop

  useEffect(() => {
    if (initialSkills && Array.isArray(initialSkills)) {
      setSkillsData(initialSkills);
    }
  }, [initialSkills]);

  const showFloatMessage = (type, message) => {
    setFloatMessage({ message, type });
    // Optional: Auto-hide float message after some time
    // setTimeout(() => setFloatMessage({ message: "", type: "" }), 3000);
  };

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
        `https://laravel.wazafny.online/api/skill-search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(`Failed to fetch skills: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      let fetchedSkillsData = [];
      if (Array.isArray(data)) {
        fetchedSkillsData = data;
      } else if (data.skills && Array.isArray(data.skills)) {
        fetchedSkillsData = data.skills;
      } else if (data.data && Array.isArray(data.data)) {
        fetchedSkillsData = data.data;
      } else {
        console.warn("Unexpected API response format or no skills found, treating as empty:", data);
        fetchedSkillsData = []; 
      }

      // --- START: Sorting Logic ---
      if (fetchedSkillsData.length > 0 && query.trim() !== "") {
        const lowerQuery = query.trim().toLowerCase();
        
        fetchedSkillsData.sort((a, b) => {
          // Ensure a.skill and b.skill are strings before calling toLowerCase
          const skillALower = typeof a.skill === 'string' ? a.skill.toLowerCase() : '';
          const skillBLower = typeof b.skill === 'string' ? b.skill.toLowerCase() : '';

          // Priority 1: Exact match (should ideally be handled by API, but good for client-side sort)
          const isAExact = skillALower === lowerQuery;
          const isBExact = skillBLower === lowerQuery;
          if (isAExact && !isBExact) return -1;
          if (!isAExact && isBExact) return 1;
          if (isAExact && isBExact) return 0; // if both exact, order doesn't matter or use alphabetical

          // Priority 2: Starts with query
          const aStartsWith = skillALower.startsWith(lowerQuery);
          const bStartsWith = skillBLower.startsWith(lowerQuery);
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          // Priority 3: Includes query (if neither or both start with)
          if (!aStartsWith && !bStartsWith) { 
            const aIncludes = skillALower.includes(lowerQuery);
            const bIncludes = skillBLower.includes(lowerQuery);
            if (aIncludes && !bIncludes) return -1;
            if (!aIncludes && bIncludes) return 1;
          }
          
          // Priority 4: Alphabetical as a tie-breaker or default
          // If both start with, or both include (and neither starts with), or neither matches significantly
          return skillALower.localeCompare(skillBLower);
        });
      }
      // --- END: Sorting Logic ---

      setApiSkills(fetchedSkillsData);

    } catch (err) {
      console.error("Error in fetchSkills:", err.message);
      const errorMessage = err.message || "Error fetching skills. Please try again.";
      setError(errorMessage); 
      setApiSkills([]);
      if (errorMessage.includes("Authentication failed") || errorMessage.includes("token")) {
        setShouldNavigate(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm.trim() !== "") { 
         fetchSkills(searchTerm);
      } else {
        setApiSkills([]); 
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleAddSkill = async (skillName, skillId = null) => {
    if (skillName.trim() === "" || skillName.trim().length > 50) {
      setError("Skill cannot be empty or longer than 50 characters.");
      return;
    }
    const seekerId = localStorage.getItem("seeker_id");
    const token = localStorage.getItem("token");
    if (!seekerId || !token) {
      setError("Missing seeker ID or token. Please log in again.");
      setShouldNavigate(true);
      return;
    }

    if (skillsData.some(s => s.skill.toLowerCase() === skillName.trim().toLowerCase())) {
        setError(`Skill "${skillName.trim()}" already exists.`);
        setSearchTerm(""); 
        setApiSkills([]);  
        return;
    }

    const currentSkillNames = skillsData.map(item => item.skill);
    const updatedSkillNames = [...currentSkillNames, skillName.trim()];
    const requestBody = {
      seeker_id: parseInt(seekerId),
      skills: updatedSkillNames,
    };
    
    setError(null); 
    
    try {
      const response = await fetch("https://laravel.wazafny.online/api/update-skills", {
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
        skill_id: skillId || `temp-${Date.now().toString()}`, 
        skill: skillName.trim()
      };
      setSkillsData(prevSkills => [...prevSkills, newSkillObj]);
      setSearchTerm("");
      setApiSkills([]);
      showFloatMessage("success", "Skill added."); // Use float message for success

    } catch (err) {
        const errorMessage = err.message || "Error adding skill. Please try again.";
        if (errorMessage.includes("Authentication failed") || errorMessage.includes("token")) {
          setError("Authentication failed. Please log in again.");
          setShouldNavigate(true);
        } else {
          console.error("Error in handleAddSkill:", err.message);
          setError(errorMessage); 
        }
    }
  };

  const handleEditSkill = (index, newValue) => {
    const updatedSkills = [...skillsData];
    if (updatedSkills[index]) {
        updatedSkills[index] = { ...updatedSkills[index], skill: newValue.trim() };
        setSkillsData(updatedSkills);
    }
  };

  const handleDeleteSkill = (indexToDelete) => { 
    const updatedSkills = skillsData.filter((_, i) => i !== indexToDelete);
    setSkillsData(updatedSkills);
  };

  const handleSaveSkills = async () => {
    const seekerId = localStorage.getItem("seeker_id");
    const token = localStorage.getItem("token");
    if (!seekerId || !token) {
      setError("Missing seeker ID or token. Please log in again.");
      showFloatMessage("error", "Missing seeker ID or token. Please log in again.");
      setShouldNavigate(true);
      return;
    }
    const skillNames = skillsData.map(item => item.skill);
    setIsLoading(true); 
    setError(null);
    try {
      const updateResponse = await fetch("https://laravel.wazafny.online/api/update-skills", {
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
      showFloatMessage("success", "Skills saved.");
      setIsModalOpen(false);
      setEditSearchTerm("");
      setError(null);
    } catch (err) {
      const errorMessage = err.message || "Error updating skills. Please try again.";
      if (errorMessage.includes("Authentication failed") || errorMessage.includes("token")) {
          showFloatMessage("error", "Authentication failed. Please log in again.");
          setError("Authentication failed. Please log in again."); 
          setShouldNavigate(true);
      } else {
          console.error("Error updating skills:", err.message);
          setError(errorMessage); 
          showFloatMessage("error", errorMessage);
      }
    } finally {
        setIsLoading(false); 
    }
  };

  const filteredSkillsForEditModal = skillsData.filter((skillObj) =>
    skillObj && typeof skillObj.skill === 'string' &&
    skillObj.skill.toLowerCase().includes(editSearchTerm.toLowerCase())
  );

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

  if (shouldNavigate) {
    return <Navigate to="/Login" />;
  }

  return (
    <div className="flex justify-center mt-4 w-full">
      <div className="bg-white border border-[#D9D9D9] rounded-xl w-full max-w-[900px] relative">
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-bold mt-5 ml-6 text-[#201A23]">
            Skills
          </h3>
          {userRole !== "Company" && (
            <div className="flex gap-4 mr-6 mt-5"> 
              <Plus
                className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                onClick={() => {setIsModalAddOpen(true); setError(null);}} 
              />
              <Pencil
                className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
                onClick={() => {setIsModalOpen(true); setError(null);}} 
              />
            </div>
          )}
        </div>

        <div className="mt-8 px-6 pb-6"> 
          {Array.isArray(skillsData) && skillsData.length > 0 ? (
            <ul
              className={`${
                skillsData.length > 5 ? "max-h-[200px] overflow-y-auto" : ""
              } mt-1`}
            >
              {skillsData.map((skillObj, index) => (
                <li
                  key={skillObj?.skill_id || `skill-${index}`} 
                  className="py-3 border-b last:border-b-0 text-[#201A23] text-sm md:text-base"
                >
                  {editingSkillIndex === index && userRole !== "Company" ? ( 
                    <input
                      type="text"
                      value={skillObj?.skill || ''}
                      onChange={(e) => handleEditSkill(index, e.target.value)}
                      onBlur={() => {
                        setEditingSkillIndex(null);
                      }}
                      onKeyPress={(e) => { if (e.key === 'Enter') setEditingSkillIndex(null); }}
                      autoFocus
                      className="border-none outline-none bg-transparent w-full" 
                      maxLength={50}
                    />
                  ) : (
                    <span
                      className="font-bold text-md" 
                      onClick={() => userRole !== "Company" && setEditingSkillIndex(index)}
                      style={{ cursor: userRole !== "Company" ? 'pointer' : 'default' }}
                    >
                      {skillObj?.skill || '...'}
                    </span>
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

        {/* --- Modal for Adding New Skill --- */}
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
                className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => { 
                    setIsModalAddOpen(false); 
                    setSearchTerm(""); 
                    setApiSkills([]); 
                    setError(null); 
                }}
              >
                <motion.div 
                  className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-[819px] h-[500px] overflow-y-auto relative z-50"
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-[#201A23]">Add Skill</h2>
                    <button
                      className="text-gray-500 hover:text-black text-lg scale-150"
                      onClick={() => { setIsModalAddOpen(false); setSearchTerm(""); setApiSkills([]); setError(null); }}
                    >
                      &times; 
                    </button>
                  </div>
                  <p className="text-[#A1A1A1] text-center mb-4 md:mb-6 text-sm md:text-base">
                    Search for a skill or type a new one and press{" "}
                    <span className="font-bold text-[#201A23]">Enter</span> to add.
                  </p>
                  
                  <div className="relative"> 
                    <div className="relative flex items-center w-full border border-gray-300 rounded-full overflow-hidden">
                        <img src={Search} alt="Search Icon" className="w-5 h-5 md:w-6 md:h-6 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"/>
                        <input
                            autoFocus
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => { if (e.key === "Enter" && searchTerm.trim() !== "") { handleAddSkill(searchTerm); } }}
                            placeholder="Search here for your skills"
                            className="w-full pl-12 pr-4 py-2 text-gray-700 bg-white focus:outline-none rounded-full"
                            maxLength={50}
                        />
                    </div>
                    
                    {(isLoading && searchTerm) || error || apiSkills.length > 0 ? (
                        <div className="absolute top-full left-0 right-0 mt-1 z-20"> 
                            <div className="border border-gray-300 rounded-lg bg-white shadow-lg max-h-[300px] overflow-y-auto">
                                {isLoading && searchTerm && <p className="px-4 py-2 text-gray-500 text-sm">Loading...</p>}
                                {error && !isLoading && <p className="px-4 py-2 text-red-500 text-sm">{error}</p>}
                                {!isLoading && !error && apiSkills.length > 0 && (
                                    <ul>
                                        {apiSkills.map((skillObj) => (
                                        <li
                                            key={skillObj.skill_id}
                                            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleAddSkill(skillObj.skill, skillObj.skill_id)}
                                            onMouseDown={(e)=>e.preventDefault()} 
                                        >
                                            {skillObj.skill}
                                        </li>
                                        ))}
                                    </ul>
                                )}
                                 {!isLoading && !error && searchTerm && apiSkills.length === 0 && (
                                    <p className="px-4 py-2 text-gray-500 text-sm">No suggestions found for "{searchTerm}". Press Enter to add as a new skill.</p>
                                 )}
                            </div>
                        </div>
                    ) : null}
                  </div>

                  <div className="mt-6 md:mt-8"> 
                    {Array.isArray(skillsData) && skillsData.length > 0 && (
                      <div className="flex flex-wrap gap-2 md:gap-4">
                        {skillsData.map((skillObj, index) => (
                          <motion.div 
                            key={skillObj?.skill_id || `modal-skill-${index}`}
                            className="bg-[#F5F5F5] px-3 py-1 rounded-full text-sm md:text-base text-[#201A23] flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            layout 
                          >
                            <span>{skillObj?.skill || ''}</span>
                            <X
                              className="w-4 h-4 md:w-5 md:h-5 text-[#A1A1A1] hover:text-red-500 cursor-pointer"
                              onClick={() => handleDeleteSkill(index)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Modal>

        {/* --- Modal for Editing Skills --- */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditSearchTerm("");
            setError(null);
          }}
          title={"Edit Skills"}
        >
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => {setIsModalOpen(false); setEditSearchTerm(""); setError(null);}}
              >
                <motion.div
                  className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-[750px] max-h-[90vh] overflow-y-auto relative z-50"
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-2 md:mb-2">
                    <h2 className="text-lg md:text-xl font-bold text-[#201A23]">Edit Skills</h2>
                    <button
                      className="text-gray-500 hover:text-black text-lg"
                      onClick={() => { setIsModalOpen(false); setEditSearchTerm(""); setError(null); }}
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6 scale-150" />
                    </button>
                  </div>
                  <p className="mb-3 text-[#A1A1A1]">
                    List your key skills and expertise here.
                  </p>
                  <div className="relative flex items-center w-full border border-[#81828E] rounded-md mb-5 overflow-hidden">
                    <img src={Search} alt="Search Icon" className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    <input
                      type="text"
                      value={editSearchTerm}
                      onChange={(e) => setEditSearchTerm(e.target.value)}
                      placeholder="Search here for your skills..."
                      className="w-full pl-12 pr-4 py-2 text-gray-700 bg-white focus:outline-none border-none rounded-full"
                    />
                  </div>
                  <div className="mt-2 min-h-[20px]">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                  <div className="border border-gray-900 rounded-lg p-4 min-h-[100px] max-h-[300px] overflow-y-auto flex flex-wrap items-start gap-2 mt-4"> 
                      {filteredSkillsForEditModal.length > 0 ? (
                        filteredSkillsForEditModal.map((skillObj) => {
                          const originalIndex = skillsData.findIndex(s => s.skill_id ? s.skill_id === skillObj.skill_id : s.skill === skillObj.skill);
                          if (originalIndex === -1) return null;

                          return (
                            <motion.div 
                              key={skillObj?.skill_id || `edit-skill-${originalIndex}`}
                              className="flex items-center bg-black text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap" 
                              style={{ width: "fit-content" }} 
                              initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y:0 }} exit={{ opacity:0, y:10 }} layout
                            >
                              <span>{skillObj?.skill || ''}</span>
                              <X
                                className="w-4 h-4 ml-2 text-gray-300 hover:text-red-400 cursor-pointer" 
                                onClick={() => handleDeleteSkill(originalIndex)}
                              />
                            </motion.div>
                          );
                        })
                      ) : (
                        <p className="text-gray-400 text-xs text-center w-full">
                          {editSearchTerm ? 'No matching skills found.' : 'No skills to display or edit.'}
                        </p>
                      )}
                  </div>
                  <div className="flex justify-end mt-4 md:mt-8">
                    <button
                      className={`bg-black text-white px-4 md:px-9 py-2 md:py-2 font-bold rounded-lg hover:bg-gray-800 shadow-md text-sm md:text-base ${isLoading ? 'opacity-50 cursor-not-allowed': ''}`}
                      onClick={handleSaveSkills}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Modal>
        <AnimatePresence>
            {floatMessage.message && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                    className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white ${floatMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                    onAnimationComplete={() => setTimeout(() => setFloatMessage({ message: "", type: "" }), 2800)} 
                >
                    {floatMessage.message}
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Skill;