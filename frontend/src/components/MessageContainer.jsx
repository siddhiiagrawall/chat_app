import React from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector } from "react-redux";

import { IoSearchSharp } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

const MessageContainer = ({ onProfileClick }) => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);

    // Convert both to strings for comparison
    const isOnline = onlineUsers?.some(id => String(id) === String(selectedUser?._id));

    // Format last seen time
    const formatLastSeen = (lastSeen) => {
        if (!lastSeen) return 'Offline';

        const date = new Date(lastSeen);
        // Check if date is valid
        if (isNaN(date.getTime())) return 'Offline';

        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Last seen just now';
        if (diffMins < 60) return `Last seen ${diffMins}m ago`;
        if (diffHours < 24) return `Last seen ${diffHours}h ago`;
        if (diffDays === 1) return 'Last seen yesterday';
        return `Last seen ${date.toLocaleDateString()}`;
    };

    return (
        <div className='flex-1 flex flex-col h-full bg-gray-900 text-gray-200'>
            {
                selectedUser !== null ? (
                    <div className='flex flex-col h-full'>
                        {/* Chat Header */}
                        <div className='flex gap-4 items-center bg-gray-800 px-4 py-2 border-b border-gray-700 min-h-[64px] justify-between cursor-pointer' onClick={onProfileClick}>
                            <div className="flex gap-4 items-center flex-1">
                                <div className='relative'>
                                    <div className='avatar'>
                                        <div className='w-10 rounded-full ring-2 ring-gray-700'>
                                            <img src={selectedUser?.profilePhoto} alt="user-profile" />
                                        </div>
                                    </div>
                                    {isOnline && (
                                        <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800'></span>
                                    )}
                                </div>
                                <div className='flex flex-col flex-1'>
                                    <div className='flex justify-between gap-2'>
                                        <p className='text-base font-medium text-gray-100'>{selectedUser?.fullName}</p>
                                    </div>
                                    <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                                        {isOnline ? 'Online' : formatLastSeen(selectedUser?.lastSeen)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400">
                                <IoSearchSharp className="w-5 h-5 cursor-pointer hover:text-gray-200" />
                                <BsThreeDotsVertical className="w-5 h-5 cursor-pointer hover:text-gray-200" />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className='flex-1 overflow-y-auto custom-scrollbar p-4 bg-gray-900'>
                            <Messages />
                        </div>

                        {/* Input Area */}
                        <div className='p-4 bg-gray-900 border-t border-gray-800'>
                            <SendInput />
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center h-full text-center p-6 bg-gray-900'>
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-4xl">👋</div>
                            <h1 className='text-2xl font-bold text-gray-200'>Welcome, {authUser?.fullName}</h1>
                            <p className='text-gray-500 max-w-md'>Select a conversation from the sidebar to start chatting.</p>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default MessageContainer