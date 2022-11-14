import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  forwardRef,
} from "react";
import Link from "next/link";
import {
  collection,
  query,
  orderBy,
  updateDoc,
  doc,
  addDoc,
  getDoc,
  getDocs,
  arrayUnion,
  FieldValue,
  serverTimestamp,
} from "firebase/firestore";
import Image from "next/image";
import { useCollection } from "react-firebase-hooks/firestore";
import DeletePopper from "./profile/DeletePopper";
import { motion, AnimatePresence } from "framer-motion";

import { colRef, db } from "../firebase";
import {
  ChatAltIcon,
  ShareIcon,
  ThumbUpIcon,
  ThumbDownIcon,
} from "@heroicons/react/outline";
import { DotsVerticalIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import AppContext from "../components/AppContext";
import Tooltip from "@mui/material/Tooltip";
import { async } from "@firebase/util";
import Scroll from "react-scroll";

var ScrollLink = Scroll.Link;
var Element = Scroll.Element;

const buttonVariants = {
  //   tap: { scale: 0.8 },
};

const containerVariants = {
  hidden: {
    opacity: 0,
    y: "-30vh",
    // x: "-30vw",
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: "spring",
      //   duration: 1
    },
  },
  exit: {
    x: "60vw",
    // y: "-40vw",
    transition: { ease: "easeInOut" },
    opacity: 0,
    duration: 0.5,
  },
};

