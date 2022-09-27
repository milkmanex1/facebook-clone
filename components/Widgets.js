import React from "react";
import Image from "next/image";
import { SearchIcon } from "@heroicons/react/outline";
import { DotsHorizontalIcon, VideoCameraIcon } from "@heroicons/react/solid";

const contacts = [
  { src: "/images/Stevenlollipop1.jpeg", name: "Steven Lim" },
  { src: "/images/sunhodp.jpg", name: "Sun Ho" },
  { src: "/images/dk (4).jpg", name: "JDee Kosh" },
  { src: "/images/amosyeeDP (2).jpg", name: "Amos Yee" },
  { src: "/images/chuandoDP1.jpg", name: "Chuan Do" },
  { src: "/images/mark-lee.jpg", name: "Mark Lee" },
  { src: "https://links.papareact.com/f0p", name: "Jeff Bezoz" },
];

const Widgets = () => {
  return (
    <div className="hidden lg:flex flex-col w-60 p-2 mt-5">
      <div className="flex justify-between items-center text-gray-500 mb-5">
        <h2 className="text-xl">Contacts</h2>
        <div className="flex space-x-2">
          <VideoCameraIcon className="h-6"></VideoCameraIcon>
          <SearchIcon className="h-6"></SearchIcon>
          <DotsHorizontalIcon className="h-6"></DotsHorizontalIcon>
        </div>
      </div>
      {contacts.map((contact) => {
        const src = contact.src;
        const name = contact.name;
        return (
          <div
            key={contact.src}
            className="flex items-center space-x-3 mb-2 relative hover:bg-gray-200 cursor-pointer p-2 rounded-xl"
          >
            <Image
              className="rounded-full"
              objectFit="cover"
              src={src}
              width={50}
              height={50}
              layout="fixed"
            ></Image>
            <p>{name}</p>
            <div className="absolute bottom-2 left-7 bg-green-400 h-3 w-3 rounded-full "></div>
          </div>
        );
      })}
    </div>
  );
};

export default Widgets;
