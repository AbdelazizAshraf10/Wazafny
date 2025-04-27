import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import Modal from "./Modal";
import Trash from "../../../../../assets/trashPin.png";
import { InputField, SelectField, InputFieldOption, CustomSelectField } from "./my-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ onLinksChange, initialData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const [FormInputs, setFormInputs] = useState({
    FirstName: "",
    LastName: "",
    Headline: "",
    Location: "",
    City: "",
    WebsiteLinks: [],
  });

  // Initialize FormInputs with initialData when the modal opens
  useEffect(() => {
    if (isModalOpen && initialData) {
      setFormInputs({
        FirstName: initialData.first_name || "",
        LastName: initialData.last_name || "",
        Headline: initialData.headline || "",
        Location: initialData.country || "",
        City: initialData.city || "",
        WebsiteLinks: initialData.links && initialData.links.length > 0
          ? initialData.links.map(link => ({
              website: link.link || "", // Use 'link' instead of 'url'
              linkText: link.link_name || link.link || "", // Use 'link_name' instead of 'title'
              link_id: link.link_id || null,
            }))
          : [],
      });
    }
  }, [isModalOpen, initialData]);

  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;

  const validateUrl = (url) => {
    return urlRegex.test(url) && url.trim() !== "";
  };

  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await axios.get(
          "http://api.geonames.org/countryInfoJSON?username=youssef797"
        );
        setCountries(response.data.geonames || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setErrors((prev) => ({
          ...prev,
          Location: "Failed to load countries. Please try again.",
        }));
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (FormInputs.Location && countries.length > 0) {
      const selectedCountry = countries.find(
        (country) => country.countryName === FormInputs.Location
      );
      if (selectedCountry) {
        setSelectedCountryCode(selectedCountry.countryCode);
        setCityNotFound(false);
      } else {
        setSelectedCountryCode("");
        setCityNotFound(false);
      }
    } else {
      setSelectedCountryCode("");
      setCities([]);
      setFormInputs((prev) => ({ ...prev, City: "" }));
      setCityNotFound(false);
    }
  }, [FormInputs.Location, countries]);

  useEffect(() => {
    if (!selectedCountryCode) {
      setCities([]);
      setFormInputs((prev) => ({ ...prev, City: "" }));
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
        console.log("Fetched cities:", fetchedCities);

        if (FormInputs.City) {
          const selectedCity = fetchedCities.find(
            (city) => city.name === FormInputs.City
          );
          if (!selectedCity) {
            setCityNotFound(true);
            setFormInputs((prev) => ({ ...prev, City: "" }));
          } else {
            setCityNotFound(false);
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setErrors((prev) => ({
          ...prev,
          City: "Failed to load cities. Please try again.",
        }));
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedCountryCode, FormInputs.City]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!FormInputs.FirstName.trim()) {
       newErrors.FirstName = "First Name is required";
      isValid = false;
    }
    if (!FormInputs.LastName.trim()) {
      newErrors.LastName = "Last Name is required";
      isValid = false;
    }
    if (!FormInputs.Headline.trim()) {
      newErrors.Headline = "Headline is required";
      isValid = false;
    }
    if (!FormInputs.Location.trim()) {
      newErrors.Location = "Location is required";
      isValid = false;
    }
    if (!FormInputs.City.trim()) {
      newErrors.City = "City is required";
      isValid = false;
    }

    FormInputs.WebsiteLinks.forEach((link, index) => {
      if (link.website && !validateUrl(link.website)) {
        newErrors[`Website-${index}`] = "Please enter a valid URL (e.g., https://example.com)";
        isValid = false;
      }
      if (link.website && !link.website.trim()) {
        newErrors[`Website-${index}`] = "Website URL cannot be empty";
        isValid = false;
      }
      if (link.linkText && !link.linkText.trim()) {
        newErrors[`LinkText-${index}`] = "Link text cannot be empty";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = FormInputs.WebsiteLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setFormInputs({ ...FormInputs, WebsiteLinks: updatedLinks });

    if (field === "website") {
      const newErrors = { ...errors };
      if (value && !validateUrl(value)) {
        newErrors[`Website-${index}`] = "Please enter a valid URL (e.g., https://example.com)";
      } else if (value && !value.trim()) {
        newErrors[`Website-${index}`] = "Website URL cannot be empty";
      } else {
        delete newErrors[`Website-${index}`];
      }
      setErrors(newErrors);
    }

    if (field === "linkText") {
      const newErrors = { ...errors };
      if (value && !value.trim()) {
        newErrors[`LinkText-${index}`] = "Link text cannot be empty";
      } else {
        delete newErrors[`LinkText-${index}`];
      }
      setErrors(newErrors);
    }
  };

  const addNewLink = () => {
    setFormInputs({
      ...FormInputs,
      WebsiteLinks: [
        ...FormInputs.WebsiteLinks,
        { website: "", linkText: "", link_id: null },
      ],
    });
  };

  const removeLink = (index) => {
    setFormInputs({
      ...FormInputs,
      WebsiteLinks: FormInputs.WebsiteLinks.filter((_, i) => i !== index),
    });
    const newErrors = { ...errors };
    delete newErrors[`Website-${index}`];
    delete newErrors[`LinkText-${index}`];
    setErrors(newErrors);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setApiError("Authentication token not found. Please log in again.");
      return;
    }

    const seeker_id = localStorage.getItem("seeker_id");
    if (!seeker_id) {
      setApiError("Seeker ID not found. Please log in again.");
      return;
    }

    const requestBody = {
      seeker_id: parseInt(seeker_id),
      first_name: FormInputs.FirstName,
      last_name: FormInputs.LastName,
      headline: FormInputs.Headline,
      country: FormInputs.Location,
      city: FormInputs.City,
      links: FormInputs.WebsiteLinks
        .filter(link => link.website.trim() && link.linkText.trim()) // Only include non-empty links
        .map((link) => ({
          link_id: link.link_id,
          link_name: link.linkText,
          link: link.website,
        })),
    };

    try {
      const response = await axios.post(
        "https://wazafny.online/api/update-personal-info",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data);

      // Notify parent component of updated links
      const updatedLinks = FormInputs.WebsiteLinks
        .filter(link => link.website.trim() && link.linkText.trim())
        .map(link => ({
          website: link.website,
          linkText: link.linkText,
          link_id: link.link_id,
        }));
      onLinksChange(updatedLinks);
      setIsModalOpen(false);
      setApiError("");
    } catch (error) {
      console.error("Error updating personal info:", error);
      if (error.response?.status === 401) {
        setApiError("Unauthorized. Please log in again.");
        setTimeout(() => navigate("/Login"), 2000);
      } else if (error.response?.status === 404) {
        setApiError("Resource not found.");
      } else if (error.response?.status === 500) {
        setApiError("Server error. Please try again later.");
      } else if (error.response?.status === 422) {
        setApiError("Validation error. Please check your inputs.");
      } else {
        setApiError(
          error.response?.data?.message || "Failed to update personal info. Please try again."
        );
      }
    }
  };

  return (
    <div>
      <Pencil
        className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black"
        onClick={() => setIsModalOpen(true)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Personal Information"}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form
            className="bg-white p-6 rounded-lg shadow-lg w-[750px] text-left relative overflow-y-auto max-h-[90vh]"
            onSubmit={handleSave}
          >
            <div className="flex justify-between items-center relative mb-3">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <button
                className="text-gray-500 hover:text-black scale-150"
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
            </div>

            {apiError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                {apiError}
              </div>
            )}

            <InputField
              label="First Name"
              name="FirstName"
              value={FormInputs.FirstName}
              onChange={(e) => {
                setFormInputs({ ...FormInputs, FirstName: e.target.value });
                setErrors({
                  ...errors,
                  FirstName: e.target.value.trim() ? "" : "First Name is required",
                });
              }}
              placeholder="First name"
              required
              error={errors.FirstName}
            />

            <InputField
              label="Last Name"
              name="LastName"
              value={FormInputs.LastName}
              onChange={(e) => {
                setFormInputs({ ...FormInputs, LastName: e.target.value });
                setErrors({
                  ...errors,
                  LastName: e.target.value.trim() ? "" : "Last Name is required",
                });
              }}
              placeholder="Last name"
              required
              error={errors.LastName}
            />

            <InputField
              label="Headline"
              name="Headline"
              value={FormInputs.Headline}
              onChange={(e) => {
                setFormInputs({ ...FormInputs, Headline: e.target.value });
                setErrors({
                  ...errors,
                  Headline: e.target.value.trim() ? "" : "Headline is required",
                });
              }}
              placeholder="Headline"
              required
              error={errors.Headline}
            />

            <div className="flex gap-4 mb-4">
              <CustomSelectField
                label="Location"
                name="Location"
                value={FormInputs.Location}
                onChange={(e) => {
                  setFormInputs({
                    ...FormInputs,
                    Location: e.target.value,
                    City: "",
                  });
                  setErrors({
                    ...errors,
                    Location: e.target.value.trim() ? "" : "Location is required",
                    City: "",
                  });
                }}
                options={
                  loadingCountries
                    ? ["Loading..."]
                    : ["Select Country", ...countries.map((c) => c.countryName)]
                }
                disabled={loadingCountries}
                required
                error={errors.Location}
              />
              <CustomSelectField
                label="City"
                name="City"
                value={FormInputs.City}
                onChange={(e) => {
                  setFormInputs({ ...FormInputs, City: e.target.value });
                  setErrors({
                    ...errors,
                    City: e.target.value.trim() ? "" : "City is required",
                  });
                  setCityNotFound(false);
                }}
                options={
                  loadingCities
                    ? ["Loading..."]
                    : cityNotFound
                    ? ["City not found, please reselect"]
                    : ["Select City", ...cities.map((c) => c.name).sort()]
                }
                disabled={loadingCities || !selectedCountryCode}
                required
                error={errors.City}
              />
            </div>

            {FormInputs.WebsiteLinks.length > 0 && (
              <div className="overflow-y-auto max-h-[40vh] pr-2">
                {FormInputs.WebsiteLinks.map((link, index) => (
                  <div key={index} className="flex gap-4 mb-4 items-center">
                    <InputFieldOption
                      label="Website"
                      name={`Website-${index}`}
                      value={link.website}
                      onChange={(e) =>
                        handleLinkChange(index, "website", e.target.value)
                      }
                      placeholder="https://example.com"
                      error={errors[`Website-${index}`]}
                    />
                    <InputFieldOption
                      label="Link text"
                      name={`LinkText-${index}`}
                      value={link.linkText}
                      onChange={(e) => {
                        handleLinkChange(index, "linkText", e.target.value);
                        setErrors({
                          ...errors,
                          [`LinkText-${index}`]: e.target.value.trim()
                            ? e.target.value.length > 50
                              ? "Link text cannot exceed 50 characters"
                              : ""
                            : "Link text cannot be empty",
                        });
                      }}
                      placeholder="Link text"
                      maxLength={50}
                      error={errors[`LinkText-${index}`]}
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-[#201A23] hover:text-red-700"
                    >
                      <img className="scale-150 mt-6" src={Trash} alt="Delete" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="text-purple-600 text-sm font-medium flex items-center gap-1 mb-4"
              onClick={addNewLink}
            >
              + Add New link
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                className="p-2 w-[112px] bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition mx-4"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default EditProfile;