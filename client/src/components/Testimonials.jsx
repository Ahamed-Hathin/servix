import { HiOutlineStar, HiStar } from "react-icons/hi2";

const testimonials = [
    {
        name: "Priya Sundaram",
        city: "Chennai",
        role: "Homeowner",
        rating: 5,
        text: "Very fast electrician service. Fixed my wiring issue in 30 minutes. Extremely professional and transparent pricing!",
        avatar: "PS",
        service: "Electrician",
    },
    {
        name: "Rajesh Kumar",
        city: "Coimbatore",
        role: "Business Owner",
        rating: 5,
        text: "We use Servix for all our office maintenance. The subscription plan has saved us thousands. Highly recommend!",
        avatar: "RK",
        service: "Maintenance",
    },
    {
        name: "Anitha Devi",
        city: "Madurai",
        role: "Working Professional",
        rating: 5,
        text: "Booked a plumber and a painter in the same week. Both were verified and did excellent work. Super convenient platform.",
        avatar: "AD",
        service: "Plumber",
    },
    {
        name: "Karthik Rajan",
        city: "Salem",
        role: "Home Renter",
        rating: 5,
        text: "Best service marketplace in Tamil Nadu! The payment system is smooth and I love that I can rate workers after every job.",
        avatar: "KR",
        service: "AC Repair",
    },
    {
        name: "Deepa Lakshmi",
        city: "Tiruchirappalli",
        role: "Homemaker",
        rating: 5,
        text: "Got my entire house deep-cleaned before a festival. The team was punctual, polite, and thorough. Will book again!",
        avatar: "DL",
        service: "Cleaning",
    },
    {
        name: "Suresh Babu",
        city: "Vellore",
        role: "Apartment Owner",
        rating: 4,
        text: "The carpenter they sent was skilled and finished the wardrobe work ahead of schedule. Great value for money.",
        avatar: "SB",
        service: "Carpenter",
    },
];

const avatarGradients = [
    "from-primary-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-blue-500 to-cyan-600",
    "from-purple-500 to-violet-600",
];

export default function Testimonials() {
    return (
        <section className="py-16 sm:py-20 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                        Customer Reviews
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
                        Join thousands of happy customers across Tamil Nadu
                    </p>
                </div>

                {/* Testimonial Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="group bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary-100 dark:hover:border-primary-800/30 relative overflow-hidden"
                        >
                            {/* Quote mark */}
                            <div className="absolute top-4 right-5 text-6xl font-serif text-gray-100 dark:text-gray-600/30 select-none leading-none">
                                &ldquo;
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-0.5 mb-4 relative z-10">
                                {[...Array(5)].map((_, j) => (
                                    <HiStar
                                        key={j}
                                        className={`w-4.5 h-4.5 ${j < t.rating
                                            ? "text-amber-400"
                                            : "text-gray-300 dark:text-gray-600"
                                            }`}
                                    />
                                ))}
                                <span className="ml-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                                    {t.service}
                                </span>
                            </div>

                            {/* Review text */}
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1 relative z-10">
                                &ldquo;{t.text}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-600/50 relative z-10">
                                <div
                                    className={`w-10 h-10 bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]
                                        } rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md`}
                                >
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {t.role} • {t.city}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
