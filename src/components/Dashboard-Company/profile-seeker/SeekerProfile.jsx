import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import person from "../../../assets/company/personnn.svg";
import Edu from "../../../assets/company/education.svg";
import Exp from "../../../assets/company/Experince.svg";

function SeekerProfile() {
  const { seekerId } = useParams(); // Get seeker_id from URL
  const [seekerData, setSeekerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch seeker profile data
  useEffect(() => {
    const fetchSeekerData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://wazafny.online/api/show-seeker-profile/${seekerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Map API data to seekerData structure
        const apiData = response.data;
        const mappedData = {
          name: `${apiData.personal_info.first_name} ${apiData.personal_info.last_name}`,
          following: apiData.personal_info.followings || 0,
          title: apiData.personal_info.headline || "",
          location: `${apiData.personal_info.city}, ${apiData.personal_info.country}`,
          profilePictureUrl: apiData.personal_info.profile_img || null,
          bannerUrl: apiData.personal_info.cover_img || null, // Use cover_img for banner
          about: apiData.personal_info.about || "",
          resumeUrl: apiData.personal_info.resume || null,
          experience: apiData.experiences.map((exp, index) => ({
            id: exp.experience_id,
            jobTitle: exp.job_title,
            company: exp.company,
            duration: `${exp.start_date} - ${exp.end_date}`,
            description: "", // API doesn't provide description, leaving empty
          })),
          skills: apiData.skills.map((skill) => skill.skill),
          education: apiData.education
            ? [
                {
                  id: apiData.education.education_id,
                  degree: apiData.education.college,
                  institution: apiData.education.university,
                  duration: `${apiData.education.start_date} - ${exp.education.end_date}`,
                  details: "", // API doesn't provide details, leaving empty
                },
              ]
            : [],
        };

        setSeekerData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else if (err.response?.status === 404) {
          setError("Seeker profile not found.");
        } else {
          setError("Failed to fetch seeker profile. Please try again.");
        }
        setLoading(false);
      }
    };

    fetchSeekerData();
  }, [seekerId]);

  // Helper component for profile sections
  const ProfileSection = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="text-gray-600">{children}</div>
    </div>
  );

  // Handle loading and error states
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!seekerData) {
    return <div className="text-center p-8">No profile data available.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      {/* --- Header Card --- */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        {/* Banner */}
        {seekerData.bannerUrl ? (
          <img
            src={seekerData.bannerUrl}
            alt="Profile banner"
            className="w-full h-60 object-cover"
            onError={(e) => {
              console.log(
                "Banner image failed to load, using fallback background"
              );
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
        ) : null}
        <div
          className={`w-full h-60 bg-gray-300 ${
            seekerData.bannerUrl ? "hidden" : "block"
          }`}
        ></div>

        {/* Profile Picture and Basic Info Container */}
        <div className="px-6 pb-8 relative">
          {/* Profile Picture Wrapper */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -mt-36">
            <div className="w-36 h-36 rounded-full border-4 border-white bg-gray-200 shadow-md flex items-center justify-center overflow-hidden">
              {seekerData.profilePictureUrl ? (
                <img
                  src={seekerData.profilePictureUrl}
                  alt={`${seekerData.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={person}
                  alt="Default profile"
                  className="h-28 w-28 text-gray-400"
                />
              )}
            </div>
          </div>

          {/* Text Info */}
          <div className="text-center mt-20 pt-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {seekerData.name}
              {seekerData.following && (
                <span className="block text-sm font-medium text-gray-500 mt-1">
                  {seekerData.following} Following
                </span>
              )}
            </h1>
            <p className="text-lg text-[#6A0DAD] font-medium mt-2">
              {seekerData.title}
            </p>
            <p className="text-md text-gray-500 mt-1">{seekerData.location}</p>
          </div>
        </div>
      </div>

      {/* --- About Section --- */}
      {seekerData.about && (
        <ProfileSection title="About">
          <p className="text-base text-justify leading-relaxed">
            {seekerData.about}
          </p>
        </ProfileSection>
      )}

      {/* --- Resume Section --- */}
      {seekerData.resumeUrl && (
        <ProfileSection title="Resume">
          <p className="mb-3">View or download the candidate's resume.</p>
          <a
            href={seekerData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#201A23] hover:bg-[#242645] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            View Resume
          </a>
        </ProfileSection>
      )}

      {/* --- Experience Section --- */}
      {seekerData.experience && seekerData.experience.length > 0 && (
        <ProfileSection title="Experience">
          <ul className="space-y-6 divide-y divide-gray-200">
            {seekerData.experience.map((exp) => (
              <li key={exp.id} className="pt-6 first:pt-0 flex items-center gap-4">
                <img
                  src={Exp}
                  alt="Experience icon"
                  className="w-15 h-15 flex-shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {exp.jobTitle}
                  </h3>
                  <p className="text-[#201A23] font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                  {exp.description && (
                    <p className="text-base text-gray-600 whitespace-pre-line leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </ProfileSection>
      )}

      {/* --- Skills Section --- */}
      {seekerData.skills && seekerData.skills.length > 0 && (
        <ProfileSection title="Skills">
          <div className="flex flex-wrap gap-3">
            {seekerData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-block bg-[#F2E9FF] text-[#201A23] rounded-md px-4 py-1 text-sm font-bold"
              >
                {skill}
              </span>
            ))}
          </div>
        </ProfileSection>
      )}

      {/* --- Education Section --- */}
      {seekerData.education && seekerData.education.length > 0 && (
        <ProfileSection title="Education">
          <div className="flex gap-4">
            <img src={Edu} alt="" />
            <ul className="space-y-6 divide-y divide-gray-200">
              {seekerData.education.map((edu) => (
                <li key={edu.id} className=" first:pt-0">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {edu.degree}
                  </h3>
                  <p className="text-[#201A23] font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-500 mb-2">{edu.duration}</p>
                  {edu.details && (
                    <p className="text-base text-gray-600">{edu.details}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </ProfileSection>
      )}
    </div>
  );
}

export default SeekerProfile;