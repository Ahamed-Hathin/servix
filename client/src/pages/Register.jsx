import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineBolt } from "react-icons/hi2";
import toast from "react-hot-toast";

const tnCities = ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Dindigul"];

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", city: "", skills: "" });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                skills: form.role === "worker" ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
            };
            const user = await register(payload);
            toast.success(`Welcome, ${user.name}!`);
            const map = { user: "/dashboard", worker: "/worker", admin: "/admin" };
            navigate(map[user.role] || "/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <HiOutlineBolt className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
                    <p className="text-gray-500 mt-1">Join the SERVEFIX marketplace</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-4">
                    <div>
                        <label className="label">Full Name</label>
                        <input type="text" name="name" className="input-field" placeholder="Ravi Kumar" value={form.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="label">Email</label>
                        <input type="email" name="email" className="input-field" placeholder="ravi@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input type="password" name="password" className="input-field" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
                    </div>
                    <div>
                        <label className="label">I am a</label>
                        <select name="role" className="input-field" value={form.role} onChange={handleChange}>
                            <option value="user">Customer</option>
                            <option value="worker">Service Worker</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">City</label>
                        <select name="city" className="input-field" value={form.city} onChange={handleChange} required>
                            <option value="">Select city</option>
                            {tnCities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    {form.role === "worker" && (
                        <div>
                            <label className="label">Skills (comma separated)</label>
                            <input type="text" name="skills" className="input-field" placeholder="Electrician, Plumber" value={form.skills} onChange={handleChange} />
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
