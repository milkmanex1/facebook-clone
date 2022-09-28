import React from "react";
import Image from "next/image";
import HeaderIcon from "./HeaderIcon.js";
import { useSession, signOut } from "next-auth/react";

import {
  BellIcon,
  ChatIcon,
  ChevronDownIcon,
  HomeIcon,
  UserGroupIcon,
  ViewGridIcon,
  SparklesIcon,
} from "@heroicons/react/solid";
import {
  FlagIcon,
  PlayIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";
const Header = ({ backgrounds, bgIndex, setBgIndex }) => {
  const { data: session, status } = useSession();

  function changeBG() {
    if (bgIndex < backgrounds.length - 1) {
      setBgIndex(bgIndex + 1);
    } else {
      setBgIndex(0);
    }
  }
  return (
    <div className="sticky top-0 z-50 bg-black/10  flex items-center p-2 lg:px-5 shadow-md">
      <div className="flex items-center ">
        <Image
          className="cursor-pointer "
          src="/images/logo2-modified.png"
          width={40}
          height={40}
          layout="fixed"
          onClick={changeBG}
        ></Image>
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
      <div className="flex items-center sm:space-x-1 justify-end">
        {/* profile pic */}
        <Image
          onClick={signOut}
          className="rounded-full cursor-pointer"
          src={session.user.image}
          height={40}
          width={40}
          layout="fixed"
        ></Image>
        <p className="whitespace-nowrap font-semibold pr-3 text-slate-100">
          {session.user.name}
        </p>
        <ViewGridIcon className="icon"></ViewGridIcon>
        <ChatIcon className="icon"></ChatIcon>
        <BellIcon className="icon"></BellIcon>
        <ChevronDownIcon className="icon" />
      </div>
    </div>
  );
};

export default Header;
