import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Location() {
  const [countries, setCountries] = useState([]); // State to store country names
  const [error, setError] = useState(null); // State for API errors

  // Fetch countries from GeoNames API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "http://api.geonames.org/countryInfoJSON?username=youssef797"
        );
        console.log("API Response:", response.data);

        // Check if geonames array exists in the response
        if (response.data.geonames && Array.isArray(response.data.geonames)) {
          // Extract country names and sort them alphabetically
          const countryNames = response.data.geonames
            .map((country) => country.countryName)
            .sort();
          setCountries(countryNames);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err) {
        console.error("Error fetching countries:", {
          message: err.message,
          response: err.response?.data,
        });
        setError("Failed to load countries. Please try again later.");
      }
    };

    fetchCountries();
  }, []);

  // Formik setup
  function handleLogin(values) {
    console.log(values);
  }

  let myValidationSchema = Yup.object().shape({
    Country: Yup.string().required("country is required"),
    City: Yup.string().required("city is required"),
  });

  let formik = useFormik({
    initialValues: {
      Country: "",
      City: "",
    },
    validationSchema: myValidationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <div className="border-[2px] border-solid border-[#d9d9d9] rounded-[7%] p-12 pt-8 h-[500px] w-[440px] mx-auto mt-9">
        <h2 className="text-xl mb-3 text-[#242645] font-bold text-center py-6">
          Welcome, What's your location?
        </h2>
        {error && (
          <div className="text-sm text-red-600 text-center mb-4" role="alert">
            {error}
          </div>
        )}
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-md mx-auto my-auto"
        >
          <div className="relative z-0 w-full group">
            <div className="relative">
              <select
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Country}
                name="Country"
                id="Country"
                className="block py-2.5 px-0 w-full text-sm text-[#242645] bg-transparent border-0 border-b-2 border-[#D9D9D9] appearance-none dark:border-[#D9D9D9] dark:focus:border-[#6A0DAD] focus:outline-none focus:ring-0 focus:border-[#6A0DAD] peer transition-colors duration-300"
                required
              >
                <option value="" disabled className="text-gray-500">
                  Select a country
                </option>
                {countries.map((country, index) => (
                  <option
                    key={index}
                    value={country}
                    className="text-[#242645] bg-white hover:bg-[#6A0DAD] hover:text-white py-2 px-4"
                  >
                    {country}
                  </option>
                ))}
              </select>
              {/* Custom arrow using ::after pseudo-element */}
              <style>
                {`
                  #Country {
                    background-image: none;
                    padding-right: 1.5rem; /* Space for the arrow */
                  }
                  #Country::-ms-expand {
                    display: none; /* Hide default arrow in IE */
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
                    pointer-events: none; /* Prevent interaction with the arrow */
                  }
                  select:focus + .relative::after {
                    border-color: #6A0DAD; /* Change arrow color on focus */
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
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.City}
              type="text"
              name="City"
              id="City"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-[1.77px] border-[#D9D9D9] appearance-none dark:border-[#D9D9D9] dark:focus:border-[#6A0DAD] focus:outline-none focus:ring-0 focus:border-[#6A0DAD] peer transition-colors duration-300"
              placeholder=" "
              required
            />
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
              <Link to={"/info"}>Next</Link>
            </button>
          </div>
        </form>
      </div>

      {/* Global styles for select dropdown (applied to all select elements if needed) */}
      <style jsx global>{`
        select {
          /* Ensure the dropdown has a consistent look */
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