import { NextApiRequest, NextApiResponse } from 'next';
import { NeynarWebhook } from '~/contracts/NeynarWebhook';
import { db } from '~/server/db';
import { getUserById } from '~/server/neynar';
import { stack } from '~/server/stack';
const sdk = require('api')('@neynar/v2.0#281yklumre2o7');
import { DuneClient } from "@duneanalytics/client-sdk";
const dune = new DuneClient(process.env.DUNE_API_KEY!);

// Add body-parser to parse the request body
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            console.error('Method Not Allowed');
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        const body = req.body;
        const fid = body.fid;
        const isFollowingChannel = Boolean(body.isFollowingChannel);
        const isSplitter = Boolean(body.isSplitter);
        const isAllies = Boolean(body.isAllies);

        const senderDetails = await getUserById(fid, fid);

        const calculateAllowancePoints = (
            isPowerBadgeHolder: boolean,
            isAllies: boolean,
            isSplitter: boolean,
            isFollowingChannel: boolean
        ): number => {
            const maxAllowancePoints = 100;

            // if (isPowerBadgeHolder) {
            //     maxAllowancePoints = 100;
            // }

            // if (isFollowingChannel) {
            //     maxAllowancePoints = Math.max(maxAllowancePoints, 25);
            // }

            // if (isSplitter) {
            //     maxAllowancePoints = Math.max(maxAllowancePoints, 300);
            // }

            // if (isAllies) {
            //     maxAllowancePoints = Math.max(maxAllowancePoints, 500);
            // }

            return maxAllowancePoints;
        };

        const allowancePoints = calculateAllowancePoints(
            senderDetails?.power_badge!,
            isAllies,
            isSplitter,
            isFollowingChannel
        );

        console.log(allowancePoints);

        const user = await db.user.findUnique({
            where: {
                fid: fid,
                walletAddress: senderDetails!.verified_addresses.eth_addresses[0]
            }
        });

        const dateToday = new Date();
        const oneWeekAgo = new Date(dateToday.getTime() - 7 * 24 * 60 * 60 * 1000);

        if (!user?.isAllowanceGiven || user?.allowanceGivenAt < oneWeekAgo) {
            stack.track("allowance", {
                account: senderDetails?.verified_addresses.eth_addresses[0]!,
                points: allowancePoints
            });

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
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}