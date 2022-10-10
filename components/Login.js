import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
// import '../styles/Login.css'

const Login = () => {
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

        <h1 className="loginBtn" onClick={signIn}>
          Login
        </h1>
      </div>
    </div>
  );
};

export default Login;
