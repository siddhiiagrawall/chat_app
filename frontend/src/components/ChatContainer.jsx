import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Trash2, Check, CheckCheck } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    isTyping,
    markMessagesAsRead,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    markMessagesAsRead(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, markMessagesAsRead]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // Mark new messages as read if we are viewing this chat
    if (messages.length > 0) {
      markMessagesAsRead(selectedUser._id);
    }
  }, [messages, markMessagesAsRead, selectedUser._id]);

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(messageId);
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col bg-slate-700">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-700">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-6 space-y-3 chat-scrollbar">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              ref={messageEndRef}
              onMouseEnter={() => setHoveredMessageId(message._id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              <div className={`flex gap-2 max-w-[65%] ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      isOwnMessage
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="size-9 rounded-full object-cover"
                  />
                </div>

                {/* Message bubble */}
                <div className="flex flex-col">
                  <div
                    className={`rounded-2xl px-4 py-2.5 message-bubble relative group ${isOwnMessage
                      ? "bg-green-500 text-white"
                      : "bg-slate-600 text-slate-50"
                      }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-[200px] rounded-lg mb-2"
                      />
                    )}
                    {message.text && <p className="text-sm">{message.text}</p>}

                    <div className={`text-xs mt-1 flex items-center gap-1 ${isOwnMessage ? "text-green-100" : "text-slate-400"}`}>
                      {formatMessageTime(message.createdAt)}
                      {isOwnMessage && (
                        <span>
                          {message.read ? (
                            <CheckCheck size={14} className="text-blue-200" />
                          ) : (
                            <Check size={14} className="text-green-200" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Delete button - only show for own messages */}
                    {isOwnMessage && hoveredMessageId === message._id && (
                      <button
                        onClick={() => handleDeleteMessage(message._id)}
                        className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete message"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[65%]">
              <div className="flex-shrink-0">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt="profile pic"
                  className="size-9 rounded-full object-cover"
                />
              </div>
              <div className="bg-slate-600 rounded-2xl px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;