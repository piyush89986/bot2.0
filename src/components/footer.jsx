import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 text-center sm:text-left">
                <p className="text-xs sm:text-sm">
                    © {new Date().getFullYear()} ChatSphere. All rights reserved.
                </p>
                <div className="flex space-x-4 sm:space-x-6 text-sm">
                    <a href="#" className="hover:text-white transition">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition">Terms</a>
                    <a href="#" className="hover:text-white transition">Support</a>
                </div>
            </div>
        </footer>
    );
}
