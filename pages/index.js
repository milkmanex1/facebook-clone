import Head from "next/head";
import Header from "../components/Header";
import { getSession } from "next-auth/react";
import Login from "../components/Login";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import InputBox from "../components/InputBox";
import Widgets from "../components/Widgets";
import { useState } from "react";
export default function Home({ session }) {
  const backgrounds = [
    { id: 1, src: "/images/orion-nebula.jpg" },
    { id: 2, src: "/images/green.jpg" },
    { id: 3, src: "/images/red.jpg" },
    { id: 4, src: "/images/stars.jpg" },
    { id: 5, src: "/images/galaxy.jpg" },
  ];

  const [bgIndex, setBgIndex] = useState(0);

  if (!session) return <Login></Login>;
  return (
    <div
      className="h-screen overflow-hidden mainBg"
      style={{
        backgroundImage: `url(${backgrounds[bgIndex].src})`,
        backgroundSize: "cover",
      }}
    >
      <Head>
        <title>Facebook</title>
      </Head>

      <Header
        backgrounds={backgrounds}
        bgIndex={bgIndex}
        setBgIndex={setBgIndex}
      ></Header>

      <main className="flex">
        {/* Sidebar */}
        <Sidebar></Sidebar>
        <Feed></Feed>

        <Widgets />
      </main>
    </div>
  );
}
export async function getServerSideProps(context) {
  //Get the user
  const session = await getSession(context);

  //   const posts = await db.collection("posts").orderBy("timestamp", "desc").get();

  //   const docs = posts.docs.map((post) => ({
  //     id: post.id,
  //     ...post.data(),
  //     timestamp: null,
  //   }));

  return {
    props: {
      session,
    },
  };
}
