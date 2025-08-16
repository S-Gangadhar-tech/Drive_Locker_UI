import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Login = () => {
    const [isCreateAccount, setCreateAccount] = useState(false);
    const [formData, setFormData] = useState({});
    const { BackendURL, setIsLoggedin, getUserdata } = useContext(AppContext);

    const navigate = useNavigate();

    const handleForm = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);
        try {
            if (isCreateAccount) {
                // Register API
                const res = await axios.post(`${BackendURL}/user/register`, formData);
                if (res.status === 201) {
                    setCreateAccount(false);
                    toast.success("Account created successfully");
                } else {
                    toast.error(res.message);
                }
            } else {
                // Login API
                const res = await axios.post(`${BackendURL}/auth/login`, formData);
                if (res.status === 200) {
                    setIsLoggedin(true);
                    toast.success("Login success");
                    await getUserdata();
                    navigate("/");
                } else {
                    toast.error("Unable to login");
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 bg-transparent min-h-0">
            <div className="w-full max-w-lg bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-700 p-8 sm:p-12 backdrop-blur-md text-gray-200">
                <h1 className="text-3xl font-bold text-center text-emerald-400 mb-8">
                    {isCreateAccount ? "Create Account" : "Login"}
                </h1>

                {loading && <p className="text-center text-cyan-400 mb-4">Loading...</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isCreateAccount && (
                        <>
                            <label htmlFor="name" className="block text-gray-300">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="w-full p-3 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-800 text-white"
                                onChange={handleForm}
                                required
                            />
                        </>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full p-3 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-800 text-white"
                            onChange={handleForm}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full p-3 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-800 text-white"
                            onChange={handleForm}
                            required
                        />
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <input
                            type="submit"
                            value={isCreateAccount ? "Create Account" : "Login"}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        />

                        <Link to="/reset-password" className="text-cyan-400 text-sm hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        {isCreateAccount ? "Already have an account?" : "Don't have an account?"}
                    </p>
                    <button
                        onClick={() => setCreateAccount((prev) => !prev)}
                        className="mt-2 text-emerald-400 hover:underline text-sm font-medium"
                    >
                        {isCreateAccount ? "Click here to login" : "Create one"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
