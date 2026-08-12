import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import apiRequestHandler from "../../webservices/getway";
import endpointUrls from "../../webservices/endpointUrls";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi";

export default function Login({ setShowLoginUi }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, reset, handleSubmit, formState: { errors } } = useForm();

    const handleLogin = useCallback(async (data) => {
        setLoading(true);
        try {
            let response = await apiRequestHandler("POST", endpointUrls.LOGIN_USER, data);
            if (response.success) {
                toast.success(response.message || "Logged in successfully!");
                if (response.data?.token) {
                    window.localStorage.setItem("token", response.data.token);
                }
                reset();
                navigate("/c");
            } else {
                toast.error(response.message || "Login failed");
            }
        } catch (err) {
            toast.error(err.message || "An error occurred during login");
        } finally {
            setLoading(false);
        }
    }, [navigate, reset]);

    return (
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-white/95 backdrop-blur-md flex flex-col justify-center">
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
                <p className="text-sm text-gray-500 mt-1">Log in to access your messages and chats</p>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                {/* Username / Email / Phone */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Email, Phone, or Username</label>
                    <div className="relative">
                        <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition text-sm text-gray-800"
                            placeholder="Enter your credential"
                            {...register("login_user", { required: "Email, phone or username is required" })}
                        />
                    </div>
                    {errors.login_user && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.login_user.message}</p>}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition text-sm text-gray-800"
                            placeholder="Enter your password"
                            {...register("password", { required: "Password is required" })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>}
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 ${
                        loading ? "bg-indigo-400 cursor-wait" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99]"
                    }`}
                >
                    {loading ? "Logging in..." : "Log In"}
                </button>
            </form>

            <p className="text-xs text-center text-gray-500 mt-6">
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={() => setShowLoginUi(false)}
                    className="text-indigo-600 font-bold hover:underline"
                >
                    Create one
                </button>
            </p>
        </div>
    );
}

