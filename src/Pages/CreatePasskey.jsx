import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaLock, FaKey } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";

const CreatePasskey = () => {
    const { BackendURL, userData, getUserdata } = useContext(AppContext);
    const navigate = useNavigate();

    const [passkey, setPasskey] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (userData && userData.hasPasskey) {
            navigate("/Files");
        }
    }, [userData, navigate]);

    const createKey = async () => {
        if (!userData) {
            setError("⚠️ User data not available. Please log in again.");
            return;
        }
        if (userData.hasPasskey) {
            navigate("/");
            return;
        }

        setMessage("");
        setError("");

        const passkeyRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passkeyRegex.test(passkey)) {
            setError(
                "❌ Passkey must be at least 8 characters, include an uppercase letter, lowercase letter, number, and special character."
            );
            return;
        }

        try {
            const response = await axios.post(`${BackendURL}/user/add-passkey`, {
                passKey: passkey,
            });

            toast.success(response.data.message || "Passkey set successfully ✅");
            setMessage(response.data.message || "Passkey set successfully ✅");
            setPasskey("");

            await getUserdata();
            navigate("/Files");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "❌ An error occurred while setting the passkey."
            );
        }
    };

    return (
        <motion.div
            className="bg-gray-900/80 shadow-2xl rounded-2xl p-8 w-full max-w-md mx-auto border border-gray-700 backdrop-blur-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Title */}
            <div className="flex items-center justify-center mb-6 space-x-2">
                <FaLock className="text-cyan-400 text-3xl" />
                <h1 className="text-3xl font-bold text-white">Create Passkey</h1>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-6 text-center">
                Your passkey must be at least{" "}
                <span className="font-semibold">8 characters</span> long and include an
                uppercase, lowercase, number, and special character.
            </p>

            {/* Input */}
            <div className="relative mb-4">
                <FaKey className="absolute left-3 top-3 text-gray-400" />
                <motion.input
                    type="password"
                    placeholder="Enter your passkey"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                />
            </div>

            {/* Button */}
            <motion.button
                onClick={createKey}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
            >
                <FaKey />
                <span>Set Passkey</span>
            </motion.button>

            {/* Success Message */}
            {message && (
                <motion.p
                    className="mt-4 flex items-center justify-center text-green-400 text-sm font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <AiFillCheckCircle className="mr-2" /> {message}
                </motion.p>
            )}

            {/* Error Message */}
            {error && (
                <motion.p
                    className="mt-4 flex items-center justify-center text-red-400 text-sm font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <MdError className="mr-2" /> {error}
                </motion.p>
            )}
        </motion.div>
    );
};

export default CreatePasskey;
