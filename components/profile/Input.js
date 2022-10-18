import React from "react";
import { useEffect, useRef, useState, react } from "react";

import Image from "next/image";
import { useSession } from "next-auth/react";
import InputBox from "../InputBox";
import ProfilePosts from "./ProfilePosts";
import {
  doc,
  arrayUnion,
  updateDoc,
  collection,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const Input = ({ setOpenEditBio, editBio }) => {
  const { data: session } = useSession();
  const inputRef = useRef(null);
  return (
    <form className="flex flex-col">
      <textarea
        type="text"
        ref={inputRef}
        className="rounded-md bg-gray-100 flex-grow px-5 focus:outline-none text-black py-2"
        maxlength="100"
        rows="3"
        placeholder={`Write something about yourself, ${session.user.name}`}
      />
      <div className="flex justify-end gap-x-4 m-2">
        <button
          type="button"
          className="simpleBtn"
          onClick={() => {
            setOpenEditBio(false);
          }}
        >
          Cancel
        </button>
        <button type="submit" className="hidden" onClick={editBio}></button>
        <button className="simpleBtn" type="button" onClick={editBio}>
          Save
        </button>
      </div>
    </form>
  );
};

export default Input;
