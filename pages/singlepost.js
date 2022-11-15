import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Head from "next/head";
import Header from "../components/Header";
import Login from "../components/Login";
import { useState, useContext } from "react";
import AppContext from "../components/AppContext";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import Contacts from "../components/Contacts";

const singlePost = () => {
  const { data: session, status } = useSession();
  const { backgrounds, bgIndex } = useContext(AppContext);
  const [post, setPost] = useState();
  //   const [postId, setPostId] = useState();

  const router = useRouter();
  const info = router.query;
  const postId = info.postId;
  //   console.log(`postId is now: ${postId}`);

  async function getPost() {
    if (postId) {
      console.log("getting post");
      const docRef = doc(db, "posts", postId);
      onSnapshot(docRef, (doc) => {
        setPost({ ...doc.data(), id: doc.id });
      });
    }
  }
  useEffect(() => {
    getPost();
  }, []);

  //   useEffect(() => {
  //     if (post) {
  //       console.log(post);
  //     }
  //   }, [post]);

  if (status !== "authenticated") {
    return <Login></Login>;
  }
  if (status === "authenticated") {
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
        <main className="h-[calc(100vh-90px)] overflow-y-auto scrollbar-hide">
          <div className="flex relative h-[calc(100vh-90px)]">
            <Sidebar></Sidebar>
            <div className="flex-grow  items-center  pb-44 pt-6 mr-4 overflow-y-auto scrollbar-hide ">
              <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
                {post && (
                  <Post
                    name={post.name}
                    message={post.message}
                    postEmail={post.email}
                    receiverEmail={post.receiverEmail}
                    timestamp={post.timestamp}
                    image={post.image}
                    postImage={post.postImage}
                    likes={post.likes}
                    dislikes={post.dislikes}
                    shares={post.shares}
                    imageShape={post.imageShape}
                    comments={post.comments}
                    id={post.id}
                  >
                    {" "}
                  </Post>
                )}
              </div>
            </div>
            <Contacts />
          </div>
        </main>
      </div>
    );
  }
};

export default singlePost;

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
