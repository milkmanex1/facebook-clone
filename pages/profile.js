import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Head from "next/head";
import Header from "../components/Header";
import Login from "../components/Login";
import ProfileContent from "../components/profile/ProfileContent";

import About from "../components/profile/About";
import { useState } from "react";

const backgrounds = [
  { id: 1, src: "/images/orion-nebula.jpg" },
  { id: 2, src: "/images/green.jpg" },
  { id: 5, src: "/images/galaxy.jpg" },
  { id: 5, src: "/images/dark.jpg" },
  { id: 5, src: "/images/darkwavy.jpg" },
];

const profile = () => {
  const { data: session, status } = useSession();
  //   const [identifier, setIdentifier] = useState();

  //get the identifier object from the specific post, when user clicks on the profile img. Pass as a prop into the required components
  const router = useRouter();
  const identifier = router.query;
  console.log(identifier);

  const [bgIndex, setBgIndex] = useState(0);
  if (status !== "authenticated") {
    return <Login></Login>;
  }
  if (status === "authenticated" && identifier.email) {
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
        <main className="h-full overflow-y-auto scrollbar-hide">
          <About identifier={identifier}></About>
          <ProfileContent identifier={identifier}></ProfileContent>
        </main>
      </div>
    );
  }
};

export default profile;
