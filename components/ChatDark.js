import React, { useState, useEffect, useRef, useContext } from "react";
import { XIcon, PaperAirplaneIcon } from "@heroicons/react/solid";
import { FormControl, InputLabel, Input } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import ChatEmojiPopper from "./ChatEmojiPopper";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import AppContext from "../components/AppContext";
import {
  collection,
  query,
  orderBy,
  doc,
  getDocs,
  updateDoc,
  addDoc,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db, serverTimestamp } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { format } from "timeago.js";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
const chatBoxVariants = {
  hidden: {
    x: "30vw",
    opacity: 0,
  },
  visible: {
    x: 0,
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
  const { data } = useSession();
  let session = data;
  //get required stuff from context
  const { changeBG, profileImg, userName, setIsGuest, guestSession } =
    useContext(AppContext);
  if (!session) {
    console.log("changing session...");
    session = guestSession;
  }

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    // {
    //   text: "sup steven!",
    //   sender: "kokgabriel@gmail.com"
    //  senderImg: ""
    //   timestamp: ""
    //   messageId: ""
    //
    // },
  ]);
  const [expand, setExpand] = useState(false);
  const [messageId, setMessageId] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  //get all messages between current user and this guy's email
  async function getMessages(email) {
    // // console.log("getting messages!");
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
    // // console.log("first load");
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
        senderImg: profileImg
          ? profileImg
          : session.user.image
          ? session.user.image
          : "/images/guest-icon.png",
        text: input,
        timestamp: serverTimestamp(),
      });
      const docRef = doc(db, `chats/${messageId}`);
      await updateDoc(docRef, { newMessages: true });
    }

    getMessages(recieverInfo.email);
  }

  async function readMessage() {
    if (newMessages) {
      //set the 'newMessage' status of the chat to False
      const docRef = doc(db, `chats/${messageId}`);
      await updateDoc(docRef, { newMessages: false });
    } else {
      console.log("Clicked message where user was sender");
    }
  }
  function newMessages() {
    //returns true if the last message was sent by the other guy, not the current user
    return messages[messages.length - 1].sender !== session.user.email;
  }

  return (
    <motion.div
      className={`absolute right-16 bottom-0 ${
        expand ? "w-96 h-[600px]" : "w-72 h-96 "
      } bg-black/20 backdrop-blur-lg rounded-lg border-2 border-b-2 border-slate-200 `}
      variants={chatBoxVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      drag
    >
      {/* ------- HEADER ------ */}
      <div className="border-b-2 flex justify-between p-1 !w-full">
        <div className="min-w-[45px] mr-2">
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
        <div className="text-lg font-semibold text-white">
          {recieverInfo.userName}
        </div>

        <div className="flex gap-x-0">
          <div className="h-7 w-7">
            {expand ? (
              <CloseFullscreenIcon
                className="text-blue-500 cursor-pointer rounded-full hover:bg-slate-200 p-1 "
                onClick={() => setExpand(!expand)}
              ></CloseFullscreenIcon>
            ) : (
              <OpenInFullIcon
                className="text-blue-500 cursor-pointer rounded-full hover:bg-slate-200 p-1 "
                onClick={() => setExpand(!expand)}
              ></OpenInFullIcon>
            )}
          </div>
          <div className="h-7 w-7">
            <XIcon
              className="text-blue-500 cursor-pointer rounded-full hover:bg-slate-200 p-1"
              onClick={() => setIsChatOpen(false)}
            ></XIcon>
          </div>
        </div>
      </div>

      {/* --------chat messages------  */}
      {messages.length > 0 ? (
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
                    <div className="flex flex-col max-w-[70%]">
                      <div className="text-white  bg-blue-600 rounded-2xl p-2 py-1 ">
                        {text}
                      </div>
                      <div className="text-white text-xs text-right">
                        {format(timestamp?.toDate().toLocaleString())}
                      </div>
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
                    <div className="flex flex-col max-w-[70%]">
                      <div className=" text-white bg-slate-600 rounded-2xl p-2 py-1 ">
                        {text}
                      </div>
                      <div className="text-white text-xs text-left">
                        {format(timestamp?.toDate().toLocaleString())}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="h-4/6  overflow-y-auto overflow-x-hidden grid place-items-center text-white">
          <div className="grid place-items-center gap-y-4">
            <img
              className="h-24 w-24 rounded-full "
              src={recieverInfo.profileImg}
              alt=""
            />
            <div>Say hi to {recieverInfo.userName}!</div>
          </div>
        </div>
      )}
      {/* //? -----------input ------------------ */}
      <form className="absolute bottom-2 left-4 w-11/12 px-2">
        <FormControl
          fullWidth={true}
          sx={{
            // bgcolor: "black",
            boxShadow: 1,
            borderRadius: 2,
            // border: "1px solid white",
            minWidth: 270,
            color: "white",
            // border: "1px solid white",
          }}
        >
          <InputLabel sx={{ color: "white" }}>Enter a message...</InputLabel>
          <Input
            sx={{ color: "white" }}
            type="text"
            placeholder="type something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClick={readMessage}
            // multiline={true}
            // maxRows={4}
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
      <div className="absolute -left-2 bottom-6">
        <ChatEmojiPopper input={input} setInput={setInput} />
      </div>
    </motion.div>
  );
};

export default Chat;
