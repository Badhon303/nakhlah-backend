"use strict";

/**
 * lesson-practice controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::lesson-practice.lesson-practice",
  ({ strapi }) => ({
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
            "api::lesson-practice.lesson-practice",
            {
              ...ctx.query,
            }
          );
        } else {
          results = await strapi.entityService.findMany(
            "api::lesson-practice.lesson-practice",
            query
          );
        }
        return await sanitize.contentAPI.output(
          results,
          strapi.contentType("api::lesson-practice.lesson-practice"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`User Learner Journey Error: ${err.message}`);
      }
    },

    async delete(ctx) {
      try {
        const user = ctx.state.user;
        const id = ctx.params.id;
        const result = await strapi.entityService.findOne(
          "api::lesson-practice.lesson-practice",
          id,
          {
            populate: { users_permissions_user: true },
          }
        );
        if (user.id === result.users_permissions_user.id) {
          const deleteResult = await strapi.entityService.delete(
            "api::lesson-practice.lesson-practice",
            id
          );
          return deleteResult;
        } else {
          ctx.unauthorized("You are not authorized to perform this action.");
        }
      } catch (err) {
        return ctx.badRequest(`Learner Journey Delete Error: ${err.message}`);
      }
    },
  })
);
