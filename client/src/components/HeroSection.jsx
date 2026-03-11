import { Link } from "react-router-dom";
import { useCity } from "../context/CityContext";
import { useAuth } from "../context/AuthContext";

const HERO_IMAGE = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80";
import {
    HiOutlineBolt,
    HiOutlineMapPin,
    HiOutlineArrowRight,
    HiOutlineCheckBadge,
    HiOutlineStar,
    HiOutlineUserGroup,
} from "react-icons/hi2";

const quickStats = [
    { icon: HiOutlineCheckBadge, label: "Verified Pros", value: "200+" },
    { icon: HiOutlineStar, label: "Avg Rating", value: "4.8★" },
    { icon: HiOutlineUserGroup, label: "Happy Customers", value: "5K+" },
];

export default function HeroSection() {
    const { city, setShowSelector } = useCity();
    const { user } = useAuth();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-950/30">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/40 dark:bg-primary-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-100/30 dark:bg-accent-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 animate-fadeIn">
                        {/* City Badge */}
                        {city ? (
                            <button
                                onClick={() => setShowSelector(true)}
                                className="inline-flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-semibold px-4 py-2 rounded-full border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-all cursor-pointer"
                            >
                                <HiOutlineMapPin className="w-4 h-4" />
                                {city}
                                <span className="text-primary-400 dark:text-primary-500 text-xs ml-1">
                                    Change
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowSelector(true)}
                                className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all cursor-pointer animate-pulse"
                            >
                                <HiOutlineMapPin className="w-4 h-4" />
                                Select your city
                            </button>
                        )}

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-tight text-gray-900 dark:text-white tracking-tight">
                            Professional{" "}
                            <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                                Home Services
                            </span>
                            <br />
                            in Tamil Nadu
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
                            Book trusted electricians, plumbers, painters, and more.
                            <br className="hidden sm:block" />
                            Fast, reliable, and verified local professionals.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:from-primary-700 hover:to-indigo-700 transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
                                    >
                                        <HiOutlineBolt className="w-5 h-5" />
                                        Book a Service
                                    </Link>
                                    <a
                                        href="#services-grid"
                                        className="inline-flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-7 py-3.5 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                                    >
                                        Explore Services
                                        <HiOutlineArrowRight className="w-4 h-4" />
                                    </a>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:from-primary-700 hover:to-indigo-700 transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
                                    >
                                        <HiOutlineBolt className="w-5 h-5" />
                                        Book a Service
                                    </Link>
                                    <a
                                        href="#services-grid"
                                        className="inline-flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-7 py-3.5 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                                    >
                                        Explore Services
                                        <HiOutlineArrowRight className="w-4 h-4" />
                                    </a>
                                </>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-6 pt-4">
                            {quickStats.map((stat, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                                        <stat.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Professional Photo */}
                    <div className="relative flex justify-center lg:justify-end hero-illustration-wrap">
                        <div className="relative w-full max-w-lg">
                            {/* Glow behind image */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-primary-400/20 to-accent-400/20 dark:from-primary-600/10 dark:to-accent-600/10 rounded-3xl blur-3xl pointer-events-none" />

                            {/* Main photo */}
                            <img
                                src={HERO_IMAGE}
                                alt="Professional electrician providing home services"
                                className="relative w-full h-[340px] sm:h-[400px] lg:h-[440px] object-cover rounded-2xl shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50"
                            />

                            {/* Floating badge — bottom-left */}
                            <div className="absolute -bottom-4 -left-4 sm:bottom-4 sm:left-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 border border-gray-100 dark:border-gray-700">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
                                    <span className="text-emerald-600 dark:text-emerald-400 text-lg">✓</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">Verified Pro</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Background checked</p>
                                </div>
                            </div>

                            {/* Floating badge — top-right */}
                            <div className="absolute -top-3 -right-3 sm:top-4 sm:right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl px-3 py-2 flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                                <span className="text-amber-400 text-sm">⭐</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white">4.8</span>
                                <span className="text-xs text-gray-400">(2.4k)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
