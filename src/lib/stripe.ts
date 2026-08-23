import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31-basil" as any,
  typescript: true,
});

export const PLANS = {
  monthly: {
    priceId: "price_1U6z0GBBkEoljlxzq9PRoNKp",
    name: "Monthly Premium",
    description: "Full access to all topics, grammar, and AI tutor chat",
    amount: 999, // £9.99 in pence
    interval: "month" as const,
  },
  ebook: {
    priceId: "price_1U6z6xBBkEoIjIxz4nndUz8l",
    name: "Success Bridge Ebook",
    description: "The complete B1 Speaking & Citizenship exam prep ebook",
    amount: 999, // £9.99 in pence
  },
};

export const getStripePublishableKey = () =>
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;