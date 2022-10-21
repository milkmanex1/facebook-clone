import "../styles/globals.css";
import "../styles/Login.css";
import "../styles/index.css";
import { SessionProvider } from "next-auth/react";
import AppContext from "../components/AppContext";
import { useState, createContext } from "react";

//this provider allows us to persist a login state between pages on NextJs
function MyApp({ Component, pageProps }) {
  const [bgIndex, setBgIndex] = useState(0);
  const backgrounds = [
    { id: 5, src: "/images/galaxy.jpg" },
    { id: 1, src: "/images/orion-nebula.jpg" },
    { id: 2, src: "/images/green.jpg" },
    { id: 5, src: "/images/dark.jpg" },
    { id: 5, src: "/images/darkwavy.jpg" },
  ];

  function changeBG() {
    if (bgIndex < backgrounds.length - 1) {
      setBgIndex(bgIndex + 1);
    } else {
      setBgIndex(0);
    }
  }
  const [profileImg, setProfileImg] = useState(null);
  const [userName, setUserName] = useState(null);

  return (
    <SessionProvider session={pageProps.session}>
      <AppContext.Provider
        value={{
          bgIndex,
          setBgIndex,
          changeBG,
          backgrounds,
          profileImg,
          setProfileImg,
          userName,
          setUserName,
        }}
      >
        <Component {...pageProps} />
      </AppContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;
