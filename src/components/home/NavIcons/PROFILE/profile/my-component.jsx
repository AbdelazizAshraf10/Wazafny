

export const InputField = ({ label, name, value, onChange, placeholder, required = false }) => {
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
  












