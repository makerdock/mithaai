import { type AppType } from "next/app";
import "~/styles/font.css";
import "~/styles/globals.css";
import Layout from "./_components/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
