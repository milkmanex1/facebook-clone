import React from "react";
import StoryCard from "./StoryCard.js";

const stories = [
  {
    name: "Steven Lim",
    src: "/images/stevenStory.jpg",
    profile: "/images/Stevenlollipop1.jpeg",
  },
  {
    name: "Sun Po",
    src: "/images/sun-ho-makeup.jpg",
    profile: "/images/sunhodp.jpg",
  },
  {
    name: "Amos Yi",
    src: "/images/amosyeeStory.jpg",
    profile: "/images/amosyeeDP (2).jpg",
  },
  {
    name: "Dee Kosh",
    src: "/images/deekosh.jpg",
    profile: "/images/dk (4).jpg",
  },
  {
    name: "Chuan Do Tan",
    src: "/images/chuandoPic.png",
    profile: "/images/chuandoDP1.jpg",
  },
];

const Stories = () => {
  return (
    <div className="flex justify-center space-x-3 mx-auto">
      {stories.map((story) => {
        return (
          <StoryCard
            key={story.src}
            name={story.name}
            src={story.src}
            profile={story.profile}
          ></StoryCard>
        );
      })}
    </div>
  );
};

export default Stories;
