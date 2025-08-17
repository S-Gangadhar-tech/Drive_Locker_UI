import { useContext, useRef, useState, useEffect } from "react";
import CustomButton from "../Util/Button";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";

const OTP_LENGTH = 6;

const EmailVerify = () => {
    const { BackendURL, getUserdata, userData, isLoggedin } = useContext(AppContext);
    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        // Correct focus call on first input element inside array
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (/^[0-9]?$/.test(val)) {
            const newOtp = [...otp];
            newOtp[index] = val;
            setOtp(newOtp);
            if (val !== "" && index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").slice(0, OTP_LENGTH).split("");
        const newOtp = [...otp];
        paste.forEach((digit, i) => {
            if (/^[0-9]$/.test(digit) && i < OTP_LENGTH) {
                newOtp[i] = digit;
            }
        });
        setOtp(newOtp);
        const nextIndex = paste.length < OTP_LENGTH ? paste.length : OTP_LENGTH - 1;
        if (inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyEmailOtp = async () => {
        const otpString = otp.join("");
        if (otp.length !== OTP_LENGTH || otp.some((digit) => digit === "")) {
            toast.error("Please enter complete 6 digit OTP");
            return;
        }

        try {
            setIsLoading(true);
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BackendURL}/auth/verify-email`, { otp: otpString });
            if (res.status === 200) {
                toast.success("Email verified successfully");
                console.log("otp time " + new Date());
                await getUserdata();
                navigate("/");
            } else {
                toast.error("Verification failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedin === true && userData.isAccountVerified) {
            navigate("/");
        }
    }, [isLoggedin, userData, navigate]);

    return (
        <motion.div
            className="bg-gray-900/80 shadow-2xl rounded-2xl p-8 w-full max-w-md mx-auto border border-gray-700 backdrop-blur-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Title */}
            <div className="flex items-center justify-center mb-6 space-x-2">
                <MdEmail className="text-cyan-400 text-3xl" />
                <h1 className="text-3xl font-bold text-white">Verify Email</h1>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-6 text-center">
                Enter the <span className="font-semibold">6 digit code</span> sent to your email address.
            </p>

            {/* OTP Input Section */}
            <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                    <motion.input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        disabled={loading}
                        className="w-12 h-12 bg-gray-800 text-white text-center border border-gray-600 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        whileFocus={{ scale: 1.1 }}
                    />
                ))}
            </div>

            {/* Verify Button */}
            <CustomButton
                text={loading ? "Verifying..." : "Verify OTP"}
                handleOnclick={verifyEmailOtp}
                disabled={loading}
            />

            {/* Dynamic status messages (optional animated feedback) */}
            {loading && (
                <motion.p
                    className="mt-4 flex items-center justify-center text-cyan-400 text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    ⏳ Verifying OTP...
                </motion.p>
            )}
        </motion.div>
    );
};

export default EmailVerify;
