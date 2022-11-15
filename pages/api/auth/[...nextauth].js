//Note: when deploying this app, need to change the NEXTAUTH_URL in the .env.local file

import NextAuth from "next-auth/next";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  // Configure one or more authentication providers. Can be fb, google
  providers: [
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  //   callbacks: {
  //     //token refers to the session object
  //     //this function is called whenever a jwt is created or updated
  //     async jwt(token, user) {
  //       if (user) {
  //         //adding an id field to the token
  //         token.id = user.id;
  //       }
  //       return token;
  //     },
  //     //this function below recieves the token from the jwt callback.
  //     async session(session, token) {
  //       session.user.id = token.id;
  //       return session;
  //     },
  //   },

  secret: process.env.JWT_SECRET,
};
export default NextAuth(authOptions);
