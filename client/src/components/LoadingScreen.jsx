import { useEffect, useState } from "react";
import { HiOutlineBolt } from "react-icons/hi2";

export default function LoadingScreen() {
    const [fadeOut, setFadeOut] = useState(false);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setFadeOut(true), 1800);
        const hideTimer = setTimeout(() => setHidden(true), 2400);
        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (hidden) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 transition-opacity duration-600 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
        >
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center animate-pulse">
                    <HiOutlineBolt className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-3 rounded-3xl border-2 border-white/20 animate-ping" />
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                Ser<span className="text-accent-300">vix</span>
            </h1>
            <p className="text-white/50 text-sm font-medium tracking-wide">
                Trusted Home Services Marketplace
            </p>

            <div className="mt-10 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-white/60"
                        style={{
                            animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
