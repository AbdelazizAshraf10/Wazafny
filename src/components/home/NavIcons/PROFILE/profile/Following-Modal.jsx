import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Search from "../../../../../assets/searchhh.png";
import DefaultCompanyLogo from "../../../../../assets/company/default.png";
import axios from "axios";

function Following({ isOpen, onClose, followings }) {
  // Ensure followings is an array; default to empty array if undefined or not an array
  const initialFollowings = Array.isArray(followings)
    ? followings.map((company) => ({
        id: company.company_id,
        name: company.company_name,
        logo: company.profile_img,
      }))
    : [];

  // State for search term, filtered followings, and messages
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFollowings, setFilteredFollowings] = useState(initialFollowings);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const seekerId = localStorage.getItem("seeker_id");

  // Update filtered followings when followings prop or search term changes
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = initialFollowings.filter((company) =>
      company.name.toLowerCase().includes(term)
    );
    setFilteredFollowings(filtered);
  }, [searchTerm, followings]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle company click to navigate to company overview
  const handleCompanyClick = (companyId) => {
    console.log("Navigating with companyId:", companyId);
    if (!companyId || isNaN(companyId)) {
      console.error("companyId is undefined or invalid:", companyId);
      setMessage({
        text: "Invalid company ID. Please try again.",
        type: "error",
      });
      return;
    }
    navigate(`/seeker/companyOverview/${companyId}`);
  };

  // Handle unfollow action
  const handleUnfollow = async (companyId) => {
    if (!token) {
      setMessage({
        text: "Please log in to unfollow.",
        type: "error",
      });
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    if (!seekerId) {
      setMessage({
        text: "Missing seeker ID. Please log in again.",
        type: "error",
      });
      setTimeout(() => navigate("/Login"), 2000);
      return;
    }

    console.log("Unfollow Request:", {
      token,
      payload: { seeker_id: seekerId, company_id: companyId },
    });

    try {
      const response = await axios.delete("https://wazafny.online/api/unfollow", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          seeker_id: seekerId,
          company_id: companyId,
        },
      });

      console.log("Unfollow API Response:", response.data);

      // Remove the company from filteredFollowings
      setFilteredFollowings((prev) =>
        prev.filter((company) => company.id !== companyId)
      );

        ({
        text: "Unfollowed successfully.",
        type: "success",
      });
    } catch (err) {
      console.error("Error unfollowing company:", err);
      console.log("Error Response:", err.response?.data);

      if (err.response?.status === 401) {
        setMessage({
          text: "Unauthorized. Please log in again.",
          type: "error",
        });
        setTimeout(() => navigate("/Login"), 2000);
      } else if (err.response?.status === 400) {
        setMessage({
          text: err.response?.data?.message || "Invalid request. Please try again.",
          type: "error",
        });
      } else if (err.response?.status === 500) {
        setMessage({
          text: "Server error. Please try again later.",
          type: "error",
        });
      } else {
        setMessage({
          text: "Failed to unfollow. Please try again.",
          type: "error",
        });
      }
    }
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Followings">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[450px] max-h-[80vh] overflow-y-auto relative space-y-4">
          {/* Message Display */}
          {message.text && (
            <div
              className={`floating-message ${message.type} ${
                !message.text ? "hide" : ""
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Header */}
          <div className="flex justify-center mb-7">
            <h2 className="text-xl font-bold">Followings</h2>
            <div className="absolute top-4 right-4 scale-150">
              <button
                className="text-gray-500 hover:text-black"
                onClick={onClose}
                aria-label="Close followings modal"
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
              aria-label="Search followed companies"
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
              filteredFollowings.map((company) => (
                <li
                  key={company.id}
                  className="flex items-center justify-between"
                >
                  <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => handleCompanyClick(company.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleCompanyClick(company.id);
                      }
                    }}
                    aria-label={`View ${company.name} overview`}
                  >
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-8 h-8 rounded-md object-cover"
                      onError={(e) => {
                        console.warn(`Failed to load logo for ${company.name}:`, company.logo);
                        e.target.src = DefaultCompanyLogo;
                      }}
                    />
                    <span className="text-md font-medium">{company.name}</span>
                  </div>
                  <button
                    className="border px-3 py-2 rounded-md border-[#201A23] text-black hover:bg-gray-100"
                    onClick={() => handleUnfollow(company.id)}
                    aria-label={`Unfollow ${company.name}`}
                  >
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
      <style>
        {`
          @keyframes slideIn {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes slideOut {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-20px); opacity: 0; }
          }

          .floating-message {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out forwards;
          }

          .floating-message.success {
            background-color: #4caf50;
            color: white;
          }

          .floating-message.error {
            background-color: #f44336;
            color: white;
          }

          .floating-message.hide {
            animation: slideOut 0.3s ease-out forwards;
          }
        `}
      </style>
    </Modal>
  );
}

Following.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  followings: PropTypes.arrayOf(
    PropTypes.shape({
      company_id: PropTypes.number.isRequired,
      company_name: PropTypes.string.isRequired,
      profile_img: PropTypes.string,
    })
  ),
};

Following.defaultProps = {
  followings: [],
};

export default Following;