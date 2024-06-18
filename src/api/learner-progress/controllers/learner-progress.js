"use strict";

/**
 * learner-progress controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::learner-progress.learner-progress",
  ({ strapi }) => ({
    // async create(ctx) {
    //   const user = ctx.state.user;
    //   try {
    //     if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
    //       return ctx.badRequest("Invalid request body");
    //     }

    //     const result = await strapi.entityService.create(
    //       "api::learner-progress.learner-progress",
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
    //       strapi.contentType("api::learner-progress.learner-progress"),
    //       {
    //         auth: ctx.state.auth,
    //       }
    //     );
    //   } catch (err) {
    //     return ctx.badRequest(`Learner Progress Create Error: ${err.message}`);
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
        "api::learner-progress.learner-progress"
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
            "api::learner-progress.learner-progress",
            {
              start,
              limit,
              ...ctx.query,
            }
          );
        } else {
          results = await strapi.entityService.findMany(
            "api::learner-progress.learner-progress",
            query
          );
        }
        const sanitizedResults = await sanitize.contentAPI.output(
          results,
          strapi.contentType("api::learner-progress.learner-progress"),
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
        return ctx.badRequest(`Learner Progress Error: ${err.message}`);
      }
    },

    async delete(ctx) {
      try {
        const user = ctx.state.user;
        const id = ctx.params.id;
        const result = await strapi.entityService.findOne(
          "api::learner-progress.learner-progress",
          id,
          {
            populate: { users_permissions_user: true },
          }
        );
        if (user.id === result.users_permissions_user.id) {
          const deleteResult = await strapi.entityService.delete(
            "api::learner-progress.learner-progress",
            id
          );
          return deleteResult;
        } else {
          ctx.unauthorized("You are not authorized to perform this action.");
        }
      } catch (err) {
        return ctx.badRequest(`Learner Progress Delete Error: ${err.message}`);
      }
    },

    async update(ctx) {
      try {
        const user = ctx.state.user;
        // const id = ctx.params.id;
        // const result = await strapi.entityService.findOne(
        //   "api::learner-progress.learner-progress",
        //   id,
        //   {
        //     populate: { users_permissions_user: true },
        //   }
        // );
        const progressData = await strapi.db
          .query("api::learner-progress.learner-progress")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (!progressData) {
          return ctx.badRequest("Data not found");
        }

        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        // if (user.id === result.users_permissions_user.id) {
        //   const updateResult = await strapi.entityService.update(
        //     "api::learner-progress.learner-progress",
        //     id,
        //     {
        //       data: {
        //         ...ctx.request.body,
        //         users_permissions_user: user.id,
        //       },
        //       ...ctx.query,
        //     }
        //   );
        //   return await sanitize.contentAPI.output(
        //     updateResult,
        //     strapi.contentType("api::learner-progress.learner-progress"),
        //     {
        //       auth: ctx.state.auth,
        //     }
        //   );
        // } else {
        //   ctx.unauthorized("You are not authorized to perform this action.");
        // }
        const result = await strapi.entityService.update(
          "api::learner-progress.learner-progress",
          progressData.id,
          {
            data: {
              ...ctx.request.body,
              users_permissions_user: user.id,
            },
            ...ctx.query,
          }
        );
        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::learner-progress.learner-progress"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Learner Progress Update Error: ${err.message}`);
      }
    },
  })
);
