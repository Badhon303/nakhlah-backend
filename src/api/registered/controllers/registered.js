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
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }
        const registeredData = await strapi.db
          .query("api::registered.registered")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (registeredData) {
          return ctx.badRequest("User Info already exists");
        }
        const profileData = await strapi.db
          .query("api::learner-info.learner-info")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (!profileData) {
          return ctx.badRequest("Create Your Profile First");
        }
        const result = await strapi.entityService.create(
          "api::registered.registered",
          {
            // @ts-ignore
            data: {
              ...ctx.request.body,
              users_permissions_user: user.id,
            },
            ...ctx.query,
          }
        );
        try {
          await strapi.entityService.update(
            "api::learner-info.learner-info",
            profileData.id,
            {
              data: {
                registered: result.id,
              },
              ...ctx.query,
            }
          );
        } catch (error) {
          return ctx.badRequest(`Something went wrong`);
        }

        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::registered.registered"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Registration create Error: ${err.message}`);
      }
    },

    async find(ctx) {
      let results;
      const user = ctx.state.user;
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::registered.registered",
            {
              ...ctx.query,
            }
          );
        } else {
          const registeredData = await strapi.db
            .query("api::registered.registered")
            .findOne({
              where: { users_permissions_user: user.id },
            });
          if (!registeredData) {
            return ctx.badRequest("Data not found");
          }
          results = await strapi.entityService.findOne(
            "api::registered.registered",
            registeredData.id,
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
      const user = ctx.state.user;
      try {
        const registeredData = await strapi.db
          .query("api::registered.registered")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (!registeredData) {
          return ctx.badRequest("Data not found");
        }
        const result = await strapi.entityService.delete(
          "api::registered.registered",
          registeredData.id
        );
        return result;
      } catch (err) {
        return ctx.badRequest(`User Profile Delete Error: ${err.message}`);
      }
    },

    async update(ctx) {
      try {
        const user = ctx.state.user;
        const registeredData = await strapi.db
          .query("api::registered.registered")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (!registeredData) {
          return ctx.badRequest("Data not found");
        }

        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        const result = await strapi.entityService.update(
          "api::registered.registered",
          registeredData.id,
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
          strapi.contentType("api::registered.registered"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`User Profile Update Error: ${err.message}`);
      }
    },
  })
);
