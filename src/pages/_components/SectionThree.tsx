import FAQListing from "./FAQListing";

const SectionThree = () => {
  const FAQs = [
    { question: "What is $bren?", answer: "$BRen is a gifting system" },
    { question: "What is $bren?", answer: "$BRen is a gifting system" },
    { question: "What is $bren?", answer: "$BRen is a gifting system" },
  ];
  return (
    <div className="mx-auto mt-[60px] w-full max-w-[1366px] rounded-[40px] bg-[#BD44D9] px-[160px] py-[100px]">
      <div className="w-full rounded-[24px] bg-[rgba(17,16,17,0.16)] px-10 py-12">
        <h1 className="text-center text-[60px] font-bold text-[#EEEEEE]">
          Bren FAQs
        </h1>

        <div className="mt-5 divide-y divide-W-100 rounded-lg border">
          {FAQs?.map((faq, i) => <FAQListing {...faq} key={i} />)}
        </div>
      </div>
    </div>
  );
};

export default SectionThree;
