import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import {
    HiOutlineUsers,
    HiOutlineWrenchScrewdriver,
    HiOutlineClipboardDocumentList,
    HiOutlineCurrencyRupee,
    HiOutlineTrash,
    HiOutlinePlus,
} from "react-icons/hi2";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [revenue, setRevenue] = useState(0);
    const [workers, setWorkers] = useState([]);
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("overview");
    const [serviceForm, setServiceForm] = useState({ name: "", basePrice: "", description: "" });
    const [showServiceModal, setShowServiceModal] = useState(false);

    const fetchAll = useCallback(async () => {
        try {
            const [statsRes, revRes, workersRes, servicesRes, bookingsRes] = await Promise.all([
                API.get("/admin/dashboard-stats"),
                API.get("/admin/total-revenue"),
                API.get("/admin/workers"),
                API.get("/admin/services"),
                API.get("/admin/bookings"),
            ]);
            setStats(statsRes.data.data);
            setRevenue(revRes.data.data.totalRevenue);
            setWorkers(workersRes.data.data);
            setServices(servicesRes.data.data);
            setBookings(bookingsRes.data.data);
        } catch {
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const approveWorker = async (id) => {
        try {
            await API.put(`/admin/workers/${id}/approve`);
            toast.success("Worker approved");
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed");
        }
    };

    const blockWorker = async (id) => {
        if (!window.confirm("Block this worker?")) return;
        try {
            await API.put(`/admin/workers/${id}/block`);
            toast.success("Worker blocked");
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed");
        }
    };

    const addService = async (e) => {
        e.preventDefault();
        try {
            await API.post("/admin/services", { ...serviceForm, basePrice: Number(serviceForm.basePrice) });
            toast.success("Service added");
            setServiceForm({ name: "", basePrice: "", description: "" });
            setShowServiceModal(false);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed");
        }
    };

    const deleteService = async (id) => {
        if (!window.confirm("Delete this service?")) return;
        try {
            await API.delete(`/admin/services/${id}`);
            toast.success("Service deleted");
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed");
        }
    };

    if (loading) return <Loader />;

    const statusBreakdown = ["pending", "accepted", "work_started", "awaiting_user_approval", "awaiting_payment", "completed", "cancelled"].map((s) => ({
        name: s.replace(/_/g, " "),
        value: bookings.filter((b) => b.status === s).length,
    })).filter((s) => s.value > 0);

    const revenueChartData = [
        { name: "Total Revenue", amount: revenue },
        { name: "Worker Payouts", amount: bookings.filter((b) => b.status === "completed").reduce((s, b) => s + (b.workerAmount || 0), 0) },
        { name: "Total Transactions", amount: bookings.filter((b) => b.status === "completed").reduce((s, b) => s + (b.finalAmount || 0), 0) },
    ];

    const statCards = [
        { label: "Total Users", value: stats?.totalUsers, icon: HiOutlineUsers, color: "bg-blue-50", iconColor: "text-blue-500" },
        { label: "Total Workers", value: stats?.totalWorkers, icon: HiOutlineWrenchScrewdriver, color: "bg-purple-50", iconColor: "text-purple-500" },
        { label: "Total Bookings", value: stats?.totalBookings, icon: HiOutlineClipboardDocumentList, color: "bg-amber-50", iconColor: "text-amber-500" },
        { label: "Platform Revenue", value: `₹${revenue.toFixed(2)}`, icon: HiOutlineCurrencyRupee, color: "bg-emerald-50", iconColor: "text-emerald-500" },
    ];

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "workers", label: `Workers (${workers.length})` },
        { id: "services", label: `Services (${services.length})` },
        { id: "bookings", label: `Bookings (${bookings.length})` },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Platform overview and management</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s, i) => (
                    <div key={i} className="card !p-5">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center`}>
                                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">{s.label}</p>
                                <p className="text-xl font-bold text-gray-800">{s.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${tab === t.id ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === "overview" && (
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h3 className="font-semibold text-gray-800 mb-4">Revenue Breakdown</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, "Amount"]} />
                                <Bar dataKey="amount" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="card">
                        <h3 className="font-semibold text-gray-800 mb-4">Booking Status</h3>
                        {statusBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={statusBreakdown} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                        {statusBreakdown.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 text-center py-16">No bookings yet</p>
                        )}
                    </div>
                </div>
            )}

            {tab === "workers" && (
                <div className="card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">City</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Skills</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map((w) => (
                                <tr key={w._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 font-medium text-gray-800">{w.name}</td>
                                    <td className="py-3 px-4 text-gray-500">{w.email}</td>
                                    <td className="py-3 px-4 text-gray-500">{w.city}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {w.skills?.map((s, i) => (
                                                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${w.isApproved ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                                            {w.isApproved ? "Approved" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            {!w.isApproved ? (
                                                <button onClick={() => approveWorker(w._id)} className="btn-accent text-xs !px-3 !py-1">Approve</button>
                                            ) : (
                                                <button onClick={() => blockWorker(w._id)} className="btn-danger text-xs !px-3 !py-1">Block</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {workers.length === 0 && <p className="text-center text-gray-400 py-8">No workers registered yet</p>}
                </div>
            )}

            {tab === "services" && (
                <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={() => setShowServiceModal(true)} className="btn-primary text-sm flex items-center gap-2">
                            <HiOutlinePlus className="w-4 h-4" /> Add Service
                        </button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((s) => (
                            <div key={s._id} className="card flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{s.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                                    <p className="text-primary-600 font-bold mt-2">₹{s.basePrice}</p>
                                </div>
                                <button onClick={() => deleteService(s._id)} className="text-red-400 hover:text-red-600 transition-colors p-1 cursor-pointer">
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === "bookings" && (
                <div className="card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Service</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">User</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Worker</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">City</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Commission</th>
                                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 font-medium text-gray-800">{b.service?.name || "—"}</td>
                                    <td className="py-3 px-4 text-gray-500">{b.user?.name || "—"}</td>
                                    <td className="py-3 px-4 text-gray-500">{b.worker?.name || "Not assigned"}</td>
                                    <td className="py-3 px-4 text-gray-500">{b.city}</td>
                                    <td className="py-3 px-4 font-medium">₹{b.visitCharge}{b.finalAmount ? ` (Final: ₹${b.finalAmount})` : ""}</td>
                                    <td className="py-3 px-4 text-emerald-600 font-medium">₹{b.commissionAmount}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${b.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                                            b.status === "cancelled" ? "bg-red-50 text-red-600" :
                                                "bg-blue-50 text-blue-600"
                                            }`}>
                                            {b.status.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.length === 0 && <p className="text-center text-gray-400 py-8">No bookings yet</p>}
                </div>
            )}

            {showServiceModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={addService} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
                        <h3 className="text-lg font-bold text-gray-800">Add New Service</h3>
                        <div>
                            <label className="label">Service Name</label>
                            <input type="text" className="input-field" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} required />
                        </div>
                        <div>
                            <label className="label">Base Price (₹)</label>
                            <input type="number" className="input-field" value={serviceForm.basePrice} onChange={(e) => setServiceForm({ ...serviceForm, basePrice: e.target.value })} required min={1} />
                        </div>
                        <div>
                            <label className="label">Description</label>
                            <textarea className="input-field resize-none min-h-[80px]" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowServiceModal(false)} className="btn-outline flex-1 text-sm">Cancel</button>
                            <button type="submit" className="btn-primary flex-1 text-sm">Add Service</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
