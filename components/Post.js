import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  collection,
  query,
  orderBy,
  updateDoc,
  doc,
  addDoc,
  arrayUnion,
} from "firebase/firestore";
import Image from "next/image";
import { useCollection } from "react-firebase-hooks/firestore";

import { colRef, db } from "../firebase";
import { ChatAltIcon, ShareIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";

const Post = ({
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
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentRef = useRef(null);

  const { data: session, status } = useSession();
  //   useEffect(() => {
  //     const postRef = doc(db, "posts", id);
  //     updateDoc(postRef, {
  //       likes: myLikes,
  //     }).then(() => {
  //     });
  //   }, [myLikes]);
  function likePost(id) {
    const postRef = doc(db, "posts", id);
    updateDoc(postRef, {
      likes: likes + 1,
    });
  }
  function openComments() {
    setShowCommentInput(!showCommentInput);
    setShowComments(!showComments);
  }
  function sendComment(e) {
    e.preventDefault();
    if (!commentRef.current.value) {
      return;
    } else {
      //add new comment
      const postRef = doc(db, "posts", id);
      updateDoc(postRef, {
        comments: arrayUnion({
          content: commentRef.current.value,
          userName: session.user.name,
          userImage: session.user.image,
        }),
      });
      commentRef.current.value = "";
    }
  }

  return (
    <div key={id} className="flex flex-col ">
      <div className="blurryBackground p-5  mt-5 rounded-t-2xl shadow-sm border-x-2 border-t-2 border-slate-100 postSides">
        <div className="flex items-center space-x-2">
          <Link
            href={{
              pathname: "/profile",
              query: {
                email: email,
              },
            }}
          >
            <a>
              <img
                className="rounded-full cursor-pointer"
                src={image}
                width={40}
                height={40}
                alt=""
              />
            </a>
          </Link>
          <div>
            <p className="font-medium text-slate-100">{name}</p>
            {timestamp ? (
              <p className="text-xs mainText">
                {new Date(timestamp?.toDate()).toLocaleString()}
              </p>
            ) : (
              <p className="text-xs mainText">Loading</p>
            )}
          </div>
        </div>
        <p className="pt-4 mainText">{message}</p>
      </div>
      {postImage && (
        <div className="relative h-56 md:h-[400px] bg-transparent border-x-2 ">
          <Image src={postImage} objectFit="cover" layout="fill"></Image>
        </div>
      )}
      {/* post stats */}
      <div className="blurryBackground flex justify-between items-center  text-slate-200 border-2 border-y-0 px-3 py-3">
        {likes > 0 && (
          <div className="w-auto flex space-x-1">
            <img
              className="cursor-pointer"
              src="/images/fb thumbs up icon.png"
              alt="Likes"
              width={30}
              height={30}
            />
            <p className="text-xs sm:text-base mainText">{likes}</p>
          </div>
        )}
        <div className="flex space-x-4">
          {Array.from(comments).length > 0 && (
            <div className="flex space-x-1">
              <p>{Array.from(comments).length}</p>
              <p
                className="text-xs sm:text-base mainText cursor-pointer"
                onClick={openComments}
              >
                Comments
              </p>
            </div>
          )}

          {shares > 0 && (
            <div className="flex space-x-1">
              <p>{shares}</p>
              <p className="text-xs sm:text-base mainText cursor-pointer">
                Shares
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer of the post */}
      <div
        className={`blurryBackground flex justify-between items-center rounded-b-2xl  shadow-md  text-slate-200 border-2 ${
          showCommentInput && " rounded-b-none border-b-0 shadow-none"
        }`}
      >
        <div className="inputIcon" onClick={() => likePost(id)}>
          <ThumbUpIcon className="h-4" />
          <p className="text-xs sm:text-base mainText">Like</p>
        </div>
        <div className="inputIcon" onClick={openComments}>
          <ChatAltIcon className="h-4" />
          <p className="text-xs sm:text-base mainText">Comment</p>
        </div>
        <div className="inputIcon">
          <ShareIcon className="h-4" />
          <p className="text-xs sm:text-base mainText">Share</p>
        </div>
      </div>
      {/*------------------ Comments Section*--------------/}

      {/* -----------Comment input----------------- */}
      {showCommentInput && (
        <div
          className={`blurryBackground flex space-x-2 px-4 py-2 border-2 border-t-0 rounded-b-2xl ${
            showComments && "rounded-b-none border-b-0"
          }`}
        >
          <img
            className="rounded-full p-1"
            src={session.user.image}
            width={50}
            height={50}
            alt=""
          />
          <form className="flex grow">
            <input
              type="text"
              className="rounded-full h-10 bg-gray-100 px-4 focus:outline-none flex-grow"
              placeholder="Write a comment..."
              ref={commentRef}
            />
            <button className="hidden" type="submit" onClick={sendComment}>
              Submit
            </button>
          </form>
        </div>
      )}
      {/*--------------- comments---------------------- */}
      {showComments && (
        <div className="blurryBackground flex flex-col gap-y-2 border-2 border-t-0 rounded-b-2xl p-5 pt-2">
          {Array.from(comments)?.map((comment, id) => {
            return (
              <div key={id} className="text-slate-100 flex space-x-2 ">
                <img
                  src={comment.userImage}
                  className="rounded-full h-8 w-8"
                  width={40}
                  height={40}
                  alt=""
                />
                <div className="bg-slate-500/50 px-4 py-1 rounded-2xl">
                  <div className="font-semibold">{comment.userName}</div>
                  <div>{comment.content}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Post;
