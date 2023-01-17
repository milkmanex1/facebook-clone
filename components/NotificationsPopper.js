import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { LogoutIcon, SparklesIcon } from "@heroicons/react/solid";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import Link from "next/link";
import AppContext from "../components/AppContext";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { BellIcon } from "@heroicons/react/solid";
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
import Notification from "./Notification";
import NotificationBtn from "./NotificationBtn";
import Scroll from "react-scroll";

var ScrollLink = Scroll.Link;
var Element = Scroll.Element;
const style = {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  position: "absolute",
  top: "1rem",
  right: "-1rem",
  width: "18rem",
  //   height: "37rem",
  //   maxHeight: "80vh",
  overflowY: "hide",

  padding: "0.5rem",
  //   bgcolor: "black",
  borderRadius: "0.5rem",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  //   p: 4,
};
const variants = {
  hover: {
    // y: -5,
    y: 3,
    // textShadow: "0px 0px 8px rgb(255,255,255)",
    // boxShadow: "0px 0px 20px rgb(255,255,255)",
    // transition: {
    //   yoyo: Infinity,
    // },
  },
  //   tap: { rotate: [0, -30, 0], transition: { duration: 0.5 } },
  tap: { scale: 0.8 },
};

export default function SimplePopper({ backgrounds }) {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  //get required stuff from context
  const { changeBG, profileImg, userName } = useContext(AppContext);
  //for the Btns
  const [btn1, setBtn1] = useState(true);
  const [btn2, setBtn2] = useState(false);

  //MUI function
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClickAway = (event) => {
    setAnchorEl(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  //Notification functions
  async function getNotifications() {
    //-------------get the notifications------------
    const colRef = collection(
      db,
      `profiles/${session.user.email}/notifications`
    );
    const q = query(colRef, orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
      let temp = [];
      snapshot.forEach((doc) => {
        temp.push({ ...doc.data(), notificationId: doc.id });
      });
      //   console.log(temp);
      setNotifications(temp);
    });
  }
  useEffect(() => {
    getNotifications();
  }, []);

  function selectBtn1() {
    setBtn1(true);
    setBtn2(false);
  }
  function selectBtn2() {
    setBtn2(true);
    setBtn1(false);
  }

  return (
    <div className="">
      <motion.div
        className="flex flex-col align-center relative"
        variants={variants}
        whileHover="hover"
        whileTap="tap"
      >
        <BellIcon
          className="notificationIcon"
          onClick={handleClick}
          aria-describedby={id}
        ></BellIcon>
        {notifications.length > 0 && (
          <div className="text-white text-center h-6 w-6 bg-red-600 absolute -top-1 -right-2 rounded-full t">
            {
              notifications.filter(
                (notification) => notification.seen === "false"
              ).length
            }
          </div>
        )}
      </motion.div>
      {/* <button
        className="text-white border-2 border-white"
        aria-describedby={id}
        type="button"
        // onClick={handleClick}
      >
        Toggle Popper
      </button> */}
      <Popper id={id} open={open} anchorEl={anchorEl}>
        {/* <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}> */}
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box
            sx={style}
            className="border-2 border-white bg-slate-900  h-[800px] max-h-[80vh]"
          >
            <div className="text-slate-50 font-bold text-2xl p-2 border-b-2 border-white/50">
              Notifications
            </div>
            <div className="flex gap-x-4 text-slate-50 font-semibold px-2 py-2 ">
              <NotificationBtn
                value="All"
                isSelected={btn1}
                select={selectBtn1}
              />
              <NotificationBtn
                value="Unread"
                isSelected={btn2}
                select={selectBtn2}
              />
            </div>

            <div
              id="Ncontainer"
              className="flex flex-col pt-2 h-[300px] sm:h-[650px] overflow-y-auto max-h-[65vh]"
            >
              {btn1 &&
                notifications.map((notification, index) => {
                  const {
                    postId,
                    seen,
                    senderEmail,
                    timestamp,
                    type,
                    notificationId,
                    sender,
                    senderImg,
                  } = notification;

                  return (
                    <Notification
                      {...{
                        postId,
                        seen,
                        senderEmail,
                        timestamp,
                        type,
                        notificationId,
                        sender,
                        senderImg,
                        index,
                      }}
                      key={notificationId}
                    ></Notification>
                  );
                })}

              {btn2 &&
                notifications.map((notification, index) => {
                  const {
                    postId,
                    seen,
                    senderEmail,
                    timestamp,
                    type,
                    notificationId,
                    sender,
                    senderImg,
                  } = notification;
                  if (seen == "false")
                    return (
                      <Notification
                        {...{
                          postId,
                          seen,
                          senderEmail,
                          timestamp,
                          type,
                          notificationId,
                          sender,
                          senderImg,
                          index,
                        }}
                        key={notificationId}
                      ></Notification>
                    );
                })}
            </div>
          </Box>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
