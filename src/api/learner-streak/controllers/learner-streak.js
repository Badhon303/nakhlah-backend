"use strict";

/**
 * learner-streak controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::learner-streak.learner-streak",
  ({ strapi }) => ({
    // async create(ctx) {
    //   const user = ctx.state.user;
    //   try {
    //     if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
    //       return ctx.badRequest("Invalid request body");
    //     }
    //     const result = await strapi.entityService.create(
    //       "api::learner-streak.learner-streak",
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
    //       strapi.contentType("api::learner-streak.learner-streak"),
    //       {
    //         auth: ctx.state.auth,
    //       }
    //     );
    //   } catch (err) {
    //     return ctx.badRequest(`Learner Streak Create Error: ${err.message}`);
    //   }
    // },

    async find(ctx) {
      const user = ctx.state.user;
      let results;
      const query = { ...ctx.query };
      if (!query.filters) {
        // @ts-ignore
        query.filters = {};
      }
      // @ts-ignore
      query.filters.users_permissions_user = user.id;
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::learner-streak.learner-streak",
            {
              ...ctx.query,
            }
          );
        } else {
          results = await strapi.entityService.findMany(
            "api::learner-streak.learner-streak",
            query
          );
        }
        return await sanitize.contentAPI.output(
          results,
          strapi.contentType("api::learner-streak.learner-streak"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Learner Streak Error: ${err.message}`);
      }
    },

    async delete(ctx) {
      try {
        const user = ctx.state.user;
        const id = ctx.params.id;
        const result = await strapi.entityService.findOne(
          "api::learner-streak.learner-streak",
          id,
          {
            populate: { users_permissions_user: true },
          }
        );
        if (user.id === result.users_permissions_user.id) {
          const deleteResult = await strapi.entityService.delete(
            "api::learner-streak.learner-streak",
            id
          );
          return deleteResult;
        } else {
          ctx.unauthorized("You are not authorized to perform this action.");
        }
      } catch (err) {
        return ctx.badRequest(`Learner Streak Delete Error: ${err.message}`);
      }
    },

    async update(ctx) {
      try {
        const user = ctx.state.user;
        const id = ctx.params.id;
        const result = await strapi.entityService.findOne(
          "api::learner-streak.learner-streak",
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
            "api::learner-streak.learner-streak",
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
            strapi.contentType("api::learner-streak.learner-streak"),
            {
              auth: ctx.state.auth,
            }
          );
        } else {
          ctx.unauthorized("You are not authorized to perform this action.");
        }
      } catch (err) {
        return ctx.badRequest(`Learner Streak Update Error: ${err.message}`);
      }
    },
  })
);
