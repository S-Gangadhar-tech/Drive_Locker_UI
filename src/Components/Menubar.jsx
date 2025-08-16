import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { BackendURL, setIsLoggedin, setUserData, userData } = useContext(AppContext);

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BackendURL}/auth/send-otp`);
            if (res.status === 200) {
                navigate("/email-verify");
                toast.success("OTP sent successfully");
            } else {
                toast.error("Unable to send OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleLogout = async () => {
        try {
            const res = await axios.post(
                `${BackendURL}/auth/logout`,
                {},
                { withCredentials: true }
            );
            if (res.status === 200) {
                setIsLoggedin(false);
                setUserData(false);
                toast.success("Logged out successfully");
                navigate("/login");
            } else {
                toast.error("Logout failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const navItems = userData ? (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/Features")}
                className="text-lg md:text-xl font-semibold px-4 py-2 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-900/20 transition-all cursor-pointer"
            >
                Features
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/Notes")}
                className="text-lg md:text-xl font-semibold px-4 py-2 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-900/20 transition-all cursor-pointer"
            >
                Notes
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/Files")}
                className="text-lg md:text-xl font-semibold px-4 py-2 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-900/20 transition-all cursor-pointer"
            >
                Files
            </motion.button>
            {!userData.hasPasskey && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/CreatePasskey")}
                    className="text-lg md:text-xl font-semibold px-4 py-2 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-900/20 transition-all cursor-pointer"
                >
                    Create-Passkey
                </motion.button>
            )}
        </>
    ) : null;



    const authActions = userData ? (
        <>
            {!userData.isAccountVerified && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendVerificationOtp}
                    className="px-4 py-2 text-sm md:text-md font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                >
                    Verify Email
                </motion.button>
            )}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 text-sm md:text-md font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            >
                Logout
            </motion.button>
        </>
    ) : (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 cursor-pointer transition-colors"
        >
            <FiLogIn size={20} />
            <span className="text-md font-medium">Login</span>
        </motion.div>
    );

    return (
        <nav className="relative flex items-center justify-between px-4 py-3 md:px-6 md:py-4 shadow-sm bg-gray-900 border-b border-gray-700">
            {/* Logo and Brand Name */}
            <div
                className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
                onClick={() => navigate("/")}
            >
                {/* <motion.img
                    src={assets.home}
                    alt="Drivelocker Logo"
                    className="h-7 w-7 md:h-8 md:w-8 transition-transform rounded rounded-5"
                    whileHover={{ scale: 1.1 }}
                    style={{ color: "white" }}
                /> */}
                <span className="text-lg md:text-xl font-semibold text-green-400 select-none">
                    DriveLocker
                </span>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
                {authActions}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-green-400 cursor-pointer"
                    aria-label="Toggle menu"
                    type="button"
                >
                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </motion.button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex flex-1 justify-center items-center space-x-8 text-green-400">
                {navItems}
            </div>

            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center space-x-4">{authActions}</div>

            {/* Mobile Collapsible Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-full left-0 w-full bg-gray-900 border-t border-gray-700 md:hidden z-50 py-4 flex flex-col items-center space-y-4 text-green-400"
                >
                    {navItems}
                </motion.div>
            )}
        </nav>
    );
};

export default Menubar;
