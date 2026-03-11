import { useNavigate } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi2";

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

export default function ServiceCard({ service }) {
    const navigate = useNavigate();
    const imgSrc = serviceImages[service.name] || fallbackImage;

    return (
        <div
            onClick={() => navigate(`/book/${service._id}`)}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
            <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                    src={imgSrc}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        From ₹{service.basePrice}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary-600 transition-colors">
                    {service.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-primary-600 font-bold text-lg">
                        ₹{service.basePrice}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                        Book Now
                        <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                </div>
            </div>
        </div>
    );
}
