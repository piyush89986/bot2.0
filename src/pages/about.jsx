import React from 'react'
import { Link } from 'react-router'

export default function About() {
    return (
        <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    💬 About ChatSphere
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white">Redefining Real-Time Connection</h2>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    We believe communication should be simple, secure, and instant. ChatSphere was built to bring people closer with modern WebSockets, rich media, and intuitive Instagram-style request management.
                </p>
            </div>

            {/* CTA */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border border-indigo-500/30 text-center space-y-4">
                <h3 className="text-2xl sm:text-3xl font-black text-white">Join Our Community</h3>
                <p className="text-indigo-200 text-xs sm:text-sm max-w-xl mx-auto">
                    Experience seamless messaging with ChatSphere today.
                </p>
                <Link to="/login" className="inline-block px-8 py-3 bg-white text-indigo-950 font-black rounded-2xl text-xs hover:bg-slate-100 transition shadow-xl">
                    Get Started
                </Link>
            </div>
        </div>
    );
}
