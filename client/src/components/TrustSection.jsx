import {
    HiOutlineShieldCheck,
    HiOutlineCurrencyRupee,
    HiOutlineBolt,
    HiOutlineLockClosed,
} from "react-icons/hi2";

const trustItems = [
    {
        icon: HiOutlineShieldCheck,
        title: "Verified Workers",
        desc: "Every professional is background-verified and admin-approved before joining our platform.",
        gradient: "from-emerald-500 to-teal-600",
        bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
        icon: HiOutlineCurrencyRupee,
        title: "Transparent Pricing",
        desc: "No hidden charges. See exact pricing upfront before you book. Pay only for what you get.",
        gradient: "from-amber-500 to-orange-600",
        bgLight: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
        icon: HiOutlineBolt,
        title: "Fast Booking",
        desc: "Book in under 60 seconds. Get matched with available professionals instantly.",
        gradient: "from-blue-500 to-indigo-600",
        bgLight: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
        icon: HiOutlineLockClosed,
        title: "Secure Payments",
        desc: "Multiple payment options with end-to-end encrypted transactions for your safety.",
        gradient: "from-purple-500 to-violet-600",
        bgLight: "bg-purple-50 dark:bg-purple-900/20",
    },
];

export default function TrustSection() {
    return (
        <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                        Why Us
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        Why Choose Servix?
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
                        The simplest way to get things done at home — trusted by
                        thousands across Tamil Nadu
                    </p>
                </div>

                {/* Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trustItems.map((item, i) => (
                        <div
                            key={i}
                            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-7 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 relative overflow-hidden"
                        >
                            {/* Hover border glow */}
                            <div
                                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${item.gradient} p-[1px]`}
                            >
                                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl" />
                            </div>

                            <div className="relative z-10">
                                {/* Icon */}
                                <div
                                    className={`w-16 h-16 rounded-2xl ${item.bgLight} flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                                    >
                                        <item.icon className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
