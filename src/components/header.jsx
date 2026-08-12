import { useState } from 'react'
import { Link, NavLink } from 'react-router'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/25">
                        💬
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-white">ChatSphere</h1>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50">
                    {['/', '/features', '/about', '/contact'].map((path, i) => {
                        const labels = ['Home', 'Features', 'About', 'Contact'];
                        return (
                            <NavLink
                                key={path}
                                to={path}
                                className={({ isActive }) =>
                                    `${isActive 
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20' 
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                                    } px-4 py-2 rounded-xl text-xs font-semibold transition`
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
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition text-xs shadow-lg shadow-indigo-500/20"
                    >
                        Sign In / Register
                    </Link>
                    {/* Hamburger */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl bg-slate-800 text-slate-300"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block h-0.5 w-5 bg-slate-300 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block h-0.5 w-5 bg-slate-300 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block h-0.5 w-5 bg-slate-300 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-col gap-1">
                    {[['/', 'Home'], ['/features', 'Features'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'} px-4 py-2.5 rounded-xl text-xs font-semibold transition`
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
