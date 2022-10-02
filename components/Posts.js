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
        const email = post.data().email;
        const timestamp = post.data().timestamp;
        const image = post.data().image;
        const postImage = post.data().postImage;
        const likes = post.data().likes;
        const shares = post.data().shares;
        const comments = post.data().comments;
        const id = post.id;

        return (
          //   <div key={id} className="flex flex-col ">
          //     <div className="blurryBackground p-5  mt-5 rounded-t-2xl shadow-sm border-x-2 border-t-2 border-slate-100 postSides">
          //       <div className="flex items-center space-x-2">
          //         <img
          //           className="rounded-full"
          //           src={image}
          //           width={40}
          //           height={40}
          //           alt=""
          //         />
          //         <div>
          //           <p className="font-medium text-slate-100">{name}</p>
          //           {timestamp ? (
          //             <p className="text-xs mainText">
          //               {new Date(timestamp?.toDate()).toLocaleString()}
          //             </p>
          //           ) : (
          //             <p className="text-xs mainText">Loading</p>
          //           )}
          //         </div>
          //       </div>
          //       <p className="pt-4 mainText">{message}</p>
          //     </div>
          //     {postImage && (
          //       <div className="relative h-56 md:h-[500px] bg-transparent border-x-2 ">
          //         <Image src={postImage} objectFit="cover" layout="fill"></Image>
          //       </div>
          //     )}
          //     {/* post stats */}
          //     <div className="blurryBackground flex justify-between items-center  text-slate-200 border-2 border-y-0 px-3 py-3">
          //       {likes > 0 && (
          //         <div className="w-auto flex space-x-1">
          //           <img
          //             className="cursor-pointer"
          //             src="/images/fb thumbs up icon.png"
          //             alt="Likes"
          //             width={30}
          //             height={30}
          //           />
          //           <p className="text-xs sm:text-base mainText">{likes}</p>
          //         </div>
          //       )}
          //       <div className="flex space-x-4">
          //         {comments > 0 && (
          //           <div className="flex space-x-1">
          //             <p>{comments}</p>
          //             <p className="text-xs sm:text-base mainText cursor-pointer">
          //               Comments
          //             </p>
          //           </div>
          //         )}

          //         {shares > 0 && (
          //           <div className="flex space-x-1">
          //             <p>{shares}</p>
          //             <p className="text-xs sm:text-base mainText cursor-pointer">
          //               Shares
          //             </p>
          //           </div>
          //         )}
          //       </div>
          //     </div>

          //     {/* Footer of the post */}
          //     <div className="blurryBackground flex justify-between items-center rounded-b-2xl  shadow-md  text-slate-200 border-2 ">
          //       <div className="inputIcon" onClick={() => likePost(id)}>
          //         <ThumbUpIcon className="h-4" />
          //         <p className="text-xs sm:text-base mainText">Like</p>
          //       </div>
          //       <div className="inputIcon">
          //         <ChatAltIcon className="h-4" />
          //         <p className="text-xs sm:text-base mainText">Comment</p>
          //       </div>
          //       <div className="inputIcon">
          //         <ShareIcon className="h-4" />
          //         <p className="text-xs sm:text-base mainText">Share</p>
          //       </div>
          //     </div>
          //   </div>
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
