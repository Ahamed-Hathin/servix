import { useAuth } from "../context/AuthContext";
import { useCity } from "../context/CityContext";
import HeroSection from "../components/HeroSection";
import ServiceCategoryGrid from "../components/ServiceCategoryGrid";
import TrustSection from "../components/TrustSection";
import PopularServices from "../components/PopularServices";
import OfferBanner from "../components/OfferBanner";
import Testimonials from "../components/Testimonials";
import SubscriptionPlans from "../components/SubscriptionPlans";
import DownloadApp from "../components/DownloadApp";
import {
    HiOutlineWrenchScrewdriver,
    HiOutlineCheckBadge,
    HiOutlineBolt,
    HiOutlineStar,
    HiOutlineArrowRight,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

const stats = [
    { value: "1000+", label: "Service Bookings", icon: HiOutlineWrenchScrewdriver },
    { value: "200+", label: "Verified Pros", icon: HiOutlineCheckBadge },
    { value: "9", label: "Cities in TN", icon: HiOutlineBolt },
    { value: "4.8★", label: "Avg Rating", icon: HiOutlineStar },
];

const howItWorks = [
    {
        step: "01",
        title: "Choose Service",
        desc: "Browse from our wide range of home services",
    },
    {
        step: "02",
        title: "Book Instantly",
        desc: "Select date, address, and confirm your booking",
    },
    {
        step: "03",
        title: "Worker Arrives",
        desc: "A verified professional reaches your doorstep",
    },
    {
        step: "04",
        title: "Pay & Rate",
        desc: "Pay securely after work completion, rate your experience",
    },
];

export default function Home() {
    const { user } = useAuth();
    const { city } = useCity();

    return (
        <div className="animate-fadeIn">
            {/* 1️⃣ Clean Hero Section */}
            <HeroSection />

            {/* Stats Bar */}
            <section className="relative z-10 -mt-8 sm:-mt-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                className="text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-5 px-3 shadow-lg shadow-gray-200/50 dark:shadow-black/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 mx-auto mb-2.5 bg-primary-50 dark:bg-primary-900/40 rounded-xl flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/60 transition-colors">
                                    <s.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                                    {s.value}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2️⃣ Service Category Grid */}
            <ServiceCategoryGrid />

            {/* 3️⃣ Trust Section */}
            <TrustSection />

            {/* 4️⃣ Popular Services */}
            <PopularServices />

            {/* 5️⃣ Offer Banner */}
            <OfferBanner />

            {/* How It Works */}
            <section className="py-16 sm:py-20 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                            How It Works
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                            Book a Service in 4 Easy Steps
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {howItWorks.map((item, i) => (
                            <div
                                key={i}
                                className="relative bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 text-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="text-5xl font-extrabold text-primary-100 dark:text-primary-900/60 absolute top-4 right-5 select-none">
                                    {item.step}
                                </div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg shadow-lg shadow-primary-500/20">
                                        {item.step}
                                    </div>
                                    <h3 className="font-bold text-gray-800 dark:text-white text-base">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6️⃣ Customer Reviews */}
            <Testimonials />

            {/* Subscription Plans */}
            <SubscriptionPlans />

            {/* Download App */}
            <DownloadApp />

            {/* Final CTA */}
            <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-indigo-900 py-16 sm:py-20 relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 translate-x-1/3" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Join Tamil Nadu&apos;s Fastest Growing
                        <br />
                        <span className="bg-gradient-to-r from-accent-300 to-emerald-300 bg-clip-text text-transparent">
                            Service Marketplace
                        </span>
                    </h2>
                    <p className="text-white/50 mt-4 max-w-lg mx-auto">
                        Whether you need an electrician, plumber, or home cleaning —
                        we connect you with trusted local professionals in minutes.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {!user && (
                            <>
                                <Link
                                    to="/register"
                                    className="bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 inline-flex items-center gap-2"
                                >
                                    Get Started — It&apos;s Free
                                    <HiOutlineArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/register"
                                    className="border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Register as Worker
                                </Link>
                            </>
                        )}
                        {user && (
                            <Link
                                to="/dashboard"
                                className="bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-all shadow-xl inline-flex items-center gap-2"
                            >
                                Go to Dashboard
                                <HiOutlineArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
