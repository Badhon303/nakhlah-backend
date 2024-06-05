"use strict";

/**
 * payment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

const Stripe = require("stripe");

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY environment variable not set");
}

// @ts-ignore
const stripe = new Stripe(stripeSecret, {
  apiVersion: "2022-11-15",
});

module.exports = createCoreController("api::payment.payment", ({ strapi }) => ({
  async initiatePayment(ctx) {
    const user = ctx.state.user;
    // @ts-ignore
    const { amount, subscription_plan } = ctx.request.body;
    console.log("called: ", { amount, subscription_plan });

    if (amount && subscription_plan) {
      const subscriptionPlan = await strapi.db
        .query("api::subscription-plan.subscription-plan")
        .findOne({
          where: { id: subscription_plan },
        });
      if (!subscriptionPlan) {
        return ctx.badRequest("Ask Admin to set a subscription plan");
      }

      const line_items = [];
      // products.forEach((product) => {
      line_items.push({
        price_data: {
          currency: "USD",
          subscription_data: {
            name: subscriptionPlan.planName,
          },
          unit_amount: subscriptionPlan.price.toNumber() * 100,
        },
      });
      // try {
      //   const userSubscriptionData = await strapi.db
      //     .query("api::subscription.subscription")
      //     .findOne({
      //       where: { users_permissions_user: user.id },
      //     });
      //   if (!userSubscriptionData) {
      //     return ctx.badRequest("Something went wrong");
      //   }
      //   // Get "Free" Subscription plans details
      //   const freeSubscriptionPlanDetails = await strapi.db
      //     .query("api::subscription-plan.subscription-plan")
      //     .findOne({
      //       where: { planName: "Free" },
      //     });
      //   if (!freeSubscriptionPlanDetails) {
      //     return ctx.badRequest(
      //       'Ask Admin to set a "Free" subscription plan'
      //     );
      //   }
      //Payment Create
      //   await strapi.entityService.create("api::payment.payment", {
      //     // @ts-ignore
      //     data: {
      //       status: false,
      //       subscription: userSubscriptionData.id,
      //     },
      //     ...ctx.query,
      //   });
      //   //update subscription plan
      //   await strapi.entityService.update(
      //     "api::subscription.subscription",
      //     userSubscriptionData.id,
      //     {
      //       data: {
      //         subscription_plan: subscriptionPlanId
      //           ? subscriptionPlanId
      //           : freeSubscriptionPlanDetails.id,
      //         users_permissions_user: user.id,
      //       },
      //       ...ctx.query,
      //     }
      //   );
      // } catch (err) {
      //   return ctx.badRequest(`Payment create Error: ${err.message}`);
      // }
    }

    // const session = await stripe.checkout.sessions.create({
    //   line_items,
    //   mode: 'payment',
    //   billing_address_collection: 'required',
    //   phone_number_collection: {
    //     enabled: true,
    //   },
    //   success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    //   cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    //   metadata: {
    //     orderId: order.id
    //   },
    // });

    // return NextResponse.json({ url: session.url }, {
    //   headers: corsHeaders
    // });
    console.log("called initiate");
  },

  async paymentStatus(ctx) {
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
