import React, { useState, useEffect, useRef, useContext } from "react";
import { XIcon, PaperAirplaneIcon } from "@heroicons/react/solid";
import { FormControl, InputLabel, Input } from "@mui/material";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import AppContext from "../components/AppContext";
import {
  collection,
  query,
  orderBy,
  doc,
  getDocs,
  addDoc,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db, serverTimestamp } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { motion } from "framer-motion";

const messageVariants = {
  hidden: {
    opacity: 1,
    scale: 0.1,
  },
  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      //   duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { ease: "easeInOut" },
  },
};

const Chat = ({ setIsChatOpen, recieverInfo }) => {
  const { data: session, status } = useSession();

  const { profileImg, userName } = useContext(AppContext);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    // {
    //   text: "sup steven!",
    //   sender: "kokgabriel@gmail.com"
    //  senderImg: ""
    //   timestamp: ""
    //   messageId: ""
    // },
  ]);
  const [messageId, setMessageId] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  //get all messages between current user and this guy's email
  async function getMessages(email) {
    console.log("getting messages!");
    let id;
    const colRef1 = collection(db, "chats");
    //-----------find the id of that chat--------------------
    const q1 = query(
      colRef1,
      where("users", "array-contains", session.user.email)
    );
    const querySnapshot = await getDocs(q1);
    querySnapshot.forEach((doc) => {
      if (doc.data().users.includes(email)) {
        id = doc.id;
      }
    });
    // console.log(id);
    setMessageId(id);

    //-------------get the messages------------
    const colRef2 = collection(db, `chats/${id}/messages`);
    const q2 = query(colRef2, orderBy("timestamp", "asc"));
    onSnapshot(q2, (snapshot) => {
      let tempMessages = [];
      snapshot.forEach((doc) => {
        // console.log(doc.data());
        tempMessages.push({ ...doc.data(), messageId: doc.id });
      });
      setMessages(tempMessages);
    });
  }

  useEffect(() => {
    //pull messages on load
    console.log("first load");
    getMessages(recieverInfo.email);
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function sendMessage(e) {
    console.log("sending message...");
    e.preventDefault();
    setInput("");
    if (messageId && input) {
      const colRef = collection(db, `chats/${messageId}/messages`);
      await addDoc(colRef, {
        sender: session.user.email,
        senderImg: profileImg ? profileImg : session.user.image,
        text: input,
        timestamp: serverTimestamp(),
      });
    }

    getMessages(recieverInfo.email);
  }

  return (
    <div className="absolute right-16 bottom-0 h-96 w-72 bg-white rounded-t-lg">
      {/* ------- HEADER ------ */}
      <div className="border-b-2 flex justify-between p-1 !w-full">
        <div>
          <Link
            href={{
              pathname: "/profile",
              query: {
                email: recieverInfo.email,
                userName: recieverInfo.userName,
              },
            }}
          >
            <a>
              <img
                className="h-9 w-9 rounded-full cursor-pointer"
                src={recieverInfo.profileImg}
                alt=""
              />
            </a>
          </Link>
        </div>
        <div className="text-lg font-semibold">{recieverInfo.userName}</div>
        <div className="h-7 w-7">
          <XIcon
            className="text-blue-500 cursor-pointer rounded-full hover:bg-slate-200 p-1"
            onClick={() => setIsChatOpen(false)}
          ></XIcon>
        </div>
      </div>
      {/* --------chat messages------  */}
      <div className="h-4/6  overflow-y-auto overflow-x-hidden flex flex-col">
        {messages.map((message) => {
          const { text, sender, senderImg, timestamp, messageId } = message;

          return (
            //  ---- single message-------
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key={messageId}
              ref={messagesEndRef}
            >
              {sender === session.user.email ? (
                <div className="flex gap-x-2 p-2 justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl p-2 py-1 max-w-[70%]">
                    {text}
                  </div>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={senderImg}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex gap-x-2 p-2">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={senderImg}
                    alt=""
                  />
                  <div className="bg-slate-200 rounded-2xl p-2 py-1  max-w-[70%]">
                    {text}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      {/* //? -----------input ------------------ */}
      <form className="absolute bottom-2 w-full px-2">
        <FormControl fullWidth={true}>
          <InputLabel>Enter a message</InputLabel>
          <Input
            type="text"
            placeholder="type something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            multiline={true}
            maxRows={4}
          />
          <Button
            size="small"
            variant="contained"
            type="submit"
            onClick={sendMessage}
            disabled={!input}
          >
            Send Message
          </Button>
        </FormControl>
      </form>
    </div>
  );
};

export default Chat;
