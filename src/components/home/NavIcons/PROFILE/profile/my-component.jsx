import { useState, useEffect, useRef } from "react";

export const InputField = ({ label, name, value, onChange, placeholder, required}) => {
  return (
    <div className="w-full">
      <label className=" text-sm font-medium text-gray-700 ">
        {label} {required && "*"}
      </label>
      <input
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md text-gray-900 mb-2 "
        placeholder={placeholder}
      />
    </div>
  );
};



export const InputFieldOption = ({ label, name, value, onChange, placeholder }) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {}
        </label>
        <input
          
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
          placeholder={placeholder}
        />
      </div>
    );
  };


  export const SelectField = ({ label, name, value, onChange, options, disabled, className }) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full p-2 border rounded-md transition ${
            disabled
              ? "border-gray-200 bg-[#EFF0F2] text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-900 hover:border-black focus:ring-black"
          }`}
        >
          {options.map((option, index) => (
            <option key={index} value={option} className="text-gray-900">
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  export const CustomSelectField = ({
    label,
    name,
    value,
    onChange,
    options,
    disabled,
    required,
    error,
    className,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
  
    const handleOptionKeyDown = (e, option) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange({ target: { name, value: option } });
        setIsOpen(false);
      }
    };
  
    return (
      <div className={`w-full relative ${className}`} ref={wrapperRef}>
        <style>
          {`
            .custom-select-options {
              max-height: 200px; /* Reduced height of the dropdown list */
              overflow-y: auto;
              scrollbar-width: thin;
              scrollbar-color: #888 transparent;
              border: 1px solid #d1d5db;
              border-radius: 0.375rem;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .custom-select-options::-webkit-scrollbar {
              width: 8px;
            }
            .custom-select-options::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 4px;
            }
            .custom-select-option {
              padding: 0.25rem 0.75rem; /* Reduced padding for compact options */
              line-height: 1.25rem; /* Reduced line height */
              font-size: 0.875rem; /* Smaller font size */
            }
            .custom-select-option:hover {
              background-color: #f1f1f1;
            }
            .custom-select-button {
              padding: 0.5rem; /* Match input field height */
              height: 2rem; /* Reduced height */
              line-height: 1rem; /* Center text vertically */
            }
          `}
        </style>
  
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`w-full custom-select-button border rounded-md text-left transition flex items-center justify-between ${
            disabled
              ? "border-gray-200 bg-[#EFF0F2] text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-900 hover:border-black focus:ring-black focus:outline-none"
          }`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{value || options[0]}</span>
          <span className="ml-2">▼</span>
        </button>
        {isOpen && !disabled && (
          <div
            className="absolute w-full mt-1 bg-white custom-select-options z-10"
            role="listbox"
          >
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  onChange({ target: { name, value: option } });
                  setIsOpen(false);
                }}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                className="custom-select-option cursor-pointer text-gray-900"
                role="option"
                aria-selected={value === option}
                tabIndex={0}
              >
                {option}
              </div>
            ))}
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };
  












