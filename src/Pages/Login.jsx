import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext"
const Login = () => {
    const [isCreateAccount, setCreateAccount] = useState(false);
    const [formData, setFormData] = useState({});
    const { BackendURL, setIsLoggedin, getUserdata } = useContext(AppContext)

    const navigate = useNavigate();

    const handleForm = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true)
        try {
            setLoading(true)
            if (isCreateAccount) {

                // register api
                const res = await axios.post(`${BackendURL}/user/register`, formData);
                if (res.status === 201) {
                    navigate("/")
                    toast.success("Account created succes")
                } else {
                    toast.error(res.message)
                }
                // setUser(res.data);
            } else {
                //login api
                const res = await axios.post(`${BackendURL}/auth/login`, formData)
                // console.log(res);

                if (res.status === 200) {
                    setIsLoggedin(true)
                    toast.success("login success")
                    await getUserdata();
                    navigate("/")
                } else {
                    toast.error("unable to login")
                }
            }
        } catch (error) {
            setLoading(false)
            toast.error(error.response?.data.message)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-emerald-200 p-8 sm:p-12">
                <h1 className="text-3xl font-bold text-center text-emerald-700 mb-8">
                    {isCreateAccount ? "Create Account" : "Login"}
                </h1>

                {loading && <>loading</>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isCreateAccount && (
                        <>
                            <label htmlFor="name" className="block text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                onChange={handleForm}
                                required
                            />
                        </>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            onChange={handleForm}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            onChange={handleForm}
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <input
                            type="submit"
                            value={isCreateAccount ? "Create Account" : "Login"}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded cursor-pointer"
                        />

                        <Link
                            to="/reset-password"
                            className="text-blue-500 text-sm hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        {isCreateAccount ? "Already have an account?" : "Don't have an account?"}
                    </p>
                    <button
                        onClick={() => setCreateAccount((prev) => !prev)}
                        className="mt-2 text-emerald-600 hover:underline text-sm font-medium"
                    >
                        {isCreateAccount ? "Click here" : "Create one"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
