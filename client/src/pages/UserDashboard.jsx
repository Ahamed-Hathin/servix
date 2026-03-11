import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import BookingCard from "../components/BookingCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { HiOutlineStar, HiOutlineDocumentArrowDown } from "react-icons/hi2";

export default function UserDashboard() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingModal, setRatingModal] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [submittingRate, setSubmittingRate] = useState(false);

    const fetchBookings = async () => {
        try {
            const { data } = await API.get("/bookings/my-bookings");
            setBookings(data.data);
        } catch {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleRate = async (bookingId) => {
        if (!selectedRating) return;
        setSubmittingRate(true);
        try {
            await API.put(`/bookings/${bookingId}/rate`, {
                rating: selectedRating,
                review: reviewText.trim() || undefined,
            });
            toast.success("Rating submitted! Thank you 🎉");
            setRatingModal(null);
            setSelectedRating(0);
            setHoverRating(0);
            setReviewText("");
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to rate");
        } finally {
            setSubmittingRate(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await API.put(`/bookings/${bookingId}/cancel`);
            toast.success("Booking cancelled");
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to cancel");
        }
    };

    const handleConfirmPayment = async (booking) => {
        // Navigate to payment gateway page
        navigate(`/payment/${booking._id}`);
    };

    const handleDownloadInvoice = async (bookingId) => {
        try {
            const response = await API.get(`/bookings/${bookingId}/invoice`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice-${bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Invoice downloaded!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to download invoice");
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
                <p className="text-gray-500 mt-1">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} found</p>
            </div>

            {bookings.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-gray-400 text-lg">No bookings yet</p>
                    <p className="text-gray-400 text-sm mt-1">Browse services and create your first booking</p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                    {bookings.map((b) => (
                        <BookingCard
                            key={b._id}
                            booking={b}
                            showWorker
                            actions={
                                <>
                                    {["pending", "accepted"].includes(b.status) && (
                                        <button onClick={() => handleCancel(b._id)} className="btn-danger text-xs !px-3 !py-1.5">Cancel</button>
                                    )}
                                    {b.status === "awaiting_user_approval" && (
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-sm font-semibold text-gray-700">
                                                Final Service Amount: <span className="text-primary-600">₹{b.finalAmount}</span>
                                            </span>
                                            <button
                                                onClick={() => handleConfirmPayment(b)}
                                                className="btn-accent text-xs !px-4 !py-1.5 animate-pulse"
                                            >
                                                ✅ Confirm Payment
                                            </button>
                                        </div>
                                    )}
                                    {b.status === "awaiting_payment" && (
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-sm font-semibold text-gray-700">
                                                Final Amount: <span className="text-primary-600 text-lg">₹{b.finalAmount}</span>
                                            </span>
                                            <button
                                                onClick={() => navigate(`/payment/${b._id}`)}
                                                className="btn-primary text-xs !px-5 !py-2 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                                            >
                                                💳 Pay Now
                                            </button>
                                        </div>
                                    )}
                                    {b.status === "completed" && !b.rating && (
                                        <button onClick={() => { setRatingModal(b._id); setSelectedRating(0); setHoverRating(0); setReviewText(""); }} className="btn-accent text-xs !px-3 !py-1.5">
                                            ⭐ Rate Service
                                        </button>
                                    )}
                                    {b.status === "completed" && b.paymentConfirmed && (
                                        <button onClick={() => handleDownloadInvoice(b._id)} className="btn-outline text-xs !px-3 !py-1.5 flex items-center gap-1.5">
                                            <HiOutlineDocumentArrowDown className="w-4 h-4" />
                                            🧾 Download Invoice
                                        </button>
                                    )}
                                    {b.rating && (
                                        <span className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
                                            <HiOutlineStar className="w-4 h-4" /> {b.rating}/5
                                        </span>
                                    )}
                                </>
                            }
                        />
                    ))}
                </div>
            )}

            {/* Rating Modal */}
            {ratingModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in">
                        <div className="text-center mb-5">
                            <span className="text-3xl">⭐</span>
                            <h3 className="text-lg font-bold text-gray-800 mt-2">Rate Your Experience</h3>
                            <p className="text-sm text-gray-500 mt-1">How was the service? Your feedback helps us improve.</p>
                        </div>

                        <div className="flex gap-2 justify-center mb-5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setSelectedRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className={`w-11 h-11 rounded-xl text-lg transition-all cursor-pointer ${star <= (hoverRating || selectedRating)
                                        ? "bg-amber-400 text-white scale-110 shadow-md"
                                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        {selectedRating > 0 && (
                            <p className="text-center text-sm font-medium text-amber-600 mb-4">
                                {selectedRating === 1 && "Poor 😞"}
                                {selectedRating === 2 && "Fair 😐"}
                                {selectedRating === 3 && "Good 🙂"}
                                {selectedRating === 4 && "Very Good 😊"}
                                {selectedRating === 5 && "Excellent! 🤩"}
                            </p>
                        )}

                        <div className="mb-5">
                            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Write a review (optional)</label>
                            <textarea
                                className="input-field min-h-[80px] resize-none text-sm"
                                placeholder="Share your experience with this service..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                maxLength={500}
                            />
                            <p className="text-[10px] text-gray-400 mt-1 text-right">{reviewText.length}/500</p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => { setRatingModal(null); setSelectedRating(0); setHoverRating(0); setReviewText(""); }} className="btn-outline flex-1 text-sm">
                                Skip
                            </button>
                            <button
                                onClick={() => handleRate(ratingModal)}
                                disabled={!selectedRating || submittingRate}
                                className="btn-primary flex-1 text-sm"
                            >
                                {submittingRate ? "Submitting..." : "Submit Rating"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

