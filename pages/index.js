import Head from "next/head";
import Header from "../components/Header";
import { getSession } from "next-auth/react";
import Login from "../components/Login";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import InputBox from "../components/InputBox";
import Widgets from "../components/Widgets";
export default function Home({ session }) {
  if (!session) return <Login></Login>;
  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <Head>
        <title>Facebook</title>
      </Head>

      <Header></Header>

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
