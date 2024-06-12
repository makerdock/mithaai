import { NextApiRequest, NextApiResponse } from 'next';
import { NeynarWebhook } from '~/contracts/NeynarWebhook';
import { db } from '~/server/db';
import { getUserById } from '~/server/neynar';
import { stack } from '~/server/stack';
const sdk = require('api')('@neynar/v2.0#281yklumre2o7');

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


    // replying to casts
    const reply = async (parentHash: string, castText: string, tipStatus: string, msg: string, main: string) => {

        await sdk.postCast({
            signer_uuid: process.env.SIGNER_UUID,
            text: castText,
            parent: parentHash,
            embeds: [
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/?tipStatus=${tipStatus}&msg=${msg}&main=${main}`
                }
            ],
        }, { api_key: process.env.NEYNAR_API_KEY })

    }


    // checking if a bot reply already exists !
    const checkBotReply = async () => {
        const conversation = await sdk.castConversation({
            identifier: body.data.hash,
            type: 'hash',
            include_chronological_parent_casts: 'false',
            api_key: process.env.NEYNAR_API_KEY
        })

        const replies = conversation.data.conversation.cast.direct_replies

        const botRepies = replies.filter((reply: any) => reply.author.username === "dipbot")

        if (botRepies.length !== 0) return true
        else return false

    }

    // returning message: bot is not allowed to tip if req is being sent by bot
    const botFid = 600098
    if (body.data.author.fid === botFid) {
        console.error('Own Bot is not allowed to tip');
        return res.status(400).json({ message: 'Own Bot is not allowed to tip' });
    }

    // check for eth address
    const senderEthAddress = body.data.author.verified_addresses.eth_addresses[0];
    if (!senderEthAddress) {
        console.error('You have not verified your eth address');
        return res.status(400).json({ message: 'You have not verified your eth address' });
    }

    let recipientFid: number | undefined;

    if (!!body.data.parent_author.fid) {
        recipientFid = body.data.parent_author.fid
    }

    if (!!body.data.mentioned_profiles[0]?.fid) {
        recipientFid = body.data.mentioned_profiles[0]?.fid
    }

    if (recipientFid === body.data.author.fid) {
        console.error('You cannot tip yourself');
        return res.status(400).json({ message: 'You cannot tip yourself' });
    }

    if (!recipientFid) {
        console.error('No recipient, ignored');
        return res.status(401).json({ message: 'No recipient, ignored' });
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

        // casting reply that tip amt is invalid
        const castMessage = `Hey ${body.data.author.username}!\nThe tip amount entered is invalid! Please enter a valid amount.`
        const isReplyAlreadyExists = await checkBotReply()

        if (!isReplyAlreadyExists) {
            await reply(body.data.hash, castMessage, encodeURIComponent("Amount Invalid"), encodeURIComponent("The tip amount entered is invalid!"), encodeURIComponent("Please enter a valid amount."))
            console.log('cast created');
        }

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
    // allowance left
    const allowanceLeft = allowance - (totalAmount + tipAmount)

    // check if the user has enough allowance
    if (totalAmount + tipAmount > allowance) {
        console.error('You have reached your daily allowance');

        // casting reply that user has reached daily allowance
        const castMessage = `Hey ${body.data.author.username}!\nYou have reached your daily allowance. Please come tomorrow to tip.`
        const isReplyAlreadyExists = await checkBotReply()

        if (!isReplyAlreadyExists) {
            await reply(body.data.hash, castMessage, encodeURIComponent("TIP FAILED"), encodeURIComponent("Looks like you have exceeded your daily tip allowance."), encodeURIComponent(`You can only tip $${allowanceLeft < 0 ? 0 : allowanceLeft}`))
            console.log('cast created');

        }

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

    // casting a reply to the user that the tip has been sent
    const castMessage = `Hey ${body.data.author.username}!\nYou have successfully tipped ${tipAmount} $bren to ${data.toUsername}.\nAllowance left : ${allowanceLeft < 0 ? 0 : allowanceLeft} $bren`
    await reply(body.data.hash, castMessage, encodeURIComponent("Tip Successfull"), "", encodeURIComponent(`You have successfully tipped ${tipAmount} $bren`))

    console.log('success');

    await db.transaction.create({ data });

    // send a message to the user that the tip has been sent

    return res.status(200).json({ data, message: 'Received POST request' });

}

const getUserAllowance = async (wallet: string): Promise<number> => {
    // const allowance: { rank: number, points: number } = await stack.getLeaderboardRank(wallet)
    // return allowance.points
    return 10000
}