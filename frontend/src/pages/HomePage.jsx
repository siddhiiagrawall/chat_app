import { useChatStore } from "../store/useChatStore";

import IconBar from "../components/IconBar";
import ChatList from "../components/ChatList";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden">
      <IconBar />
      <ChatList />
      {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
    </div>
  );
};
export default HomePage;