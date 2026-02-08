import React from 'react'
import { IoChatbubbleEllipsesOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDonutLarge } from "react-icons/md";
import { useSelector } from "react-redux";

const LeftIconBar = ({ onProfileClick, activeView, onViewChange }) => {
    const { authUser } = useSelector(store => store.user);

    return (
        <div className='w-16 bg-gray-800 h-full flex flex-col items-center py-3 border-r border-gray-700'>
            {/* App Logo */}
            <div className='mb-6'>
                <div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                    C
                </div>
            </div>

            {/* Navigation Icons */}
            <div className='flex flex-col gap-4 flex-1'>
                {/* Chat Icon */}
                <button
                    onClick={() => onViewChange('chats')}
                    className={`p-3 rounded-xl transition-colors ${activeView === 'chats' ? 'bg-gray-700 text-green-500' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                    title="Chats"
                >
                    <IoChatbubbleEllipsesOutline className='w-6 h-6' />
                </button>

                {/* Status Icon */}
                <button
                    onClick={() => onViewChange('status')}
                    className={`p-3 rounded-xl transition-colors ${activeView === 'status' ? 'bg-gray-700 text-green-500' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                    title="Status (Coming Soon)"
                >
                    <MdOutlineDonutLarge className='w-6 h-6' />
                </button>

                {/* Settings Icon */}
                <button
                    onClick={() => onViewChange('settings')}
                    className={`p-3 rounded-xl transition-colors ${activeView === 'settings' ? 'bg-gray-700 text-green-500' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                    title="Settings"
                >
                    <IoSettingsOutline className='w-6 h-6' />
                </button>
            </div>

            {/* Profile Avatar at Bottom */}
            <div className='mt-auto'>
                <button
                    onClick={onProfileClick}
                    className='avatar hover:opacity-80 transition-opacity'
                    title="My Profile"
                >
                    <div className='w-10 rounded-full ring-2 ring-gray-600 hover:ring-green-500 transition-all'>
                        <img src={authUser?.profilePhoto} alt="My Profile" />
                    </div>
                </button>
            </div>
        </div>
    )
}

export default LeftIconBar
