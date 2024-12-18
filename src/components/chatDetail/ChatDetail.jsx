import "./chatDetail.css";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { updateDoc, doc, arrayRemove, arrayUnion } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { useState } from "react";

const ChatDetail = () => {
  const [settingOpen, setSettingOpen] = useState(false);
  const [chatTheme, setChatTheme] = useState("blue");

  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
  } = useChatStore();

  const { currentUser } = useUserStore();
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  return (
    <div className="chatDetail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title" onClick={() => setSettingOpen(!settingOpen)}>
            <span>Chat Settings</span>
            <img
              src={settingOpen ? "./arrowUp.png" : "./arrowDown.png"}
              alt=""
            />
          </div>
          {settingOpen && (
            <div className="settings">
              <div
                className={`themeOption ${
                  chatTheme === "blue" ? "active" : ""
                }`}
              >
                <div className="circle blue"></div>
                <p>Blue</p>
              </div>
              <div
                className={`themeOption ${
                  chatTheme === "pink" ? "active" : ""
                }`}
              >
                <div className="circle pink"></div>
                <p>Pink</p>
              </div>
            </div>
          )}
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photo</span>
            <img src="./arrowUp.png" alt="" />
          </div>
          <div className="photos">
            {/* <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div> */}
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are blocked"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ChatDetail;
