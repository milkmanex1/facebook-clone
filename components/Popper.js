import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { LogoutIcon, SparklesIcon } from "@heroicons/react/solid";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import Link from "next/link";
import AppContext from "../components/AppContext";
import { useState, useEffect, useContext } from "react";

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

export default function SimplePopper({ backgrounds }) {
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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  //   useEffect(() => {
  //     console.log(`popper userName is: ${userName}`);
  //   }, []);

  return (
    <div className="flex flex-col align-center">
      <Image
        onClick={handleClick}
        aria-describedby={id}
        className="rounded-full cursor-pointer"
        src={
          profileImg
            ? profileImg
            : session.user.image
            ? session.user.image
            : "/images/guest-icon.png"
        }
        height={50}
        width={50}
        layout="fixed"
      ></Image>
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
          <Box sx={style} className="border-2 border-white bg-slate-900">
            <div className="flex flex-col">
              {/* profile  */}
              <Link
                href={{
                  pathname: "/profile",
                  query: {
                    email: session.user.email,
                    userName: session.user.name,
                  },
                }}
              >
                <div className="popperBtn">
                  <Image
                    className="rounded-full cursor-pointer "
                    src={
                      profileImg
                        ? profileImg
                        : session.user.image
                        ? session.user.image
                        : "/images/guest-icon.png"
                    }
                    height={50}
                    width={50}
                    layout="fixed"
                  ></Image>
                  <div className="grid items-center text-lg font-semibold ">
                    {userName ? userName : session.user.name}
                  </div>
                </div>
              </Link>
              {/* change background */}

              <div className="popperBtn" onClick={changeBG}>
                <SparklesIcon className="h-10 w-10 bg-slate-500 rounded-full p-2 "></SparklesIcon>
                <div className="grid items-center text-md font-semibold ">
                  New Background
                </div>
              </div>

              {/* logout */}
              <div className="popperBtn" onClick={signOut}>
                <LogoutIcon className="h-10 w-10 bg-slate-500 rounded-full p-2 "></LogoutIcon>
                <div className="grid items-center text-md font-semibold ">
                  Logout
                </div>
              </div>
            </div>
          </Box>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
