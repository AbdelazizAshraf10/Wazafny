import { useState } from "react";
import { Pencil } from "lucide-react";
import { FormEditPencil } from "../../../../../Contexts/FormEditPencilCon";
import Modal from "./Modal";
import Trash from "../../../../../assets/trashPin.png";
import { InputField } from "./my-component";
import { SelectField } from "./my-component";
import { InputFieldOption } from "./my-component";

const EditProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [FormInputs, setFormInputs] = useState({
    FirstName: "",
    LastName: "",
    Headline: "",
    Location: "",
    City: "",
    WebsiteLinks: [{ website: "", linkText: "" }], // Initial link fields
  });

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
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = FormInputs.WebsiteLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setFormInputs({ ...FormInputs, WebsiteLinks: updatedLinks });
  };

  return (
    <div>
      {/* Edit Pencil Icon */}
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
          <form className="bg-white p-6 rounded-lg shadow-lg w-[750px] text-left relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center relative mb-3">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <button
                className="text-gray-500 hover:text-black scale-150"
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
            </div>

            {/* First Name */}
            <InputField
              label="First Name"
              name="FirstName"
              value={FormInputs.FirstName}
              onChange={(e) =>
                setFormInputs({ ...FormInputs, FirstName: e.target.value })
              }
              placeholder="First name"
              required
            />

            {/* Last Name */}
            <InputField
              label="Last Name"
              name="LastName"
              value={FormInputs.LastName}
              onChange={(e) =>
                setFormInputs({ ...FormInputs, LastName: e.target.value })
              }
              placeholder="Last name"
              required
            />

            {/* Headline */}
            <InputField
              label="Headline"
              name="Headline"
              value={FormInputs.Headline}
              onChange={(e) =>
                setFormInputs({ ...FormInputs, Headline: e.target.value })
              }
              placeholder="Headline"
              required
            />

            {/* Location And City */}
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

            {/* Website Links and Dynamic Fields */}
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
                    placeholder="Link"
                    required
                  />
                  <InputField
                    label="Link text"
                    name={`LinkText-${index}`}
                    value={link.linkText}
                    onChange={(e) =>
                      handleLinkChange(index, "linkText", e.target.value)
                    }
                    placeholder="Link text"
                    required
                  />
                  {/* Trash Button: Only Show if More than One Link Exists */}
                  {FormInputs.WebsiteLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-[#201A23] hover:text-red-700"
                    >
                      <img src={Trash} alt="Delete" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Link Button */}
            <button
              type="button"
              className="text-purple-600 text-sm font-medium flex items-center gap-1 mb-4"
              onClick={addNewLink}
            >
              + Add New link
            </button>

            {/* Save Button */}
            <div className="flex justify-end ">
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

      {/* Personal Information Modal */}

      {/* Pass form data to UserProfile */}
      {/* <UserProfile
        FirstName={FormInputs.FirstName}
        LastName={FormInputs.LastName}
        Headline={FormInputs.Headline}
        Location={FormInputs.Location}
      /> */}
    </div>
  );
};

export default EditProfile;
