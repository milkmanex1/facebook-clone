import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import AppContext from "../components/AppContext";
import { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "timeago.js";

import {
  collection,
  query,
  orderBy,
  doc,
  getDocs,
  getDoc,
  addDoc,
  onSnapshot,
  where,
  updateDoc,
} from "firebase/firestore";
import { db, serverTimestamp } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Router from "next/router";

const Notification = ({
  postId,
  seen,
  senderEmail,
  timestamp,
  type,
  notificationId,

  sender,
  senderImg,
  resultRef,
  index,
}) => {
  const { data } = useSession();
  let session = data;
  //get required stuff from context
  const {
    changeBG,
    profileImg,
    setProfileImg,
    userName,
    setUserName,
    setIsGuest,
    guestSession,
  } = useContext(AppContext);
  if (!session) {
    console.log("changing session...");
    session = guestSession;
  }

  //   async function getInfo(email) {
  //     //get profile image, username if they exist
  //     if (email) {
  //       const profileRef = doc(db, "profiles", email);
  //       const snap = await getDoc(profileRef);
  //       if (snap.exists()) {
  //         const newProfileImg = snap.data().profileImg;
  //         setProfileImg(newProfileImg);
  //         setUserName(snap.data().userName);
  //       }
  //     }
  //   }
  async function readNotification() {
    console.log("reading notification..");
    const docRef = doc(
      db,
      `profiles/${session.user.email}/notifications`,
      notificationId
    );
    getDoc(docRef).then((doc) => {
      const seen = doc.data().seen;
      if ((seen = "false")) {
        updateDoc(docRef, {
          seen: "true",
        });
      }
    });
  }

  //   useEffect(() => {
  //     getInfo(senderEmail);
  //   }, []);

  return (
    <Link
      href={{
        pathname: "/singlepost",
        query: {
          postId: postId,
        },
      }}
    >
      <div
        className="notification  "
        key={notificationId}
        onClick={() => {
          readNotification();
        }}
      >
        <img
          // src={profileImg ? profileImg : "images/loading.jpg"}
          src={senderImg}
          className="h-10 w-10 bg-slate-500 rounded-full  "
          alt=""
        />
        <div className="flex flex-col">
          <div className="grid items-center text-md font-semibold w-[210px] overflow-x-hidden mb-2">
            {senderEmail === session.user.email ? "You" : sender}{" "}
            {type === "like"
              ? "liked your post"
              : type === "dislike"
              ? "disliked your post"
              : type === "comment"
              ? "commented on your post"
              : type === "wall"
              ? "wrote on your wall"
              : null}{" "}
          </div>
          <div className="flex justify-between">
            <div className="text-white text-xs ">
              {format(timestamp?.toDate().toLocaleString())}
            </div>
            {seen === "true" && (
              <div className="text-green-400 text-xs ">Seen</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Notification;
