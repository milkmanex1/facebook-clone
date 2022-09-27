import React from "react";
import { useSession } from "next-auth/react";
import SidebarRow from "./SidebarRow.js";
import {
  ChevronDownIcon,
  ShoppingBagIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import {
  CalendarIcon,
  ClockIcon,
  DesktopComputerIcon,
  UsersIcon,
} from "@heroicons/react/solid";

const Sidebar = () => {
  const { data: session, status } = useSession();
  return (
    <div className="p-2 mt-5 xl:w-[300px] xl:min-w-[200px]">
      <SidebarRow
        src={session.user.image}
        title={session.user.name}
      ></SidebarRow>
      <SidebarRow Icon={UsersIcon} title="Friends"></SidebarRow>
      <SidebarRow Icon={UserGroupIcon} title="Groups"></SidebarRow>
      <SidebarRow Icon={ShoppingBagIcon} title="Marketplace"></SidebarRow>
      <SidebarRow Icon={DesktopComputerIcon} title="Watch"></SidebarRow>
      <SidebarRow Icon={CalendarIcon} title="Events"></SidebarRow>
      <SidebarRow Icon={ClockIcon} title="Memories"></SidebarRow>
      <SidebarRow Icon={ChevronDownIcon} title="See More"></SidebarRow>
    </div>
  );
};

export default Sidebar;
