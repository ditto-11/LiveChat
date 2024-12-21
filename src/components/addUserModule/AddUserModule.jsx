import "./addUserModule.css";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUserStore } from "../../lib/userStore";

const AddUserModule = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const currentUserChatsRef = doc(db, "userchats", currentUser.id);
    const receiverChatsRef = doc(db, "userchats", user.id);

    try {
      const newChatRef = doc(chatRef);

      const currentUserChatsSnap = await getDoc(currentUserChatsRef);
      const currentUserChats = currentUserChatsSnap.exists()
        ? currentUserChatsSnap.data().chats || []
        : [];

      const isAlreadyInChat = currentUserChats.some(
        (chat) => chat.receiverId === user.id
      );

      if (isAlreadyInChat) {
        toast.error("User has already in chat list.");
        return;
      }

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
        sharedPhotos: [],
      });

      await updateDoc(currentUserChatsRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessages: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(receiverChatsRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessages: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUserModule">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUserModule;
