import React, { useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import OtherUsers from './OtherUsers';
import DropdownMenu from './DropdownMenu';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const Sidebar = ({ onOpenProfile }) => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { otherUsers } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    }
  }

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const conversationUser = otherUsers?.find((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));
    if (conversationUser) {
      dispatch(setOtherUsers([conversationUser]));
    } else {
      toast.error("User not found!");
    }
  }

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'favourites', label: 'Favourites' },
    { id: 'groups', label: 'Groups' },
  ];

  return (
    <div className='border-r border-slate-700 flex flex-col w-80 h-full bg-gray-900'>
      {/* Header: Title + Icons */}
      <div className='flex items-center justify-between p-4 bg-gray-800 border-b border-slate-700 min-h-[64px]'>
        <h1 className='text-xl font-bold text-gray-100'>Chats</h1>
        <div className='flex items-center gap-2'>
          <button className='p-2 hover:bg-gray-700 rounded-full transition-colors' title="New Chat">
            <BsFillChatLeftTextFill className='w-5 h-5 text-gray-400 hover:text-gray-200' />
          </button>
          <DropdownMenu onLogout={logoutHandler} onOpenProfile={onOpenProfile} />
        </div>
      </div>

      {/* Search Bar */}
      <div className='p-2 bg-gray-900'>
        <form onSubmit={searchSubmitHandler}>
          <label className="input input-bordered flex items-center gap-2 rounded-lg bg-gray-800 border-none h-9 px-4 focus-within:ring-0 focus-within:bg-gray-700 transition-colors">
            <button type='submit' className='min-h-0 h-auto p-0 hover:bg-transparent'>
              <IoSearchSharp className='w-5 h-5 text-gray-400' />
            </button>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="grow bg-transparent placeholder-gray-500 text-sm text-gray-200"
              placeholder="Search or start new chat"
            />
          </label>
        </form>
      </div>

      {/* Filter Pills */}
      <div className='flex gap-2 px-3 py-2 overflow-x-auto'>
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${activeFilter === filter.id
              ? 'bg-green-500 text-black font-medium'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="divider my-0 h-px bg-slate-800"></div>

      {/* Conversation List */}
      <div className='flex-1 overflow-y-auto custom-scrollbar'>
        <OtherUsers />
      </div>
    </div>
        {/* TODO: Online filter toggle */ }
  <div className="mt-3 hidden lg:flex items-center gap-2">
    <label className="cursor-pointer flex items-center gap-2">
      <input
        type="checkbox"
        checked={showOnlineOnly}
        onChange={(e) => setShowOnlineOnly(e.target.checked)}
        className="checkbox checkbox-sm"
      />
      <span className="text-sm">Show online only</span>
    </label>
    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
  </div>
      </div >

  <div className="overflow-y-auto w-full py-3">
    {filteredUsers.map((user) => (
      <button
        key={user._id}
        onClick={() => setSelectedUser(user)}
        className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
      >
        <div className="relative mx-auto lg:mx-0">
          <img
            src={user.profilePic || "/avatar.png"}
            alt={user.name}
            className="size-12 object-cover rounded-full"
          />
          {onlineUsers.includes(user._id) && (
            <span
              className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
            />
          )}
        </div>

        {/* User info - only visible on larger screens */}
        <div className="hidden lg:block text-left min-w-0">
          <div className="font-medium truncate">{user.fullName}</div>
          <div className="text-sm text-zinc-400">
            {onlineUsers.includes(user._id) ? "Online" : "Offline"}
          </div>
        </div>
      </button>
    ))}

    {filteredUsers.length === 0 && (
      <div className="text-center text-zinc-500 py-4">No online users</div>
    )}
  </div>
    </aside >
  );
};
export default Sidebar;