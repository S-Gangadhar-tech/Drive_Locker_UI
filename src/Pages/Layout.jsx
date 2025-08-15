import { Outlet } from "react-router-dom";
import Menubar from "../Components/Menubar";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-100">
            <Menubar />
            <main className="flex-grow bg-green-200 flex items-center justify-center">
                <div className="w-full max-w-3xl p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
