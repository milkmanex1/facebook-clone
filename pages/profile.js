import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Head from "next/head";
import Header from "../components/Header";
import Login from "../components/Login";
import ProfileContent from "../components/profile/ProfileContent";

import About from "../components/profile/About";

import { useState, useContext } from "react";
import AppContext from "../components/AppContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const Profile = () => {
  //   const { data: session, status } = useSession();
  //   const { backgrounds, bgIndex, isGuest } = useContext(AppContext);

  const { data } = useSession();
  let session = data;
  const { backgrounds, bgIndex, guestSession, isGuest } =
    useContext(AppContext);
  if (!session) {
    console.log("changing session...");
    session = guestSession;
  }

  //get the identifier object containing info about user BELONGING to that POST, from the specific post, when user clicks on the profile img. Pass as a prop into the required components
  const router = useRouter();
  const identifier = router.query;

  //pull current user info from firebase (have to pull in both index and profile pages)
  const [email, setEmail] = useState(null);
  const { profileImg, setProfileImg, userName, setUserName } =
    useContext(AppContext);

  async function getInfo() {
    if (email) {
      console.log("getting Info on profile page");
      const profileRef = doc(db, "profiles", email);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        setProfileImg(snap.data().profileImg);
        setUserName(snap.data().userName);
      }
    }
  }
  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
    }
  }, []);
  useEffect(() => {
    getInfo();
  }, [email]);

  if (!session && !isGuest) {
    return <Login></Login>;
  }
  if (session && identifier.email) {
    return (
      <div
        className="h-screen overflow-hidden mainBg"
        style={{
          backgroundImage: `url(${backgrounds[bgIndex].src})`,
          backgroundSize: "cover",
        }}
      >
        <Head>
          <title>Spacebook</title>
        </Head>
        <Header></Header>
        <main className="h-full overflow-y-auto scrollbar-hide">
          <About identifier={identifier}></About>
          <ProfileContent identifier={identifier}></ProfileContent>
        </main>
      </div>
    );
  }
};

export default Profile;
