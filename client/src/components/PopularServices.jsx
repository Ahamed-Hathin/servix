import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useCity } from "../context/CityContext";
import { useAuth } from "../context/AuthContext";
import { HiOutlineArrowRight, HiOutlineFire } from "react-icons/hi2";

const serviceImages = {
    Electrician:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
    Plumber:
        "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
    Carpenter:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop",
    Painter:
        "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=300&fit=crop",
    "AC Repair":
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
    "Cleaning Service":
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    "Pest Control":
        "https://images.unsplash.com/photo-1611690926006-9b023f0e0244?w=400&h=300&fit=crop",
    "Appliance Repair":
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop",
};

const fallbackImage =
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop";

export default function PopularServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { city } = useCity();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await API.get("/services");
                // Show first 4 as "popular"
                setServices(data.data.slice(0, 4));
            } catch {
                setServices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleBook = (service) => {
        if (user) {
            navigate(`/book/${service._id}`);
        } else {
            navigate("/login");
        }
    };

    if (loading || services.length === 0) return null;

    return (
        <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                        <HiOutlineFire className="w-3.5 h-3.5" />
                        Trending Now
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        Popular Services{" "}
                        {city ? (
                            <span className="text-primary-600 dark:text-primary-400">
                                in {city}
                            </span>
                        ) : null}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
                        Most booked services by customers in your area
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service) => {
                        const imgSrc = serviceImages[service.name] || fallbackImage;
                        return (
                            <div
                                key={service._id}
                                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
                            >
                                {/* Image */}
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={imgSrc}
                                        alt={service.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = fallbackImage;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    {/* Popular badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                                            <HiOutlineFire className="w-3 h-3" />
                                            POPULAR
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                                        {service.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                        {service.description || "Expert professionals"}
                                    </p>

                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                Starting from
                                            </span>
                                            <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                                                ₹{service.basePrice}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleBook(service)}
                                            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:from-primary-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                                        >
                                            Book Now
                                            <HiOutlineArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
