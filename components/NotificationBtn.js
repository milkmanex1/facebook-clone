import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  forwardRef,
} from "react";
import { motion } from "framer-motion";

const NotificationBtn = ({ value, isSelected, select }) => {
  return (
    <motion.div
      className={isSelected ? "notificationBtnSelected" : "notificationBtn"}
      onClick={select}
      whileTap={{ scale: 0.8 }}
    >
      {value}
    </motion.div>
  );
};

export default NotificationBtn;
