import Image from "next/image";
import React, { useState } from "react";
import { cn } from "~/utils/helpers";

const SectionTwo = () => {
  const tabs = [
    { title: "Top Bren Recipients", key: "bren-recipients" },
    { title: "Top Bren Givers", key: "bren-givers" },
    { title: "Top Shoutout Recipients", key: "shoutout-recipient" },
    { title: "Top Shoutout Givers", key: "shoutout-givers" },
  ];
  const [selectedTab, setSelectedTab] = useState(tabs?.at(0));

  const contributorListing = [
    { rank: "01", name: "jessepollak" },
    { rank: "02", name: "ikechipollak" },
    { rank: "03", name: "jesseonu" },
    { rank: "04", name: "ybcarster" },
    { rank: "05", name: "jessepollak" },
    { rank: "06", name: "jessepollak" },
    { rank: "07", name: "jessepollak" },
    { rank: "08", name: "jessepollak" },
    { rank: "09", name: "ybcarster" },
    { rank: "10", name: "ikechipollak" },
  ];

  return (
    <section className="bg-G-100 px-10 py-20">
      <h1 className="mb-1 text-center text-[40px] font-bold text-white">
        Top Ten Brens
      </h1>
      <p className="mx-auto max-w-[600px] text-center text-2xl text-white">
        Climb the ranks of Based recognition. The Bren <br />
        leaderboard showcases not only Bren recipients, <br />
        but also top performers in various categories.
      </p>
      <div className="mx-auto mt-12 flex w-full max-w-[980px] items-center justify-between rounded-[14px] bg-[rgba(17,16,17,0.16)] px-5">
        {tabs?.map((tab) => (
          <div
            key={tab?.title}
            className={cn(
              "relative cursor-pointer py-5 text-center text-xl text-white",
              {
                "text-Y-100 active-tab": selectedTab?.title === tab?.title,
              },
            )}
            onClick={() => setSelectedTab(tab)}
          >
            {tab?.title}
          </div>
        ))}
      </div>
      <div className="border-B-40 mx-auto mt-6 w-full max-w-[1024px] rounded-xl border bg-white">
        <div className="text-B-100 border-B-40 grid w-full grid-cols-[60px_200px_1fr_284px] gap-20 border-b-[0.5px] px-8 py-5 text-xl font-bold">
          <h1>Rank</h1>
          <h1 className="text-center">Profile</h1>
          <h1 className="">Name</h1>
          <h1 className="text-center">BREN Cred</h1>
        </div>

        <div className="divide-B-40 divide-y-[0.5px]">
          {contributorListing?.map((contributor) => (
            <div
              className="grid w-full grid-cols-[60px_200px_1fr_284px] gap-20 px-8 py-5"
              key={contributor?.name}
            >
              <h1 className="text-B-60 text-center text-lg">
                {contributor?.rank}
              </h1>
              <div className="w-full">
                <div className="relative mx-auto h-[22px] w-[22px]">
                  <Image
                    layout="fill"
                    alt="Profile"
                    src="/icons/profile_icon.svg"
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="relative h-[22px] w-[22px]">
                  <Image
                    src="/icons/bolt_circle.svg"
                    alt="Bolt"
                    layout="fill"
                  />
                </div>

                <p className="text-B-60 text-lg">{contributor?.name}</p>
              </div>

              <p className="text-B-60 text-center">255</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <button className="bg bg-B-100 mx-auto flex items-center gap-2 rounded-xl p-6">
          <p className="text-xl text-white">View Leaderboard</p>
          <div className="relative h-6 w-6">
            <Image
              src="/icons/white_arrow_left.svg"
              alt="Arrow"
              layout="fill"
            />
          </div>
        </button>
      </div>
    </section>
  );
};

export default SectionTwo;
