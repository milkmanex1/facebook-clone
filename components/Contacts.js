import React, { useEffect, useState } from "react";
import Image from "next/image";
import Chat from "./Chat";
import { SearchIcon } from "@heroicons/react/outline";
import { DotsHorizontalIcon, VideoCameraIcon } from "@heroicons/react/solid";
import {
  collection,
  query,
  orderBy,
  doc,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db, serverTimestamp } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

const Contacts = () => {
  const { data: session, status } = useSession();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState([]);

  //this object contains Reciever userName, profileImg and email. Will be passed into the Chat component
  const [recieverInfo, setRecieverInfo] = useState([]);

  //get chats from firebase
  const [snapshot, loading, error] = useCollection(collection(db, "chats"));
  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  function chatExists(email) {
    return chats?.find(
      (chat) =>
        chat.users.includes(session.user.email) && chat.users.includes(email)
    );
  }

  function openChat(src, name, email) {
    if (isChatOpen) {
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

  //   useEffect(() => {
  //     console.log(`profiles on the contact page: ${JSON.stringify(profileInfo)}`);
  //   }, [profileInfo]);

  return (
    <div className="hidden lg:flex flex-col w-60 p-2 mt-5 h-screen overflow-y-auto scrollbar-hide ">
      <div className="flex justify-between items-center text-slate-200 mb-5">
        <h2 className="text-xl">Contacts</h2>
        <div className="flex space-x-2">
          <VideoCameraIcon className="h-6"></VideoCameraIcon>
          <SearchIcon className="h-6"></SearchIcon>
          <DotsHorizontalIcon className="h-6"></DotsHorizontalIcon>
        </div>
      </div>
      {profileInfo.map((info, i) => {
        const src = info.profileImg;
        const name = info.userName;
        const email = info.email;

        if (email !== session.user.email)
          return (
            <div
              onClick={() => {
                openChat(src, name, email);
              }}
              key={i}
              className="flex items-center space-x-3 mb-2 relative border-transparent border-2 hover:border-slate-100 hover:border-2 hover:bg-white/20 cursor-pointer p-2 rounded-xl"
            >
              <Image
                className="rounded-full"
                objectFit="cover"
                src={src}
                width={50}
                height={50}
                layout="fixed"
              ></Image>
              <p className="text-slate-100">{name}</p>
              <div className="absolute bottom-2 left-7 bg-green-400 h-3 w-3 rounded-full "></div>
            </div>
          );
      })}
      {isChatOpen && (
        <Chat setIsChatOpen={setIsChatOpen} recieverInfo={recieverInfo}></Chat>
      )}
    </div>
  );
};

export default Contacts;
