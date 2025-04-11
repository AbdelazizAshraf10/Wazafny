import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import framer-motion

function SecondSection() {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to manage form data
  const [formData, setFormData] = useState({
    about: `The Vodafone Tech Innovation Center Dresden is Vodafone’s new global center for innovation and co-creation with other top tech world-wide companies, universities and research institutes. The scope of this new hub is to improve people’s lives by innovating communications and empower businesses for a digital and sustainable future.

We use newest technologies such as 5G, 6G, Augmented Reality, Artificial Intelligence, Data Analytics and Security by Design in order to build new products and propositions for health, industry, transport, automotive, agriculture and many more.

Dresden is a dynamically growing high tech region in the heart of Europe with a strong industrial focus, excellent research landscape. At the same time Dresden is a great place to live with manifold culture, unspoiled nature and an international and family friendly environment. The ideal spot for creativity and innovation.`,
    industry: 'TELECOMMUNICATIONS',
    companySize: '201-500 employees',
    headquarters: 'Dresden, Saxony',
    founded: '2021',
    country: 'Egypt',
    city: 'Cairo',
  });

  // State to manage word count for the "About" textarea
  const [wordCount, setWordCount] = useState(
    formData.about.trim().split(/\s+/).filter(Boolean).length
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'about') {
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length <= 300) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setWordCount(words.length);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false); // Close modal after saving
  };

  // Animation variants for the heading and edit icon
  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Animation variants for the about paragraph
  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: 'easeOut',
      },
    },
  };

  // Animation variants for the details section (staggered effect)
  const detailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2, // Staggered delay for each detail
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="w-[1225px] mx-auto p-6 boder-[#D9D9D9] border-2 bg-white rounded-[15.47px] ">
      {/* Header with Edit Icon */}
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z"
            />
          </svg>
        </button>
      </motion.div>

      {/* About Section */}
      <motion.p
        className="text-gray-700 mb-4"
        variants={paragraphVariants}
        initial="hidden"
        animate="visible"
      >
        {formData.about}
      </motion.p>

      {/* Details Section */}
      <motion.div className="mt-6" initial="hidden" animate="visible">
        <motion.h2
          className="text-lg font-semibold"
          custom={0}
          variants={detailVariants}
        >
          Industry
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-4"
          custom={1}
          variants={detailVariants}
        >
          {formData.industry}
        </motion.p>

        <motion.h2
          className="text-lg font-semibold"
          custom={2}
          variants={detailVariants}
        >
          Company size
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-4"
          custom={3}
          variants={detailVariants}
        >
          {formData.companySize}
        </motion.p>

        <motion.h2
          className="text-lg font-semibold"
          custom={4}
          variants={detailVariants}
        >
          Headquarters
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-4"
          custom={5}
          variants={detailVariants}
        >
          {formData.headquarters}
        </motion.p>

        <motion.h2
          className="text-lg font-semibold"
          custom={6}
          variants={detailVariants}
        >
          Founded
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-4"
          custom={7}
          variants={detailVariants}
        >
          {formData.founded}
        </motion.p>

        <motion.h2
          className="text-lg font-semibold"
          custom={8}
          variants={detailVariants}
        >
          Location
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-4"
          custom={9}
          variants={detailVariants}
        >
          {formData.country}, {formData.city}
        </motion.p>
      </motion.div>

      {/* Modal */}
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
              {/* About */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
                <p className="text-right text-xs text-gray-500 mt-1">
                  {wordCount}/300
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Industry */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Headquarters */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headquarters<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Company Size */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company size<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Founded */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founded<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Country</option>
                    <option value="Egypt">Egypt</option>
                    {/* Add more countries as needed */}
                  </select>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">City</option>
                    <option value="Cairo">Cairo</option>
                    {/* Add more cities as needed */}
                  </select>
                </div>
              </div>

              <div className="text-end">
                {/* Save Button */}
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