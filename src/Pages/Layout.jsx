import { Outlet } from "react-router-dom";
import Menubar from "../Components/Menubar";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
            <Menubar />
            <main className="flex-grow flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-4xl p-6 rounded-2xl ">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
