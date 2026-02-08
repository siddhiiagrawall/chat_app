import React, { useEffect, useState } from 'react'
import LeftIconBar from './LeftIconBar'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import RightPanel from './RightPanel'
import MyProfilePanel from './MyProfilePanel'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { authUser } = useSelector(store => store.user);
  const navigate = useNavigate();

  // Panel state: 'contact' | 'myProfile' | null
  const [panelType, setPanelType] = useState(null);
  const [activeView, setActiveView] = useState('chats');

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  const openContactPanel = () => setPanelType('contact');
  const openMyProfilePanel = () => setPanelType('myProfile');
  const closePanel = () => setPanelType(null);

  return (
    <div className='flex h-screen w-full overflow-hidden bg-gray-900'>
      {/* Left Icon Bar (Navigation) */}
      <LeftIconBar
        onProfileClick={openMyProfilePanel}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Chat List */}
      <Sidebar onOpenProfile={openMyProfilePanel} />

      {/* Main Chat Area */}
      <MessageContainer onProfileClick={openContactPanel} />

      {/* Right Panels (conditional) */}
      <RightPanel isOpen={panelType === 'contact'} onClose={closePanel} />
      <MyProfilePanel isOpen={panelType === 'myProfile'} onClose={closePanel} />
    </div>
  )
}

export default HomePage