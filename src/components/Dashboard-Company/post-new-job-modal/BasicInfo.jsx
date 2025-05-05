import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from ".././../../assets/company/option-select.svg";
import axios from "axios";

function BasicInfo() {
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState({ text: "", type: "" });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false); // New state to handle city mismatch

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("basicInfoFormData");
    const defaultData = {
      jobTitle: "",
      about: "",
      country: "",
      cityState: "",
      jobType: "",
      employmentType: "",
    };

    // If location.state.formData exists (from edit mode), use it
    if (location.state?.formData) {
      return location.state.formData;
    }

    // Otherwise, fall back to saved data or default
    return savedData ? JSON.parse(savedData) : defaultData;
  });

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await axios.get("https://countriesnow.space/api/v0.1/countries");
        if (response.data.error === false) {
          const sortedCountries = response.data.data.sort((a, b) =>
            a.country.localeCompare(b.country)
          );
          setCountries(sortedCountries);
        } else {
          throw new Error("Failed to fetch countries");
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setMessage({
          text: "Failed to load countries. Please try again.",
          type: "error",
        });
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Set selectedCountry based on formData.country
  useEffect(() => {
    if (formData.country) {
      setSelectedCountry(formData.country);
    } else {
      setSelectedCountry("");
    }
  }, [formData.country]);

  // Fetch states (as cities) based on selectedCountry
  useEffect(() => {
    if (!selectedCountry || selectedCountry === "Select Country") {
      setCities([]);
      setFormData((prev) => ({ ...prev, cityState: "" }));
      setSelectedCityName("");
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await axios.post("https://countriesnow.space/api/v0.1/countries/states", {
          country: selectedCountry,
        });
        if (response.data.error === false && response.data.data) {
          const states = response.data.data.states || [];
          const stateNames = states.map(state => state.name);
          setCities(stateNames);
          if (formData.cityState && !stateNames.includes(formData.cityState)) {
            setCityNotFound(true);
            setFormData((prev) => ({ ...prev, cityState: "" }));
            setSelectedCityName("");
          } else {
            setCityNotFound(false);
            setSelectedCityName(formData.cityState);
          }
        } else {
          throw new Error("Failed to fetch states");
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setMessage({
          text: "Failed to load cities. Please try again.",
          type: "error",
        });
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedCountry]);

  // Update localStorage when formData changes
  useEffect(() => {
    localStorage.setItem("basicInfoFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      setSelectedCountry(value);
      setFormData((prev) => ({
        ...prev,
        country: value,
        cityState: "", // Reset cityState when country changes
      }));
      setSelectedCityName("");
      setCityNotFound(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (name === "cityState") {
        setSelectedCityName(value);
        setCityNotFound(false);
      }
    }
  };

  const handleNext = () => {
    const { jobTitle, about, country, cityState, jobType, employmentType } = formData;

    if (
      jobTitle &&
      about &&
      country &&
      cityState &&
      jobType &&
      employmentType
    ) {
      navigate("/Dashboard/Jobpost/skills", {
        state: {
          jobId: location.state?.jobId,
          formData,
          skills: location.state?.skills || [],
          sections: location.state?.sections || [],
          questions: location.state?.questions || [],
          isEdit: location.state?.isEdit || false,
        },
        replace: true,
      });
    } else {
      const missingFields = [];
      if (!jobTitle) missingFields.push("Job Title");
      if (!about) missingFields.push("About");
      if (!country) missingFields.push("Country");
      if (!cityState) missingFields.push("City/State");
      if (!jobType) missingFields.push("Job Type");
      if (!employmentType) missingFields.push("Employment Type");

      setMessage({
        text: `Please fill all required fields.`,
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("basicInfoFormData");
    localStorage.removeItem("skillsData");
    localStorage.removeItem("extraSectionsData");
    localStorage.removeItem("questionsData");
    navigate("/Dashboard/Jobpost", { replace: true });
  };

  return (
    <>
      {message.text && (
        <div
          className={`floating-message ${message.type} ${
            !message.text ? "hide" : ""
          }`}
        >
          {message.text}
        </div>
      )}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }

          @keyframes slideIn {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes slideOut {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-20px); opacity: 0; }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-in forwards;
          }

          .floating-message {
            position: fixed;
            top: 20px;
            left: 49%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out forwards;
          }

          .floating-message.success {
            background-color: #4caf50;
            color: white;
          }

          .floating-message.error {
            background-color: #f44336;
            color: white;
          }

          .floating-message.hide {
            animation: slideOut 0.3s ease-out forwards;
          }

          .custom-select {
            background: url(${Select}) no-repeat right 10px center;
            background-size: 20px;
          }
        `}
      </style>
      <div className="w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-sans font-bold text-[#201A23] mb-9 mt-5 text-center">
          Basic Information
        </h2>

        <div className="mb-6">
          <label
            className="block text-[#201A23] font-bold mb-2"
            htmlFor="jobTitle"
          >
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full p-3 border border-[#A1A1A1] rounded-lg focus:outline-none"
            placeholder="Enter job title"
          />
          <p className="text-sm text-gray-500 mt-1 text-right">0/200 words</p>
        </div>

        <div className="mb-6">
          <label
            className="block text-[#201A23] font-bold mb-2"
            htmlFor="about"
          >
            About <span className="text-red-500">*</span>
          </label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="w-full p-3 border border-[#A1A1A1] rounded-lg focus:outline-none h-32 resize-none"
            placeholder="Describe the job"
          />
          <p className="text-sm text-gray-500 mt-1 text-right">0/500 words</p>
        </div>

        <div className="mb-6">
          <label className="block text-[#201A23] font-bold mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <div className="w-1/2 relative">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none pr-10 custom-select"
                disabled={loadingCountries}
              >
                <option value="" disabled>
                  {loadingCountries ? "Loading..." : "Select Country"}
                </option>
                {countries.map((country) => (
                  <option key={country.iso2} value={country.country}>
                    {country.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2 relative">
              <select
                name="cityState"
                value={formData.cityState}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none pr-10 custom-select"
                disabled={loadingCities || !selectedCountry}
              >
                <option value="" disabled>
                  {loadingCities
                    ? "Loading..."
                    : cityNotFound
                    ? "City not found, please reselect"
                    : "Select City/State"}
                </option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6 flex space-x-4">
          <div className="w-1/2 relative">
            <label
              className="block text-[#201A23] font-bold mb-2"
              htmlFor="jobType"
            >
              Job Type <span className="text-red-500">*</span>
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none pr-10 custom-select"
            >
              <option value="">Select Job Type</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          <div className="w-1/2 relative">
            <label
              className="block text-[#201A23] font-bold mb-2"
              htmlFor="employmentType"
            >
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none pr-10 custom-select"
            >
              <option value="">Select Employment Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between space-x-4">
          <button
            onClick={handleCancel}
            className="py-2 px-10 border-2 border-[#000000] rounded-lg text-[#201A23] font-sans font-extrabold hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="px-10 bg-[#201A23] text-white rounded-lg font-extrabold font-sans hover:bg-gray-800 focus:outline-none"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default BasicInfo;