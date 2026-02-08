import React from 'react'
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";

const RightPanel = ({ isOpen, onClose }) => {
    const { selectedUser, onlineUsers } = useSelector(store => store.user);
    const isOnline = onlineUsers?.some(id => String(id) === String(selectedUser?._id));

    if (!isOpen || !selectedUser) return null;

    return (
        <div className='w-[300px] border-l border-slate-700 bg-gray-900 h-full overflow-y-auto flex flex-col transition-all duration-300'>
            <div className='flex items-center gap-4 p-4 border-b border-gray-700 bg-gray-800'>
                <button onClick={onClose} className='hover:bg-gray-700 p-2 rounded-full transition-colors'>
                    <IoClose className='w-6 h-6 text-gray-400' />
                </button>
                <span className='font-medium text-gray-200'>Contact Info</span>
            </div>

            <div className='flex flex-col items-center p-8 border-b border-gray-800 animate-in fade-in duration-300'>
                <div className='avatar mb-4'>
                    <div className='w-40 rounded-full ring-4 ring-gray-800'>
                        <img src={selectedUser?.profilePhoto} alt="profile" />
                    </div>
                </div>
                <h2 className='text-2xl font-normal text-gray-100 mb-1'>{selectedUser?.fullName}</h2>
                <p className='text-lg text-gray-500 font-light'>~{selectedUser?.userName}</p>
            </div>

            <div className='p-4'>
                <div className='bg-gray-800/50 rounded-lg p-4 mb-4'>
                    <p className='text-sm text-gray-400 mb-1'>About</p>
                    <p className='text-gray-200'>Hey there! I am using Chat App.</p>
                </div>

                <div className='bg-gray-800/50 rounded-lg p-4'>
                    <p className='text-sm text-gray-400 mb-2'>Media, Links and Docs</p>
                    <div className='flex gap-2 overflow-hidden'>
                        <div className='w-20 h-20 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500'>No Media</div>
                        <div className='w-20 h-20 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500'>No Media</div>
                        <div className='w-20 h-20 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500'>No Media</div>
                    </div>
                </div>
            </div>

            <div className='mt-auto p-4 flex flex-col gap-2'>
                <div className='flex items-center gap-4 p-4 text-red-400 hover:bg-gray-800 cursor-pointer rounded-lg transition-colors'>
                    <span className='font-medium'>Block {selectedUser?.fullName}</span>
                </div>
                <div className='flex items-center gap-4 p-4 text-red-400 hover:bg-gray-800 cursor-pointer rounded-lg transition-colors'>
                    <span className='font-medium'>Report contact</span>
                </div>
            </div>

        </div>
    )
}

export default RightPanel
