import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import InputBox from "../InputBox";
import Posts from "../Posts";
import Intro from "./ProfileContent";
import {
  db,
  addDoc,
  deleteDoc,
  serverTimestamp,
  storage,
  ref,
} from "../../firebase";
import {
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  getStorage,
  uploadBytes,
} from "firebase/storage";
import {
  doc,
  arrayUnion,
  updateDoc,
  collection,
  getDoc,
  setDoc,
} from "firebase/firestore";
//This page contains the user profile pic, name, uploadCoverImg and the 'Edit cover' button

const About = ({ identifier }) => {
  const { data: session } = useSession();

  const [email, setEmail] = useState(identifier.email);

  const [uploadCoverImg, setUploadCoverImg] = useState(null);
  const [displayCoverImg, setDisplayCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [userName, setUserName] = useState(null);

  const [openUserNameInput, setOpenUserNameInput] = useState(false);

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const userNameRef = useRef(null);

  function sendProfileImg(e) {
    console.log("start sending profile img..");
    if (e.target.files[0]) {
      const metadata = {
        contentType: "image/jpeg",
      };
      const storageRef = ref(storage, `profiles/${email}ProfilePic`, metadata);
      uploadBytes(storageRef, e.target.files[0]).then((snap) => {
        getDownloadURL(storageRef).then((url) => {
          setDoc(
            doc(db, "profiles", email),
            {
              profileImg: url,
            },
            { merge: true }
          );
          console.log("image uploaded success");
          getOtherInfo();
        });
      });
    }
  }
  function sendCoverImg(e) {
    console.log("start sending cover image");
    if (e.target.files[0]) {
      console.log("uploading image to firestore..");
      const metadata = {
        contentType: "image/jpeg",
      };
      try {
        const storageRef = ref(storage, `profiles/${email}`);
        const uploadTask = uploadBytesResumable(
          storageRef,
          e.target.files[0],
          metadata
        );
        uploadTask.on(
          "state_change",
          null,
          (error) => console.log(error),
          () => {
            console.log("upload success");
            getCoverImage();
          }
        );
      } catch (e) {
        console.log("Unable to upload cover image");
        console.log(e);
      }
    }
  }
  async function changeUserName(e) {
    e.preventDefault();
    if (!userNameRef.current.value) {
      return;
    } else {
      //if post with user's email exists, update it
      const postRef = doc(db, "profiles", session.user.email);
      const snap = await getDoc(postRef);
      if (snap.exists()) {
        updateDoc(postRef, {
          userName: userNameRef.current.value,
        });
        console.log("updating...");
      }
      //if post with user's email doesnt exist, create it
      else {
        const allPostsRef = collection(db, "profiles");
        await setDoc(doc(allPostsRef, session.user.email), {
          userName: userNameRef.current.value,
        });
      }
      if (userNameRef) {
        userNameRef.current.value = "";
      }
      //get the info from firebase and reload page
      console.log("after update!");
      getOtherInfo();
      setOpenUserNameInput(false);
    }
  }
  useEffect(() => {
    //whenever user successfully uploads a new cover img, pull it from firebase
    getCoverImage();
  }, [uploadCoverImg]);

  //pull info from firebase when page loads
  useEffect(() => {
    getCoverImage();
    getOtherInfo();
  }, []);

  async function getOtherInfo() {
    //get profile image, username if they exist
    console.log("getting info..");
    if (email) {
      const profileRef = doc(db, "profiles", email);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        const newProfileImg = snap.data().profileImg;
        setProfileImg(newProfileImg);
        setUserName(snap.data().userName);
        // console.log(`userName is: ${userName}`);
      }
    }
  }
  function getCoverImage() {
    if (email) {
      const storage = getStorage();
      const storageRef = ref(storage, `profiles/${email}`);

      getDownloadURL(storageRef)
        .then((url) => {
          setDisplayCoverImg(url);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <div>
      {/* cover image */}
      <div className=" relative h-96 flex justify-center ">
        <img
          className="whiteShadow absolute w-11/12 h-full object-cover rounded-xl lg:mx-10 xl:w-8/12 border-2 border-slate-100 "
          src={displayCoverImg ? displayCoverImg : "/images/emptyBanner.jpg"}
          alt="cover image here"
        />
      </div>

      <div className="mt-4  lg:flex justify-center lg:justify-between lg:px-32">
        {/*---- profile pic ----*/}
        <div className="lg:flex lg:gap-x-4 ">
          <div className="flex justify-center">
            <img
              className=" border-4 border-slate-100 rounded-full h-40 w-40 object-cover object-center min-w-36 cursor-pointer"
              src={profileImg ? profileImg : "/images/emptyProfile.jpg"}
              alt=""
              onClick={() => {
                profileImgRef.current.click();
              }}
            />
            <input
              ref={profileImgRef}
              onChange={(e) => sendProfileImg(e)}
              type="file"
              hidden
            />
          </div>
          <div className="text-slate-100 text-4xl font-semibold text-center flex flex-col lg:justify-center">
            {userName ? userName : identifier.userName}
          </div>
        </div>
        {/*---- buttons---- */}
        <div className=" text-white text-xl flex justify-center gap-x-4 lg:pr-16">
          <div className="lg:flex lg:flex-col justify-center ">
            {!openUserNameInput && session.user.email == email && (
              <p
                className="simpleBtn"
                onClick={() => setOpenUserNameInput(true)}
              >
                Change username
              </p>
            )}
            {openUserNameInput && (
              <form className="flex flex-col">
                <input
                  type="text"
                  ref={userNameRef}
                  className="rounded-md bg-gray-100 flex-grow px-5 focus:outline-none text-black py-2"
                  maxLength="20"
                  placeholder={`Enter new User Name`}
                />
                <div className="flex justify-end gap-x-4 m-2">
                  <button
                    type="button"
                    className="simpleBtn"
                    onClick={() => {
                      setOpenUserNameInput(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="hidden"
                    onClick={changeUserName}
                  ></button>
                  <button
                    className="simpleBtn"
                    type="button"
                    onClick={changeUserName}
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className=" lg:flex lg:flex-col justify-center ">
            {session.user.email == email && (
              <p
                className="simpleBtn"
                onClick={() => {
                  coverImgRef.current.click();
                }}
              >
                Edit Cover Image
              </p>
            )}
            <input
              ref={coverImgRef}
              onChange={sendCoverImg}
              type="file"
              hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
