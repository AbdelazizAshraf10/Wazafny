import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import axios from "axios";
import { Message } from "../CustomMessage/FloatMessage"; // Adjust the path based on your file structure

export default function Location() {
  const navigate = useNavigate();
  const seekerId = localStorage.getItem("seeker_id");

  const [countries, setCountries] = useState([]); // Store countries with countryCode
  const [cities, setCities] = useState([]); // Store cities for the selected country
  const [selectedCountryCode, setSelectedCountryCode] = useState(""); // Store selected country code
  const [error, setError] = useState(null); // State for API errors
  const [success, setSuccess] = useState(null); // State for success messages
  const [loadingCountries, setLoadingCountries] = useState(false); // Loading state for countries
  const [loadingCities, setLoadingCities] = useState(false); // Loading state for cities

  // Clear messages after 3 seconds (already handled by Message, but kept for consistency)
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch countries from GeoNames API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await axios.get(
          "http://api.geonames.org/countryInfoJSON?username=youssef797"
        );
        

        if (response.data.geonames && Array.isArray(response.data.geonames)) {
          const sortedCountries = response.data.geonames.sort((a, b) =>
            a.countryName.localeCompare(b.countryName)
          );
          setCountries(sortedCountries);
        } else {
          throw new Error("Unexpected API response format for countries");
        }
      } catch (err) {
        console.error("Error fetching countries:", {
          message: err.message,
          response: err.response?.data,
        });
        setError("Failed to load countries. Please try again later.");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch cities based on selectedCountryCode
  useEffect(() => {
    if (!selectedCountryCode) {
      setCities([]);
      formik.setFieldValue("City", ""); // Reset city when country changes
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await axios.get(
          `http://api.geonames.org/searchJSON?country=${selectedCountryCode}&featureClass=A&featureCode=ADM1&maxRows=1000&username=Youssef797`
        );
        const fetchedCities = response.data.geonames || [];
        setCities(fetchedCities);
        

        if (
          formik.values.City &&
          !fetchedCities.some((city) => city.name === formik.values.City)
        ) {
          formik.setFieldValue("City", "");
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setError("Failed to load cities. Please try again.");
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedCountryCode]);

  // Formik setup
  const handleLogin = async (values) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Missing token. Please log in again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!seekerId) {
      setError("Missing seeker ID. Please log in again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const payload = {
      seeker_id: parseInt(seekerId),
      country: values.Country,
      city: values.City,
    };

    try {
      const response = await axios.post(
        "https://wazafny.online/api/create-location",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      
      setSuccess("Location saved successfully!");
      setTimeout(() => navigate("/info"), 2000);
    } catch (error) {
      console.error("Error saving location:", error);
      if (error.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.status === 500) {
        console.log("Server error. Please try again later.");
      }else if (error.response?.status === 422) {
        console.log("Validation error. Please check your input.");
      }else if (error.response?.status === 404) {
        console.log("Seeker_id not found");
      } else {
        setError("Failed to save location. Please try again.");
      }
    }
  };

  const myValidationSchema = Yup.object().shape({
    Country: Yup.string().required("Country is required"),
    City: Yup.string().required("City is required"),
  });

  const formik = useFormik({
    initialValues: {
      Country: "",
      City: "",
    },
    validationSchema: myValidationSchema,
    onSubmit: handleLogin,
  });

  // Handle country change to set countryCode
  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.value;
    const selectedCountry = countries.find(
      (country) => country.countryName === selectedCountryName
    );
    setSelectedCountryCode(selectedCountry ? selectedCountry.countryCode : "");
    formik.handleChange(e);
  };

  return (
    <>
      {/* Error message */}
      <Message
        message={error}
        type="error"
        onClose={() => setError(null)}
      />

      {/* Success message */}
      <Message
        message={success}
        type="success"
        onClose={() => setSuccess(null)}
      />

      <div className="border-[2px] border-solid border-[#d9d9d9] rounded-[7%] p-12 pt-8 h-[500px] w-[440px] mx-auto mt-9">
        <h2 className="text-xl mb-3 text-[#242645] font-bold text-center py-6">
          Welcome, What's your location?
        </h2>
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-md mx-auto my-auto"
        >
          <div className="relative z-0 w-full group">
            <div className="relative">
              <select
                onBlur={formik.handleBlur}
                onChange={handleCountryChange}
                value={formik.values.Country}
                name="Country"
                id="Country"
                className="block py-2.5 px-0 w-full text-sm text-[#242645] bg-transparent border-0 border-b-2 border-[#D9D9D9] appearance-none dark:border-[#D9D9D9] dark:focus:border-[#6A0DAD] focus:outline-none focus:ring-0 focus:border-[#6A0DAD] peer transition-colors duration-300"
                required
                disabled={loadingCountries}
              >
                <option value="" disabled className="text-gray-500">
                  {loadingCountries ? "Loading..." : "Select a country"}
                </option>
                {countries.map((country) => (
                  <option
                    key={country.countryCode}
                    value={country.countryName}
                    className="text-[#242645] bg-white hover:bg-[#6A0DAD] hover:text-white py-2 px-4"
                  >
                    {country.countryName}
                  </option>
                ))}
              </select>
              <style>
                {`
                  #Country {
                    background-image: none;
                    padding-right: 1.5rem;
                  }
                  #Country::-ms-expand {
                    display: none;
                  }
                  .relative::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%) rotate(45deg);
                    width: 8px;
                    height: 8px;
                    border-right: 2px solid #242645;
                    border-bottom: 2px solid #242645;
                    pointer-events: none;
                  }
                  select:focus + .relative::after {
                    border-color: #6A0DAD;
                  }
                  select option {
                    background: white;
                    color: #242645;
                  }
                  select option:hover {
                    background: #6A0DAD !important;
                    color: white !important;
                  }
                `}
              </style>
            </div>
            <label
              htmlFor="Country"
              className="left-0 peer-focus:font-medium font-mono absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#6A0DAD] peer-focus:dark:text-[#6A0DAD] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
            >
              COUNTRY*
            </label>
          </div>
          {formik.errors.Country && formik.touched.Country ? (
            <div className="text-sm text-red-600" role="alert">
              {formik.errors.Country}
            </div>
          ) : null}

          <div className="relative z-0 w-full mt-20 group">
            <div className="relative">
              <select
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.City}
                name="City"
                id="City"
                className="block py-2.5 px-0 w-full text-sm text-[#242645] bg-transparent border-0 border-b-2 border-[#D9D9D9] appearance-none dark:border-[#D9D9D9] dark:focus:border-[#6A0DAD] focus:outline-none focus:ring-0 focus:border-[#6A0DAD] peer transition-colors duration-300"
                required
                disabled={loadingCities || !selectedCountryCode}
              >
                <option value="" disabled className="text-gray-500">
                  {loadingCities ? "Loading..." : "Select a city"}
                </option>
                {cities.map((city) => (
                  <option
                    key={city.geonameId}
                    value={city.name}
                    className="text-[#242645] bg-white hover:bg-[#6A0DAD] hover:text-white py-2 px-4"
                  >
                    {city.name}
                  </option>
                ))}
              </select>
              <style>
                {`
                  #City {
                    background-image: none;
                    padding-right: 1.5rem;
                  }
                  #City::-ms-expand {
                    display: none;
                  }
                  .relative::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%) rotate(45deg);
                    width: 8px;
                    height: 8px;
                    border-right: 2px solid #242645;
                    border-bottom: 2px solid #242645;
                    pointer-events: none;
                  }
                  select:focus + .relative::after {
                    border-color: #6A0DAD;
                  }
                  select option {
                    background: white;
                    color: #242645;
                  }
                  select option:hover {
                    background: #6A0DAD !important;
                    color: white !important;
                  }
                `}
              </style>
            </div>
            <label
              htmlFor="City"
              className="left-0 peer-focus:font-medium font-mono absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#6A0DAD] peer-focus:dark:text-[#6A0DAD] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
            >
              CITY*
            </label>
          </div>
          {formik.errors.City && formik.touched.City ? (
            <div className="text-sm text-red-600" role="alert">
              {formik.errors.City}
            </div>
          ) : null}

          <div className="flex justify-center mt-16">
            <button
              type="submit"
              className="my-butt bg-[#6A0DAD] text-xl font-bold rounded-2xl"
            >
              Next
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        select {
          scrollbar-width: thin;
          scrollbar-color: #6A0DAD #D9D9D9;
        }
        select::-webkit-scrollbar {
          width: 8px;
        }
        select::-webkit-scrollbar-track {
          background: #D9D9D9;
          border-radius: 4px;
        }
        select::-webkit-scrollbar-thumb {
          background: #6A0DAD;
          border-radius: 4px;
        }
        select::-webkit-scrollbar-thumb:hover {
          background: #5a0c9d;
        }
      `}</style>
    </>
  );
}