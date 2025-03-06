

export const InputField = ({ label, name, value, onChange, placeholder, required = false }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      <input
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
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


export const SelectField = ({ label, name, value, onChange, options }) => {
  return (
    <div className="w-1/2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}*</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white"
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












