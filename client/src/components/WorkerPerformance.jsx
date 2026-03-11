import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import {
    HiOutlineCurrencyRupee,
    HiOutlineStar,
    HiOutlineBriefcase,
    HiOutlineCalendarDays,
    HiOutlineChartBar,
    HiOutlineArrowLeft,
} from "react-icons/hi2";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function WorkerPerformance({ bookings, profile, onBack }) {
    const [activeChart, setActiveChart] = useState("earnings");

    const completedBookings = useMemo(
        () => bookings.filter((b) => b.status === "completed"),
        [bookings]
    );

    // Compute stats
    const totalEarnings = profile?.totalEarnings || 0;
    const totalJobs = completedBookings.length;
    const avgRating = profile?.rating || 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthEarnings = useMemo(() => {
        return completedBookings
            .filter((b) => {
                const d = new Date(b.updatedAt || b.createdAt);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            })
            .reduce((sum, b) => sum + (b.finalAmount || 0), 0);
    }, [completedBookings, currentMonth, currentYear]);

    // Status breakdown
    const statusBreakdown = useMemo(() => {
        const map = {};
        bookings.forEach((b) => {
            map[b.status] = (map[b.status] || 0) + 1;
        });
        return Object.entries(map).map(([status, count]) => ({
            status: status.replace(/_/g, " "),
            count,
        }));
    }, [bookings]);

    // Monthly earnings chart data (last 6 months)
    const monthlyEarnings = useMemo(() => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const month = d.getMonth();
            const year = d.getFullYear();
            const monthBookings = completedBookings.filter((b) => {
                const bd = new Date(b.updatedAt || b.createdAt);
                return bd.getMonth() === month && bd.getFullYear() === year;
            });
            const earnings = monthBookings.reduce((sum, b) => {
                const commission = (b.finalAmount || 0) * 0.05;
                return sum + ((b.finalAmount || 0) - commission);
            }, 0);
            data.push({
                month: MONTHS[month],
                earnings: Math.round(earnings),
                jobs: monthBookings.length,
            });
        }
        return data;
    }, [completedBookings]);

    const statusColors = {
        pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
        accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
        "work started": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
        "awaiting user approval": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
        "awaiting payment": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
        completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
        cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    };

    return (
        <div className="animate-fadeIn">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 cursor-pointer transition-colors"
            >
                <HiOutlineArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Performance Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Track your earnings, jobs, and growth</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                            <HiOutlineCurrencyRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Earnings</span>
                    </div>
                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white">₹{totalEarnings.toFixed(0)}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">After 5% commission</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                            <HiOutlineBriefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Jobs</span>
                    </div>
                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{totalJobs}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Completed successfully</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
                            <HiOutlineStar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Rating</span>
                    </div>
                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{avgRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Average customer rating</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center">
                            <HiOutlineCalendarDays className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">This Month</span>
                    </div>
                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white">₹{currentMonthEarnings.toFixed(0)}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{MONTHS[currentMonth]} {currentYear}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <HiOutlineChartBar className="w-5 h-5 text-primary-500" />
                            Analytics
                        </h3>
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setActiveChart("earnings")}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeChart === "earnings"
                                        ? "bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                                    }`}
                            >
                                Earnings
                            </button>
                            <button
                                onClick={() => setActiveChart("jobs")}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeChart === "jobs"
                                        ? "bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                                    }`}
                            >
                                Jobs
                            </button>
                        </div>
                    </div>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            {activeChart === "earnings" ? (
                                <BarChart data={monthlyEarnings}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                                    <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "1px solid #e5e7eb",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        }}
                                        formatter={(value) => [`₹${value}`, "Earnings"]}
                                    />
                                    <Bar dataKey="earnings" fill="#6366f1" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            ) : (
                                <LineChart data={monthlyEarnings}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                                    <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "1px solid #e5e7eb",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        }}
                                        formatter={(value) => [value, "Jobs"]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="jobs"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: "#10b981", r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-5">Booking Breakdown</h3>
                    {statusBreakdown.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500">No bookings yet</p>
                    ) : (
                        <div className="space-y-3">
                            {statusBreakdown.map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${statusColors[s.status] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                        }`}>
                                        {s.status}
                                    </span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-white">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Total Bookings</span>
                            <span className="font-bold text-gray-800 dark:text-white">{bookings.length}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-500 dark:text-gray-400">Completion Rate</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {bookings.length > 0 ? ((totalJobs / bookings.length) * 100).toFixed(0) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
