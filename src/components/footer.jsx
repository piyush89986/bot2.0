import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">ChatSphere</span>
                    <span className="text-xs text-slate-500">© {new Date().getFullYear()} All rights reserved.</span>
                </div>
                <div className="flex space-x-6 text-xs font-semibold">
                    <a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a>
                    <a href="#" className="hover:text-indigo-400 transition">Terms of Service</a>
                    <a href="#" className="hover:text-indigo-400 transition">Support</a>
                </div>
            </div>
        </footer>
    );
}
