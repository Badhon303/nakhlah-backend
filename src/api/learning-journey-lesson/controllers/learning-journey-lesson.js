"use strict";

/**
 * learning-journey-lesson controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::learning-journey-lesson.learning-journey-lesson",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        // @ts-ignore
        let { data } = ctx.request.body;

        const levelData = await strapi.entityService.findOne(
          "api::learning-journey-level.learning-journey-level",
          data?.learning_journey_level?.connect[0]
        );
        if (!levelData.mysteryBox) {
          const result = await strapi.entityService.create(
            "api::learning-journey-lesson.learning-journey-lesson",
            {
              // @ts-ignore
              data,
              ...ctx.query,
            }
          );
          return await sanitize.contentAPI.output(
            result,
            strapi.contentType(
              "api::learning-journey-lesson.learning-journey-lesson"
            ),
            {
              auth: ctx.state.auth,
            }
          );
        }
        return ctx.badRequest(`Mystery Box cannot have lesson`);
      } catch (err) {
        return ctx.badRequest(`Lesson Create Error: ${err.message}`);
      }
    },
  })
);
