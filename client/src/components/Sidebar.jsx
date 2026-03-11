import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlineBolt, HiOutlineXMark, HiOutlineBars3 } from "react-icons/hi2";
import { useState } from "react";

const userLinks = [
    { to: "/dashboard", label: "My Bookings", icon: "📋" },
    { to: "/", label: "Browse Services", icon: "🔍" },
];

const workerLinks = [
    { to: "/worker", label: "Dashboard", icon: "📊" },
];

const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: "📊" },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const links = user?.role === "admin" ? adminLinks : user?.role === "worker" ? workerLinks : userLinks;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
            ? "bg-primary-600 text-white shadow-md"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        }`;

    const sidebarContent = (
        <>
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                        <HiOutlineBolt className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-gray-800">
                        Hyper<span className="text-primary-600">Local</span>
                    </span>
                </div>
            </div>

            <div className="p-4">
                <div className="bg-gray-50 rounded-xl p-3 mb-6">
                    <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <span className="mt-1 inline-block text-xs bg-primary-50 text-primary-600 font-semibold px-2 py-0.5 rounded-full capitalize">
                        {user?.role}
                    </span>
                </div>

                <nav className="space-y-1">
                    {links.map((link) => (
                        <NavLink key={link.to} to={link.to} className={linkClasses} onClick={() => setOpen(false)}>
                            <span>{link.icon}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-gray-100">
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer">
                    ← Logout
                </button>
            </div>
        </>
    );

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border border-gray-100 cursor-pointer"
            >
                {open ? <HiOutlineXMark className="w-5 h-5" /> : <HiOutlineBars3 className="w-5 h-5" />}
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setOpen(false)} />
            )}

            <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-40 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                {sidebarContent}
            </aside>
        </>
    );
}
