import React, { useEffect, useRef, useState, useContext } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import EmojiPopper from "../EmojiPopper";
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid";
import AppContext from "../AppContext";

import { db, addDoc, deleteDoc, colRef, storage, ref } from "../../firebase";
import {
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
//ProfileInputBox is used instead of InputBox to write to other ppl's wall

import {
  collection,
  query,
  orderBy,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  arrayUnion,
  FieldValue,
  serverTimestamp,
} from "firebase/firestore";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
const btnVariants = {
  tap: { scale: 0.8, transition: { duration: 0.1 } },
  hover: {
    // scale: [1, 1.1, 1],
    // transition: { duration: 1, repeat: 2, type: "spring" },
  },
};

const ProfileInputBox = ({ identifier }) => {
  const { data: session, status } = useSession();

  const { profileImg, userName } = useContext(AppContext);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const filepickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);
  const [testImage, setTestImage] = useState(null);

  function testFunction() {
    getDocs(colRef).then((snapshot) => {
      let myData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      console.log(myData);
    });
  }

  function sendPost(e) {
    e.preventDefault();
    //dont allow user to send post if input value is empty
    if (!inputRef.current.value) {
      return;
    } else {
      //add a new post
      addDoc(colRef, {
        message: inputRef.current.value,
        name: userName ? userName : session.user.name,
        email: session.user.email,
        image: profileImg ? profileImg : session.user.image,
        likes: [],
        dislikes: [],
        comments: [],
        shares: 0,
        receiverEmail: identifier.email,
        timestamp: serverTimestamp(),
      }).then((docSN) => {
        if (imageToPost) {
          console.log("uploading image..");
          removeImage();
          const storageRef = ref(storage, `posts/${docSN.id}`);
          const uploadTask = uploadBytesResumable(storageRef, testImage);

          uploadTask.on(
            "state_change",
            null,
            (error) => console.log(error),
            () => {
              console.log("time to get download url");
              getDownloadURL(storageRef).then((url) => {
                console.log(url);
                setDoc(
                  doc(db, "posts", docSN.id),
                  {
                    postImage: url,
                  },
                  { merge: true }
                );
              });
            }
          );
        }
        sendNotification("wall", docSN.id);
      });

      //clear the input
      inputRef.current.value = "";
      setInput("");
    }
  }
  async function checkAndSendNotification(type) {
    //check if similar notification already exists-- use postId, senderEmail, and type
    const querySnapshot = await getDocs(
      collection(db, `profiles/${identifier.email}/notifications`)
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
  function sendNotification(type, postId) {
    //send Notification to the poster
    const colRef = collection(db, `profiles/${identifier.email}/notifications`);

    addDoc(colRef, {
      senderEmail: session.user.email,
      type: type,
      seen: "false",
      timestamp: serverTimestamp(),
      postId: postId,
      sender: userName,
      senderImg: profileImg,
    });
  }

  //Need to use FileReader to display the image obtained from input type=image
  function addImageToPost(e) {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      setTestImage(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  }

  function removeImage() {
    setImageToPost(null);
  }

  return (
    <div className="blurryBackground p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6 border-2">
      <div className="flex space-x-3 p-4 items-center">
        <Image
          className="rounded-full"
          src={profileImg ? profileImg : session.user.image}
          width={40}
          height={40}
          layout="fixed"
        ></Image>
        <form className="flex flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            className="rounded-full h-12 rounded-r-none bg-gray-100 flex-grow px-5 focus:outline-none"
            placeholder={`Write something to ${identifier.userName}...`}
          />
          <motion.button
            variants={btnVariants}
            whileTap="tap"
            whileHover="hover"
            className="bg-green-400 px-2 pr-4 rounded-full rounded-l-none text-slate-800 hover:bg-green-500"
            type="submit"
            onClick={sendPost}
          >
            Post
          </motion.button>
        </form>
        {imageToPost && (
          <div className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer">
            <img className="h-10 object-contain" src={imageToPost} alt="" />
            <p
              onClick={removeImage}
              className="text-xs text-red-500 text-center cursor-pointer"
            >
              Remove
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-evenly p-3 border-t-0 ">
        {/* <div className="inputIcon">
          <VideoCameraIcon className="h-7 text-red-500"></VideoCameraIcon>
          <p className="text-xs sm:text-sm xl:text-base mainText">Live Video</p>
        </div> */}
        <div
          className="inputIcon"
          onClick={() => {
            filepickerRef.current.click();
          }}
        >
          <CameraIcon className="h-7 text-green-500"></CameraIcon>
          <p className="text-xs sm:text-sm xl:text-base mainText">
            Photo / Gif
          </p>
          <input
            ref={filepickerRef}
            onChange={addImageToPost}
            type="file"
            hidden
          />
        </div>
        <EmojiPopper input={input} setInput={setInput}></EmojiPopper>
        {/* <div className="inputIcon" onClick={() => console.log(session)}>
          <EmojiHappyIcon className="h-7 text-yellow-300"></EmojiHappyIcon>
          <p className="text-xs sm:text-sm xl:text-base mainText">
            Feeling/Activity
          </p>
        </div> */}
        {/* <button
          className="rounded-md bg-slate-400 text-white p-1 text-sm"
          onClick={testFunction}
        >
          Test Button
        </button> */}
      </div>
    </div>
  );
};

export default ProfileInputBox;

//Notes: uploadString allows the image to be uploaded to the storage, but will not be appended to the post

//Whereas uploadBytesResumable will append it, but image will not be displayed in the storage

//holy shit i did it. Blindly whacking all solutions in the dark
//Found a youtube video which used uploadBytesResumable
//The only diff is that he did not convert the image to a dataURL. He just took the image from the e.target.files[0]

//So the issue was that I was uploading a wrong type of image file.
