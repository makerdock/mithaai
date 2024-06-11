import { Transaction } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import DownloadButton from "~/components/DownloadButton";
import { db } from "~/server/db";

const Home: NextPage<{ transactions: Transaction[] }> = (props) => {
  const transactions: Transaction[] = props.transactions
  return (
    <>
      <Head>
        <title>$bren Dashboard</title>
        <meta name="description" content="Checkout the $bren tippings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen text-white rounded-2xl">
        {/* <img src="/save-banner.png" className="h-screen col-span-1 object-cover sticky top-0 left-0" alt="" /> */}
        <div className="md:p-24 p-8 max-w-6xl">
          <h1 className="text-7xl pb-4 font-bold ">$bren Dashboard</h1>
          <DownloadButton />

          {/* <table className="table-auto text-left w-full my-12">
            <thead className="sticky top-0  border-b border-gray-300">
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map(t => <tr
                onClick={() => {
                  // open the link in new tab
                  window.open(t.link, '_blank');
                }}
                key={t.castHash} className="py-2 hover:bg-slate-600 cursor-pointer rounded-lg w-full">
                <td>{t.fromUsername}[{t.fromFid}]</td>
                <td>{t.toUsername}[{t.toFid}]</td>
                <td>{t.amount}</td>
              </tr>)}

            </tbody>
          </table> */}

          <table className="min-w-full divide-y divide-gray-300 border-t border-gray-300 mt-8">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3">
                  Sender
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                  Recipient
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                  Amount
                </th>
                <th scope="col" className="md:block hidden px-3 py-3.5 text-left text-sm font-semibold">
                  Text
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  onClick={() => {
                    // open the link in new tab
                    window.open(t.link, '_blank');
                  }}
                  key={t.castHash} className="hover:bg-white/20 cursor-pointer rounded-lg">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3">
                    {t.fromUsername}[{t.fromFid}]
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">{t.toUsername}[{t.toFid}]</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">{t.amount}</td>
                  <td

                    className="whitespace-nowrap px-3 py-4 text-sm cursor-pointer md:block hidden">
                    <div className="max-w-md text-wrap">{t.text}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </>
  );
}

export default Home;


export const getServerSideProps: GetServerSideProps<{ transactions: Transaction[] }> = async () => {
  const response = await db.transaction.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return {
    props: {
      transactions: JSON.parse(JSON.stringify(response)) as Transaction[]
    }
  }
}