import { useEffect, useState, useCallback, useRef } from "react";
import API from "../api/axios";
import BookingCard from "../components/BookingCard";
import WorkerPerformance from "../components/WorkerPerformance";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { HiOutlineStar, HiOutlineCurrencyRupee, HiOutlineSignal, HiOutlineChartBar } from "react-icons/hi2";
import { io as socketIO } from "socket.io-client";

const STATUS_LABELS = {
    accepted: "Start Work",
};

export default function WorkerDashboard() {
    const [available, setAvailable] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAvailable, setIsAvailable] = useState(false);
    const [finalAmountModal, setFinalAmountModal] = useState(null);
    const [finalAmountValue, setFinalAmountValue] = useState("");
    const [showPerformance, setShowPerformance] = useState(false);
    const socketRef = useRef(null);

    const fetchData = useCallback(async () => {
        try {
            const [profRes, myRes] = await Promise.all([
                API.get("/auth/profile"),
                API.get("/bookings/worker-bookings"),
            ]);
            setProfile(profRes.data.data);
            setMyBookings(myRes.data.data);
            setIsAvailable(profRes.data.data.isAvailable);

            if (profRes.data.data.isApproved && profRes.data.data.isAvailable) {
                const avRes = await API.get("/bookings/available");
                setAvailable(avRes.data.data);
            } else {
                setAvailable([]);
            }
        } catch {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Socket.IO connection for real-time notifications
    useEffect(() => {
        if (!profile?._id) return;

        const socket = socketIO(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
        socketRef.current = socket;

        socket.emit("joinRoom", profile._id);

        socket.on("paymentConfirmed", (data) => {
            toast.success("Payment Confirmed by Customer 🎉", {
                duration: 5000,
                icon: "💰",
            });
            fetchData();
        });

        return () => {
            socket.disconnect();
        };
    }, [profile?._id, fetchData]);

    const toggleAvailability = async () => {
        try {
            const { data } = await API.put("/auth/availability", { isAvailable: !isAvailable });
            setIsAvailable(data.data.isAvailable);
            toast.success(data.data.isAvailable ? "You are now online" : "You are now offline");
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to toggle");
        }
    };

    const acceptBooking = async (id) => {
        if (!window.confirm("Accept this booking?")) return;
        try {
            await API.put(`/bookings/${id}/accept`);
            toast.success("Booking accepted!");
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to accept");
        }
    };

    const updateStatus = async (id) => {
        try {
            const { data } = await API.put(`/bookings/${id}/status`);
            toast.success(data.message);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update");
        }
    };

    const handleSubmitFinalAmount = async (bookingId) => {
        if (!finalAmountValue || Number(finalAmountValue) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        try {
            await API.put(`/bookings/${bookingId}/submit-final-amount`, {
                finalAmount: Number(finalAmountValue),
            });
            toast.success("Final amount submitted! Waiting for customer approval.");
            setFinalAmountModal(null);
            setFinalAmountValue("");
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit final amount");
        }
    };

    if (loading) return <Loader />;

    // Show Performance Dashboard
    if (showPerformance) {
        return (
            <WorkerPerformance
                bookings={myBookings}
                profile={profile}
                onBack={() => setShowPerformance(false)}
            />
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Worker Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {profile?.isApproved ? "Manage your bookings and earnings" : "⏳ Waiting for admin approval..."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {profile?.isApproved && (
                        <>
                            <button
                                onClick={() => setShowPerformance(true)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-all cursor-pointer"
                            >
                                <HiOutlineChartBar className="w-4 h-4" />
                                Performance
                            </button>
                            <button onClick={toggleAvailability} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${isAvailable ? "bg-accent-500 text-white hover:bg-accent-600" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}>
                                <HiOutlineSignal className="w-5 h-5" />
                                {isAvailable ? "Online" : "Offline"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
                            <HiOutlineStar className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Rating</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">{profile?.rating?.toFixed(1) || "0.0"}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                            <HiOutlineCurrencyRupee className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Total Earnings</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">₹{profile?.totalEarnings?.toFixed(2) || "0.00"}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                            <span className="text-blue-500 dark:text-blue-400 font-bold">{myBookings.length}</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Total Jobs</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">{myBookings.filter((b) => b.status === "completed").length} completed</p>
                        </div>
                    </div>
                </div>
            </div>

            {profile?.isApproved && isAvailable && available.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Available Bookings in {profile?.city}</h2>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {available.map((b) => (
                            <BookingCard
                                key={b._id}
                                booking={b}
                                showUser
                                actions={
                                    <button onClick={() => acceptBooking(b._id)} className="btn-accent text-xs !px-4 !py-1.5">Accept</button>
                                }
                            />
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">My Jobs</h2>
                {myBookings.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center py-12 text-gray-400 dark:text-gray-500">No jobs yet</div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2">
                        {myBookings.map((b) => (
                            <BookingCard
                                key={b._id}
                                booking={b}
                                showUser
                                actions={
                                    <>
                                        {STATUS_LABELS[b.status] && (
                                            <button onClick={() => updateStatus(b._id)} className="btn-primary text-xs !px-4 !py-1.5">
                                                {STATUS_LABELS[b.status]}
                                            </button>
                                        )}

                                        {b.status === "work_started" && !b.finalAmount && (
                                            <button
                                                onClick={() => { setFinalAmountModal(b._id); setFinalAmountValue(""); }}
                                                className="btn-accent text-xs !px-4 !py-1.5"
                                            >
                                                Submit Final Amount
                                            </button>
                                        )}

                                        {b.status === "awaiting_user_approval" && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-50 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300">
                                                🟡 Waiting for Customer Approval
                                            </span>
                                        )}

                                        {b.status === "awaiting_payment" && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
                                                💳 Waiting for Customer Payment
                                            </span>
                                        )}

                                        {b.status === "completed" && b.paymentConfirmed && (
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                                                    🟢 Payment Confirmed
                                                </span>
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 italic">Payment received (simulated)</span>
                                            </div>
                                        )}
                                    </>
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Final Amount Modal */}
            {finalAmountModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl animate-slideUp">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Submit Final Amount</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Enter the total cost after completing the service. This must be greater than the visit charge.
                        </p>
                        <div className="mb-4">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Final Amount (₹)</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="Enter final amount"
                                value={finalAmountValue}
                                onChange={(e) => setFinalAmountValue(e.target.value)}
                                min={1}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setFinalAmountModal(null); setFinalAmountValue(""); }}
                                className="btn-outline flex-1 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSubmitFinalAmount(finalAmountModal)}
                                disabled={!finalAmountValue}
                                className="btn-primary flex-1 text-sm"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
