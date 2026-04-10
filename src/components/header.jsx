import { useState } from 'react'
import { Link, NavLink } from 'react-router'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-indigo-600">ChatSphere</h1>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-2">
                    {['/', '/features', '/about', '/contact'].map((path, i) => {
                        const labels = ['Home', 'Features', 'About', 'Contact'];
                        return (
                            <NavLink
                                key={path}
                                to={path}
                                className={({ isActive }) =>
                                    `${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:text-indigo-600'} px-4 py-2 rounded-lg font-medium transition`
                                }
                            >
                                {labels[i]}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
                    >
                        Login
                    </Link>
                    {/* Hamburger */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
                    {[['/', 'Home'], ['/features', 'Features'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-50'} px-4 py-2 rounded-lg font-medium transition`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>
            )}
        </header>
    );
}
