import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import VideoModal from "./VideoModal";

const StoryCard = ({ name, src, profile, video }) => {
  return (
    // <div className=" custom-pulse relative h-14 w-14 md:h-20 md:w-20 lg:h-56 lg:w-32 cursor-pointer overflow-x p-3 transition-duration-200 transform ease-in hover:scale-105 ">
    //   <Image
    //     className="absolute opacity-0 lg:opacity-100 rounded-full z-50 top-10 border-4 border-indigo-600 "
    //     src={profile}
    //     width={60}
    //     height={60}
    //     layout="fixed"
    //     objectFit="cover"
    //   ></Image>
    //   <Image
    //     className="object-cover rounded-full lg:rounded-3xl brightness-90"
    //     src={src}
    //     layout="fill"
    //   ></Image>
    //   <p className="text-white absolute bottom-3.5 font-semibold text-xs md:text-lg">
    //     {name}
    //   </p>
    // </div>
    <VideoModal {...{ name, src, profile, video }} />
  );
};

export default StoryCard;
