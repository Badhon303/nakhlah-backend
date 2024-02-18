"use strict";

/**
 * question-type controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::question-type.question-type",
  ({ strapi }) => ({
    async delete(ctx) {
      try {
        const { id } = ctx.params;

        const relatedQuestions = await strapi.entityService.findMany(
          "api::question-content.question-content",
          {
            filters: { question_type: id },
          }
        );

        // Use either count or length based on your preference
        if (relatedQuestions.length > 0) {
          return ctx.badRequest(
            "Make sure you removed all questions content using this question type first."
          );
        }
        const result = await strapi.entityService.delete(
          "api::question-type.question-type",
          id
        );
        return result;
      } catch (err) {
        return ctx.badRequest(`User Profile Delete Error: ${err.message}`);
      }
    },
  })
);

// );
