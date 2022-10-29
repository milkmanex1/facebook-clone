import { collection, query, orderBy, updateDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { useCollection } from "react-firebase-hooks/firestore";
import { colRef, db } from "../firebase";
import { ChatAltIcon, ShareIcon, ThumbUpIcon } from "@heroicons/react/outline";
import Post from "./Post.js";

const Posts = () => {
  const q = query(colRef, orderBy("timestamp", "desc"));
  const [realtimePosts] = useCollection(q);

  return (
    <div>
      {realtimePosts?.docs.map((post) => {
        const name = post.data().name;
        const message = post.data().message;
        const postEmail = post.data().email;
        const receiverEmail = post.data()?.receiverEmail;
        const timestamp = post.data().timestamp;
        const image = post.data().image;
        const postImage = post.data().postImage;
        const likes = post.data().likes;
        const dislikes = post.data().dislikes;
        const shares = post.data().shares;
        const comments = post.data().comments;
        const id = post.id;
        if (!receiverEmail)
          return (
            <Post
              key={id}
              {...{
                name,
                message,
                postEmail,
                timestamp,
                image,
                postImage,
                likes,
                dislikes,
                shares,
                comments,
                id,
              }}
            ></Post>
          );
      })}
    </div>
  );
};

export default Posts;
