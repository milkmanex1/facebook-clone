import React, { useEffect, useState } from "react";

import Chat from "./ChatDark";
import { SearchIcon } from "@heroicons/react/outline";
import { DotsHorizontalIcon, VideoCameraIcon } from "@heroicons/react/solid";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
  collection,
  query,
  orderBy,
  doc,
  getDocs,
  addDoc,
  onSnapshot,
  where,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db, serverTimestamp } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Contact from "./Contact";

const Contacts = () => {
  const { data: session, status } = useSession();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState([]);
  const [chats, setChats] = useState([]);
  const [newMessages, setnewMessages] = useState(false);

  //this object contains Reciever userName, profileImg and email. Will be passed into the Chat component
  const [recieverInfo, setRecieverInfo] = useState([]);

  function testing() {
    // console.log(chats[1].newMessages);
    const gotNewMsg = isThereNewMessages("aizensosuke233@gmail.com");
    console.log(gotNewMsg);
  }

  //get all chats(id, users, newMessages. Note: cant access messages) with current user from firebase
  async function getChats() {
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("users", "array-contains", session.user.email)
    );
    const querySnapshot = await getDocs(q);
    let tempChats = [];
    querySnapshot.forEach((doc) => {
      tempChats.push({ id: doc.id, ...doc.data() });
    });
    setChats(tempChats);
  }
  //check if this guy's email and current user has new messages. If have, return true
  function isThereNewMessages(email) {
    //get chat with this Email
    if (chats) {
      const thisChat = chats.find((chat) => {
        return (
          chat.users.includes(email) && chat.users.includes(session.user.email)
        );
      });
      if (thisChat?.newMessages) {
        return true;
      }
      return false;
    }
  }

  useEffect(() => {
    getChats();
  }, []);
  //   useEffect(() => {
  //     console.log(chats);
  //   }, [chats]);

  function chatExists(email) {
    return chats?.find(
      (chat) =>
        chat.users.includes(session.user.email) && chat.users.includes(email)
    );
  }

  function openChat(src, name, email) {
    if (isChatOpen) {
      setIsChatOpen(false);
      return;
    } else {
      setIsChatOpen(true);
      //is this Reciever Info necessary? To check...
      setRecieverInfo({
        userName: name,
        profileImg: src,
        email: email,
      });
      //if chat between current user and that guy doesnt exists
      if (!chatExists(email)) createNewChat(email);
    }
  }

  async function createNewChat(recieverEmail) {
    const docRef = await addDoc(collection(db, "chats"), {
      users: [session.user.email, recieverEmail],
    });
  }

  //pull all profiles(just userName and profileImg) from firebase
  async function getProfiles() {
    const colRef = collection(db, "profiles");
    const q = query(colRef);
    onSnapshot(q, (snapshot) => {
      let tempInfo = [];
      snapshot.forEach((doc) => {
        //only get those profiles with userName and profileImg
        if (doc.data().userName && doc.data().profileImg)
          tempInfo.push({
            userName: doc.data().userName,
            profileImg: doc.data().profileImg,
            email: doc.id,
          });
      });
      setProfileInfo(tempInfo);
    });
  }
  useEffect(() => {
    getProfiles();
  }, []);

  async function findChatId(email) {
    //returns the chat Id between this email and the current user
    let id;
    const colRef = collection(db, "chats");
    const q = query(
      colRef,
      where("users", "array-contains", session.user.email)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      if (doc.data().users.includes(email)) {
        id = doc.id;
      }
    });
    return id;
  }
  async function readNewMessages(email) {
    console.log("no more new messages..");
    const id = await findChatId(email);
    updateChat(id, false);
  }

  //   useEffect(() => {
  //     console.log(`profiles on the contact page: ${JSON.stringify(profileInfo)}`);
  //   }, [profileInfo]);

  //run thru each chat, checkForNewMessages, updateChat
  function checkAllChats() {
    chats.forEach((chat) => {
      const id = chat.id;
      const colRef = collection(db, `chats/${id}/messages`);
      const q = query(colRef, orderBy("timestamp", "asc"));
      onSnapshot(q, (snapshot) => {
        let tempMessages = [];
        snapshot.forEach((doc) => {
          // console.log(doc.data());
          tempMessages.push({ ...doc.data(), messageId: doc.id });
        });
        if (tempMessages.length > 0) {
          if (lastMessageByOtherGuy(tempMessages) && chat.newMessages == null) {
            updateChat(id, true);
          }
        }
      });
    });
  }

  function lastMessageByOtherGuy(messages) {
    //Returns true if last message was sent by another guy
    return messages[messages.length - 1]?.sender !== session.user.email;
  }
  async function updateChat(chatId, bool) {
    //update 'newMessage' status of the chat
    const docRef = doc(db, `chats/${chatId}`);
    await updateDoc(docRef, { newMessages: bool });
  }
  useEffect(() => {
    checkAllChats();
  }, [chats]);
  useEffect(() => {
    checkAllChats();
  }, []);
  return (
    <div className=" hidden sm:flex flex-col p-2 mt-5 h-3/4">
      <div className="flex justify-between items-center text-slate-200 mb-5">
        <h2 className="text-xl">Contacts</h2>
        <div className="hidden lg:flex space-x-2">
          <VideoCameraIcon className="h-6"></VideoCameraIcon>
          <SearchIcon onClick={testing} className="h-6"></SearchIcon>
          <DotsHorizontalIcon className="h-6"></DotsHorizontalIcon>
        </div>
      </div>
      <div className="h-[800px] max-h-[80vh] overflow-y-auto scrollbar-hide">
        {profileInfo.map((info, i) => {
          const src = info.profileImg;
          const name = info.userName;
          const email = info.email;

          if (email !== session.user.email)
            return (
              <Contact
                {...{
                  src,
                  name,
                  email,
                  isThereNewMessages,
                  readNewMessages,
                  openChat,
                }}
                key={i}
              ></Contact>
            );
        })}
      </div>
      <div className="">
        <AnimatePresence>
          {isChatOpen && (
            <Chat
              setIsChatOpen={setIsChatOpen}
              recieverInfo={recieverInfo}
            ></Chat>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Contacts;
