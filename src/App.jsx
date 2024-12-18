import { useEffect } from "react";
import MainChat from "./components/mainChat/mainChat";
import ChatDetail from "./components/chatDetail/ChatDetail";
import ChatInfo from "./components/chatInfo/ChatInfo";
import LoginRegister from "./components/loginRegister/LoginRegister";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "./lib/userStore";
import { auth } from "./lib/firebase";
import { useChatStore } from "./lib/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  console.log(currentUser);

  if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <div className="container">
      {currentUser ? (
        <>
          <ChatInfo />
          {chatId && <MainChat />}
          {chatId && <ChatDetail />}
        </>
      ) : (
        <LoginRegister />
      )}
      <Notification />
    </div>
  );
};

export default App;
