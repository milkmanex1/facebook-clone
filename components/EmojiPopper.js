import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { LogoutIcon, SparklesIcon } from "@heroicons/react/solid";
import { EmojiHappyIcon } from "@heroicons/react/outline";

import ClickAwayListener from "@mui/base/ClickAwayListener";
import Link from "next/link";
import AppContext from "./AppContext";
import { useState, useEffect, useContext } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { motion, AnimatePresence } from "framer-motion";

const buttonVariants = {
  tap: { scale: 0.8 },
};

const style = {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  position: "absolute",
  top: "1rem",
  right: "-1rem",
  width: "15rem",
  height: "15rem",
  padding: "1rem",
  //   bgcolor: "black",
  borderRadius: "0.5rem",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  //   p: 4,
};

export default function SimplePopper({ setInput, input }) {
  const { data: session, status } = useSession();

  //get required stuff from context
  const { changeBG, profileImg, userName } = useContext(AppContext);

  //MUI function
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClickAway = (event) => {
    setAnchorEl(false);
  };
  const handleOnSelect = (e) => {
    console.log(e.native);
    setInput(input + e.native);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  //   useEffect(() => {
  //     console.log(`popper userName is: ${userName}`);
  //   }, []);

  return (
    <div className="flex-grow">
      <motion.div
        className="inputIcon"
        variants={buttonVariants}
        whileTap="tap"
        onClick={handleClick}
        aria-describedby={id}
      >
        <EmojiHappyIcon className="h-7 text-yellow-300"></EmojiHappyIcon>
        <p className="text-xs sm:text-sm xl:text-base mainText">
          Feeling/Activity
        </p>
      </motion.div>

      <Popper id={id} open={open} anchorEl={anchorEl}>
        {/* <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}> */}
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box>
            <Picker data={data} onEmojiSelect={handleOnSelect} />
          </Box>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
