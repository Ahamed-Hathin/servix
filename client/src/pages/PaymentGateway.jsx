import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
    HiOutlineCreditCard,
    HiOutlineShieldCheck,
    HiOutlineLockClosed,
    HiOutlineCheckCircle,
    HiOutlineArrowLeft,
} from "react-icons/hi2";

const TABS = [
    { id: "upi", label: "UPI", icon: "🔵" },
    { id: "card", label: "Card", icon: "💳" },
    { id: "netbanking", label: "Net Banking", icon: "🏦" },
];

export default function PaymentGateway() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("upi");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState("");

    // UPI state
    const [upiId, setUpiId] = useState("");

    // Card state
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardName, setCardName] = useState("");

    // Net Banking state
    const [selectedBank, setSelectedBank] = useState("");

    useEffect(() => {
        fetchBooking();
    }, []);

    const fetchBooking = async () => {
        try {
            const { data } = await API.get("/bookings/my-bookings");
            const found = data.data.find((b) => b._id === bookingId);
            if (!found) {
                toast.error("Booking not found");
                navigate("/dashboard");
                return;
            }
            if (found.status !== "awaiting_payment") {
                toast.error("This booking is not awaiting payment");
                navigate("/dashboard");
                return;
            }
            setBooking(found);
        } catch {
            toast.error("Failed to load booking");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\D/g, "").substring(0, 16);
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.join(" ");
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\D/g, "").substring(0, 4);
        if (v.length >= 2) return v.substring(0, 2) + "/" + v.substring(2);
        return v;
    };

    const validateForm = () => {
        if (activeTab === "upi") {
            if (!upiId || !upiId.includes("@")) {
                toast.error("Please enter a valid UPI ID (e.g. name@upi)");
                return false;
            }
        } else if (activeTab === "card") {
            if (cardNumber.replace(/\s/g, "").length < 16) {
                toast.error("Please enter a valid 16-digit card number");
                return false;
            }
            if (cardExpiry.length < 5) {
                toast.error("Please enter a valid expiry (MM/YY)");
                return false;
            }
            if (cardCvv.length < 3) {
                toast.error("Please enter a valid CVV");
                return false;
            }
            if (!cardName.trim()) {
                toast.error("Please enter cardholder name");
                return false;
            }
        } else if (activeTab === "netbanking") {
            if (!selectedBank) {
                toast.error("Please select a bank");
                return false;
            }
        }
        return true;
    };

    const handlePay = async () => {
        if (!validateForm()) return;
        setProcessing(true);

        try {
            const methodMap = { upi: "UPI", card: "Card", netbanking: "Net Banking" };
            const { data } = await API.post(`/bookings/${bookingId}/process-payment`, {
                paymentMethod: methodMap[activeTab],
            });

            setTransactionId(data.data.transactionId);
            setSuccess(true);
            toast.success("Payment successful!");

            // Auto redirect after 4 seconds
            setTimeout(() => {
                navigate("/dashboard");
            }, 4000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Payment failed");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="payment-spinner" />
                    <p className="text-gray-500 font-medium">Loading payment details...</p>
                </div>
            </div>
        );
    }

    // Success Screen
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-slideUp">
                    {/* Success Animation Circle */}
                    <div className="payment-success-circle mx-auto mb-6">
                        <HiOutlineCheckCircle className="w-16 h-16 text-emerald-500" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                    <p className="text-gray-500 mb-6">Your payment has been processed successfully</p>

                    <div className="bg-emerald-50 rounded-2xl p-5 mb-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Amount Paid</span>
                            <span className="font-bold text-emerald-700 text-lg">₹{booking.finalAmount}</span>
                        </div>
                        <div className="border-t border-emerald-100" />
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Transaction ID</span>
                            <span className="font-mono font-semibold text-gray-700 text-xs">{transactionId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Service</span>
                            <span className="font-semibold text-gray-700">{booking.service?.name}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-medium mb-4">
                        <HiOutlineShieldCheck className="w-5 h-5" />
                        <span>Payment Verified & Secured</span>
                    </div>

                    <p className="text-xs text-gray-400">Redirecting to dashboard in a few seconds...</p>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-4 btn-primary w-full"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Processing overlay
    if (processing) {
        return (
            <div className="min-h-screen bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 fixed inset-0 z-50">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center animate-slideUp">
                    <div className="payment-processing-spinner mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment...</h3>
                    <p className="text-gray-500 text-sm">Please do not close this window.</p>
                    <p className="text-gray-400 text-xs mt-2">Verifying your payment details securely</p>

                    <div className="mt-6 flex items-center justify-center gap-2 text-primary-600 text-xs font-medium">
                        <HiOutlineLockClosed className="w-4 h-4" />
                        <span>256-bit SSL Encrypted</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <HiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                                    SERVEFIX Pay
                                </span>
                            </h1>
                            <p className="text-xs text-gray-400">Secure Payment Gateway</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full">
                        <HiOutlineLockClosed className="w-3.5 h-3.5" />
                        <span>Secure</span>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-5 gap-6">
                    {/* Left — Payment Form */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Payment Tabs */}
                            <div className="flex border-b border-gray-100">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-4 px-3 text-center text-sm font-semibold transition-all relative cursor-pointer ${activeTab === tab.id
                                            ? "text-primary-600 bg-primary-50/50"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="text-lg mr-1.5">{tab.icon}</span>
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {/* UPI Tab */}
                                {activeTab === "upi" && (
                                    <div className="animate-fadeIn">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">🔵</div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Pay via UPI</h3>
                                                <p className="text-xs text-gray-400">Google Pay, PhonePe, Paytm & more</p>
                                            </div>
                                        </div>

                                        {/* UPI Provider Logos */}
                                        <div className="flex gap-3 mb-5">
                                            {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                                                <div
                                                    key={app}
                                                    className="flex-1 bg-gray-50 rounded-xl py-2.5 text-center text-xs font-semibold text-gray-600 border border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer"
                                                >
                                                    {app}
                                                </div>
                                            ))}
                                        </div>

                                        <label className="label">UPI ID</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="yourname@upi"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-400 mt-2">
                                            Enter your UPI ID linked with any UPI app
                                        </p>

                                        <button onClick={handlePay} className="btn-primary w-full mt-6 py-3 text-base">
                                            Pay ₹{booking.finalAmount}
                                        </button>
                                    </div>
                                )}

                                {/* Card Tab */}
                                {activeTab === "card" && (
                                    <div className="animate-fadeIn">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                                <HiOutlineCreditCard className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Credit / Debit Card</h3>
                                                <p className="text-xs text-gray-400">Visa, Mastercard, RuPay</p>
                                            </div>
                                        </div>

                                        {/* Card Type Badges */}
                                        <div className="flex gap-2 mb-5">
                                            {["Visa", "Mastercard", "RuPay"].map((type) => (
                                                <span
                                                    key={type}
                                                    className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 tracking-wide"
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="label">Card Number</label>
                                                <input
                                                    type="text"
                                                    className="input-field font-mono tracking-wider"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                    maxLength={19}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="label">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        className="input-field"
                                                        placeholder="MM/YY"
                                                        value={cardExpiry}
                                                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                                        maxLength={5}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="label">CVV</label>
                                                    <input
                                                        type="password"
                                                        className="input-field"
                                                        placeholder="•••"
                                                        value={cardCvv}
                                                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                                                        maxLength={4}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="label">Cardholder Name</label>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    placeholder="Name on card"
                                                    value={cardName}
                                                    onChange={(e) => setCardName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <button onClick={handlePay} className="btn-primary w-full mt-6 py-3 text-base">
                                            Pay ₹{booking.finalAmount}
                                        </button>
                                    </div>
                                )}

                                {/* Net Banking Tab */}
                                {activeTab === "netbanking" && (
                                    <div className="animate-fadeIn">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-xl">🏦</div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Net Banking</h3>
                                                <p className="text-xs text-gray-400">All major banks supported</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-5">
                                            {[
                                                "SBI", "HDFC Bank", "ICICI Bank", "Axis Bank",
                                                "Kotak Bank", "Bank of Baroda", "PNB", "Canara Bank",
                                            ].map((bank) => (
                                                <button
                                                    key={bank}
                                                    onClick={() => setSelectedBank(bank)}
                                                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-left cursor-pointer ${selectedBank === bank
                                                        ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                                                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300"
                                                        }`}
                                                >
                                                    🏛️ {bank}
                                                </button>
                                            ))}
                                        </div>

                                        <button onClick={handlePay} className="btn-primary w-full mt-2 py-3 text-base">
                                            Pay ₹{booking.finalAmount}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Security Badges */}
                        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <HiOutlineLockClosed className="w-4 h-4" />
                                <span>SSL Encrypted</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <HiOutlineShieldCheck className="w-4 h-4" />
                                <span>PCI DSS Compliant</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — Order Summary */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Order Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Service</span>
                                    <span className="font-semibold text-gray-700">{booking.service?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Booking ID</span>
                                    <span className="font-mono text-xs text-gray-500">
                                        {booking._id?.substring(0, 8)}...
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Visit Charge</span>
                                    <span className="text-gray-600">₹{booking.visitCharge}</span>
                                </div>
                                {booking.worker && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Worker</span>
                                        <span className="text-gray-600">{booking.worker.name}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-100 my-4" />

                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800">Total Amount</span>
                                <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                                    ₹{booking.finalAmount}
                                </span>
                            </div>

                            <div className="mt-5 bg-amber-50 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                                <span className="text-base mt-[-2px]">ℹ️</span>
                                <span>
                                    This is a <strong>simulated payment</strong> for demonstration purposes. No real money will be charged.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
