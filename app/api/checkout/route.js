import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Pro Plan",
            description: "Unlock all features",
          },
          unit_amount: 999,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    customer_email: session.user.email,
  })

  return new Response(JSON.stringify({ url: checkoutSession.url }), { status: 200 })
}