import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { HiOutlineMapPin, HiOutlineCalendar, HiOutlineInformationCircle } from "react-icons/hi2";

const tnCities = ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Dindigul"];

export default function BookService() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ city: "", address: "", scheduledDate: "" });

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await API.get(`/services/${serviceId}`);
                setService(data.data);
            } catch {
                toast.error("Service not found");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [serviceId, navigate]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.post("/bookings", {
                service: serviceId,
                city: form.city,
                address: form.address,
                scheduledDate: form.scheduledDate,
                visitCharge: service.basePrice,
            });
            toast.success("Booking created successfully!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create booking");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Book Service</h1>
                    <p className="text-gray-500 mt-1">Fill in the details to request a booking</p>
                </div>

                <div className="card mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-lg text-gray-800">{service.name}</h2>
                            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-400">Visit Charge</span>
                            <p className="text-xl font-bold text-primary-600">₹{service.basePrice}</p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2 bg-blue-50 text-blue-700 text-xs rounded-lg px-3 py-2.5">
                        <HiOutlineInformationCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Visit charge ₹{service.basePrice}. Final cost will be confirmed after service completion.</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-5">
                    <div>
                        <label className="label flex items-center gap-1.5">
                            <HiOutlineMapPin className="w-4 h-4" /> City
                        </label>
                        <select name="city" className="input-field" value={form.city} onChange={handleChange} required>
                            <option value="">Select your city</option>
                            {tnCities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Address</label>
                        <textarea name="address" className="input-field min-h-[80px] resize-none" placeholder="Enter full address" value={form.address} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="label flex items-center gap-1.5">
                            <HiOutlineCalendar className="w-4 h-4" /> Scheduled Date & Time
                        </label>
                        <input type="datetime-local" name="scheduledDate" className="input-field" value={form.scheduledDate} onChange={handleChange} required />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full">
                        {submitting ? "Creating booking..." : `Confirm Booking — ₹${service.basePrice} Visit Charge`}
                    </button>
                </form>
            </div>
        </div>
    );
}
