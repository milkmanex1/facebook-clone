import React, { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { XCircleIcon } from "@heroicons/react/solid";
// import '../styles/Login.css'

const Login = () => {
  const [modalOpen, setModalOpen] = useState(false);
  function openModal() {
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div
      className="grid place-items-center h-screen bg-cover"
      style={{ backgroundImage: "url(/images/earth.jpg)" }}
    >
      <div className="grid place-items-center mt-20">
        {/* <Image
            src="/images/logo2-modified.png"
            height={150}
            width={150}
          ></Image> */}
        <div className="welcome">Spacebook</div>

        <h1 className="loginBtn mb-5" onClick={signIn}>
          Login
        </h1>
        {modalOpen ? (
          <div className="text-white border-2 border-white p-2 rounded-2xl relative text-lg ">
            <div className="mb-4 mx-8">
              Tip: Copy paste the info below on your Notepad
            </div>
            <div className="font-bold">Guest Google Account:</div>
            <XCircleIcon
              className="h-6 w-6 absolute top-2 right-2 cursor-pointer"
              onClick={closeModal}
            />

            <div className="grid grid-rows-2 ">
              <div className="flex gap-4">
                <div>Email:</div>testspacebook356@gmail.com
              </div>

              <div className="flex gap-4">
                <div>Password:</div>password356
              </div>
              <br></br>
              <div className="font-bold">
                {" "}
                Verify its you --- Enter Recovery Email
              </div>
              <div className="flex gap-4">
                <div>Recovery Email:</div>Therealman364@gmail.com
              </div>
            </div>
          </div>
        ) : (
          <div
            className="text-white/20 border-2 border-white/20 p-4 rounded-2xl cursor-pointer hover:text-white/90 hover:border-white/90 transition duration-500 ease-in-out"
            onClick={openModal}
          >
            Login with your own Google/Github Account. Or click me to get Google
            Guest account details
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
