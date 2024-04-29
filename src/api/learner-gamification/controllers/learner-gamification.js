"use strict";

/**
 * learner-gamification controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::learner-gamification.learner-gamification",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      try {
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }
        const result = await strapi.entityService.create(
          "api::learner-gamification.learner-gamification",
          {
            // @ts-ignore
            data: {
              ...ctx.request.body,
              users_permissions_user: user.id,
            },
            ...ctx.query,
          }
        );

        // @ts-ignore
        const { data } = ctx.request.body;

        const gamificationTxDetails = await strapi.entityService.findOne(
          "api::gamification-tx.gamification-tx",
          data.gamification_tx.connect[0],
          {
            populate: ["gamification_tx_type", "gamification_type"],
          }
        );

        const LearnerGamificationStockDetails =
          await strapi.entityService.findMany(
            "api::learner-gamification-stock.learner-gamification-stock",
            {
              filters: {
                gamification_type: {
                  typeName: gamificationTxDetails.gamification_type.typeName,
                },
              },
            }
          );

        const getGamificationStockDetails = await strapi.entityService.findOne(
          "api::learner-gamification-stock.learner-gamification-stock",
          LearnerGamificationStockDetails[0].id,
          {
            populate: { users_permissions_user: true },
          }
        );

        if (user.id === getGamificationStockDetails.users_permissions_user.id) {
          await strapi.entityService.update(
            "api::learner-gamification-stock.learner-gamification-stock",
            LearnerGamificationStockDetails[0].id,
            gamificationTxDetails.gamification_tx_type.typeName === "Add"
              ? {
                  data: {
                    ...ctx.request.body,
                    stock:
                      LearnerGamificationStockDetails[0].stock +
                      gamificationTxDetails.amount,
                    users_permissions_user: user.id,
                  },
                  ...ctx.query,
                }
              : {
                  data: {
                    ...ctx.request.body,
                    stock:
                      LearnerGamificationStockDetails[0].stock -
                      gamificationTxDetails.amount,
                    users_permissions_user: user.id,
                  },
                  ...ctx.query,
                }
          );
        } else {
          ctx.unauthorized("You are not authorized to perform this action.");
        }

        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::learner-gamification.learner-gamification"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(
          `Learner Gamification Create Error: ${err.message}`
        );
      }
    },

    async find(ctx) {
      const user = ctx.state.user;
      try {
        const results = await strapi.entityService.findMany(
          "api::learner-gamification.learner-gamification",
          {
            filters: {
              users_permissions_user: user.id,
            },
            ...ctx.query,
          }
        );

        return await sanitize.contentAPI.output(
          results,
          strapi.contentType("api::learner-gamification.learner-gamification"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Learner Gamification Error: ${err.message}`);
      }
    },

    async delete(ctx) {
      try {
        const user = ctx.state.user;
        const id = ctx.params.id;
        const result = await strapi.entityService.findOne(
          "api::learner-gamification.learner-gamification",
          id,
          {
            populate: { users_permissions_user: true },
          }
        );
        if (user.id === result.users_permissions_user.id) {
          const deleteResult = await strapi.entityService.delete(
            "api::learner-gamification.learner-gamification",
            id
          );
          return deleteResult;
        } else {
          ctx.unauthorized("You are not authorized to perform this action.");
        }
      } catch (err) {
        return ctx.badRequest(
          `Learner Gamification Delete Error: ${err.message}`
        );
      }
    },

    // async update(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const id = ctx.params.id;
    //     const result = await strapi.entityService.findOne(
    //       "api::learner-gamification.learner-gamification",
    //       id,
    //       {
    //         populate: { users_permissions_user: true },
    //       }
    //     );

    //     if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
    //       return ctx.badRequest("Invalid request body");
    //     }

    //     if (user.id === result.users_permissions_user.id) {
    //       const updateResult = await strapi.entityService.update(
    //         "api::learner-gamification.learner-gamification",
    //         id,
    //         {
    //           data: {
    //             ...ctx.request.body,
    //             users_permissions_user: user.id,
    //           },
    //           ...ctx.query,
    //         }
    //       );
    //       return await sanitize.contentAPI.output(
    //         updateResult,
    //         strapi.contentType(
    //           "api::learner-gamification.learner-gamification"
    //         ),
    //         {
    //           auth: ctx.state.auth,
    //         }
    //       );
    //     } else {
    //       ctx.unauthorized("You are not authorized to perform this action.");
    //     }
    //   } catch (err) {
    //     return ctx.badRequest(
    //       `Learner Gamification Update Error: ${err.message}`
    //     );
    //   }
    // },
  })
);
