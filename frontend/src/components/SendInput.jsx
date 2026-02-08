import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile, BsPlus } from "react-icons/bs";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser?._id}`, { message }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            dispatch(setMessages([...messages, res?.data?.newMessage]))
        } catch (error) {
            console.log(error);
        }
        setMessage("");
    }
    return (
        <form onSubmit={onSubmitHandler} className='px-4 my-2 w-full'>
            <div className='w-full relative flex items-center gap-4'>
                <div className='flex gap-2 text-gray-400'>
                    <BsPlus className='w-7 h-7 cursor-pointer hover:text-gray-200' />
                    <BsEmojiSmile className='w-6 h-6 cursor-pointer hover:text-gray-200' />
                </div>
                <div className='w-full relative'>
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder='Type a message'
                        className='border-none text-sm rounded-lg block w-full p-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-0'
                    />
                    <button type="submit" className='absolute inset-y-0 end-0 flex items-center pr-3'>
                        <IoSend className='text-gray-400 hover:text-white' />
                    </button>
                </div>
            </div>
        </form>
    )
}

export default SendInput