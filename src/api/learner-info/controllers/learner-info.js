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
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        const profileData = await strapi.db
          .query("api::learner-info.learner-info")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (profileData) {
          return ctx.badRequest("User profile already exists");
        }

        // Getting Gemification Types
        const gamificationTypesDetails = await strapi.entityService.findMany(
          "api::gamification-type.gamification-type"
        );
        if (!gamificationTypesDetails) {
          return ctx.badRequest("No details found");
        }
        const getPalmDetails = gamificationTypesDetails.find(
          (item) => item?.typeName === "Palm"
        );
        const getDateDetails = gamificationTypesDetails.find(
          (item) => item?.typeName === "Date"
        );
        const getInjazDetails = gamificationTypesDetails.find(
          (item) => item?.typeName === "Injaz"
        );

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

        // Get the first lesson Id
        const getFirstLesson = await strapi.db
          .query("api::learning-journey-lesson.learning-journey-lesson")
          .findOne({
            where: {
              lessonSequence: 1,
              learning_journey_level: {
                taskSequence: 1,
                learning_journey_unit: {
                  unitSequence: 1,
                  learning_journey: {
                    sequence: 1,
                  },
                },
              },
            },
          });
        console.log("getFirstLesson: ", getFirstLesson);
        // Creating multiple learner-gamification-stock records

        // set first lesson for user

        await strapi.entityService.create(
          "api::learner-gamification-stock.learner-gamification-stock",
          {
            // @ts-ignore
            data: {
              users_permissions_user: user.id,
              gamification_type: getInjazDetails?.id,
            },
          }
        );

        await strapi.entityService.create(
          "api::learner-gamification-stock.learner-gamification-stock",
          {
            // @ts-ignore
            data: {
              users_permissions_user: user.id,
              stock: 5,
              gamification_type: getPalmDetails?.id,
            },
          }
        );

        await strapi.entityService.create(
          "api::learner-gamification-stock.learner-gamification-stock",
          {
            // @ts-ignore
            data: {
              users_permissions_user: user.id,
              stock: 500,
              gamification_type: getDateDetails?.id,
            },
          }
        );

        const progressData = await strapi.db
          .query("api::learner-progress.learner-progress")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (progressData) {
          return ctx.badRequest("Progress ID already exists");
        } else {
          await strapi.entityService.create(
            "api::learner-progress.learner-progress",
            {
              // @ts-ignore
              data: {
                progressId: getFirstLesson ? getFirstLesson.id : 0,
                users_permissions_user: user.id,
              },
            }
          );
        }

        await strapi.entityService.create(
          "api::learner-streak.learner-streak",
          {
            // @ts-ignore
            data: {
              present: true,
              users_permissions_user: user.id,
            },
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
        return ctx.badRequest(`User Profile Create Error: ${err.message}`);
      }
    },

    async find(ctx) {
      let results;
      const user = ctx.state.user;
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::learner-info.learner-info",
            {
              ...ctx.query,
            }
          );
        } else {
          const query = { ...ctx.query };
          if (!query.filters) {
            // @ts-ignore
            query.filters = {};
          }
          // @ts-ignore
          query.filters.users_permissions_user = user.id;
          results = await strapi.entityService.findMany(
            "api::learner-info.learner-info",
            query
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
