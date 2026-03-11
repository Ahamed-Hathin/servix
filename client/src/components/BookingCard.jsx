import StatusBadge from "./StatusBadge";
import { HiOutlineMapPin, HiOutlineCalendar, HiOutlineUser, HiOutlineCurrencyRupee } from "react-icons/hi2";

export default function BookingCard({ booking, actions, showWorker, showUser }) {
    const service = booking.service;
    const scheduledDate = new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

    return (
        <div className="card">
            <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-lg">{service?.name || "Service"}</h3>
                <StatusBadge status={booking.status} />
            </div>

            <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <HiOutlineMapPin className="w-4 h-4 shrink-0" />
                    <span>{booking.address}, {booking.city}</span>
                </div>
                <div className="flex items-center gap-2">
                    <HiOutlineCalendar className="w-4 h-4 shrink-0" />
                    <span>{scheduledDate}</span>
                </div>
                {showWorker && booking.worker && (
                    <div className="flex items-center gap-2">
                        <HiOutlineUser className="w-4 h-4 shrink-0" />
                        <span>Worker: {booking.worker.name}</span>
                    </div>
                )}
                {showUser && booking.user && (
                    <div className="flex items-center gap-2">
                        <HiOutlineUser className="w-4 h-4 shrink-0" />
                        <span>Customer: {booking.user.name}</span>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-4">
                        <div>
                            <span className="text-xs text-gray-400">Visit Charge</span>
                            <p className="font-bold text-gray-800">₹{booking.visitCharge}</p>
                        </div>
                        {booking.finalAmount && (
                            <div>
                                <span className="text-xs text-gray-400">Final Amount</span>
                                <p className="font-bold text-primary-600">₹{booking.finalAmount}</p>
                            </div>
                        )}
                    </div>
                    {actions && <div className="flex gap-2 flex-wrap justify-end">{actions}</div>}
                </div>

                {booking.paymentConfirmed && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                        <HiOutlineCurrencyRupee className="w-4 h-4" />
                        🟢 Payment Confirmed
                    </div>
                )}
            </div>
        </div>
    );
}
