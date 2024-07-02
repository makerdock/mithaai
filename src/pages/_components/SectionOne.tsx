import Image from "next/image";
import React from "react";

const SectionOne = () => {
  const rewardListing = [
    {
      title: "Join the network",
      icon: "/icons/network.svg",
      text: "Simply get started with joining the Bren network by being allow-listed or invited by an existing bren.",
      number: "01",
    },
    {
      title: "Tipping Weekly",
      icon: "/icons/tip_jar.svg",
      text: "Every week, you’ll receive a $bren allocation to award points and shoutouts to other users directly from Warpcast.",
      number: "02",
    },
    {
      title: "Move Upward",
      icon: "/icons/icons_park.svg",
      text: "Climb the real-time leaderboard. Your BREN cred (points) increaase based on your recognitions (shoutouts given and received), and contribution of your invites.",
      number: "03",
    },
    {
      title: "Increase BREN cred",
      icon: "/icons/star.svg",
      text: "Boost your BREN cred (& weekly allocation) by recognizing new people, actively engaging with the community, and showcasing your based contributions.",
      number: "04",
    },
  ];
  return (
    <div className="w-full px-[60px]">
      <div className="relative mx-auto h-[300px] w-[1000px]">
        <Image src="/icons/logo_big_lg.svg" alt="Bren" layout="fill" />
      </div>
      <div className="bg-blu-100 mx-auto w-full max-w-[1600px] rounded-[40px] px-[128px] py-[100px]">
        <h1 className="mb-2 text-center text-[40px] font-bold text-white">
          How Bren Works
        </h1>
        <h2 className="text-W-100 mb-[60px] text-center text-[22px]">
          Recognize and Reward Based Contributions
        </h2>

        <div className="grid grid-cols-2 items-stretch gap-12">
          {rewardListing?.map((reward) => (
            <div
              key={reward?.title}
              className="rounded-xl border border-[rgba(255,255,255,0.40)] bg-[rgba(255,255,255,0.08)] px-10 py-[72px]"
            >
              <div className="relative h-[58px] w-[58px]">
                <Image alt={reward?.title} src={reward?.icon} layout="fill" />
              </div>
              <p className="mt-6 text-[32px] font-bold text-white">
                <span>{reward?.number}.</span> {reward?.title}
              </p>
              <p className="mt-1 text-[26px] text-white">{reward?.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative mx-auto h-[300px] w-[1000px]">
        <Image src="/icons/logo_big_lg.svg" alt="Bren" layout="fill" />
      </div>
    </div>
  );
};

export default SectionOne;
