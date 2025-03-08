import React, { useState } from "react";
import Modal from "./Modal";

import vodafone from "../../../../../assets/vodafone.png";
import ibm from "../../../../../assets/ibm.png";
import blink22 from "../../../../../assets/blink22.png";
import Search from "../../../../../assets/searchhh.png";

function Following({ isOpen, onClose }) {
  // Initial list of followings
  const initialFollowings = [
    { name: "Vodafone Egypt", logo: vodafone },
    { name: "IBM", logo: ibm },
    { name: "Blink22", logo: blink22 },
  ];

  // State for the search term and filtered followings
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFollowings, setFilteredFollowings] = useState(initialFollowings);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter the followings based on the search term
    const filtered = initialFollowings.filter((company) =>
      company.name.toLowerCase().includes(term)
    );
    setFilteredFollowings(filtered);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Followings">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[450px] max-h-[80vh] overflow-y-auto relative space-y-4">
          {/* Header */}
          <div className="flex justify-center mb-7">
            <h2 className="text-xl font-bold">Followings</h2>
            <div className="absolute top-4 right-4 scale-150">
              <button
                className="text-gray-500 hover:text-black"
                onClick={onClose}
              >
                ✖
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full mt-9">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border text-sm rounded-full text-gray-700 focus:outline-none"
            />
            <img
              src={Search}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
          </div>

          {/* Followings List */}
          <ul className="space-y-6">
            {filteredFollowings.length > 0 ? (
              filteredFollowings.map((company, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-8 h-8 rounded-md"
                    />
                    <span className="text-md font-medium">{company.name}</span>
                  </div>
                  <button className="border px-3 py-2 rounded-md border-[#201A23] text-black hover:bg-gray-100">
                    Following
                  </button>
                </li>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No results found.
              </div>
            )}
          </ul>
        </div>
      </div>
    </Modal>
  );
}

export default Following;