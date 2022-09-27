import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

//this provider allows us to persist a login state between pages on NextJs
function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
