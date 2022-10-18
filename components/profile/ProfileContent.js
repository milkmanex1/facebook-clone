import { useEffect, useRef, useState, react } from "react";

import Image from "next/image";
import { useSession } from "next-auth/react";
import InputBox from "../InputBox";
import ProfilePosts from "./ProfilePosts";
import {
  doc,
  arrayUnion,
  updateDoc,
  collection,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

//This file contains the intro card and Posts by the user
//When the page loads, it will pull introInfo from firebase matching the user Email
//if profile is same as user, show the buttons(edit coverImg, editBio, addItems)

const ProfileContent = ({ identifier }) => {
  const [email, setEmail] = useState(identifier.email);
  const [introHead, setIntroHead] = useState("");
  const [introInfo, setIntroInfo] = useState([]);
  const [userName, setUserName] = useState(null);

  const [openAddItems, setOpenAddItems] = useState(false);
  const [openEditBio, setOpenEditBio] = useState(false);
  const inputRef = useRef(null);
  const { data: session } = useSession();

  async function addItem(e) {
    e.preventDefault();
    //dont allow user to send anything if input value is empty
    if (!inputRef.current.value) {
      return;
    } else {
      //if post with user's email exists, update it
      const postRef = doc(db, "profiles", session.user.email);
      const snap = await getDoc(postRef);
      if (snap.exists()) {
        updateDoc(postRef, {
          introInfo: arrayUnion(inputRef.current.value),
        });
      }
      //if post with user's email doesnt exist, create it
      else {
        const allPostsRef = collection(db, "profiles");
        await setDoc(doc(allPostsRef, session.user.email), {
          introInfo: arrayUnion(inputRef.current.value),
        });
      }
      inputRef.current.value = "";
      //get the info from firebase and reload page
      getInfo();
    }
  }
  async function editBio(e) {
    e.preventDefault();
    if (!inputRef.current.value) {
      return;
    } else {
      //if post with user's email exists, update it
      const postRef = doc(db, "profiles", session.user.email);
      const snap = await getDoc(postRef);
      if (snap.exists()) {
        updateDoc(postRef, {
          introHead: inputRef.current.value,
        });
      }
      //if post with user's email doesnt exist, create it
      else {
        const allPostsRef = collection(db, "profiles");
        await setDoc(doc(allPostsRef, session.user.email), {
          introHead: inputRef.current.value,
        });
      }
      inputRef.current.value = "";
      //get the info from firebase and reload page
      getInfo();
      setOpenEditBio(false);
    }
  }
  useEffect(() => {
    getInfo();
  }, []);

  async function getInfo() {
    if (email) {
      const profileRef = doc(db, "profiles", email);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        setIntroHead(snap.data().introHead);
        setIntroInfo(snap.data().introInfo);
        setUserName(snap.data().userName);
      }
    }
    // getDoc(profileRef).then((doc) => {

    //   setIntroHead(doc.data().introHead);
    //   setIntroInfo(doc.data().introInfo);
    //   setUserName(doc.data().userName);
    // });
  }

  return (
    <div className="mt-4 mx-8 lg:flex lg:gap-x-8 lg:justify-center">
      {/* Intro */}
      <div className=" p-4 text-slate-100 border-2 border-white rounded-xl min-w-[350px] max-h-screen max-w-none lg:max-w-[450px]">
        <p className="text-4xl font-semibold mb-2">Intro</p>
        {/* Intro Head or Bio*/}
        {openEditBio ? (
          <form className="flex flex-col">
            <textarea
              type="text"
              ref={inputRef}
              className="rounded-md bg-gray-100 flex-grow px-5 focus:outline-none text-black py-2"
              maxlength="100"
              rows="3"
              placeholder={`Write something about yourself, ${session.user.name}`}
            />
            <div className="flex justify-end gap-x-4 m-2">
              <button
                type="button"
                className="simpleBtn"
                onClick={() => {
                  setOpenEditBio(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="hidden"
                onClick={editBio}
              ></button>
              <button className="simpleBtn" type="button" onClick={editBio}>
                Save
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center py-4">{introHead}</p>
        )}
        {/* Edit Bio button */}
        {!openEditBio && session.user.email == email && (
          <button
            className="text-white simpleBtn w-full"
            onClick={() => {
              setOpenEditBio(!openEditBio);
            }}
          >
            Edit Bio
          </button>
        )}

        <div className="border-b-2 border-slate-50 mt-4"></div>

        <div className="flex flex-col">
          {/* Intro Items */}
          {introInfo?.map((info, i) => (
            <p key={i} className="py-1">
              {info}
            </p>
          ))}

          {openAddItems && (
            <form className="flex flex-col">
              <textarea
                type="text"
                ref={inputRef}
                className="rounded-md bg-gray-100 flex-grow px-5 focus:outline-none text-black py-2"
                maxlength="50"
                rows="3"
                placeholder={`Add work, education, hobbies, interests, or anything`}
              />
              <div className="flex justify-end gap-x-4 m-2">
                <button
                  type="button"
                  className="simpleBtn"
                  onClick={() => {
                    setOpenAddItems(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hidden"
                  onClick={addItem}
                ></button>
                <button className="simpleBtn" type="button" onClick={addItem}>
                  Save
                </button>
              </div>
            </form>
          )}
          {!openAddItems && session.user.email == email && (
            <button
              className="text-white simpleBtn mt-4"
              onClick={() => {
                setOpenAddItems(!openAddItems);
              }}
            >
              Add Items
            </button>
          )}
        </div>
      </div>
      {/* feed */}

      {/* posts---only if match user email*/}
      <div className="flex-grow min-w-[700px] max-w-[1000px]">
        <div className="text-white p-4  border-2 border-white rounded-xl mt-4">
          <p className="font-semibold text-4xl ">Posts</p>
          <p>By {userName}</p>
        </div>
        <ProfilePosts thisEmail={email}></ProfilePosts>
      </div>
    </div>
  );
};

export default ProfileContent;
