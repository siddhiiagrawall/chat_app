import React from 'react'
import { useSelector } from "react-redux";
import { BsCheckAll } from "react-icons/bs";

const Message = ({ message }) => {
    // Scroll handling is now done in the parent Messages component
    const { authUser, selectedUser } = useSelector(store => store.user);
    const isMe = message?.senderId === authUser?._id;

    const formattedTime = new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="user avatar" src={isMe ? authUser?.profilePhoto : selectedUser?.profilePhoto} />
                </div>
            </div>
            <div className="chat-header mb-1">
                <time className="text-xs opacity-50 text-gray-400">
                    {formattedTime}
                </time>
            </div>
            <div className={`chat-bubble ${isMe ? 'bg-[#005c4b] text-[#e9edef]' : 'bg-[#202c33] text-[#e9edef]'} shadow-sm relative px-3 py-1 bg-opacity-100 rounded-lg max-w-[65%] lg:max-w-[50%] pb-6`}>
                <div className="flex flex-col relative z-20 break-words text-sm">
                    <span className="mb-1 leading-relaxed">{message?.message}</span>
                </div>
                <div className="absolute bottom-1 right-2 flex items-end gap-1">
                    <time className="text-[11px] text-gray-400 min-w-fit">
                        {formattedTime}
                    </time>
                    {isMe && (
                        <span className="text-[#53bdeb]"><BsCheckAll size={16} /></span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Message