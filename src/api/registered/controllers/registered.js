"use strict";

/**
 * registered controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::registered.registered",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      try {
        const profileData = await strapi.db
          .query("api::learner-info.learner-info")
          .findOne({
            where: { users_permissions_user: user.id },
            populate: { registered: true },
          });
        if (profileData.registered) {
          return ctx.badRequest("User Info already exists");
        }
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }
        const result = await strapi.entityService.create(
          "api::registered.registered",
          {
            data: {
              ...ctx.request.body,
              learner_info: profileData.id,
            },
            ...ctx.query,
          }
        );
        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::registered.registered"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`User Profile Create Error: ${err.message}`);
      }
    },

    async find(ctx) {
      let results;
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::registered.registered",
            {
              ...ctx.query,
            }
          );
        } else {
          const profileData = await strapi.db
            .query("api::learner-info.learner-info")
            .findOne({
              where: { users_permissions_user: ctx.state.user.id },
              populate: { registered: true },
            });
          if (!profileData.registered) {
            return ctx.notFound("Resource not found");
          }
          results = await strapi.entityService.findOne(
            "api::registered.registered",
            profileData.registered.id,
            {
              ...ctx.query,
            }
          );
        }
        return await sanitize.contentAPI.output(
          results,
          strapi.contentType("api::registered.registered"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`User Learner info Error: ${err.message}`);
      }
    },

    async delete(ctx) {
      try {
        const user = ctx.state.user;
        const profileData = await strapi.db
          .query("api::learner-info.learner-info")
          .findOne({
            where: { users_permissions_user: user.id },
            populate: { registered: true },
          });
        if (!profileData.registered) {
          return ctx.notFound("Resource not found");
        }
        const result = await strapi.entityService.delete(
          "api::registered.registered",
          profileData.registered.id
        );
        return result;
      } catch (err) {
        return ctx.badRequest(`User Profile Delete Error: ${err.message}`);
      }
    },

    // async update(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const profileData = await strapi.db
    //       .query("api::registered.registered")
    //       .findOne({
    //         where: { users_permissions_user: user.id },
    //       });

    //     if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
    //       return ctx.badRequest("Invalid request body");
    //     }

    //     const result = await strapi.entityService.update(
    //       "api::registered.registered",
    //       profileData.id,
    //       {
    //         data: {
    //           ...ctx.request.body,
    //           users_permissions_user: user.id,
    //         },
    //         ...ctx.query,
    //       }
    //     );
    //     return await sanitize.contentAPI.output(
    //       result,
    //       strapi.contentType("api::registered.registered"),
    //       {
    //         auth: ctx.state.auth,
    //       }
    //     );
    //   } catch (err) {
    //     return ctx.badRequest(`User Profile Update Error: ${err.message}`);
    //   }
    // },
  })
);
