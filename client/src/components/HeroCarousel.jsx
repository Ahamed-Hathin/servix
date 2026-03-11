import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";
import { useCity } from "../context/CityContext";

const slides = [
    {
        image:
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&h=600&fit=crop",
        title: "Trusted Electricians",
        subtitle: "Certified professionals for all your electrical needs",
        cta: "Book Now",
        accent: "from-indigo-900/80",
    },
    {
        image:
            "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1400&h=600&fit=crop",
        title: "Fast & Reliable Plumbers",
        subtitle: "Emergency plumbing services at your doorstep",
        cta: "Get Started",
        accent: "from-emerald-900/80",
    },
    {
        image:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&h=600&fit=crop",
        title: "Hassle-Free Home Cleaning",
        subtitle: "Professional deep cleaning for your home & office",
        cta: "Explore Services",
        accent: "from-purple-900/80",
    },
    {
        image:
            "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1400&h=600&fit=crop",
        title: "Expert Painters",
        subtitle: "Transform your space with premium painting services",
        cta: "View Painters",
        accent: "from-orange-900/80",
    },
];

export default function HeroCarousel() {
    const { city } = useCity();

    return (
        <section className="relative">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                effect="fade"
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                loop
                className="hero-swiper"
            >
                {slides.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <div className="relative h-[420px] sm:h-[480px] lg:h-[540px]">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div
                                className={`absolute inset-0 bg-gradient-to-r ${slide.accent} via-black/40 to-transparent`}
                            />
                            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                                <div className="max-w-xl">
                                    {city && (
                                        <span className="inline-flex items-center gap-1.5 text-white/70 text-sm font-medium mb-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                            📍 {city}
                                        </span>
                                    )}
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                                        {slide.title}
                                        <br />
                                        <span className="text-white/80 text-xl sm:text-2xl lg:text-3xl font-medium">
                                            {city ? `in ${city}` : "in Your City"}
                                        </span>
                                    </h2>
                                    <p className="mt-4 text-white/60 text-base sm:text-lg max-w-md">
                                        {slide.subtitle}
                                    </p>
                                    <div className="mt-6 flex gap-3">
                                        <Link
                                            to={city ? "/" : "#"}
                                            className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm sm:text-base"
                                        >
                                            {slide.cta} →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
