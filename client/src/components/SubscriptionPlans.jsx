import { useState } from "react";
import {
    HiOutlineCheckCircle,
    HiOutlineBolt,
    HiOutlineSparkles,
    HiOutlineStar,
} from "react-icons/hi2";
import toast from "react-hot-toast";

const plans = [
    {
        name: "Basic",
        price: "499",
        period: "/month",
        description: "Essential home maintenance for small households",
        icon: HiOutlineBolt,
        color: "from-blue-500 to-blue-600",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        ring: "ring-blue-200 dark:ring-blue-800",
        features: [
            "2 Electrician visits/month",
            "1 Plumbing visit/month",
            "Priority customer support",
            "10% off on additional visits",
            "48-hour booking window",
        ],
        popular: false,
    },
    {
        name: "Premium",
        price: "999",
        period: "/month",
        description: "Complete home care for growing families",
        icon: HiOutlineSparkles,
        color: "from-primary-500 to-primary-700",
        bg: "bg-primary-50 dark:bg-primary-950/40",
        ring: "ring-primary-200 dark:ring-primary-800",
        features: [
            "4 Service visits/month (any type)",
            "1 Free emergency booking",
            "20% off on visit charges",
            "Priority worker assignment",
            "24-hour booking window",
            "Dedicated support line",
        ],
        popular: true,
    },
    {
        name: "Elite",
        price: "1,999",
        period: "/month",
        description: "Unlimited premium care for large households",
        icon: HiOutlineStar,
        color: "from-amber-500 to-orange-600",
        bg: "bg-amber-50 dark:bg-amber-950/40",
        ring: "ring-amber-200 dark:ring-amber-800",
        features: [
            "Unlimited visits (fair usage)",
            "Zero visit charge",
            "Fastest priority assignment",
            "Free emergency bookings",
            "Personal account manager",
            "Same-day service guarantee",
            "Annual maintenance reports",
        ],
        popular: false,
    },
];

export default function SubscriptionPlans() {
    const [hoveredPlan, setHoveredPlan] = useState(null);

    const handleSubscribe = (planName) => {
        toast.success(`${planName} Plan selected! 🎉 (Demo — no real payment)`, {
            duration: 3000,
        });
    };

    return (
        <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="inline-block bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                        Home Maintenance Plans
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        Choose Your Perfect Plan
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
                        Save more with monthly subscription plans. Get priority service, discounted rates, and peace of mind.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {plans.map((plan, i) => (
                        <div
                            key={plan.name}
                            className={`relative bg-white dark:bg-gray-800 rounded-2xl border 
                                ${plan.popular ? "border-primary-300 dark:border-primary-600 shadow-xl shadow-primary-100/50 dark:shadow-primary-900/30 scale-[1.02]" : "border-gray-200 dark:border-gray-700 shadow-sm"} 
                                p-7 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                            onMouseEnter={() => setHoveredPlan(i)}
                            onMouseLeave={() => setHoveredPlan(null)}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-5`}>
                                <plan.icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>

                            <div className="mt-5 mb-6">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₹{plan.price}</span>
                                <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">{plan.period}</span>
                            </div>

                            <div className="space-y-3 flex-1">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-start gap-2.5">
                                        <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSubscribe(plan.name)}
                                className={`mt-7 w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${plan.popular
                                        ? "bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-indigo-700"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    }`}
                            >
                                Subscribe Now
                            </button>
                        </div>
                    ))}
                </div>

                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
                    * This is a UI simulation for demonstration purposes. No real subscriptions are processed.
                </p>
            </div>
        </section>
    );
}
