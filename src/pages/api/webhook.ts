import { NextApiRequest, NextApiResponse } from 'next';
import { NeynarWebhook } from '~/contracts/NeynarWebhook';
import { db } from '~/server/db';
import { getUserById } from '~/server/neynar';
import { stack } from '~/server/stack';

// add body-parser to parse the request body
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        console.error('Method Not Allowed')
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Handle the POST request here
    // You can access the request body using req.body
    const body = req.body as NeynarWebhook;

    // grab the text from the message
    const message = body.data.text;

    // check for eth address
    const senderEthAddress = body.data.author.verified_addresses.eth_addresses[0];
    if (!senderEthAddress) {
        console.error('You have not verified your eth address');
        return res.status(400).json({ message: 'You have not verified your eth address' });
    }

    const recipientFid: number = body.data.parent_author.fid;

    if (recipientFid === body.data.author.fid) {
        console.error('You cannot tip yourself');
        return res.status(400).json({ message: 'You cannot tip yourself' });
    }

    // grab the amount fo the tip from the message, format: $250 bren using regex, amount should have $250 followed by bren
    let tipAmount = 0
    const amountFromText = message.match(/\$?\s*(\d+)\s*\$?\s*bren\b/i);

    if (amountFromText?.[1]) {
        tipAmount = parseInt(amountFromText?.[1]
            .replace(/\$/, '')
        );
    }

    if (!tipAmount) {
        console.error('The tip amount is invalid');
        return res.status(400).json({ tipAmount, message: 'The tip amount is invalid' });
    }

    // check the user allowance 
    const primaryAddress = body.data.author.verified_addresses.eth_addresses[0]
    if (!primaryAddress) {
        console.error('You have not verified your eth address');
        return res.status(400).json({ message: 'You have not verified your eth address' });
    }

    const allowance = await getUserAllowance(primaryAddress);
    const from = new Date().setHours(0, 0, 0, 0)
    // get transactions from this day using prisma
    const transactions = await db.transaction.findMany({
        where: {
            createdAt: {
                gte: new Date(from)
            },
            fromAddress: {
                in: body.data.author.verified_addresses.eth_addresses
            }
        }
    });

    // get the total amount of the transactions
    const totalAmount = transactions.reduce((acc, cur) => acc + cur.amount, 0);

    // check if the user has enough allowance
    if (totalAmount + tipAmount > allowance) {
        console.error('You have reached your daily allowance');
        return res.status(400).json({ message: 'You have reached your daily allowance' });
    }

    const recipientDetails = await getUserById(recipientFid?.toString(), body.data.author.fid.toString())

    const data = {
        amount: tipAmount,
        fromFid: body.data.author.fid,
        fromAddress: senderEthAddress,
        fromUsername: body.data.author.username,
        toUsername: recipientDetails?.username,
        toFid: recipientFid,
        text: message,
        castHash: body.data.hash,
        parentCastHash: body.data.parent_hash,
        link: `https://warpcast.com/${body.data.author.username}/${body.data.hash}`,
    }

    await db.transaction.create({ data });

    // send a message to the user that the tip has been sent

    return res.status(200).json({ data, message: 'Received POST request' });

}

const getUserAllowance = async (wallet: string): Promise<number> => {
    // const allowance: { rank: number, points: number } = await stack.getLeaderboardRank(wallet)
    // return allowance.points
    return 10000
}