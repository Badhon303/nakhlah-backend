"use strict";

/**
 * learning-journey-level controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::learning-journey-level.learning-journey-level",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        // @ts-ignore
        let { data } = ctx.request.body;
        console.log("data: ", data);
        const result = await strapi.entityService.create(
          "api::learning-journey-level.learning-journey-level",
          {
            // @ts-ignore
            data,
            ...ctx.query,
          }
        );
        console.log("result: ", result);

        if (result && data?.mysteryBox) {
          let lessonData = {
            title: "Mystery Box Lesson",
            lessonSequence: 1,
            learning_journey_level: result.id,
          };
          try {
            await strapi.entityService.create(
              "api::learning-journey-lesson.learning-journey-lesson",
              {
                // @ts-ignore
                data: lessonData,
              }
            );
          } catch (error) {
            return ctx.badRequest(`Mystery Box Lesson Create Error`);
          }
        }
        return await sanitize.contentAPI.output(
          result,
          strapi.contentType(
            "api::learning-journey-level.learning-journey-level"
          ),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Level Create Error: ${err.message}`);
      }
    },
  })
);
