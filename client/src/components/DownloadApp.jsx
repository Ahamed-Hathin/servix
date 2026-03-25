import { HiOutlineDevicePhoneMobile, HiOutlineCheckCircle } from "react-icons/hi2";

const appFeatures = [
    "Book services in under 60 seconds",
    "Real-time worker tracking",
    "Secure in-app payments",
    "24/7 customer support",
    "Exclusive app-only discounts",
];

export default function DownloadApp() {
    return (
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-indigo-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <span className="inline-block bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-5 backdrop-blur">
                            Coming Soon
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                            Get the SERVEFIX App
                        </h2>
                        <p className="text-white/60 mt-4 max-w-lg leading-relaxed">
                            Book home services on the go. Download our mobile app for the best experience with exclusive features and offers.
                        </p>

                        <div className="mt-8 space-y-3">
                            {appFeatures.map((f, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <HiOutlineCheckCircle className="w-5 h-5 text-accent-400 shrink-0" />
                                    <span className="text-white/80 text-sm">{f}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <button className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-all shadow-xl cursor-pointer">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                App Store
                            </button>
                            <button className="bg-white/10 text-white border border-white/20 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all backdrop-blur cursor-pointer">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.396 13l2.302-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z" />
                                </svg>
                                Play Store
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="relative">
                            {/* Phone Mockup */}
                            <div className="w-64 h-[500px] bg-gray-900 rounded-[40px] border-[6px] border-gray-700 shadow-2xl overflow-hidden relative">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-10" />
                                {/* Screen */}
                                <div className="w-full h-full bg-gradient-to-b from-primary-600 to-indigo-700 flex flex-col items-center justify-center p-8">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur">
                                        <HiOutlineDevicePhoneMobile className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg text-center">SERVEFIX</h3>
                                    <p className="text-white/50 text-xs text-center mt-1">Home Services</p>
                                    <div className="mt-6 space-y-2 w-full">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="bg-white/10 rounded-xl p-3 backdrop-blur">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-white/20 rounded-lg" />
                                                    <div className="flex-1 space-y-1">
                                                        <div className="h-2 bg-white/30 rounded w-3/4" />
                                                        <div className="h-1.5 bg-white/15 rounded w-1/2" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Glow */}
                            <div className="absolute -inset-4 bg-primary-500/20 rounded-[50px] blur-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
