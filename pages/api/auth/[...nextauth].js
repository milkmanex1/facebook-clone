//Note: when deploying this app, need to change the NEXTAUTH_URL in the .env.local file

import NextAuth from "next-auth/next";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import RedditProvider from "next-auth/providers/reddit";
import MediumProvider from "next-auth/providers/medium";
import WordpressProvider from "next-auth/providers/wordpress";
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
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // RedditProvider({
    //   clientId: process.env.REDDIT_CLIENT_ID,
    //   clientSecret: process.env.REDDIT_CLIENT_SECRET,
    // }),
    // MediumProvider({
    //     clientId: process.env.MEDIUM_CLIENT_ID,
    //     clientSecret: process.env.MEDIUM_CLIENT_SECRET
    //   })
    // SlackProvider({
    //     clientId: process.env.SLACK_CLIENT_ID,
    //     clientSecret: process.env.SLACK_CLIENT_SECRET
    //   })
    // WordpressProvider({
    //   clientId: process.env.WORDPRESS_CLIENT_ID,
    //   clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
    // }),
  ],
  //   callbacks: {
  //     jwt: async ({ token, user }) => {
  //       user && (token.user = user);
  //       return token;
  //     },
  //     session: async ({ session, token }) => {
  //       session.user = token.user;
  //       return session;
  //     },
  //   },

  secret: process.env.JWT_SECRET,
};
export default NextAuth(authOptions);
