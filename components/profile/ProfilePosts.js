import {
  collection,
  query,
  orderBy,
  updateDoc,
  doc,
  getFirestore,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import Post from "../Post";

const Posts = ({ thisEmail }) => {
  //init services
  const db = getFirestore();
  //collection reference
  const colRef = collection(db, "posts");
  //query
  const q = query(colRef, orderBy("timestamp", "desc"));
  //real time collection data (doesnt work idk why)
  //   onSnapshot(q, (snapshot) => {
  //     let realtimePosts = [];
  //     snapshot.docs.forEach((doc) => {
  //       realtimePosts.push({ ...doc.data(), id: doc.id });
  //     });
  //     console.log(realtimePosts);
  //   });
  const [realtimePosts] = useCollection(q);

  return (
    <div className="pb-44">
      {realtimePosts?.docs.map((post) => {
        const name = post.data().name;
        const message = post.data().message;
        const email = post.data().email;
        const timestamp = post.data().timestamp;
        const image = post.data().image;
        const postImage = post.data().postImage;
        const likes = post.data().likes;
        const shares = post.data().shares;
        const comments = post.data().comments;
        const id = post.id;
        if (email == thisEmail)
          return (
            <Post
              key={id}
              {...{
                name,
                message,
                email,
                timestamp,
                image,
                postImage,
                likes,
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
