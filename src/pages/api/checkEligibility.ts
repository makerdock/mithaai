import { NextApiRequest, NextApiResponse } from 'next';
import { NeynarWebhook } from '~/contracts/NeynarWebhook';
import { db } from '~/server/db';
import { getUserById } from '~/server/neynar';
import { stack } from '~/server/stack';
const sdk = require('api')('@neynar/v2.0#281yklumre2o7');
import { DuneClient } from "@duneanalytics/client-sdk";
const dune = new DuneClient(process.env.DUNE_API_KEY!);

// add body-parser to parse the request body
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== 'POST') {
            console.error('Method Not Allowed')
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        // Handle the POST request here
        // You can access the request body using req.body
        const body = req.body;

        // if the user is a power badge holder
        const fid = req.body.fid
        const isFollowingChannel = Boolean(body.isFollowingChannel)
        const isSplitter = Boolean(body.isSplitter)
        const isAllies = Boolean(body.isAllies)

        // fetching user details like power badge, eth address
        const senderDetails = await getUserById(fid, fid)

        //  function to return allowance points on the basis of defined actions- power badge holder, allies, splitter and channel follower
        const calculateAllowancePoints = (
            isPowerBadgeHolder: boolean,
            isAllies: boolean,
            isSplitter: boolean,
            isFollowingChannel: boolean
        ): number => {
            let maxAllowancePoints = 0;

            if (isPowerBadgeHolder) {
                maxAllowancePoints = 100;
            }

            if (isFollowingChannel) {
                maxAllowancePoints = Math.max(maxAllowancePoints, 25);
            }

            if (isSplitter) {
                maxAllowancePoints = Math.max(maxAllowancePoints, 300);
            }

            if (isAllies) {
                maxAllowancePoints = Math.max(maxAllowancePoints, 500);
            }

            return maxAllowancePoints;
        }

        // calculating max allowance points from the actions of user
        const allowancePoints = calculateAllowancePoints(senderDetails?.power_badge!, isAllies, isSplitter, isFollowingChannel)

        console.log(allowancePoints);

        // finding user from to db to check if allowance is given and the date on which last time allowance was given 
        const user = await db.user!.findUnique({
            where: {
                fid: fid,
                walletAddress: senderDetails!.verified_addresses.eth_addresses[0]
            }
        });

        const dateToday = new Date()
        // calculating one week time
        const oneWeekAgo = new Date(dateToday.getTime() - 7 * 24 * 60 * 60 * 1000);

        // if the allowance is not given for first time it will set the allowance to whatever allowance point it is eligible for - isAllowanceGiven is false for the first time user is created making the condition true to set Allowance
        // now if an allowance is already been given to user it will check for the date gap if its been a week last time allowance was given , it will reset allowance
        if (!user!.isAllowanceGiven || (user!.allowanceGivenAt < oneWeekAgo)) {

            stack.track("allowance", {
                account: senderDetails?.verified_addresses.eth_addresses[0]!,
                points: allowancePoints
            });

            // Update the user's allowanceGivenAt and isAllowanceGiven fields
            await db.user.update({
                where: {
                    fid: fid,
                    walletAddress: senderDetails!.verified_addresses.eth_addresses[0]
                },
                data: {
                    isAllowanceGiven: true,
                    allowanceGivenAt: dateToday
                }
            });

            return res.status(200).json({ allowancePoints, message: 'Allowance Reset Successfully' });
        }


        return res.status(200).json({ message: 'There is time left to reset allowance' });
    }
    catch (err) {
        console.log(err);

    }
}

