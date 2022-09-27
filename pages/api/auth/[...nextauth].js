//Note: when deploying this app, need to change the NEXTAUTH_URL in the .env.local file

import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
};
export default NextAuth(authOptions);
