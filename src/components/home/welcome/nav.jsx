
import logo from "../../../assets/wazafny.png";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className="mt-4 md:mt-8 flex items-center justify-between px-5 sm:px-10 md:px-20">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src={logo}
          className="w-[100px] sm:w-[120px] md:w-[170px] object-cover"
          alt="Wazafny Logo"
        />
      </div>

      {/* Buttons Section */}
      <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
        <Link to="/login">
          <button className="bg-[#6a0dad] text-white px-6 sm:px-8 md:px-10 py-2 rounded-lg text-base sm:text-lg md:text-xl font-bold transition duration-300 hover:bg-[#5c0bb8]">
            Login
          </button>
        </Link>



        <Link to="/register">
          <button className="border-2 sm:border-3 border-[#6a0dad] text-[#6a0dad] px-4 sm:px-6 py-1 sm:py-1.5 text-base sm:text-lg md:text-xl font-bold rounded-lg transition duration-300 hover:bg-[#6a0dad] hover:text-white">
            Signup
          </button>
        </Link>
        
      </div>
    </div>
  );
}

export default Nav;




// className="bg-[#6a0dad] text-white px-6 sm:px-8 md:px-10 py-2 rounded-lg text-base sm:text-lg md:text-xl font-bold transition duration-300 hover:bg-[#5c0bb8]"
