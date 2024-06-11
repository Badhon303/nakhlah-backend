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
    // purchase type
    // 1. Buy Subscription
    // 2. Buy Dates
    // @ts-ignore
    const { data } = ctx.request.body;
    // let userSubscriptionData;

    if (data.purchase === "Buy_Subscription" && data.subscription_plan) {
      const subscriptionPlan = await strapi.db
        .query("api::subscription-plan.subscription-plan")
        .findOne({
          where: { id: data.subscription_plan },
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
          if (
            userSubscriptionData.subscription_plan.id === data.subscription_plan
          ) {
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
            purchaseType: data.purchase,
            subscriptionId: userSubscriptionData.id,
            subscriptionPlanId: subscriptionPlan.id,
          },
        });
        ctx.send({
          success: true,
          url: session.url,
        });
      } catch (err) {
        return ctx.badRequest(`Payment create Error: ${err.message}`);
      }
    } else if (data.purchase === "Buy_Dates" && data.gamification_tx) {
      try {
        //Gent Date package name and price
        const gamificationTxDetails = await strapi.entityService.findOne(
          "api::gamification-tx.gamification-tx",
          data.gamification_tx,
          {
            populate: {
              gamification_tx_amount: true,
            },
          }
        );
        if (
          !gamificationTxDetails ||
          !gamificationTxDetails.gamification_tx_amount.price
        ) {
          return ctx.badRequest("Invalid request");
        }
        //subscribe part
        const payment = await strapi.entityService.create(
          "api::payment.payment",
          {
            // @ts-ignore
            data: {
              paymentStatus: false,
              gamification_tx: data.gamification_tx,
            },
          }
        );
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: gamificationTxDetails?.transactionName,
                },
                unit_amount:
                  gamificationTxDetails?.gamification_tx_amount?.price * 100,
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
            purchaseType: data.purchase,
            userId: user.id,
            gamificationTxId: data.gamification_tx,
            dateAmount: gamificationTxDetails?.gamification_tx_amount?.amount,
          },
        });
        ctx.send({
          success: true,
          url: session.url,
        });
      } catch (err) {
        return ctx.badRequest(`Payment create Error: ${err.message}`);
      }
    } else {
      return ctx.badRequest("Invalid request");
    }
  },

  async paymentStatus(ctx) {
    const body = ctx.request.body[unparsed]; // Use raw body captured by middleware
    const signature = ctx.request.headers["stripe-signature"];
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
      try {
        if (session?.metadata?.purchaseType === "Buy_Subscription") {
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
        } else if (session?.metadata?.purchaseType === "Buy_Dates") {
          // update payment status
          await strapi.db.query("api::payment.payment").update({
            where: { id: session?.metadata?.paymentId },
            data: {
              paymentStatus: true,
              gamification_tx: session?.metadata?.gamificationTxId,
              address: addressString,
              phone: session?.customer_details?.phone || "",
            },
          });
          console.log("check");
          const LearnerGamificationStockDetailsOfDate = await strapi.db
            .query("api::learner-gamification-stock.learner-gamification-stock")
            .findOne({
              where: {
                gamification_type: {
                  typeName: "Date",
                },
                users_permissions_user: session?.metadata?.userId,
              },
            });
          if (!LearnerGamificationStockDetailsOfDate) {
            ctx.send({
              success: false,
            });
          }
          // Getting Gemification Types
          const gamificationTypesDetails = await strapi.entityService.findMany(
            "api::gamification-type.gamification-type"
          );
          if (!gamificationTypesDetails) {
            ctx.send({
              success: false,
            });
          }
          const getDateDetails = gamificationTypesDetails.find(
            (item) => item?.typeName === "Date"
          );
          await strapi.entityService.update(
            "api::learner-gamification-stock.learner-gamification-stock",
            LearnerGamificationStockDetailsOfDate.id,
            {
              data: {
                gamification_type: getDateDetails.id,
                stock:
                  LearnerGamificationStockDetailsOfDate.stock +
                  Number(session?.metadata?.dateAmount),
                users_permissions_user: session?.metadata?.userId,
              },
            }
          );
          ctx.send({
            success: true,
          });
        } else {
          ctx.send({
            success: false,
          });
        }
      } catch (error) {
        ctx.send({
          success: false,
        });
      }
    }
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
