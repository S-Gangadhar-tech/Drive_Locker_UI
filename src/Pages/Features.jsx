import { useContext } from "react";
import CustomButton from "../Util/Button";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaFile, FaStickyNote } from "react-icons/fa";
import { motion } from "framer-motion";

const Services = () => {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    return (
        <motion.div
            className="bg-gray-900/80 shadow-2xl rounded-2xl p-10 max-w-4xl mx-auto border border-gray-700 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-extrabold text-white mb-12 text-center">
                DriveLocker Features
            </h1>

            <div className="flex flex-col sm:flex-row gap-12 justify-center">
                {/* Notes Service Card */}
                <motion.div
                    className="bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-sm w-full cursor-pointer hover:shadow-cyan-500/50 hover:scale-[1.03] transition-transform duration-300"
                    onClick={() => navigate("/Notes")}
                    whileHover={{ scale: 1.05 }}
                >
                    <FaStickyNote className="text-cyan-400 mb-5" size={60} />
                    <h2 className="text-2xl font-bold text-white mb-4 text-center">
                        Create and Manage Your Notes
                    </h2>
                    <p className="text-gray-300 mb-8 text-center px-2">
                        A powerful tool for organizing your thoughts, ideas, and reminders.
                    </p>
                    <CustomButton
                        text="Use Notes"
                        handleOnclick={() => navigate("/Notes")}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white w-full py-3 rounded-lg font-semibold shadow-lg"
                    />
                </motion.div>

                {/* File Storage Service Card */}
                <motion.div
                    className="bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-sm w-full cursor-pointer hover:shadow-green-500/50 hover:scale-[1.03] transition-transform duration-300"
                    onClick={() =>
                        navigate(userData.hasPasskey ? "/Files" : "/Createpasskey")
                    }
                    whileHover={{ scale: 1.05 }}
                >
                    <FaFile className="text-green-400 mb-5" size={60} />
                    <h2 className="text-2xl font-bold text-white mb-4 text-center">
                        Personalized File Storage
                    </h2>
                    <p className="text-gray-300 mb-8 text-center px-2">
                        Securely store and access your files from anywhere, with custom
                        passkey protection.
                    </p>
                    <CustomButton
                        text="Use Files"
                        handleOnclick={() =>
                            navigate(userData.hasPasskey ? "/Files" : "/Createpasskey")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-lg font-semibold shadow-lg"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Services;
