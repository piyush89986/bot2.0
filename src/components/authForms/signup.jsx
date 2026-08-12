import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import apiRequestHandler from '../../webservices/getway';
import endpointUrls from '../../webservices/endpointUrls';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';

export default function Signup({ setShowLoginUi }) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, reset, handleSubmit, formState: { errors } } = useForm();

    const handleSignup = useCallback(async (data) => {
        setLoading(true);
        try {
            let response = await apiRequestHandler("POST", endpointUrls.SIGNUP_USER, data);
            if (response.success) {
                toast.success(response.message || "Account created successfully! Please log in.");
                reset();
                setShowLoginUi(true);
            } else {
                toast.error(response.message || "Registration failed");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong during signup");
        } finally {
            setLoading(false);
        }
    }, [reset, setShowLoginUi]);

    return (
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-white/95 backdrop-blur-md flex flex-col justify-center">
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                <p className="text-sm text-gray-500 mt-1">Join ChatSphere and connect with your world</p>
            </div>

            <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                        <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition text-sm text-gray-800"
                            placeholder="e.g. Rahul Sharma"
                            {...register("user_name", {
                                required: "Full name is required",
                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                                maxLength: { value: 50, message: "Name must not exceed 50 characters" },
                                pattern: {
                                    value: /^[A-Za-z\s.'-]+$/,
                                    message: "Full name can only contain letters and spaces"
                                }
                            })}
                        />
                    </div>
                    {errors.user_name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.user_name.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="email"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition text-sm text-gray-800"
                            placeholder="you@domain.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email address"
                                }
                            })}
                        />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                        <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition text-sm text-gray-800"
                            placeholder="Mobile number"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/,
                                    message: "Please enter a valid phone number"
                                }
                            })}
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone.message}</p>}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition text-sm text-gray-800"
                            placeholder="At least 6 characters"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            })}
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
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>
            </form>

            <p className="text-xs text-center text-gray-500 mt-6">
                Already registered?{" "}
                <button
                    type="button"
                    onClick={() => setShowLoginUi(true)}
                    className="text-indigo-600 font-bold hover:underline"
                >
                    Log In
                </button>
            </p>
        </div>
    );
}

