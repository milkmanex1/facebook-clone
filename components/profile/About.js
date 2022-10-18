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

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

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
      <div className=" relative h-96 flex justify-center">
        <img
          className="absolute w-11/12 h-full object-cover rounded-xl lg:mx-10 xl:w-8/12 "
          src={displayCoverImg ? displayCoverImg : "/images/emptyBanner.jpg"}
          alt="cover image here"
        />
      </div>

      <div className="mt-4  lg:flex justify-center lg:justify-between lg:px-32">
        {/*---- profile pic ----*/}
        <div className="lg:flex lg:gap-x-4 ">
          <div className="flex justify-center">
            <img
              className=" border-4 border-slate-100 rounded-full h-36 w-36 object-cover object-center min-w-36 cursor-pointer"
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
            {userName}
          </div>
        </div>
        {/*---- buttons---- */}
        <div className=" text-white text-xl flex justify-center lg:pr-16">
          <div className="lg:flex lg:flex-col justify-center ">
            <p className="p-2 rounded-xl cursor-pointer border-transparent border-2 hover:border-slate-100 hover:border-2 hover:bg-white/20">
              Add to Story
            </p>
          </div>
          <div className=" lg:flex lg:flex-col justify-center ">
            <p
              className="simpleBtn"
              onClick={() => {
                coverImgRef.current.click();
              }}
            >
              Edit Cover Image
            </p>
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
