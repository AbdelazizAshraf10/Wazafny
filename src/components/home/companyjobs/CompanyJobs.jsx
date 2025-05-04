import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import search from "../../../assets/seeker/search.png";
import loc from "../../../assets/seeker/location.png";
import { useNavigate } from "react-router-dom";

// Counter component to animate numbers
const Counter = ({ target, duration = 230 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    if (start === end) return;

    const incrementTime = duration / end;
    const step = () => {
      start += 1;
      setCount(start);
      if (start < end) {
        setTimeout(step, incrementTime);
      }
    };

    step();
  }, [target, duration]);

  // Format the number (e.g., 6900 -> 6.9K)
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return <span>{formatNumber(count)}</span>;
};

function CompanyJobs() { // Renamed to match the component's purpose
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch companies from API using axios
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view companies.");
          setTimeout(() => navigate("/Login"), 2000);
          return;
        }

        const response = await axios.get("https://wazafny.online/api/show-compaines", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        
        setCompanies(Array.isArray(response.data.companies) ? response.data.companies : []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate]);

  // Filter companies based on search term across company_name, company_city, and company_country
  const filteredCompanies = companies.filter((company) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      company.company_name.toLowerCase().includes(searchLower) ||
      (company.company_city && company.company_city.toLowerCase().includes(searchLower)) ||
      (company.company_country && company.company_country.toLowerCase().includes(searchLower))
    );
  });

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.2, // Stagger the cards
        staggerChildren: 0.1, // Stagger the children within each card
      },
    }),
  };

  // Animation variants for the child elements within the card
  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Search Bar */}
      <div className="w-[30%] mx-auto px-4 py-6">
        <div className="relative">
          <img
            src={search}
            alt="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 p-3 border border-gray-300 rounded-[88px] focus:outline-none focus:ring-2 focus:ring-[#D9D9D9]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Company Cards */}
      <div className="max-w-6xl border-2 rounded-[16px] border-[#D9D9D9] mx-auto px-4 p-10 bg-white">
        {loading ? (
          <p className="text-center text-gray-500 p-6">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 p-6">Error: {error}</p>
        ) : filteredCompanies.length > 0 ? (
          filteredCompanies.map((company, index) => (
            <div key={company.company_id}>
              <motion.div
                onClick={() => navigate(`/seeker/companyOverview/${company.company_id}`)} // Updated navigation
                className="p-6 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01] hover:shadow-md cursor-pointer"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index} // Pass the index to stagger the card animation
              >
                {/* Top Row */}
                <motion.div
                  className="flex items-center justify-between"
                  variants={childVariants}
                >
                  <motion.div
                    className="flex items-center gap-4"
                    variants={childVariants}
                  >
                    <img
                      src={company.profile_img}
                      alt={`${company.company_name} logo`}
                      className="w-10 h-10 rounded-md object-contain"
                      onError={(e) => (e.target.src = "default-image-url")} // Add fallback image
                    />
                    <p className="text-xl font-bold text-[#201A23]">
                      {company.company_name}
                    </p>
                  </motion.div>

                  <motion.div
                    className="flex gap-20 text-sm font-semibold text-center text-[#201A23]"
                    variants={childVariants}
                  >
                    <motion.div variants={childVariants}>
                      <p className="text-base">
                        <Counter target={company.followers_count} />
                      </p>
                      <p className="text-gray-500">Followers</p>
                    </motion.div>
                    <motion.div variants={childVariants}>
                      <p className="text-base">
                        <Counter target={company.jobs_count} />
                      </p>
                      <p className="text-gray-500">Jobs</p>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* About Section */}
                <motion.p
                  className="mt-4 text-xl font-bold text-[#201A23]"
                  variants={childVariants}
                >
                  About
                </motion.p>
                <motion.p
                  className="mt-2 text-lg text-[#201A23] line-clamp-2"
                  variants={childVariants}
                >
                  {company.about}
                </motion.p>

                {/* Location */}
                <motion.div
                  className="flex items-center gap-2 mt-5 text-md text-[#201A23]"
                  variants={childVariants}
                >
                  <img src={loc} alt="location icon" className="w-4 h-4" />
                  <span>
                    {company.company_city}, {company.company_country}
                  </span>
                </motion.div>
              </motion.div>

              {/* Divider */}
              {index !== filteredCompanies.length - 1 && (
                <hr className="border-t border-[#D9D9D9] my-4" />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-6">No companies found.</p>
        )}
      </div>
    </div>
  );
}

export default CompanyJobs;