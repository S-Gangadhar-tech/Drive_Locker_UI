import { useContext, useRef, useState, useEffect } from "react";
import CustomButton from "../Util/Button";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OTP_LENGTH = 6;

const EmailVerify = () => {
    const { BackendURL, getUserdata, userData, isLoggedin } = useContext(AppContext);
    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
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
                inputRefs.current[index + 1].focus();
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
            inputRefs.current[index - 1].focus();
        }
    };


    const verifyEmailOtp = async () => {
        const otpString = otp.join("");
        if (otp.length !== OTP_LENGTH || otp.some(digit => digit === "")) {
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
                // console.log(userData);

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
        isLoggedin === true && userData.isAccountVerified && navigate("/")
    }, [isLoggedin, userData])
    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow-lg bg-white">
            <h4 className="text-xl font-semibold mb-2">Email Verification</h4>
            <p className="mb-4 text-gray-700">Enter the 6 digit code sent to your email</p>

            <div className="flex space-x-2 mb-4">
                {otp.map((digit, index) => (
                    <input
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
                        className="w-12 h-12 text-center border rounded text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                ))}
            </div>

            <CustomButton text={loading ? "Verifying..." : "Verify OTP"} handleOnclick={verifyEmailOtp} disabled={loading} />
        </div>
    );
};

export default EmailVerify;


