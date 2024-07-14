import Image from "next/image";
import React, { useState } from "react";

const FAQListing = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className="p-6">
      <div
        className="flex cursor-pointer items-center justify-between gap-2"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        <h1 className="text-xl font-bold text-W-100">{question}</h1>

        <Image
          height={24}
          width={24}
          src="/icons/caret-down-white.svg"
          alt="Caret"
        />
      </div>

      {showAnswer && <p className="mt-2 text-W-100">{answer}</p>}
    </div>
  );
};

export default FAQListing;
