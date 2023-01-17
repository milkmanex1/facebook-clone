import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import VideoModal from "./VideoModal";

const StoryCard = ({ name, src, profile, video }) => {
  return <VideoModal {...{ name, src, profile, video }} />;
};

export default StoryCard;
