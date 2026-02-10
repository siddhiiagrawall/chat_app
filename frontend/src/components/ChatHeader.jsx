import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="h-16 bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="avatar">
          <div className="size-10 rounded-full relative">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        {/* User info */}
        <div>
          <h3 className="text-base font-semibold text-slate-50">{selectedUser.fullName}</h3>
          <p className="text-xs text-slate-400">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="hover:bg-slate-700 rounded-full p-2 transition-colors text-slate-400 hover:text-slate-300"
      >
        <X size={20} />
      </button>
    </div>
  );
};
export default ChatHeader;