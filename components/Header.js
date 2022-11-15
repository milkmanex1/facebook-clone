import React from "react";
import Image from "next/image";
import HeaderIcon from "./HeaderIcon.js";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Popper from "./Popper.js";
import NotificationsPopper from "./NotificationsPopper";
import { motion, AnimatePresence } from "framer-motion";

import {
  BellIcon,
  ChatIcon,
  ChevronDownIcon,
  HomeIcon,
  UserGroupIcon,
  ViewGridIcon,
  SparklesIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/solid";
import {
  FlagIcon,
  PlayIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";

const variants = {
  hover: {
    scale: 1.2,
    y: -3,
    // textShadow: "0px 0px 8px rgb(255,255,255)",
    // boxShadow: "0px 0px 8px rgb(255,255,255)",
    // transition: {
    //   yoyo: Infinity,
    // },
  },
  //   tap: { rotate: [0, -30, 0], transition: { duration: 0.5 } },
  tap: { scale: 0.9 },
};

const Header = () => {
  const { data: session, status } = useSession();

  //   function changeBG() {
  //     if (bgIndex < backgrounds.length - 1) {
  //       setBgIndex(bgIndex + 1);
  //     } else {
  //       setBgIndex(0);
  //     }
  //   }
  return (
    <div className="sticky top-0 z-50 bg-slate-900/40  flex items-center p-2 lg:px-5 shadow-md">
      <div className="flex items-center ">
        <Link href="/">
          {/* wrap it in <a> tags so the annoying error goes away */}
          <motion.a variants={variants} whileHover="hover" whileTap="tap">
            <div className="grid items-center">
              <Image
                className="cursor-pointer "
                src="/images/logo2-modified.png"
                width={48}
                height={48}
                layout="fixed"
              ></Image>
            </div>
          </motion.a>
        </Link>
        <div className="flex ml-2 items-center rounded-full bg-gray-100 p-2">
          <SearchIcon className="h-6 text-gray-600 cursor-pointer" />

          <input
            className="hidden md:inline-flex ml-2 items-center bg-transparent outline-none placeholder-gray-500 flex-shrink"
            type="text"
            placeholder="Search Spacebook"
          />
        </div>
        {/* <div className="text-slate-100 text-semibold cursor-pointer w-30 border-2 rounded-full px-2 py-2 ml-2  ">
          Switch Background
        </div> */}
      </div>

      {/* center */}
      <div className="flex justify-center flex-grow">
        <div className="flex space-x-6 md:space-x-2">
          <HeaderIcon active={true} Icon={HomeIcon}></HeaderIcon>
          <HeaderIcon Icon={FlagIcon}></HeaderIcon>
          <HeaderIcon Icon={PlayIcon}></HeaderIcon>
          <HeaderIcon Icon={ShoppingCartIcon}></HeaderIcon>

          <HeaderIcon Icon={UserGroupIcon}></HeaderIcon>
        </div>
      </div>
      {/* right */}
      <div className="flex items-center gap-x-2 sm:space-x-1 justify-end md:ml-16">
        <ViewGridIcon className="icon"></ViewGridIcon>
        <ChatIcon className="icon"></ChatIcon>
        <NotificationsPopper></NotificationsPopper>
        <Popper className="icon"></Popper>
      </div>
    </div>
  );
};

export default Header;
