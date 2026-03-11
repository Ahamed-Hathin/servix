import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCity } from "../context/CityContext";
import { useTheme } from "../context/ThemeContext";
import {
    HiOutlineBolt,
    HiOutlineChevronDown,
    HiOutlineMapPin,
    HiOutlineSun,
    HiOutlineMoon,
    HiOutlineBars3,
    HiOutlineXMark,
} from "react-icons/hi2";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { city, setShowSelector } = useCity();
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setMobileOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return "/login";
        const map = { user: "/dashboard", worker: "/worker", admin: "/admin" };
        return map[user.role] || "/";
    };

    return (
        <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-100/80 dark:border-gray-800/80 sticky top-0 z-40 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link to="/" className="flex items-center gap-2 group shrink-0">
                            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-700 transition-colors">
                                <HiOutlineBolt className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:inline">
                                Ser<span className="text-primary-600 dark:text-primary-400">vix</span>
                            </span>
                        </Link>

                        <button
                            onClick={() => setShowSelector(true)}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600"
                        >
                            <HiOutlineMapPin className="w-4 h-4 text-primary-500" />
                            <span className="max-w-[100px] truncate">
                                {city || "Select City"}
                            </span>
                            <HiOutlineChevronDown className="w-3 h-3 text-gray-400" />
                        </button>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer group"
                            aria-label="Toggle theme"
                        >
                            {dark ? (
                                <HiOutlineSun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                            ) : (
                                <HiOutlineMoon className="w-5 h-5 text-gray-600 group-hover:-rotate-12 transition-transform duration-300" />
                            )}
                        </button>

                        {user ? (
                            <>
                                <Link
                                    to={getDashboardLink()}
                                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-1.5">
                                    <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                                        <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-none">
                                            {user.name}
                                        </p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">
                                            {user.role}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary text-sm !px-4 !py-2"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile: theme + hamburger */}
                    <div className="flex sm:hidden items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 transition-all cursor-pointer"
                            aria-label="Toggle theme"
                        >
                            {dark ? (
                                <HiOutlineSun className="w-5 h-5 text-amber-400" />
                            ) : (
                                <HiOutlineMoon className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 transition-all cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? (
                                <HiOutlineXMark className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            ) : (
                                <HiOutlineBars3 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 animate-slideUp">
                    <div className="px-4 py-4 space-y-2">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-2">
                                    <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                                        <span className="text-primary-600 dark:text-primary-400 text-sm font-bold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                                        <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <Link
                                    to={getDashboardLink()}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left text-sm font-medium text-red-600 dark:text-red-400 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-center btn-primary text-sm"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
