import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { LogoutIcon, SparklesIcon } from "@heroicons/react/solid";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import Link from "next/link";
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
  bgcolor: "background.paper",
  borderRadius: "0.5rem",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  //   p: 4,
};

export default function SimplePopper({ backgrounds, bgIndex, setBgIndex }) {
  const { data: session, status } = useSession();

  const [anchorEl, setAnchorEl] = React.useState(null);

  function changeBG() {
    if (bgIndex < backgrounds.length - 1) {
      setBgIndex(bgIndex + 1);
    } else {
      setBgIndex(0);
    }
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
      <Image
        onClick={handleClick}
        aria-describedby={id}
        className="rounded-full cursor-pointer"
        src={session ? session.user.image : "/images/guest-icon.png"}
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
          <Box sx={style}>
            <div className="flex flex-col">
              {/* profile  */}
              <Link
                href={{
                  pathname: "/profile",
                  query: {
                    email: session.user.email,
                  },
                }}
              >
                <div className="p-2 flex rounded-lg  hover:bg-slate-200 active:bg-slate-400 cursor-pointer gap-x-2">
                  <Image
                    className="rounded-full cursor-pointer"
                    src={
                      session.user.image
                        ? session.user.image
                        : "/images/guest-icon.png"
                    }
                    height={50}
                    width={50}
                    layout="fixed"
                  ></Image>
                  <div className="grid items-center text-lg font-semibold ">
                    {session.user.name}
                  </div>
                </div>
              </Link>
              {/* change background */}

              <div
                className="p-2 flex rounded-lg  hover:bg-slate-200 cursor-pointer gap-x-2 active:bg-slate-400"
                onClick={changeBG}
              >
                <SparklesIcon className="h-10 w-10 bg-slate-300 rounded-full p-2 "></SparklesIcon>
                <div className="grid items-center text-md font-semibold ">
                  New Background
                </div>
              </div>

              {/* logout */}
              <div
                className="p-2 flex rounded-lg  hover:bg-slate-200 cursor-pointer gap-x-2 active:bg-slate-400"
                onClick={signOut}
              >
                <LogoutIcon className="h-10 w-10 bg-slate-300 rounded-full p-2 "></LogoutIcon>
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