const Post = (props) => {
  const {
    name,
    message,
    postEmail,
    receiverEmail,
    timestamp,
    image,
    postImage,
    likes,
    dislikes,
    shares,
    comments,
    imageShape,
    id,
    identifier,
    index,
  } = props;
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentRef = useRef(null);
  const [likerNames, setLikerNames] = useState([]);
  const { data: session, status } = useSession();
  //info about current user, not the guy whose page is being viewed
  const { profileImg, userName } = useContext(AppContext);

  const [identifierUserName, setIdentifierUserName] = useState(null);
  const [latestUserName, setLatestUserName] = useState(null);
  const [latestProfileImg, setLatestProfileImg] = useState(null);

  //these 2 states are for pulling the reciever info, when click on notification about wall post
  const [receiverUserName, setReceiverUserName] = useState(null);
  const [receiverProfileImg, setReceiverProfileImg] = useState(null);

  async function likePost(id) {
    const docRef = doc(db, "posts", id);
    //check if document 'likes' already contains user's email
    getDoc(docRef).then((doc) => {
      const likes = doc.data().likes;
      //if user liked it before, unlike it
      if (likes?.find((e) => e.email === session.user.email)) {
        updateDoc(docRef, {
          likes: likes.filter((likes) => likes.email !== session.user.email),
        });
      } else {
        //like post
        updateDoc(docRef, {
          likes: arrayUnion({
            email: session.user.email,
          }),
        });
        checkAndSendNotification("like");
      }
    });
  }
  async function dislikePost(id) {
    const docRef = doc(db, "posts", id);
    //check if document 'dislikes' already contains user's email
    getDoc(docRef).then((doc) => {
      //if no dislikes field exists
      const dislikes = doc.data().dislikes;
      if (!dislikes) {
        updateDoc(docRef, {
          dislikes: arrayUnion({
            email: session.user.email,
          }),
        });
        return;
      }
      //if user disliked it before, un-dislike it
      if (dislikes.find((e) => e.email === session.user.email)) {
        updateDoc(docRef, {
          dislikes: dislikes.filter(
            (dislikes) => dislikes.email !== session.user.email
          ),
        });
      } else {
        updateDoc(docRef, {
          dislikes: arrayUnion({
            email: session.user.email,
          }),
        });
        checkAndSendNotification("dislike");
      }
    });
  }
  async function checkAndSendNotification(type) {
    //check if similar notification already exists-- use postId, senderEmail, and type
    const querySnapshot = await getDocs(
      collection(db, `profiles/${postEmail}/notifications`)
    );
    let notifications = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ ...doc.data() });
    });
    if (
      notifications.find(
        (e) =>
          e.postId == id &&
          e.senderEmail == session.user.email &&
          e.type == type
      )
    ) {
      console.log("notification exists");
    } else {
      console.log("notification not yet exist");
      sendNotification(type);
    }
  }
  function sendNotification(type) {
    //send Notification to the poster
    const colRef = collection(db, `profiles/${postEmail}/notifications`);

    addDoc(colRef, {
      senderEmail: session.user.email,
      type: type,
      seen: "false",
      timestamp: serverTimestamp(),
      postId: id,
      sender: userName,
      senderImg: profileImg,
    });
  }

  async function pullName(email) {
    if (email) {
      const profileRef = doc(db, "profiles", email);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        const name = snap.data().userName;

        setLikerNames((likerNames) => [...likerNames, name]);
      }
    }
  }
  function getLikerName(likes) {
    const likerEmails = likes.map((liker) => liker.email);
    likerEmails.forEach((likerEmail) => {
      pullName(likerEmail);
    });
  }

  function openComments() {
    setShowCommentInput(!showCommentInput);
    setShowComments(!showComments);
  }
  function sendComment(e) {
    e.preventDefault();
    if (!commentRef.current.value) {
      return;
    } else {
      //add new comment
      const postRef = doc(db, "posts", id);
      updateDoc(postRef, {
        comments: arrayUnion({
          content: commentRef.current.value,
          userName: userName ? userName : session.user.name,
          userImage: profileImg ? profileImg : session.user.image,
          email: session.user.email,
        }),
      });
      checkAndSendNotification("comment");
      commentRef.current.value = "";
    }
  }

  async function getLatestPostInfo() {
    if (postEmail) {
      const profileRef = doc(db, "profiles", postEmail);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        setLatestUserName(snap.data().userName);
        setLatestProfileImg(snap.data().profileImg);
      }
    }
  }
  async function getReceiverInfo() {
    if (receiverEmail) {
      const profileRef = doc(db, "profiles", receiverEmail);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        setReceiverUserName(snap.data().userName);
        setReceiverProfileImg(snap.data().profileImg);
      }
    }
  }
  async function getIdentifierUserName() {
    if (identifier) {
      const profileRef = doc(db, "profiles", identifier.email);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        setIdentifierUserName(snap.data().userName);
      }
    }
  }
  useEffect(() => {
    getIdentifierUserName();
    getLatestPostInfo();
    getReceiverInfo();
  }, []);

  return (
    <motion.div
      key={id}
      className="flex flex-col "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="blurryBackground p-5  mt-5 rounded-t-2xl shadow-sm border-x-2 border-t-2 border-slate-100 postSides relative">
        <div className="flex items-center space-x-2">
          {/* profile image */}
          <Link
            href={{
              pathname: "/profile",
              query: {
                email: postEmail,
                userName: name,
              },
            }}
          >
            <a>
              <img
                className="rounded-full cursor-pointer"
                src={latestProfileImg}
                width={40}
                height={40}
                alt=""
                referrerPolicy="no-referrer"
              />
            </a>
          </Link>
          <div>
            {/* name of Poster */}
            {receiverEmail ? (
              <div className="font-medium text-slate-100 flex">
                {name} <ChevronRightIcon className="h-6 w-6" />{" "}
                {identifierUserName
                  ? identifierUserName
                  : identifier?.userName
                  ? identifier.userName
                  : receiverUserName}
              </div>
            ) : (
              <div className="font-medium text-slate-100">{latestUserName}</div>
            )}
            {timestamp ? (
              <p className="text-xs mainText">
                {new Date(timestamp?.toDate()).toLocaleString()}
              </p>
            ) : (
              <p className="text-xs mainText">Loading</p>
            )}
          </div>
        </div>
        <p className="pt-4 mainText">{message}</p>
        {/* open popper Btn */}
        {session.user.email == postEmail && (
          <div className="mainText absolute top-6 right-2">
            <DeletePopper postId={id} />
          </div>
        )}
      </div>
      {postImage && imageShape === "tall" ? (
        <div className="relative h-56 md:h-[800px] bg-transparent border-x-2 ">
          <Image
            src={postImage}
            objectFit="cover"
            layout="fill"
            objectPosition="bottom"
          ></Image>
        </div>
      ) : postImage ? (
        <div className="relative h-56 md:h-[400px] bg-transparent border-x-2 ">
          <Image src={postImage} objectFit="cover" layout="fill"></Image>
        </div>
      ) : null}
      {/* --------Post Stats----------------- */}
      <div className="blurryBackground flex justify-between items-center  text-slate-200 border-2 border-y-0 px-3 py-3">
        <div className="flex space-x-4">
          {likes.length > 0 && (
            <div className="w-auto flex space-x-1">
              <p>
                <Tooltip
                  title={
                    <div className=" text-xs sm:text-base mainText flex flex-col">
                      {likerNames.map((name, i) => {
                        return <div key={i}>{name}</div>;
                      })}
                    </div>
                  }
                >
                  <img
                    className="cursor-pointer"
                    src="/images/fb thumbs up icon.png"
                    alt="Likes"
                    width={30}
                    height={30}
                    onMouseEnter={() => getLikerName(likes)}
                    onMouseLeave={() => setLikerNames([])}
                  />
                </Tooltip>
              </p>
              <p className="text-xs sm:text-base mainText">{likes.length}</p>
            </div>
          )}
          {dislikes?.length > 0 && (
            <div className="w-auto flex space-x-1">
              <p>
                <Tooltip
                  title={
                    <div className=" text-xs sm:text-base mainText flex flex-col">
                      {likerNames.map((name, i) => {
                        return <div key={i}>{name}</div>;
                      })}
                    </div>
                  }
                >
                  <img
                    className="cursor-pointer"
                    src="/images/thumbs down.png"
                    alt="Likes"
                    width={30}
                    height={30}
                    onMouseEnter={() => getLikerName(dislikes)}
                    onMouseLeave={() => setLikerNames([])}
                  />
                </Tooltip>
              </p>
              <p className="text-xs sm:text-base mainText">{dislikes.length}</p>
            </div>
          )}
        </div>
        <div className="flex space-x-4">
          {Array.from(comments).length > 0 && (
            <div className="flex space-x-1">
              <p>{Array.from(comments).length}</p>
              <p
                className="text-xs sm:text-base mainText cursor-pointer"
                onClick={openComments}
              >
                Comments
              </p>
            </div>
          )}
          {shares > 0 && (
            <div className="flex space-x-1">
              <p>{shares}</p>
              <p className="text-xs sm:text-base mainText cursor-pointer">
                Shares
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Footer of the post */}
      <div
        className={`blurryBackground flex justify-between items-center rounded-b-2xl  shadow-md  text-slate-200 border-2 ${
          showCommentInput && " rounded-b-none border-b-0 shadow-none"
        }`}
      >
        <motion.div
          className="inputIcon active:bg-slate-400"
          onClick={() => likePost(id)}
          variants={buttonVariants}
          whileTap="tap"
        >
          <ThumbUpIcon className="h-4" />
          <p className="text-xs sm:text-base mainText">Like</p>
        </motion.div>
        <motion.div
          className="inputIcon active:bg-slate-400"
          onClick={openComments}
          variants={buttonVariants}
          whileTap="tap"
        >
          <ChatAltIcon className="h-4" />
          <p className="text-xs sm:text-base mainText">Comment</p>
        </motion.div>
        <motion.div
          className="inputIconDislike active:bg-slate-400"
          onClick={() => dislikePost(id)}
          variants={buttonVariants}
          whileTap="tap"
        >
          <ThumbDownIcon className="h-4" />
          <p className="text-xs sm:text-base mainText">Dislike</p>
        </motion.div>
      </div>
      {/*------------------ Comments Section*--------------/}
              {/* -----------Comment input----------------- */}
      {showCommentInput && (
        <div
          className={`blurryBackground flex space-x-2 px-4 py-2 border-2 border-t-0 rounded-b-2xl ${
            showComments && "rounded-b-none border-b-0"
          }`}
        >
          <img
            className="rounded-full p-1"
            src={profileImg ? profileImg : session.user.image}
            width={50}
            height={50}
            alt=""
          />
          <form className="flex grow">
            <input
              type="text"
              className="rounded-full h-10 bg-gray-100 px-4 focus:outline-none flex-grow"
              placeholder="Write a comment..."
              ref={commentRef}
            />
            <button className="hidden" type="submit" onClick={sendComment}>
              Submit
            </button>
          </form>
        </div>
      )}
      {/*--------------- comments---------------------- */}
      {showComments && (
        <div className="blurryBackground flex flex-col gap-y-2 border-2 border-t-0 rounded-b-2xl p-5 pt-2">
          {Array.from(comments)?.map((comment, id) => {
            return (
              <div key={id} className="text-slate-100 flex space-x-2 ">
                <img
                  src={comment.userImage}
                  className="rounded-full h-8 w-8"
                  width={40}
                  height={40}
                  alt=""
                />
                <div className="bg-slate-500/50 px-4 py-1 rounded-2xl">
                  <div className="font-semibold">{comment.userName}</div>
                  <div>{comment.content}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Post;
