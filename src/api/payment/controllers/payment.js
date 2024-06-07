"use strict";

/**
 * payment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");
const unparsed = require("koa-body/unparsed.js");

const Stripe = require("stripe");

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY environment variable not set");
}

// @ts-ignore
const stripe = new Stripe(stripeSecret, {
  apiVersion: "2022-11-15",
});

function checkEnd(months, lastUpdatedTime) {
  const currentDate = new Date();
  const subscriptionEndDate = new Date(lastUpdatedTime);

  // Add the specified number of months to the lastUpdatedDate
  subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + months);

  // Check if the new date is greater than the current date
  return currentDate > subscriptionEndDate;
}

module.exports = createCoreController("api::payment.payment", ({ strapi }) => ({
  async initiatePayment(ctx) {
    const user = ctx.state.user;
    // @ts-ignore
    const { subscription_plan } = ctx.request.body;
    // let userSubscriptionData;

    if (subscription_plan) {
      const subscriptionPlan = await strapi.db
        .query("api::subscription-plan.subscription-plan")
        .findOne({
          where: { id: subscription_plan },
        });
      if (!subscriptionPlan) {
        return ctx.badRequest("Ask Admin to set a subscription plan");
      }
      if (subscriptionPlan.planName === "Free") {
        return ctx.badRequest("You need not to buy a Free subscription plan");
      }
      try {
        const userSubscriptionData = await strapi.db
          .query("api::subscription.subscription")
          .findOne({
            where: { users_permissions_user: user.id },
            populate: { subscription_plan: true },
          });
        if (!userSubscriptionData) {
          return ctx.badRequest("Something went wrong");
        }
        // 1. if userSubscriptionData free user can subscribe --> Done
        // 2. if user already has subscription check if he wants to subscribe the same plan ---> Done
        // 3. if a different plan user can subscribe --> done
        // 4. if same plan but expired user can subscribe --> done
        // 6. else return Already a subscribed user of this plan --> done
        if (userSubscriptionData?.subscription_plan?.planName !== "Free") {
          if (userSubscriptionData.subscription_plan.id === subscription_plan) {
            const months =
              userSubscriptionData?.subscription_plan?.timeDuration;
            const lastUpdatedTime = userSubscriptionData?.updatedAt;
            const isExpired = checkEnd(months, lastUpdatedTime);
            if (!isExpired) {
              return ctx.badRequest("Already a subscribed user of this plan");
            }
          }
        }
        //subscribe part
        const payment = await strapi.entityService.create(
          "api::payment.payment",
          {
            // @ts-ignore
            data: {
              paymentStatus: false,
              subscription: userSubscriptionData.id,
            },
            ...ctx.query,
          }
        );
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: subscriptionPlan.planName,
                },
                unit_amount: subscriptionPlan.price * 100,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          billing_address_collection: "required",
          phone_number_collection: {
            enabled: true,
          },
          success_url: `${process.env.FRONTEND_URL}/learn?success=1`,
          cancel_url: `${process.env.FRONTEND_URL}/learn?canceled=1`,
          metadata: {
            paymentId: payment.id,
            subscriptionId: userSubscriptionData.id,
            subscriptionPlanId: subscriptionPlan.id,
          },
        });
        ctx.send({
          success: true,
          message: "Payment Success",
          url: session.url,
        });
      } catch (err) {
        return ctx.badRequest(`Payment create Error: ${err.message}`);
      }
    }
  },

  async paymentStatus(ctx) {
    const body = ctx.request.body[unparsed]; // Use raw body captured by middleware
    const signature = ctx.request.headers["stripe-signature"];
    console.log("called");
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return ctx.badRequest(`Webhook: ${err.message}`);
    }

    const session = event.data.object;
    const address = session?.customer_details?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];

    const addressString = addressComponents
      .filter((c) => c !== null)
      .join(", ");

    if (event.type === "checkout.session.completed") {
      console.log("session: ", session);
      // update payment status
      await strapi.db.query("api::payment.payment").update({
        where: { id: session?.metadata?.paymentId },
        data: {
          paymentStatus: true,
          address: addressString,
          phone: session?.customer_details?.phone || "",
        },
      });
      await strapi.entityService.update(
        "api::subscription.subscription",
        session?.metadata?.subscriptionId,
        {
          data: {
            subscription_plan: session?.metadata?.subscriptionPlanId,
          },
        }
      );
    }

    ctx.send({
      success: true,
    });
    console.log("Payment status");
  },

  async find(ctx) {
    const user = ctx.state.user;
    let results;
    try {
      if (ctx.state.user.role.name === "Admin") {
        results = await strapi.entityService.findMany("api::payment.payment", {
          ...ctx.query,
        });
      } else {
        results = await strapi.entityService.findMany("api::payment.payment", {
          filters: {
            subscription: {
              users_permissions_user: user.id,
            },
          },
          populate: {
            subscription: { populate: { subscription_plan: true } },
          },
        });
      }
      return await sanitize.contentAPI.output(
        results,
        strapi.contentType("api::payment.payment"),
        {
          auth: ctx.state.auth,
        }
      );
    } catch (err) {
      return ctx.badRequest(`Payment Find Error: ${err.message}`);
    }
  },
  async findOne(ctx) {
    const user = ctx.state.user;
    const id = ctx.params.id;
    const query = { ...ctx.query };
    if (!query.filters) {
      // @ts-ignore
      query.filters = {};
    }
    // @ts-ignore
    query.filters.users_permissions_user = user.id;
    let findOneResults;
    try {
      if (ctx.state.user.role.name === "Admin") {
        findOneResults = await strapi.entityService.findOne(
          "api::payment.payment",
          id,
          {
            ...ctx.query,
          }
        );
      } else {
        findOneResults = await strapi.db.query("api::payment.payment").findOne({
          where: {
            id: id,
            subscription: {
              users_permissions_user: user.id,
            },
          },
          populate: {
            subscription: { populate: { subscription_plan: true } },
          },
        });

        if (!findOneResults) {
          return ctx.unauthorized(
            "You are not authorized to perform this action."
          );
        }
      }
      return await sanitize.contentAPI.output(
        findOneResults,
        strapi.contentType("api::payment.payment"),
        {
          auth: ctx.state.auth,
        }
      );
    } catch (err) {
      return ctx.badRequest(`Payment find one Error: ${err.message}`);
    }
  },
}));
