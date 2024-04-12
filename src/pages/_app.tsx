import { type AppType } from "next/app";
import "~/styles/globals.css";


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`font-sans`}>
      <img className="fixed -right-12 -top-12 md:h-[400px] h-[250px]" src="/plane.png" alt="" />
      <Component {...pageProps} />
    </main>
  );
};

export default MyApp;
