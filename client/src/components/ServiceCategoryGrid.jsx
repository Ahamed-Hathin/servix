import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useCity } from "../context/CityContext";
import { useAuth } from "../context/AuthContext";
import {
    HiOutlineBolt,
    HiOutlineWrenchScrewdriver,
    HiOutlinePaintBrush,
    HiOutlineArrowRight,
    HiOutlineHomeModern,
    HiOutlineCog6Tooth,
    HiOutlineBeaker,
    HiOutlineFire,
    HiOutlineSparkles,
} from "react-icons/hi2";

const serviceIcons = {
    Electrician: HiOutlineBolt,
    Plumber: HiOutlineWrenchScrewdriver,
    Painter: HiOutlinePaintBrush,
    "AC Repair": HiOutlineCog6Tooth,
    "Cleaning Service": HiOutlineSparkles,
    "Appliance Repair": HiOutlineFire,
    Carpenter: HiOutlineHomeModern,
    "Pest Control": HiOutlineBeaker,
};

const serviceColors = {
    Electrician: {
        bg: "bg-amber-50 dark:bg-amber-900/20",
        icon: "text-amber-600 dark:text-amber-400",
        hover: "group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30",
        border: "border-amber-100 dark:border-amber-800/30",
    },
    Plumber: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        icon: "text-blue-600 dark:text-blue-400",
        hover: "group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30",
        border: "border-blue-100 dark:border-blue-800/30",
    },
    Painter: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        icon: "text-purple-600 dark:text-purple-400",
        hover: "group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30",
        border: "border-purple-100 dark:border-purple-800/30",
    },
    "AC Repair": {
        bg: "bg-teal-50 dark:bg-teal-900/20",
        icon: "text-teal-600 dark:text-teal-400",
        hover: "group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30",
        border: "border-teal-100 dark:border-teal-800/30",
    },
    "Cleaning Service": {
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        icon: "text-emerald-600 dark:text-emerald-400",
        hover: "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30",
        border: "border-emerald-100 dark:border-emerald-800/30",
    },
    "Appliance Repair": {
        bg: "bg-rose-50 dark:bg-rose-900/20",
        icon: "text-rose-600 dark:text-rose-400",
        hover: "group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30",
        border: "border-rose-100 dark:border-rose-800/30",
    },
    Carpenter: {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        icon: "text-orange-600 dark:text-orange-400",
        hover: "group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30",
        border: "border-orange-100 dark:border-orange-800/30",
    },
    "Pest Control": {
        bg: "bg-lime-50 dark:bg-lime-900/20",
        icon: "text-lime-600 dark:text-lime-400",
        hover: "group-hover:bg-lime-100 dark:group-hover:bg-lime-900/30",
        border: "border-lime-100 dark:border-lime-800/30",
    },
};

const defaultColor = {
    bg: "bg-primary-50 dark:bg-primary-900/20",
    icon: "text-primary-600 dark:text-primary-400",
    hover: "group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30",
    border: "border-primary-100 dark:border-primary-800/30",
};

/* Skeleton card for loading state */
function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
            <div className="w-14 h-14 rounded-2xl skeleton mb-4" />
            <div className="h-5 skeleton w-3/4 mb-2" />
            <div className="h-3 skeleton w-full mb-1" />
            <div className="h-3 skeleton w-2/3 mb-4" />
            <div className="h-8 skeleton w-1/3 rounded-lg" />
        </div>
    );
}

export default function ServiceCategoryGrid() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { city } = useCity();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await API.get("/services");
                setServices(data.data);
            } catch {
                setServices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleClick = (service) => {
        if (user) {
            navigate(`/book/${service._id}`);
        } else {
            navigate("/login");
        }
    };

    return (
        <section
            id="services-grid"
            className="py-16 sm:py-20 bg-white dark:bg-gray-800 scroll-mt-20"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                        Our Services
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        {city
                            ? `Services Available in ${city}`
                            : "Browse Our Services"}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
                        Choose from a wide range of professional home services.
                        Every provider is verified and background-checked.
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[...Array(8)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                        <p className="text-lg">No services available right now</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {services.map((service, i) => {
                            const colors = serviceColors[service.name] || defaultColor;
                            const Icon = serviceIcons[service.name] || HiOutlineWrenchScrewdriver;

                            return (
                                <div
                                    key={service._id}
                                    onClick={() => handleClick(service)}
                                    className={`group bg-white dark:bg-gray-800 rounded-2xl border ${colors.border} p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-transparent relative overflow-hidden`}
                                    style={{
                                        animationDelay: `${i * 60}ms`,
                                        animationFillMode: "both",
                                    }}
                                >
                                    {/* Hover glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/50 group-hover:to-indigo-50/50 dark:group-hover:from-primary-950/30 dark:group-hover:to-indigo-950/30 transition-all duration-500 rounded-2xl" />

                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <div
                                            className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.hover} flex items-center justify-center mb-4 transition-colors duration-300`}
                                        >
                                            <Icon
                                                className={`w-7 h-7 ${colors.icon}`}
                                            />
                                        </div>

                                        {/* Name */}
                                        <h3 className="font-bold text-gray-800 dark:text-white text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {service.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                                            {service.description ||
                                                "Professional and reliable service at your doorstep"}
                                        </p>

                                        {/* Price + CTA */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                            <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">
                                                From ₹{service.basePrice}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1.5 rounded-lg group-hover:bg-primary-600 group-hover:text-white dark:group-hover:bg-primary-600 transition-all duration-300">
                                                Book
                                                <HiOutlineArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
