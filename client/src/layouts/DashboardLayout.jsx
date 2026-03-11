import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-0 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen overflow-auto transition-colors duration-300">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
