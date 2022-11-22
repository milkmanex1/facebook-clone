import React from "react";
import Image from "next/image";

const SidebarRow = ({ src, Icon, title }) => {
  return (
    <div className="flex items-center space-x-2 p-2 rounded-xl cursor-pointer border-transparent border-2 hover:border-slate-100 hover:border-2 hover:bg-white/20">
      {src && (
        <Image
          className="rounded-full"
          src={src}
          width={40}
          height={40}
          layout="fixed"
        ></Image>
      )}
      {Icon && <Icon className="h-8 w-8 text-blue-500"></Icon>}
      <p className="hidden lg:inline-flex font-medium text-slate-100">
        {title}
      </p>
    </div>
  );
};

export default SidebarRow;
