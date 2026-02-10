import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Search } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const ChatList = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filteredUsers = users
        .filter((user) => (showOnlineOnly ? onlineUsers.includes(user._id) : true))
        .filter((user) => user.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
            {/* Search Header */}
            <div className="p-4 border-b border-slate-800 space-y-3">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search or start new chat"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-50 placeholder-slate-400 border border-slate-700 focus:border-green-500 focus:outline-none transition-colors"
                    />
                </div>

                {/* Online filter toggle */}
                <label className="cursor-pointer flex items-center gap-2 text-xs">
                    <input
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-green-500 focus:ring-green-500 focus:ring-2"
                    />
                    <span className="text-slate-400">Show online only</span>
                </label>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto chat-scrollbar">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`
              w-full p-3 flex items-center gap-3
              hover:bg-slate-800 transition-colors
              ${selectedUser?._id === user._id ? "bg-slate-800 border-l-4 border-green-500" : "border-l-4 border-transparent"}
            `}
                    >
                        <div className="relative flex-shrink-0">
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.fullName}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-slate-900"
                                />
                            )}
                        </div>

                        {/* User info */}
                        <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-medium text-slate-50 truncate">{user.fullName}</div>
                            <div className="text-xs text-slate-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-slate-500 py-8 text-sm">
                        {searchQuery ? "No chats found" : "No users found"}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default ChatList;
