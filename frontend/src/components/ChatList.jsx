import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Search } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const ChatList = () => {
    const {
        getUsers,
        users,
        selectedUser,
        setSelectedUser,
        isUsersLoading,
        getConversations,
        conversations,
        activeSidebarItem, // Get from store
    } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Determine if we are viewing messages or contacts based on activeSidebarItem
    const isMessagesView = activeSidebarItem === "messages";
    const isContactsView = activeSidebarItem === "contacts";

    useEffect(() => {
        if (isContactsView) {
            getUsers();
        } else if (isMessagesView) {
            getConversations();
        }
    }, [activeSidebarItem, getUsers, getConversations, isContactsView, isMessagesView]);

    const filterUsers = (list) => {
        return list
            .filter((item) => {
                const user = item._id ? item : item.user;
                if (showOnlineOnly && !onlineUsers.includes(user._id)) return false;
                if (searchQuery && !user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return true;
            });
    };

    const filteredList = isContactsView ? filterUsers(users) : filterUsers(conversations);

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full transition-all duration-200 ease-in-out">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-100">
                        {isMessagesView ? "Messages" : "Contacts"}
                    </h2>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="search"
                        placeholder={isMessagesView ? "Search conversations..." : "Search contacts..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-50 placeholder-slate-400 border border-slate-700 focus:border-green-500 focus:outline-none transition-colors"
                    />
                </div>

                {/* Online filter toggle - Only for Contacts view typically, but user requested for both? 
                   User requirement: "Online/offline indicator" for contacts. 
                   Let's keep it for both as it's useful.
                */}
                <label className="cursor-pointer flex items-center gap-2 text-xs">
                    <input
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-green-500 focus:ring-green-500 focus:ring-2"
                    />
                    <span className="text-slate-400">Show online only</span>
                </label>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto chat-scrollbar">
                {filteredList.map((item) => {
                    const user = item;
                    return (
                        <button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`
                w-full p-3 flex items-center gap-3
                hover:bg-slate-800/50 transition-colors
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
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-slate-900" />
                                )}
                            </div>

                            <div className="flex-1 text-left min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <span className="text-sm font-medium text-slate-50 truncate">{user.fullName}</span>
                                    {isMessagesView && user.lastMessageTime && (
                                        <span className="text-[10px] text-slate-500">
                                            {new Date(user.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>

                                {isMessagesView ? (
                                    <p className="text-xs text-slate-400 truncate">
                                        {user.lastMessage || <span className="italic text-slate-500">No messages yet</span>}
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-400">
                                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}

                {filteredList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                        <p className="text-slate-500 text-sm">
                            {searchQuery
                                ? "No matches found"
                                : isMessagesView
                                    ? "No recent conversations"
                                    : "No contacts found"}
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default ChatList;
