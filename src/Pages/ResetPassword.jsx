import { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomButton from "../Util/Button";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiMail } from "react-icons/fi";
import { toast } from "react-toastify";

const OTP_LENGTH = 6;

const ResetPassword = () => {
    const { BackendURL } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [otpStr, setOtpStr] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [isPasswordStep, setIsPasswordStep] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [password, setPassword] = useState("");
    const inputRefs = useRef([]);

    useEffect(() => {
        if (isOtpStep && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [isOtpStep]);

    const handleOtpChange = (e, idx) => {
        const val = e.target.value;
        if (/^[0-9]?$/.test(val)) {
            const newOtp = [...otp];
            newOtp[idx] = val;
            setOtp(newOtp);
            if (val !== "" && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH).split("");
        const validPasted = pasted.filter((d) => /^[0-9]$/.test(d));
        const filledOtp = Array(OTP_LENGTH).fill("");
        validPasted.forEach((digit, i) => (filledOtp[i] = digit));
        setOtp(filledOtp);
        const nextIndex = validPasted.length === OTP_LENGTH ? OTP_LENGTH - 1 : validPasted.length;
        if (inputRefs.current[nextIndex]) inputRefs.current[nextIndex].focus();
    };

    const handleOtpKeyDown = (e, idx) => {
        if (e.key === "Backspace" && otp[idx] === "" && idx > 0) inputRefs.current[idx - 1].focus();
    };

    axios.defaults.withCredentials = true;

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.warn("Please enter your email.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${BackendURL}/auth/send-reset-otp?email=${email}`);
            if (res.status === 200) {
                setIsEmailSent(true);
                setIsOtpStep(true);
                toast.success("OTP sent to your email!");
            } else {
                toast.error(res.data?.message || "Failed to send OTP");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        const str = otp.join("");
        if (str.length !== OTP_LENGTH || otp.some((d) => d === "")) {
            toast.error("Please fill all 6 digits of OTP.");
            return;
        }
        setOtpStr(str);
        setIsOtpStep(false);
        setIsPasswordStep(true);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            toast.warn("Please provide a strong new password (at least 6 chars).");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${BackendURL}/reset-password`, {
                email,
                otp: otpStr,
                newPassword: password,
            });
            if (res.status === 200) {
                setIsSuccess(true);
                toast.success("Password reset successfully! Redirecting...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error("Verification failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 bg-transparent min-h-0">
            <div className="w-full max-w-lg bg-gray-900/80 shadow-2xl rounded-xl px-6 py-16 flex flex-col gap-8 border border-gray-700 backdrop-blur-md">
                {/* Heading */}
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 text-center tracking-tight mb-4 flex items-center gap-3 justify-center">
                    <RiLockPasswordLine size={32} /> Reset Password
                </h2>

                {!isEmailSent && (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-gray-400 mb-1 font-medium">
                                Registered Email Address
                            </label>
                            <div className="flex items-center border border-gray-700 rounded-lg px-3 bg-gray-800">
                                <MdOutlineEmail className="text-gray-500" size={22} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border-none outline-none bg-transparent focus:ring-0 text-white"
                                    placeholder="Email"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <CustomButton
                            text={loading ? (
                                "Sending..."
                            ) : (
                                <span className="flex items-center gap-2">
                                    <FiMail size={20} />
                                    Send OTP
                                </span>
                            )}
                            type="submit"
                            disabled={loading}
                        />
                    </form>
                )}

                {isOtpStep && (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <p className="text-gray-400 text-center mb-2">
                            Enter the 6 digit code sent to <span className="font-semibold">{email}</span>
                        </p>

                        <div className="flex justify-between gap-1 sm:gap-2 mb-3">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => (inputRefs.current[idx] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, idx)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                    onPaste={handleOtpPaste}
                                    disabled={loading}
                                    className="w-10 sm:w-12 h-10 sm:h-12 text-center border-2 border-gray-600 focus:border-emerald-400 rounded-lg text-xl focus:outline-none bg-gray-800 text-white transition"
                                />
                            ))}
                        </div>
                        <CustomButton text="Continue" type="submit" disabled={loading} />
                    </form>
                )}

                {isPasswordStep && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-1 font-medium">New Password</label>
                            <div className="flex items-center border border-gray-700 rounded-lg px-3 bg-gray-800">
                                <RiLockPasswordLine className="text-gray-400" size={21} />
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border-none outline-none bg-transparent focus:ring-0 text-white"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>
                        <CustomButton
                            text={loading ? "Resetting..." : "Reset Password"}
                            type="submit"
                            disabled={loading}
                        />
                    </form>
                )}

                {isSuccess && (
                    <div className="flex flex-col items-center gap-4 pt-8 pb-4">
                        <span className="text-emerald-400 text-4xl">
                            <FiMail />
                        </span>
                        <p className="text-lg font-medium text-gray-300 text-center">
                            Password reset successful.
                            <br />
                            You will be redirected to login...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
