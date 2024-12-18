import "./chatInfo.css";
import UserInfo from "./UserInfo";
import ChatList from "./ChatList";

const ChatInfo = () => {
  return (
    <div className="chatInfo">
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default ChatInfo;
