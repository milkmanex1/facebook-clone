import React from "react";

const HeaderIcon = ({ Icon, active }) => {
  return (
    <div className="flex items-center cursor-pointer md:px-10 sm:h-14 md:hover:bg-white/20 rounded-xl  active:border-b-2 active:border-blue=500 group">
      <Icon
        className={` h-5 text-center sm:h-7 mx-auto text-slate-200 group-hover:text-blue-500 ${
          active && "text-blue-500"
        }`}
      ></Icon>
    </div>
  );
};

export default HeaderIcon;
