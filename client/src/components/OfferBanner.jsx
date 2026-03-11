import { HiOutlineGift, HiOutlineArrowRight, HiOutlineSparkles } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OfferBanner() {
    const { user } = useAuth();

    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl" />

                    {/* Confetti accents */}
                    <div className="absolute top-4 left-8 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <div className="absolute top-12 right-16 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute bottom-8 left-1/3 w-2 h-2 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />

                    <div className="relative z-10 py-12 sm:py-16 px-8 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Content */}
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full mb-5">
                                <HiOutlineGift className="w-4 h-4" />
                                Limited Time Offer
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                                🎉 Get{" "}
                                <span className="text-amber-300">10% OFF</span>
                                <br />
                                on Your First Booking
                            </h2>
                            <p className="text-white/60 mt-4 text-base sm:text-lg max-w-md">
                                Use code{" "}
                                <span className="inline-block bg-white/20 backdrop-blur-sm text-white font-mono font-bold px-3 py-1 rounded-lg text-lg tracking-wider">
                                    FIRST10
                                </span>{" "}
                                at checkout
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col items-center gap-3 shrink-0">
                            <Link
                                to={user ? "/dashboard" : "/register"}
                                className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-2xl shadow-black/20 hover:-translate-y-0.5 text-base sm:text-lg group"
                            >
                                <HiOutlineSparkles className="w-5 h-5" />
                                Claim Offer Now
                                <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <p className="text-white/40 text-xs">
                                *Valid for new users only. T&C apply.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
