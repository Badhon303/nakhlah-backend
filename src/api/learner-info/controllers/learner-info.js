"use strict";

/**
 * learner-info controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::learner-info.learner-info",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      try {
        const profileData = await strapi.db
          .query("api::learner-info.learner-info")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (profileData) {
          return ctx.badRequest("User profile already exists");
        }
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }
        const result = await strapi.entityService.create(
          "api::learner-info.learner-info",
          {
            data: {
              ...ctx.request.body,
              users_permissions_user: user.id,
            },
            ...ctx.query,
          }
        );

        const gamificationTypes = [1, 5, 6];

        // Creating multiple learner-gamification-stock records
        gamificationTypes.map(async (id) => {
          await strapi.entityService.create(
            "api::learner-gamification-stock.learner-gamification-stock",
            {
              // @ts-ignore
              data: {
                users_permissions_user: user.id,
                gamification_type: id,
              },
            }
          );
        });

        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::learner-info.learner-info"),
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
            "api::learner-info.learner-info",
            {
              ...ctx.query,
            }
          );
        } else {
          results = await strapi.entityService.findMany(
            "api::learner-info.learner-info",
            {
              filters: {
                users_permissions_user: ctx.state.user.id,
              },
              ...ctx.query,
            }
          );
        }

        if (!results || results.length === 0) {
          return ctx.notFound("No learner information found.");
        }

        return await sanitize.contentAPI.output(
          results,
          strapi.contentType("api::learner-info.learner-info"),
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
          });

        const entries = await strapi.entityService.findMany(
          "api::learner-gamification-stock.learner-gamification-stock",
          {
            filters: {
              users_permissions_user: user.id,
            },
          }
        );

        // Deleting all learner-gamification-stock when the user is deleted
        if (entries.length !== 0) {
          entries.map(async (data) => {
            await strapi.entityService.delete(
              "api::learner-gamification-stock.learner-gamification-stock",
              data.id
            );
          });
        }

        const result = await strapi.entityService.delete(
          "api::learner-info.learner-info",
          profileData.id
        );
        return result;
      } catch (err) {
        return ctx.badRequest(`User Profile Delete Error: ${err.message}`);
      }
    },

    async update(ctx) {
      try {
        const user = ctx.state.user;
        const profileData = await strapi.db
          .query("api::learner-info.learner-info")
          .findOne({
            where: { users_permissions_user: user.id },
          });

        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        const result = await strapi.entityService.update(
          "api::learner-info.learner-info",
          profileData.id,
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
          strapi.contentType("api::learner-info.learner-info"),
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
