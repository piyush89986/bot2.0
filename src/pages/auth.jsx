import { lazy, Suspense, useState } from "react";
import { Navigate } from "react-router";
import Loader from "../components/loaders/loader";
import { FiMessageSquare } from "react-icons/fi";

const Login = lazy(() => import("../components/authForms/login"));
const SignUp = lazy(() => import("../components/authForms/signup"));

const Auth = () => {
    const [showLoginUi, setShowLoginUi] = useState(true);

    if (window.localStorage.getItem("token")) {
        return <Navigate to="/c" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-slate-950 p-4 sm:p-6 relative overflow-hidden">
            {/* Background glowing blur spheres */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative z-10 transition-all duration-300">
                {/* Brand Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
                            <FiMessageSquare className="text-xl" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight leading-none">ChatSphere</h1>
                            <span className="text-[10px] text-white/80 font-medium">Real-time Conversations</span>
                        </div>
                    </div>

                    <div className="flex bg-white/20 p-1 rounded-xl backdrop-blur-md">
                        <button
                            type="button"
                            onClick={() => setShowLoginUi(true)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                showLoginUi ? "bg-white text-indigo-900 shadow" : "text-white/80 hover:text-white"
                            }`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowLoginUi(false)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                !showLoginUi ? "bg-white text-indigo-900 shadow" : "text-white/80 hover:text-white"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Content View */}
                <Suspense fallback={<div className="p-12 flex justify-center"><Loader /></div>}>
                    <div className="overflow-hidden">
                        <div
                            className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
                                showLoginUi ? "translate-x-0" : "-translate-x-1/2"
                            }`}
                        >
                            <Login setShowLoginUi={setShowLoginUi} />
                            <SignUp setShowLoginUi={setShowLoginUi} />
                        </div>
                    </div>
                </Suspense>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-100 text-center text-[11px] text-gray-400">
                    Encrypted end-to-end. By continuing, you agree to ChatSphere's <span className="text-indigo-600 underline cursor-pointer">Terms</span> & <span className="text-indigo-600 underline cursor-pointer">Privacy Policy</span>.
                </div>
            </div>
        </div>
    );
};

export default Auth;

