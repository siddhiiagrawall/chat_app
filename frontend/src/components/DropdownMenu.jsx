import React, { useState, useRef, useEffect } from 'react'
import { BsThreeDotsVertical, BsPeople } from "react-icons/bs";
import { IoPersonOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";

const DropdownMenu = ({ onLogout, onOpenProfile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = (action) => {
        setIsOpen(false);
        action();
    };

    return (
        <div className='relative' ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='p-2 hover:bg-gray-700 rounded-full transition-colors'
            >
                <BsThreeDotsVertical className='w-5 h-5 text-gray-400 hover:text-gray-200' />
            </button>

            {isOpen && (
                <div className='absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50'>
                    <button
                        onClick={() => handleItemClick(() => { })}
                        className='w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 transition-colors'
                    >
                        <BsPeople className='w-5 h-5' />
                        <span>New Group</span>
                    </button>

                    <button
                        onClick={() => handleItemClick(onOpenProfile)}
                        className='w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 transition-colors'
                    >
                        <IoPersonOutline className='w-5 h-5' />
                        <span>My Profile</span>
                    </button>

                    <button
                        onClick={() => handleItemClick(() => { })}
                        className='w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700 transition-colors'
                    >
                        <IoSettingsOutline className='w-5 h-5' />
                        <span>Settings</span>
                    </button>

                    <div className='border-t border-gray-700 my-2' />

                    <button
                        onClick={() => handleItemClick(onLogout)}
                        className='w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700 transition-colors'
                    >
                        <IoLogOutOutline className='w-5 h-5' />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default DropdownMenu
