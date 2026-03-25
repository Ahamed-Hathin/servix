import { HiOutlineGift, HiOutlineSparkles, HiOutlineFire, HiOutlineStar } from "react-icons/hi2";

const offers = [
    {
        icon: HiOutlineGift,
        title: "20% Off First Booking",
        description: "New to SERVEFIX? Get flat 20% off on your first service booking.",
        bg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
        badge: "NEW USER",
    },
    {
        icon: HiOutlineFire,
        title: "Festive Week Specials",
        description: "Exclusive discounts on home cleaning and painting services this week.",
        bg: "bg-gradient-to-br from-orange-400 to-rose-500",
        badge: "LIMITED",
    },
    {
        icon: HiOutlineSparkles,
        title: "Book 3, Save 10%",
        description: "Bundle 3 or more services and get an additional 10% discount.",
        bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
        badge: "BUNDLE",
    },
    {
        icon: HiOutlineStar,
        title: "Top Rated Pros",
        description: "Book a 5-star rated professional and get priority scheduling.",
        bg: "bg-gradient-to-br from-amber-400 to-orange-500",
        badge: "POPULAR",
    },
];

export default function OffersSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Deals & Offers
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        Save more on your favourite services
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {offers.map((offer, i) => (
                    <div
                        key={i}
                        className={`${offer.bg} rounded-2xl p-5 text-white relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl`}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                        <div className="relative">
                            <span className="inline-block text-[10px] font-bold tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full mb-3">
                                {offer.badge}
                            </span>
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <offer.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg leading-snug">{offer.title}</h3>
                            <p className="text-white/70 text-sm mt-2 leading-relaxed">
                                {offer.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
