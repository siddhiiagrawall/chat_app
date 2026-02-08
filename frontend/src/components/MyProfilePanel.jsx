import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { IoClose, IoCameraOutline } from "react-icons/io5";
import { BiLogOut, BiPencil, BiCheck } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const MyProfilePanel = ({ isOpen, onClose }) => {
    const { authUser } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [aboutText, setAboutText] = useState(authUser?.about || "Hey there! I am using Chat App.");
    const [previewImage, setPreviewImage] = useState(null);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
            navigate("/login");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
            toast.error("Logout failed");
        }
    }

    const handleSaveAbout = () => {
        // TODO: API call to save about text
        setIsEditingAbout(false);
        toast.success("About updated!");
    }

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    }

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload to server
            try {
                const formData = new FormData();
                formData.append('profilePhoto', file);

                const res = await axios.put(`${BASE_URL}/api/v1/user/upload-photo`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });

                // Update Redux state with new user data
                dispatch(setAuthUser(res.data.user));
                toast.success("Profile photo updated!");
            } catch (error) {
                console.error(error);
                toast.error("Failed to upload photo");
                setPreviewImage(null); // Reset preview on error
            }
        }
    }

    if (!isOpen) return null;

    // Get username - try both formats
    const username = authUser?.userName || authUser?.username || 'user';

    return (
        <div className='w-[320px] border-l border-slate-700 bg-gray-900 h-full overflow-y-auto flex flex-col'>
            {/* Header */}
            <div className='flex items-center gap-4 p-4 border-b border-gray-700 bg-gray-800 min-h-[64px]'>
                <button onClick={onClose} className='hover:bg-gray-700 p-2 rounded-full transition-colors'>
                    <IoClose className='w-6 h-6 text-gray-400' />
                </button>
                <span className='font-medium text-gray-200'>My Profile</span>
            </div>

            {/* Profile Photo */}
            <div className='flex flex-col items-center p-8 border-b border-gray-800'>
                <div className='relative mb-4'>
                    <div className='avatar'>
                        <div className='w-40 rounded-full ring-4 ring-gray-800 overflow-hidden'>
                            <img
                                src={previewImage || authUser?.profilePhoto}
                                alt="profile"
                                className='w-full h-full object-cover'
                            />
                        </div>
                    </div>
                    <button
                        onClick={handlePhotoClick}
                        className='absolute bottom-2 right-2 bg-green-500 p-3 rounded-full hover:bg-green-600 transition-colors shadow-lg'
                        title="Change photo"
                    >
                        <IoCameraOutline className='w-5 h-5 text-white' />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
                <h2 className='text-2xl font-normal text-gray-100 mb-1'>{authUser?.fullName || 'User'}</h2>
                <p className='text-base text-green-500 font-medium'>@{username}</p>
            </div>

            {/* About Section */}
            <div className='p-4 border-b border-gray-800'>
                <div className='flex items-center justify-between mb-2'>
                    <p className='text-sm text-gray-400'>About</p>
                    {!isEditingAbout ? (
                        <button
                            onClick={() => setIsEditingAbout(true)}
                            className='p-2 hover:bg-gray-800 rounded-full transition-colors'
                        >
                            <BiPencil className='w-5 h-5 text-gray-400 hover:text-green-500' />
                        </button>
                    ) : (
                        <button
                            onClick={handleSaveAbout}
                            className='p-2 hover:bg-gray-800 rounded-full transition-colors'
                        >
                            <BiCheck className='w-5 h-5 text-green-500' />
                        </button>
                    )}
                </div>
                {isEditingAbout ? (
                    <textarea
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        className='w-full bg-gray-800 text-gray-200 p-3 rounded-lg border-none focus:ring-2 focus:ring-green-500 resize-none'
                        rows={3}
                        autoFocus
                    />
                ) : (
                    <p className='text-gray-200'>{aboutText}</p>
                )}
            </div>

            {/* Name Section */}
            <div className='p-4 border-b border-gray-800'>
                <p className='text-sm text-gray-400 mb-2'>Name</p>
                <p className='text-gray-200'>{authUser?.fullName || 'Not set'}</p>
            </div>

            {/* Username Section */}
            <div className='p-4 border-b border-gray-800'>
                <p className='text-sm text-gray-400 mb-2'>Username</p>
                <p className='text-green-500 font-medium'>@{username}</p>
            </div>

            {/* Logout Button */}
            <div className='mt-auto p-4'>
                <button
                    onClick={logoutHandler}
                    className='w-full flex items-center justify-center gap-3 p-4 text-red-400 hover:bg-gray-800 cursor-pointer rounded-lg transition-colors border border-red-400/30'
                >
                    <BiLogOut className='w-5 h-5' />
                    <span className='font-medium'>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default MyProfilePanel

