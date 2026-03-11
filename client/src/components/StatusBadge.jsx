const statusConfig = {
    pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    accepted: { label: "Accepted", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    work_started: { label: "Work Started", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
    awaiting_user_approval: { label: "Awaiting Approval", bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
    awaiting_payment: { label: "Awaiting Payment", bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
    completed: { label: "Completed", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

export default function StatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}
