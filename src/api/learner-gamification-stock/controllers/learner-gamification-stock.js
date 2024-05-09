"use strict";

/**
 * learner-gamification-stock controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::learner-gamification-stock.learner-gamification-stock",
  ({ strapi }) => ({
    // async create(ctx) {
    //   const user = ctx.state.user;
    //   try {
    //     if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
    //       return ctx.badRequest("Invalid request body");
    //     }
    //     // @ts-ignore
    //     let { gamification_type } = ctx.request.body;

    //     const learningJourneyLevelExists = await strapi.db
    //       .query("api::learner-gamification-stock.learner-gamification-stock")
    //       .findOne({
    //         where: {
    //           gamification_type: gamification_type?.connect[0],
    //         },
    //       });
    //     if (learningJourneyLevelExists) {
    //       return ctx.badRequest("Stock type already exists");
    //     }
    //     const result = await strapi.entityService.create(
    //       "api::learner-gamification-stock.learner-gamification-stock",
    //       {
    //         // @ts-ignore
    //         data: {
    //           ...ctx.request.body,
    //           users_permissions_user: user.id,
    //         },
    //         ...ctx.query,
    //       }
    //     );
    //     return await sanitize.contentAPI.output(
    //       result,
    //       strapi.contentType(
    //         "api::learner-gamification-stock.learner-gamification-stock"
    //       ),
    //       {
    //         auth: ctx.state.auth,
    //       }
    //     );
    //   } catch (err) {
    //     return ctx.badRequest(
    //       `Learner Gamification Stock Create Error: ${err.message}`
    //     );
    //   }
    // },

    async find(ctx) {
      const user = ctx.state.user;
      let results;
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::learner-gamification-stock.learner-gamification-stock",
            {
              ...ctx.query,
            }
          );
        } else {
          results = await strapi.entityService.findMany(
            "api::learner-gamification-stock.learner-gamification-stock",
            {
              filters: {
                users_permissions_user: user.id,
              },
              ...ctx.query,
            }
          );
        }
        return await sanitize.contentAPI.output(
          results,
          strapi.contentType(
            "api::learner-gamification-stock.learner-gamification-stock"
          ),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(
          `Learner Gamification Stock Error: ${err.message}`
        );
      }
    },

    async findOne(ctx) {
      const user = ctx.state.user;
      const id = ctx.params.id;
      let findOneResults;
      try {
        if (ctx.state.user.role.name === "Admin") {
          findOneResults = await strapi.entityService.findOne(
            "api::learner-gamification-stock.learner-gamification-stock",
            id,
            {
              ...ctx.query,
            }
          );
        } else {
          const result = await strapi.entityService.findOne(
            "api::learner-gamification-stock.learner-gamification-stock",
            id,
            {
              populate: { users_permissions_user: true },
            }
          );

          if (user.id === result.users_permissions_user.id) {
            findOneResults = await strapi.entityService.findMany(
              "api::learner-gamification-stock.learner-gamification-stock",
              {
                filters: {
                  users_permissions_user: user.id,
                },
                ...ctx.query,
              }
            );
          } else {
            ctx.unauthorized("You are not authorized to perform this action.");
          }
        }
        return await sanitize.contentAPI.output(
          findOneResults,
          strapi.contentType(
            "api::learner-gamification-stock.learner-gamification-stock"
          ),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(
          `Learner Gamification Stock Error: ${err.message}`
        );
      }
    },

    // async delete(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const id = ctx.params.id;
    //     const result = await strapi.entityService.findOne(
    //       "api::learner-gamification-stock.learner-gamification-stock",
    //       id,
    //       {
    //         populate: { users_permissions_user: true },
    //       }
    //     );
    //     if (user.id === result.users_permissions_user.id) {
    //       const deleteResult = await strapi.entityService.delete(
    //         "api::learner-gamification-stock.learner-gamification-stock",
    //         id
    //       );
    //       return deleteResult;
    //     } else {
    //       ctx.unauthorized("You are not authorized to perform this action.");
    //     }
    //   } catch (err) {
    //     return ctx.badRequest(
    //       `Learner Gamification Stock Delete Error: ${err.message}`
    //     );
    //   }
    // },

    async update(ctx) {
      try {
        const user = ctx.state.user;
        const id = ctx.params.id;
        const result = await strapi.entityService.findOne(
          "api::learner-gamification-stock.learner-gamification-stock",
          id,
          {
            populate: { users_permissions_user: true },
          }
        );

        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        if (user.id === result.users_permissions_user.id) {
          const updateResult = await strapi.entityService.update(
            "api::learner-gamification-stock.learner-gamification-stock",
            id,
            {
              data: {
                ...ctx.request.body,
                users_permissions_user: user.id,
              },
              ...ctx.query,
            }
          );
          return await sanitize.contentAPI.output(
            updateResult,
            strapi.contentType(
              "api::learner-gamification-stock.learner-gamification-stock"
            ),
            {
              auth: ctx.state.auth,
            }
          );
        } else {
          ctx.unauthorized("You are not authorized to perform this action.");
        }
      } catch (err) {
        return ctx.badRequest(
          `Learner Gamification Stock Update Error: ${err.message}`
        );
      }
    },
  })
);
