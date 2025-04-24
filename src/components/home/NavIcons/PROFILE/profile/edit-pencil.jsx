import { useState } from "react";
import { Pencil } from "lucide-react";
import Modal from "./Modal";
import Trash from "../../../../../assets/trashPin.png";
import { InputField } from "./my-component";
import { SelectField } from "./my-component";
import { InputFieldOption } from "./my-component";

const EditProfile = ({ onLinksChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [FormInputs, setFormInputs] = useState({
    FirstName: "",
    LastName: "",
    Headline: "",
    Location: "",
    City: "",
    WebsiteLinks: [],
  });

  // URL validation regex
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;

  const validateUrl = (url) => {
    return urlRegex.test(url) && url.trim() !== "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate required fields
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

    // Validate WebsiteLinks
    FormInputs.WebsiteLinks.forEach((link, index) => {
      if (link.website && !validateUrl(link.website)) {
        newErrors[`Website-${index}`] = "Please enter a valid URL (e.g., https://example.com)";
        isValid = false;
      }
      if (!link.website.trim()) {
        newErrors[`Website-${index}`] = "Website URL is required";
        isValid = false;
      }
      if (!link.linkText.trim()) {
        newErrors[`LinkText-${index}`] = "Link text is required";
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

    // Real-time URL validation
    if (field === "website") {
      const newErrors = { ...errors };
      if (value && !validateUrl(value)) {
        newErrors[`Website-${index}`] = "Please enter a valid URL (e.g., https://example.com)";
      } else if (!value.trim()) {
        newErrors[`Website-${index}`] = "Website URL is required";
      } else {
        delete newErrors[`Website-${index}`];
      }
      setErrors(newErrors);
    }
  };

  const addNewLink = () => {
    setFormInputs({
      ...FormInputs,
      WebsiteLinks: [...FormInputs.WebsiteLinks, { website: "", linkText: "" }],
    });
  };

  const removeLink = (index) => {
    setFormInputs({
      ...FormInputs,
      WebsiteLinks: FormInputs.WebsiteLinks.filter((_, i) => i !== index),
    });
    // Clear errors for removed link
    const newErrors = { ...errors };
    delete newErrors[`Website-${index}`];
    delete newErrors[`LinkText-${index}`];
    setErrors(newErrors);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onLinksChange(FormInputs.WebsiteLinks);
      setIsModalOpen(false);
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

            <InputField
              label="First Name"
              name="FirstName"
              value={FormInputs.FirstName}
              onChange={(e) => {
                setFormInputs({ ...FormInputs, FirstName: e.target.value });
                setErrors({ ...errors, FirstName: e.target.value.trim() ? "" : "First Name is required" });
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
                setErrors({ ...errors, LastName: e.target.value.trim() ? "" : "Last Name is required" });
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
                setErrors({ ...errors, Headline: e.target.value.trim() ? "" : "Headline is required" });
              }}
              placeholder="Headline"
              required
              error={errors.Headline}
            />

            <div className="flex gap-4 mb-4">
              <SelectField
                label="Location"
                name="Location"
                value={FormInputs.Location}
                onChange={(e) =>
                  setFormInputs({ ...FormInputs, Location: e.target.value })
                }
                options={["Country", "Egypt", "KSA", "UAE"]}
              />
              <SelectField
                label="City"
                name="City"
                value={FormInputs.City}
                onChange={(e) =>
                  setFormInputs({ ...FormInputs, City: e.target.value })
                }
                options={["City", "Giza", "Cairo", "Tanta"]}
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
                      required
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
                            : "Link text is required",
                        });
                      }}
                      placeholder="Link text"
                      maxLength={50}
                      required
                      error={errors[`LinkText-${index}`]}
                    />
                    {FormInputs.WebsiteLinks.length >= 1 && (
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-[#201A23] hover:text-red-700"
                      >
                        <img className="scale-150 mt-6" src={Trash} alt="Delete" />
                      </button>
                    )}
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