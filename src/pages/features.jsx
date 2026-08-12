import React from 'react'
import { Link } from 'react-router'

export default function Features() {
    const features = [
        { icon: "💬", title: "Real-Time Messaging", desc: "Instantly send and receive messages with WebSocket technology. No refresh needed — ever." },
        { icon: "👥", title: "Group & Private Chats", desc: "Create chat rooms and stay connected with your communities, friends, or work teams all in one place." },
        { icon: "🔒", title: "Instagram Message Requests", desc: "Incoming messages from new users enter a request drawer before reply." },
        { icon: "📸", title: "Rich Media & PDF Sharing", desc: "Send photos, videos, and documents with inline thumbnail previews and lightbox expansion." },
        { icon: "🎙️", title: "Voice Notes & Audio", desc: "Record voice messages directly with playable waveform visualizers." },
        { icon: "🌓", title: "Pure Dark Glassmorphism", desc: "Stunning dark-mode-first aesthetic crafted for maximum visual comfort." },
    ];

    return (
        <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    ✨ Built For Seamless Chat
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white">Why Choose ChatSphere?</h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                    Designed to keep your conversations smooth, secure, and responsive across device screens.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                    <div key={index} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition text-left space-y-3">
                        <div className="text-3xl p-3 bg-indigo-500/10 rounded-2xl w-fit">{feature.icon}</div>
                        <h3 className="text-base font-bold text-white">{feature.title}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border border-indigo-500/30 text-center space-y-4">
                <h3 className="text-2xl sm:text-3xl font-black text-white">Ready to Start Chatting?</h3>
                <p className="text-indigo-200 text-xs sm:text-sm max-w-xl mx-auto">
                    Join ChatSphere today and experience seamless, secure, and real-time messaging.
                </p>
                <Link to="/login" className="inline-block px-8 py-3 bg-white text-indigo-950 font-black rounded-2xl text-xs hover:bg-slate-100 transition shadow-xl">
                    Get Started Now
                </Link>
            </div>
        </div>
    );
}
