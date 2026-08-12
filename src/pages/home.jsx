import React from 'react'
import { Link } from 'react-router'
import { FiMessageSquare, FiUsers, FiShield, FiSmile, FiImage, FiGlobe, FiArrowRight } from 'react-icons/fi'

export default function Home() {
    return (
        <div className="space-y-16 py-8">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                {/* Background Glow Spheres */}
                <div className="absolute -top-12 -left-12 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-2xl text-center md:text-left space-y-6 relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                        ✨ Next-Gen Realtime Chat Platform
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                        Connect, Chat & Share with <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            ChatSphere
                        </span>
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                        Real-time conversations, rich media previews, voice notes, and Instagram-style message requests — built for seamless communication.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center md:justify-start">
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition flex items-center justify-center gap-2 text-xs"
                        >
                            Start Chatting Now <FiArrowRight className="text-base" />
                        </Link>
                        <a
                            href="#features"
                            className="w-full sm:w-auto px-6 py-3.5 border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold rounded-2xl transition text-xs text-center"
                        >
                            Explore Features
                        </a>
                    </div>
                </div>

                {/* Hero Feature Graphic Card */}
                <div className="w-full md:w-auto flex justify-center relative z-10">
                    <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl max-w-md w-full">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs text-slate-400 ml-2 font-mono">ChatSphere Interface</span>
                        </div>
                        <div className="pt-4 space-y-3">
                            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 max-w-[80%]">
                                <p className="text-xs font-bold text-indigo-400">Ayush</p>
                                <p className="text-xs text-slate-200 mt-0.5">Hey! Check out this new design on ChatSphere 🚀</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white max-w-[85%] ml-auto">
                                <p className="text-xs">Awesome! The dark glassmorphism theme looks super sleek! 🔥</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-white">Powerful Features</h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                        Everything you need for personal DMs, group conversations, and secure file sharing.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "Real-Time WebSockets", desc: "Instant message delivery, typing indicators, and online presence status.", icon: <FiMessageSquare /> },
                        { title: "Group & Private Chats", desc: "Create multi-member groups or start 1-on-1 private messaging.", icon: <FiUsers /> },
                        { title: "Instagram Message Requests", desc: "Incoming messages from new users enter a request drawer before reply.", icon: <FiShield /> },
                        { title: "Rich Media & PDFs", desc: "Inline image preview, document cards, and lightboxes for all files.", icon: <FiImage /> },
                        { title: "Voice Notes & Audio", desc: "Record and play voice notes directly with interactive waveform visualizers.", icon: <FiSmile /> },
                        { title: "Pure Dark Glassmorphism", desc: "Stunning dark-mode-first aesthetic crafted for maximum visual comfort.", icon: <FiGlobe /> },
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/90 transition duration-300 group shadow-lg">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition">
                                {feature.icon}
                            </div>
                            <h4 className="text-base font-bold text-white mb-1.5">{feature.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
