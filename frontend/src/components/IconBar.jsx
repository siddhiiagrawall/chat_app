import { MessageSquare, Users, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";

const IconBar = () => {
    const { logout, authUser } = useAuthStore();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-[60px] bg-[#0a0f1a] flex flex-col items-center py-4 border-r border-slate-800">
            {/* Top Section */}
            <div className="flex flex-col items-center gap-6">
                {/* Logo */}
                <Link to="/" className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                    <MessageSquare className="w-6 h-6 text-white" />
                </Link>

                {/* Chats Icon */}
                <Link
                    to="/"
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isActive("/") ? "bg-slate-800 text-green-500" : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                        }`}
                    title="Chats"
                >
                    <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Contacts Icon */}
                <button
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-300 transition-colors"
                    title="Contacts"
                >
                    <Users className="w-5 h-5" />
                </button>

                {/* Settings Icon */}
                <Link
                    to="/settings"
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isActive("/settings") ? "bg-slate-800 text-green-500" : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                        }`}
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </Link>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto flex flex-col items-center gap-4">
                {/* Profile Avatar */}
                {authUser && (
                    <Link
                        to="/profile"
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-colors ${isActive("/profile") ? "border-green-500" : "border-transparent hover:border-slate-600"
                            }`}
                        title="Profile"
                    >
                        <img
                            src={authUser.profilePic || "/avatar.png"}
                            alt={authUser.fullName}
                            className="w-full h-full object-cover"
                        />
                    </Link>
                )}

                {/* Logout */}
                {authUser && (
                    <button
                        onClick={logout}
                        className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default IconBar;
