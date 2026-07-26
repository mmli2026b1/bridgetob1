import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const supabaseUserId = session.metadata?.supabase_user_id;
        const stripeCustomerId = session.customer;

        if (!supabaseUserId) {
          console.error("No supabase_user_id in session metadata");
          break;
        }

        if (session.mode === "payment" && session.metadata?.type === "ebook") {
          // ─── Ebook purchase (one-time payment) ─────────────
          const { error } = await supabase
            .from("profiles")
            .update({
              ebook_purchased: true,
              stripe_customer_id: stripeCustomerId,
            })
            .eq("id", supabaseUserId);

          if (error) {
            console.error("Failed to update ebook_purchased:", error);
          } else {
            console.log(`Ebook purchased for user ${supabaseUserId}`);
          }
        } else {
          // ─── Membership subscription ────────────────────────
          const { error } = await supabase
            .from("profiles")
            .update({
              membership_status: "active",
              stripe_customer_id: stripeCustomerId,
            })
            .eq("id", supabaseUserId);

          if (error) {
            console.error("Failed to update profile:", error);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const status = subscription.status;

        const customerId = subscription.customer;
        const membershipStatus =
          status === "active" ? "active" : status === "canceled" ? "cancelled" : "free";

        const { data: profiles, error: findError } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId);

        if (findError) {
          console.error("Failed to find profile:", findError);
          break;
        }

        for (const profile of profiles ?? []) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ membership_status: membershipStatus })
            .eq("id", profile.id);

          if (updateError) {
            console.error("Failed to update membership:", updateError);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscriptionDeleted = event.data.object as any;
        const customerIdDeleted = subscriptionDeleted.customer;

        const { data: profiles, error: findError } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerIdDeleted);

        if (findError) {
          console.error("Failed to find profile:", findError);
          break;
        }

        for (const profile of profiles ?? []) {
          await supabase
            .from("profiles")
            .update({ membership_status: "cancelled" })
            .eq("id", profile.id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
