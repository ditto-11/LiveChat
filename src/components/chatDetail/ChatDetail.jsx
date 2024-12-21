import "./chatDetail.css";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import {
  updateDoc,
  doc,
  arrayRemove,
  arrayUnion,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { useState, useEffect } from "react";

const ChatDetail = () => {
  const [settingOpen, setSettingOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [chatTheme, setChatTheme] = useState("blue");
  const [sharedPhotos, setSharedPhotos] = useState([]);

  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
  } = useChatStore();

  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!chatId) return;

    const chatDocRef = doc(db, "chats", chatId);

    const unsubscribe = onSnapshot(chatDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.data();
        setSharedPhotos(chatData.sharedPhotos || []);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

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
          <div className="title" onClick={() => setPhotoOpen(!photoOpen)}>
            <span>Shared Photo</span>
            <img src={photoOpen ? "./arrowUp.png" : "./arrowDown.png"} alt="" />
          </div>
          {photoOpen && (
            <div className="photos">
              {sharedPhotos.map((photo, index) => (
                <div className="photoItem" key={index}>
                  <div className="photoDetail">
                    <img src={photo} alt={`Shared Photo ${index + 1}`} />
                    <span>{`photo_${index + 1}.png`}</span>
                  </div>
                  <img src="./download.png" alt="Download" className="icon" />
                </div>
              ))}
            </div>
          )}
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
