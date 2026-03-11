import { useEffect, useState } from "react";
import API from "../api/axios";
import ServiceCard from "./ServiceCard";
import Loader from "./Loader";
import { useCity } from "../context/CityContext";

export default function ServicesGrid() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { city } = useCity();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await API.get("/services");
                setServices(data.data);
            } catch {
                setServices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) return <Loader />;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {city ? `Services in ${city}` : "All Services"}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        {services.length} services available — book instantly
                    </p>
                </div>
            </div>

            {services.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-lg">No services available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {services.map((s) => (
                        <ServiceCard key={s._id} service={s} />
                    ))}
                </div>
            )}
        </section>
    );
}
