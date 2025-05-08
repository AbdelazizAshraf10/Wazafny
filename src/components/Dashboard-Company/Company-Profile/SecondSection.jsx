import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function SecondSection({ companyId, about, industry, companySize, headquarters, founded, country, city }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(country || "");

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries');
        setCountries(response.data.data);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const fetchCities = async () => {
        try {
          const response = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
            country: selectedCountry,
          });
          setCities(response.data.data.states);
        } catch (err) {
          console.error('Error fetching cities:', err);
        }
      };
      fetchCities();
    }
  }, [selectedCountry]);

  const [formData, setFormData] = useState({
    about: about || "",
    industry: industry || "",
    companySize: companySize || "",
    headquarters: headquarters || "",
    founded: founded || "",
    country: country || "",
    city: city || "",
  });

  const [errors, setErrors] = useState({
    about: '',
    industry: '',
    companySize: '',
    headquarters: '',
    founded: '',
    country: '',
    city: '',
  });

  const [wordCount, setWordCount] = useState(
    formData.about.trim().split(/\s+/).filter(Boolean).length
  );

  const validateField = (name, value) => {
    switch (name) {
      case 'about':
        return !value.trim() ? 'About is required' : '';
      case 'industry':
        if (!value.trim()) return 'Industry is required';
        if (value.length > 100) return 'Industry must be 100 characters or less';
        return '';
      case 'companySize':
        if (!value.trim()) return 'Company size is required';
        if (value.length > 100) return 'Company size must be 100 characters or less';
        return '';
      case 'headquarters':
        if (!value.trim()) return 'Headquarters is required';
        if (value.length > 100) return 'Headquarters must be 100 characters or less';
        return '';
      case 'country':
        if (!value.trim()) return 'Country is required';
        if (value.length > 100) return 'Country must be 100 characters or less';
        return '';
      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.length > 100) return 'City must be 100 characters or less';
        return '';
      case 'founded':
        if (!value.trim()) return 'Founded year is required';
        if (!/^\d{4}$/.test(value)) return 'Please enter a valid year (YYYY)';
        const currentYear = new Date().getFullYear();
        if (parseInt(value) > currentYear) return `Year cannot be in the future (after ${currentYear})`;
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'about') {
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length <= 300) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setWordCount(words.length);
      }
    } else if (name === 'country') {
      setFormData((prev) => ({ ...prev, [name]: value, city: '' }));
      setSelectedCountry(value);
    } else if (name === 'founded') {
      // Allow only digits and limit to 4 characters
      if (/^\d{0,4}$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      about: validateField('about', formData.about),
      industry: validateField('industry', formData.industry),
      companySize: validateField('companySize', formData.companySize),
      headquarters: validateField('headquarters', formData.headquarters),
      founded: validateField('founded', formData.founded),
      country: validateField('country', formData.country),
      city: validateField('city', formData.city),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (!hasErrors) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage({
            text: "No authentication token found. Please log in.",
            type: "error",
          });
          return;
        }

        const payload = {
          company_id: companyId,
          about: formData.about,
          company_industry: formData.industry,
          company_size: formData.companySize,
          company_heads: formData.headquarters,
          company_founded: formData.founded,
          company_country: formData.country,
          company_city: formData.city,
        };

        await axios.post('https://laravel.wazafny.online/api/update-extra-info', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setMessage({ text: "Extra info updated successfully", type: "success" });
        setIsModalOpen(false);
      } catch (err) {
        console.error('Error updating extra info:', err);
        if (err.response?.status === 401) {
          setMessage({
            text: "Unauthorized. Please log in again.",
            type: "error",
          });
          Navigate("/LoginCompany");
        } else if (err.response?.status === 422) {
          console.log("Invalid data provided. Please check your inputs.");
        } else if (err.response?.status === 500) {
          console.log("Internal server error");
        } else if (err.response?.status === 404) {
          console.log("Company not found id company not correct.");
        } else {
          setMessage({
            text: "Failed to update extra info. Please try again later.",
            type: "error",
          });
        }
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' } },
  };

  const detailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, ease: 'easeOut' },
    }),
  };

  return (
    <div className="w-[1225px] mx-auto p-6 border-[#D9D9D9] border-2 bg-white rounded-[15.47px]">
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
          @keyframes slideIn {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes slideOut {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-20px); opacity: 0; }
          }

          .floating-message {
            position: fixed;
            top: 20px;
            left: 40%;
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
        `}
      </style>

      <motion.div
        className="flex justify-between items-center mb-6"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-2xl font-bold">About</h1>
        <button onClick={() => setIsModalOpen(true)}>
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
            />
          </svg>
        </button>
      </motion.div>

      <motion.p
        className="text-[#000000] text-justify text-balance mb-4"
        variants={paragraphVariants}
        initial="hidden"
        animate="visible"
      >
        {formData.about}
      </motion.p>

      <motion.div className="mt-6" initial="hidden" animate="visible">
        <motion.h2 className="text-lg font-semibold" custom={0} variants={detailVariants}>
          Industry
        </motion.h2>
        <motion.p className="text-gray-600 mb-4" custom={1} variants={detailVariants}>
          {formData.industry}
        </motion.p>

        <motion.h2 className="text-lg font-semibold" custom={2} variants={detailVariants}>
          Company size
        </motion.h2>
        <motion.p className="text-gray-600 mb-4" custom={3} variants={detailVariants}>
          {formData.companySize}
        </motion.p>

        <motion.h2 className="text-lg font-semibold" custom={4} variants={detailVariants}>
          Headquarters
        </motion.h2>
        <motion.p className="text-gray-600 mb-4" custom={5} variants={detailVariants}>
          {formData.headquarters}
        </motion.p>

        <motion.h2 className="text-lg font-semibold" custom={6} variants={detailVariants}>
          Founded
        </motion.h2>
        <motion.p className="text-gray-600 mb-4" custom={7} variants={detailVariants}>
          {formData.founded}
        </motion.p>

        <motion.h2 className="text-lg font-semibold" custom={8} variants={detailVariants}>
          Location
        </motion.h2>
        <motion.p className="text-gray-600 mb-4" custom={9} variants={detailVariants}>
          {formData.country}, {formData.city}
        </motion.p>
      </motion.div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 w-[700px] min-h-[500px] shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Extra Information</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.about ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-purple-500`}
                  rows="4"
                />
                <p className="text-right text-xs text-gray-500 mt-1">{wordCount}/300</p>
                {errors.about && (
                  <p className="text-red-500 text-xs mt-1">{errors.about}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.industry ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-purple-500`}
                  />
                  {errors.industry && (
                    <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headquarters<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.headquarters ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-purple-500`}
                  />
                  {errors.headquarters && (
                    <p className="text-red-500 text-xs mt-1">{errors.headquarters}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company size<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.companySize ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-purple-500`}
                  />
                  {errors.companySize && (
                    <p className="text-red-500 text-xs mt-1">{errors.companySize}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founded<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.founded ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-purple-500`}
                    placeholder="YYYY"
                    maxLength="4"
                  />
                  {errors.founded && (
                    <p className="text-red-500 text-xs mt-1">{errors.founded}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-purple-500`}
                  >
                    <option value="">Country</option>
                    {countries.map((country) => (
                      <option key={country.iso2} value={country.country}>
                        {country.country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-purple-500`}
                  >
                    <option value="">City</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
              </div>

              <div className="text-end">
                <button
                  type="submit"
                  className="w-24 bg-black text-white py-2 rounded-md hover:bg-gray-900"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default SecondSection;