import React from "react";
import Stories from "./Stories.js";
import InputBox from "./InputBox.js";
import Posts from "./Posts.js";
import Scroll from "react-scroll";
var ScrollLink = Scroll.Link;
var Element = Scroll.Element;

const Feed = () => {
  //remove xl:mr-40, added items-center

  return (
    <div className="flex-grow  items-center h-[calc(100vh-90px)] pb-44 pt-6 sm:mr-4 px-2 sm:p-0 overflow-y-auto scrollbar-hide ">
      <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
        {/* Stories */}
        <Stories></Stories>
        <InputBox></InputBox>
        <Posts></Posts>
      </div>
    </div>
  );
};

export default Feed;
