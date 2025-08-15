import { useContext } from "react";
import CustomButton from "../Util/Button";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaFile, FaStickyNote } from "react-icons/fa";

const Services = () => {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Our Services</h1>

                <div className="flex flex-col sm:flex-row gap-8">
                    {/* Notes Service Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-sm w-full">
                        <div className="text-blue-600 mb-4">
                            <FaStickyNote size={60} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Create and Manage Your Notes
                        </h2>
                        <p className="text-gray-600 mb-6 text-center">
                            A powerful tool for organizing your thoughts, ideas, and reminders.
                        </p>
                        <CustomButton
                            text="Use Notes"
                            handleOnclick={() => navigate("/Notes")}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3"
                        />
                    </div>

                    {/* File Storage Service Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-sm w-full">
                        <div className="text-green-600 mb-4">
                            <FaFile size={60} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Personalized File Storage
                        </h2>
                        <p className="text-gray-600 mb-6 text-center">
                            Securely store and access your files from anywhere, with custom passkey protection.
                        </p>
                        <CustomButton
                            text="Use Files"
                            handleOnclick={() => {
                                navigate(userData.hasPasskey ? "/Files" : "/Createpasskey");
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white w-full py-3"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;