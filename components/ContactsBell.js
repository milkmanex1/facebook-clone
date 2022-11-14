import React, { useState, useEffect } from "react";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const ContactsBell = ({ newMessages }) => {
  const [showBell, setShowBell] = useState(false);

  useEffect(() => {
    setShowBell(newMessages);
  }, []);
  return (
    <div>
      {showBell && (
        <NotificationsActiveIcon className="text-red-500"></NotificationsActiveIcon>
      )}
    </div>
  );
};

export default ContactsBell;
