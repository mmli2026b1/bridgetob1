import { NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { getCurrentUser, createAdminClient } from "@/lib/supabaseServer";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("ebook_purchased, stripe_customer_id")
      .eq("id", user.id)
      .single();

    // Prevent duplicate purchase
    if (profile?.ebook_purchased) {
      return NextResponse.json(
        { error: "You have already purchased the ebook." },
        { status: 400 }
      );
    }

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // One-time payment checkout for the ebook
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PLANS.ebook.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?ebook_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?ebook_canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        type: "ebook",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Ebook checkout session error:", error);
    return NextResponse.json(
      { error: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
