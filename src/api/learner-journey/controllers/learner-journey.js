"use strict";

/**
 * learner-journey controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::learner-journey.learner-journey",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      try {
        // const learningJourneyLessonExists = await strapi.db
        //   .query("api::learner-journey.learner-journey")
        //   .findOne({
        //     where: { users_permissions_user: user.id },
        //   });

        // if (!learnerInfoData) {
        //   return ctx.notFound("No learner information found.");
        // }
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        // @ts-ignore
        let { learning_journey_lesson } = ctx.request.body;

        const learningJourneyLessonExists = await strapi.db
          .query("api::learner-journey.learner-journey")
          .findOne({
            where: {
              learning_journey_lesson: learning_journey_lesson?.connect[0],
            },
          });
        if (learningJourneyLessonExists) {
          return ctx.badRequest("Lesson already completed");
        }
        const result = await strapi.entityService.create(
          "api::learner-journey.learner-journey",
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
          strapi.contentType("api::learner-journey.learner-journey"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Learner Journey Create Error: ${err.message}`);
      }
    },

    async find(ctx) {
      const user = ctx.state.user;
      let results;
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::learner-journey.learner-journey",
            {
              ...ctx.query,
            }
          );
        } else {
          //   const profileData = await strapi.db
          //     .query("api::learner-info.learner-info")
          //     .findOne({
          //       where: { users_permissions_user: ctx.state.user.id },
          //     });
          //   if (!profileData) {
          //     return ctx.notFound("Resource not found");
          //   }
          results = await strapi.entityService.findMany(
            "api::learner-journey.learner-journey",
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
          strapi.contentType("api::learner-journey.learner-journey"),
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
          "api::learner-journey.learner-journey",
          id,
          {
            populate: { users_permissions_user: true },
          }
        );
        // const profileData = await strapi.db
        //   .query("api::learner-info.learner-info")
        //   .findOne({
        //     where: { users_permissions_user: user.id },
        //   });
        // if (!profileData) {
        //   return ctx.notFound("Resource not found");
        // }
        if (user.id === result.users_permissions_user.id) {
          const deleteResult = await strapi.entityService.delete(
            "api::learner-journey.learner-journey",
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
