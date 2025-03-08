import React from "react";
import logo from "../../../assets/Photo.png";
import back from "../../../assets/BG.png";
import Nav from "./nav";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${back})` }}
    >
      <Nav />
      <hr className="border-t-2 border-gray-300 my-4 sm:my-6 md:my-8" />

      <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 md:px-16 lg:px-1 mx-2 py-10 sm:py-16 md:py-20 lg:py-10">
        {/* Left Side: Text Content */}
        {/* lg:w-1/2 */}
        <div className="text-center lg:text-left mb-8   ml-9">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[#242645] leading-tight">
            Find Your Dream Job or <br />
            Hire the Best Talent
          </h1>

          <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl  font-bold text-[#6A0DAD] mt-6 sm:mt-8 md:mt-12">
            WAZAFNY connects job seekers and 
            employers for the perfect match.
          </p>

          {/* Responsive Buttons */}
          <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center lg:justify-start">
            <Link to="/Jobs">
              <button className="bg-[#6a0dad] text-white px-4 sm:px-6 py-2 sm:py-3.5 rounded-xl font-bold text-base sm:text-xl md:text-2xl transition duration-300 hover:bg-[#5c0bb8]">
                Find Jobs Now
              </button>
            </Link>

            <button className="border-4 border-[#242645] text-[#242645] px-4 sm:px-8  sm:py-2.5 rounded-xl font-bold text-base sm:text-xl md:text-2xl transition duration-300 hover:bg-gray-300">
              Post a Job
            </button>
          </div>
        </div>

        {/* Right Side: Responsive Image */}
        <div className="flex items-center justify-end lg:w-3/4 mt-8 lg:mt-0">
          <img
            src={logo}
            alt="Job Search Illustration"
            className="w-full sm:w-5/6 lg:w-11/12 h-auto object-cover rounded-lg  ml-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;