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
      // Fetch the total count of entries
      const count = await strapi.entityService.count(
        "api::learner-streak.learner-streak"
      );
      if (!query.pagination) {
        // @ts-ignore
        query.pagination = {};
      }
      // @ts-ignore
      const { page = 1, pageSize = count } = query.pagination;
      const start = (page - 1) * pageSize;
      const limit = parseInt(pageSize, 10);
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::learner-streak.learner-streak",
            {
              start,
              limit,
              ...ctx.query,
            }
          );
        } else {
          results = await strapi.entityService.findMany(
            "api::learner-streak.learner-streak",
            query
          );
        }
        const sanitizedResults = await sanitize.contentAPI.output(
          results,
          strapi.contentType("api::learner-streak.learner-streak"),
          {
            auth: ctx.state.auth,
          }
        );
        return ctx.send({
          data: sanitizedResults,
          meta: {
            pagination: {
              page: parseInt(page, 10),
              pageSize: limit > count ? count : limit,
              pageCount: Math.ceil(count / limit),
              total: count,
            },
          },
        });
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
