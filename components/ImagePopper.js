import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { LogoutIcon, SparklesIcon } from "@heroicons/react/solid";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import Link from "next/link";
import AppContext from "../components/AppContext";
import { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid";
import StayCurrentLandscapeOutlinedIcon from "@mui/icons-material/StayCurrentLandscapeOutlined";
import StayCurrentPortraitOutlinedIcon from "@mui/icons-material/StayCurrentPortraitOutlined";
const style = {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  position: "absolute",
  top: "1rem",
  right: "-8rem",
  width: "12rem",
  height: "8rem",
  padding: "1rem",
  //   bgcolor: "black",
  borderRadius: "0.5rem",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  //   p: 4,
};
const variants = {
  hover: {
    // y: -5,
    // y: -3,
    // textShadow: "0px 0px 8px rgb(255,255,255)",
    // boxShadow: "0px 0px 20px rgb(255,255,255)",
    // transition: {
    //   yoyo: Infinity,
    // },
  },
  //   tap: { rotate: [0, -30, 0], transition: { duration: 0.5 } },
  tap: { scale: 0.8 },
};

export default function SimplePopper({
  backgrounds,
  setTestImage,
  setImageToPost,
  setImageShape,
}) {
  const { data: session, status } = useSession();

  function addImageToPost(e) {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      setTestImage(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  }

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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const filepickerRef = useRef(null);

  //   useEffect(() => {
  //     console.log(`popper userName is: ${userName}`);
  //   }, []);

  return (
    <div className="">
      <motion.div
        className="flex flex-col align-center"
        variants={variants}
        whileHover="hover"
        whileTap="tap"
      >
        <div className="inputIcon" onClick={handleClick}>
          <CameraIcon className="h-7 text-green-500"></CameraIcon>
          <p className="text-xs sm:text-sm xl:text-base mainText">
            Photo / Gif
          </p>
          <input
            ref={filepickerRef}
            onChange={addImageToPost}
            type="file"
            hidden
          />
        </div>
      </motion.div>
      {/* <button
        className="text-white border-2 border-white"
        aria-describedby={id}
        type="button"
        // onClick={handleClick}
      >
        Toggle Popper
      </button> */}
      <Popper id={id} open={open} anchorEl={anchorEl}>
        {/* <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}> */}
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={style} className="border-2 border-white bg-slate-900 z-50 ">
            <div className="flex flex-col">
              {/* set image to landscape */}

              <div
                className="popperBtn"
                onClick={() => {
                  setImageShape("wide");
                  filepickerRef.current.click();
                }}
              >
                <StayCurrentLandscapeOutlinedIcon />
                <div className="grid items-center text-md font-semibold ">
                  Landscape
                </div>
              </div>
              {/* set image to potrait */}

              <div
                className="popperBtn"
                onClick={() => {
                  setImageShape("tall");
                  filepickerRef.current.click();
                }}
              >
                <StayCurrentPortraitOutlinedIcon />
                <div className="grid items-center text-md font-semibold ">
                  Portrait
                </div>
              </div>
            </div>
          </Box>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
