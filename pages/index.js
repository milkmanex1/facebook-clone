import Head from "next/head";
import Header from "../components/Header";
import { getSession, useSession } from "next-auth/react";
import Login from "../components/Login";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import InputBox from "../components/InputBox";
import Contacts from "../components/Contacts";
import Chat from "../components/Chat";
import { useState, useEffect, useContext } from "react";
import AppContext from "../components/AppContext";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export default function Home() {
  const { backgrounds, bgIndex } = useContext(AppContext);
  const { data: session, status } = useSession();

  const [email, setEmail] = useState(null);
  //stuff to pull from firebase
  const { profileImg, setProfileImg, userName, setUserName } =
    useContext(AppContext);

  //pull data from firebase
  async function getInfo() {
    if (email) {
      console.log("getting Info on index page");
      const profileRef = doc(db, "profiles", email);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        setProfileImg(snap.data().profileImg);
        setUserName(snap.data().userName);
        console.log("Info obtained");
      } else {
        console.log("profile does not yet exist in database");
        createProfile();
      }
    }
  }
  async function createProfile() {
    const allPostsRef = collection(db, "profiles");
    await setDoc(doc(allPostsRef, session.user.email), {
      userName: session.user.name,
      profileImg: session.user.image,
    });
  }
  useEffect(() => {
    if (status === "authenticated") {
      setEmail(session.user.email);
    }
  }, [status]);

  useEffect(() => {
    getInfo();
  }, [email]);

  if (!session) return <Login />;
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

      <main className="flex">
        {/* Sidebar */}
        <Sidebar></Sidebar>
        <Feed></Feed>
        <Contacts />
      </main>
    </div>
  );
}
// export async function getServerSideProps(context) {
//   //Get the user
//   const session = await getSession(context);

//   return {
//     props: {
//       session,
//     },
//   };
// }
