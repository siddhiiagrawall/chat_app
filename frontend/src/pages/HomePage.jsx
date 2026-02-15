import { useChatStore } from "../store/useChatStore";

import IconBar from "../components/IconBar";
import ChatList from "../components/ChatList";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import ProfileDrawer from "../components/ProfileDrawer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden">
      <IconBar />
      <ChatList />
      <div className="flex-1 flex overflow-hidden relative">
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        <ProfileDrawer />
      </div>
    </div>
  );
};
export default HomePage;