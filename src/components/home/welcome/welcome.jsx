import React from "react";
import logo from "../../../assets/Photo.png"
import back from "../../../assets/BG.png";
import Nav from "./nav";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${back})` }}
    >
      <Nav />
      <hr className="border-t-2 border-gray-300 my-[17px]" />

      <div className="py-27 flex flex-col lg:flex-row items-center justify-between md:px-20 lg:pr-0">
        {/* Left Side: Text Content */}
        <div className="text-center lg:text-left mb-12">
          <h1 className="text-3xl md:text-6xl font-bold text-[#242645]">
            Find Your Dream Job or <br />
            Hire the Best Talent
          </h1>

          <p className="lg:text-5xl font-bold text-purple-700 mt-14">
            WAZAFNY connects job seekers and <br />
            employers for the perfect match.
          </p>

          {/* Buttons */}
          <div className="mt-20 flex space-x-10 justify-center lg:justify-start">
            <Link to="/Jobs">
                <button className="bg-[#6a0dad] text-white px-6 py-3.5 rounded-xl font-bold text-2xl transition duration-300 hover:bg-[#5c0bb8]">
                Find Jobs Now
                </button>
            </Link>

            <button className="border-4 border-[#242645] text-[#242645] px-8 py-3.5 rounded-xl font-bold text-2xl transition duration-300 hover:bg-gray-300">
              Post a Job
            </button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="flex items-center justify-start lg:w-1/2 lg:mt-20 hidden sm:flex">
          <img
            src={logo}
            alt="Job Search Illustration"
            className="w-full md:w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
