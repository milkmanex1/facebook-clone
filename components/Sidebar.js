import React, { useContext } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SidebarRow from "./SidebarRow.js";
import AppContext from "../components/AppContext";
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
import Scroll from "react-scroll";

var ScrollLink = Scroll.Link;
var Element = Scroll.Element;

const Sidebar = () => {
  const { data: session, status } = useSession();
  const { profileImg, userName } = useContext(AppContext);
  return (
    <div className="p-2 mt-5 xl:w-[300px] xl:min-w-[200px]">
      <Link
        href={{
          pathname: "/profile",
          query: {
            email: session.user.email,
            userName: session.user.name,
          },
        }}
      >
        <a>
          <SidebarRow
            src={profileImg ? profileImg : session.user.image}
            title={userName ? userName : session.user.name}
          ></SidebarRow>
        </a>
      </Link>

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
