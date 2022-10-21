import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  LogoutIcon,
  SparklesIcon,
  DotsVerticalIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import Link from "next/link";
import { doc } from "firebase/firestore";
import { db, deleteDoc, storage, ref } from "../../firebase";
import { useState, useEffect, useContext } from "react";

const style = {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  position: "absolute",
  top: "0.5rem",
  right: "-1rem",
  width: "15rem",
  height: "6rem",
  padding: "1rem",
  //   bgcolor: "black",
  borderRadius: "0.5rem",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  //   p: 4,
};

export default function SimplePopper({ postId }) {
  const { data: session, status } = useSession();

  const [anchorEl, setAnchorEl] = React.useState(null);
  async function deletePost() {
    await deleteDoc(doc(db, "posts", postId));
  }

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClickAway = (event) => {
    setAnchorEl(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <div className="flex flex-col align-center">
      <DotsVerticalIcon
        onClick={handleClick}
        aria-describedby={id}
        className="h-8 w-8 border-2 border-transparent hover:border-2 hover:border-slate-100 hover:rounded-full cursor-pointer p-0.5"
      />

      {/* <Image
        onClick={handleClick}
        aria-describedby={id}
        className="rounded-full cursor-pointer"
        src={session ? session.user.image : "/images/guest-icon.png"}
        height={50}
        width={50}
        layout="fixed"
      ></Image> */}

      <Popper id={id} open={open} anchorEl={anchorEl}>
        {/* <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}> */}
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={style} className="border-2 border-white bg-slate-900 p-0">
            <div className="flex flex-col">
              {/* delete Post */}
              <div
                className="popperBtn hover:border-transparent hover:bg-red-500 active:bg-red-700"
                onClick={deletePost}
              >
                <TrashIcon className="h-10 w-10 bg-slate-500 rounded-full p-2 "></TrashIcon>
                <div className="grid items-center text-md font-semibold ">
                  Delete This Post
                </div>
              </div>
            </div>
          </Box>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
