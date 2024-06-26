import { StackClient } from "@stackso/js-core"

export const stack = new StackClient({
    apiKey: process.env.STACK_API_KEY ?? '',
    pointSystemId: Number(process.env.STACK_POINT_SYSTEM_ID) ?? 2605,
})