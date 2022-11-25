import "../styles/globals.css";
import "../styles/Login.css";
import "../styles/index.css";
import { SessionProvider } from "next-auth/react";
import AppContext from "../components/AppContext";
import { useState, createContext, useRef, useEffect } from "react";
import { useRouter } from "next/router";

//All stuff to be shared by useContext are defined here

//this provider allows us to persist a login state between pages on NextJs

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [bgIndex, setBgIndex] = useState(0);
  const backgrounds = [
    { id: 1, src: "/images/newdark.jpg" },
    { id: 2, src: "/images/newdark2.jpg" },
    { id: 3, src: "/images/newdark3.jpg" },
    { id: 4, src: "/images/newdark4.jpg" },
    { id: 5, src: "/images/newdark5.jpg" },
    { id: 6, src: "/images/newdark6.jpg" },
    { id: 7, src: "/images/newdark7.jpg" },
    { id: 8, src: "/images/newdark8.jpg" },
  ];

  function changeBG() {
    if (bgIndex < backgrounds.length - 1) {
      setBgIndex(bgIndex + 1);
    } else {
      setBgIndex(0);
    }
  }
  const guestSession = {
    user: {
      email: "testspacebook356@gmail.com",
      image:
        "https://lh3.googleusercontent.com/a/ALm5wu1n4CYK4rjM42jS7zk1ez_ILEVCzkUc-w8uyYNC=s96-c",
      name: "Test Spacebook",
    },
  };
  const [profileImg, setProfileImg] = useState(null);
  const [userName, setUserName] = useState(null);
  //get item from localStorage, taken from john smilga grocery list
  const getLocalStorage = () => {
    if (typeof window !== "undefined") {
      let isGuest = localStorage.getItem("isGuest");
      if (isGuest !== "undefined") {
        return (isGuest = JSON.parse(localStorage.getItem("isGuest")));
      } else {
        return false;
      }
    }
  };

  useEffect(() => {}, []);

  const [isGuest, setIsGuest] = useState(getLocalStorage());

  //store isGuest in localstorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isGuest", JSON.stringify(isGuest));
  }, [isGuest]);

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
          guestSession,
          isGuest,
          setIsGuest,
        }}
      >
        <Component {...pageProps} key={router.asPath} />
      </AppContext.Provider>
    </SessionProvider>
  );
}
//Note: the key={router.asPath} is used to get nextJs to refresh when clicking Link.

export default MyApp;
