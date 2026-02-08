import React, { useRef, useEffect } from 'react'
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from "react-redux";
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
    useGetMessages();
    useGetRealTimeMessage();
    const { messages } = useSelector(store => store.message);
    const lastMessageRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    const getDateLabel = (dateString) => {
        const messageDate = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) return "Today";
        if (messageDate.toDateString() === yesterday.toDateString()) return "Yesterday";
        return messageDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className='flex flex-col gap-4 pb-4'>
            {
                messages && messages?.map((message, index) => {
                    const currentMessageDate = new Date(message.createdAt).toDateString();
                    const prevMessageDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
                    const showDateSeparator = currentMessageDate !== prevMessageDate;

                    return (
                        <div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
                            {showDateSeparator && (
                                <div className="divider text-xs opacity-50 my-4 uppercase tracking-wider font-medium">
                                    {getDateLabel(message.createdAt)}
                                </div>
                            )}
                            <Message message={message} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Messages