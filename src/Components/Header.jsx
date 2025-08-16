import assets from "../assets/assets";
import { FaHandPeace } from "react-icons/fa";
import CustomButton from "../Util/Button";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-10 px-8 py-12 bg-gray-900/80 rounded-3xl shadow-xl border border-gray-700 backdrop-blur-md mx-auto">
      {/* Illustration / Banner */}
      <div className="flex justify-center items-center">
        <img
          src={assets.header}
          alt="Header Visual"
          className="w-48 h-48 object-contain rounded-2xl shadow-lg bg-gray-800 border border-gray-700"
        />
      </div>
      {/* Welcome Text */}
      <div className="flex flex-col items-center text-center w-full">
        <div className="flex items-center gap-3 mb-4">
          <h5 className="text-xl font-semibold text-gray-200">
            Hey {userData ? userData.name : "developer"}
          </h5>
          <FaHandPeace className="text-2xl text-emerald-400" title="Hello" />
        </div>
        <h1 className="text-5xl font-bold text-emerald-400 mb-4 drop-shadow">
          Welcome to our product
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-md">
          Let’s start your product tour
        </p>
        <CustomButton
          text={"Get Started"}
          handleOnclick={() => {
            navigate("/features");
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow"
        />
      </div>
    </div>
  );
};

export default Header;
