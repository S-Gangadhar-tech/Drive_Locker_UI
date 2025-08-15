import { useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi"; // Login icon
import assets from "../assets/assets"; // Ensure this contains `home`
import { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {
    const navigate = useNavigate();
    const { BackendURL,
        setIsLoggedin,
        userData,
        setUserData, } = useContext(AppContext);
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef(null);


    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        };
        if (dropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdown]);

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BackendURL}/auth/send-otp`)

            if (res.status === 200) {
                navigate("/email-verify")

                toast.success("otp sent success")
            } else {
                toast.error("unable to send otp")
            }

        } catch (error) {
            console.log(error);

            toast.error(error.response.data.message || "failed to send otp")
        }
    }
    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BackendURL}/auth/logout`)
            if (res.status === 200) {
                setIsLoggedin(false)
                setUserData(false)
                toast.success("logout succes")
                navigate("/login")
            } else {
                toast.error("logout failed")
            }
        } catch (error) {
            toast.error(error.response.error.message)
        }
    }

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 shadow-sm bg-white border-b border-green-100">
            {/* Logo and Brand Name */}
            <div className="flex items-center space-x-3">
                <img
                    src={assets.home}
                    alt="Drivelocker Logo"
                    className="h-8 w-8 cursor-pointer transition-transform hover:scale-110"
                    onClick={() => navigate("/")}
                />
                <span className="text-xl font-semibold text-green-600 select-none">DriveLocker</span>
            </div>

            {/* Login Button or User Dropdown */}
            {userData ? (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdown((prev) => !prev)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold select-none focus:outline-none focus:ring-2 focus:ring-green-500 hover:cursor-pointer"
                        aria-haspopup="true"
                        aria-expanded={dropdown ? "true" : "false"}
                        aria-label="User menu"
                    >
                        {userData.name[0].toUpperCase()}
                    </button>

                    {dropdown && (
                        <div className="absolute right-0 mt-2 w-60 bg-white shadow-xl rounded-lg py-3 z-50 border border-green-200">
                            {!userData.isAccountVerified && (
                                <div className="px-5 py-3 text-base text-green-600 font-semibold border-b border-red-200 select-none
                                hover:bg-gray-200 cursor-pointer"
                                    onClick={sendVerificationOtp}>
                                    Verify email
                                </div>
                            )}
                            <div
                                className="px-5 py-3 text-lg text-red-700 hover:bg-red-200 cursor-pointer rounded-md transition-colors duration-150 select-none"
                                onClick={
                                    /* your logout handler here */
                                    handleLogout
                                }
                                role="button"
                                tabIndex={0}

                            >
                                Logout
                            </div>
                            {/* Add more dropdown items here if needed */}
                        </div>
                    )}

                </div>
            ) : (
                <div
                    onClick={handleLogin}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 cursor-pointer transition duration-200 select-none"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                >
                    <FiLogIn size={20} />
                    <span className="text-md font-medium">Login</span>
                </div>
            )}
        </nav>
    );
};

export default Menubar;
