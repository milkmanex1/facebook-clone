import React from "react";
import Stories from "./Stories.js";
import InputBox from "./InputBox.js";
import Posts from "./Posts.js";

const Feed = () => {
  //remove xl:mr-40, added items-center
  return (
    <div className="flex-grow  items-center h-screen pb-44 pt-6 mr-4 overflow-y-auto scrollbar-hide ">
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
