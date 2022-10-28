import React, { useState } from "react";
import StoryCard from "./StoryCard.js";
import {
  collection,
  query,
  orderBy,
  doc,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, serverTimestamp } from "../firebase";

const stories = [
  {
    name: "Steven Lim",
    email: "StevenLimKorKor34@gmail.com",
    src: "/images/stevenStory.jpg",
    profile: "/images/Stevenlollipop1.jpeg",
  },
  {
    name: "Kim Jong Un",
    src: "/images/kim6.jpeg",
    profile: "/images/kim5.jpg",
  },
  {
    name: "Najib Razak",
    email: "najibRazak6745@gmail.com",
    src: "/images/najibSnooze.jpg",
    profile: "/images/najib-profile.jpg",
  },
  {
    name: "Justin Bieber",
    src: "/images/bieberFace.jpg",
    profile: "/images/justinProfile.jpg",
  },
  {
    name: "Xi Jin Ping",
    src: "/images/xpBDSM2.jpg",
    profile: "/images/jinPingDp.jpg",
  },
];
const Testing = ["cuckoobird"];
const Stories = () => {
  // const [profileInfo, setProfileInfo] = useState([]);
  // async function getProfiles() {
  //     const colRef = collection(db, "profiles");
  //     const q = query(colRef);
  //     onSnapshot(q, (snapshot) => {
  //       let tempInfo = [];
  //       snapshot.forEach((doc) => {
  //         //only get those profiles with userName and profileImg
  //         if (doc.data().userName && doc.data().profileImg)
  //           tempInfo.push({
  //             userName: doc.data().userName,
  //             profileImg: doc.data().profileImg,
  //             email: doc.id,
  //           });
  //       });
  //       setProfileInfo(tempInfo);
  //     });
  //   }
  //   useEffect(() => {
  //     getProfiles();
  //   }, []);

  return (
    <div className="flex justify-center space-x-3 mx-auto">
      {stories.map((story) => {
        return (
          <StoryCard
            key={story.src}
            name={story.name}
            src={story.src}
            profile={story.profile}
          ></StoryCard>
        );
      })}
    </div>
  );
};

export default Stories;
