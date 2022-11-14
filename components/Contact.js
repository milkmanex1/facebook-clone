import React, { useEffect, useState } from "react";
import Image from "next/image";
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
import { motion, AnimatePresence, useAnimation } from "framer-motion";

const contactVariants = {
  tap: { scale: 0.9 },
  hover: {},
};
const bellVariants = {
  animate: {
    //rotate: [0, 5, -5, 5, -5, 0],
    scale: [1, 0.9, 1.1, 0.9, 1.1, 1],
    transition: { duration: 0.5, repeat: 2, type: "spring" },
  },
  hover: {
    scale: [1, 0.9, 1.1, 0.9, 1.1, 1],
    transition: { duration: 0.5, repeat: 2, type: "spring" },
  },
  initial: {
    x: 0,
  },
};
const Contact = ({
  src,
  name,
  email,
  isThereNewMessages,
  readNewMessages,
  openChat,
}) => {
  const { data: session, status } = useSession();
  const [isHovered, setIsHovered] = useState(true);
  const [showBell, setShowBell] = useState(false);

  useEffect(() => {
    setShowBell(isThereNewMessages(email));
    // console.log(
    //   `Are there new messages between ${email} and ${
    //     session.user.email
    //   }? ${isThereNewMessages(email)}!`
    // );
  }, []);

  async function updateBell(email) {
    await readNewMessages(email);
    setShowBell(false);
  }
  return (
    <motion.div
      onClick={() => {
        openChat(src, name, email);
        //if user click on any chat with bell icons, update db--->no more new messages
        if (isThereNewMessages(email)) {
          updateBell(email);
        }

        console.log(`showBell is now: ${showBell}`);
      }}
      variants={contactVariants}
      whileTap="tap"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      key={email}
      className="flex items-center space-x-3 mb-2 relative border-transparent border-2 hover:border-slate-100 hover:border-2 hover:bg-white/20 cursor-pointer p-2 rounded-xl active:bg-blue-500"
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

      {showBell && (
        <motion.div
          variants={bellVariants}
          initial="animate"
          animate={isHovered ? "hover" : "initial"}
        >
          <NotificationsActiveIcon className="text-red-500"></NotificationsActiveIcon>
        </motion.div>
      )}
      <div className="absolute bottom-2 left-7 bg-green-400 h-3 w-3 rounded-full "></div>
    </motion.div>
  );
};

export default Contact;
