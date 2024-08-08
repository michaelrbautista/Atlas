import { NextRequest } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_LIVE_SECRET_KEY);

export async function POST(request: NextRequest) {
    const { amount } = await request.json();

    
}