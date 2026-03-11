import { useState, useEffect, useRef } from "react";
import { useCity } from "../context/CityContext";
import {
    HiOutlineXMark,
    HiOutlineMagnifyingGlass,
    HiOutlineMapPin,
    HiOutlineCheckCircle,
} from "react-icons/hi2";

export default function CitySelectorModal() {
    const { cities, city: selectedCity, selectCity, showSelector, setShowSelector } = useCity();
    const [search, setSearch] = useState("");
    const inputRef = useRef(null);

    const filtered = cities.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (showSelector && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
        setSearch("");
    }, [showSelector]);

    useEffect(() => {
        if (showSelector) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [showSelector]);

    if (!showSelector) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowSelector(false)}
            />

            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            Select your city
                        </h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Choose a city to see available services
                        </p>
                    </div>
                    <button
                        onClick={() => setShowSelector(false)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <HiOutlineXMark className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 pb-4">
                    <div className="relative">
                        <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search for your city..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                        />
                    </div>
                </div>

                {/* City List */}
                <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto">
                    {filtered.length === 0 ? (
                        <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
                            No cities match your search
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {filtered.map((c) => {
                                const isSelected = selectedCity === c;
                                return (
                                    <button
                                        key={c}
                                        onClick={() => selectCity(c)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer group ${isSelected
                                                ? "bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700"
                                                : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${isSelected
                                                    ? "bg-primary-100 dark:bg-primary-800/50"
                                                    : "bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20"
                                                }`}
                                        >
                                            <HiOutlineMapPin
                                                className={`w-4 h-4 transition-colors duration-200 ${isSelected
                                                        ? "text-primary-600 dark:text-primary-400"
                                                        : "text-gray-400 dark:text-gray-500 group-hover:text-primary-500"
                                                    }`}
                                            />
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={`font-semibold text-sm transition-colors ${isSelected
                                                        ? "text-primary-700 dark:text-primary-300"
                                                        : "text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                                                    }`}
                                            >
                                                {c}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                Tamil Nadu
                                            </p>
                                        </div>

                                        {/* Checkmark */}
                                        {isSelected && (
                                            <HiOutlineCheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Bottom hint */}
                {!selectedCity && (
                    <div className="px-6 py-4 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-800/30">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
                            <HiOutlineMapPin className="w-4 h-4 shrink-0" />
                            <p>Select a city to see services near you</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
