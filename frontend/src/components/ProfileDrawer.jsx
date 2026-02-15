import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { X, Mail, User, Clock, Ban, Unlock } from "lucide-react";

const ProfileDrawer = () => {
    const { selectedUser, isProfileOpen, closeProfile } = useChatStore();
    const { authUser, blockUser, unblockUser } = useAuthStore();

    if (!isProfileOpen || !selectedUser) return null;

    const isBlocked = authUser.blockedUsers.includes(selectedUser._id);

    const handleBlockUnblock = async () => {
        if (isBlocked) {
            await unblockUser(selectedUser._id);
        } else {
            await blockUser(selectedUser._id);
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-50">Profile</h2>
                    <button
                        onClick={closeProfile}
                        className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* User Info */}
                <div className="flex flex-col items-center">
                    <img
                        src={selectedUser.profilePic || "/avatar.png"}
                        alt={selectedUser.fullName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 ring-2 ring-slate-700"
                    />
                    <h3 className="mt-4 text-lg font-semibold text-slate-50">{selectedUser.fullName}</h3>
                    <p className="text-sm text-slate-400">
                        {selectedUser.online ? "Online" : "Offline"}
                    </p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="text-sm text-slate-400 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            About
                        </div>
                        <p className="text-slate-50 text-sm leading-relaxed">
                            {selectedUser.about || "Hey there! I am using Chatty."}
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <div className="text-sm text-slate-400 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </div>
                        <p className="text-slate-50 text-sm">{selectedUser.email}</p>
                    </div>

                    <div className="space-y-1.5">
                        <div className="text-sm text-slate-400 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Member Since
                        </div>
                        <p className="text-slate-50 text-sm">
                            {selectedUser.createdAt?.split("T")[0]}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-slate-800">
                    <button
                        onClick={handleBlockUnblock}
                        className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${isBlocked
                                ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                                : "bg-red-500/10 hover:bg-red-500/20 text-red-500"
                            }`}
                    >
                        {isBlocked ? (
                            <>
                                <Unlock size={18} />
                                Unblock User
                            </>
                        ) : (
                            <>
                                <Ban size={18} />
                                Block User
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileDrawer;
