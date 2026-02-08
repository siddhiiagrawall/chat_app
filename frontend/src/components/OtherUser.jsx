import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const { selectedUser, onlineUsers } = useSelector(store => store.user);
    const isOnline = onlineUsers?.some(id => String(id) === String(user._id));
    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user));
    }
    return (
        <>
            <div onClick={() => selectedUserHandler(user)} className={` ${selectedUser?._id === user?._id ? 'bg-gray-800' : 'hover:bg-gray-800/50'} flex gap-3 items-center p-3 cursor-pointer transition-all duration-200 text-gray-300 rounded-lg group`}>
                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                    <div className='w-12 rounded-full ring-2 ring-gray-700'>
                        <img src={user?.profilePhoto} alt="user-profile" />
                    </div>
                </div>
                <div className='flex flex-col flex-1 min-w-0 border-b border-gray-800 pb-3 group-hover:border-transparent'>
                    <div className='flex justify-between gap-2 items-baseline'>
                        <p className='font-medium text-gray-200 truncate'>{user?.fullName}</p>
                        <span className='text-xs text-gray-500'>10:30 AM</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-500 truncate max-w-[140px]'>Hey! How are you doing today?</p>
                        {/* Dummy Badge */}
                        {/* <span className="badge badge-sm bg-green-500 text-black border-none font-bold">2</span> */}
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-px bg-slate-700/50 opacity-0'></div>
        </>
    )
}

export default OtherUser