import Head from "next/head";
import Header from "../components/Header";
import { getSession, useSession } from "next-auth/react";
import Login from "../components/Login";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import InputBox from "../components/InputBox";
import Widgets from "../components/Widgets";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  //   console.log(session);

  const backgrounds = [
    { id: 1, src: "/images/orion-nebula.jpg" },
    { id: 2, src: "/images/green.jpg" },
    { id: 5, src: "/images/galaxy.jpg" },
    { id: 5, src: "/images/dark.jpg" },
    { id: 5, src: "/images/darkwavy.jpg" },
  ];

  const [bgIndex, setBgIndex] = useState(0);

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
// export async function getServerSideProps(context) {
//   //Get the user
//   const session = await getSession(context);

//   return {
//     props: {
//       session,
//     },
//   };
// }
